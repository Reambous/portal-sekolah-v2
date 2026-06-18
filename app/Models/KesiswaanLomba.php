<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KesiswaanLomba extends Model
{
    protected $table = 'kesiswaan_lomba';

    // Menggunakan guarded kosong artinya semua kolom (termasuk peserta, refleksi, dll) diizinkan untuk disimpan
    protected $guarded = [];

    protected $casts = [
        'peserta' => 'array',
    ];

    // Relasi ke User (Guru yang menginput lomba)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
