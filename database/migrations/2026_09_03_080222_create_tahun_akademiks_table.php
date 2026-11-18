<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tahun_akademiks', function (Blueprint $table) {
            $table->id();
            $table->string('tahun_akademik'); // "2024/2025"
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->boolean('is_active')->default(false);
            $table->foreignId('kurikulum_id')->nullable()->constrained('kurikulums')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tahun_akademiks');
    }
};
