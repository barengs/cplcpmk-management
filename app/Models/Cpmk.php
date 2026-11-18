<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cpmk extends Model
{
    protected $fillable = ['kode_cpmk', 'mk_id', 'deskripsi_cpmk'];

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'mk_id');
    }

    public function subCpmks()
    {
        return $this->hasMany(SubCpmk::class, 'cpmk_id');
    }

    public function cplProdis()
    {
        return $this->belongsToMany(CplProdi::class, 'map_cpmk_cpl', 'cpmk_id', 'cpl_prodi_id');
    }
}
