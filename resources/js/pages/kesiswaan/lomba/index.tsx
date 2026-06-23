import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function LombaIndex({ lomba, filters }: { lomba: any, filters: any }) {
    const { flash, auth } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const dataLomba = lomba.data || [];
    const isAdmin = auth?.user?.role === 'admin';

    // State untuk menampung ID yang dicentang (Bulk Delete)
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kesiswaan/lomba', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleUpdateStatus = (id: number, statusBaru: string) => {
        if (confirm(`UBAH STATUS PERMOHONAN MENJADI [${statusBaru.toUpperCase()}]?`)) {
            router.put(`/kesiswaan/lomba/${id}/status`, { status: statusBaru });
        }
    };

    // Fungsi Hapus Tunggal langsung dari Index
    const handleDeleteSingle = (id: number) => {
        if (confirm('⚠️ Hapus data rekaman lomba ini secara permanen?')) {
            router.delete(`/kesiswaan/lomba/${id}`);
        }
    };

    // Logika Checkbox Massal
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(dataLomba.map((item: any) => item.id));
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
        if (confirm(`⚠️ Hapus ${selectedIds.length} data lomba yang dipilih secara massal?`)) {
            router.post('/kesiswaan/lomba/bulk-delete', { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Kegiatan Lomba Kesiswaan" />

            <div className="max-w-[95%] mx-auto">
                {/* HEADER */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Kegiatan Lomba
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Rekam Jejak Prestasi & Ajuan Lomba Siswa
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 md:flex-none mr-2">
                            <input
                                type="text"
                                placeholder="CARI LOMBA / SISWA..."
                                className="w-full md:w-64 border-2 border-gray-900 border-r-0 px-3 py-2 text-xs font-bold uppercase focus:ring-0 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="bg-gray-900 text-white border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition">
                                CARI
                            </button>
                        </form>
                        
                        <a 
                            href="/kesiswaan/lomba/export/csv" 
                            className="bg-green-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-green-800 border-2 border-green-700 transition shadow-sm"
                        >
                            EXCEL / CSV
                        </a>

                        <Link 
                            href="/kesiswaan/lomba/create" 
                            className="bg-gray-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-sm"
                        >
                            + AJUKAN LOMBA
                        </Link>
                    </div>
                </div>

                {/* NOTIFIKASI */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* TOMBOL BULK DELETE */}
                {isAdmin && selectedIds.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 flex justify-between items-center animate-fade-in">
                        <span className="text-xs font-black text-red-800 uppercase">
                            Terpilih {selectedIds.length} Data Lomba
                        </span>
                        <button 
                            onClick={handleBulkDelete}
                            className="bg-red-600 text-white px-4 py-1.5 text-xs font-black uppercase tracking-wider hover:bg-red-700 transition"
                        >
                            ❌ HAPUS SEKALIGUS
                        </button>
                    </div>
                )}

                {/* TABEL DATA LOMBA (RESPONSIVE BRUTALIST VERSION) */}
<div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
    {/* KUNCI: Mengubah ke table-auto dan memaksa lebar minimal 1000px agar HP bisa melakukan scroll geser */}
    <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
        <thead>
            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                {isAdmin && (
                    <th className="p-4 border-r border-gray-700 w-12 text-center">
                        <input 
                            type="checkbox" 
                            className="focus:ring-0 rounded-none border-2 border-gray-400 text-gray-900"
                            onChange={handleSelectAll}
                            checked={dataLomba.length > 0 && selectedIds.length === dataLomba.length}
                        />
                    </th>
                )}
                {/* KUNCI: Menambahkan whitespace-nowrap di semua header agar teks judul tidak patah baris kebawah */}
                <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                <th className="p-4 border-r border-gray-700 w-32 whitespace-nowrap">TANGGAL</th>
                <th className="p-4 border-r border-gray-700 whitespace-nowrap">DETAIL PERLOMBAAN</th>
                <th className="p-4 border-r border-gray-700 whitespace-nowrap">DIIKUTI OLEH</th>
                <th className="p-4 border-r border-gray-700 w-28 text-center whitespace-nowrap">STATUS</th>
                <th className="p-4 w-36 text-center whitespace-nowrap">AKSI</th>
            </tr>
        </thead>
        <tbody>
            {dataLomba.length === 0 ? (
                <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                        Belum ada data rekaman lomba.
                    </td>
                </tr>
            ) : (
                dataLomba.map((item: any, index: number) => (
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
                        <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs whitespace-nowrap">
                            {lomba.from + index}
                        </td>
                        
                        <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-600 whitespace-nowrap">
                            {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </td>
                        
                        {/* KUNCI: Memasang max-w-xs dan truncate pada kolom detail teks panjang */}
                        <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                            <div className="font-black text-gray-900 uppercase truncate mb-0.5" title={item.jenis_lomba}>
                                {item.jenis_lomba}
                            </div>
                            <div className="font-bold text-blue-700 uppercase truncate" title={item.prestasi}>
                                🏆 {item.prestasi || 'Partisipan'}
                            </div>
                            <div className="text-gray-500 mt-1 italic truncate" title={item.refleksi}>
                                "Refleksi: {item.refleksi || '-'}"
                            </div>
                        </td>
                        
                        {/* KUNCI: Memasang max-w-xs dan truncate pada kolom nama peserta */}
                        <td className="p-4 border-r-2 border-gray-200 text-xs font-medium text-gray-800 max-w-xs">
                            <div className="font-bold text-gray-700 truncate" title={item.peserta && Array.isArray(item.peserta) ? item.peserta.map((p: any) => p.kelas).join(', ') : '-'}>
                                {item.peserta && Array.isArray(item.peserta) 
                                    ? item.peserta.map((p: any) => p.kelas).join(', ') 
                                    : '-'}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase whitespace-nowrap">
                                (Detail di halaman show)
                            </div>
                        </td>
                        
                        <td className="p-4 border-r-2 border-gray-200 text-center">
                            {/* KUNCI: Memastikan posisi badge adalah inline-block normal dan dikunci whitespace-nowrap */}
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border-2 whitespace-nowrap ${
                                item.status === 'disetujui' 
                                ? 'bg-green-100 border-green-600 text-green-800' 
                                : 'bg-yellow-100 border-yellow-600 text-yellow-800'
                            }`}>
                                {item.status}
                            </span>
                        </td>
                        
                        <td className="p-3 text-center">
                            <div className="flex flex-col gap-1 items-center w-full">
                                <Link 
                                    href={`/kesiswaan/lomba/${item.id}`}
                                    className="bg-blue-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition w-full text-center block"
                                >
                                    DETAIL
                                </Link>

                                {isAdmin && (
                                    <>
                                        {item.status === 'pending' ? (
                                            <button onClick={() => handleUpdateStatus(item.id, 'disetujui')} className="bg-green-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-green-700 transition w-full block">
                                                ✔ ACC
                                            </button>
                                        ) : (
                                            <button onClick={() => handleUpdateStatus(item.id, 'pending')} className="border-2 border-gray-300 bg-white text-gray-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:border-red-600 hover:text-red-600 transition w-full block">
                                                BATAL
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteSingle(item.id)}
                                            className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition w-full block"
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

                {/* PAGINASI */}
                {lomba.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 border-t-4 border-gray-900 pt-8">
                        {lomba.links.map((link: any, index: number) => (
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-4 py-2 border-2 border-gray-900 text-xs font-bold uppercase transition ${
                                        link.active ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-900 hover:bg-yellow-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="px-4 py-2 border-2 border-gray-300 text-gray-400 bg-gray-50 text-xs font-bold uppercase cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

LombaIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;