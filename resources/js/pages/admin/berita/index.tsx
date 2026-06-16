import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function BeritaIndex({ berita, filters }: { berita: any, filters: any }) {
    const { auth, flash } = usePage().props as any;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    // State untuk Pencarian dan Hapus Massal
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Ekstrak array berita dari object paginasi Laravel
    const dataBerita = berita.data || [];

    // Fungsi Pencarian (Dipicu saat tekan Enter atau klik tombol cari)
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/berita', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    // Logika Checkbox
    const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(dataBerita.map((b: any) => b.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleItem = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) {
            alert('⚠️ Harap pilih minimal satu berita untuk dihapus!');
            return;
        }
        if (confirm(`❓ Apakah Anda YAKIN ingin menghapus ${selectedIds.length} berita terpilih?`)) {
            router.post('/admin/berita/bulk-delete', { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Papan Pengumuman" />

            <div className="max-w-[95%] mx-auto">
                {/* JUDUL HALAMAN */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Papan Pengumuman
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Berita terkini, agenda, dan informasi sekolah
                        </p>
                    </div>

                    {/* AREA PENCARIAN & TOMBOL AKSI */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        
                        {/* FITUR PENCARIAN TEGAS */}
                        <form onSubmit={handleSearch} className="flex flex-1 md:flex-none mr-2">
                            <input
                                type="text"
                                placeholder="CARI PENGUMUMAN..."
                                className="w-full md:w-64 border-2 border-gray-900 border-r-0 px-3 py-2 text-xs font-bold uppercase focus:ring-0 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-gray-900 text-white border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition"
                            >
                                CARI
                            </button>
                        </form>

                        {/* TOMBOL AKSI ADMIN */}
                        {isAdmin && (
                            <>
                                <div className="flex items-center gap-2 border-l-2 border-gray-300 pl-3 ml-1">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 border-2 border-gray-400 text-gray-900 focus:ring-gray-900 rounded-none cursor-pointer"
                                        onChange={toggleAll}
                                        checked={selectedIds.length === dataBerita.length && dataBerita.length > 0}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleBulkDelete}
                                        className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition shadow-sm"
                                    >
                                        HAPUS MASSAL
                                    </button>
                                </div>
                                <a
                                    href="/admin/berita/export"
                                    className="bg-green-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-green-800 transition shadow-sm flex items-center gap-2"
                                >
                                    <span>📥</span> EXPORT
                                </a>
                                <Link
                                    href="/admin/berita/create"
                                    className="bg-blue-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition shadow-sm"
                                >
                                    + TULIS BERITA
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* NOTIFIKASI */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold flex items-center gap-2 shadow-sm uppercase tracking-wide">
                        <span>✅</span> {flash.success}
                    </div>
                )}

                {/* GRID BERITA */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {dataBerita.length === 0 ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-500 font-bold uppercase tracking-widest">
                            {searchTerm ? 'PENCARIAN TIDAK DITEMUKAN.' : 'BELUM ADA PENGUMUMAN.'}
                        </div>
                    ) : (
                        dataBerita.map((item: any) => (
                            <div
                                key={item.id}
                                className="bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-900 transition duration-300 group flex flex-col h-full relative overflow-hidden"
                            >
                                {/* Checkbox Admin */}
                                {isAdmin && (
                                    <div className="absolute top-3 right-3 z-20">
                                        <input
                                            type="checkbox"
                                            value={item.id}
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => toggleItem(item.id)}
                                            className="w-5 h-5 border-2 border-black bg-white text-red-600 focus:ring-red-500 rounded-none shadow-md cursor-pointer"
                                        />
                                    </div>
                                )}

                                {/* GAMBAR THUMBNAIL */}
                                <div className="w-full h-40 bg-gray-100 overflow-hidden relative border-b border-gray-200 block">
                                    <Link href={`/berita/${item.id}`} className="block w-full h-full">
                                        {item.gambar ? (
                                            <img
                                                src={`/storage/${item.gambar}`}
                                                alt={item.judul}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-200">
                                                <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <span className="text-[10px] font-bold uppercase">TANPA GAMBAR</span>
                                            </div>
                                        )}
                                    </Link>
                                </div>

                                {/* KONTEN TEKS */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span className="text-blue-700">
                                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                        <span>•</span>
                                        <span className="truncate max-w-[100px]">{item.user?.name || 'ANONIM'}</span>
                                    </div>

                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-4 group-hover:text-blue-800 transition break-words">
                                        <Link href={`/berita/${item.id}`}>
                                            {item.judul}
                                        </Link>
                                    </h3>

                                    <div className="mt-auto pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                                        <Link href={`/berita/${item.id}`} className="text-xs font-bold text-black border-b-2 border-transparent hover:border-black transition uppercase tracking-wide">
                                            BACA SELENGKAPNYA
                                        </Link>

                                        <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                            </svg>
                                            {item.komentar_count || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* PAGINASI (PAGES) BERGAYA BRUTALIST */}
                {berita.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 border-t-4 border-gray-900 pt-8">
                        {berita.links.map((link: any, index: number) => (
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

BeritaIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;