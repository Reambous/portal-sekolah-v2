import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function DokumentasiCreate() {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        gambar: [] as File[],
        keterangan: '',
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/observasi/dokumentasi');
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const list = Array.from(files).slice(0, 10);
        setData('gambar', list);
        setPreviews(list.map((f) => URL.createObjectURL(f)));
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Tambah Dokumentasi" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Tambah Dokumentasi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link
                        href="/observasi/dokumentasi"
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition"
                    >
                        Kembali
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* INFORMASI */}
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Upload Dokumentasi</div>
                        <div className="space-y-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Judul Dokumentasi</label>
                                <input
                                    type="text"
                                    className={field}
                                    placeholder="Contoh: Kegiatan Pembelajaran IPA"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    required
                                />
                                {errors.judul && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.judul}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Gambar (maksimal 10 gambar)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    className={field}
                                    onChange={(e) => handleFiles(e.target.files)}
                                    required
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                    Format: JPG, JPEG, PNG, WEBP • Maks: 10 MB per gambar • Maks: 10 gambar
                                </p>
                                {errors.gambar && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.gambar}</p>}
                                {errors['gambar.0'] && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors['gambar.0']}</p>}

                                {previews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {previews.map((src, i) => (
                                            <div key={i} className="border-2 border-gray-300 overflow-hidden">
                                                <img src={src} alt={`preview-${i}`} className="w-full h-28 object-cover" />
                                                <div className="bg-gray-100 text-[9px] font-bold uppercase text-gray-500 px-1 py-1 text-center truncate">
                                                    {(data.gambar[i] as File)?.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Keterangan / Deskripsi Singkat (opsional)</label>
                                <textarea
                                    rows={4}
                                    className={field}
                                    placeholder="Deskripsi singkat dokumentasi..."
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
                            {processing ? 'MENYIMPAN...' : 'SIMPAN DOKUMENTASI'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

DokumentasiCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;