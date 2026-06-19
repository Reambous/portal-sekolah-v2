import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function LombaShow({ lomba }: { lomba: any }) {
    const { auth } = usePage().props as any;
    
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === lomba.user_id;
    const isPending = lomba.status === 'pending';

    // Logika Hak Akses Tombol: Admin bebas, Guru hanya jika status masih pending
    const canBisaAksi = isAdmin || (isOwner && isPending);

    const handleDelete = () => {
        if (confirm('⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus data rekaman lomba ini secara permanen?')) {
            router.delete(`/kesiswaan/lomba/${lomba.id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title={`Detail Lomba: ${lomba.jenis_lomba}`} />

            <div className="max-w-[95%] mx-auto max-w-4xl">
                {/* HEADER - DIPERBAIKI ANTI-SCROLL & OTOMATIS PINDAH BARIS */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="w-full md:flex-1 min-w-0">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Detail Lomba
                        </h2>
                        {/* Judul lomba dijamin turun ke bawah dengan aman jika sangat panjang */}
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide break-words whitespace-normal w-full">
                            {lomba.jenis_lomba}
                        </p>
                    </div>
                    <div className="w-full sm:w-auto shrink-0">
                        <Link href="/kesiswaan/lomba" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition text-center block w-full sm:w-auto">
                            KEMBALI
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* KOLOM KIRI (Info & Gambar) */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-gray-50 border-2 border-gray-900 p-4 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Status</h3>
                            <span className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-widest border-2 ${
                                lomba.status === 'disetujui' ? 'bg-green-100 border-green-600 text-green-800' : 'bg-yellow-100 border-yellow-600 text-yellow-800'
                            }`}>
                                {lomba.status}
                            </span>

                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 mt-4">Tanggal</h3>
                            <p className="text-sm font-bold">{new Date(lomba.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

                           <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 mt-4">Pencapaian</h3>
{/* 👇 Tambahkan break-words agar kalau teks prestasinya sangat panjang otomatis turun ke bawah */}
<p className="text-sm font-bold text-blue-700 break-words w-full">
    {lomba.prestasi}
</p>

                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 mt-4">Penginput</h3>
                            <p className="text-sm font-bold">{lomba.user?.name || 'Sistem'}</p>
                        </div>

                        {/* BUKTI GAMBAR INTERAKTIF */}
                        {lomba.bukti_gambar && (
                            <div className="border-2 border-gray-900 shadow-sm group">
                                <div className="bg-gray-900 text-white text-[10px] font-bold p-2 uppercase tracking-widest text-center">
                                    Bukti Gambar (Klik untuk memperbesar)
                                </div>
                                <a href={`/storage/${lomba.bukti_gambar}`} target="_blank" rel="noreferrer" className="block overflow-hidden cursor-zoom-in">
                                    <img 
                                        src={`/storage/${lomba.bukti_gambar}`} 
                                        alt="Bukti Lomba" 
                                        className="w-full h-auto object-cover hover:scale-105 transition duration-200" 
                                    />
                                </a>
                            </div>
                        )}

                        {/* TOMBOL AKSI MANAJEMEN DATA */}
                        {canBisaAksi && (
                            <div className="grid grid-cols-2 gap-2 border-2 border-gray-900 p-3 bg-gray-50">
                                <Link 
                                    href={`/kesiswaan/lomba/${lomba.id}/edit`}
                                    className="bg-yellow-500 text-black border border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-center hover:bg-yellow-600 transition"
                                >
                                    EDIT DATA
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white border border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-center hover:bg-red-700 transition"
                                >
                                    HAPUS DATA
                                </button>
                            </div>
                        )}
                        
                        {!canBisaAksi && isOwner && (
                            <div className="text-[10px] bg-green-50 border border-green-300 text-green-800 p-3 font-bold uppercase tracking-wide text-center">
                                🔒 Data terkunci karena sudah di-ACC Admin. Hubungi Administrator jika ingin mengubah data.
                            </div>
                        )}
                    </div>

                    {/* KOLOM KANAN (Peserta & Refleksi) */}
                    <div className="md:col-span-2 space-y-8 min-w-0">
                        <div>
                            <h3 className="text-lg font-black uppercase border-b-2 border-gray-200 pb-2 mb-4">Daftar Peserta</h3>
                            <div className="space-y-4">
                                {lomba.peserta && Array.isArray(lomba.peserta) ? lomba.peserta.map((kelompok: any, idx: number) => (
                                    <div key={idx} className="bg-white border border-gray-300 p-4 shadow-sm">
                                        <div className="font-black text-gray-900 bg-gray-100 inline-block px-3 py-1 mb-3 border border-gray-300 uppercase tracking-widest">
                                            KELAS: {kelompok.kelas}
                                        </div>
                                        <ul className="list-decimal list-inside space-y-1 text-sm font-medium text-gray-700 pl-2">
                                            {kelompok.siswa.map((s: string, sIdx: number) => (
                                                <li key={sIdx} className="border-b border-gray-100 pb-1 break-words">{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )) : <p className="text-sm text-gray-500 italic">Data peserta tidak valid.</p>}
                            </div>
                        </div>

                        {/* JURNAL REFLEKSI ANTI EMBLES */}
                        <div>
                            <h3 className="text-lg font-black uppercase border-b-2 border-gray-200 pb-2 mb-4">Jurnal Refleksi</h3>
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 shadow-sm">
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words font-medium">
                                    {lomba.refleksi}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

LombaShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;