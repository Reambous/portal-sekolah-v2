<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany; // 👈 Jangan lupa import ini

class Berita extends Model
{
    protected $table = 'berita';

    protected $guarded = ['id'];

    // Relasi: 1 Berita dimiliki oleh 1 Penulis (User)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // 👇 TAMBAHKAN RELASI INI
    // Relasi: 1 Berita memiliki Banyak Komentar
    public function komentar(): HasMany
    {
        return $this->hasMany(Komentar::class, 'berita_id');
    }
}
