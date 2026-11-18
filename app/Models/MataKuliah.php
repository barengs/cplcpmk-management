<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    protected $fillable = [
        'kode_mk', 'nama_mk', 'rumpun_id', 'sks_teori',
        'sks_praktek', 'semester_plot', 'deskripsi_singkat', 'prasyarat_mk_ids',
    ];

    protected $casts = ['prasyarat_mk_ids' => 'array'];

    public function rumpun()
    {
        return $this->belongsTo(RumpunMk::class, 'rumpun_id');
    }

    /**
     * Many-to-Many ke CPL Prodi via map_mk_cpl.
     * Pivot menyimpan bobot_pembebanan.
     */
    public function cpls()
    {
        return $this->belongsToMany(CplProdi::class, 'map_mk_cpl', 'mk_id', 'cpl_prodi_id')
            ->withPivot('bobot_pembebanan')
            ->withTimestamps();
    }

    public function cpmks()
    {
        return $this->hasMany(Cpmk::class, 'mk_id');
    }
}
