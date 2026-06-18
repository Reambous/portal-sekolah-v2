import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function LombaEdit({ lomba }: { lomba: any }) {
    // Memuat data lama dari database ke dalam form state
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST', // Diperlukan Laravel untuk mengelabui rute POST agar bisa upload file
        tanggal: lomba.tanggal || '',
        jenis_lomba: lomba.jenis_lomba || '',
        peserta: lomba.peserta || [{ kelas: '', siswa: [''] }], 
        prestasi: lomba.prestasi || '',
        refleksi: lomba.refleksi || '',
        bukti_gambar: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mengirimkan data ke rute update di backend
        post(`/kesiswaan/lomba/${lomba.id}`);
    };

    // --- LOGIKA FORM DINAMIS (KELAS & SISWA) ---
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

    const removeSiswa = (kelasIndex: number, siswaIndex: number) => {
        const newPeserta = [...data.peserta];
        if (newPeserta[kelasIndex].siswa.length > 1) {
            newPeserta[kelasIndex].siswa.splice(siswaIndex, 1);
            setData('peserta', newPeserta);
        }
    };

    const addKelas = () => {
        setData('peserta', [...data.peserta, { kelas: '', siswa: [''] }]);
    };

    const removeKelas = (index: number) => {
        const newPeserta = [...data.peserta];
        if (newPeserta.length > 1) {
            newPeserta.splice(index, 1);
            setData('peserta', newPeserta);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title={`Edit Lomba: ${lomba.jenis_lomba}`} />

            <div className="max-w-[95%] mx-auto max-w-3xl">
                {/* HEADER */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Edit Data Lomba
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Perbarui rincian pencapaian prestasi siswa
                        </p>
                    </div>
                    <Link 
                        href={`/kesiswaan/lomba/${lomba.id}`} 
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition"
                    >
                        Batal
                    </Link>
                </div>

                {/* FORM UTAMA */}
                <div className="bg-white border-2 border-gray-900 p-6 md:p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* TANGGAL */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Tanggal Lomba</label>
                                <input type="date" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-bold" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} required />
                                {errors.tanggal && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.tanggal}</p>}
                            </div>
                            {/* NAMA LOMBA */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Nama Lomba & Tingkat</label>
                                <input type="text" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.jenis_lomba} onChange={(e) => setData('jenis_lomba', e.target.value)} required />
                                {errors.jenis_lomba && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.jenis_lomba}</p>}
                            </div>
                        </div>

                        {/* PENCAPAIAN */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Hasil / Prestasi</label>
                            <input type="text" className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.prestasi} onChange={(e) => setData('prestasi', e.target.value)} required />
                            {errors.prestasi && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.prestasi}</p>}
                        </div>

                        {/* INPUT PESERTA DINAMIS */}
                        <div className="border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-4">Daftar Peserta (Per Kelas)</label>
                            
                            {data.peserta.map((kelompok: any, kIndex: number) => (
                                <div key={kIndex} className="mb-6 p-4 border border-gray-200 bg-white relative">
                                    {data.peserta.length > 1 && (
                                        <button type="button" onClick={() => removeKelas(kIndex)} className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-[10px] font-bold uppercase tracking-wider">
                                            [Hapus Kelas]
                                        </button>
                                    )}
                                    
                                    <input 
                                        type="text" 
                                        placeholder="Nama Kelas (Contoh: XI-RPL 1)" 
                                        className="w-full border-b-2 border-t-0 border-x-0 border-gray-300 p-2 text-sm font-bold uppercase focus:border-gray-900 focus:ring-0 mb-3 bg-gray-50"
                                        value={kelompok.kelas}
                                        onChange={(e) => handleKelasChange(kIndex, e.target.value)}
                                        required
                                    />
                                    
                                    <div className="space-y-2 pl-4">
                                        {kelompok.siswa.map((nama: string, sIndex: number) => (
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
                                                {kelompok.siswa.length > 1 && (
                                                    <button type="button" onClick={() => removeSiswa(kIndex, sIndex)} className="text-gray-400 hover:text-red-600 text-xs font-bold px-1">
                                                        ✕
                                                    </button>
                                                )}
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

                        {/* REFLEKSI */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Jurnal Refleksi / Catatan Pembimbing</label>
                            <textarea rows={4} className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0" value={data.refleksi} onChange={(e) => setData('refleksi', e.target.value)} required />
                            {errors.refleksi && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.refleksi}</p>}
                        </div>

                        {/* GANTI GAMBAR */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Ganti Bukti Gambar / Sertifikat (Opsional)</label>
                            {lomba.bukti_gambar && (
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">
                                    💡 Sudah ada gambar tersimpan. Upload gambar baru jika ingin menggantinya.
                                </p>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                className="w-full border-2 border-gray-300 p-2 text-sm focus:border-gray-900 focus:ring-0 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-yellow-500 hover:file:text-black cursor-pointer"
                                onChange={(e) => setData('bukti_gambar', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.bukti_gambar && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.bukti_gambar}</p>}
                        </div>

                        {/* TOMBOL SIMPAN */}
                        <div className="pt-6 border-t-2 border-gray-900 flex justify-end">
                            <button type="submit" disabled={processing} className="bg-blue-700 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-blue-800 transition shadow-lg disabled:opacity-50">
                                {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

LombaEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;