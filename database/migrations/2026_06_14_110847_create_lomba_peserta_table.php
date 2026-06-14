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
        Schema::create('lomba_peserta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kesiswaan_lomba_id')->constrained('kesiswaan_lomba')->cascadeOnDelete();
            $table->string('nama_siswa');
            $table->string('kelas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lomba_peserta');
    }
};
