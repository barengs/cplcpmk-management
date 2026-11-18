<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RpsAsesmen extends Model
{
    protected $fillable = [
        'rps_mingguan_id', 'indikator_penilaian', 'teknik_penilaian',
        'kriteria_penilaian', 'bobot_persen',
    ];
}
