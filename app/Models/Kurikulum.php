<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kurikulum extends Model
{
    protected $fillable = [
        'nama_kurikulum', 'tahun_berlaku', 'tahun_berakhir',
        'standar_kurikulum_id', 'program_studi_id', 'visi', 'misi', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function standarKurikulum()
    {
        return $this->belongsTo(StandarKurikulum::class, 'standar_kurikulum_id');
    }

    public function programStudi()
    {
        return $this->belongsTo(ProgramStudi::class, 'program_studi_id');
    }

    public function standarMutus()
    {
        return $this->belongsToMany(StandarMutu::class, 'kurikulum_standar_mutu', 'kurikulum_id', 'standar_mutu_id');
    }

    public function tahunAkademiks()
    {
        return $this->hasMany(TahunAkademik::class, 'kurikulum_id');
    }
}
