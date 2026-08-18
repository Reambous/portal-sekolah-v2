import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function RppEdit({ record }: { record: any }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        judul: record.judul || '',
        file: null as File | null,
        keterangan: record.keterangan || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/observasi/rpp/${record.id}`);
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Edit RPP / Modul Ajar" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Edit RPP / Modul Ajar
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link
                        href={`/observasi/rpp/${record.id}`}
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition"
                    >
                        Batal
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* INFORMASI FILE */}
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Edit Dokumen</div>
                        <div className="space-y-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Judul Modul / Materi</label>
                                <input
                                    type="text"
                                    className={field}
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    required
                                />
                                {errors.judul && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.judul}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">File Dokumen (kosongkan jika tidak diganti)</label>
                                <input
                                    type="file"
                                    className={field}
                                    onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                    File aktif saat ini: <span className="text-gray-600">{record.file_name}</span> ({record.size_label})
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                    Format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR, JPG, JPEG, PNG • Maks: 20 MB
                                </p>
                                {errors.file && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.file}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Keterangan / Deskripsi Singkat (opsional)</label>
                                <textarea
                                    rows={4}
                                    className={field}
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                />
                                {errors.keterangan && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.keterangan}</p>}
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

RppEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;