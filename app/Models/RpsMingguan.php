<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RpsMingguan extends Model
{
    protected $fillable = [
        'rps_id', 'minggu_ke', 'sub_cpmk_ids', 'bahan_kajian',
        'bentuk_metode_pembelajaran', 'pengalaman_belajar',
        'waktu_tm', 'waktu_pt', 'waktu_bm', 'media_pembelajaran', 'referensi_ids',
    ];

    public function asesmens()
    {
        return $this->hasMany(RpsAsesmen::class, 'rps_mingguan_id');
    }
}
