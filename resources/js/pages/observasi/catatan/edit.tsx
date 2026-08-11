import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function CatatanEdit({ catatan }: { catatan: any }) {
    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        hari_tanggal: catatan.hari_tanggal || '',
        nama_guru: catatan.nama_guru || '',
        mata_pelajaran: catatan.mata_pelajaran || '',
        kelas: catatan.kelas || '',
        waktu: catatan.waktu || '',
        nama_supervisor: catatan.nama_supervisor || '',
        tujuan_pembelajaran: catatan.tujuan_pembelajaran || '',
        area_pengembangan: catatan.area_pengembangan || '',
        strategi: catatan.strategi || '',
        catatan_khusus: catatan.catatan_khusus || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/observasi/pra-catatan/${catatan.id}`);
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Edit Lembar Catatan Pra-Observasi" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Edit Lembar Catatan Pra-Observasi</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link href={`/observasi/pra-catatan/${catatan.id}`} className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">Batal</Link>
                </div>

                <form onSubmit={submit} className="bg-white border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 space-y-6">
                    <div className="border-2 border-gray-900">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Identitas</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Hari / Tanggal</label>
                                <input type="date" className={field} value={data.hari_tanggal} onChange={(e) => setData('hari_tanggal', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Nama Guru</label>
                                <input type="text" className={field} value={data.nama_guru} onChange={(e) => setData('nama_guru', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Mata Pelajaran</label>
                                <input type="text" className={field} value={data.mata_pelajaran} onChange={(e) => setData('mata_pelajaran', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Kelas</label>
                                <input type="text" className={field} value={data.kelas} onChange={(e) => setData('kelas', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Waktu</label>
                                <input type="text" className={field} value={data.waktu} onChange={(e) => setData('waktu', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Nama Supervisor</label>
                                <input type="text" className={field} value={data.nama_supervisor} onChange={(e) => setData('nama_supervisor', e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="border-2 border-gray-900">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Isian Utama</div>
                        <div className="space-y-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Tujuan Pembelajaran</label>
                                <textarea rows={4} className={field} value={data.tujuan_pembelajaran} onChange={(e) => setData('tujuan_pembelajaran', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Area Pengembangan yang Hendak Dicapai</label>
                                <textarea rows={4} className={field} value={data.area_pengembangan} onChange={(e) => setData('area_pengembangan', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Strategi yang Dipersiapkan</label>
                                <textarea rows={4} className={field} value={data.strategi} onChange={(e) => setData('strategi', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Catatan Khusus Supervisor</label>
                                <textarea rows={4} className={field} value={data.catatan_khusus} onChange={(e) => setData('catatan_khusus', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button type="submit" disabled={processing} className="bg-blue-700 text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-md disabled:opacity-50">
                            {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

CatatanEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
