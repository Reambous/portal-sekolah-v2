<?php

namespace App\Concerns;

use App\Models\Berita;
use App\Models\Ijin;
use App\Models\JurnalRefleksi;
use App\Models\Kegiatan;
use App\Models\KesiswaanLomba;
use App\Models\PraObservasiCatatan;
use App\Models\PraObservasiInstrumen;
use App\Models\User;
use Carbon\Carbon;

trait HasNotificationBadges
{
    /**
     * Hitung jumlah upload baru (semua status) per modul
     * sejak terakhir kali user membuka modul tersebut.
     *
     * @return array<string, int>
     */
    public function badgesFor(?User $user): array
    {
        if (! $user) {
            return [];
        }

        $columns = $this->moduleColumns();

        $badges = [];
        foreach ($columns as $key => $column) {
            $badges[$key] = $this->countNew($key, $user->{$column}, $user);
        }

        return $badges;
    }

    /**
     * Tandai modul yang sedang dibuka sebagai "sudah dilihat".
     */
    public function markSeen(?User $user, string $path): void
    {
        if (! $user) {
            return;
        }

        $map = [
            'berita' => 'berita',
            'kesiswaan/lomba' => 'lomba',
            'kesiswaan/kegiatan' => 'kesiswaan',
            'kurikulum' => 'kurikulum',
            'humas' => 'humas',
            'sarpras' => 'sarpras',
            'ijin' => 'ijin',
            'jurnal-refleksi' => 'refleksi',
            'observasi' => 'observasi',
        ];

        $columns = $this->moduleColumns();

        foreach ($map as $prefix => $key) {
            if (str_starts_with($path, $prefix)) {
                $user->forceFill([$columns[$key] => now()])->save();
                break;
            }
        }
    }

    /**
     * Daftar kolom "terakhir dilihat" untuk tiap modul.
     *
     * @return array<string, string>
     */
    protected function moduleColumns(): array
    {
        return [
            'berita' => 'berita_seen_at',
            'lomba' => 'lomba_seen_at',
            'kesiswaan' => 'kesiswaan_seen_at',
            'kurikulum' => 'kurikulum_seen_at',
            'humas' => 'humas_seen_at',
            'sarpras' => 'sarpras_seen_at',
            'ijin' => 'ijin_seen_at',
            'refleksi' => 'refleksi_seen_at',
            'observasi' => 'observasi_seen_at',
        ];
    }

    protected function countNew(string $module, mixed $seenAt, User $user): int
    {
        $since = $seenAt ? Carbon::parse($seenAt) : now()->subDays(30);

        // Observasi: gabungan dua tabel (catatan + instrumen)
        // Guru hanya lihat data miliknya sendiri, admin lihat semua
        if ($module === 'observasi') {
            if ($user->role !== 'admin') {
                return PraObservasiCatatan::where('user_id', $user->id)->where('created_at', '>', $since)->count()
                    + PraObservasiInstrumen::where('user_id', $user->id)->where('created_at', '>', $since)->count();
            }
            return PraObservasiCatatan::where('created_at', '>', $since)->count()
                + PraObservasiInstrumen::where('created_at', '>', $since)->count();
        }

        $query = match ($module) {
            'berita' => Berita::query(),
            'lomba' => KesiswaanLomba::query(),
            'kesiswaan' => Kegiatan::where('kategori', 'kesiswaan'),
            'kurikulum' => Kegiatan::where('kategori', 'kurikulum'),
            'humas' => Kegiatan::where('kategori', 'humas'),
            'sarpras' => Kegiatan::where('kategori', 'sarpras'),
            'ijin' => Ijin::query(),
            'refleksi' => JurnalRefleksi::query(),
            default => throw new \LogicException("Modul notifikasi tidak dikenal: {$module}"),
        };

        // Khusus ijin bersifat pribadi: guru hanya melihat pengajuan miliknya sendiri.
        if ($module === 'ijin' && $user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        // Khusus refleksi: guru hanya lihat data miliknya sendiri, admin lihat semua
        if ($module === 'refleksi' && $user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        return $query->where('created_at', '>', $since)->count();
    }
}
