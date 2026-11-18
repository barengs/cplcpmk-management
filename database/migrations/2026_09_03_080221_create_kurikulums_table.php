<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kurikulums', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kurikulum'); // "Kurikulum Informatika 2024"
            $table->year('tahun_berlaku');
            $table->year('tahun_berakhir')->nullable();
            $table->foreignId('standar_kurikulum_id')->nullable()->constrained('standar_kurikulums')->onDelete('set null');
            $table->foreignId('program_studi_id')->nullable()->constrained('program_studis')->onDelete('set null');
            $table->text('visi')->nullable();
            $table->text('misi')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kurikulums');
    }
};
