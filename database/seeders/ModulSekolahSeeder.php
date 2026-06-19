<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Ijin;
use App\Models\JurnalRefleksi;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ModulSekolahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil 1 user acak yang sudah ada di database sebagai penanggung jawab
        $user = User::first();

        if (!$user) {
            $this->command->error('⚠️ Gagal seeding: Belum ada akun di tabel users. Silakan buat 1 akun terlebih dahulu!');
            return;
        }

        $userId = $user->id;
        $now = Carbon::now();

        // ==========================================
        // 1. SEEDER MODUL BERITA & KOMENTAR (KORREKSI TOTAL)
        // ==========================================
        if (Schema::hasTable('berita')) {
            // Bersihkan data lama agar id auto_increment tertata rapi (opsional)
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            DB::table('berita_komentar')->truncate();
            DB::table('berita')->truncate();
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            // Insert Berita sesuai Kolom Asli Anda ('isi', 'views', dll)
            $beritaId = DB::table('berita')->insertGetId([
                'user_id' => $userId,
                'judul' => 'SMK BISA: PELEPASAN SISWA PRAKERIN ANGKATAN 2026',
                'isi' => 'Sebanyak 120 siswa dilepas secara resmi oleh kepala sekolah untuk melaksanakan Praktik Kerja Lapangan (PKL) di berbagai industri mitra selama 6 bulan ke depan.',
                'gambar' => null,
                'lampiran' => null,
                'nama_file_asli' => null,
                'views' => 15,
                'created_at' => $now,
                'updated_at' => $now
            ]);

            // Insert Komentar Berita jika tabel komentar ada
            if (Schema::hasTable('berita_komentar')) {
                DB::table('berita_komentar')->insert([
                    [
                        'berita_id' => $beritaId,
                        'user_id' => $userId,
                        'isi_komentar' => 'Semoga sukses dan lancar PKL-nya untuk seluruh siswa angkatan ini!',
                        'created_at' => $now,
                        'updated_at' => $now
                    ]
                ]);
            }
        }


        // ==========================================
        // 2. SEEDER MODUL KEGIATAN MULTI-KATEGORI (KORREKSI TOTAL)
        // ==========================================
        if (Schema::hasTable('kegiatan')) {
            DB::table('kegiatan')->truncate();

            DB::table('kegiatan')->insert([
                [
                    'user_id' => $userId,
                    'tanggal' => $now->format('Y-m-d'),
                    'kategori' => 'kurikulum',
                    'nama_kegiatan' => 'LOMBA KOMPETENSI SISWA (LKS) BIDANG WEB TECHNOLOGIES',
                    'refleksi' => 'Seleksi tingkat kabupaten untuk menjaring perwakilan siswa terbaik dalam kompetisi pembuatan aplikasi berbasis web.',
                    'bukti_gambar' => null,
                    'lampiran' => null,
                    'nama_file_asli' => null,
                    'status' => 'pending',
                    'created_at' => $now,
                    'updated_at' => $now
                ],
                [
                    'user_id' => $userId,
                    'tanggal' => $now->format('Y-m-d'),
                    'kategori' => 'sarpras',
                    'nama_kegiatan' => 'PEREMAJAAN FASILITAS KOMPUTER LABORATORIUM RPL',
                    'refleksi' => 'Pemasangan RAM baru dan pembersihan debu hardware untuk 20 unit komputer guna menunjang kelancaran praktik coding siswa.',
                    'bukti_gambar' => null,
                    'lampiran' => null,
                    'nama_file_asli' => null,
                    'status' => 'disetujui',
                    'created_at' => $now,
                    'updated_at' => $now
                ],
                [
                    'user_id' => $userId,
                    'tanggal' => $now->format('Y-m-d'),
                    'kategori' => 'humas',
                    'nama_kegiatan' => 'RAPAT PLENO KOMITE SEKOLAH BERSAMA WALI MURID KELAS X',
                    'refleksi' => 'Penyampaian program kerja tahunan sekolah serta penandatanganan kesepakatan bersama terkait pengembangan mutu lulusan.',
                    'bukti_gambar' => null,
                    'lampiran' => null,
                    'nama_file_asli' => null,
                    'status' => 'disetujui',
                    'created_at' => $now,
                    'updated_at' => $now
                ]
            ]);
        }


        // ==========================================
        // 3. SEEDER MODUL IJIN GURU & PEGAWAI
        // ==========================================
        if (Schema::hasTable('ijin')) {
            DB::table('ijin')->truncate();
            Ijin::insert([
                [
                    'user_id' => $userId,
                    'tanggal' => $now->format('Y-m-d'),
                    'jam_mulai' => '08:00:00',
                    'jam_selesai' => '11:30:00',
                    'alasan' => 'Mendampingi siswa delegasi dalam acara LKS Web Design di tingkat Wilayah.',
                    'status' => 'pending',
                    'bukti_foto' => null,
                    'created_at' => $now,
                    'updated_at' => $now
                ],
                [
                    'user_id' => $userId,
                    'tanggal' => $now->addDay()->format('Y-m-d'),
                    'jam_mulai' => null, // Dikosongkan = 1 Hari Penuh otomatis di React
                    'jam_selesai' => null,
                    'alasan' => 'Izin Sakit Terjadwal untuk cek up kesehatan rutin di faskes.',
                    'status' => 'disetujui',
                    'bukti_foto' => null,
                    'created_at' => $now,
                    'updated_at' => $now
                ]
            ]);
        }


        // ==========================================
        // 4. SEEDER MODUL JURNAL REFLEKSI GURU
        // ==========================================
        if (Schema::hasTable('jurnal_refleksi')) {
            DB::table('jurnal_refleksi')->truncate();
            JurnalRefleksi::insert([
                [
                    'user_id' => $userId,
                    'tanggal' => $now->format('Y-m-d'),
                    'kategori' => 'Evaluasi Kelas XI-RPL',
                    'judul_refleksi' => 'EVALUASI KENDALA PEMAHAMAN RELASI DATA ELOQUENT LARAVEL',
                    'isi_refleksi' => 'Siswa masih memerlukan visualisasi diagram sebelum masuk baris kode. Pertemuan selanjutnya akan diawali dengan pemetaan foreign key di papan tulis.',
                    'bukti_file' => null,
                    'created_at' => $now,
                    'updated_at' => $now
                ]
            ]);
        }

        $this->command->info('✅ Mantap! Seluruh data dummy kategori dari Berita sampai Jurnal Refleksi sukses disuntikkan secara presisi!');
    }
}
