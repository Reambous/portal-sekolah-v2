import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';
import Pagination from '@/components/pagination';

export default function IjinIndex({ daftarIjin, filters }: { daftarIjin: any, filters: any }) {
    const { flash, auth } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const dataIjin = daftarIjin.data || [];
    const isAdmin = auth?.user?.role === 'admin';
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/ijin', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleStatus = (id: number, statusBaru: 'disetujui' | 'ditolak' | 'pending') => {
        if (confirm(`Ubah status pengajuan izin ini menjadi [${statusBaru.toUpperCase()}]?`)) {
            router.put(`/ijin/${id}/status`, { status: statusBaru });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('⚠️ Hapus pengajuan izin ini permanen?')) {
            router.delete(`/ijin/${id}`);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter(x => x !== id));
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Perizinan Pegawai" />
            <div className="max-w-[95%] mx-auto">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Perizinan Guru & Pegawai</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pencatatan, Pemantauan, dan Persetujuan Izin Meninggalkan Tugas</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 md:flex-none mr-2">
                            <input type="text" placeholder="CARI ALASAN IZIN..." className="w-full md:w-64 border-2 border-gray-900 border-r-0 px-3 py-2 text-xs font-bold uppercase focus:ring-0 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <button type="submit" className="bg-gray-900 text-white border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-yellow-500 hover:text-black transition">CARI</button>
                        </form>
                        <a href="/ijin/export/csv" className="bg-green-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-green-800 border-2 border-green-700 transition">REKAP CSV</a>
                        <Link href="/ijin/create" className="bg-gray-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-sm">AJUKAN IZIN</Link>
                    </div>
                </div>

                {flash?.success && <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase">✅ {flash.success}</div>}

                {isAdmin && selectedIds.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 flex justify-between items-center">
                        <span className="text-xs font-black text-red-800 uppercase">Terpilih {selectedIds.length} Pengajuan</span>
                        <button onClick={() => { if(confirm('Hapus massal?')) router.post('/ijin/bulk-delete', { ids: selectedIds }, { onSuccess: () => setSelectedIds([]) }) }} className="bg-red-600 text-white px-4 py-1.5 text-xs font-black uppercase hover:bg-red-700 transition">❌ HAPUS MASSAL</button>
                    </div>
                )}

                {/* TABEL DATA IJIN GURU (RESPONSIVE BRUTALIST VERSION) */}
<div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
    {/* KUNCI: table-auto dan min-w-[1050px] agar kolom memiliki ruang ideal dan scroll horizontal aktif di mobile */}
    <table className="w-full text-left border-collapse table-auto min-w-[1050px]">
        <thead>
            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                {isAdmin && (
                    <th className="p-4 border-r border-gray-700 w-12 text-center">
                        <input 
                            type="checkbox" 
                            className="focus:ring-0 border-2 text-gray-900" 
                            onChange={(e) => setSelectedIds(e.target.checked ? dataIjin.map((item: any) => item.id) : [])} 
                            checked={dataIjin.length > 0 && selectedIds.length === dataIjin.length} 
                        />
                    </th>
                )}
                {/* KUNCI: whitespace-nowrap mengunci text header agar tidak patah berantakan */}
                <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                <th className="p-4 border-r border-gray-700 w-44 whitespace-nowrap">PEGAWAI / TANGGAL</th>
                <th className="p-4 border-r border-gray-700 w-28 text-center whitespace-nowrap">DURASI JAM</th>
                <th className="p-4 border-r border-gray-700 whitespace-nowrap">ALASAN KETERANGAN</th>
                <th className="p-4 border-r border-gray-700 w-28 text-center whitespace-nowrap">STATUS</th>
                <th className="p-4 w-40 text-center whitespace-nowrap">AKSI</th>
            </tr>
        </thead>
        <tbody>
            {dataIjin.length === 0 ? (
                <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                        Belum ada rekaman pengajuan izin.
                    </td>
                </tr>
            ) : (
                dataIjin.map((item: any, index: number) => (
                    <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                        {isAdmin && (
                            <td className="p-4 border-r-2 border-gray-200 text-center">
                                <input type="checkbox" className="focus:ring-0 border-2 text-gray-900" checked={selectedIds.includes(item.id)} onChange={(e) => handleSelectOne(item.id, e.target.checked)} />
                            </td>
                        )}
                        <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs whitespace-nowrap">
                            {daftarIjin.from + index}
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                            <div className="font-black text-gray-900 uppercase truncate mb-0.5">{item.user ? item.user.name : '-'}</div>
                            <div className="font-bold text-gray-500 whitespace-nowrap">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 text-center text-xs font-mono font-bold text-blue-900 whitespace-nowrap">
                            {item.jam_mulai && item.jam_selesai ? `${item.jam_mulai.substring(0,5)} - ${item.jam_selesai.substring(0,5)}` : '1 Hari Penuh'}
                        </td>
                        
                        {/* KUNCI: Pembatasan max-w-sm dan truncate memangkas teks deskripsi alasan yang terlalu panjang */}
                        <td className="p-4 border-r-2 border-gray-200 text-xs font-medium text-gray-700 max-w-sm">
                            <div className="truncate italic" title={item.alasan}>
                                "{item.alasan}"
                            </div>
                        </td>
                        
                        <td className="p-4 border-r-2 border-gray-200 text-center">
                            {/* KUNCI: Status diamankan dengan whitespace-nowrap agar teks badge utuh */}
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase border-2 whitespace-nowrap ${
                                item.status === 'disetujui' ? 'bg-green-100 border-green-600 text-green-800' :
                                item.status === 'ditolak' ? 'bg-red-100 border-red-600 text-red-800' : 'bg-yellow-100 border-yellow-600 text-yellow-800'
                            }`}>
                                {item.status}
                            </span>
                        </td>
                        <td className="p-3 text-center">
                            <div className="flex flex-col gap-1 items-center w-full">
                                <Link href={`/ijin/${item.id}`} className="bg-blue-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition w-full text-center block whitespace-nowrap">DETAIL</Link>
                                {isAdmin ? (
                                    <>
                                        {item.status === 'pending' ? (
                                            <div className="grid grid-cols-2 gap-1 w-full">
                                                <button onClick={() => handleStatus(item.id, 'disetujui')} className="bg-green-600 text-white p-1 text-[9px] font-black uppercase tracking-wider hover:bg-green-700 transition block whitespace-nowrap">✔ ACC</button>
                                                <button onClick={() => handleStatus(item.id, 'ditolak')} className="bg-red-600 text-white p-1 text-[9px] font-black uppercase tracking-wider hover:bg-red-700 transition block whitespace-nowrap">✖ TLK</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleStatus(item.id, 'pending')} className="bg-gray-500 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-600 transition w-full block whitespace-nowrap">↩ BATAL</button>
                                        )}
                                        <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase hover:bg-red-700 transition w-full block whitespace-nowrap">🗑️ HAPUS</button>
                                    </>
                                ) : (
                                    item.status === 'pending' ? (
                                        <div className="flex gap-1 w-full">
                                            <Link href={`/ijin/${item.id}/edit`} className="bg-yellow-500 text-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-yellow-600 transition flex-1 text-center block whitespace-nowrap">EDIT</Link>
                                            <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase hover:bg-red-700 transition flex-1 block whitespace-nowrap">BATAL</button>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block py-1 whitespace-nowrap">🔒 TERKUNCI</span>
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

                <Pagination paginator={daftarIjin} />
            </div>
        </div>
    );
}
IjinIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;