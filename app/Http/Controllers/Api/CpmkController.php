<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cpmk;
use Illuminate\Http\Request;

class CpmkController extends Controller
{
    /**
     * List all CPMKs, optionally filtered by mk_id.
     */
    public function index(Request $request)
    {
        $query = Cpmk::with(['mataKuliah', 'cplProdis']);

        if ($request->filled('mk_id')) {
            $query->where('mk_id', $request->mk_id);
        }

        return $query->orderBy('kode_cpmk')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'kode_cpmk' => 'required|string',
            'mk_id' => 'required|exists:mata_kuliahs,id',
            'deskripsi_cpmk' => 'required|string',
            'cpl_prodi_ids' => 'nullable|array',
            'cpl_prodi_ids.*' => 'exists:cpl_prodis,id',
        ]);

        $cplIds = $data['cpl_prodi_ids'] ?? [];
        unset($data['cpl_prodi_ids']);

        $cpmk = Cpmk::create($data);
        $cpmk->cplProdis()->sync($cplIds);

        return $cpmk->load(['mataKuliah', 'cplProdis']);
    }

    public function show(Cpmk $cpmk)
    {
        return $cpmk->load(['mataKuliah', 'cplProdis', 'subCpmks']);
    }

    public function update(Request $request, Cpmk $cpmk)
    {
        $data = $request->validate([
            'kode_cpmk' => 'sometimes|required|string',
            'mk_id' => 'sometimes|required|exists:mata_kuliahs,id',
            'deskripsi_cpmk' => 'sometimes|required|string',
            'cpl_prodi_ids' => 'nullable|array',
            'cpl_prodi_ids.*' => 'exists:cpl_prodis,id',
        ]);

        if (isset($data['cpl_prodi_ids'])) {
            $cpmk->cplProdis()->sync($data['cpl_prodi_ids']);
            unset($data['cpl_prodi_ids']);
        }

        $cpmk->update($data);

        return $cpmk->load(['mataKuliah', 'cplProdis']);
    }

    public function destroy(Cpmk $cpmk)
    {
        $cpmk->delete();

        return response()->noContent();
    }
}
