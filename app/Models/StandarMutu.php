<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StandarMutu extends Model
{
    protected $fillable = ['nama', 'singkatan', 'lembaga_penilai', 'deskripsi'];

    public function kurikulums()
    {
        return $this->belongsToMany(Kurikulum::class, 'kurikulum_standar_mutu', 'standar_mutu_id', 'kurikulum_id');
    }
}
