import { Head, Link, useForm, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

export default function UserEdit({ userEdit }: { userEdit: any }) {
    const { auth } = usePage().props as any;
    const isSelf = auth?.user?.id === userEdit.id;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: userEdit.name,
        email: userEdit.email,
        role: userEdit.role,
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/users/${userEdit.id}`);
    };

    return (
        <div className="py-8 bg-white min-h-screen font-sans text-gray-900">
            <Head title={`Edit Akun: ${userEdit.name}`} />

            <div className="max-w-[95%] mx-auto max-w-3xl">
                {/* HEADER HALAMAN */}
                <div className="border-b-4 border-gray-900 mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">
                            Edit Akun
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Perbarui informasi profil atau reset password
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
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                    Alamat Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                Hak Akses (Role)
                            </label>
                            <select
                                className="w-full border-2 border-gray-300 p-3 text-sm font-bold uppercase focus:border-gray-900 focus:ring-0 transition cursor-pointer"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                disabled={isSelf} // Tidak bisa mengubah role sendiri
                                title={isSelf ? "Anda tidak bisa mengubah hak akses akun Anda sendiri" : ""}
                            >
                                <option value="user">GURU / STAFF (Akses Terbatas)</option>
                                <option value="admin">ADMINISTRATOR (Akses Penuh)</option>
                            </select>
                            {isSelf && <p className="text-gray-500 text-[10px] font-bold mt-2 uppercase">Proteksi: Hak akses akun sendiri tidak dapat diubah.</p>}
                            {errors.role && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.role}</p>}
                        </div>

                        <div className="border-t-2 border-gray-100 my-6 pt-6">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-1">Ganti Password</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-4">
                                Kosongkan bagian ini jika tidak ingin mengubah password
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                        Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                        placeholder="Kosongkan jika tidak diganti"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">⚠️ {errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
                                        Konfirmasi Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full border-2 border-gray-300 p-3 text-sm focus:border-gray-900 focus:ring-0 transition"
                                        placeholder="Ketik ulang password baru"
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

UserEdit.layout = (page: any) => <TopNavLayout>{page}</TopNavLayout>;