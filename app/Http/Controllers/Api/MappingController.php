<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CplProdi;
use App\Models\MataKuliah;

class MappingController extends Controller {
    public function getCplMk()
    {
        $cpl = CplProdi::all();
        $mk = MataKuliah::with('cpls')->get();

        return response()->json([
            'cpls'        => $cpl,
            'mata_kuliah' => $mk->map(function ($item) {
                $mappedCpls = [];
                foreach ($item->cpls as $c) {
                    $mappedCpls[$c->id] = $c->pivot->bobot_pembebanan;
                }

                return [
                    'id'          => $item->id,
                    'kode_mk'     => $item->kode_mk,
                    'nama_mk'     => $item->nama_mk,
                    'sks_teori'   => $item->sks_teori,
                    'sks_praktek' => $item->sks_praktek,
                    'semester'    => $item->semester_plot,
                    'mappings'    => $mappedCpls,
                ];
            }),
        ]);
    }

    public function saveCplMk(Request $request) {
        $validated = $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'cpl_id' => 'required|exists:cpl_prodis,id',
            'tingkat_penekanan' => 'required|in:M,S,m'
        ]);

        $mk = MataKuliah::findOrFail($validated['mata_kuliah_id']);
        
        // Use syncWithoutDetaching to update or insert pivot
        $mk->cpls()->syncWithoutDetaching([
            $validated['cpl_id'] => ['tingkat_penekanan' => $validated['tingkat_penekanan']]
        ]);

        return response()->json(['message' => 'Mapping tersimpan']);
    }

    public function removeCplMk(Request $request) {
        $validated = $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'cpl_id' => 'required|exists:cpl_prodis,id',
        ]);

        $mk = MataKuliah::findOrFail($validated['mata_kuliah_id']);
        $mk->cpls()->detach($validated['cpl_id']);

        return response()->json(['message' => 'Mapping dihapus']);
    }
}
