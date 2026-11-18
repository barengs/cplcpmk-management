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
        Schema::create('mata_kuliahs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('kode_mk')->unique();
            $table->string('nama_mk');
            $table->foreignId('rumpun_id')->nullable()->constrained('rumpun_mks')->onDelete('set null');
            $table->integer('sks_teori')->default(0);
            $table->integer('sks_praktek')->default(0);
            $table->integer('semester_plot');
            $table->text('deskripsi_singkat')->nullable();
            $table->json('prasyarat_mk_ids')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mata_kuliahs');
    }
};
