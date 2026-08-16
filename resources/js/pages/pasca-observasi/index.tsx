import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function PascaObservasiIndex({ records }: { records: any }) {
    const { auth, flash } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    const handleDelete = (id: number) => {
        if (confirm('YAKIN INGIN MENGHAPUS PASCA OBSERVASI INI?')) {
            router.delete(`/pasca-observasi/${id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Pasca Observasi" />
            <div className="max-w-[95%] mx-auto max-w-6xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Lembar Catatan Percakapan Pasca-Observasi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link
                        href="/pasca-observasi/create"
                        className="bg-gray-900 text-white px-6 py-3 text-xs font-bold uppercase hover:bg-yellow-500 hover:text-black transition border-2 border-gray-900"
                    >
                        + Tambah Pasca Observasi
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {records.data.length === 0 ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 text-yellow-800 text-sm font-bold uppercase tracking-wide">
                        ⚠️ Belum ada data pasca observasi
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <table className="w-full text-left border-collapse table-auto min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                    <th className="p-4 border-r border-gray-700">NO</th>
                                    <th className="p-4 border-r border-gray-700">HARI / TANGGAL</th>
                                    <th className="p-4 border-r border-gray-700">NAMA GURU</th>
                                    <th className="p-4 border-r border-gray-700">KELAS</th>
                                    <th className="p-4 border-r border-gray-700">MATA PELAJARAN</th>
                                    <th className="p-4">AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.data.map((record: any, idx: number) => (
                                    <tr key={record.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="p-4 text-sm font-bold text-gray-900">{idx + 1}</td>
                                        <td className="p-4 text-sm text-gray-700">
                                            {new Date(record.hari_tanggal).toLocaleDateString('id-ID', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="p-4 text-sm text-gray-700">{record.nama_guru}</td>
                                        <td className="p-4 text-sm text-gray-700">{record.kelas}</td>
                                        <td className="p-4 text-sm text-gray-700">{record.mata_pelajaran}</td>
                                        <td className="p-4 text-sm space-x-2 flex flex-wrap gap-2">
                                            <Link
                                                href={`/pasca-observasi/${record.id}`}
                                                className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase hover:bg-blue-700 transition"
                                            >
                                                Lihat
                                            </Link>
                                            {(isAdmin || auth?.user?.id === record.user_id) && (
                                                <>
                                                    <Link
                                                        href={`/pasca-observasi/${record.id}/edit`}
                                                        className="bg-yellow-500 text-black px-3 py-1 text-xs font-bold uppercase hover:bg-yellow-600 transition"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(record.id)}
                                                        className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase hover:bg-red-700 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {records.links && (
                    <div className="mt-6 flex justify-center gap-2">
                        {records.links.map((link: any, idx: number) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-2 text-xs font-bold uppercase border-2 transition ${
                                    link.active
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : link.url
                                          ? 'border-gray-900 text-gray-900 hover:bg-gray-100'
                                          : 'border-gray-300 text-gray-300 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

PascaObservasiIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
