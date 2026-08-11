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
        Schema::create('pra_observasi_catatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('hari_tanggal');
            $table->string('nama_guru');
            $table->string('mata_pelajaran');
            $table->string('kelas');
            $table->string('waktu');
            $table->string('nama_supervisor');
            $table->text('tujuan_pembelajaran');
            $table->text('area_pengembangan');
            $table->text('strategi');
            $table->text('catatan_khusus');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pra_observasi_catatan');
    }
};
