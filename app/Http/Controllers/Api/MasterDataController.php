<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProfilLulusan;
use App\Models\CplProdi;
use App\Models\MataKuliah;

class MasterDataController extends Controller
{
    // Implementasi apiResource untuk Profil Lulusan
    public function index()
    {
        return response()->json(ProfilLulusan::all());
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_pl' => 'required|unique:profil_lulusans',
            'deskripsi' => 'required',
            'kategori' => 'nullable',
            'profesi' => 'nullable'
        ]);

        $pl = ProfilLulusan::create($validated);
        return response()->json($pl, 201);
    }
    
    public function show($id)
    {
        return response()->json(ProfilLulusan::findOrFail($id));
    }
    
    public function update(Request $request, $id)
    {
        $pl = ProfilLulusan::findOrFail($id);
        $validated = $request->validate([
            'kode_pl' => 'required|unique:profil_lulusans,kode_pl,'.$id,
            'deskripsi' => 'required',
            'kategori' => 'nullable',
            'profesi' => 'nullable'
        ]);

        $pl->update($validated);
        return response()->json($pl);
    }
    
    public function destroy($id)
    {
        ProfilLulusan::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    // Endpoint tambahan untuk kebutuhan dropdown RPS Builder
    public function listCpl()
    {
        return response()->json(CplProdi::all());
    }

    public function listMataKuliah()
    {
        return response()->json(MataKuliah::with('rumpunMk')->get());
    }
}
