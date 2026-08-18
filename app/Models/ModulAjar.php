<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModulAjar extends Model
{
    protected $fillable = [
        'user_id',
        'judul',
        'mata_pelajaran',
        'kelas_semester',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'keterangan',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'file_size' => 'integer',
    ];

    protected $appends = ['size_label'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getSizeLabelAttribute(): string
    {
        if ($this->file_size >= 1048576) {
            return number_format($this->file_size / 1048576, 2).' MB';
        }
        if ($this->file_size >= 1024) {
            return number_format($this->file_size / 1024, 1).' KB';
        }

        return $this->file_size.' B';
    }
}
