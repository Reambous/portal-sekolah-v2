import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function TopNavLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const url = usePage().url;

    // React State untuk buka/tutup menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isKesiswaanOpen, setIsKesiswaanOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Fungsi Logout
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    // Helper penanda menu aktif yang akurat
    const isActive = (path: string) => {
        if (path === '/dashboard') return url === '/dashboard';
        return url.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            
            {/* STICKY NAVBAR BERGAYA BRUTALIST */}
            <nav className="bg-white border-b-4 border-gray-900 sticky top-0 z-50">
                <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        {/* 🟦 BAGIAN KIRI: LOGO & MENU DESKTOP */}
                        <div className="flex flex-1">
                            {/* LOGO */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/dashboard" className="font-black text-xl text-gray-900 tracking-tighter uppercase border-2 border-gray-900 px-3 py-1 bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    KAK ROZ
                                </Link>
                            </div>

                            {/* DESKTOP MENU (LENGKAP) */}
                            <div className="hidden space-x-1 xl:space-x-2 sm:-my-px sm:ml-6 sm:flex items-center">
                                <Link href="/dashboard" className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition ${isActive('/dashboard') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>
                                    Beranda
                                </Link>
                                
                                <Link href="/berita" className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition ${isActive('/berita') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>
                                    Berita
                                </Link>

                                {/* DROPDOWN KESISWAAN DESKTOP */}
                                <div className="relative py-5">
                                    <button 
                                        onClick={() => setIsKesiswaanOpen(!isKesiswaanOpen)} 
                                        onBlur={() => setTimeout(() => setIsKesiswaanOpen(false), 200)}
                                        className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 focus:outline-none gap-1 transition ${isActive('/kesiswaan') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}
                                    >
                                        <span>Kesiswaan</span>
                                        <svg className={`h-3 w-3 transition-transform duration-200 ${isKesiswaanOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {isKesiswaanOpen && (
                                        <div className="absolute top-full left-0 z-50 bg-white border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[200px] py-1">
                                            <Link href="/kesiswaan/lomba" className="block px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-150 uppercase tracking-wide border-b-2 border-gray-100 last:border-0">
                                                🏆 Kegiatan Lomba
                                            </Link>
                                            <Link href="/kesiswaan/kegiatan" className="block px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-150 uppercase tracking-wide">
                                                🏃 Kegiatan Kesiswaan
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <Link href="/kurikulum" className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition ${isActive('/kurikulum') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>Kurikulum</Link>
                                <Link href="/humas" className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition ${isActive('/humas') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>Humas</Link>
                                <Link href="/sarpras" className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition ${isActive('/sarpras') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>Sarpras</Link>
                                <Link href="/ijin" className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition ${isActive('/ijin') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-900'}`}>Ijin Guru</Link>
                                <Link href="/jurnal-refleksi" className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition ${isActive('/jurnal-refleksi') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-900'}`}>Refleksi</Link>

                                {user?.role === 'admin' && (
                                    <Link href="/admin/users" className={`inline-flex items-center px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition ${isActive('/admin/users') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-900'}`}>
                                        Kelola Akun
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* ⬜ BAGIAN KANAN: PROFILE DROPDOWN */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)} 
                                    onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                                    className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-gray-900 bg-white hover:bg-gray-50 focus:outline-none transition font-sans"
                                >
                                    <div className="flex flex-col text-right">
                                        <span className="font-black uppercase text-[11px] tracking-wide max-w-xs text-gray-900">{user?.name}</span>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{user?.role}</span>
                                    </div>
                                    <div className="h-8 w-8 border-2 border-gray-900 bg-yellow-400 flex items-center justify-center text-gray-900 font-black text-xs uppercase">
                                        {user?.name?.substring(0, 1)}
                                    </div>
                                </button>
                                
                                {isProfileOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 bg-white border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <form onSubmit={handleLogout}>
                                            <button type="submit" className="w-full block px-4 py-3 text-xs font-black uppercase text-red-600 hover:bg-red-50 text-left transition">
                                                ❌ Log Out
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TOMBOL HAMBURGER MOBILE */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                                className="inline-flex items-center justify-center p-2 border-2 border-gray-900 bg-white text-gray-900 hover:bg-yellow-400 focus:outline-none transition"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={isMobileMenuOpen ? 'hidden' : 'inline-flex'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={isMobileMenuOpen ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 📱 MENU MOBILE: SEKARANG MEMUAT SEMUA MENU SECARA LENGKAP */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden bg-white border-t-2 border-gray-900 py-2 space-y-1 px-4">
                        
                        <Link href="/dashboard" className={`block px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/dashboard') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-600'}`}>
                            Beranda
                        </Link>
                        
                        <Link href="/berita" className={`block px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/berita') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-600'}`}>
                            Berita
                        </Link>
                        
                        {/* Kesiswaan Dropdown Mobile */}
                        <div className="border-2 border-transparent">
                            <button 
                                onClick={() => setIsKesiswaanOpen(!isKesiswaanOpen)} 
                                className={`w-full flex justify-between items-center px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/kesiswaan') ? 'bg-gray-100 text-gray-900 border-gray-300' : 'border-transparent text-gray-600'}`}
                            >
                                <span>Kesiswaan</span>
                                <svg className={`w-3 h-3 transform transition ${isKesiswaanOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isKesiswaanOpen && (
                                <div className="pl-4 bg-gray-50 border-l-4 border-gray-900 my-1 space-y-1 py-1">
                                    <Link href="/kesiswaan/lomba" className="block py-2 text-xs font-bold uppercase text-gray-600 hover:text-black">- Kegiatan Lomba</Link>
                                    <Link href="/kesiswaan/kegiatan" className="block py-2 text-xs font-bold uppercase text-gray-600 hover:text-black">- Kegiatan Kesiswaan</Link>
                                </div>
                            )}
                        </div>

                        {/* MENU-MENU YANG TADI TERTINGGAL SEKARANG DITAMBAHKAN DISINI: */}
                        <Link href="/kurikulum" className={`block px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/kurikulum') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-600'}`}>
                            Kurikulum
                        </Link>
                        <Link href="/humas" className={`block px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/humas') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-600'}`}>
                            Humas
                        </Link>
                        <Link href="/sarpras" className={`block px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/sarpras') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-600'}`}>
                            Sarpras
                        </Link>
                        <Link href="/ijin" className={`block px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/ijin') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-600'}`}>
                            Ijin Guru
                        </Link>
                        <Link href="/jurnal-refleksi" className={`block px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/jurnal-refleksi') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-600'}`}>
                            Refleksi
                        </Link>

                        {user?.role === 'admin' && (
                            <Link href="/admin/users" className={`block px-3 py-2 text-xs font-black uppercase tracking-wide border-2 ${isActive('/admin/users') ? 'bg-gray-900 text-white border-gray-900' : 'border-transparent text-gray-600'}`}>
                                Kelola Akun
                            </Link>
                        )}

                        {/* Profile & Logout Info Mobile */}
                        <div className="pt-4 mt-4 border-t-2 border-gray-200">
                            <div className="flex items-center px-3 mb-3">
                                <div className="h-9 w-9 border-2 border-gray-900 bg-yellow-400 flex items-center justify-center text-gray-900 font-black text-xs uppercase">
                                    {user?.name?.substring(0, 1)}
                                </div>
                                <div className="ml-3">
                                    <div className="font-black text-xs text-gray-900 uppercase leading-none">{user?.name}</div>
                                    <div className="text-[10px] text-gray-450 font-bold mt-1 lowercase leading-none">{user?.email}</div>
                                </div>
                            </div>
                            <form onSubmit={handleLogout}>
                                <button type="submit" className="w-full text-left block px-3 py-2 text-xs font-black uppercase text-red-600 bg-red-50 border-2 border-transparent">
                                    ❌ Log Out
                                </button>
                            </form>
                        </div>

                    </div>
                )}
            </nav>

            {/* AREA UTAMA KONTEN LAYAR PENUH */}
            <main className="w-full bg-white">
                {children}
            </main>
        </div>
    );
}