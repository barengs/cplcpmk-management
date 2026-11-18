<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kurikulum_standar_mutu', function (Blueprint $table) {
            $table->foreignId('kurikulum_id')->constrained('kurikulums')->onDelete('cascade');
            $table->foreignId('standar_mutu_id')->constrained('standar_mutus')->onDelete('cascade');
            $table->primary(['kurikulum_id', 'standar_mutu_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kurikulum_standar_mutu');
    }
};
