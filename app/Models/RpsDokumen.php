<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RpsDokumen extends Model
{
    protected $fillable = [
        'mk_id', 'tahun_akademik', 'semester_pelaksanaan',
        'tgl_penyusunan', 'pengembang_id', 'koordinator_id', 'kaprodi_id', 'status',
    ];

    public function mingguans()
    {
        return $this->hasMany(RpsMingguan::class, 'rps_id');
    }

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'mk_id');
    }
}
