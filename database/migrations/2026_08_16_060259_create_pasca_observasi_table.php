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
        Schema::create('pasca_observasi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->date('hari_tanggal');
            $table->string('nama_guru');
            $table->string('kelas');
            $table->string('mata_pelajaran');
            $table->string('waktu_percakapan');
            $table->string('supervisor')->default('Rusman As\'ari, S.Pd., M.Pd.');
            $table->longText('catatan_refleksi_guru');
            $table->longText('topik_percakapan_catatan');
            $table->longText('rencana_tindak_lanjut');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pasca_observasi');
    }
};
