import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function LombaIndex({ lomba, filters }: { lomba: any, filters: any }) {
    const { flash, auth } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const dataLomba = lomba.data || [];
    const isAdmin = auth?.user?.role === 'admin';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kesiswaan/lomba', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleUpdateStatus = (id: number, statusBaru: string) => {
        if (confirm(`UBAH STATUS PERMOHONAN MENJADI [${statusBaru.toUpperCase()}]?`)) {
            router.put(`/kesiswaan/lomba/${id}/status`, { status: statusBaru });
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

                {/* TABEL DATA LOMBA */}
                <div className="bg-white border-2 border-gray-900 shadow-sm overflow-x-auto mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                <th className="p-4 border-r border-gray-700 w-16 text-center">NO</th>
                                <th className="p-4 border-r border-gray-700 w-32">TANGGAL</th>
                                <th className="p-4 border-r border-gray-700">DETAIL PERLOMBAAN</th>
                                <th className="p-4 border-r border-gray-700">DIIKUTI OLEH (PESERTA)</th>
                                <th className="p-4 border-r border-gray-700 w-32 text-center">STATUS</th>
                                <th className="p-4 w-40 text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataLomba.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                                        Belum ada data rekaman lomba.
                                    </td>
                                </tr>
                            ) : (
                                dataLomba.map((item: any, index: number) => (
                                    <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition items-start">
                                        <td className="p-4 border-r-2 border-gray-200 text-center font-bold">
                                            {lomba.from + index}
                                        </td>
                                        
                                        <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-600">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        
                                        {/* DETAIL PERLOMBAAN DENGAN LINE-CLAMP (POTONG TEKS) */}
                                        <td className="p-4 border-r-2 border-gray-200">
                                            <div className="font-black text-gray-900 uppercase tracking-wide text-sm mb-1">{item.jenis_lomba}</div>
                                            <div className="text-xs font-bold text-blue-700 uppercase">🏆 Pencapaian: {item.prestasi || 'Partisipan'}</div>
                                            
                                            {/* 👇 GANTI BAGIAN REFLEKSI INI */}
                                            <div className="text-xs text-gray-500 mt-2 italic">
                                                "Refleksi: {item.refleksi && item.refleksi.length > 50 
                                                    ? `${item.refleksi.substring(0, 50)}...` 
                                                    : item.refleksi || '-'}"
                                            </div>
                                        </td>
                                        
                                        {/* PESERTA (HANYA MENAMPILKAN KELAS SAJA DI INDEX) */}
                                        <td className="p-4 border-r-2 border-gray-200 text-xs font-medium text-gray-800">
                                            <div className="line-clamp-2 font-bold text-gray-700">
                                                {item.peserta && Array.isArray(item.peserta) 
                                                    ? item.peserta.map((p: any) => p.kelas).join(', ') 
                                                    : '-'}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-1 font-bold uppercase">
                                                (Lihat detail untuk daftar siswa)
                                            </div>
                                        </td>
                                        
                                        {/* STATUS */}
                                        <td className="p-4 border-r-2 border-gray-200 text-center">
                                            <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
                                                item.status === 'disetujui' 
                                                ? 'bg-green-100 border-green-600 text-green-800' 
                                                : 'bg-yellow-100 border-yellow-600 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        
                                        {/* AKSI (TOMBOL DETAIL & ACC ADMIN) */}
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col gap-2 items-center">
                                                <Link 
                                                    href={`/kesiswaan/lomba/${item.id}`}
                                                    className="bg-blue-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition w-full text-center"
                                                >
                                                    LIHAT DETAIL
                                                </Link>

                                                {isAdmin && (
                                                    item.status === 'pending' ? (
                                                        <button onClick={() => handleUpdateStatus(item.id, 'disetujui')} className="bg-green-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-green-700 transition w-full">
                                                            ✔ SETUJUI
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleUpdateStatus(item.id, 'pending')} className="border-2 border-gray-300 text-gray-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:border-red-600 hover:text-red-600 transition w-full">
                                                            BATALKAN
                                                        </button>
                                                    )
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