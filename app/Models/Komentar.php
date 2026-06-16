<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Komentar extends Model
{
    // Beri tahu Laravel nama tabel aslinya
    protected $table = 'berita_komentar';

    // Izinkan semua kolom diisi massal kecuali ID
    protected $guarded = ['id'];

    // Relasi: 1 Komentar dimiliki oleh 1 User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: 1 Komentar menempel pada 1 Berita
    public function berita(): BelongsTo
    {
        return $this->belongsTo(Berita::class);
    }
}
