import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function KurikulumShow({ kegiatan }: { kegiatan: any }) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === kegiatan.user_id;

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail Jurnal Kurikulum" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="w-full md:flex-1 min-w-0">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Detail Jurnal Kurikulum</h2>
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide break-words whitespace-normal w-full">{kegiatan.nama_kegiatan}</p>
                    </div>
                    <Link href="/kurikulum" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition block text-center shrink-0 w-full sm:w-auto">KEMBALI</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <div className="bg-gray-50 border-2 border-gray-900 p-4 shadow-sm space-y-4">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status Verifikasi</h3>
                                <span className={`inline-block px-2.5 py-0.5 text-xs font-black uppercase border-2 ${kegiatan.status === 'disetujui' ? 'bg-green-100 border-green-600 text-green-800' : 'bg-yellow-100 border-yellow-600 text-yellow-800'}`}>{kegiatan.status}</span>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Tanggal Pelaksanaan</h3>
                                <p className="text-sm font-bold">{new Date(kegiatan.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Penanggung Jawab</h3>
                                <p className="text-sm font-bold">{kegiatan.user?.name || '-'}</p>
                            </div>
                        </div>
                        {/* 🔒 LOGIKA BARU: 
  - Admin bebas melakukan aksi kapan saja.
  - Guru (Owner) HANYA BISA melakukan aksi jika statusnya masih 'pending'.
*/}
{(isAdmin || (isOwner && kegiatan.status === 'pending')) && (
    <div className="space-y-2">
        <Link 
            href={`/kurikulum/${kegiatan.id}/edit`} 
            className="w-full block text-center bg-yellow-500 text-black border-2 border-gray-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-600 transition shadow-sm"
        >
            📝 EDIT AGENDA
        </Link>
        <button 
            onClick={() => { if(confirm('Hapus permanen?')) router.delete(`/kurikulum/${kegiatan.id}`) }} 
            className="w-full bg-red-600 text-white border-2 border-gray-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition shadow-sm"
        >
            🗑️ HAPUS JURNAL
        </button>
    </div>
)}

{/* Beri pesan indikator kunci jika statusnya disetujui dan dia adalah Guru */}
{!isAdmin && isOwner && kegiatan.status === 'disetujui' && (
    <div className="text-[10px] bg-green-50 border border-green-300 text-green-800 p-3 font-bold uppercase tracking-wide text-center">
        🔒 Data terkunci karena sudah di-ACC Admin. Hubungi Administrator jika ingin mengubah data.
    </div>
)}
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white border-2 border-gray-900 p-6 shadow-sm">
                            <h3 className="text-sm font-black uppercase border-b-2 border-gray-900 pb-2 mb-4">Catatan Evaluasi / Refleksi</h3>
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words font-medium">{kegiatan.refleksi}</p>
                        </div>
                        {kegiatan.bukti_gambar && (
                            <div className="border-2 border-gray-900 shadow-sm bg-gray-50 p-2">
                                <a href={`/storage/${kegiatan.bukti_gambar}`} target="_blank" rel="noreferrer" className="block cursor-zoom-in"><img src={`/storage/${kegiatan.bukti_gambar}`} alt="Dokumentasi" className="w-full h-auto max-h-[450px] object-contain mx-auto" /></a>
                            </div>
                        )}
                        {kegiatan.lampiran && (
                            <div className="border-2 border-gray-950 p-4 bg-blue-50 flex items-center justify-between gap-4">
                                <div className="truncate"><h5 className="text-xs font-black uppercase text-blue-900">Berkas Pendukung:</h5><p className="text-xs font-bold text-gray-700 font-mono truncate">{kegiatan.nama_file_asli}</p></div>
                                <a href={`/storage/${kegiatan.lampiran}`} download={kegiatan.nama_file_asli} className="bg-gray-900 text-white px-4 py-2 text-xs font-black uppercase border-2 border-gray-900 transition hover:bg-yellow-500 hover:text-black">UNDUH FILE</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
KurikulumShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;