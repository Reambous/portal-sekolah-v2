import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function InstrumenEdit({ instrumen, definisi, totalMaks }: { instrumen: any, definisi: any, totalMaks: number }) {
    const collectKodes = () => {
        const kodes: string[] = [];
        Object.values(definisi.seksi as Record<string, any>).forEach((seksi: any) => {
            seksi.indikator.forEach((ind: any) => {
                kodes.push(ind.kode);

                if (ind.sub) {
                    ind.sub.forEach((s: any) => kodes.push(s.kode));
                }
            });
        });

        return kodes;
    };

    const kodes = collectKodes();
    const initialSkor = Object.fromEntries(kodes.map((k) => [k, String(instrumen.skor?.[k] ?? '')]));
    const initialKomentar = Object.fromEntries(kodes.map((k) => [k, instrumen.komentar?.[k] ?? '']));

    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        jenjang: instrumen.jenjang || '',
        mata_pelajaran: instrumen.mata_pelajaran || '',
        kelas: instrumen.kelas || '',
        judul_perencanaan: instrumen.judul_perencanaan || '',
        skor: initialSkor,
        komentar: initialKomentar,
        kelebihan: instrumen.kelebihan || '',
        hal_ditingkatkan: instrumen.hal_ditingkatkan || '',
        rekomendasi: instrumen.rekomendasi || '',
    });

    const totalSkor = Object.values(data.skor as Record<string, string>).reduce((sum, v) => sum + (parseInt(v || '0', 10) || 0), 0);

    const setSkor = (kode: string, value: string) => {
        setData('skor', { ...data.skor, [kode]: value });
    };

    const setKomentar = (kode: string, value: string) => {
        setData('komentar', { ...data.komentar, [kode]: value });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/observasi/pra-instrumen/${instrumen.id}`);
    };

    const field = 'border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 font-medium w-full';
    const skalaLabel = definisi.skala as Record<string, string>;

    const renderIndikatorRow = (ind: any, indent: boolean) => (
        <div className={`border-t-2 border-gray-200 ${indent ? 'pl-8' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4">
                <div className="lg:col-span-7">
                    {ind.sub ? (
                        <p className="text-xs font-black text-gray-800 uppercase leading-relaxed">{ind.teks}</p>
                    ) : (
                        <p className="text-xs font-medium text-gray-800 leading-relaxed">{ind.teks}</p>
                    )}
                </div>
                <div className="lg:col-span-2">
                    <select
                        className="w-full border-2 border-gray-300 p-2 text-sm font-black text-center focus:border-gray-900 focus:ring-0"
                        value={data.skor[ind.kode] || ''}
                        onChange={(e) => setSkor(ind.kode, e.target.value)}
                    >
                        <option value="">-</option>
                        {Object.entries(skalaLabel).map(([val, label]) => (
                            <option key={val} value={val}>{val} · {label}</option>
                        ))}
                    </select>
                </div>
                <div className="lg:col-span-3">
                    <input
                        type="text"
                        className="border-2 border-gray-300 p-2 text-xs w-full focus:border-gray-900 focus:ring-0"
                        placeholder="Komentar kritis..."
                        value={data.komentar[ind.kode] || ''}
                        onChange={(e) => setKomentar(ind.kode, e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Edit Instrumen Umpan Balik" />
            <div className="max-w-[95%] mx-auto max-w-6xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">Edit Instrumen Umpan Balik</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Skala 0-4 · Total maksimal {totalMaks}</p>
                    </div>
                    <Link href={`/observasi/pra-instrumen/${instrumen.id}`} className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">Batal</Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Identitas Perencanaan</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Jenjang</label>
                                <input type="text" className={field} value={data.jenjang} onChange={(e) => setData('jenjang', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Mata Pelajaran</label>
                                <input type="text" className={field} value={data.mata_pelajaran} onChange={(e) => setData('mata_pelajaran', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Kelas</label>
                                <input type="text" className={field} value={data.kelas} onChange={(e) => setData('kelas', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">Judul Perencanaan Pembelajaran</label>
                                <input type="text" className={field} value={data.judul_perencanaan} onChange={(e) => setData('judul_perencanaan', e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="border-2 border-gray-900 bg-gray-50 p-3 text-[11px] font-bold uppercase tracking-wide flex flex-wrap gap-3">
                        {Object.entries(skalaLabel).map(([val, label]) => (
                            <span key={val}><b className="text-gray-900">{val}</b> = {label}</span>
                        ))}
                    </div>

                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="grid grid-cols-12 gap-0 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest">
                            <div className="lg:col-span-7 col-span-12 px-4 py-2">Aspek yang Diamati</div>
                            <div className="lg:col-span-2 col-span-6 px-4 py-2 text-center">Skala (0-4)</div>
                            <div className="lg:col-span-3 col-span-6 px-4 py-2">Komentar Kritis</div>
                        </div>

                        {Object.entries(definisi.seksi as Record<string, any>).map(([key, seksi]: [string, any]) => (
                            <div key={key}>
                                <div className="bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-widest border-t-2 border-gray-900">
                                    {seksi.nama}
                                </div>
                                {seksi.indikator.map((ind: any) => (
                                    <div key={ind.kode}>
                                        {ind.sub ? (
                                            <>
                                                {renderIndikatorRow(ind, false)}
                                                {ind.sub.map((s: any) => renderIndikatorRow(s, true))}
                                            </>
                                        ) : (
                                            renderIndikatorRow(ind, false)
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="border-2 border-gray-900 bg-gray-900 text-white p-4 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest">Jumlah Total Skor</span>
                        <span className="text-2xl font-black">{totalSkor} / {totalMaks}</span>
                    </div>

                    <div className="border-2 border-gray-900 bg-white shadow-sm">
                        <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Catatan Kualitatif</div>
                        <div className="space-y-5 p-5">
                            {(definisi.catatan as any[]).map((cat: any) => (
                                <div key={cat.kode}>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-2">{cat.teks}</label>
                                    <textarea
                                        rows={3}
                                        className={field}
                                        value={data[cat.kode] || ''}
                                        onChange={(e) => setData(cat.kode as any, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="bg-blue-700 text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-md disabled:opacity-50">
                            {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

InstrumenEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
