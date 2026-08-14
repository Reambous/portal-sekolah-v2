<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('observasi_pelaksanaan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('hari_tanggal');
            $table->string('nama_guru');
            $table->string('kelas_semester');
            $table->string('mata_pelajaran');
            $table->string('pemberi_umpan_balik');
            $table->json('bukti')->nullable();
            $table->json('catatan')->nullable();
            $table->json('refleksi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('observasi_pelaksanaan');
    }
};
