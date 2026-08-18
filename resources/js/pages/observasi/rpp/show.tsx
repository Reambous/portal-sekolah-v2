import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function RppShow({ record }: { record: any }) {
    const { auth, flash } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === record.user_id;
    const canManage = isAdmin || isOwner;

    const handleDelete = () => {
        if (confirm('YAKIN INGIN MENGHAPUS RPP / MODUL AJAR INI?')) {
            router.delete(`/observasi/rpp/${record.id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail RPP / Modul Ajar" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Detail RPP / Modul Ajar
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{record.user?.name}</p>
                    </div>
                    <Link href="/observasi/rpp" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">
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
                    <a
                        href={`/observasi/rpp/${record.id}/download`}
                        className="bg-green-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-green-800 border-2 border-gray-900 transition shadow-md"
                    >
                        ⬇ DOWNLOAD FILE
                    </a>
                    {canManage && (
                        <>
                            <Link
                                href={`/observasi/rpp/${record.id}/edit`}
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
                        <p className="text-sm font-bold text-gray-600 mt-1">RPP / Modul Ajar</p>
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
                                <td className="p-3 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 w-56">Nama File</td>
                                <td className="p-3 text-sm font-medium text-gray-800">{record.file_name}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-3 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 w-56">Ukuran File</td>
                                <td className="p-3 text-sm font-medium text-gray-800">{record.size_label}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-3 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 w-56">Tipe File</td>
                                <td className="p-3 text-sm font-medium text-gray-800">{record.mime_type || '-'}</td>
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
                </div>
            </div>
        </div>
    );
}

RppShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;