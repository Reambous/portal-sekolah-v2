import { Head, Link, router, usePage } from '@inertiajs/react';
import Pagination from '@/components/pagination';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function ObservasiIndex({ catatan, instrumen }: { catatan: any, instrumen: any }) {
    const { flash, auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const dataCatatan = catatan.data || [];
    const dataInstrumen = instrumen.data || [];

    const handleDeleteCatatan = (id: number) => {
        if (confirm('YAKIN INGIN MENGHAPUS LEMBAR CATATAN INI?')) {
            router.delete(`/observasi/pra-catatan/${id}`);
        }
    };

    const handleDeleteInstrumen = (id: number) => {
        if (confirm('YAKIN INGIN MENGHAPUS INSTRUMEN INI?')) {
            router.delete(`/observasi/pra-instrumen/${id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Observasi - Pra Observasi" />

            <div className="max-w-[95%] mx-auto">
                {/* HEADER */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Pra Observasi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Pilih formulir isian pra-observasi yang ingin dikerjakan
                        </p>
                    </div>
                    <span className="text-xs font-black uppercase bg-gray-900 text-white px-3 py-1.5 border-2 border-gray-900">
                        Sekolah: SMP Negeri 1 Candimulyo
                    </span>
                </div>

                {/* NOTIFIKASI */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* PILIHAN FORM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Link
                        href="/observasi/pra-catatan/create"
                        className="group border-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:shadow-none transition flex flex-col gap-3"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-3 py-1 self-start">
                            Pilihan A
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tighter group-hover:underline">
                            Lembar Catatan Percakapan
                        </h3>
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Pra-Observasi Kelas
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            Isi percakapan pra-observasi: tujuan, area pengembangan, strategi, dan catatan supervisor.
                            <span className="block mt-2 font-black text-gray-900 uppercase">Export: Word (.docx)</span>
                        </p>
                    </Link>

                    <Link
                        href="/observasi/pra-instrumen/create"
                        className="group border-4 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:shadow-none transition flex flex-col gap-3"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-3 py-1 self-start">
                            Pilihan B
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tighter group-hover:underline">
                            Instrumen Umpan Balik
                        </h3>
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Perencanaan Pembelajaran Mendalam
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            Penilaian skala 0-4 untuk 27 indikator + komentar kritis.
                            <span className="block mt-2 font-black text-gray-900 uppercase">Export: Excel (.xlsx) + Total Skor</span>
                        </p>
                    </Link>
                </div>

                {/* REKAP FORM A */}
                <div className="mb-10">
                    <h3 className="text-lg font-black uppercase tracking-tighter border-b-4 border-gray-900 pb-2 mb-4">
                        Rekap Lembar Catatan (A)
                    </h3>
                    <div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <table className="w-full text-left border-collapse table-auto min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                    <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">GURU / TANGGAL</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">MAPEL / KELAS</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">SUPERVISOR</th>
                                    <th className="p-4 w-32 text-center whitespace-nowrap">AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataCatatan.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                                            Belum ada lembar catatan pra-observasi.
                                        </td>
                                    </tr>
                                ) : (
                                    dataCatatan.map((item: any, index: number) => (
                                        <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                                            <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs">{catatan.from + index}</td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                                                <div className="font-black text-gray-900 uppercase truncate">{item.nama_guru}</div>
                                                <div className="font-bold text-gray-500 whitespace-nowrap">{new Date(item.hari_tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs font-medium text-gray-700">
                                                <div className="truncate uppercase">{item.mata_pelajaran}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">Kelas: {item.kelas}</div>
                                            </td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs font-bold text-gray-600 uppercase">{item.nama_supervisor}</td>
                                            <td className="p-3 text-center">
                                                <div className="flex gap-1 justify-center">
                                                    <Link href={`/observasi/pra-catatan/${item.id}`} className="bg-blue-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition inline-block">
                                                        DETAIL
                                                    </Link>
                                                    {(isAdmin || auth?.user?.id === item.user_id) && (
                                                        <button onClick={() => handleDeleteCatatan(item.id)} className="bg-red-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition inline-block">
                                                            HAPUS
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination paginator={catatan} />
                </div>

                {/* REKAP FORM B */}
                <div className="mb-10">
                    <h3 className="text-lg font-black uppercase tracking-tighter border-b-4 border-gray-900 pb-2 mb-4">
                        Rekap Instrumen Umpan Balik (B)
                    </h3>
                    <div className="w-full overflow-x-auto border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <table className="w-full text-left border-collapse table-auto min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                    <th className="p-4 border-r border-gray-700 w-16 text-center whitespace-nowrap">NO</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">JUDUL PERENCANAAN</th>
                                    <th className="p-4 border-r border-gray-700 whitespace-nowrap">MAPEL / KELAS</th>
                                    <th className="p-4 border-r border-gray-700 w-24 text-center whitespace-nowrap">TOTAL</th>
                                    <th className="p-4 w-32 text-center whitespace-nowrap">AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataInstrumen.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                                            Belum ada instrumen umpan balik.
                                        </td>
                                    </tr>
                                ) : (
                                    dataInstrumen.map((item: any, index: number) => (
                                        <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                                            <td className="p-4 border-r-2 border-gray-200 text-center font-bold text-xs">{instrumen.from + index}</td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs max-w-xs">
                                                <div className="font-black text-gray-900 uppercase truncate">{item.judul_perencanaan}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">{item.jenjang}</div>
                                            </td>
                                            <td className="p-4 border-r-2 border-gray-200 text-xs font-medium text-gray-700">
                                                <div className="truncate uppercase">{item.mata_pelajaran}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">Kelas: {item.kelas}</div>
                                            </td>
                                            <td className="p-4 border-r-2 border-gray-200 text-center font-black text-blue-800">{item.total_skor ?? '-'}</td>
                                            <td className="p-3 text-center">
                                                <div className="flex gap-1 justify-center">
                                                    <Link href={`/observasi/pra-instrumen/${item.id}`} className="bg-blue-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition inline-block">
                                                        DETAIL
                                                    </Link>
                                                    {(isAdmin || auth?.user?.id === item.user_id) && (
                                                        <button onClick={() => handleDeleteInstrumen(item.id)} className="bg-red-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition inline-block">
                                                            HAPUS
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination paginator={instrumen} />
                </div>
            </div>
        </div>
    );
}

ObservasiIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
