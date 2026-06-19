import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function TopNavLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const url = usePage().url;

    // React State pengganti x-data Alpine.js
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isKesiswaanOpen, setIsKesiswaanOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Fungsi Logout
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    // Helper untuk mengecek active URL (pengganti request()->routeIs)
    const isActive = (path: string) => url.startsWith(path);

    return (
        <div className="min-h-screen bg-gray-50/30 font-sans">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        {/* BAGIAN KIRI (LOGO & MENU) */}
                        <div className="flex">
                            {/* LOGO */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/dashboard" className="font-bold text-xl text-gray-900 tracking-widest uppercase hover:text-gray-700 transition">
                                    KAK ROZ
                                </Link>
                            </div>

                            {/* DESKTOP MENU */}
                            <div className="hidden space-x-1 lg:space-x-4 sm:-my-px sm:ml-6 sm:flex">
                                <Link href="/dashboard" className={`inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition duration-150 h-full ${url === '/dashboard' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    Beranda
                                </Link>
                                
                                <Link href="/berita" className={`inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition duration-150 h-full ${isActive('/berita') ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    Berita
                                </Link>

                                {/* DROPDOWN KESISWAAN */}
                                <div className="relative h-full">
                                    <button 
                                        onClick={() => setIsKesiswaanOpen(!isKesiswaanOpen)} 
                                        onBlur={() => setTimeout(() => setIsKesiswaanOpen(false), 200)} // Menutup saat klik di luar
                                        className={`inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition duration-150 h-full focus:outline-none gap-1 ${isActive('/kesiswaan') ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        <span>Kesiswaan</span>
                                        <svg className={`h-3 w-3 transition-transform duration-200 ${isKesiswaanOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* ISI DROPDOWN */}
                                    {isKesiswaanOpen && (
                                        <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-xl min-w-[200px] py-2 transition-all">
                                            <Link href="/kesiswaan/lomba" className="block px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-black uppercase tracking-wide">
                                                - Kegiatan Lomba
                                            </Link>
                                            <Link href="/kesiswaan/kegiatan" className="block px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-black uppercase tracking-wide">
                                                - Kegiatan Kesiswaan
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <Link href="/kurikulum" className="inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Kurikulum</Link>
                                <Link href="/humas" className="inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Humas</Link>
                                <Link href="/sarpras" className="inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Sarpras</Link>
                                <Link href="/ijin" className="inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Ijin Guru</Link>
                                <Link href="/jurnal-refleksi" className="inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Refleksi</Link>

                                {/* Kelola Akun (HANYA UNTUK DESKTOP) */}
                                {user?.role === 'admin' && (
                                    <Link href="/admin/users" className={`inline-flex items-center px-3 pt-1 border-b-2 text-xs font-bold uppercase tracking-wide transition h-full ${isActive('/admin/users') ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                        Kelola Akun
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* BAGIAN KANAN (PROFILE) */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)} 
                                    onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                                    className="inline-flex items-center gap-3 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-600 bg-white hover:text-gray-900 focus:outline-none transition"
                                >
                                    <div className="flex flex-col text-right">
                                        <span className="font-bold uppercase text-xs tracking-wide truncate max-w-xs">{user?.name}</span>
                                        <span className="text-[10px] text-gray-400 capitalize">{user?.role}</span>
                                    </div>
                                    <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">
                                        {user?.name?.substring(0, 1)}
                                    </div>
                                </button>
                                
                                {isProfileOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <form onSubmit={handleLogout}>
                                            <button type="submit" className="w-full block px-4 py-3 text-xs font-bold uppercase text-gray-600 hover:bg-gray-100 hover:text-black text-left">
                                                Log Out
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TOMBOL HAMBURGER (HP) */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={isMobileMenuOpen ? 'hidden' : 'inline-flex'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={isMobileMenuOpen ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MENU MOBILE (RESPONSIVE) */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden bg-white border-t border-gray-200 pb-4">
                        <div className="pt-2 pb-3 space-y-1">
                            <Link href="/dashboard" className="block pl-3 pr-4 py-2 border-l-4 text-xs font-bold uppercase tracking-wide transition border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50">Beranda</Link>
                            
                            {/* Kesiswaan Mobile */}
                            <div>
                                <button onClick={() => setIsKesiswaanOpen(!isKesiswaanOpen)} className="w-full flex justify-between items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-xs font-bold uppercase tracking-wide text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">
                                    <span>Kesiswaan</span>
                                    <svg className={`w-4 h-4 transform transition ${isKesiswaanOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {isKesiswaanOpen && (
                                    <div className="pl-6 space-y-1 bg-gray-50 py-2">
                                        <Link href="/kesiswaan/lomba" className="block py-2 pr-4 text-xs font-semibold uppercase text-gray-500 hover:text-black">- Kegiatan Lomba</Link>
                                        <Link href="#" className="block py-2 pr-4 text-xs font-semibold uppercase text-gray-500 hover:text-black">- Kegiatan Kesiswaan</Link>
                                    </div>
                                )}
                            </div>

                            <Link href="/berita" className="block pl-3 pr-4 py-2 border-l-4 text-xs font-bold uppercase tracking-wide transition border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50">Berita</Link>
                            
                            {/* Kelola Akun (HANYA UNTUK HP) */}
                            {user?.role === 'admin' && (
                                <Link href="/admin/users" className={`block pl-3 pr-4 py-2 border-l-4 text-xs font-bold uppercase tracking-wide transition ${isActive('/admin/users') ? 'border-black text-black bg-gray-50' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'}`}>
                                    Kelola Akun
                                </Link>
                            )}
                        </div>

                        {/* Profile Mobile */}
                        <div className="pt-4 pb-2 border-t border-gray-200 bg-gray-50">
                            <div className="px-4 flex items-center">
                                <div className="h-10 w-10 rounded bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm uppercase">
                                    {user?.name?.substring(0, 1)}
                                </div>
                                <div className="ml-3">
                                    <div className="font-bold text-sm text-gray-800 uppercase">{user?.name}</div>
                                    <div className="font-medium text-xs text-gray-500">{user?.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <form onSubmit={handleLogout}>
                                    <button type="submit" className="w-full text-left block px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                                        Log Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* AREA KONTEN HALAMAN */}
            {/* AREA KONTEN HALAMAN (Dibuat full agar tidak seperti pop-up) */}
            <main className="w-full bg-white">
                {children}
            </main>
        </div>
    );
}