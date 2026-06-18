import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function KegiatanIndex({ kegiatan, filters }: { kegiatan: any, filters: any }) {
    const { flash, auth } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const dataKegiatan = kegiatan.data || [];
    const isAdmin = auth?.user?.role === 'admin';

    // State untuk menampung ID checkbox massal
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kesiswaan/kegiatan', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleUpdateStatus = (id: number, statusBaru: string) => {
        if (confirm(`UBAH STATUS KEGIATAN MENJADI [${statusBaru.toUpperCase()}]?`)) {
            router.put(`/kesiswaan/kegiatan/${id}/status`, { status: statusBaru });
        }
    };

    const handleDeleteSingle = (id: number) => {
        if (confirm('⚠️ Hapus data catatan kegiatan ini secara permanen?')) {
            router.delete(`/kesiswaan/kegiatan/${id}`);
        }
    };

    // Logika Checkbox Massal
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(dataKegiatan.map((item: any) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(item => item !== id));
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`⚠️ Hapus ${selectedIds.length} catatan kegiatan yang dipilih secara massal?`)) {
            router.post('/kesiswaan/kegiatan/bulk-delete', { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Jurnal Kegiatan Kesiswaan" />

            <div className="max-w-[95%] mx-auto">
                {/* HEADER */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Jurnal Kegiatan Kesiswaan
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Pengarsipan & Evaluasi Agenda Kegiatan Sekolah
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 md:flex-none mr-2">
                            <input
                                type="text"
                                placeholder="CARI AGENDA KEGIATAN..."
                                className="w-full md:w-64 border-2 border-gray-900 border-r-0 px-3 py-2 text-xs font-bold uppercase focus:ring-0 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="bg-gray-900 text-white border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition">
                                CARI
                            </button>
                        </form>
                        
                        <a 
                            href="/kesiswaan/kegiatan/export/csv" 
                            className="bg-green-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-green-800 border-2 border-green-700 transition shadow-sm"
                        >
                            EXCEL / CSV
                        </a>

                        <Link 
                            href="/kesiswaan/kegiatan/create" 
                            className="bg-gray-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-sm"
                        >
                            + CATAT KEGIATAN
                        </Link>
                    </div>
                </div>

                {/* NOTIFIKASI */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* ACTION BULK DELETE */}
                {isAdmin && selectedIds.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 flex justify-between items-center animate-fade-in">
                        <span className="text-xs font-black text-red-800 uppercase">
                            Terpilih {selectedIds.length} Agenda Kegiatan
                        </span>
                        <button 
                            onClick={handleBulkDelete}
                            className="bg-red-600 text-white px-4 py-1.5 text-xs font-black uppercase tracking-wider hover:bg-red-700 transition"
                        >
                            ❌ HAPUS MASSAL
                        </button>
                    </div>
                )}

                {/* TABEL DATA UTAMA */}
                <div className="bg-white border-2 border-gray-900 shadow-sm overflow-hidden mb-8">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                {isAdmin && (
                                    <th className="p-4 border-r border-gray-700 w-12 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="focus:ring-0 rounded-none border-2 border-gray-400 text-gray-900"
                                            onChange={handleSelectAll}
                                            checked={dataKegiatan.length > 0 && selectedIds.length === dataKegiatan.length}
                                        />
                                    </th>
                                )}
                                <th className="p-4 border-r border-gray-700 w-16 text-center">NO</th>
                                <th className="p-4 border-r border-gray-700 w-28">TANGGAL</th>
                                <th className="p-4 border-r border-gray-700 w-2/5">NAMA AGENDA KEGIATAN</th>
                                <th className="p-4 border-r border-gray-700 w-1/4">EVALUASI / REFLEKSI</th>
                                <th className="p-4 border-r border-gray-700 w-28 text-center">STATUS</th>
                                <th className="p-4 w-36 text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataKegiatan.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 7 : 6} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                                        Belum ada data jurnal kegiatan kesiswaan.
                                    </td>
                                </tr>
                            ) : (
                                dataKegiatan.map((item: any, index: number) => (
                                    <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                                        {isAdmin && (
                                            <td className="p-4 border-r-2 border-gray-200 text-center">
                                                <input 
                                                    type="checkbox"
                                                    className="focus:ring-0 rounded-none border-2 border-gray-300 text-gray-900"
                                                    checked={selectedIds.includes(item.id)}
                                                    onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                                                />
                                            </td>
                                        )}
                                        <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs">
                                            {kegiatan.from + index}
                                        </td>
                                        
                                        <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-600">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        
                                        <td className="p-4 border-r-2 border-gray-200 text-xs">
                                            <div className="font-black text-gray-900 uppercase truncate mb-0.5" title={item.nama_kegiatan}>
                                                {item.nama_kegiatan}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase">
                                                Oleh: {item.user ? item.user.name : '-'}
                                            </div>
                                        </td>
                                        
                                        <td className="p-4 border-r-2 border-gray-200 text-xs font-medium text-gray-600">
                                            <div className="truncate italic" title={item.refleksi}>
                                                "{item.refleksi || '-'}"
                                            </div>
                                        </td>
                                        
                                        <td className="p-4 border-r-2 border-gray-200 text-center">
                                            <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border-2 ${
                                                item.status === 'disetujui' 
                                                ? 'bg-green-100 border-green-600 text-green-800' 
                                                : 'bg-yellow-100 border-yellow-600 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        
                                        <td className="p-3 text-center">
                                            <div className="flex flex-col gap-1 items-center">
                                                <Link 
                                                    href={`/kesiswaan/kegiatan/${item.id}`}
                                                    className="bg-blue-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition w-full text-center"
                                                >
                                                    DETAIL
                                                </Link>

                                                {isAdmin && (
                                                    <>
                                                        {item.status === 'pending' ? (
                                                            <button onClick={() => handleUpdateStatus(item.id, 'disetujui')} className="bg-green-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-green-700 transition w-full">
                                                                ✔ ACC
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleUpdateStatus(item.id, 'pending')} className="border border-gray-300 text-gray-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:border-red-600 hover:text-red-600 transition w-full">
                                                                BATAL
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleDeleteSingle(item.id)}
                                                            className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition w-full"
                                                        >
                                                            🗑️ HAPUS
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
            </div>
        </div>
    );
}

KegiatanIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;