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
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('berita_seen_at')->nullable();
            $table->timestamp('lomba_seen_at')->nullable();
            $table->timestamp('kesiswaan_seen_at')->nullable();
            $table->timestamp('kurikulum_seen_at')->nullable();
            $table->timestamp('humas_seen_at')->nullable();
            $table->timestamp('sarpras_seen_at')->nullable();
            $table->timestamp('ijin_seen_at')->nullable();
            $table->timestamp('refleksi_seen_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'berita_seen_at',
                'lomba_seen_at',
                'kesiswaan_seen_at',
                'kurikulum_seen_at',
                'humas_seen_at',
                'sarpras_seen_at',
                'ijin_seen_at',
                'refleksi_seen_at',
            ]);
        });
    }
};
