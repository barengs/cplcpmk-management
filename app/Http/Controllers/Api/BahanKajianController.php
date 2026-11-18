<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BahanKajian;

class BahanKajianController extends Controller {
    public function index() { return response()->json(BahanKajian::all()); }
    public function store(Request $request) {
        $validated = $request->validate(['kode_bk' => 'required|unique:bahan_kajians', 'nama_bk' => 'required', 'deskripsi' => 'nullable']);
        return response()->json(BahanKajian::create($validated), 201);
    }
    public function show($id) { return response()->json(BahanKajian::findOrFail($id)); }
    public function update(Request $request, $id) {
        $bk = BahanKajian::findOrFail($id);
        $validated = $request->validate(['kode_bk' => 'required|unique:bahan_kajians,kode_bk,'.$id, 'nama_bk' => 'required', 'deskripsi' => 'nullable']);
        $bk->update($validated);
        return response()->json($bk);
    }
    public function destroy($id) { BahanKajian::findOrFail($id)->delete(); return response()->json(null, 204); }
}
