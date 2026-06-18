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
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // Siapa penanggung jawab/yang input
            $table->date('tanggal');
            $table->enum('kategori', ['kesiswaan', 'kurikulum', 'humas', 'sarpras', 'umum']);
            $table->string('nama_kegiatan');
            $table->text('refleksi'); // Laporan atau catatan evaluasi kegiatan

            // 👇 KITA TAMBAHKAN KEBUTUHAN UTK FILE DAN FOTO DOKUMENTASI
            $table->string('bukti_gambar')->nullable(); // Foto dokumentasi kegiatan
            $table->string('lampiran')->nullable(); // File proposal/rundown PDF/Word
            $table->string('nama_file_asli')->nullable();

            $table->enum('status', ['pending', 'disetujui'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};
