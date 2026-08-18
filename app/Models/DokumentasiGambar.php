<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumentasiGambar extends Model
{
    protected $fillable = [
        'dokumentasi_id',
        'path',
        'name',
        'size',
        'mime_type',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    protected $appends = ['size_label'];

    public function dokumentasi(): BelongsTo
    {
        return $this->belongsTo(Dokumentasi::class);
    }

    public function getSizeLabelAttribute(): string
    {
        if ($this->size >= 1048576) {
            return number_format($this->size / 1048576, 2).' MB';
        }
        if ($this->size >= 1024) {
            return number_format($this->size / 1024, 1).' KB';
        }

        return $this->size.' B';
    }
}
