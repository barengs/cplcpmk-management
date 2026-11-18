<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kurikulum;
use App\Models\TahunAkademik;
use Illuminate\Http\Request;

class KurikulumController extends Controller
{
    public function index()
    {
        return Kurikulum::with(['standarKurikulum', 'programStudi', 'standarMutus'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_kurikulum' => 'required|string',
            'tahun_berlaku' => 'required|digits:4|integer',
            'tahun_berakhir' => 'nullable|digits:4|integer',
            'standar_kurikulum_id' => 'nullable|exists:standar_kurikulums,id',
            'program_studi_id' => 'nullable|exists:program_studis,id',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'is_active' => 'boolean',
            'standar_mutu_ids' => 'nullable|array',
            'standar_mutu_ids.*' => 'exists:standar_mutus,id',
        ]);

        $standarMutuIds = $data['standar_mutu_ids'] ?? [];
        unset($data['standar_mutu_ids']);

        $kurikulum = Kurikulum::create($data);
        $kurikulum->standarMutus()->sync($standarMutuIds);

        return $kurikulum->load(['standarKurikulum', 'programStudi', 'standarMutus']);
    }

    public function show(Kurikulum $kurikulum)
    {
        return $kurikulum->load(['standarKurikulum', 'programStudi', 'standarMutus', 'tahunAkademiks']);
    }

    public function update(Request $request, Kurikulum $kurikulum)
    {
        $data = $request->validate([
            'nama_kurikulum' => 'sometimes|required|string',
            'tahun_berlaku' => 'sometimes|required|digits:4|integer',
            'tahun_berakhir' => 'nullable|digits:4|integer',
            'standar_kurikulum_id' => 'nullable|exists:standar_kurikulums,id',
            'program_studi_id' => 'nullable|exists:program_studis,id',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'is_active' => 'boolean',
            'standar_mutu_ids' => 'nullable|array',
            'standar_mutu_ids.*' => 'exists:standar_mutus,id',
        ]);

        if (isset($data['standar_mutu_ids'])) {
            $kurikulum->standarMutus()->sync($data['standar_mutu_ids']);
            unset($data['standar_mutu_ids']);
        }

        $kurikulum->update($data);

        return $kurikulum->load(['standarKurikulum', 'programStudi', 'standarMutus']);
    }

    public function destroy(Kurikulum $kurikulum)
    {
        $kurikulum->delete();

        return response()->noContent();
    }

    /**
     * Return the currently active kurikulum with all relations.
     * Used by the navbar to render dynamic context labels.
     */
    public function aktif()
    {
        $kurikulum = Kurikulum::with(['standarKurikulum', 'standarMutus', 'programStudi'])
            ->where('is_active', true)
            ->first();

        $tahunAkademik = TahunAkademik::where('is_active', true)->first();

        return response()->json([
            'kurikulum' => $kurikulum,
            'tahun_akademik' => $tahunAkademik,
        ]);
    }
}
