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
        Schema::create('rps_mingguans', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('rps_id')->constrained('rps_dokumens')->onDelete('cascade');
            $table->integer('minggu_ke');
            $table->json('sub_cpmk_ids')->nullable();
            $table->text('bahan_kajian');
            $table->string('bentuk_metode_pembelajaran');
            $table->text('pengalaman_belajar')->nullable();
            $table->integer('waktu_tm')->default(0);
            $table->integer('waktu_pt')->default(0);
            $table->integer('waktu_bm')->default(0);
            $table->string('media_pembelajaran')->nullable();
            $table->json('referensi_ids')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rps_mingguans');
    }
};
