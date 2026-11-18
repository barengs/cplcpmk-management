<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CplProdi;

class CplController extends Controller {
    public function index() { return response()->json(CplProdi::all()); }
    public function store(Request $request) {
        $validated = $request->validate(['kode_cpl' => 'required|unique:cpl_prodis', 'deskripsi' => 'required', 'kategori' => 'nullable']);
        return response()->json(CplProdi::create($validated), 201);
    }
    public function show($id) { return response()->json(CplProdi::findOrFail($id)); }
    public function update(Request $request, $id) {
        $cpl = CplProdi::findOrFail($id);
        $validated = $request->validate(['kode_cpl' => 'required|unique:cpl_prodis,kode_cpl,'.$id, 'deskripsi' => 'required', 'kategori' => 'nullable']);
        $cpl->update($validated);
        return response()->json($cpl);
    }
    public function destroy($id) { CplProdi::findOrFail($id)->delete(); return response()->json(null, 204); }
}
