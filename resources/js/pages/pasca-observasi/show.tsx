import { Head, Link, router, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function PascaObservasiShow({ record }: { record: any }) {
    const { auth, flash } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const isOwner = auth?.user?.id === record.user_id;
    const canManage = isAdmin || isOwner;

    const handleDelete = () => {
        if (confirm('YAKIN INGIN MENGHAPUS PASCA OBSERVASI INI?')) {
            router.delete(`/pasca-observasi/${record.id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Detail Pasca Observasi" />
            <div className="max-w-[95%] mx-auto max-w-6xl">
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Detail Pasca Observasi
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{record.nama_guru}</p>
                    </div>
                    <Link href="/pasca-observasi" className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 transition">
                        Kembali
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}

                {/* TOMBOL EXPORT WORD */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <a
                        href={`/pasca-observasi/${record.id}/export/word`}
                        className="bg-green-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-green-800 border-2 border-gray-900 transition shadow-md"
                    >
                        ⬇ EXPORT WORD (.DOCX)
                    </a>
                    {canManage && (
                        <>
                            <Link
                                href={`/pasca-observasi/${record.id}/edit`}
                                className="bg-yellow-500 text-black px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-600 border-2 border-gray-900 transition shadow-md"
                            >
                                EDIT
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 border-2 border-gray-900 transition shadow-md"
                            >
                                HAPUS
                            </button>
                        </>
                    )}
                </div>

                {/* IDENTITAS */}
                <div className="border-2 border-gray-900 bg-gray-50 p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sekolah</span>
                        <p className="text-sm font-bold">SMP Negeri 1 Candimulyo</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hari / Tanggal</span>
                        <p className="text-sm font-bold">{new Date(record.hari_tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Guru</span>
                        <p className="text-sm font-bold">{record.nama_guru}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kelas</span>
                        <p className="text-sm font-bold">{record.kelas}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mata Pelajaran</span>
                        <p className="text-sm font-bold">{record.mata_pelajaran}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Waktu Percakapan</span>
                        <p className="text-sm font-bold">{record.waktu_percakapan}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Supervisor</span>
                        <p className="text-sm font-bold">{record.supervisor}</p>
                    </div>
                </div>

                {/* ISIAN UTAMA */}
                <div className="border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Catatan Refleksi Guru</div>
                    <div className="p-5">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words font-medium">{record.catatan_refleksi_guru || '-'}</p>
                    </div>
                </div>

                <div className="border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Topik Percakapan dan Catatan</div>
                    <div className="p-5">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words font-medium">{record.topik_percakapan_catatan || '-'}</p>
                    </div>
                </div>

                <div className="border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2">Rencana Tindak Lanjut</div>
                    <div className="p-5">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words font-medium">{record.rencana_tindak_lanjut || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

PascaObservasiShow.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;
