<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::rememberForever('setting_'.$key, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();

            return $setting?->value ?? $default;
        });
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => is_array($value) ? json_encode($value) : (string) $value]
        );

        Cache::forget('setting_'.$key);
    }

    public static function getJson(string $key, mixed $default = null): mixed
    {
        $value = static::get($key, $default);

        if (is_string($value) && str_starts_with(trim($value), '[')) {
            return json_decode($value, true);
        }

        return $value;
    }
}
