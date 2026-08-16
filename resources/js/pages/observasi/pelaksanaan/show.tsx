import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function PelaksanaanShow({ observasi, definisi }: { observasi: any; definisi: any }) {
    const { auth, flash } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === observasi.user_id;
    const canManage = isAdmin || isOwner;

    const bukti = observasi.bukti || {};
    const catatan = observasi.catatan || {};
    const refleksi = observasi.refleksi || {};

    const handleDelete = () => {
        if (confirm('YAKIN INGIN MENGHAPUS OBSERVASI INI?')) {
            router.delete(`/observasi/pelaksanaan/${observasi.id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail Observasi Pelaksanaan" />
            <div className="max-w-[95%] mx-auto max-w-6xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Instrumen Implementasi dan Refleksi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{observasi.nama_guru}</p>
                    </div>
                    <Link href="/observasi/pelaksanaan" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">
                        Kembali
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* TOMBOL EXPORT EXCEL */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <a
                        href={`/observasi/pelaksanaan/${observasi.id}/export/excel`}
                        className="bg-green-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-green-800 border-2 border-gray-900 transition shadow-md"
                    >
                        ⬇ EXPORT EXCEL (.XLSX)
                    </a>
                    {canManage && (
                        <>
                            <Link
                                href={`/observasi/pelaksanaan/${observasi.id}/edit`}
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
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hari / Tanggal</span><p className="text-sm font-bold">{new Date(observasi.hari_tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Satuan Pendidikan</span><p className="text-sm font-bold">SMP Negeri 1 Candimulyo</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Guru</span><p className="text-sm font-bold">{observasi.nama_guru}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kelas / Semester</span><p className="text-sm font-bold">{observasi.kelas_semester}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mata Pelajaran</span><p className="text-sm font-bold">{observasi.mata_pelajaran}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pemberi Umpan Balik</span><p className="text-sm font-bold">{observasi.pemberi_umpan_balik}</p></div>
                </div>

                {/* TABEL PENILAIAN */}
                <div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <table className="w-full text-left border-collapse table-auto min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                                <th className="p-4 border-r border-gray-700">ASPEK YANG DIAMATI</th>
                                <th className="p-4 border-r border-gray-700">BUKTI PEMBELAJARAN</th>
                                <th className="p-4">CATATAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(definisi.seksi as Record<string, any>).map(([seksiKey, seksi]) => (
                                <Fragment seksiKey={seksiKey} seksi={seksi} bukti={bukti} catatan={catatan} key={seksiKey} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* REFLEKSI */}
                <div className="border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Refleksi</div>
                    <div className="space-y-5 p-5">
                        {(definisi.seksi.refleksi.indikator as any[]).map((ref: any) => (
                            <div key={ref.kode}>
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{ref.teks}</h4>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words font-medium">{refleksi[ref.kode] || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Fragment = ({ seksi, bukti, catatan, seksiKey }: { seksi: any; bukti: any; catatan: any; seksiKey: string }) => {
    if (seksiKey === 'refleksi') {
return null;
}

    return (
        <>
            <tr>
                <td colSpan={4} className="p-4 bg-yellow-400 text-xs font-black uppercase tracking-widest border-t-2 border-gray-900">
                    {seksi.nama}
                </td>
            </tr>
            {seksi.indikator.map((ind: any) => (
                <FragmentRow key={ind.kode} ind={ind} bukti={bukti} catatan={catatan} />
            ))}
        </>
    );
};

const FragmentRow = ({ ind, bukti, catatan }: { ind: any; bukti: any; catatan: any }) => {
    const rowCount = 1 + (ind.sub ? ind.sub.length : 0);

    return (
        <>
            <tr className="border-t border-gray-200">
                <td rowSpan={rowCount} className="p-4 text-center font-bold text-xs bg-gray-50 align-top">{ind.kode.replace('i', '')}</td>
                <td className="p-4 text-xs font-bold text-gray-900">{ind.teks}</td>
                <td rowSpan={rowCount} className="p-4 text-xs text-gray-700 whitespace-pre-wrap align-top">{bukti[ind.kode] || '-'}</td>
                <td rowSpan={rowCount} className="p-4 text-xs text-gray-700 whitespace-pre-wrap align-top">{catatan[ind.kode] || '-'}</td>
            </tr>
            {ind.sub &&
                ind.sub.map((sub: any, subIdx: number) => (
                    <tr key={sub.kode} className="border-t border-gray-200 bg-gray-50">
                        <td className="p-4 text-xs text-gray-600 pl-8">    {sub.teks}</td>
                    </tr>
                ))}
        </>
    );
};

PelaksanaanShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
