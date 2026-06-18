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
        Schema::create('kesiswaan_lomba', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('tanggal');
            $table->string('jenis_lomba'); // Nama Lomba

            // 👇 KITA TAMBAHKAN KOLOM INI
            $table->text('peserta'); // Untuk menyimpan data: "Budi (XI-A), Andi (XI-A), Siti (XI-B)"
            $table->string('bukti_gambar')->nullable(); // Opsional
            $table->string('prestasi');
            $table->text('refleksi');
            $table->enum('status', ['pending', 'disetujui'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kesiswaan_lomba');
    }
};
