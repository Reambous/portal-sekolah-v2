import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function DokumentasiEdit({ record }: { record: any }) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        judul: record.judul || '',
        gambar: [] as File[],
        keterangan: record.keterangan || '',
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/observasi/dokumentasi/${record.id}`);
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const sisa = 10 - (record.gambar?.length ?? 0);
        const list = Array.from(files).slice(0, sisa);
        setData('gambar', list);
        setPreviews(list.map((f) => URL.createObjectURL(f)));
    };

    const handleHapusGambar = (gambarId: number) => {
        if (confirm('YAKIN INGIN MENGHAPUS GAMBAR INI?')) {
            router.delete(`/observasi/dokumentasi/gambar/${gambarId}`);
        }
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Edit Dokumentasi" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Edit Dokumentasi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Sekolah: SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link
                        href={`/observasi/dokumentasi/${record.id}`}
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition"
                    >
                        Batal
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* INFORMASI */}
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Edit Dokumentasi</div>
                        <div className="space-y-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Judul Dokumentasi</label>
                                <input
                                    type="text"
                                    className={field}
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    required
                                />
                                {errors.judul && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.judul}</p>}
                            </div>

                            {/* Gambar saat ini */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">
                                    Gambar Saat Ini ({record.gambar?.length ?? 0} / 10)
                                </label>
                                {record.gambar?.length ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {record.gambar.map((g: any) => (
                                            <div key={g.id} className="border-2 border-gray-300 overflow-hidden">
                                                <a href={`/storage/${g.path}`} target="_blank" rel="noreferrer">
                                                    <img src={`/storage/${g.path}`} alt={g.name} className="w-full h-28 object-cover" />
                                                </a>
                                                <div className="bg-gray-100 px-1 py-1 flex items-center justify-between gap-1">
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase truncate">{g.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleHapusGambar(g.id)}
                                                        className="bg-red-600 text-white px-1.5 py-0.5 text-[9px] font-bold uppercase hover:bg-red-700 transition whitespace-nowrap"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 font-medium">Belum ada gambar.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Tambah Gambar ({record.gambar?.length ?? 0}/10 terpakai)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    className={field}
                                    onChange={(e) => handleFiles(e.target.files)}
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                    Format: JPG, JPEG, PNG, WEBP • Maks: 10 MB per gambar
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

DokumentasiEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;