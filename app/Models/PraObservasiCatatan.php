<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PraObservasiCatatan extends Model
{
    protected $table = 'pra_observasi_catatan';

    protected $guarded = [];

    protected $casts = [
        'user_id' => 'integer',
        'hari_tanggal' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
