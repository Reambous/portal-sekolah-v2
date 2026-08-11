<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PraObservasiInstrumen extends Model
{
    protected $table = 'pra_observasi_instrumen';

    protected $guarded = [];

    protected $casts = [
        'user_id' => 'integer',
        'skor' => 'array',
        'komentar' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Definisi indikator instrumen (satu sumber kebenaran).
     * Dipakai untuk form React, halaman detail, dan export Excel.
     *
     * @return array<string, mixed>
     */
    public static function definisi(): array
    {
        return [
            'skala' => [
                '0' => 'Tidak ada',
                '1' => 'Sangat kurang',
                '2' => 'Kurang',
                '3' => 'Baik',
                '4' => 'Sangat baik',
            ],
            'seksi' => [
                'keselarasan' => [
                    'nama' => 'Keselarasan',
                    'indikator' => [
                        ['kode' => 'i1', 'teks' => 'Tujuan pembelajaran, langkah pembelajaran, dan asesmen pembelajaran sudah mengarah pada pencapaian Dimensi Profil Lulusan'],
                        ['kode' => 'i2', 'teks' => 'Tujuan pembelajaran, langkah pembelajaran, dan asesmen pembelajaran sudah selaras'],
                    ],
                ],
                'kerangka' => [
                    'nama' => 'Kerangka Pembelajaran',
                    'indikator' => [
                        ['kode' => 'i3', 'teks' => 'Praktik pedagogis yang dituliskan sudah tergambar pada langkah pembelajaran dan/atau asesmen pembelajaran'],
                        ['kode' => 'i4', 'teks' => 'Lingkungan belajar yang dituliskan sudah tergambar pada langkah pembelajaran dan/atau asesmen pembelajaran'],
                        ['kode' => 'i5', 'teks' => 'Kemitraan pembelajaran yang dituliskan sudah tergambar pada langkah pembelajaran dan/atau asesmen pembelajaran'],
                        ['kode' => 'i6', 'teks' => 'Pemanfaatan digital yang dituliskan sudah tergambar pada langkah pembelajaran dan/atau asesmen pembelajaran'],
                    ],
                ],
                'langkah' => [
                    'nama' => 'Langkah Pembelajaran',
                    'indikator' => [
                        [
                            'kode' => 'i7',
                            'teks' => 'Langkah pembelajaran dapat memfasilitasi murid untuk merasakan pengalaman belajar MEMAHAMI (terlibat aktif mengonstruksi pengetahuan agar dapat memahami secara mendalam konsep atau materi dari berbagai sumber dan konteks).',
                            'sub' => [
                                ['kode' => 'i7a', 'teks' => 'Menghubungkan pengetahuan baru dengan pengetahuan sebelumnya'],
                                ['kode' => 'i7b', 'teks' => 'Menstimulasi proses berpikir murid'],
                                ['kode' => 'i7c', 'teks' => 'Menghubungkan dengan konteks nyata dan/atau kehidupan sehari-hari'],
                                ['kode' => 'i7d', 'teks' => 'Memberikan kebebasan eksploratif dan kolaboratif'],
                                ['kode' => 'i7e', 'teks' => 'Menanamkan nilai-nilai moral dan etika dan nilai positif lainnya'],
                                ['kode' => 'i7f', 'teks' => 'Mengaitkan pembelajaran dengan pembentukan karakter murid'],
                            ],
                        ],
                        [
                            'kode' => 'i8',
                            'teks' => 'Langkah pembelajaran dapat memfasilitasi murid untuk merasakan pengalaman belajar MENGAPLIKASI (mengaplikasi pemahaman secara kontekstual dalam kehidupan nyata sebagai bagian dari pendalaman pengetahuan).',
                            'sub' => [
                                ['kode' => 'i8a', 'teks' => 'Menghubungkan konsep baru dengan pengetahuan sebelumnya.'],
                                ['kode' => 'i8b', 'teks' => 'Menerapkan pengetahuan ke dalam situasi nyata atau bidang lain.'],
                                ['kode' => 'i8c', 'teks' => 'Mengembangkan pemahaman dengan eksplorasi lebih lanjut.'],
                                ['kode' => 'i8d', 'teks' => 'Berpikir Kritis dan mencari solusi inovatif berdasarkan pengetahuan yang ada.'],
                            ],
                        ],
                        [
                            'kode' => 'i9',
                            'teks' => 'Langkah pembelajaran dapat memfasilitasi murid untuk merasakan pengalaman belajar MEREFLEKSI (mengevaluasi dan memaknai proses serta hasil dari tindakan atau praktik nyata yang telah mereka lakukan dan menentukan tindaklanjut ke depan; serta mengelola proses belajarnya secara mandiri).',
                            'sub' => [
                                ['kode' => 'i9a', 'teks' => 'Memotivasi diri sendiri untuk terus belajar bagaimana cara belajar'],
                                ['kode' => 'i9b', 'teks' => 'Refleksi terhadap pencapaian tujuan pembelajaran (evaluasi diri)'],
                                ['kode' => 'i9c', 'teks' => 'Menerapkan strategi berpikir'],
                                ['kode' => 'i9d', 'teks' => 'Memiliki kemampuan metakognisi (meregulasi diri dalam pembelajaran)'],
                                ['kode' => 'i9e', 'teks' => 'Meregulasi emosi dalam pembelajaran'],
                            ],
                        ],
                        ['kode' => 'i10', 'teks' => 'Langkah perencanaan pembelajaran dapat memfasilitasi tindakan saling MEMULIAKAN antara Guru-Murid, Murid-Guru, Murid-Murid yang tercermin dalam bahasa verbal dan nonverbal'],
                        ['kode' => 'i11', 'teks' => 'Prinsip pembelajaran mendalam berupa berkesadaran, bermakna, dan/atau menggembirakan sudah tergambar pada setiap pengalaman belajar di langkah pembelajaran'],
                        ['kode' => 'i12', 'teks' => 'Perencanaan pembelajaran sudah mengakomodir pengalaman belajar yang sesuai dengan karakteristik peserta didik'],
                    ],
                ],
                'asesmen' => [
                    'nama' => 'Asesmen',
                    'indikator' => [
                        ['kode' => 'i13', 'teks' => 'Asesmen pada awal pembelajaran telah dilaksanakan untuk mendapatkan bukti kesiapan belajar secara emosional dan mental, pengetahuan awal, dan kebutuhan belajar murid'],
                        ['kode' => 'i14', 'teks' => 'Asesmen selama Proses Pembelajaran telah dilaksanakan sesuai perencanaan untuk memantau perkembangan belajar murid, memberikan umpan balik untuk perbaikan kontinyu (baik dari guru ke murid, maupun dari murid ke guru), melalui beragam teknik'],
                        ['kode' => 'i15', 'teks' => 'Asesmen hasil Pembelajaran direncanakan untuk mengukur pencapaian kompetensi sebagai bukti keberhasilan pembelajaran dengan beragam cara, antara lain: tes, portofolio, proyek, presentasi, dsb.'],
                    ],
                ],
            ],
            'catatan' => [
                ['kode' => 'kelebihan', 'teks' => 'Tuliskan kelebihan Perencanaan Pembelajaran:'],
                ['kode' => 'hal_ditingkatkan', 'teks' => 'Tuliskan hal yang perlu ditingkatkan dari Perencanaan Pembelajaran:'],
                ['kode' => 'rekomendasi', 'teks' => 'Tuliskan rekomendasi dan lanjutkan dengan revisi Perencanaan Pembelajaran sesuai prinsip PM'],
            ],
        ];
    }

    /**
     * Daftar item bernilai skala 0-4 (indikator utama + semua sub item).
     *
     * @return array<int, array{kode: string, teks: string}>
     */
    public static function itemSkala(): array
    {
        $items = [];
        foreach (static::definisi()['seksi'] as $seksi) {
            foreach ($seksi['indikator'] as $ind) {
                $items[] = ['kode' => $ind['kode'], 'teks' => $ind['teks']];
                if (isset($ind['sub'])) {
                    foreach ($ind['sub'] as $sub) {
                        $items[] = ['kode' => $sub['kode'], 'teks' => $sub['teks']];
                    }
                }
            }
        }

        return $items;
    }

    /**
     * Jumlah maksimal total skor (27 item x 4).
     */
    public static function totalMaks(): int
    {
        return count(static::itemSkala()) * 4;
    }

    /**
     * Hitung total skor dari data skor.
     *
     * @param  array<string, int|string|null>|null  $skor
     */
    public static function hitungTotal(?array $skor): int
    {
        if (! $skor) {
            return 0;
        }

        $total = 0;
        foreach (static::itemSkala() as $item) {
            $total += (int) ($skor[$item['kode']] ?? 0);
        }

        return $total;
    }
}
