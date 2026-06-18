import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function KegiatanEdit({ kegiatan }: { kegiatan: any }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST', // Trick Laravel untuk memproses upload file via Route POST
        tanggal: kegiatan.tanggal || '',
        nama_kegiatan: kegiatan.nama_kegiatan || '',
        refleksi: kegiatan.refleksi || '',
        bukti_gambar: null as File | null,
        lampiran: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/kesiswaan/kegiatan/${kegiatan.id}`);
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title={`Edit Kegiatan: ${kegiatan.nama_kegiatan}`} />

            <div className="max-w-[95%] mx-auto max-w-3xl">
                {/* HEADER */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Edit Jurnal Kegiatan
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Perbarui rekaman data dokumentasi agenda sekolah
                        </p>
                    </div>
                    <Link 
                        href={`/kesiswaan/kegiatan/${kegiatan.id}`} 
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition"
                    >
                        Batal
                    </Link>
                </div>

                {/* FORM UTAMA */}
                <div className="bg-white border-2 border-gray-900 p-6 md:p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* TANGGAL */}
                            <div className="md:col-span-1">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Tanggal Pelaksanaan</label>
                                <input 
                                    type="date" 
                                    className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" 
                                    value={data.tanggal} 
                                    onChange={(e) => setData('tanggal', e.target.value)} 
                                    required 
                                />
                                {errors.tanggal && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.tanggal}</p>}
                            </div>

                            {/* NAMA KEGIATAN */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Nama Agenda / Kegiatan</label>
                                <input 
                                    type="text" 
                                    className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" 
                                    value={data.nama_kegiatan} 
                                    onChange={(e) => setData('nama_kegiatan', e.target.value)} 
                                    required 
                                />
                                {errors.nama_kegiatan && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.nama_kegiatan}</p>}
                            </div>
                        </div>

                        {/* CATATAN EVALUASI / REFLEKSI */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Catatan Evaluasi / Jurnal Refleksi</label>
                            <textarea 
                                rows={5} 
                                className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium" 
                                value={data.refleksi} 
                                onChange={(e) => setData('refleksi', e.target.value)} 
                                required 
                            />
                            {errors.refleksi && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.refleksi}</p>}
                        </div>

                        {/* MEDIA UPLOAD SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 border-2 border-dashed border-gray-300">
                            {/* GANTI FOTO */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-1">
                                    📸 Ganti Foto Dokumentasi (Opsional)
                                </label>
                                {kegiatan.bukti_gambar && <p className="text-[9px] text-green-700 font-bold uppercase mb-2">💡 File foto sudah terarsip di sistem.</p>}
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="w-full border border-gray-300 bg-white p-2 text-xs font-bold file:bg-gray-900 file:text-white cursor-pointer"
                                    onChange={(e) => setData('bukti_gambar', e.target.files ? e.target.files[0] : null)}
                                />
                                {errors.bukti_gambar && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.bukti_gambar}</p>}
                            </div>

                            {/* GANTI BERKAS */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-1">
                                    📄 Ganti Berkas Lampiran (Opsional)
                                </label>
                                {kegiatan.lampiran && <p className="text-[9px] text-blue-700 font-bold uppercase mb-2">💡 File dokumen ({kegiatan.nama_file_asli}) sudah terarsip.</p>}
                                <input 
                                    type="file" 
                                    accept=".pdf, .doc, .docx"
                                    className="w-full border border-gray-300 bg-white p-2 text-xs font-bold file:bg-blue-950 file:text-white cursor-pointer"
                                    onChange={(e) => setData('lampiran', e.target.files ? e.target.files[0] : null)}
                                />
                                {errors.lampiran && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.lampiran}</p>}
                            </div>
                        </div>

                        {/* TOMBOL AKSI SUBMIT */}
                        <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="bg-blue-700 text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-blue-800 border-2 border-gray-900 transition shadow-md disabled:opacity-50"
                            >
                                {processing ? 'MENYIMPAN PERUBAHAN...' : 'SIMPAN PERUBAHAN JURNAL'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

KegiatanEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;