import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function Pengaturan({ kutipan, slider }: { kutipan: string; slider: string[] }) {
    const { flash } = usePage().props as any;
    const { data, setData, put, processing, errors } = useForm({
        kutipan,
        slider: [] as File[],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/pengaturan');
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const list = Array.from(files).slice(0, 6);
        setData('slider', list);
        setPreviews(list.map((f) => URL.createObjectURL(f)));
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Pengaturan Dashboard" />
            <div className="max-w-[95%] mx-auto max-w-4xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Pengaturan Dashboard
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Kelola teks & gambar beranda • SMP Negeri 1 Candimulyo</p>
                    </div>
                    <Link href="/" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">
                        Lihat Beranda
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* KUTIPAN */}
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Kotak Tengah (Kutipan)</div>
                        <div className="p-5">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Teks Kutipan Dashboard</label>
                            <textarea
                                rows={5}
                                className={field}
                                value={data.kutipan}
                                onChange={(e) => setData('kutipan', e.target.value)}
                                required
                            />
                            {errors.kutipan && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.kutipan}</p>}
                        </div>
                    </div>

                    {/* SLIDER GAMBAR */}
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Gambar Slider Beranda</div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Upload Slider Baru (pilih 1 - 6 gambar)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    className={field}
                                    onChange={(e) => handleFiles(e.target.files)}
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                    Format: JPG, JPEG, PNG, WEBP • Maks: 5 MB per gambar • Maks: 6 gambar • Gambar lama akan diganti (dihapus)
                                </p>
                                {errors.slider && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors.slider}</p>}
                                {errors['slider.0'] && <p className="text-red-600 text-[10px] font-bold mt-1 uppercase">⚠️ {errors['slider.0']}</p>}
                            </div>

                            {/* Slider saat ini */}
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-700 mb-2">
                                    Slider Saat Ini ({slider.length} gambar)
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {slider.map((path: string, i: number) => (
                                        <div key={i} className="border-2 border-gray-300 overflow-hidden">
                                            <img src={path.startsWith('/') ? path : `/storage/${path}`} alt={`slider-${i}`} className="w-full h-24 object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preview file baru */}
                            {previews.length > 0 && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Preview Slider Baru ({previews.length})</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {previews.map((src, i) => (
                                            <div key={i} className="border-2 border-gray-300 overflow-hidden">
                                                <img src={src} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gray-900 text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition shadow-md disabled:opacity-50"
                        >
                            {processing ? 'MENYIMPAN...' : 'SIMPAN PENGATURAN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Pengaturan.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;