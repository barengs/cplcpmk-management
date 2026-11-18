<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RpsAsesmen;
use App\Models\RpsDokumen;
use App\Models\RpsMingguan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Prism\Prism\Facades\Prism;
use Smalot\PdfParser\Parser;

class RpsGeneratorController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $instruksi = $request->input('prompt');

        // Ekstrak teks dari template PDF jika ada
        $templateKonteks = '';
        if ($request->hasFile('file') && $request->file('file')->getClientOriginalExtension() === 'pdf') {
            try {
                $parser = new Parser;
                $pdf = $parser->parseFile($request->file('file')->getRealPath());
                $teksTemplate = trim($pdf->getText());
                if ($teksTemplate) {
                    // Batasi 3000 karakter agar tidak melebihi token limit
                    $teksTemplate = mb_substr($teksTemplate, 0, 3000);
                    $templateKonteks = "\n\nBERIKUT ISI TEMPLATE RPS YANG HARUS DIIKUTI STRUKTURNYA:\n---\n".$teksTemplate."\n---\nIkuti persis kolom, susunan, dan penamaan bagian dari template di atas.\n";
                }
            } catch (\Exception) {
                // Abaikan jika parsing gagal
            }
        }

        try {
            $response = Prism::text()
                ->using('gemini', 'gemini-3.7-flash')
                ->withPrompt(
                    "Anda adalah asisten akademik ahli dalam menyusun Rencana Pembelajaran Semester (RPS) berbasis Outcome-Based Education (OBE).\n".
                    'Instruksi dari dosen: '.$instruksi.$templateKonteks."\n\n".
                    "Tugas Anda:\n".
                    "1. Tampilkan RPS dalam format HTML menggunakan <table>, <tr>, <th>, <td> dengan rowspan/colspan agar mirip template dokumen resmi. Gunakan style inline agar tabel tampil rapi (border, padding, font-size).\n".
                    "2. Setelah HTML selesai, tambahkan data terstruktur dalam format JSON di antara delimiter berikut (WAJIB ADA):\n".
                    "__RPS_DATA_START__\n".
                    "{JSON di sini}\n".
                    "__RPS_DATA_END__\n\n".
                    "Struktur JSON yang diharapkan:\n".
                    "{\"nama_mata_kuliah\":\"...\",\"tahun_akademik\":\"2026/2027\",\"semester_pelaksanaan\":\"Ganjil\",\"tgl_penyusunan\":\"YYYY-MM-DD\",\"mingguans\":[{\"minggu_ke\":1,\"bahan_kajian\":\"...\",\"bentuk_metode_pembelajaran\":\"...\",\"pengalaman_belajar\":\"...\",\"waktu_tm\":100,\"waktu_pt\":120,\"waktu_bm\":120,\"media_pembelajaran\":\"...\",\"asesmens\":[{\"indikator_penilaian\":\"...\",\"teknik_penilaian\":\"...\",\"kriteria_penilaian\":\"...\",\"bobot_persen\":5}]}]}\n\n".
                    'PENTING: Jangan bungkus output dengan blok kode markdown (```).'
                )
                ->generate();

            $fullText = $response->text;

            // Pisahkan HTML dan JSON data
            $htmlPart = $fullText;
            $rpsData = null;

            if (preg_match('/__RPS_DATA_START__\s*([\s\S]*?)\s*__RPS_DATA_END__/', $fullText, $matches)) {
                $htmlPart = trim(preg_replace('/__RPS_DATA_START__[\s\S]*?__RPS_DATA_END__/', '', $fullText));
                $rpsData = json_decode($matches[1], true);
            }

            return response()->json([
                'success' => true,
                'html' => $htmlPart,
                'rps_data' => $rpsData,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghubungi AI Provider: '.$e->getMessage(),
            ], 500);
        }
    }

    public function storeAiDraft(Request $request)
    {
        $request->validate([
            'mk_id' => 'required|exists:mata_kuliahs,id',
            'tahun_akademik' => 'required|string',
            'semester_pelaksanaan' => 'required|in:Ganjil,Genap',
            'tgl_penyusunan' => 'required|date',
            'mingguans' => 'required|array|min:1',
            'mingguans.*.minggu_ke' => 'required|integer',
            'mingguans.*.bahan_kajian' => 'required|string',
            'mingguans.*.bentuk_metode_pembelajaran' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            $rps = RpsDokumen::create([
                'mk_id' => $request->mk_id,
                'tahun_akademik' => $request->tahun_akademik,
                'semester_pelaksanaan' => $request->semester_pelaksanaan,
                'tgl_penyusunan' => $request->tgl_penyusunan,
                'pengembang_id' => auth('api')->id(),
                'status' => 'Draft',
            ]);

            foreach ($request->mingguans as $mingguData) {
                $mingguan = RpsMingguan::create([
                    'rps_id' => $rps->id,
                    'minggu_ke' => $mingguData['minggu_ke'],
                    'bahan_kajian' => $mingguData['bahan_kajian'],
                    'bentuk_metode_pembelajaran' => $mingguData['bentuk_metode_pembelajaran'],
                    'pengalaman_belajar' => $mingguData['pengalaman_belajar'] ?? null,
                    'waktu_tm' => $mingguData['waktu_tm'] ?? 0,
                    'waktu_pt' => $mingguData['waktu_pt'] ?? 0,
                    'waktu_bm' => $mingguData['waktu_bm'] ?? 0,
                    'media_pembelajaran' => $mingguData['media_pembelajaran'] ?? null,
                ]);

                foreach ($mingguData['asesmens'] ?? [] as $asesmen) {
                    RpsAsesmen::create([
                        'rps_mingguan_id' => $mingguan->id,
                        'indikator_penilaian' => $asesmen['indikator_penilaian'] ?? '-',
                        'teknik_penilaian' => $asesmen['teknik_penilaian'] ?? '-',
                        'kriteria_penilaian' => $asesmen['kriteria_penilaian'] ?? null,
                        'bobot_persen' => $asesmen['bobot_persen'] ?? 0,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Draft RPS berhasil disimpan.',
                'rps_id' => $rps->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan: '.$e->getMessage(),
            ], 500);
        }
    }
}
