import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function DokumentasiShow({ record }: { record: any }) {
    const { auth, flash } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === record.user_id;
    const canManage = isAdmin || isOwner;

    const handleDelete = () => {
        if (confirm('YAKIN INGIN MENGHAPUS DOKUMENTASI INI?')) {
            router.delete(`/observasi/dokumentasi/${record.id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail Dokumentasi" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Detail Dokumentasi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{record.user?.name}</p>
                    </div>
                    <Link href="/observasi/dokumentasi" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">
                        Kembali
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* TOMBOL AKSI */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {canManage && (
                        <>
                            <Link
                                href={`/observasi/dokumentasi/${record.id}/edit`}
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
                        <h3 className="text-xl font-black uppercase tracking-tighter">{record.judul}</h3>
                        <p className="text-sm font-bold text-gray-600 mt-1">Dokumentasi</p>
                    </div>

                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="p-3 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 w-56">Guru Pengunggah</td>
                                <td className="p-3 text-sm font-medium text-gray-800">{record.user?.name || '-'}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-3 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 w-56">Judul</td>
                                <td className="p-3 text-sm font-medium text-gray-800">{record.judul}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-3 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 w-56">Jumlah Gambar</td>
                                <td className="p-3 text-sm font-medium text-gray-800">{record.gambar?.length ?? 0}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-3 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 w-56">Tanggal Upload</td>
                                <td className="p-3 text-sm font-medium text-gray-800">
                                    {new Date(record.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="border-t-4 border-gray-900 p-5">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Keterangan</h4>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words font-medium">{record.keterangan || '-'}</p>
                    </div>

                    {/* GALERI GAMBAR */}
                    <div className="border-t-4 border-gray-900 p-5">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Galeri Gambar</h4>
                        {!record.gambar?.length ? (
                            <p className="text-sm text-gray-500 font-medium">Tidak ada gambar.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {record.gambar.map((g: any) => (
                                    <div key={g.id} className="border-2 border-gray-300 overflow-hidden">
                                        <a href={`/storage/${g.path}`} target="_blank" rel="noreferrer">
                                            <img src={`/storage/${g.path}`} alt={g.name} className="w-full h-56 object-cover" />
                                        </a>
                                        <div className="bg-gray-100 px-3 py-2 flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase truncate">{g.name}</span>
                                            <a
                                                href={`/observasi/dokumentasi/gambar/${g.id}/download`}
                                                className="bg-green-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-green-700 transition whitespace-nowrap"
                                            >
                                                UNDUH
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

DokumentasiShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;