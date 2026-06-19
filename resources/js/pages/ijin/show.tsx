import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function IjinShow({ ijin }: { ijin: any }) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === ijin.user_id;

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail Pengajuan Izin" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="w-full md:flex-1 min-w-0">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Detail Permohonan Izin</h2>
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide break-words whitespace-normal w-full">
                            Pengajuan Oleh: {ijin.user?.name || '-'}
                        </p>
                    </div>
                    <Link href="/ijin" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition block text-center shrink-0 w-full sm:w-auto">KEMBALI</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <div className="bg-gray-50 border-2 border-gray-900 p-4 shadow-sm space-y-4">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status Keputusan</h3>
                                <span className={`inline-block px-2.5 py-0.5 text-xs font-black uppercase border-2 ${
                                    ijin.status === 'disetujui' ? 'bg-green-100 border-green-600 text-green-800' :
                                    ijin.status === 'ditolak' ? 'bg-red-100 border-red-600 text-red-800' : 'bg-yellow-100 border-yellow-600 text-yellow-800'
                                }`}>{ijin.status}</span>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Tanggal Izin</h3>
                                <p className="text-sm font-bold">{new Date(ijin.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Waktu / Jam Durasi</h3>
                                <p className="text-sm font-bold font-mono text-blue-800">
                                    {ijin.jam_mulai && ijin.jam_selesai ? `${ijin.jam_mulai.substring(0,5)} s/d ${ijin.jam_selesai.substring(0,5)} WIB` : '1 Hari Penuh (Meninggalkan Tugas)'}
                                </p>
                            </div>
                        </div>

                        {/* Kontrol Guru: Hanya boleh aksi kalau status pending */}
                        {((isAdmin) || (isOwner && ijin.status === 'pending')) && (
                            <div className="space-y-2">
                                <Link href={`/ijin/${ijin.id}/edit`} className="w-full block text-center bg-yellow-500 text-black border-2 border-gray-900 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-yellow-600 transition shadow-sm">📝 EDIT PENGAJUAN</Link>
                                <button onClick={() => { if(confirm('Batalkan dan hapus izin?')) router.delete(`/ijin/${ijin.id}`) }} className="w-full bg-red-600 text-white border-2 border-gray-900 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition shadow-sm">🗑️ HAPUS PERMOHONAN</button>
                            </div>
                        )}

                        {!isAdmin && isOwner && ijin.status !== 'pending' && (
                            <div className="text-[10px] bg-gray-100 border border-gray-300 text-gray-600 p-3 font-bold uppercase tracking-wide text-center">
                                🔒 Data dikunci karena sudah diproses Admin. Hubungi pihak Tata Usaha jika ada kekeliruan.
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white border-2 border-gray-900 p-6 shadow-sm">
                            <h3 className="text-sm font-black uppercase border-b-2 border-gray-900 pb-2 mb-4">Alasan & Keperluan Izin</h3>
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words font-medium">{ijin.alasan}</p>
                        </div>

                       {ijin.bukti_foto ? (
    <div className="border-2 border-gray-900 shadow-sm bg-gray-50 p-4">
        <h3 className="text-xs font-black uppercase text-gray-900 border-b pb-2 mb-3">
            📁 Berkas Lampiran Pendukung
        </h3>
        
        {/* LOGIKA DETEKSI: Jika berkas berakhiran ekstensi gambar, tampilkan previewnya */}
        {/\.(jpeg|jpg|png|webp)$/i.test(ijin.bukti_foto) ? (
            <a href={`/storage/${ijin.bukti_foto}`} target="_blank" rel="noreferrer" className="block cursor-zoom-in">
                <img src={`/storage/${ijin.bukti_foto}`} alt="Bukti Lampiran" className="w-full h-auto max-h-[450px] object-contain mx-auto border" />
            </a>
        ) : (
            // Jika berkas berupa PDF/Word, tampilkan tombol unduh yang kokoh
            <div className="flex items-center justify-between bg-blue-50 border-2 border-blue-200 p-3">
                <div className="truncate">
                    <p className="text-xs font-black text-blue-900 uppercase">Dokumen Non-Gambar (PDF / Word)</p>
                    <p className="text-[11px] font-mono text-gray-600 mt-0.5 truncate">Klik unduh untuk memeriksa dokumen</p>
                </div>
                <a 
                    href={`/storage/${ijin.bukti_foto}`} 
                    download
                    className="bg-gray-900 text-white px-4 py-2 text-xs font-black uppercase hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shrink-0"
                >
                    UNDUH FILE
                </a>
            </div>
        )}
    </div>
) : (
    <div className="border-2 border-dashed border-gray-300 p-6 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
        📸 Pengajuan ini tidak menyertakan foto atau dokumen lampiran pendukung.
    </div>
)}
                    </div>
                </div>
            </div>
        </div>
    );
}
IjinShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;