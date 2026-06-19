import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function IjinEdit({ ijin }: { ijin: any }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',
        tanggal: ijin.tanggal || '',
        jam_mulai: ijin.jam_mulai ? ijin.jam_mulai.substring(0,5) : '',
        jam_selesai: ijin.jam_selesai ? ijin.jam_selesai.substring(0,5) : '',
        alasan: ijin.alasan || '',
        bukti_foto: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/ijin/${ijin.id}`);
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Edit Pengajuan Izin" />
            <div className="max-w-[95%] mx-auto max-w-2xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Perbarui Data Izin</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Melakukan revisi data atau waktu permohonan izin</p>
                    </div>
                    <Link href="/ijin" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">Batal</Link>
                </div>

                <div className="bg-white border-2 border-gray-900 p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Tanggal Izin</label>
                                <input type="date" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Jam Mulai</label>
                                <input type="time" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-mono font-bold" value={data.jam_mulai} onChange={(e) => setData('jam_mulai', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Jam Selesai</label>
                                <input type="time" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-mono font-bold" value={data.jam_selesai} onChange={(e) => setData('jam_selesai', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Alasan Pengajuan</label>
                            <textarea rows={4} className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium" value={data.alasan} onChange={(e) => setData('alasan', e.target.value)} required />
                            {errors.alasan && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.alasan}</p>}
                        </div>

                        <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-1">📸 Ganti Foto Bukti Baru</label>
                            <input type="file" accept="image/*,.pdf,.doc,.docx" className="w-full border border-gray-300 bg-white p-2 text-xs font-bold file:bg-gray-900 file:text-white cursor-pointer" onChange={(e) => setData('bukti_foto', e.target.files ? e.target.files[0] : null)} />
                        </div>

                        <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
                            <button type="submit" disabled={processing} className="bg-blue-700 text-white px-8 py-3 text-xs font-black uppercase border-2 border-gray-900 transition shadow-md">
                                {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
IjinEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;