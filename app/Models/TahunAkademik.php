<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TahunAkademik extends Model
{
    protected $fillable = ['tahun_akademik', 'semester', 'tanggal_mulai', 'tanggal_selesai', 'is_active', 'kurikulum_id'];

    protected $casts = ['is_active' => 'boolean'];

    public function kurikulum()
    {
        return $this->belongsTo(Kurikulum::class, 'kurikulum_id');
    }
}
