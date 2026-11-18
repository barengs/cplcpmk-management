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
        Schema::create('rps_dokumens', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('mk_id')->constrained('mata_kuliahs')->onDelete('cascade');
            $table->string('tahun_akademik');
            $table->enum('semester_pelaksanaan', ['Ganjil', 'Genap']);
            $table->date('tgl_penyusunan');
            $table->foreignId('pengembang_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('koordinator_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('kaprodi_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['Draft', 'Reviewed', 'Approved'])->default('Draft');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rps_dokumens');
    }
};
