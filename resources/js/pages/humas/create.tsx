import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function HumasCreate() {
    const { data, setData, post, processing, errors } = useForm({
        tanggal: '', nama_kegiatan: '',  refleksi: '',
        bukti_gambar: null as File | null, lampiran: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/humas');
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Catat Jurnal Humas" />
            <div className="max-w-[95%] mx-auto max-w-3xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Jurnal Humas Baru</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pencatatan rekam agenda kerja sama eksternal sekolah</p>
                    </div>
                    <Link href="/humas" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">Kembali</Link>
                </div>
                <div className="bg-white border-2 border-gray-900 p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Tanggal</label>
                                <input type="date" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Nama Agenda / Kegiatan Humas</label>
                                <input type="text" placeholder="Contoh: Rapat Pleno Komite Sekolah / Kunjungan Industri PT ABC" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.nama_kegiatan} onChange={(e) => setData('nama_kegiatan', e.target.value)} required />
                                {errors.nama_kegiatan && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.nama_kegiatan}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Evaluasi, Hasil Pembahasan & Refleksi</label>
                            <textarea rows={5} placeholder="Tuliskan jalannya agenda kemitraan, poin kerja sama, MoUs, beserta catatan evaluasinya..." className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.refleksi} onChange={(e) => setData('refleksi', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 border-2 border-dashed border-gray-300">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">📸 Foto Dokumentasi Humas</label>
                                <input type="file" accept="image/*" className="w-full border border-gray-300 bg-white p-2 text-xs font-bold file:bg-gray-900 file:text-white cursor-pointer" onChange={(e) => setData('bukti_gambar', e.target.files ? e.target.files[0] : null)} />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">📄 Berkas MoU / Proposal</label>
                                <input type="file" accept=".pdf, .doc, .docx" className="w-full border border-gray-300 bg-white p-2 text-xs font-bold file:bg-blue-950 file:text-white cursor-pointer" onChange={(e) => setData('lampiran', e.target.files ? e.target.files[0] : null)} />
                            </div>
                        </div>
                        <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
                            <button type="submit" disabled={processing} className="bg-gray-900 text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-md">{processing ? 'MENYIMPAN...' : 'SIMPAN ARSIP HUMAS'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
HumasCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;