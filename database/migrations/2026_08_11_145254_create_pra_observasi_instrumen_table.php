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
        Schema::create('pra_observasi_instrumen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('jenjang');
            $table->string('mata_pelajaran');
            $table->string('kelas');
            $table->string('judul_perencanaan');
            $table->json('skor')->nullable();
            $table->json('komentar')->nullable();
            $table->text('kelebihan')->nullable();
            $table->text('hal_ditingkatkan')->nullable();
            $table->text('rekomendasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pra_observasi_instrumen');
    }
};
