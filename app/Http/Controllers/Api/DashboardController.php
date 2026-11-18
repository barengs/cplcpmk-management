<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BahanKajian;
use App\Models\Cpmk;
use App\Models\CplProdi;
use App\Models\CplSnDikti;
use App\Models\MataKuliah;
use App\Models\ProfilLulusan;
use App\Models\RpsDokumen;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalMk = MataKuliah::count();
        $mkMapped = MataKuliah::whereHas('cpls')->count();
        $rpsApproved = RpsDokumen::where('status', 'approved')->count();
        $rpsTotal = RpsDokumen::count();

        return response()->json([
            'metrics' => [
                'profil_lulusan' => ProfilLulusan::count(),
                'cpl_sn_dikti'   => CplSnDikti::count(),
                'cpl_prodi'      => CplProdi::count(),
                'mk_total'       => $totalMk,
                'mk_mapped'      => $mkMapped,
                'rps_approved'   => $rpsApproved,
                'rps_total'      => $rpsTotal,
                'cpmk_total'     => Cpmk::count(),
                'bahan_kajian'   => BahanKajian::count(),
            ],
            'cpl_balance' => CplProdi::withCount([
                'mataKuliahs as mk_count',
            ])->orderBy('kode_cpl')->get(['id', 'kode_cpl', 'deskripsi_cpl']),
            'mata_kuliah' => MataKuliah::with(['cpls', 'cpmks'])
                ->orderBy('semester_plot')
                ->paginate(10),
        ]);
    }
}
