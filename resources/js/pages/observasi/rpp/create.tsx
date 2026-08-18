import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function RppCreate() {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        mata_pelajaran: '',
        kelas_semester: '',
        file: null as File | null,
        keterangan: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/observasi/rpp');
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Upload RPP / Modul Ajar" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Upload RPP / Modul Ajar
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link
                        href="/observasi/rpp"
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition"
                    >
                        Kembali
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* INFORMASI FILE */}
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Upload Dokumen</div>
                        <div className="space-y-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Judul Modul / Materi</label>
                                <input
                                    type="text"
                                    className={field}
                                    placeholder="Contoh: RPP IPA Kelas VIII Bab 1"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    required
                                />
                                {errors.judul && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.judul}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Mata Pelajaran</label>
                                    <input
                                        type="text"
                                        className={field}
                                        placeholder="Contoh: IPA"
                                        value={data.mata_pelajaran}
                                        onChange={(e) => setData('mata_pelajaran', e.target.value)}
                                        required
                                    />
                                    {errors.mata_pelajaran && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.mata_pelajaran}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Kelas & Semester</label>
                                    <input
                                        type="text"
                                        className={field}
                                        placeholder="Contoh: VIII / Ganjil"
                                        value={data.kelas_semester}
                                        onChange={(e) => setData('kelas_semester', e.target.value)}
                                        required
                                    />
                                    {errors.kelas_semester && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.kelas_semester}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">File Dokumen</label>
                                <input
                                    type="file"
                                    className={field}
                                    onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                    required
                                />
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
                                    placeholder="Deskripsi singkat materi..."
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
                            className="bg-gray-900 text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition shadow-md disabled:opacity-50"
                        >
                            {processing ? 'MENYIMPAN...' : 'UPLOAD FILE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

RppCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;