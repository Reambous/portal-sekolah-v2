<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObservasiPelaksanaan extends Model
{
    protected $table = 'observasi_pelaksanaan';

    protected $guarded = [];

    protected $casts = [
        'user_id' => 'integer',
        'hari_tanggal' => 'date',
        'bukti' => 'array',
        'catatan' => 'array',
        'refleksi' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Definisi struktur indikator observasi pelaksanaan (satu sumber kebenaran).
     * Dipakai untuk form React, halaman detail, dan export Excel.
     *
     * @return array<string, mixed>
     */
    public static function definisi(): array
    {
        return [
            'seksi' => [
                'keselarasan' => [
                    'nama' => 'Keselarasan',
                    'indikator' => [
                        [
                            'kode' => 'i1',
                            'teks' => 'Tindakan implementasi perencanaan selaras dengan perencanaan pembelajaran pada:',
                            'sub' => [
                                ['kode' => 'i1a', 'teks' => 'awal pembelajaran'],
                                ['kode' => 'i1b', 'teks' => 'inti pembelajaran dalam proses memahami, mengaplikasi, dan merefleksi'],
                                ['kode' => 'i1c', 'teks' => 'penutupan pembelajaran'],
                            ],
                        ],
                        [
                            'kode' => 'i2',
                            'teks' => 'Upaya mencapai tujuan pembelajaran menuju pencapaian dimensi profil lulusan selaras dengan perencanaan pembelajaran',
                            'sub' => [
                                ['kode' => 'i2a', 'teks' => 'selaras dengan perencanaan pembelajaran'],
                                ['kode' => 'i2b', 'teks' => 'disesuaikan dengan konteks kebutuhan belajar siswa'],
                            ],
                        ],
                    ],
                ],
                'kerangka' => [
                    'nama' => 'Implementasi Kerangka Pembelajaran',
                    'indikator' => [
                        [
                            'kode' => 'i3',
                            'teks' => 'Strategi pembelajaran yang diimplementasikan untuk mencapai tujuan',
                            'sub' => [
                                ['kode' => 'i3a', 'teks' => 'sudah sesuai dengan perencanaan'],
                                ['kode' => 'i3b', 'teks' => 'dimodifikasi agar sesuai dengan kebutuhan belajar dalam situasi kondisi yang ada'],
                                ['kode' => 'i3c', 'teks' => 'tantangan yang dihadapi dalam menggunakan strategi untuk memfasilitasi tercapainya CP'],
                            ],
                        ],
                        ['kode' => 'i4', 'teks' => 'Lingkungan belajar yang diimplementasikan sudah tergambar pada langkah pembelajaran dan/atau asesmen pembelajaran'],
                        ['kode' => 'i5', 'teks' => 'Kemitraan pembelajaran yang diimplementasikan sudah tergambar pada langkah pembelajaran dan/atau asesmen pembelajaran'],
                        ['kode' => 'i6', 'teks' => 'Pemanfaatan digital yang diimplementasikan sudah tergambar pada langkah pembelajaran dan/atau asesmen pembelajaran'],
                    ],
                ],
                'langkah' => [
                    'nama' => 'Langkah Pembelajaran',
                    'indikator' => [
                        ['kode' => 'i7', 'teks' => 'Langkah pembelajaran yang dilakukan sesuai perencanaan dapat memfasilitasi tindakan saling MEMULIAKAN antara Guru-Murid, Murid-Guru, Murid-Murid yang tercermin dalam bahasa verbal dan nonverbal'],
                        [
                            'kode' => 'i8',
                            'teks' => 'Langkah pembelajaran sudah memfasilitasi murid untuk merasakan pengalaman belajar MEMAHAMI (terlibat aktif mengonstruksi pengetahuan agar dapat memahami secara mendalam konsep atau materi dari berbagai sumber dan konteks)',
                            'sub' => [
                                ['kode' => 'i8a', 'teks' => 'Menghubungkan pengetahuan baru dengan pengetahuan sebelumnya'],
                                ['kode' => 'i8b', 'teks' => 'Menstimulasi proses berpikir peserta didik'],
                                ['kode' => 'i8c', 'teks' => 'Menghubungkan dengan konteks nyata dan/atau kehidupan sehari-hari'],
                                ['kode' => 'i8d', 'teks' => 'Memberikan kebebasan eksploratif dan kolaboratif'],
                                ['kode' => 'i8e', 'teks' => 'Menanamkan nilai-nilai moral dan etika dan nilai positif lainnya'],
                                ['kode' => 'i8f', 'teks' => 'Mengaitkan pembelajaran dengan pembentukan karakter peserta didik'],
                            ],
                        ],
                        [
                            'kode' => 'i9',
                            'teks' => 'Langkah pembelajaran sudah memfasilitasi murid untuk merasakan pengalaman belajar MENGAPLIKASI (mengaplikasi pemahaman secara kontekstual dalam kehidupan nyata sebagai bagian dari pendalaman pengetahuan)',
                            'sub' => [
                                ['kode' => 'i9a', 'teks' => 'Menghubungkan konsep baru dengan pengetahuan sebelumnya'],
                                ['kode' => 'i9b', 'teks' => 'Menerapkan pengetahuan ke dalam situasi nyata atau bidang lain'],
                                ['kode' => 'i9c', 'teks' => 'Mengembangkan pemahaman dengan eksplorasi lebih lanjut'],
                                ['kode' => 'i9d', 'teks' => 'Berpikir kritis dan mencari solusi inovatif berdasarkan pengetahuan yang ada'],
                            ],
                        ],
                        [
                            'kode' => 'i10',
                            'teks' => 'Langkah pembelajaran sudah memfasilitasi murid untuk merasakan pengalaman belajar MEREFLEKSI (mengevaluasi dan memaknai proses serta hasil dari tindakan atau praktik nyata yang telah mereka lakukan dan menentukan tindaklanjut ke depan; serta mengelola proses belajarnya secara mandiri)',
                            'sub' => [
                                ['kode' => 'i10a', 'teks' => 'Memotivasi diri sendiri untuk terus belajar bagaimana cara belajar'],
                                ['kode' => 'i10b', 'teks' => 'Refleksi terhadap pencapaian tujuan pembelajaran (evaluasi diri)'],
                                ['kode' => 'i10c', 'teks' => 'Menerapkan strategi berpikir'],
                                ['kode' => 'i10d', 'teks' => 'Memiliki kemampuan metakognisi (meregulasi diri dalam pembelajaran)'],
                                ['kode' => 'i10e', 'teks' => 'Meregulasi emosi dalam pembelajaran'],
                            ],
                        ],
                        ['kode' => 'i11', 'teks' => 'Prinsip pembelajaran mendalam berupa berkesadaran, bermakna, dan/atau menggembirakan sudah tergambar pada setiap pengalaman belajar di langkah pembelajaran yang diimplementasikan'],
                        ['kode' => 'i12', 'teks' => 'Praktik pembelajaran sudah mengakomodir pengalaman belajar yang sesuai dengan karakteristik peserta didik (umur, tingkat perkembangan, kemampuan, bakat dan minat, gaya belajar, dll.)'],
                    ],
                ],
                'asesmen' => [
                    'nama' => 'Asesmen',
                    'indikator' => [
                        ['kode' => 'i13', 'teks' => 'Asesmen pada awal pembelajaran telah dilaksanakan untuk mendapatkan bukti kesiapan belajar secara emosional dan mental, pengetahuan awal, dan kebutuhan belajar murid'],
                        ['kode' => 'i14', 'teks' => 'Asesmen selama proses pembelajaran telah dilaksanakan sesuai perencanaan untuk memantau perkembangan belajar murid, memberikan umpan balik untuk perbaikan kontinyu (baik dari guru ke murid, maupun dari murid ke guru), melalui beragam teknik'],
                        ['kode' => 'i15', 'teks' => 'Asesmen hasil pembelajaran direncanakan untuk mengukur pencapaian kompetensi sebagai bukti keberhasilan pembelajaran dengan beragam cara, antara lain: tes, portofolio, proyek, presentasi, dsb.'],
                    ],
                ],
                'refleksi' => [
                    'nama' => 'Refleksi',
                    'indikator' => [
                        ['kode' => 'r16', 'teks' => 'Pelajaran apa yang telah diperoleh dari Implementasi Perencanaan Pembelajaran yang telah dilakukan beserta faktor-faktor pendukungnya?'],
                        ['kode' => 'r17', 'teks' => 'Hal-hal apa saja yang pencapaiannya belum memuaskan dari Implementasi Perencanaan Pembelajaran yang telah dilakukan beserta faktor-faktor penghambatnya?'],
                        ['kode' => 'r18', 'teks' => 'Rencana tindak lanjut apa yang akan dibuat untuk perbaikan ke depan?'],
                    ],
                ],
            ],
        ];
    }

    /**
     * Daftar semua item (indikator + sub) yang memiliki input bukti & catatan.
     *
     * @return array<int, array{kode: string, teks: string}>
     */
    public static function itemList(): array
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
     * Total item yang punya bukti & catatan (untuk validasi).
     */
    public static function totalItems(): int
    {
        return count(static::itemList());
    }
}
