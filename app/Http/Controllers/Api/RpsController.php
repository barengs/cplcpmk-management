<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RpsDokumen;
use App\Models\RpsMingguan;
use App\Models\MataKuliah;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class RpsController extends Controller
{
    public function index()
    {
        return response()->json(RpsDokumen::all());
    }

    public function show($id)
    {
        $rps = RpsDokumen::findOrFail($id);
        return response()->json($rps);
    }

    public function generate(Request $request)
    {
        // Builder Manual RPS
        return response()->json(['message' => 'RPS Builder Manual belum diimplementasi sepenuhnya.']);
    }

    public function generateWithAi(Request $request)
    {
        $validated = $request->validate([
            'mk_id' => 'required|exists:mata_kuliahs,id',
            'tahun_akademik' => 'required',
            'semester_pelaksanaan' => 'required|in:Ganjil,Genap',
            'instruksi_tambahan' => 'nullable|string'
        ]);

        $mk = MataKuliah::findOrFail($validated['mk_id']);
        
        $prompt = "Buatkan Rencana Pembelajaran Semester (RPS) untuk Mata Kuliah: {$mk->nama_mk} ({$mk->sks_teori} SKS Teori, {$mk->sks_praktek} SKS Praktek). ";
        if (!empty($validated['instruksi_tambahan'])) {
            $prompt .= "Instruksi tambahan: " . $validated['instruksi_tambahan'] . ". ";
        }
        $prompt .= "Berikan output dalam format JSON yang berisi array 'weekly_plan' (16 pertemuan) dengan field: minggu_ke (integer), bahan_kajian (string), bentuk_metode_pembelajaran (string). Jangan ada teks lain selain JSON.";

        $apiKey = env('AI_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'API Key AI belum dikonfigurasi. Tambahkan AI_API_KEY di file .env'], 500);
        }

        try {
            // Contoh menggunakan OpenAI API (atau bisa disesuaikan ke Gemini/Claude)
            $response = Http::withToken($apiKey)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o',
                    'messages' => [
                        ['role' => 'system', 'content' => 'Anda adalah asisten ahli kurikulum pendidikan tinggi (OBE). Output harus berupa raw JSON (tanpa markdown format).'],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                $generatedData = json_decode($content, true);
                
                DB::beginTransaction();
                $rps = RpsDokumen::create([
                    'mk_id' => $mk->id,
                    'tahun_akademik' => $validated['tahun_akademik'],
                    'semester_pelaksanaan' => $validated['semester_pelaksanaan'],
                    'tgl_penyusunan' => now(),
                    'pengembang_id' => auth('api')->id(),
                    'status' => 'Draft'
                ]);
                
                if (isset($generatedData['weekly_plan'])) {
                    foreach ($generatedData['weekly_plan'] as $minggu) {
                        RpsMingguan::create([
                            'rps_id' => $rps->id,
                            'minggu_ke' => $minggu['minggu_ke'] ?? 1,
                            'bahan_kajian' => $minggu['bahan_kajian'] ?? '-',
                            'bentuk_metode_pembelajaran' => $minggu['bentuk_metode_pembelajaran'] ?? '-',
                        ]);
                    }
                }
                DB::commit();

                return response()->json([
                    'message' => 'RPS berhasil di-generate secara dinamis dengan AI.',
                    'rps_id' => $rps->id,
                    'data' => $generatedData
                ]);
            }

            return response()->json(['error' => 'Gagal menghubungi layanan AI.', 'details' => $response->body()], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
