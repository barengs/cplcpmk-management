<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;

class ProgramStudiController extends Controller
{
    public function index()
    {
        return ProgramStudi::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_prodi' => 'required|string',
            'jenjang' => 'required|in:D3,D4,S1,S2,S3',
            'nama_jurusan' => 'nullable|string',
            'nama_fakultas' => 'nullable|string',
            'nama_universitas' => 'nullable|string',
            'akreditasi_nasional' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        return ProgramStudi::create($data);
    }

    public function show(ProgramStudi $programStudi)
    {
        return $programStudi;
    }

    public function update(Request $request, ProgramStudi $programStudi)
    {
        $data = $request->validate([
            'nama_prodi' => 'sometimes|required|string',
            'jenjang' => 'sometimes|required|in:D3,D4,S1,S2,S3',
            'nama_jurusan' => 'nullable|string',
            'nama_fakultas' => 'nullable|string',
            'nama_universitas' => 'nullable|string',
            'akreditasi_nasional' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $programStudi->update($data);

        return $programStudi;
    }

    public function destroy(ProgramStudi $programStudi)
    {
        $programStudi->delete();

        return response()->noContent();
    }
}
