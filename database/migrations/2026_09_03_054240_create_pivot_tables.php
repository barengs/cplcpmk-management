<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            Schema::create('map_pl_cpl_prodi', function (Blueprint $table) {
                $table->foreignId('pl_id')->constrained('profil_lulusans')->onDelete('cascade');
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
            });
            Schema::create('map_cpl_prodi_sndikti', function (Blueprint $table) {
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
                $table->foreignId('cpl_sn_dikti_id')->constrained('cpl_sn_diktis')->onDelete('cascade');
            });
            Schema::create('map_cpl_bk', function (Blueprint $table) {
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
                $table->foreignId('bk_id')->constrained('bahan_kajians')->onDelete('cascade');
            });
            Schema::create('map_mk_cpl', function (Blueprint $table) {
                $table->id();
                $table->foreignId('mk_id')->constrained('mata_kuliahs')->onDelete('cascade');
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
                $table->decimal('bobot_pembebanan', 5, 2)->default(0);
                $table->timestamps();
            });
            Schema::create('map_cpmk_cpl', function (Blueprint $table) {
                $table->foreignId('cpmk_id')->constrained('cpmks')->onDelete('cascade');
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
            });
            Schema::create('rps_dosen_pengampu', function (Blueprint $table) {
                $table->foreignId('rps_id')->constrained('rps_dokumens')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
        Schema::dropIfExists('rps_dosen_pengampu');
        Schema::dropIfExists('map_cpmk_cpl');
        Schema::dropIfExists('map_mk_cpl');
        Schema::dropIfExists('map_cpl_bk');
        Schema::dropIfExists('map_cpl_prodi_sndikti');
        Schema::dropIfExists('map_pl_cpl_prodi');

    }
};
