import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function BeritaEdit({ berita }: { berita: any }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        judul: berita.judul,
        isi: berita.isi,
        gambar: null as File | null,
        lampiran: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/berita/${berita.id}`);
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title={`Edit: ${berita.judul}`} />

            <div className="max-w-[95%] mx-auto max-w-4xl">
                {/* HEADER HALAMAN */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Edit Pengumuman
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Perbarui informasi yang sudah diterbitkan
                        </p>
                    </div>
                    <Link
                        href="/berita"
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition"
                    >
                        Batal
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
                                value={data.isi}
                                onChange={(e) => setData('isi', e.target.value)}
                            />
                            {errors.isi && <p className="text-red-600 text-xs font-bold mt-2 uppercase">⚠️ {errors.isi}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* KOLOM KIRI: INPUT KHUSUS GAMBAR SAMPUL */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">
                                    Gambar Sampul Berita (Foto / Gambar)
                                </label>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">
                                    *Format: JPG, PNG, WEBP (Maksimal 4MB)
                                </p>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="w-full border-2 border-gray-300 p-2 text-sm focus:border-gray-900 focus:ring-0 file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:font-black file:bg-gray-900 file:text-white hover:file:bg-yellow-500 hover:file:text-black cursor-pointer font-bold"
                                    onChange={(e) => setData('gambar', e.target.files ? e.target.files[0] : null)}
                                />
                                {errors.gambar && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.gambar}</p>}
                            </div>

                            {/* KOLOM KANAN: INPUT KHUSUS FILE LAMPIRAN DOKUMEN */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">
                                    File Dokumen Lampiran (Opsional)
                                </label>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">
                                    *Format: PDF, DOC, DOCX (Maksimal 5MB)
                                </p>
                                <input 
                                    type="file" 
                                    accept=".pdf, .doc, .docx"
                                    className="w-full border-2 border-gray-300 p-2 text-sm focus:border-gray-900 focus:ring-0 file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:font-black file:bg-blue-900 file:text-white hover:file:bg-yellow-500 hover:file:text-black cursor-pointer font-bold"
                                    onChange={(e) => setData('lampiran', e.target.files ? e.target.files[0] : null)}
                                />
                                {errors.lampiran && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.lampiran}</p>}
                            </div>
                        </div>

                        <div className="pt-6 border-t-2 border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-700 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-blue-800 transition transform hover:-translate-y-1 shadow-lg disabled:opacity-50"
                            >
                                {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

BeritaEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;