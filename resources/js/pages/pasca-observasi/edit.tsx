import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function PascaObservasiEdit({ record, users }: { record: any; users: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        hari_tanggal: record.hari_tanggal || '',
        nama_guru: record.nama_guru || '',
        kelas: record.kelas || '',
        mata_pelajaran: record.mata_pelajaran || '',
        waktu_percakapan: record.waktu_percakapan || '',
        supervisor: record.supervisor || '',
        catatan_refleksi_guru: record.catatan_refleksi_guru || '',
        topik_percakapan_catatan: record.topik_percakapan_catatan || '',
        rencana_tindak_lanjut: record.rencana_tindak_lanjut || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/pasca-observasi/${record.id}`);
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';
    const textarea = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 w-full font-medium';

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Edit Pasca Observasi" />
            <div className="max-w-[95%] mx-auto max-w-6xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Edit Pasca Observasi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Lembar Catatan Percakapan</p>
                    </div>
                    <Link
                        href={`/pasca-observasi/${record.id}`}
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition"
                    >
                        Batal
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* IDENTITAS */}
                    <div className="border-2 border-gray-900">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Identitas</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Sekolah</label>
                                <input
                                    type="text"
                                    className={field}
                                    value="SMP Negeri 1 Candimulyo"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Hari / Tanggal</label>
                                <input
                                    type="date"
                                    className={field}
                                    value={data.hari_tanggal}
                                    onChange={(e) => setData('hari_tanggal', e.target.value)}
                                    required
                                />
                                {errors.hari_tanggal && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.hari_tanggal}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Nama Guru</label>
                                <input
                                    type="text"
                                    className={field}
                                    value={data.nama_guru}
                                    onChange={(e) => setData('nama_guru', e.target.value)}
                                    required
                                />
                                {errors.nama_guru && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.nama_guru}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Kelas</label>
                                <input
                                    type="text"
                                    className={field}
                                    value={data.kelas}
                                    onChange={(e) => setData('kelas', e.target.value)}
                                    required
                                />
                                {errors.kelas && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.kelas}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Mata Pelajaran</label>
                                <input
                                    type="text"
                                    className={field}
                                    value={data.mata_pelajaran}
                                    onChange={(e) => setData('mata_pelajaran', e.target.value)}
                                    required
                                />
                                {errors.mata_pelajaran && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.mata_pelajaran}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Waktu Percakapan</label>
                                <input
                                    type="text"
                                    className={field}
                                    value={data.waktu_percakapan}
                                    onChange={(e) => setData('waktu_percakapan', e.target.value)}
                                    required
                                />
                                {errors.waktu_percakapan && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.waktu_percakapan}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Supervisor</label>
                                <input
                                    type="text"
                                    className={field}
                                    value={data.supervisor}
                                    onChange={(e) => setData('supervisor', e.target.value)}
                                    required
                                />
                                {errors.supervisor && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.supervisor}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ISIAN UTAMA */}
                    <div className="border-2 border-gray-900">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Isian Utama</div>
                        <div className="space-y-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Catatan Refleksi Guru</label>
                                <textarea
                                    rows={5}
                                    className={textarea}
                                    value={data.catatan_refleksi_guru}
                                    onChange={(e) => setData('catatan_refleksi_guru', e.target.value)}
                                    required
                                />
                                {errors.catatan_refleksi_guru && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.catatan_refleksi_guru}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Topik Percakapan dan Catatan</label>
                                <textarea
                                    rows={5}
                                    className={textarea}
                                    value={data.topik_percakapan_catatan}
                                    onChange={(e) => setData('topik_percakapan_catatan', e.target.value)}
                                    required
                                />
                                {errors.topik_percakapan_catatan && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.topik_percakapan_catatan}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Rencana Tindak Lanjut</label>
                                <textarea
                                    rows={5}
                                    className={textarea}
                                    value={data.rencana_tindak_lanjut}
                                    onChange={(e) => setData('rencana_tindak_lanjut', e.target.value)}
                                    required
                                />
                                {errors.rencana_tindak_lanjut && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.rencana_tindak_lanjut}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-700 text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-md disabled:opacity-50"
                        >
                            {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

PascaObservasiEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
