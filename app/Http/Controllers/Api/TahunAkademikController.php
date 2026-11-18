<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TahunAkademik;
use Illuminate\Http\Request;

class TahunAkademikController extends Controller
{
    public function index()
    {
        return TahunAkademik::with('kurikulum')->orderByDesc('tahun_akademik')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tahun_akademik' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_active' => 'boolean',
            'kurikulum_id' => 'nullable|exists:kurikulums,id',
        ]);

        return TahunAkademik::create($data);
    }

    public function show(TahunAkademik $tahunAkademik)
    {
        return $tahunAkademik->load('kurikulum');
    }

    public function update(Request $request, TahunAkademik $tahunAkademik)
    {
        $tahunAkademik->update($request->validate([
            'tahun_akademik' => 'sometimes|required|string',
            'semester' => 'sometimes|required|in:Ganjil,Genap',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_active' => 'boolean',
            'kurikulum_id' => 'nullable|exists:kurikulums,id',
        ]));

        return $tahunAkademik;
    }

    public function destroy(TahunAkademik $tahunAkademik)
    {
        $tahunAkademik->delete();

        return response()->noContent();
    }
}
