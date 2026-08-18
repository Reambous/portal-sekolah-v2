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
        Schema::create('dokumentasi_gambar', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dokumentasi_id');
            $table->string('path', 500);
            $table->string('name', 255);
            $table->unsignedBigInteger('size');
            $table->string('mime_type', 100)->nullable();
            $table->timestamps();

            $table->foreign('dokumentasi_id')->references('id')->on('dokumentasi')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumentasi_gambar');
    }
};
