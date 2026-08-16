import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function PascaObservasiShow({ record }: { record: any }) {
    const { auth, flash } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === record.user_id;
    const canManage = isAdmin || isOwner;

    const handleDelete = () => {
        if (confirm('YAKIN INGIN MENGHAPUS LEMBAR CATATAN PASCA-OBSERVASI INI?')) {
            router.delete(`/pasca-observasi/${record.id}`);
        }
    };

    const row = 'border-b border-gray-300';
    const label = 'p-3 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 w-56';
    const value = 'p-3 text-sm font-medium text-gray-800';

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail Lembar Catatan Pasca-Observasi" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-1">Lembar Catatan Percakapan Pasca-Observasi Kelas</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link href="/pasca-observasi" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">Kembali</Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* TOMBOL EXPORT WORD */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <a
                        href={`/pasca-observasi/${record.id}/export/word`}
                        className="bg-blue-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-blue-800 border-2 border-gray-900 transition shadow-md"
                    >
                        ⬇ EXPORT WORD (.DOCX)
                    </a>
                    {canManage && (
                        <>
                            <Link
                                href={`/pasca-observasi/${record.id}/edit`}
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

                {/* DOKUMEN */}
                <div className="border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                    <div className="border-b-4 border-gray-900 p-6 text-center">
                        <h3 className="text-xl font-black uppercase tracking-tighter">Lembar Catatan Percakapan Pasca-Observasi Kelas</h3>
                        <p className="text-sm font-bold text-gray-600 mt-1">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>

                    {/* Identitas grid 2 kolom (mengikuti Lampiran 6) */}
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className={row}>
                                <td className={label}>Hari / Tanggal</td>
                                <td className={value}>{new Date(record.hari_tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                <td className={label}>Sekolah</td>
                                <td className={value}>SMP Negeri 1 Candimulyo</td>
                            </tr>
                            <tr className={row}>
                                <td className={label}>Nama Guru</td>
                                <td className={value}>{record.nama_guru}</td>
                                <td className={label}>Kelas</td>
                                <td className={value}>{record.kelas}</td>
                            </tr>
                            <tr>
                                <td className={label}>Mata Pelajaran</td>
                                <td className={value}>{record.mata_pelajaran}</td>
                                <td className={label}>Waktu Percakapan</td>
                                <td className={value}>{record.waktu_percakapan}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="border-t-4 border-gray-900">
                        {[
                            ['Catatan Refleksi Guru:', record.catatan_refleksi_guru],
                            ['Topik percakapan dan catatan:', record.topik_percakapan_catatan],
                            ['Rencana Tindak Lanjut:', record.rencana_tindak_lanjut],
                        ].map(([judul, isi]) => (
                            <div key={judul} className="border-b-2 border-gray-200 p-5">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{judul}</h4>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words font-medium">{isi || '-'}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tanda tangan (mengikuti Lampiran 6) */}
                    <div className="border-t-4 border-gray-900">
                        <div className="p-4 text-center border-b-2 border-gray-300">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Disepakati bersama</p>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-8">
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-widest mb-10">Supervisor</p>
                                <p className="text-sm font-bold">{record.supervisor}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-widest mb-10">Guru Mapel</p>
                                <p className="text-sm font-bold">(………………)</p>
                            </div>
                        </div>
                        <div className="border-t-2 border-gray-200 p-4 grid grid-cols-2 gap-8 text-center">
                            <p className="text-xs font-bold text-gray-500">NIP. 19751222 200604 1 006</p>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Guru</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

PascaObservasiShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;