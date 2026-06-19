import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

// 1. Dapatkan tanggal hari ini dengan format YYYY-MM-DD sesuai timezone lokal
const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export default function IjinCreate() {
    // 2. Pasang getTodayDate() sebagai nilai default awal (default value)
    const { data, setData, post, processing, errors } = useForm({
        tanggal: getTodayDate(), // Otomatis terisi hari ini, tapi tetap editable!
        jam_mulai: '', 
        jam_selesai: '', 
        alasan: '',
        bukti_foto: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/ijin');
    };

    // ... sisa kode di bawahnya tetap sama persis

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Form Pengajuan Izin" />
            <div className="max-w-[95%] mx-auto max-w-2xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Ajukan Permohonan Izin</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pengisian form dispensasi atau izin meninggalkan jam mengajar</p>
                    </div>
                    <Link href="/ijin" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">Kembali</Link>
                </div>

                <div className="bg-white border-2 border-gray-900 p-6 md:p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Tanggal Izin</label>
                                <input type="date" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Jam Mulai <span className="text-gray-400 lowercase font-medium">(opsional)</span> Tidak Diisi = 1 Hari</label>
                                <input type="time" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-mono font-bold" value={data.jam_mulai} onChange={(e) => setData('jam_mulai', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Jam Selesai <span className="text-gray-400 lowercase font-medium">(opsional)</span></label>
                                <input type="time" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-mono font-bold" value={data.jam_selesai} onChange={(e) => setData('jam_selesai', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Alasan Pengajuan Izin</label>
                            <textarea rows={4} placeholder="Tuliskan alasan yang jelas, contoh: Menghadiri Diklat MGMP Kimia / Sakit opname rawat jalan..." className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.alasan} onChange={(e) => setData('alasan', e.target.value)} required />
                            {errors.alasan && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.alasan}</p>}
                        </div>

                        <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">📸 Unggah Foto Bukti Pendukung <span className="text-gray-400 lowercase font-medium">(Surat Tugas / Keterangan Dokter)</span></label>
                            <input type="file" accept="image/*,.pdf,.doc,.docx" className="w-full border border-gray-300 bg-white p-2 text-xs font-bold file:bg-gray-900 file:text-white cursor-pointer" onChange={(e) => setData('bukti_foto', e.target.files ? e.target.files[0] : null)} />
                        </div>

                        <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
                            <button type="submit" disabled={processing} className="bg-gray-900 text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black border-2 border-gray-900 transition shadow-md">
                                {processing ? 'MENGIRIM...' : 'KIRIM PERMOHONAN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
IjinCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;