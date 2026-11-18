<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MataKuliah;

class MataKuliahController extends Controller {
    public function index() { return response()->json(MataKuliah::all()); }
    public function store(Request $request) {
        $validated = $request->validate([
            'kode_mk' => 'required|unique:mata_kuliahs', 
            'nama_mk' => 'required', 
            'sks_teori' => 'required|integer',
            'sks_praktek' => 'required|integer',
            'semester' => 'required|integer',
            'rumpun_mk_id' => 'nullable|exists:rumpun_mks,id',
            'deskripsi_mk' => 'nullable'
        ]);
        return response()->json(MataKuliah::create($validated), 201);
    }
    public function show($id) { return response()->json(MataKuliah::findOrFail($id)); }
    public function update(Request $request, $id) {
        $mk = MataKuliah::findOrFail($id);
        $validated = $request->validate([
            'kode_mk' => 'required|unique:mata_kuliahs,kode_mk,'.$id, 
            'nama_mk' => 'required', 
            'sks_teori' => 'required|integer',
            'sks_praktek' => 'required|integer',
            'semester' => 'required|integer',
            'rumpun_mk_id' => 'nullable|exists:rumpun_mks,id',
            'deskripsi_mk' => 'nullable'
        ]);
        $mk->update($validated);
        return response()->json($mk);
    }
    public function destroy($id) { MataKuliah::findOrFail($id)->delete(); return response()->json(null, 204); }
}
