import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function UserIndex({ users, filters }: { users: any, filters: any }) {
    const { flash, auth } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const dataUsers = users.data || [];

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/admin/users', { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('⚠️ PERINGATAN: Menghapus akun akan menghilangkan akses pengguna ini. Lanjutkan?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Kelola Akun" />

            <div className="max-w-[95%] mx-auto">
                {/* HEADER */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Manajemen Akun
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Kelola hak akses Guru dan Administrator
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 md:flex-none mr-2">
                            <input
                                type="text"
                                placeholder="CARI NAMA / EMAIL..."
                                className="w-full md:w-64 border-2 border-gray-900 border-r-0 px-3 py-2 text-xs font-bold uppercase focus:ring-0 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="bg-gray-900 text-white border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition">
                                CARI
                            </button>
                        </form>
                        
                        {/* Tombol Tambah Akun (Rutenya nanti kita buat) */}
                        <Link href="/admin/users/create" className="bg-blue-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition shadow-sm">
                            + TAMBAH AKUN
                        </Link>
                    </div>
                </div>

                {/* NOTIFIKASI */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold uppercase tracking-wide">
                        ✅ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 text-red-800 text-sm font-bold uppercase tracking-wide">
                        ⚠️ {flash.error}
                    </div>
                )}

                {/* TABEL DATA AKUN (Gaya Brutalist) */}
                <div className="bg-white border-2 border-gray-900 shadow-sm overflow-x-auto mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                                <th className="p-4 border-r border-gray-700 w-16 text-center">NO</th>
                                <th className="p-4 border-r border-gray-700">INFORMASI PENGGUNA</th>
                                <th className="p-4 border-r border-gray-700 w-32 text-center">HAK AKSES</th>
                                <th className="p-4 w-40 text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest border-t-2 border-gray-900">
                                        Data akun tidak ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                dataUsers.map((item: any, index: number) => (
                                    <tr key={item.id} className="border-t-2 border-gray-200 hover:bg-gray-50 transition">
                                        <td className="p-4 border-r-2 border-gray-200 text-center font-bold">
                                            {users.from + index}
                                        </td>
                                        <td className="p-4 border-r-2 border-gray-200">
                                            <div className="font-black text-gray-900 uppercase tracking-wide text-sm mb-1">{item.name}</div>
                                            <div className="text-xs font-bold text-gray-500">{item.email}</div>
                                        </td>
                                        <td className="p-4 border-r-2 border-gray-200 text-center">
                                            <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
                                                item.role === 'admin' 
                                                ? 'bg-yellow-400 border-gray-900 text-black' 
                                                : 'bg-gray-100 border-gray-400 text-gray-600'
                                            }`}>
                                                {item.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link 
                                                    href={`/admin/users/${item.id}/edit`}
                                                    className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-900 hover:underline"
                                                >
                                                    EDIT
                                                </Link>
                                                {auth?.user?.id !== item.id && (
                                                    <>
                                                        <span className="text-gray-300">|</span>
                                                        <button 
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-900 hover:underline"
                                                        >
                                                            HAPUS
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINASI */}
                {users.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 border-t-4 border-gray-900 pt-8">
                        {users.links.map((link: any, index: number) => (
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-4 py-2 border-2 border-gray-900 text-xs font-bold uppercase transition ${
                                        link.active ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-900 hover:bg-yellow-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="px-4 py-2 border-2 border-gray-300 text-gray-400 bg-gray-50 text-xs font-bold uppercase cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

UserIndex.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;