<?php

namespace Database\Seeders;

use App\Models\JurnalRefleksi;
use App\Models\ModulAjar;
use App\Models\ObservasiPelaksanaan;
use App\Models\PascaObservasi;
use App\Models\PraObservasiCatatan;
use App\Models\PraObservasiInstrumen;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Super Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'admin',
                'nip' => '00000000',
                'password' => Hash::make('admin'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Akun Guru 1
        $guruAnas = User::firstOrCreate(
            ['email' => 'anas@gmail.com'],
            [
                'name' => 'Anas Syihabudin, S.Pd',
                'nip' => '198001012005011001',
                'password' => Hash::make('guru123'),
                'role' => 'guru',
                'email_verified_at' => now(),
            ]
        );

        // 3. Akun Guru 2
        $guruHaidar = User::firstOrCreate(
            ['email' => 'haidar@gmail.com'],
            [
                'name' => 'Muhammad Haidar, M.Pd',
                'nip' => '198502022010012002',
                'password' => Hash::make('guru123'),
                'role' => 'guru',
                'email_verified_at' => now(),
            ]
        );

        $supervisor = 'Rusman As\'ari, S.Pd., M.Pd.';

        // ===================== PRA OBSERVASI (Form A, Catatan) =====================
        $anasCatatan = PraObservasiCatatan::firstOrCreate(
            ['user_id' => $guruAnas->id, 'nama_guru' => $guruAnas->name],
            [
                'hari_tanggal' => now()->subDays(3),
                'mata_pelajaran' => 'IPA',
                'kelas' => 'VIII D',
                'waktu' => '09.00 - 10.00',
                'nama_supervisor' => $supervisor,
                'tujuan_pembelajaran' => 'Menjelaskan konsep fotosintesis beserta faktor yang memengaruhinya.',
                'area_pengembangan' => 'Penggunaan media pembelajaran digital yang lebih interaktif.',
                'strategi' => 'Menerapkan model pembelajaran berbasis masalah dengan media video animasi.',
                'catatan_khusus' => 'Perlu pendampingan dalam pengelolaan waktu diskusi kelompok.',
            ]
        );

        $haidarCatatan = PraObservasiCatatan::firstOrCreate(
            ['user_id' => $guruHaidar->id, 'nama_guru' => $guruHaidar->name],
            [
                'hari_tanggal' => now()->subDays(2),
                'mata_pelajaran' => 'Matematika',
                'kelas' => 'VII C',
                'waktu' => '10.30 - 11.30',
                'nama_supervisor' => $supervisor,
                'tujuan_pembelajaran' => 'Menyelesaikan operasi hitung bilangan bulat dengan benar.',
                'area_pengembangan' => 'Pemanfaatan alat peraga untuk meningkatkan pemahaman konsep.',
                'strategi' => 'Pembelajaran kooperatif dengan pendekatan kontekstual.',
                'catatan_khusus' => 'Murid antusias, perlu penguatan pada sesi refleksi.',
            ]
        );

        // ===================== PRA OBSERVASI (Form B, Instrumen) =====================
        $skorAnas = [];
        $komentarAnas = [];
        foreach (PraObservasiInstrumen::itemSkala() as $item) {
            $skorAnas[$item['kode']] = random_int(3, 4);
            $komentarAnas[$item['kode']] = null;
        }
        PraObservasiInstrumen::firstOrCreate(
            ['user_id' => $guruAnas->id, 'judul_perencanaan' => 'Perencanaan Pembelajaran IPA - Fotosintesis'],
            [
                'jenjang' => 'SMP',
                'mata_pelajaran' => 'IPA',
                'kelas' => 'VIII D',
                'skor' => $skorAnas,
                'komentar' => $komentarAnas,
                'kelebihan' => 'Langkah pembelajaran runtut dan berbasis masalah.',
                'hal_ditingkatkan' => 'Asesmen awal perlu lebih variatif.',
                'rekomendasi' => 'Tambahkan instrumen asesmen awal yang lebih beragam.',
            ]
        );

        // ===================== OBSERVASI PELAKSANAAN (Form C) =====================
        $buktiPelaksanaan = [];
        $catatanPelaksanaan = [];
        foreach (ObservasiPelaksanaan::kodeUtama() as $kode) {
            $buktiPelaksanaan[$kode] = 'Bukti observasi indikator '.$kode.'.';
            $catatanPelaksanaan[$kode] = 'Catatan untuk indikator '.$kode.'.';
        }
        ObservasiPelaksanaan::firstOrCreate(
            ['user_id' => $guruAnas->id, 'hari_tanggal' => now()->subDay(), 'nama_guru' => $guruAnas->name],
            [
                'kelas_semester' => 'VIII D / Ganjil',
                'mata_pelajaran' => 'IPA',
                'pemberi_umpan_balik' => $supervisor,
                'bukti' => $buktiPelaksanaan,
                'catatan' => $catatanPelaksanaan,
                'refleksi' => [
                    'r16' => 'Pelajaran yang diperoleh dari proses observasi kali ini adalah pentingnya penggunaan media yang bervariasi.',
                    'r17' => 'Penerapan hal yang baik untuk dipertahankan adalah pembelajaran berbasis masalah yang melibatkan murid aktif.',
                    'r18' => 'Rencana tindak lanjut adalah mengembangkan asesmen awal yang lebih beragam dan penggunaan media digital.',
                ],
            ]
        );

        // ===================== PASCA OBSERVASI (Form D) =====================
        PascaObservasi::firstOrCreate(
            ['user_id' => $guruHaidar->id, 'nama_guru' => $guruHaidar->name],
            [
                'hari_tanggal' => now()->subDay(),
                'kelas' => 'VII C',
                'mata_pelajaran' => 'Matematika',
                'waktu_percakapan' => '09.00 - 10.00',
                'supervisor' => $supervisor,
                'catatan_refleksi_guru' => 'Guru merasa pembelajaran berjalan baik, murid aktif berdiskusi.',
                'topik_percakapan_catatan' => 'Membahas hasil observasi, kelebihan, dan area pengembangan penggunaan alat peraga.',
                'rencana_tindak_lanjut' => 'Meningkatkan penggunaan alat peraga pada setiap pertemuan dan melakukan refleksi di akhir sesi.',
            ]
        );

        // ===================== JURNAL REFLEKSI =====================
        JurnalRefleksi::firstOrCreate(
            ['user_id' => $guruAnas->id, 'judul_refleksi' => 'Refleksi Pembelajaran Fotosintesis'],
            [
                'tanggal' => now()->subDays(3),
                'kategori' => 'Pembelajaran',
                'isi_refleksi' => 'Murid cukup antusias, namun beberapa masih kesulitan memahami faktor yang memengaruhi fotosintesis.',
                'bukti_file' => null,
            ]
        );

        JurnalRefleksi::firstOrCreate(
            ['user_id' => $guruHaidar->id, 'judul_refleksi' => 'Refleksi Bilangan Bulat'],
            [
                'tanggal' => now()->subDays(2),
                'kategori' => 'Pembelajaran',
                'isi_refleksi' => 'Pembelajaran berjalan baik, perlu penambahan latihan soal kontekstual.',
                'bukti_file' => null,
            ]
        );

        // ===================== RPP / MODUL AJAR =====================
        ModulAjar::firstOrCreate(
            ['user_id' => $guruAnas->id, 'judul' => 'Modul Ajar IPA - Fotosintesis'],
            [
                'file_path' => 'modul-ajar/Un0X97I4fVLmZ0AmqOyxPfMv3iQRW3YRxMl3BfXX.docx',
                'file_name' => 'Modul_IPA_Fotosintesis.docx',
                'file_size' => 8103,
                'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'keterangan' => 'Modul ajar mata pelajaran IPA untuk kelas VIII D.',
            ]
        );
    }
}
