<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JurnalRefleksi extends Model
{
    use HasFactory;

    protected $table = 'jurnal_refleksi';

    protected $fillable = [
        'user_id',
        'tanggal',
        'kategori',
        'judul_refleksi',
        'isi_refleksi',
        'bukti_file',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
