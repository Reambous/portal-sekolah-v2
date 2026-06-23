import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function JurnalIndex({ daftarJurnal, filters }: { daftarJurnal: any, filters: any }) {
    const { flash, auth } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const dataJurnal = daftarJurnal.data || [];
    const isAdmin = auth?.user?.role === 'admin';
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/jurnal-refleksi', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter(x => x !== id));
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Jurnal Refleksi Guru" />
            <div className="max-w-[95%] mx-auto">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Jurnal Refleksi Guru</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Evaluasi Mandiri Pembelajaran, Metode Mengajar, dan Catatan Kelas</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 md:flex-none mr-2">
                            <input type="text" placeholder="CARI JUDUL / KATEGORI..." className="w-full md:w-64 border-2 border-gray-900 border-r-0 px-3 py-2 text-xs font-bold uppercase focus:ring-0 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <button type="submit" className="bg-gray-900 text-white border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-yellow-500 hover:text-black transition">CARI</button>
                        </form>
                        <a href="/jurnal-refleksi/export/csv" className="bg-green-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-green-800 border-2 border-green-700 transition">REKAP CSV</a>
                        <Link href="/jurnal-refleksi/create" className="bg-gray-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-sm">+ TULIS JURNAL</Link>
                    </div>
                </div>

                {flash?.success && <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase">✅ {flash.success}</div>}

                {isAdmin && selectedIds.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 flex justify-between items-center">
                        <span className="text-xs font-black text-red-800 uppercase">Terpilih {selectedIds.length} Jurnal</span>
                        <button onClick={() => { if(confirm('Hapus massal data refleksi?')) router.post('/jurnal-refleksi/bulk-delete', { ids: selectedIds }, { onSuccess: () => setSelectedIds([]) }) }} className="bg-red-600 text-white px-4 py-1.5 text-xs font-black uppercase hover:bg-red-700 transition">❌ HAPUS MASSAL</button>
                    </div>
                )}

                {/* TABEL DATA UTAMA JURNAL REFLEKSI (RESPONSIVE BRUTALIST VERSION) */}
<div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
    {/* KUNCI: table-auto dan min-w-[1000px] memberikan ruang elastis saat dibuka di mobile */}
    <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
        <thead>
            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                {isAdmin && (
                    <th className="p-4 border-r border-gray-700 w-12 text-center">
                        <input 
                            type="checkbox" 
                            className="focus:ring-0 border-2 text-gray-900" 
                            onChange={(e) => setSelectedIds(e.target.checked ? dataJurnal.map((item: any) => item.id) : [])} 
                            checked={dataJurnal.length > 0 && selectedIds.length === dataJurnal.length} 
                        />
                    </th>
                )}
                {/* KUNCI: whitespace-nowrap dipasang di seluruh header agar teks tidak patah vertikal */}
                <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                <th className="p-4 border-r border-gray-700 w-44 whitespace-nowrap">PENGINPUT / TANGGAL</th>
                <th className="p-4 border-r border-gray-700 w-40 whitespace-nowrap">KATEGORI EVALUASI</th>
                <th className="p-4 border-r border-gray-700 whitespace-nowrap">JUDUL JURNAL REFLEKSI</th>
                <th className="p-4 border-r border-gray-700 w-24 text-center whitespace-nowrap">LAMPIRAN</th>
                <th className="p-4 w-32 text-center whitespace-nowrap">AKSI</th>
            </tr>
        </thead>
        <tbody>
            {dataJurnal.length === 0 ? (
                <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                        Belum ada arsip catatan refleksi kelas.
                    </td>
                </tr>
            ) : (
                dataJurnal.map((item: any, index: number) => (
                    <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                        {isAdmin && (
                            <td className="p-4 border-r-2 border-gray-200 text-center">
                                <input type="checkbox" className="focus:ring-0 border-2 text-gray-900" checked={selectedIds.includes(item.id)} onChange={(e) => handleSelectOne(item.id, e.target.checked)} />
                            </td>
                        )}
                        <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs whitespace-nowrap">
                            {daftarJurnal.from + index}
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                            <div className="font-black text-gray-900 uppercase truncate mb-0.5">{item.user ? item.user.name : '-'}</div>
                            <div className="font-bold text-gray-500 whitespace-nowrap">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 text-xs font-black text-blue-900 uppercase whitespace-nowrap" title={item.kategori}>
                            {item.kategori}
                        </td>
                        
                        {/* KUNCI: Pembatasan max-w-xs dan truncate agar judul panjang tidak merusak layout tabel */}
                        <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-800 max-w-xs">
                            <div className="truncate uppercase" title={item.judul_refleksi}>
                                {item.judul_refleksi}
                            </div>
                        </td>
                        
                        <td className="p-4 border-r-2 border-gray-200 text-center">
                            {/* KUNCI: Komponen didalam sel dikunci dengan whitespace-nowrap agar badge tidak gepeng */}
                            {item.bukti_file ? (
                                <span className="inline-block px-2 py-0.5 text-[9px] font-black border border-gray-400 bg-gray-100 text-gray-700 uppercase whitespace-nowrap">ADA FILE</span>
                            ) : (
                                <span className="text-[10px] text-gray-300 italic whitespace-nowrap">KOSONG</span>
                            )}
                        </td>
                        <td className="p-3 text-center">
                            <div className="flex gap-1 justify-center items-center w-full">
                                <Link href={`/jurnal-refleksi/${item.id}`} className="bg-blue-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition flex-1 text-center block whitespace-nowrap">LIHAT</Link>
                                <button onClick={() => { if(confirm('Hapus permanen jurnal refleksi ini?')) router.delete(`/jurnal-refleksi/${item.id}`) }} className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase hover:bg-red-700 transition block">🗑️</button>
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
JurnalIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;