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
        Schema::create('rps_rubriks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('rps_id')->constrained('rps_dokumens')->onDelete('cascade');
            $table->enum('tipe_tugas', ['Individu', 'Kelompok', 'Proyek']);
            $table->string('dimensi_penilaian');
            $table->text('skala_1')->nullable();
            $table->text('skala_2')->nullable();
            $table->text('skala_3')->nullable();
            $table->text('skala_4')->nullable();
            $table->text('skala_5')->nullable();
            $table->decimal('bobot', 5, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rps_rubriks');
    }
};
