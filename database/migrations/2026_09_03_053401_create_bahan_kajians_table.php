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
        Schema::create('bahan_kajians', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('kode_bk')->unique();
            $table->string('nama_bahan_kajian');
            $table->text('deskripsi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bahan_kajians');
    }
};
