<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PascaObservasi extends Model
{
    protected $table = 'pasca_observasi';

    protected $fillable = [
        'user_id',
        'hari_tanggal',
        'nama_guru',
        'kelas',
        'mata_pelajaran',
        'waktu_percakapan',
        'supervisor',
        'catatan_refleksi_guru',
        'topik_percakapan_catatan',
        'rencana_tindak_lanjut',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'hari_tanggal' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
