<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CplProdi extends Model
{
    protected $fillable = [
        'kode_cpl',
        'deskripsi_cpl',
        'referensi_cpl_sn_id',
    ];

    public function cplSnDikti()
    {
        return $this->belongsTo(CplSnDikti::class, 'referensi_cpl_sn_id');
    }

    public function mataKuliahs()
    {
        return $this->belongsToMany(MataKuliah::class, 'map_mk_cpl', 'cpl_prodi_id', 'mk_id')
            ->withPivot('bobot_pembebanan')
            ->withTimestamps();
    }

    public function cpmks()
    {
        return $this->belongsToMany(Cpmk::class, 'map_cpmk_cpl', 'cpl_prodi_id', 'cpmk_id');
    }
}
