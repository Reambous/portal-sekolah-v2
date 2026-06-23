import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function KurikulumIndex({ kegiatan, filters }: { kegiatan: any, filters: any }) {
    const { flash, auth } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const dataKegiatan = kegiatan.data || [];
    const isAdmin = auth?.user?.role === 'admin';
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kurikulum', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleUpdateStatus = (id: number, statusBaru: string) => {
        if (confirm(`UBAH STATUS MENJADI [${statusBaru.toUpperCase()}]?`)) {
            router.put(`/kurikulum/${id}/status`, { status: statusBaru });
        }
    };

    const handleDeleteSingle = (id: number) => {
        if (confirm('⚠️ Hapus catatan jurnal kurikulum ini?')) {
            router.delete(`/kurikulum/${id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Jurnal Kurikulum" />
            <div className="max-w-[95%] mx-auto">
                
                {/* HEADER SECTION (RESPONSIVE GAP) */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Jurnal Kurikulum</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pengarsipan Agenda & Evaluasi Akademik Sekolah</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 lg:flex-none mr-2">
                            <input type="text" placeholder="CARI AGENDA..." className="w-full md:w-64 border-2 border-gray-900 border-r-0 px-3 py-2 text-xs font-bold uppercase focus:ring-0 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <button type="submit" className="bg-gray-900 text-white border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-yellow-500 hover:text-black transition">CARI</button>
                        </form>
                        <a href="/kurikulum/export/csv" className="bg-green-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-green-800 border-2 border-green-700 transition">EXCEL / CSV</a>
                        <Link href="/kurikulum/create" className="bg-gray-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-sm">+ CATAT AGENDA</Link>
                    </div>
                </div>

                {flash?.success && <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase">✅ {flash.success}</div>}

                {isAdmin && selectedIds.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 flex justify-between items-center">
                        <span className="text-xs font-black text-red-800 uppercase">Terpilih {selectedIds.length} Agenda</span>
                        <button onClick={() => { if(confirm('Hapus massal?')) router.post('/kurikulum/bulk-delete', { ids: selectedIds }, { onSuccess: () => setSelectedIds([]) }) }} className="bg-red-600 text-white px-4 py-1.5 text-xs font-black uppercase hover:bg-red-700 transition">❌ HAPUS MASSAL</button>
                    </div>
                )}

                {/* 🔑 KUNCI UTAMA 1: KOTAK PEMBUNGKUS SCROLL HORIZONTAL */}
                <div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                    {/* 🔑 KUNCI UTAMA 2: Ubah table-fixed menjadi table-auto, pasang min-w */}
                    <table className="w-full text-left border-collapse table-auto min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                {isAdmin && <th className="p-4 border-r border-gray-700 w-12 text-center"><input type="checkbox" className="focus:ring-0 border-2 text-gray-900" onChange={(e) => setSelectedIds(e.target.checked ? dataKegiatan.map((item: any) => item.id) : [])} checked={dataKegiatan.length > 0 && selectedIds.length === dataKegiatan.length} /></th>}
                                <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                                <th className="p-4 border-r border-gray-700 w-32 whitespace-nowrap">TANGGAL</th>
                                {/* 🔑 KUNCI UTAMA 3: whitespace-nowrap pada judul kolom panjang */}
                                <th className="p-4 border-r border-gray-700 whitespace-nowrap">NAMA AGENDA / KEGIATAN</th>
                                <th className="p-4 border-r border-gray-700 whitespace-nowrap">EVALUASI / REFLEKSI</th>
                                <th className="p-4 border-r border-gray-700 w-28 text-center whitespace-nowrap">STATUS</th>
                                <th className="p-4 w-36 text-center whitespace-nowrap">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataKegiatan.length === 0 ? (
                                <tr><td colSpan={isAdmin ? 7 : 6} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">Belum ada data jurnal kurikulum.</td></tr>
                            ) : (
                                dataKegiatan.map((item: any, index: number) => (
                                    <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                                        {isAdmin && <td className="p-4 border-r-2 border-gray-200 text-center"><input type="checkbox" className="focus:ring-0 border-2 text-gray-900" checked={selectedIds.includes(item.id)} onChange={(e) => setSelectedIds(e.target.checked ? [...selectedIds, item.id] : selectedIds.filter(id => id !== item.id))} /></td>}
                                        <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs">{kegiatan.from + index}</td>
                                        <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-600 whitespace-nowrap">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        
                                        {/* Kolom isi yang menggunakan pembatas truncate agar tidak merusak lebar tabel */}
                                        <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                                            <div className="font-black text-gray-900 uppercase truncate mb-0.5" title={item.nama_kegiatan}>{item.nama_kegiatan}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap">Oleh: {item.user ? item.user.name : '-'}</div>
                                        </td>
                                        <td className="p-4 border-r-2 border-gray-200 text-xs font-medium text-gray-600 max-w-xs">
                                            <div className="truncate italic" title={item.refleksi}>"{item.refleksi || '-'}"</div>
                                        </td>
                                        
                                        <td className="p-4 border-r-2 border-gray-200 text-center">
                                            {/* 🔑 KUNCI UTAMA 4: Pastikan posisi badge adalah relative / normal inline-block */}
                                            <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase border-2 whitespace-nowrap ${item.status === 'disetujui' ? 'bg-green-100 border-green-600 text-green-800' : 'bg-yellow-100 border-yellow-600 text-yellow-800'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex flex-col gap-1 items-center w-full">
                                                <Link href={`/kurikulum/${item.id}`} className="bg-blue-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition w-full text-center block">DETAIL</Link>
                                                {isAdmin && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(item.id, item.status === 'pending' ? 'disetujui' : 'pending')} className={`text-[10px] font-bold uppercase px-2 py-1 w-full text-white transition ${item.status === 'pending' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}`}>{item.status === 'pending' ? '✔ ACC' : 'BATAL'}</button>
                                                        <button onClick={() => handleDeleteSingle(item.id)} className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase w-full hover:bg-red-700 transition">🗑️ HAPUS</button>
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
KurikulumIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;