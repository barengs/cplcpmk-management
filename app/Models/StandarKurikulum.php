<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StandarKurikulum extends Model
{
    protected $fillable = ['nama', 'singkatan', 'dasar_regulasi', 'deskripsi'];

    public function kurikulums()
    {
        return $this->hasMany(Kurikulum::class, 'standar_kurikulum_id');
    }
}
