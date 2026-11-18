<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StandarKurikulum;
use Illuminate\Http\Request;

class StandarKurikulumController extends Controller
{
    public function index()
    {
        return StandarKurikulum::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            'singkatan' => 'nullable|string',
            'dasar_regulasi' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]);

        return StandarKurikulum::create($data);
    }

    public function show(StandarKurikulum $standarKurikulum)
    {
        return $standarKurikulum;
    }

    public function update(Request $request, StandarKurikulum $standarKurikulum)
    {
        $standarKurikulum->update($request->validate([
            'nama' => 'sometimes|required|string',
            'singkatan' => 'nullable|string',
            'dasar_regulasi' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]));

        return $standarKurikulum;
    }

    public function destroy(StandarKurikulum $standarKurikulum)
    {
        $standarKurikulum->delete();

        return response()->noContent();
    }
}
