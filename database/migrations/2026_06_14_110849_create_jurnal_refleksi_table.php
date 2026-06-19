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
        Schema::create('jurnal_refleksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('tanggal');
            $table->string('kategori'); // Misal: Evaluasi Kelas, Pengembangan Diri, Diskusi Sejawat
            $table->string('judul_refleksi');
            $table->text('isi_refleksi');
            $table->string('bukti_file')->nullable(); // 👈 Tambahkan ini agar bisa upload foto kelas/PDF modul
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnal_refleksi');
    }
};
