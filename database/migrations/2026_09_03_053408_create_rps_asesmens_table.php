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
        Schema::create('rps_asesmens', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('rps_mingguan_id')->constrained('rps_mingguans')->onDelete('cascade');
            $table->text('indikator_penilaian');
            $table->string('teknik_penilaian');
            $table->text('kriteria_penilaian')->nullable();
            $table->decimal('bobot_persen', 5, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rps_asesmens');
    }
};
