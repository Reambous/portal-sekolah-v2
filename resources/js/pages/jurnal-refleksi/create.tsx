import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export default function JurnalCreate() {
    const { data, setData, post, processing, errors } = useForm({
        tanggal: getTodayDate(),
        kategori: '',
        judul_refleksi: '',
        isi_refleksi: '',
        bukti_file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/jurnal-refleksi');
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Tulis Jurnal Refleksi" />
            <div className="max-w-[95%] mx-auto max-w-3xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Jurnal Refleksi Baru</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pencatatan evaluasi proses mengajar dan refleksi kritis guru</p>
                    </div>
                    <Link href="/jurnal-refleksi" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">Kembali</Link>
                </div>

                <div className="bg-white border-2 border-gray-900 p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Tanggal Evaluasi</label>
                                <input type="date" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Kategori Bidang Refleksi</label>
                                <input type="text" placeholder="Contoh: Evaluasi Kelas XI-TKJ / Pengembangan Diri / Diskusi Sejawat" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" value={data.kategori} onChange={(e) => setData('kategori', e.target.value)} required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Judul Catatan Refleksi</label>
                            <input type="text" placeholder="Masukkan judul evaluasi pokok bahasan..." className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" value={data.judul_refleksi} onChange={(e) => setData('judul_refleksi', e.target.value)} required />
                            {errors.judul_refleksi && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.judul_refleksi}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Isi Narasi Evaluasi & Tindak Lanjut</label>
                            <textarea rows={6} placeholder="Uraikan apa yang berjalan baik, kendala pemahaman siswa, efektivitas media ajar, serta rencana aksi perbaikan pembelajaran berikutnya..." className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium" value={data.isi_refleksi} onChange={(e) => setData('isi_refleksi', e.target.value)} required />
                        </div>

                        <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">📸 Lampiran File / Foto  <span className="text-gray-400 lowercase font-medium">(opsional)</span></label>
                            <input type="file" accept="image/*,.pdf,.doc,.docx" className="w-full border border-gray-300 bg-white p-2 text-xs font-bold file:bg-gray-900 file:text-white cursor-pointer" onChange={(e) => setData('bukti_file', e.target.files ? e.target.files[0] : null)} />
                        </div>

                        <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
                            <button type="submit" disabled={processing} className="bg-gray-900 text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-md">
                                {processing ? 'MENYIMPAN...' : 'SIMPAN CATATAN JURNAL'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
JurnalCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;