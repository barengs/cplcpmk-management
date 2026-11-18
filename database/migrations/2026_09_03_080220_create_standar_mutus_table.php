<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('standar_mutus', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // ASIIN, IABEE, SN-Dikti
            $table->string('singkatan')->nullable();
            $table->string('lembaga_penilai')->nullable(); // BAN-PT, ASIIN
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('standar_mutus');
    }
};
