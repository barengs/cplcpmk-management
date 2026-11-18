<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_studis', function (Blueprint $table) {
            $table->id();
            $table->string('nama_prodi');
            $table->enum('jenjang', ['D3', 'D4', 'S1', 'S2', 'S3'])->default('S1');
            $table->string('nama_jurusan')->nullable();
            $table->string('nama_fakultas')->nullable();
            $table->string('nama_universitas')->nullable();
            $table->string('akreditasi_nasional')->nullable()->comment('A, Baik Sekali, Unggul');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_studis');
    }
};
