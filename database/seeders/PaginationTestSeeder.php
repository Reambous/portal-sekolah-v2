<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PaginationTestSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (! $user) {
            $this->command->error('Tidak ada user! Jalankan DatabaseSeeder dulu.');

            return;
        }

        $userId = $user->id;
        $date = Carbon::now();

        $this->seedUsers($date);
        $this->seedBerita($userId, $date);
        $this->seedKegiatan($userId, $date, 'kesiswaan', 'Kesiswaan');
        $this->seedKegiatan($userId, $date, 'kurikulum', 'Kurikulum');
        $this->seedKegiatan($userId, $date, 'humas', 'Humas');
        $this->seedKegiatan($userId, $date, 'sarpras', 'Sarpras');
        $this->seedLomba($userId, $date);
        $this->seedIjin($userId, $date);
        $this->seedJurnalRefleksi($userId, $date);

        $this->command->info('✅ PaginationTestSeeder selesai!');
        $this->command->info('   - Users: 17 record (10/page = 2 halaman)');
        $this->command->info('   - Berita: 12 record (6/page = 2 halaman)');
        $this->command->info('   - Kegiatan (kesiswaan, kurikulum, humas, sarpras): masing-masing 15 record (10/page = 2 halaman)');
        $this->command->info('   - Lomba: 15 record (10/page = 2 halaman)');
        $this->command->info('   - Ijin: 15 record (10/page = 2 halaman)');
        $this->command->info('   - Jurnal Refleksi: 15 record (10/page = 2 halaman)');
        $this->command->info('   - Komentar: 20 comment tersebar di berita');
    }

    protected function seedUsers(Carbon $date): void
    {
        $guruNames = [
            ['name' => 'Drs. Ahmad Fauzi, M.Pd', 'email' => 'ahmad.fauzi@sekolah.test'],
            ['name' => 'Dra. Sri Wahyuni, M.Si', 'email' => 'sri.wahyuni@sekolah.test'],
            ['name' => 'H. Agus Salim, S.Pd.I', 'email' => 'agus.salim@sekolah.test'],
            ['name' => 'Rina Marlina, S.Pd., M.Pd', 'email' => 'rina.marlina@sekolah.test'],
            ['name' => 'Dedi Kurniawan, S.Kom', 'email' => 'dedi.kurniawan@sekolah.test'],
            ['name' => 'Fitri Handayani, S.Pd', 'email' => 'fitri.handayani@sekolah.test'],
            ['name' => 'Bambang Supriyadi, S.T', 'email' => 'bambang.supriyadi@sekolah.test'],
            ['name' => 'Nurul Hidayah, S.Pd., Gr', 'email' => 'nurul.hidayah@sekolah.test'],
            ['name' => 'Eko Prasetyo, S.Pd', 'email' => 'eko.prasetyo@sekolah.test'],
            ['name' => 'Dewi Sartika, S.Si., M.Pd', 'email' => 'dewi.sartika@sekolah.test'],
            ['name' => 'Hendra Gunawan, S.Pd', 'email' => 'hendra.gunawan@sekolah.test'],
            ['name' => 'Lina Maryani, S.E., M.M', 'email' => 'lina.maryani@sekolah.test'],
            ['name' => 'Rudi Hartono, S.Ag', 'email' => 'rudi.hartono@sekolah.test'],
            ['name' => 'Yuni Astuti, S.Pd., M.Pd', 'email' => 'yuni.astuti@sekolah.test'],
            ['name' => 'Adi Nugroho, S.Kom., M.Kom', 'email' => 'adi.nugroho@sekolah.test'],
            ['name' => 'Tri Wahyuni, S.Psi', 'email' => 'tri.wahyuni@sekolah.test'],
            ['name' => 'Fajar Sidik, S.Pd', 'email' => 'fajar.sidik@sekolah.test'],
        ];

        $existingEmails = User::pluck('email')->toArray();
        $inserts = [];

        foreach ($guruNames as $i => $guru) {
            if (in_array($guru['email'], $existingEmails)) {
                continue;
            }

            $inserts[] = [
                'name' => $guru['name'],
                'email' => $guru['email'],
                'nip' => sprintf('19%02d%02d%02d%s', rand(80, 99), rand(1, 12), rand(1, 30), rand(1000, 9999)),
                'password' => bcrypt('guru123'),
                'role' => 'guru',
                'email_verified_at' => $date->copy()->subDays(17 - $i),
                'created_at' => $date->copy()->subDays(17 - $i),
                'updated_at' => $date->copy()->subDays(17 - $i),
            ];
        }

        if (! empty($inserts)) {
            User::insert($inserts);
        }
    }

    protected function seedBerita(int $userId, Carbon $date): void
    {
        if (! static::SchemaHasTable('berita')) {
            return;
        }

        $juduls = [
            'SMK BISA: PELEPASAN SISWA PRAKERIN ANGKATAN 2026',
            'WORKSHOP DIGITAL MARKETING UNTUK SISWA KELAS XII',
            'KUNJUNGAN INDUSTRI KE PT TELKOM INDONESIA',
            'SOSIALISASI PROGRAM SEKOLAH RAMAH ANAK',
            'PELATIHAN GURU PEMBUATAN MEDIA PEMBELAJARAN INTERAKTIF',
            'LOMBA KOMPETENSI SISWA TINGKAT KABUPATEN',
            'KEGIATAN BAKTI SOSIAL DI PANTI ASUHAN',
            'SEMINAR KARIR: MENGENAL DUNIA KERJA DI ERA DIGITAL',
            'UPACARA HARI PENDIDIKAN NASIONAL 2026',
            'PELATIHAN JURNALISTIK UNTUK EKSTRAKURIKULER JURNALIS',
            'PROGRAM PERTUKARAN SISWA ANTAR SEKOLAH',
            'PENUTUPAN KEGIATAN EKSTRAKURIKULER SEMESTER GENAP',
        ];

        $isis = [
            'Sebanyak 120 siswa dilepas secara resmi oleh kepala sekolah untuk melaksanakan Praktik Kerja Lapangan (PKL) di berbagai industri mitra selama 6 bulan ke depan.',
            'Workshop digital marketing diikuti oleh 45 siswa kelas XII jurusan Bisnis Daring dan Pemasaran. Kegiatan ini menghadirkan praktisi marketing dari perusahaan rintisan lokal.',
            'Kunjungan industri ke PT Telkom Indonesia diikuti oleh 60 siswa jurusan Teknik Informatika. Mereka belajar tentang infrastruktur jaringan dan layanan digital.',
            'Sosialisasi program sekolah ramah anak dihadiri oleh seluruh guru dan staf. Program ini bertujuan menciptakan lingkungan belajar yang aman dan nyaman.',
            'Pelatihan pembuatan media pembelajaran interaktif menggunakan aplikasi Canva dan PowerPoint diikuti oleh 30 guru dari berbagai mata pelajaran.',
            'Lomba Kompetensi Siswa tingkat kabupaten berhasil meraih juara umum. Siswa-siswa SMK kami unggul di bidang Web Technologies dan Jaringan.',
            'Bakti sosial di Panti Asuhan Al-Ikhlas diikuti oleh 40 siswa dan 5 guru pendamping. Mereka menyalurkan donasi berupa sembako dan peralatan sekolah.',
            'Seminar karir menghadirkan pembicara dari perusahaan teknologi terkemuka. Siswa mendapat wawasan tentang persiapan memasuki dunia kerja.',
            'Upacara Hari Pendidikan Nasional berlangsung khidmat. Kepala sekolah membacakan pidato Menteri Pendidikan tentang pentingnya karakter dan kompetensi.',
            'Pelatihan jurnalistik diikuti oleh 25 anggota ekstrakurikuler jurnalis. Mereka belajar teknik wawancara, menulis berita, dan fotografi jurnalistik.',
            'Program pertukaran siswa selama 2 minggu dengan SMK di Jawa Timur. Siswa tinggal di keluarga angkat dan mengikuti kegiatan belajar mengajar.',
            'Penutupan kegiatan ekstrakurikuler ditandai dengan pentas seni dan pameran karya siswa dari berbagai bidang minat dan bakat.',
        ];

        $inserts = [];
        for ($i = 0; $i < count($juduls); $i++) {
            $inserts[] = [
                'user_id' => $userId,
                'judul' => $juduls[$i],
                'isi' => $isis[$i],
                'gambar' => null,
                'lampiran' => null,
                'nama_file_asli' => null,
                'views' => rand(5, 100),
                'created_at' => $date->copy()->subDays(count($juduls) - $i),
                'updated_at' => $date->copy()->subDays(count($juduls) - $i),
            ];
        }

        DB::table('berita')->insert($inserts);
        $this->seedKomentar($userId, $date);
    }

    protected function seedKomentar(int $userId, Carbon $date): void
    {
        if (! static::SchemaHasTable('berita_komentar')) {
            return;
        }

        $commentTexts = [
            'Semoga sukses dan lancar PKL-nya untuk seluruh siswa angkatan ini!',
            'Kegiatan yang sangat bermanfaat untuk pengembangan kompetensi siswa.',
            'Terima kasih kepada semua pihak yang telah mendukung kegiatan ini.',
            'Mantap! Sekolah kita semakin maju dan berkembang pesat.',
            'Semoga tahun depan ada kegiatan serupa dengan skala yang lebih besar.',
            'Saya sangat bangga menjadi bagian dari sekolah ini.',
            'Teruslah berkarya dan berprestasi, siswa-siswi SMK kebanggaan kami.',
            'Kegiatan seperti ini sangat dinantikan oleh siswa dan orang tua.',
            'Semoga kerja sama dengan industri mitra semakin erat dan berkelanjutan.',
            'Selamat kepada semua siswa yang telah berpartisipasi dengan antusias.',
            'Ini adalah bukti bahwa SMK bisa menghasilkan lulusan yang berkualitas.',
            'Terima kasih kepada bapak/ibu guru yang telah membimbing dengan sabar.',
            'Sukses selalu untuk SMK kita tercinta.',
            'Kegiatan yang inspiratif dan memotivasi siswa untuk terus belajar.',
            'Semoga prestasi yang diraih bisa dipertahankan dan ditingkatkan.',
            'Luar biasa! Semoga terus ada inovasi baru dari sekolah kita.',
            'Saya mendukung penuh program-program positif dari sekolah.',
            'Selamat dan sukses untuk seluruh civitas akademika SMK.',
            'Harapan saya semoga sekolah kita semakin jaya dan bermartabat.',
            'Kita semua bangga dengan pencapaian yang telah diraih.',
        ];

        $beritaIds = DB::table('berita')->pluck('id')->toArray();
        if (empty($beritaIds)) {
            return;
        }

        $inserts = [];
        foreach ($commentTexts as $i => $text) {
            $inserts[] = [
                'berita_id' => $beritaIds[$i % count($beritaIds)],
                'user_id' => $userId,
                'isi_komentar' => $text,
                'created_at' => $date->copy()->subHours(count($commentTexts) - $i),
                'updated_at' => $date->copy()->subHours(count($commentTexts) - $i),
            ];
        }

        DB::table('berita_komentar')->insert($inserts);
    }

    protected function seedKegiatan(int $userId, Carbon $date, string $kategori, string $label): void
    {
        if (! static::SchemaHasTable('kegiatan')) {
            return;
        }

        $names = $this->getKegiatanNames($label);
        $refleksis = $this->getKegiatanRefleksis($label);

        $inserts = [];
        for ($i = 0; $i < 15; $i++) {
            $inserts[] = [
                'user_id' => $userId,
                'tanggal' => $date->copy()->subDays(15 - $i)->format('Y-m-d'),
                'kategori' => $kategori,
                'nama_kegiatan' => $names[$i % count($names)],
                'refleksi' => $refleksis[$i % count($refleksis)],
                'bukti_gambar' => null,
                'lampiran' => null,
                'nama_file_asli' => null,
                'status' => $i % 3 === 0 ? 'pending' : 'disetujui',
                'created_at' => $date->copy()->subDays(15 - $i),
                'updated_at' => $date->copy()->subDays(15 - $i),
            ];
        }

        DB::table('kegiatan')->insert($inserts);
    }

    protected function getKegiatanNames(string $label): array
    {
        $lists = [
            'Kesiswaan' => [
                'LOMBA KOMPETENSI SISWA BIDANG WEB TECHNOLOGIES',
                'PEMILIHAN KETUA OSIS PERIODE 2026/2027',
                'KEGIATAN BAKTI SOSIAL DI PANTI ASUHAN',
                'PELATIHAN PUBLIC SPEAKING UNTUK SISWA',
                'WORKSHOP KEPEMIMPINAN SISWA (LDKS)',
                'LOMBA DEBAT BAHASA INDONESIA ANTAR KELAS',
                'SENI DAN BUDAYA DALAM PENTAS AKHIR TAHUN',
                'KLINIK SENI MUSIK TRADISIONAL',
                'LOMBA CIPTA PUISI NASIONAL',
                'PELATIHAN PERTOLONGAN PERTAMA PADA KECELAKAAN',
            ],
            'Kurikulum' => [
                'WORKSHOP PENYUSUNAN MODUL AJAR KURIKULUM MERDEKA',
                'RAPAT KOORDINASI GURU MATA PELAJARAN',
                'PELATIHAN PEMBUATAN SOAL ASESMEN FORMATIF',
                'SUPERVISI AKADEMIK GURU TAHUN AJARAN 2025/2026',
                'ANALISIS CAPAIAN PEMBELAJARAN SISWA SEMESTER GANJIL',
                'PENYUSUNAN KALENDER PENDIDIKAN TAHUN AJARAN BARU',
                'WORKSHOP PEMBELAJARAN BERDIFERENSIASI',
                'KLINIK PENYUSUNAN RPP DAN ATP',
                'EVALUASI PELAKSANAAN PROGRAM TAHUNAN',
                'SOSIALISASI KEBIJAKAN KURIKULUM MERDEKA',
            ],
            'Humas' => [
                'RAPAT PLENO KOMITE SEKOLAH BERSAMA WALI MURID',
                'SOSIALISASI PENERIMAAN PESERTA DIDIK BARU',
                'KUNJUNGAN ORANG TUA DAN MASYARAKAT KE SEKOLAH',
                'KERJA SAMA DENGAN DUNIA INDUSTRI DAN USAHA',
                'PUBLIKASI PROFIL SEKOLAH DI MEDIA SOSIAL',
                'PELATIHAN HUMAS DALAM MANAJEMEN PUBLIKASI',
                'OPEN HOUSE SEKOLAH UNTUK SISWA SMP',
                'SEMINAR ORANG TUA TENTANG PENDIDIKAN KARAKTER',
                'KEGIATAN BHAKTI SOSIAL BERSAMA KOMITE SEKOLAH',
                'PENYAMPAIAN LAPORAN KINERJA SEKOLAH',
            ],
            'Sarpras' => [
                'PEREMAJAAN FASILITAS KOMPUTER LABORATORIUM RPL',
                'PEMELIHARAAN DAN PERBAIKAN INFRASTRUKTUR SEKOLAH',
                'PENATAAN ULANG RUANG KELAS DAN LABORATORIUM',
                'PENGADAAN ALAT PERAGA PEMBELAJARAN IPA',
                'RENOVASI RUANG GURU DAN TATA USAHA',
                'PEMASANGAN JARINGAN WIFI DI SELURUH AREA SEKOLAH',
                'PENGADAAN BUKU PERPUSTAKAAN TAHUN 2026',
                'PERBAIKAN INSTALASI LISTRIK DAN AIR',
                'PENAMBAHAN FASILITAS OLAHRAGA DAN KESENIAN',
                'PEMBUATAN TAMAN DAN GREEN HOUSE SEKOLAH',
            ],
        ];

        return $lists[$label] ?? $lists['Kesiswaan'];
    }

    protected function getKegiatanRefleksis(string $label): array
    {
        $lists = [
            'Kesiswaan' => [
                'Seleksi tingkat kabupaten berjalan lancar dengan peserta yang antusias.',
                'Pemilihan berlangsung demokratis dengan partisipasi siswa mencapai 90%.',
                'Kegiatan berhasil mengumpulkan donasi berupa sembako dan alat tulis.',
                'Siswa sangat antusias mengikuti pelatihan dan hasilnya memuaskan.',
                'LDKS berhasil mencetak kader pemimpin yang berkualitas dan bertanggung jawab.',
                'Debat berlangsung seru dan menampilkan argumen-argumen berkualitas dari siswa.',
                'Pentas seni menampilkan berbagai kreasi siswa yang luar biasa.',
                'Pelatihan musik tradisional meningkatkan apresiasi siswa terhadap budaya lokal.',
                'Puisi-puisi yang dilombakan memiliki kualitas sastra yang baik.',
                'Siswa mampu mempraktikkan teknik P3K dengan benar setelah pelatihan.',
            ],
            'Kurikulum' => [
                'Guru antusias mengimplementasikan modul ajar berbasis proyek.',
                'Rapat koordinasi menghasilkan kesepakatan tentang target pembelajaran.',
                'Soal asesmen formatif yang dihasilkan sesuai dengan kriteria ketercapaian tujuan pembelajaran.',
                'Supervisi menunjukkan peningkatan kualitas mengajar guru secara signifikan.',
                'Hasil analisis menunjukkan perlunya penguatan pada materi numerasi.',
                'Kalender pendidikan telah disusun dan disetujui oleh seluruh stakeholder.',
                'Workshop memberikan wawasan baru tentang strategi pembelajaran diferensiasi.',
                'Guru berhasil menyusun RPP dan ATP yang sesuai dengan standar kurikulum.',
                'Evaluasi program berjalan komprehensif dengan masukan dari semua guru.',
                'Sosialisasi mendapat sambutan positif dari guru dan tenaga kependidikan.',
            ],
            'Humas' => [
                'Rapat menghasilkan kesepakatan tentang program kerja tahunan sekolah.',
                'Sosialisasi PPDB diikuti oleh 200 orang tua calon siswa baru.',
                'Kunjungan orang tua meningkatkan kepercayaan masyarakat terhadap sekolah.',
                'Kerja sama dengan 5 mitra industri baru berhasil dijalin tahun ini.',
                'Publikasi profil sekolah menjangkau 10.000 audiens di media sosial.',
                'Pelatihan meningkatkan kemampuan humas dalam mengelola publikasi.',
                'Open house dihadiri oleh 150 siswa SMP dari berbagai sekolah.',
                'Seminar memberikan wawasan tentang pentingnya pendidikan karakter.',
                'Kegiatan bakti sosial mempererat hubungan sekolah dengan masyarakat.',
                'Laporan kinerja disampaikan secara transparan kepada orang tua dan masyarakat.',
            ],
            'Sarpras' => [
                'Pemasangan RAM baru dan pembersihan debu untuk 20 unit komputer.',
                'Perbaikan infrastruktur selesai tepat waktu sesuai jadwal yang direncanakan.',
                'Penataan ruang kelas meningkatkan kenyamanan proses belajar mengajar.',
                'Alat peraga IPA siap digunakan untuk praktikum semester depan.',
                'Renovasi ruang guru selesai dan memberikan suasana kerja yang lebih nyaman.',
                'Jaringan wifi kini menjangkau seluruh area sekolah dengan stabil.',
                'Pengadaan buku perpustakaan menambah koleksi menjadi 5.000 judul.',
                'Instalasi listrik dan air berfungsi normal setelah perbaikan menyeluruh.',
                'Fasilitas olahraga dan kesenian siap digunakan oleh siswa.',
                'Taman sekolah dan green house menjadi sarana pembelajaran biologi yang menarik.',
            ],
        ];

        return $lists[$label] ?? $lists['Kesiswaan'];
    }

    protected function seedLomba(int $userId, Carbon $date): void
    {
        if (! static::SchemaHasTable('kesiswaan_lomba')) {
            return;
        }

        $lombas = [
            ['jenis' => 'Lomba Web Technologies', 'prestasi' => 'Juara 1 Tingkat Kabupaten'],
            ['jenis' => 'Lomba Desain Grafis', 'prestasi' => 'Juara 2 Tingkat Provinsi'],
            ['jenis' => 'Lomba Robotik', 'prestasi' => 'Harapan 1 Tingkat Nasional'],
            ['jenis' => 'Lomba Debat Bahasa Inggris', 'prestasi' => 'Juara 3 Tingkat Kota'],
            ['jenis' => 'Lomba Cerdas Cermat', 'prestasi' => 'Juara 1 Tingkat Kabupaten'],
            ['jenis' => 'Lomba Pidato Bahasa Indonesia', 'prestasi' => 'Juara 2 Tingkat Provinsi'],
            ['jenis' => 'Lomba Olimpiade Matematika', 'prestasi' => 'Finalis Tingkat Nasional'],
            ['jenis' => 'Lomba Pengembangan Aplikasi Mobile', 'prestasi' => 'Juara 1 Tingkat Provinsi'],
            ['jenis' => 'Lomba Jaringan Komputer', 'prestasi' => 'Juara 2 Tingkat Kabupaten'],
            ['jenis' => 'Lomba Esai Ilmiah', 'prestasi' => 'Juara Harapan 2 Tingkat Nasional'],
            ['jenis' => 'Lomba Video Kreatif', 'prestasi' => 'Juara 1 Tingkat Kota'],
            ['jenis' => 'Lomba Festival Musik Tradisional', 'prestasi' => 'Juara 3 Tingkat Provinsi'],
            ['jenis' => 'Lomba Desain UI/UX', 'prestasi' => 'Best Design Award Tingkat Regional'],
            ['jenis' => 'Lomba Analisis Data', 'prestasi' => 'Juara 2 Tingkat Nasional'],
            ['jenis' => 'Lomba Karya Tulis Ilmiah Remaja', 'prestasi' => 'Juara 1 Tingkat Kabupaten'],
        ];

        $pesertaList = [
            'Budi (XI-A), Ani (XI-A), Siti (XI-B)',
            'Rudi (XII-RPL), Dinda (XII-RPL)',
            'Ahmad (XI-TKJ), Rizky (XI-TKJ), Fajar (XI-TKJ)',
            'Nina (XII-BDP), Putri (XII-BDP)',
            'Doni (X-A), Rina (X-A), Yoga (X-B)',
            'Dewi (XI-RPL), Andi (XI-RPL)',
            'Rizal (XII-TKJ), Maya (XII-AK)',
            'Rahmat (XI-RPL), Intan (XI-RPL), Fikri (XI-RPL)',
            'Hendra (XII-TKJ), Yudi (XII-TKJ)',
            'Citra (XI-AK), Wulan (XI-AK)',
            'Teguh (X-RPL), Aulia (X-RPL)',
            'Bagas (XI-TKJ), Sari (XI-BDP)',
            'Dimas (XII-RPL), Ajeng (XII-RPL)',
            'Gilang (XI-RPL), Riska (XI-AK)',
            'Faisal (X-TKJ), Nabila (X-BDP)',
        ];

        $refleksis = [
            'Siswa berhasil menguasai materi lomba setelah 2 bulan pembinaan intensif.',
            'Kreativitas siswa dalam desain grafis sangat memuaskan dan berbakat.',
            'Robot berhasil menyelesaikan misi dengan baik meskipun ada kendala teknis.',
            'Kemampuan debat siswa meningkat pesat setelah latihan rutin setiap minggu.',
            'Kerja sama tim yang solid menjadi kunci keberhasilan meraih juara.',
            'Siswa tampil percaya diri dan mampu menyampaikan pidato dengan baik.',
            'Persiapan selama 3 bulan membuahkan hasil yang membanggakan.',
            'Aplikasi yang dikembangkan mendapat apresiasi dari juri karena inovatif.',
            'Pengetahuan siswa tentang jaringan komputer sudah sangat mumpuni.',
            'Esai yang ditulis mengangkat isu lingkungan dengan pendekatan saintifik.',
            'Video kreatif yang diproduksi berhasil menyampaikan pesan edukatif.',
            'Penampilan musik tradisional mendapat standing ovation dari penonton.',
            'Desain UI/UX yang dibuat sangat user-friendly dan estetis.',
            'Kemampuan analisis data siswa setara dengan mahasiswa tingkat akhir.',
            'Karya tulis ilmiah berhasil lolos seleksi dan dipresentasikan dengan baik.',
        ];

        $inserts = [];
        for ($i = 0; $i < count($lombas); $i++) {
            $inserts[] = [
                'user_id' => $userId,
                'tanggal' => $date->copy()->subDays(15 - $i)->format('Y-m-d'),
                'jenis_lomba' => $lombas[$i]['jenis'],
                'peserta' => $pesertaList[$i],
                'bukti_gambar' => null,
                'prestasi' => $lombas[$i]['prestasi'],
                'refleksi' => $refleksis[$i],
                'status' => $i % 3 === 0 ? 'pending' : 'disetujui',
                'created_at' => $date->copy()->subDays(15 - $i),
                'updated_at' => $date->copy()->subDays(15 - $i),
            ];
        }

        DB::table('kesiswaan_lomba')->insert($inserts);
    }

    protected function seedIjin(int $userId, Carbon $date): void
    {
        if (! static::SchemaHasTable('ijin')) {
            return;
        }

        $alasan = [
            'Mendampingi siswa delegasi lomba di tingkat provinsi',
            'Izin sakit karena demam dan harus istirahat total',
            'Ada keperluan keluarga mendadak',
            'Mengikuti pelatihan guru di luar kota',
            'Izin haid (nyeri hebat)',
            'Ada acara pernikahan keluarga',
            'Melakukan pemeriksaan kesehatan rutin di RS',
            'Mendampingi anak sekolah',
            'Ada kegiatan sosial di lingkungan rumah',
            'Mengurus administrasi pribadi di bank',
            'Izin cuti tahunan',
            'Ada musibah keluarga',
            'Mengikuti seminar pendidikan',
            'Izin karena banjir di lingkungan rumah',
            'Ada rapat koordinasi di dinas pendidikan',
        ];

        $statuses = ['pending', 'disetujui', 'ditolak'];

        $inserts = [];
        for ($i = 0; $i < 15; $i++) {
            $haveTime = $i % 5 !== 0;
            $inserts[] = [
                'user_id' => $userId,
                'tanggal' => $date->copy()->subDays(15 - $i)->format('Y-m-d'),
                'jam_mulai' => $haveTime ? sprintf('%02d:00:00', rand(7, 9)) : null,
                'jam_selesai' => $haveTime ? sprintf('%02d:00:00', rand(10, 14)) : null,
                'alasan' => $alasan[$i],
                'bukti_foto' => null,
                'status' => $statuses[$i % 3],
                'created_at' => $date->copy()->subDays(15 - $i),
                'updated_at' => $date->copy()->subDays(15 - $i),
            ];
        }

        DB::table('ijin')->insert($inserts);
    }

    protected function seedJurnalRefleksi(int $userId, Carbon $date): void
    {
        if (! static::SchemaHasTable('jurnal_refleksi')) {
            return;
        }

        $kategoris = [
            'Evaluasi Kelas X-RPL',
            'Evaluasi Kelas XI-RPL',
            'Evaluasi Kelas XII-RPL',
            'Pengembangan Diri',
            'Diskusi Sejawat',
            'Evaluasi Kelas X-TKJ',
            'Evaluasi Kelas XI-TKJ',
            'Pengembangan Diri',
            'Evaluasi Kelas XII-TKJ',
            'Diskusi Sejawat',
            'Evaluasi Kelas XI-AK',
            'Pengembangan Diri',
            'Evaluasi Kelas X-BDP',
            'Diskusi Sejawat',
            'Evaluasi Kelas XII-AK',
        ];

        $juduls = [
            'EVALUASI KENDALA PEMAHAMAN RELASI DATA ELOQUENT LARAVEL',
            'REFLEKSI PENERAPAN METODE PROBLEM BASED LEARNING',
            'ANALISIS HASIL ASESMEN SUMATIF SEMESTER GANJIL',
            'PELATIHAN PEMBUATAN MEDIA PEMBELAJARAN INTERAKTIF',
            'DISKUSI BERSAMA GURU MATA PELAJARAN SERUMPUN',
            'EVALUASI PEMBELAJARAN DASAR PEMROGRAMAN',
            'REFLEKSI PENGGUNAAN LABORATORIUM KOMPUTER',
            'MEMBACA BUKU PENDIDIKAN KARAKTER DAN IMPLEMENTASINYA',
            'EVALUASI KESIAPAN SISWA MENGHADAPI UJIAN SEKOLAH',
            'DISKUSI TENTANG TEKNIK ASESMEN AUTENTIK',
            'EVALUASI PEMBELAJARAN AKUNTANSI DASAR',
            'WORKSHOP PENULISAN ARTIKEL ILMIAH POPULER',
            'REFLEKSI PEMBELAJARAN KEWIRAUSAHAAN',
            'SHARING SESSION BERSAMA GURU BK TENTANG KARAKTER SISWA',
            'EVALUASI PROYEK AKHIR SISWA KELAS XII',
        ];

        $isis = [
            'Siswa masih memerlukan visualisasi diagram sebelum masuk baris kode. Pertemuan selanjutnya akan diawali dengan pemetaan foreign key di papan tulis.',
            'Metode PBL efektif meningkatkan keaktifan siswa. Indikator: 85% siswa berpartisipasi aktif dalam diskusi kelompok.',
            'Rata-rata nilai asesmen sumatif mengalami peningkatan 10 poin dibanding semester lalu. Perlu penguatan di materi array dan fungsi.',
            'Pelatihan Canva dan PowerPoint meningkatkan kompetensi guru dalam membuat media ajar yang menarik dan interaktif.',
            'Hasil diskusi: perlu adanya penyelarasan materi antar mata pelajaran serumpun agar tidak tumpang tindih.',
            'Beberapa siswa masih kesulitan memahami konsep logika pemrograman. Rencana tindak lanjut: tambahan jam remedial.',
            'Lab komputer berfungsi dengan baik. Hanya 2 unit yang perlu perbaikan. Pembelajaran berjalan lancar.',
            'Buku ini memberikan perspektif baru tentang pentingnya menanamkan karakter melalui keteladanan guru di kelas.',
            'Siswa sudah siap 75%. Perlu pendalaman materi di bagian jaringan komputer dan keamanan data.',
            'Asesmen autentik lebih relevan untuk mengukur kompetensi praktik siswa dibanding tes tertulis konvensional.',
            'Siswa antusias mempelajari siklus akuntansi perusahaan jasa. Praktik langsung membantu pemahaman.',
            'Workshop ini menginspirasi guru untuk menulis dan mempublikasikan pengalaman mengajar di jurnal nasional.',
            'Siswa mampu membuat business plan sederhana. Beberapa ide bisnis sangat kreatif dan layak dikembangkan.',
            'Diskusi menghasilkan pemahaman bahwa pendekatan personal lebih efektif untuk siswa bermasalah.',
            'Proyek akhir menunjukkan kemampuan siswa dalam mengintegrasikan semua kompetensi yang telah dipelajari.',
        ];

        $inserts = [];
        for ($i = 0; $i < 15; $i++) {
            $inserts[] = [
                'user_id' => $userId,
                'tanggal' => $date->copy()->subDays(15 - $i)->format('Y-m-d'),
                'kategori' => $kategoris[$i],
                'judul_refleksi' => $juduls[$i],
                'isi_refleksi' => $isis[$i],
                'bukti_file' => null,
                'created_at' => $date->copy()->subDays(15 - $i),
                'updated_at' => $date->copy()->subDays(15 - $i),
            ];
        }

        DB::table('jurnal_refleksi')->insert($inserts);
    }

    protected static function SchemaHasTable(string $table): bool
    {
        return Schema::hasTable($table);
    }
}
