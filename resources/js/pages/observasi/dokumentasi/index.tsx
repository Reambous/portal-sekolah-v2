import { Head, Link, router, usePage } from '@inertiajs/react';
import Pagination from '@/components/pagination';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function DokumentasiIndex({ data }: { data: any }) {
    const { flash, auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const rows = data.data || [];

    const handleDelete = (id: number) => {
        if (confirm('YAKIN INGIN MENGHAPUS DOKUMENTASI INI?')) {
            router.delete(`/observasi/dokumentasi/${id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Dokumentasi" />

            <div className="max-w-[95%] mx-auto">
                {/* HEADER */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Dokumentasi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Dokumentasi kegiatan pembelajaran
                        </p>
                    </div>
                    <span className="text-xs font-black uppercase bg-gray-900 text-white px-3 py-1.5 border-2 border-gray-900">
                        Sekolah: SMP Negeri 1 Candimulyo
                    </span>
                </div>

                {/* NOTIFIKASI */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* INFO FORMAT */}
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 text-blue-800 text-xs font-bold uppercase tracking-wide">
                    📷 Format: JPG, JPEG, PNG, WEBP • Maks: 10 MB per gambar • Maks: 10 gambar
                </div>

                {/* TOMBOL CREATE */}
                <div className="mb-6">
                    <Link
                        href="/observasi/dokumentasi/create"
                        className="inline-block bg-gray-900 text-white px-6 py-3 text-xs font-black uppercase tracking-widest border-2 border-gray-900 hover:bg-yellow-500 hover:text-black transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        ➕ TAMBAH DOKUMENTASI
                    </Link>
                </div>

                {/* REKAP */}
                <div className="mb-10">
                    <h3 className="text-lg font-black uppercase tracking-tighter border-b-4 border-gray-900 pb-2 mb-4">
                        Rekap Dokumentasi
                    </h3>
                    <div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <table className="w-full text-left border-collapse table-auto min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                    <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">GURU</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">JUDUL</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">GAMBAR</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">TANGGAL</th>
                                    <th className="p-4 w-56 text-center whitespace-nowrap">AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                                            Belum ada dokumentasi.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((item: any, index: number) => (
                                        <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                                            <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs">{data.from + index}</td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                                                <div className="font-black text-gray-900 uppercase truncate">{item.user?.name || '-'}</div>
                                            </td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                                                <div className="font-black text-gray-900 uppercase truncate">{item.judul}</div>
                                                {item.keterangan && (
                                                    <div className="text-[10px] text-gray-400 font-medium line-clamp-2">{item.keterangan}</div>
                                                )}
                                            </td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-600">{item.gambar_count ?? 0} gambar</td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-500 whitespace-nowrap">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex gap-1 justify-center">
                                                    <Link href={`/observasi/dokumentasi/${item.id}`} className="bg-blue-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition inline-block">
                                                        DETAIL
                                                    </Link>
                                                    {(isAdmin || auth?.user?.id === item.user_id) && (
                                                        <>
                                                            <Link href={`/observasi/dokumentasi/${item.id}/edit`} className="bg-yellow-500 text-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-yellow-600 transition inline-block">
                                                                EDIT
                                                            </Link>
                                                            <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition inline-block">
                                                                HAPUS
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination paginator={data} />
                </div>
            </div>
        </div>
    );
}

DokumentasiIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;