import { Head, Link, useForm } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'guru', // Default sebagai guru/user biasa
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title="Tambah Akun Baru" />

            <div className="max-w-[95%] mx-auto max-w-3xl">
                {/* HEADER HALAMAN */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Buat Akun Baru
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Daftarkan akses untuk Guru atau Administrator
                        </p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="bg-white text-gray-900 border-2 border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition"
                    >
                        Batal
                    </Link>
                </div>

                {/* FORM KOTAK TEGAS */}
                <div className="bg-white border-2 border-gray-900 p-6 md:p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NAMA LENGKAP */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                    placeholder="CONTOH: BUDI SANTOSO"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.name}</p>}
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                    Alamat Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                    placeholder="budi@sekolah.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.email}</p>}
                            </div>
                        </div>

                        {/* HAK AKSES (ROLE) */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                Hak Akses (Role)
                            </label>
                            <select
                                className="w-full border-2 border-gray-300 p-3 text-sm font-bold uppercase focus:border-gray-900 focus:ring-0 transition cursor-pointer"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                <option value="user">GURU / STAFF (Akses Terbatas)</option>
                                <option value="admin">ADMINISTRATOR (Akses Penuh)</option>
                            </select>
                            {errors.role && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.role}</p>}
                        </div>

                        <div className="border-t-2 border-gray-100 my-6 pt-6">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4">Pengaturan Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* PASSWORD */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                        Password Awal
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                        placeholder="Minimal 2 Karakter"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.password}</p>}
                                </div>

                                {/* KONFIRMASI PASSWORD */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                        Ulangi Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                        placeholder="Ketik ulang password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t-2 border-gray-900 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-900 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition transform hover:-translate-y-1 shadow-lg disabled:opacity-50"
                            >
                                {processing ? 'MENYIMPAN...' : 'SIMPAN AKUN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

UserCreate.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;