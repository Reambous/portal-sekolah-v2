import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function BeritaCreate() {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        isi: '',
        gambar: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/berita');
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Tulis Pengumuman" />

            <div className="max-w-[95%] mx-auto max-w-4xl">
                {/* HEADER HALAMAN */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Tulis Pengumuman Baru
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Publikasikan informasi ke papan pengumuman sekolah
                        </p>
                    </div>
                    <Link
                        href="/berita"
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition"
                    >
                        Kembali
                    </Link>
                </div>

                {/* FORM KOTAK TEGAS */}
                <div className="bg-white border-2 border-gray-200 p-6 md:p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                Judul Pengumuman
                            </label>
                            <input
                                type="text"
                                className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                placeholder="CONTOH: JADWAL UJIAN SEMESTER GANJIL"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                            />
                            {errors.judul && <p className="text-red-600 text-xs font-bold mt-2 uppercase">⚠️ {errors.judul}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                Isi Detail
                            </label>
                            <textarea
                                className="w-full border-2 border-gray-300 p-3 text-sm min-h-[250px] focus:border-gray-900 focus:ring-0 transition"
                                placeholder="Tuliskan isi pengumuman secara lengkap di sini..."
                                value={data.isi}
                                onChange={(e) => setData('isi', e.target.value)}
                            />
                            {errors.isi && <p className="text-red-600 text-xs font-bold mt-2 uppercase">⚠️ {errors.isi}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                Unggah Gambar (Opsional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer border-2 border-dashed border-gray-300 p-4 bg-gray-50"
                                onChange={(e) => setData('gambar', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.gambar && <p className="text-red-600 text-xs font-bold mt-2 uppercase">⚠️ {errors.gambar}</p>}
                        </div>

                        <div className="pt-6 border-t-2 border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-900 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition transform hover:-translate-y-1 shadow-lg disabled:opacity-50"
                            >
                                {processing ? 'MENYIMPAN...' : 'TERBITKAN PENGUMUMAN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

BeritaCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;