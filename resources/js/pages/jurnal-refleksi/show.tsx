import { Head, Link, router } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function JurnalShow({ jurnal }: { jurnal: any }) {
    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail Jurnal Refleksi" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="w-full md:flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-400">
                            Kategori: {jurnal.kategori}
                        </span>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mt-2 mb-1 break-words">{jurnal.judul_refleksi}</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Oleh: {jurnal.user?.name || '-'} • {new Date(jurnal.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <Link href="/jurnal-refleksi" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition block text-center shrink-0 w-full sm:w-auto">KEMBALI</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white border-2 border-gray-900 p-6 shadow-sm">
                            <h3 className="text-xs font-black uppercase border-b-2 border-gray-900 pb-2 mb-4 tracking-wider text-gray-400">Uraian Evaluasi Mandiri & Refleksi Kelas</h3>
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words font-medium font-sans">{jurnal.isi_refleksi}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="border-2 border-gray-900 p-3 bg-gray-50 flex flex-col gap-2">
                            <Link href={`/jurnal-refleksi/${jurnal.id}/edit`} className="w-full block text-center bg-yellow-500 text-black border border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-600 transition">EDIT JURNAL</Link>
                            <button onClick={() => { if(confirm('Hapus permanen?')) router.delete(`/jurnal-refleksi/${jurnal.id}`) }} className="w-full bg-red-600 text-white border border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition">HAPUS DATA</button>
                        </div>

                        {jurnal.bukti_file && (
                            <div className="border-2 border-gray-900 p-3 bg-white">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2">📁 Berkas Lampiran Evaluasi:</h4>
                                {/\.(jpeg|jpg|png|webp)$/i.test(jurnal.bukti_file) ? (
                                    <a href={`/storage/${jurnal.bukti_file}`} target="_blank" rel="noreferrer" className="block cursor-zoom-in">
                                        <img src={`/storage/${jurnal.bukti_file}`} alt="Lampiran Refleksi" className="w-full h-auto border object-contain mx-auto" />
                                    </a>
                                ) : (
                                    <a href={`/storage/${jurnal.bukti_file}`} download className="w-full block text-center bg-gray-900 text-white py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition">UNDUH DOKUMEN</a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
JurnalShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;