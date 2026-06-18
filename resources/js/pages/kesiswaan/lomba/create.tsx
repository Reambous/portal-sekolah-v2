import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function LombaCreate() {
    // State 'peserta' sekarang adalah Array of Objects
    const { data, setData, post, processing, errors } = useForm({
        tanggal: '',
        jenis_lomba: '',
        peserta: [{ kelas: '', siswa: [''] }], // Default 1 kelas, 1 siswa kosong
        prestasi: '',
        refleksi: '',
        bukti_gambar: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kesiswaan/lomba');
    };

    // --- FUNGSI DINAMIS UNTUK PESERTA ---
    const handleKelasChange = (index: number, value: string) => {
        const newPeserta = [...data.peserta];
        newPeserta[index].kelas = value;
        setData('peserta', newPeserta);
    };

    const handleSiswaChange = (kelasIndex: number, siswaIndex: number, value: string) => {
        const newPeserta = [...data.peserta];
        newPeserta[kelasIndex].siswa[siswaIndex] = value;
        setData('peserta', newPeserta);
    };

    const addSiswa = (kelasIndex: number) => {
        const newPeserta = [...data.peserta];
        newPeserta[kelasIndex].siswa.push('');
        setData('peserta', newPeserta);
    };

    const addKelas = () => {
        setData('peserta', [...data.peserta, { kelas: '', siswa: [''] }]);
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Ajukan Lomba Baru" />

            <div className="max-w-[95%] mx-auto max-w-3xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Form Ajuan Lomba</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Rekam Data Kegiatan Lomba Siswa</p>
                    </div>
                    <Link href="/kesiswaan/lomba" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition">
                        Batal
                    </Link>
                </div>

                <div className="bg-white border-2 border-gray-900 p-6 md:p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Tanggal Lomba</label>
                                <input type="date" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Nama Lomba & Tingkat</label>
                                <input type="text" placeholder="Contoh: FLS2N Tingkat Provinsi" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.jenis_lomba} onChange={(e) => setData('jenis_lomba', e.target.value)} required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Hasil / Prestasi</label>
                            <input type="text" placeholder="Contoh: Juara 1, Harapan 2, Partisipan" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.prestasi} onChange={(e) => setData('prestasi', e.target.value)} required />
                        </div>

                        {/* --- BAGIAN DINAMIS PESERTA --- */}
                        <div className="border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-4">Daftar Peserta (Per Kelas)</label>
                            
                            {data.peserta.map((kelompok, kIndex) => (
                                <div key={kIndex} className="mb-6 p-4 border border-gray-200 bg-white">
                                    <input 
                                        type="text" 
                                        placeholder={`NAMA KELAS (Contoh: XI-RPL 1)`} 
                                        className="w-full border-b-2 border-t-0 border-x-0 border-gray-300 p-2 text-sm font-bold uppercase focus:border-gray-900 focus:ring-0 mb-3 bg-gray-50"
                                        value={kelompok.kelas}
                                        onChange={(e) => handleKelasChange(kIndex, e.target.value)}
                                        required
                                    />
                                    
                                    <div className="space-y-2 pl-4">
                                        {kelompok.siswa.map((nama, sIndex) => (
                                            <div key={sIndex} className="flex gap-2 items-center">
                                                <span className="text-xs font-bold text-gray-400 w-4">{sIndex + 1}.</span>
                                                <input 
                                                    type="text" 
                                                    placeholder="Nama Lengkap Siswa" 
                                                    className="flex-1 border border-gray-200 p-2 text-sm focus:border-gray-900 focus:ring-0"
                                                    value={nama}
                                                    onChange={(e) => handleSiswaChange(kIndex, sIndex, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addSiswa(kIndex)} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest mt-2">
                                            + Tambah Siswa di Kelas Ini
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" onClick={addKelas} className="bg-gray-200 text-gray-700 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-300 w-full transition">
                                + TAMBAH KELAS LAIN
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Jurnal Refleksi / Catatan Pembimbing</label>
                            <textarea rows={3} className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.refleksi} onChange={(e) => setData('refleksi', e.target.value)} required />
                        </div>

                        {/* UPLOAD BUKTI GAMBAR */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Bukti Gambar / Sertifikat (Opsional)</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                className="w-full border-2 border-gray-300 p-2 text-sm focus:border-gray-900 focus:ring-0 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-yellow-500 hover:file:text-black cursor-pointer"
                                onChange={(e) => setData('bukti_gambar', e.target.files ? e.target.files[0] : null)}
                            />
                        </div>

                        <div className="pt-6 border-t-2 border-gray-900 flex justify-between items-center bg-yellow-50 p-4 border-l-4 border-yellow-500">
                            <span className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest max-w-[60%]">
                                Info: Data yang disimpan akan berstatus "Pending"
                            </span>
                            <button type="submit" disabled={processing} className="bg-gray-900 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition shadow-lg disabled:opacity-50">
                                {processing ? 'MENYIMPAN...' : 'SIMPAN & AJUKAN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

LombaCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;