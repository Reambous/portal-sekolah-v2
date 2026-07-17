import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';
import Pagination from '@/components/pagination';

export default function HumasIndex({ kegiatan, filters }: { kegiatan: any, filters: any }) {
    const { flash, auth } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const dataKegiatan = kegiatan.data || [];
    const isAdmin = auth?.user?.role === 'admin';
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/humas', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Jurnal Humas" />
            <div className="max-w-[95%] mx-auto">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Jurnal Hubungan Masyarakat (Humas)</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Rekam Agenda Eksternal, Komite, dan Mitra Industri</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 md:flex-none mr-2">
                            <input type="text" placeholder="CARI JURNAL..." className="w-full md:w-64 border-2 border-gray-900 border-r-0 px-3 py-2 text-xs font-bold uppercase focus:ring-0 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <button type="submit" className="bg-gray-900 text-white border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-yellow-500 hover:text-black transition">CARI</button>
                        </form>
                        <a href="/humas/export/csv" className="bg-green-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-green-800 border-2 border-green-700 transition">EXCEL / CSV</a>
                        <Link href="/humas/create" className="bg-gray-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-sm">+ CATAT AGENDA</Link>
                    </div>
                </div>

                {flash?.success && <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase">✅ {flash.success}</div>}

                {isAdmin && selectedIds.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 flex justify-between items-center">
                        <span className="text-xs font-black text-red-800 uppercase">Terpilih {selectedIds.length} Catatan</span>
                        <button onClick={() => { if(confirm('Hapus massal?')) router.post('/humas/bulk-delete', { ids: selectedIds }, { onSuccess: () => setSelectedIds([]) }) }} className="bg-red-600 text-white px-4 py-1.5 text-xs font-black uppercase hover:bg-red-700 transition">❌ HAPUS MASSAL</button>
                    </div>
                )}

                {/* TABEL DATA UTAMA ARSIP HUMAS (RESPONSIVE BRUTALIST VERSION) */}
<div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
    {/* KUNCI: table-auto dan min-w-[1000px] memberikan ruang elastis dan mengaktifkan scroll horizontal di mobile */}
    <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
        <thead>
            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                {isAdmin && (
                    <th className="p-4 border-r border-gray-700 w-12 text-center">
                        <input 
                            type="checkbox" 
                            className="focus:ring-0 border-2 text-gray-900" 
                            onChange={(e) => setSelectedIds(e.target.checked ? dataKegiatan.map((item: any) => item.id) : [])} 
                            checked={dataKegiatan.length > 0 && selectedIds.length === dataKegiatan.length} 
                        />
                    </th>
                )}
                {/* KUNCI: whitespace-nowrap dipasang di seluruh header agar teks tidak patah baris vertikal */}
                <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                <th className="p-4 border-r border-gray-700 w-32 whitespace-nowrap">TANGGAL</th>
                <th className="p-4 border-r border-gray-700 whitespace-nowrap">NAMA AGENDA HUMAS</th>
                <th className="p-4 border-r border-gray-700 whitespace-nowrap">EVALUASI / CATATAN</th>
                <th className="p-4 border-r border-gray-700 w-28 text-center whitespace-nowrap">STATUS</th>
                <th className="p-4 w-36 text-center whitespace-nowrap">AKSI</th>
            </tr>
        </thead>
        <tbody>
            {dataKegiatan.length === 0 ? (
                <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                        Belum ada arsip jurnal Humas.
                    </td>
                </tr>
            ) : (
                dataKegiatan.map((item: any, index: number) => (
                    <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                        {isAdmin && (
                            <td className="p-4 border-r-2 border-gray-200 text-center">
                                <input type="checkbox" className="focus:ring-0 border-2 text-gray-900" checked={selectedIds.includes(item.id)} onChange={(e) => setSelectedIds(e.target.checked ? [...selectedIds, item.id] : selectedIds.filter(id => id !== item.id))} />
                            </td>
                        )}
                        <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs whitespace-nowrap">
                            {kegiatan.from + index}
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-600 whitespace-nowrap">
                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        
                        {/* KUNCI: Pembatasan max-w-xs dan truncate agar teks panjang terpotong rapi dengan titik-titik (...) */}
                        <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                            <div className="font-black text-gray-900 uppercase truncate mb-0.5" title={item.nama_kegiatan}>{item.nama_kegiatan}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap">Oleh: {item.user ? item.user.name : '-'}</div>
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 text-xs font-medium text-gray-600 max-w-xs">
                            <div className="truncate italic" title={item.refleksi}>"{item.refleksi || '-'}"</div>
                        </td>
                        
                        <td className="p-4 border-r-2 border-gray-200 text-center">
                            {/* KUNCI: Status diamankan dengan whitespace-nowrap agar badge status utuh */}
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase border-2 whitespace-nowrap ${
                                item.status === 'disetujui' ? 'bg-green-100 border-green-600 text-green-800' : 'bg-yellow-100 border-yellow-600 text-yellow-800'
                            }`}>
                                {item.status}
                            </span>
                        </td>
                        <td className="p-3 text-center">
                            <div className="flex flex-col gap-1 items-center w-full">
                                <Link href={`/humas/${item.id}`} className="bg-blue-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition w-full text-center block whitespace-nowrap">DETAIL</Link>
                                {isAdmin && (
                                    <>
                                        <button onClick={() => router.put(`/humas/${item.id}/status`, { status: item.status === 'pending' ? 'disetujui' : 'pending' })} className={`text-[10px] font-bold uppercase px-2 py-1 w-full text-white transition ${item.status === 'pending' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}`}>{item.status === 'pending' ? '✔ ACC' : 'BATAL'}</button>
                                        <button onClick={() => { if(confirm('Hapus item?')) router.delete(`/humas/${item.id}`) }} className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase w-full hover:bg-red-700 transition block whitespace-nowrap">🗑️ HAPUS</button>
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

                <Pagination paginator={kegiatan} />
            </div>
        </div>
    );
}
HumasIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;