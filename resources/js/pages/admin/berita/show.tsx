// 1. Tambahkan router dan usePage di import
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function BeritaShow({ berita }: { berita: any }) {
    // 2. Ambil data user yang sedang login dari props Inertia
    const { auth, flash } = usePage().props as any;
    const currentUser = auth?.user;

    const { data, setData, post, processing, reset, errors } = useForm({
        isi: '',
    });

    const submitKomentar = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/berita/${berita.id}/komentar`, {
            onSuccess: () => reset('isi'),
        });
    };

    // 3. Buat fungsi untuk tombol Hapus Komentar
    const handleDeleteKomentar = (komentarId: number) => {
        if (confirm('YAKIN INGIN MENGHAPUS TANGGAPAN INI?')) {
            router.delete(`/komentar/${komentarId}`);
        }
    };

    const daftarKomentar = berita.komentar || [];

    // ... LANJUT KE BAGIAN RETURN ...
    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title={berita.judul} />

            <div className="max-w-[95%] mx-auto max-w-4xl">
                
                {/* TOMBOL KEMBALI */}
                <div className="mb-6">
                    <Link
                        href="/berita"
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black border-b-2 border-transparent hover:border-black transition pb-1"
                    >
                        ← Kembali ke Papan Pengumuman
                    </Link>
                </div>

                {/* KONTEN ARTIKEL TEGAS */}
                <div className="bg-white border-2 border-gray-200 shadow-sm relative overflow-hidden mb-8">
                    
                    <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest border-b-2 border-l-2 border-gray-900">
                        {berita.status || 'DITERBITKAN'}
                    </div>

                    <div className="p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight mb-6 whitespace-pre-wrap break-words">
                            {berita.judul}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b-4 border-gray-900 pb-6 mb-8">
                            <span className="text-blue-700">
                                {new Date(berita.created_at).toLocaleDateString('id-ID', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                            <span>•</span>
                            <span>OLEH: {berita.user?.name || 'ADMINISTRATOR'}</span>
                        </div>

                        {berita.gambar && (
                            <div className="mb-10 border-2 border-gray-900 bg-gray-50 p-4">
                                {(() => {
                                    const namaFile = berita.gambar;
                                    const ekstensi = namaFile.split('.').pop().toLowerCase();
                                    const urlFile = `/storage/${namaFile}`;

                                    // 1. JIKA FORMATNYA GAMBAR (TAMPILKAN LANGSUNG)
                                    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ekstensi)) {
                                        return (
                                            <img 
                                                src={urlFile} 
                                                alt={berita.judul} 
                                                className="w-full h-auto max-h-[500px] object-cover border border-gray-300 shadow-sm"
                                            />
                                        );
                                    } 
                                    
                                    // 2. JIKA FORMATNYA PDF
                                    if (ekstensi === 'pdf') {
                                        return (
                                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-4 border border-gray-300 shadow-sm">
                                                <span className="text-xs font-black bg-red-100 text-red-700 px-3 py-1.5 uppercase tracking-wider border border-red-300">
                                                    📄 DOKUMEN PDF
                                                </span>
                                                <a 
                                                    href={urlFile} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="text-xs font-black text-blue-600 hover:text-blue-800 hover:underline uppercase tracking-wide"
                                                >
                                                    Klik untuk Buka / Pratinjau Dokumen PDF
                                                </a>
                                            </div>
                                        );
                                    }

                                    // 3. JIKA FORMATNYA WORD (DOC / DOCX)
                                    if (['doc', 'docx'].includes(ekstensi)) {
                                        return (
                                            <div className="flex items-center gap-3 bg-white p-4 border border-gray-300 shadow-sm">
                                                <span className="text-xs font-black bg-blue-100 text-blue-700 px-3 py-1.5 uppercase tracking-wider border border-blue-300">
                                                    📝 DOKUMEN WORD
                                                </span>
                                                <a 
                                                    href={urlFile} 
                                                    download
                                                    className="text-xs font-black text-blue-600 hover:text-blue-800 hover:underline uppercase tracking-wide"
                                                >
                                                    Unduh Lampiran Dokumen Word
                                                </a>
                                            </div>
                                        );
                                    }

                                    // FALLBACK (FORMAT LAINNYA)
                                    return (
                                        <div className="p-2 bg-white border border-gray-300">
                                            <a href={urlFile} download className="text-xs font-bold text-gray-700 hover:underline uppercase">
                                                Unduh File Lampiran
                                            </a>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* TEMPATKAN KODE INI DI BAWAH KONTEN TEXT ISI BERITA */}
                        {berita.lampiran && (
                            <div className="mt-8 p-4 border-2 border-gray-950 bg-blue-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h5 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                                        Dokumen Lampiran Tersedia:
                                    </h5>
                                    <p className="text-xs font-bold text-gray-700 mt-1 font-mono break-all">
                                        📄 {berita.nama_file_asli || 'Unduh Lampiran'}
                                    </p>
                                </div>
                                <a 
                                    href={`/storage/${berita.lampiran}`} 
                                    download={berita.nama_file_asli}
                                    className="w-full sm:w-auto text-center bg-gray-900 text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-sm"
                                >
                                    UNDUH FILE
                                </a>
                            </div>
                        )}

                        <div className="prose prose-lg max-w-none prose-p:leading-relaxed prose-p:text-gray-800 prose-a:text-blue-600 prose-a:font-bold prose-a:uppercase">
                            <p className="whitespace-pre-wrap break-words font-medium">
                                {berita.isi}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-t-2 border-gray-200 p-6 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            AKHIR DARI PENGUMUMAN
                        </span>
                        <Link
                            href={`/admin/berita/${berita.id}/edit`}
                            className="bg-gray-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition shadow-sm"
                        >
                            EDIT ARTIKEL INI
                        </Link>
                    </div>
                </div>

                {/* RUANG DISKUSI & KOMENTAR */}
                <div className="bg-white border-2 border-gray-900 shadow-sm p-6 md:p-8">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter border-b-2 border-gray-200 pb-4 mb-6 flex justify-between items-center">
                        <span>Ruang Diskusi</span>
                        <span className="text-sm bg-gray-100 px-3 py-1 border border-gray-300">
                            {daftarKomentar.length} Komentar
                        </span>
                    </h3>

                    {/* FORM TULIS KOMENTAR */}
                    <form onSubmit={submitKomentar} className="mb-10">
                        <textarea
                            className="w-full border-2 border-gray-300 p-4 text-sm min-h-[100px] focus:border-gray-900 focus:ring-0 transition mb-2"
                            placeholder="Tulis tanggapan atau pertanyaan Anda di sini..."
                            value={data.isi}
                            onChange={(e) => setData('isi', e.target.value)}
                        />
                        {errors.isi && <p className="text-red-600 text-xs font-bold mb-3 uppercase">⚠️ {errors.isi}</p>}
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-700 text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-blue-800 transition shadow-sm disabled:opacity-50"
                            >
                                {processing ? 'MENGIRIM...' : 'KIRIM TANGGAPAN'}
                            </button>
                        </div>
                    </form>

                    {/* DAFTAR KOMENTAR */}
                    <div className="space-y-6 mt-4">
                        
                        {/* Notifikasi Hapus/Tambah Komentar */}
                        {flash?.success && (
                            <div className="bg-green-50 border-l-4 border-green-600 p-3 text-green-800 text-xs font-bold uppercase tracking-wide mb-4">
                                ✅ {flash.success}
                            </div>
                        )}

                        {daftarKomentar.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest">
                                Belum ada tanggapan. Jadilah yang pertama!
                            </div>
                        ) : (
                            daftarKomentar.map((komentar: any) => (
                                <div key={komentar.id} className="flex gap-4 p-4 border-2 border-gray-100 bg-gray-50 relative group">
                                    
                                    {/* Tombol Hapus (Hanya muncul untuk pemilik komentar ATAU Admin) */}
                                    {(currentUser?.id === komentar.user_id || currentUser?.role === 'admin') && (
                                        <button
                                            onClick={() => handleDeleteKomentar(komentar.id)}
                                            className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-700 transition"
                                            title="Hapus Komentar Ini"
                                        >
                                            [ X HAPUS ]
                                        </button>
                                    )}

                                    {/* Avatar Kotak */}
                                    <div className="w-10 h-10 bg-gray-300 flex-shrink-0 flex items-center justify-center font-black text-gray-600 uppercase border border-gray-400">
                                        {komentar.user?.name?.substring(0, 1) || '?'}
                                    </div>
                                    
                                    {/* Isi Komentar */}
                                    <div className="flex-1 pr-16"> {/* pr-16 agar teks tidak nabrak tombol hapus */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                                                {komentar.user?.name || 'Anonim'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold tracking-widest">
                                                {new Date(komentar.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                            {komentar.isi_komentar}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

BeritaShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;