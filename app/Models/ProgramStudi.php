<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramStudi extends Model
{
    protected $fillable = ['nama_prodi', 'jenjang', 'nama_jurusan', 'nama_fakultas', 'nama_universitas', 'akreditasi_nasional', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function kurikulums()
    {
        return $this->hasMany(Kurikulum::class, 'program_studi_id');
    }

    public function kurikulumAktif()
    {
        return $this->hasOne(Kurikulum::class, 'program_studi_id')->where('is_active', true);
    }
}
