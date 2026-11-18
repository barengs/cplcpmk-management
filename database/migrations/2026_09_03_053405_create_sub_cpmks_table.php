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
        Schema::create('sub_cpmks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('kode_sub_cpmk');
            $table->foreignId('cpmk_id')->constrained('cpmks')->onDelete('cascade');
            $table->text('deskripsi_sub_cpmk');
            $table->string('level_taksonomi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_cpmks');
    }
};
