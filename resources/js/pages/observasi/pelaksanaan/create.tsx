import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function PelaksanaanCreate({ definisi, itemUtama }: { definisi: any; itemUtama: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        hari_tanggal: '',
        nama_guru: '',
        kelas_semester: '',
        mata_pelajaran: '',
        pemberi_umpan_balik: '',
        bukti: Object.fromEntries(itemUtama.map((item: any) => [item.kode, ''])),
        catatan: Object.fromEntries(itemUtama.map((item: any) => [item.kode, ''])),
        refleksi: {
            r16: '',
            r17: '',
            r18: '',
        },
    });

    const [expandedSeksi, setExpandedSeksi] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/observasi/pelaksanaan');
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';

    const setBukti = (kode: string, value: string) => {
        setData('bukti', { ...data.bukti, [kode]: value });
    };

    const setCatatan = (kode: string, value: string) => {
        setData('catatan', { ...data.catatan, [kode]: value });
    };

    const setRefleksi = (kode: string, value: string) => {
        setData('refleksi', { ...data.refleksi, [kode]: value });
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Observasi Pelaksanaan - Create" />
            <div className="max-w-[95%] mx-auto max-w-6xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Instrumen Implementasi dan Refleksi Perencanaan Pembelajaran
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link
                        href="/observasi/pelaksanaan"
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition"
                    >
                        Kembali
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* IDENTITAS */}
                    <div className="border-2 border-gray-900">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Identitas</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Hari / Tanggal</label>
                                <input
                                    type="date"
                                    className={field}
                                    value={data.hari_tanggal}
                                    onChange={(e) => setData('hari_tanggal', e.target.value)}
                                    required
                                />
                                {errors.hari_tanggal && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.hari_tanggal}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Nama Guru</label>
                                <input
                                    type="text"
                                    className={field}
                                    placeholder="Nama guru"
                                    value={data.nama_guru}
                                    onChange={(e) => setData('nama_guru', e.target.value)}
                                    required
                                />
                                {errors.nama_guru && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.nama_guru}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Kelas / Semester</label>
                                <input
                                    type="text"
                                    className={field}
                                    placeholder="Contoh: VIII D"
                                    value={data.kelas_semester}
                                    onChange={(e) => setData('kelas_semester', e.target.value)}
                                    required
                                />
                                {errors.kelas_semester && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.kelas_semester}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Mata Pelajaran</label>
                                <input
                                    type="text"
                                    className={field}
                                    placeholder="Contoh: IPA"
                                    value={data.mata_pelajaran}
                                    onChange={(e) => setData('mata_pelajaran', e.target.value)}
                                    required
                                />
                                {errors.mata_pelajaran && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.mata_pelajaran}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Pemberi Umpan Balik</label>
                                <input
                                    type="text"
                                    className={field}
                                    placeholder="Nama pemberi umpan balik"
                                    value={data.pemberi_umpan_balik}
                                    onChange={(e) => setData('pemberi_umpan_balik', e.target.value)}
                                    required
                                />
                                {errors.pemberi_umpan_balik && (
                                    <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.pemberi_umpan_balik}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TABEL PENILAIAN */}
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="grid grid-cols-12 gap-0 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest">
                            <div className="lg:col-span-1 col-span-12 px-4 py-2 text-center">No</div>
                            <div className="lg:col-span-5 col-span-12 px-4 py-2">Aspek yang Diamati</div>
                            <div className="lg:col-span-3 col-span-12 px-4 py-2">Bukti Pembelajaran</div>
                            <div className="lg:col-span-3 col-span-12 px-4 py-2">Catatan</div>
                        </div>

                        {Object.entries(definisi.seksi).map(([seksiKey, seksi]: [string, any]) => (
                            <div key={seksiKey}>
                                <div
                                    className="bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-widest border-t-2 border-gray-900 cursor-pointer hover:bg-yellow-500 transition"
                                    onClick={() => setExpandedSeksi(expandedSeksi === seksiKey ? null : seksiKey)}
                                >
                                    {seksi.nama}
                                </div>

                                {expandedSeksi === seksiKey &&
                                    seksi.indikator.map((ind: any) => {
                                        const no = itemUtama.findIndex((it: any) => it.kode === ind.kode) + 1;
                                        return (
                                            <div key={ind.kode}>
                                                <div className="grid grid-cols-12 gap-0 border-t-2 border-gray-200 p-2">
                                                    <div className="lg:col-span-1 col-span-12 px-2 text-center text-xs font-bold">{no}</div>
                                                    <div className="lg:col-span-5 col-span-12 px-2 text-xs font-bold">{ind.teks}</div>
                                                    <div className="lg:col-span-3 col-span-12 px-1">
                                                        <textarea
                                                            rows={2}
                                                            className="border-2 border-gray-300 p-2 text-xs w-full focus:border-gray-900 focus:ring-0"
                                                            placeholder="Bukti pembelajaran"
                                                            value={data.bukti[ind.kode] || ''}
                                                            onChange={(e) => setBukti(ind.kode, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="lg:col-span-3 col-span-12 px-1">
                                                        <textarea
                                                            rows={2}
                                                            className="border-2 border-gray-300 p-2 text-xs w-full focus:border-gray-900 focus:ring-0"
                                                            placeholder="Catatan"
                                                            value={data.catatan[ind.kode] || ''}
                                                            onChange={(e) => setCatatan(ind.kode, e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Sub-indikator: teks saja, tanpa input */}
                                                {ind.sub &&
                                                    ind.sub.map((sub: any, subIdx: number) => (
                                                        <div key={sub.kode} className="grid grid-cols-12 gap-0 border-t border-gray-200 p-2 bg-gray-50">
                                                            <div className="lg:col-span-1 col-span-12 px-2 text-center text-xs font-bold text-gray-400">{no}.{String.fromCharCode(97 + subIdx)}</div>
                                                            <div className="lg:col-span-5 col-span-12 px-2 text-xs">    {sub.teks}</div>
                                                            <div className="lg:col-span-3 col-span-12 px-2 text-[10px] text-gray-400 uppercase">Bukti & catatan di atas</div>
                                                            <div className="lg:col-span-3 col-span-12 px-2"></div>
                                                        </div>
                                                    ))}
                                            </div>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>

                    {/* REFLEKSI */}
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Refleksi</div>
                        <div className="space-y-5 p-5">
                            {definisi.seksi.refleksi.indikator.map((ref: any) => (
                                <div key={ref.kode}>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">{ref.teks}</label>
                                    <textarea
                                        rows={4}
                                        className={field}
                                        value={data.refleksi[ref.kode] || ''}
                                        onChange={(e) => setRefleksi(ref.kode, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gray-900 text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition shadow-md disabled:opacity-50"
                        >
                            {processing ? 'MENYIMPAN...' : 'SIMPAN OBSERVASI'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

PelaksanaanCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
