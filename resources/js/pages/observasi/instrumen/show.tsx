import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function InstrumenShow({ instrumen, definisi, total, totalMaks }: { instrumen: any, definisi: any, total: number, totalMaks: number }) {
    const { auth, flash } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === instrumen.user_id;
    const canManage = isAdmin || isOwner;

    const skor = instrumen.skor || {};
    const komentar = instrumen.komentar || {};

    const skorBadge = (kode: string) => (
        <span className={`inline-block px-2 py-0.5 text-xs font-black border-2 ${(skor[kode] ?? 0) >= 3 ? 'bg-green-100 border-green-600 text-green-800' : (skor[kode] ?? 0) >= 2 ? 'bg-yellow-100 border-yellow-600 text-yellow-800' : 'bg-red-100 border-red-600 text-red-800'}`}>
            {skor[kode] ?? '-'}
        </span>
    );

    const handleDelete = () => {
        if (confirm('YAKIN INGIN MENGHAPUS INSTRUMEN INI?')) {
            router.delete(`/observasi/pra-instrumen/${instrumen.id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail Instrumen Umpan Balik" />
            <div className="max-w-[95%] mx-auto max-w-6xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Instrumen Umpan Balik Perencanaan Pembelajaran Mendalam</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{instrumen.judul_perencanaan}</p>
                    </div>
                    <Link href="/observasi" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">Kembali</Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* TOMBOL EXPORT EXCEL */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <a
                        href={`/observasi/pra-instrumen/${instrumen.id}/export/excel`}
                        className="bg-green-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-green-800 border-2 border-gray-900 transition shadow-md"
                    >
                        ⬇ EXPORT EXCEL (.XLSX)
                    </a>
                    {canManage && (
                        <>
                            <Link
                                href={`/observasi/pra-instrumen/${instrumen.id}/edit`}
                                className="bg-yellow-500 text-black px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-600 border-2 border-gray-900 transition shadow-md"
                            >
                                EDIT
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 border-2 border-gray-900 transition shadow-md"
                            >
                                HAPUS
                            </button>
                        </>
                    )}
                </div>

                {/* IDENTITAS */}
                <div className="border-2 border-gray-900 bg-gray-50 p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Jenjang</span><p className="text-sm font-bold">{instrumen.jenjang}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mata Pelajaran</span><p className="text-sm font-bold">{instrumen.mata_pelajaran}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kelas</span><p className="text-sm font-bold">{instrumen.kelas}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Judul Perencanaan</span><p className="text-sm font-bold">{instrumen.judul_perencanaan}</p></div>
                </div>

                {/* TABEL PENILAIAN */}
                <div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <table className="w-full text-left border-collapse table-auto min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                <th className="p-4 border-r border-gray-700 w-12 text-center whitespace-nowrap">NO</th>
                                <th className="p-4 border-r border-gray-700 whitespace-nowrap">ASPEK YANG DIAMATI</th>
                                <th className="p-4 border-r border-gray-700 w-20 text-center whitespace-nowrap">SKALA</th>
                                <th className="p-4 whitespace-nowrap">KOMENTAR KRITIS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(definisi.seksi as Record<string, any>).map(([key, seksi]: [string, any]) => (
                                <>
                                    <tr key={key} className="bg-yellow-400">
                                        <td colSpan={4} className="p-3 text-xs font-black uppercase tracking-widest border-t-2 border-b-2 border-gray-900">{seksi.nama}</td>
                                    </tr>
                                    {seksi.indikator.map((ind: any) => (
                                        ind.sub ? (
                                            <>
                                                <tr key={ind.kode} className="border-t-2 border-gray-200 bg-gray-100">
                                                    <td className="p-3 border-r-2 border-gray-200 text-center font-bold text-xs"></td>
                                                    <td className="p-3 border-r-2 border-gray-200 text-xs font-black uppercase text-gray-700 leading-relaxed">{ind.teks}</td>
                                                    <td className="p-3 border-r-2 border-gray-200 text-center">{skorBadge(ind.kode)}</td>
                                                    <td className="p-3 text-xs text-gray-600 italic">{komentar[ind.kode] || '-'}</td>
                                                </tr>
                                                {ind.sub.map((s: any) => (
                                                    <tr key={s.kode} className="border-t-2 border-gray-200 hover:bg-gray-50">
                                                        <td className="p-3 border-r-2 border-gray-200 text-center font-bold text-xs"></td>
                                                        <td className="p-3 border-r-2 border-gray-200 text-xs font-medium text-gray-700 pl-8">• {s.teks}</td>
                                                        <td className="p-3 border-r-2 border-gray-200 text-center">{skorBadge(s.kode)}</td>
                                                        <td className="p-3 text-xs text-gray-600 italic">{komentar[s.kode] || '-'}</td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr key={ind.kode} className="border-t-2 border-gray-200 hover:bg-gray-50">
                                                <td className="p-3 border-r-2 border-gray-200 text-center font-bold text-xs"></td>
                                                <td className="p-3 border-r-2 border-gray-200 text-xs font-medium text-gray-700 leading-relaxed">{ind.teks}</td>
                                                <td className="p-3 border-r-2 border-gray-200 text-center">{skorBadge(ind.kode)}</td>
                                                <td className="p-3 text-xs text-gray-600 italic">{komentar[ind.kode] || '-'}</td>
                                            </tr>
                                        )
                                    ))}
                                </>
                            ))}
                            <tr className="bg-gray-900 text-white">
                                <td className="p-4 border-r-2 border-gray-700 text-center font-black">TOTAL</td>
                                <td className="p-4 border-r-2 border-gray-700 text-xs font-black uppercase tracking-widest">Jumlah Total Skor</td>
                                <td className="p-4 text-center text-xl font-black">{total}</td>
                                <td className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-300">Maksimal: {totalMaks}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* CATATAN KUALITATIF */}
                <div className="border-2 border-gray-900 bg-white shadow-sm">
                    <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Catatan Kualitatif</div>
                    <div className="space-y-4 p-5">
                        {(definisi.catatan as any[]).map((cat: any) => (
                            <div key={cat.kode}>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{cat.teks}</h4>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words font-medium bg-gray-50 border border-gray-200 p-3">{instrumen[cat.kode] || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

InstrumenShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
