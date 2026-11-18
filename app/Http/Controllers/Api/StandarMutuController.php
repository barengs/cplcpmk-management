<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StandarMutu;
use Illuminate\Http\Request;

class StandarMutuController extends Controller
{
    public function index()
    {
        return StandarMutu::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            'singkatan' => 'nullable|string',
            'lembaga_penilai' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]);

        return StandarMutu::create($data);
    }

    public function show(StandarMutu $standarMutu)
    {
        return $standarMutu;
    }

    public function update(Request $request, StandarMutu $standarMutu)
    {
        $standarMutu->update($request->validate([
            'nama' => 'sometimes|required|string',
            'singkatan' => 'nullable|string',
            'lembaga_penilai' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]));

        return $standarMutu;
    }

    public function destroy(StandarMutu $standarMutu)
    {
        $standarMutu->delete();

        return response()->noContent();
    }
}
