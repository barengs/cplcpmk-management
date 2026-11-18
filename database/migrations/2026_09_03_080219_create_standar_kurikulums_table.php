<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('standar_kurikulums', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // OBE, KKNI, KBK
            $table->string('singkatan')->nullable();
            $table->string('dasar_regulasi')->nullable(); // Permendikbud 53/2023
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('standar_kurikulums');
    }
};
