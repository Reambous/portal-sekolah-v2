import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function KegiatanShow({ kegiatan }: { kegiatan: any }) {
    const { auth } = usePage().props as any;
    
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === kegiatan.user_id;

    const handleDelete = () => {
        if (confirm('⚠️ Apakah Anda yakin ingin menghapus catatan jurnal kegiatan ini secara permanen?')) {
            router.delete(`/kesiswaan/kegiatan/${kegiatan.id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title={`Detail Kegiatan: ${kegiatan.nama_kegiatan}`} />

            <div className="max-w-[95%] mx-auto max-w-4xl">
                {/* HEADER */}
                {/* UBAH TOTAL BAGIAN HEADER INI 
                Kita tambahkan 'w-full md:flex-1 min-w-0' agar pembungkus teks judul tahu batas maksimal layar
                */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="w-full md:flex-1 min-w-0"> 
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Detail Jurnal Kegiatan
                        </h2>
                        {/* 👇 Teks di bawah ini dijamin akan turun ke bawah jika terlalu panjang */}
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide break-words whitespace-normal w-full">
                            {kegiatan.nama_kegiatan}
                        </p>
                    </div>
                    
                    {/* Tombol Kembali tetap kokoh di kanan */}
                    <div className="w-full sm:w-auto shrink-0">
                        <Link href="/kesiswaan/kegiatan" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition text-center block w-full sm:w-auto">
                            KEMBALI
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* INFO SIDEBAR */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-gray-50 border-2 border-gray-900 p-4 shadow-sm space-y-4">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status Verifikasi</h3>
                                <span className={`inline-block px-2.5 py-0.5 text-xs font-black uppercase tracking-wider border-2 ${
                                    kegiatan.status === 'disetujui' ? 'bg-green-100 border-green-600 text-green-800' : 'bg-yellow-100 border-yellow-600 text-yellow-800'
                                }`}>
                                    {kegiatan.status}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Tanggal Pelaksanaan</h3>
                                <p className="text-sm font-bold">{new Date(kegiatan.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Penanggung Jawab</h3>
                                <p className="text-sm font-bold text-gray-800">{kegiatan.user?.name || '-'}</p>
                            </div>
                        </div>

                       {/* 🔒 LOGIKA AMAN JURNAL KEGIATAN KESISWAAN */}
{(isAdmin || (isOwner && kegiatan.status === 'pending')) && (
    <div className="space-y-2">
        <Link 
            href={`/kesiswaan/kegiatan/${kegiatan.id}/edit`} // Sesuaikan dengan jalur rute kesiswaan Anda
            className="w-full block text-center bg-yellow-500 text-black border-2 border-gray-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-600 transition shadow-sm"
        >
            📝 EDIT DATA JURNAL
        </Link>
        <button 
            onClick={handleDelete} 
            className="w-full bg-red-600 text-white border-2 border-gray-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition shadow-sm"
        >
            🗑️ HAPUS JURNAL
        </button>
    </div>
)}

{/* Pesan gembok pengunci untuk guru */}
{!isAdmin && isOwner && kegiatan.status === 'disetujui' && (
    <div className="text-[10px] bg-green-50 border border-green-300 text-green-800 p-3 font-bold uppercase tracking-wide text-center">
        🔒 Data terkunci karena sudah di-ACC Admin. Hubungi Administrator jika ingin mengubah data.
    </div>
)}
                    </div>

                    {/* KONTEN UTAMA */}
                    <div className="md:col-span-2 space-y-6">
                        {/* EVALUASI / REFLEKSI */}
                        <div className="bg-white border-2 border-gray-900 p-6 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-gray-900 pb-2 mb-4">
                                Catatan Evaluasi & Refleksi
                            </h3>
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words font-medium">
    {kegiatan.refleksi}
</p>
                        </div>

                        {/* DOKUMENTASI FOTO */}
                        {kegiatan.bukti_gambar && (
                            <div className="border-2 border-gray-900 shadow-sm">
                                <div className="bg-gray-900 text-white text-[10px] font-black p-2 uppercase tracking-widest text-center">
                                    📸 Foto Dokumentasi Fisik (Klik Gambar Utk Memperbesar)
                                </div>
                                <a href={`/storage/${kegiatan.bukti_gambar}`} target="_blank" rel="noreferrer" className="block overflow-hidden cursor-zoom-in bg-gray-50 p-2">
                                    <img 
                                        src={`/storage/${kegiatan.bukti_gambar}`} 
                                        alt="Dokumentasi Kegiatan" 
                                        className="w-full h-auto max-h-[450px] object-contain border border-gray-200 mx-auto" 
                                    />
                                </a>
                            </div>
                        )}

                        {/* DOKUMEN LAMPIRAN FILE */}
                        {kegiatan.lampiran && (
                            <div className="border-2 border-gray-950 p-4 bg-blue-50 flex items-center justify-between gap-4">
                                <div className="truncate">
                                    <h5 className="text-xs font-black uppercase text-blue-900 tracking-wider">Berkas Lampiran Pendukung:</h5>
                                    <p className="text-xs font-bold text-gray-700 mt-1 font-mono truncate">{kegiatan.nama_file_asli || 'Unduh Berkas'}</p>
                                </div>
                                <a 
                                    href={`/storage/${kegiatan.lampiran}`} 
                                    download={kegiatan.nama_file_asli}
                                    className="bg-gray-900 text-white px-4 py-2 text-xs font-black uppercase hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shrink-0"
                                >
                                    UNDUH FILE
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

KegiatanShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;