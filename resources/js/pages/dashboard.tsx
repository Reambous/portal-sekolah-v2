import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import TopNavLayout from '@/layouts/top-nav-layout';

// Definisikan tipe struktur data yang dikirim oleh DashboardController
type Juara = {
    id: number;
    jenis_lomba: string;
    prestasi: string; // 👈 Ganti dari peringkat ke prestasi
};

type Berita = {
    id: number;
    judul: string;
    isi: string;
    gambar?: string;
    created_at: string;
};

type Refleksi = {
    id: number;
    judul_refleksi: string;
    tanggal: string;
    user?: { name: string };
};

type DashboardProps = {
    juara_terbaru?: Juara[];
    berita_terbaru?: Berita[];
    refleksi_terbaru?: Refleksi[];
};

export default function Dashboard({ 
    juara_terbaru = [], 
    berita_terbaru = [], 
    refleksi_terbaru = [] 
}: DashboardProps) {
    
    const { auth } = usePage().props as any;
    const userName = auth?.user?.name || 'User';

    // 1. LOGIKA CAROUSEL HERO SLIDER (Menggantikan Alpine.js)
    const [activeSlide, setActiveSlide] = useState(0);
    const slides = [
        '/images/slide1.jpg',
        '/images/slide2.jpg',
        '/images/slide3.jpg',
        '/images/slide4.jpg'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000); // Otomatis ganti setiap 5 detik
        return () => clearInterval(interval);
    }, [slides.length]);

    // Pemisahan berita utama (index 0) dan berita sampingan (index 1 s/d 3)
    const mainNews = berita_terbaru[0];
    const sideNews = berita_terbaru.slice(1, 4);

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Head title="Dashboard Utama" />
            
            <div className="max-w-full mx-auto">
                
                {/* 1. HERO SLIDER (CAROUSEL BRUTALIST) */}
                <div className="relative h-[500px] md:h-[600px] bg-gray-900 mb-8 overflow-hidden border-b-4 border-blue-900 shadow-lg">
                    {/* Gambar Slider */}
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                                activeSlide === index ? 'opacity-100 z-0' : 'opacity-0 z-0'
                            }`}
                        >
                            <img src={slide} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" alt="School Environment" />
                        </div>
                    ))}

                    {/* OVERLAY TEXT (TETAP DI DEPAN) */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent">
                        <div className="max-w-4xl">
                            <span className="bg-blue-800 text-white text-xs font-black px-3 py-1 uppercase tracking-widest inline-block mb-3 border-l-4 border-yellow-400">
                                Portal Resmi Sekolah
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 uppercase tracking-tighter">
                                Selamat Datang, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">{userName}</span>
                            </h1>
                            <p className="text-gray-300 text-sm md:text-base font-medium max-w-2xl border-l-4 border-yellow-400 pl-4 bg-black/40 p-3 backdrop-blur-sm">
                                Sistem Informasi Manajemen Terpadu. Kelola administrasi akademik, publikasi prestasi, jurnal kegiatan, dan kepegawaian dengan profesional.
                            </p>
                        </div>
                    </div>

                    {/* NAVIGASI DOTS */}
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    activeSlide === index ? 'bg-yellow-400 w-8' : 'bg-white/50 w-2 hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* TEKS MOTIVASI UTAMA */}
                <div className="text-center px-6 md:px-32 pb-10 text-sm md:text-base font-bold uppercase tracking-wide text-gray-600 max-w-5xl mx-auto leading-relaxed">
                    📢 Dashboard Portal Utama. Platform ini dirancang untuk mempermudah administrasi operasional agar Bapak/Ibu bisa lebih fokus pada hal yang paling penting: <span className="text-gray-900 border-b-2 border-gray-900">Mengajar</span>. Mari bersama wujudkan lingkungan sekolah yang disiplin, bersih, dan terus berprestasi!
                </div>

                {/* CONTAINER KONTEN GRID */}
                <div className="px-6 md:px-12 mb-12">
                    
                    {/* BARIS 1: PRESTASI, KUTIPAN, & REFLEKSI (GRID 3 KOLOM) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        
                        {/* KOLOM 1: PRESTASI TERBARU / LOMBA */}
                        <div className="bg-gray-900 text-white p-6 border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[250px]">
                            <div>
                                <div className="border-b border-gray-700 mb-4 pb-2 flex justify-between items-end">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-yellow-400">🏆 Prestasi Terbaru</h4>
                                    <Link href="/kesiswaan/lomba" className="text-[10px] font-black text-yellow-400 hover:underline uppercase">Lihat Semua</Link>
                                </div>
                                <ul className="space-y-3">
                                    {juara_terbaru.length > 0 ? (
                                        juara_terbaru.slice(0, 3).map((juara) => (
                                            <li key={juara.id} className="border-l-2 border-yellow-500 pl-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase truncate" title={juara.jenis_lomba}>{juara.jenis_lomba}</p>
                                                <p className="text-sm font-black italic text-white uppercase truncate">{juara.prestasi}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-xs text-gray-500 italic uppercase font-bold">Belum ada data prestasi siswa.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* KOLOM 2: KUTIPAN DINAMIS (TENGAH) */}
                        <div className="bg-blue-50 border-4 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center text-center">
                            <p className="text-xs md:text-sm text-gray-800 leading-relaxed font-black uppercase tracking-tight">
                                "Setiap hari adalah kesempatan baru untuk membentuk masa depan. Ingatlah bahwa di tangan Bapak/Ibu Guru, terdapat harapan dan mimpi ratusan siswa. Mari kita terus bersinergi menciptakan inovasi pembelajaran."
                            </p>
                        </div>

                        {/* KOLOM 3: REFLEKSI GURU */}
                        <div className="bg-white border-4 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[250px]">
                            <div>
                                <div className="border-b-2 border-blue-900 mb-4 pb-2 flex justify-between items-end">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-blue-900">📝 Refleksi Guru</h4>
                                    <Link href="/jurnal-refleksi" className="text-[10px] font-black text-blue-600 hover:underline uppercase">Lihat Semua</Link>
                                </div>
                                <div className="space-y-3">
                                    {refleksi_terbaru.length > 0 ? (
                                        refleksi_terbaru.slice(0, 3).map((refleksi, index) => (
                                            <div key={refleksi.id} className="flex gap-3 items-start">
                                                <span className="text-xl font-black text-gray-300 leading-none">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-tight" title={refleksi.judul_refleksi}>
                                                        {refleksi.judul_refleksi}
                                                    </p>
                                                    <div className="flex gap-1.5 text-[9px] text-gray-400 font-black uppercase mt-0.5">
                                                        <span className="text-blue-700">{refleksi.user?.name || 'Guru'}</span>
                                                        <span>•</span>
                                                        <span>{new Date(refleksi.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic font-bold uppercase">Belum ada catatan refleksi masuk.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* BARIS 2: BLOK BERITA UTAMA & BERITA SAMPINGAN */}
                    <div className="bg-white border-4 border-gray-900 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        {/* HEADER SECTION BERITA */}
                        <div className="border-b-4 border-gray-900 mb-6 pb-2 flex justify-between items-end">
                            <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter">📰 Berita & Informasi Terkini</h3>
                            <Link href="/berita" className="text-xs font-black bg-gray-900 text-white px-3 py-1.5 hover:bg-blue-900 transition uppercase tracking-wide">
                                Lihat Semua Berita &rarr;
                            </Link>
                        </div>

                        {/* GRID STRUKTUR BERITA */}
                        {berita_terbaru.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* BERITA UTAMA (KIRI - LEBAR 2 KOLOM) */}
                                {mainNews && (
                                    <div className="lg:col-span-2 flex flex-col justify-between border-2 border-gray-100 p-2 hover:border-gray-900 transition duration-300">
                                        <Link href={`/berita/${mainNews.id}`} className="block group">
                                            <div className="w-full h-[320px] md:h-[380px] overflow-hidden border-4 border-gray-900 mb-4 relative bg-gray-100">
                                                {mainNews.gambar ? (
                                                    <img 
                                                        src={`/storage/${mainNews.gambar}`} 
                                                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" 
                                                        alt="Berita Utama" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-xs uppercase tracking-widest">
                                                        Lampiran Gambar Kosong
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 bg-gray-900 text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-t-2 border-r-2 border-gray-900">
                                                    {new Date(mainNews.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight uppercase tracking-tight mb-2 group-hover:text-blue-900 transition">
                                                {mainNews.judul}
                                            </h2>
                                            <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed line-clamp-3 mb-4">
                                                {mainNews.isi.replace(/<[^>]*>/g, '')}
                                            </p>
                                            <span className="text-xs font-black text-blue-800 uppercase border-b-2 border-blue-800 pb-0.5 group-hover:text-black group-hover:border-black transition">
                                                Baca Selengkapnya &rarr;
                                            </span>
                                        </Link>
                                    </div>
                                )}

                                {/* BERITA SAMPINGAN (KANAN - KOTAK LIST BERTIKAL 3 DATA) */}
                                <div className="lg:col-span-1 flex flex-col gap-4 bg-gray-50 p-4 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest border-b border-gray-300 pb-1 mb-1 block">Berita Tambahan</span>
                                    {sideNews.length > 0 ? (
                                        sideNews.map((news) => (
                                            <article key={news.id} className="flex gap-3 border-b border-gray-200 pb-3 last:border-0 last:pb-0 group">
                                                {/* Thumbnail Kotak Mini */}
                                                <div className="w-20 h-20 shrink-0 overflow-hidden border-2 border-gray-900 bg-white relative">
                                                    {news.gambar ? (
                                                        <img src={`/storage/${news.gambar}`} className="w-full h-full object-cover group-hover:scale-105 transition" 
                                                        loading="lazy"
                                                        alt="Thumbnail" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 font-black uppercase">NO IMG</div>
                                                    )}
                                                </div>
                                                {/* Konten Judul Ringkas */}
                                                <div className="min-w-0 flex flex-col justify-center">
                                                    <span className="text-[8px] font-black text-blue-700 uppercase">
                                                        {new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight leading-snug line-clamp-2 group-hover:text-blue-800 transition mt-0.5">
                                                        <Link href={`/berita/${news.id}`}>{news.judul}</Link>
                                                    </h4>
                                                </div>
                                            </article>
                                        ))
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase py-8">
                                            Tidak ada arsip berita lain.
                                        </div>
                                    )}
                                </div>

                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-wide text-xs">
                                Belum ada siaran berita sekolah terbaru saat ini.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

// Bind layout menu navigasi atas bawaan aplikasi Anda
Dashboard.layout = (page: any) => (
    <TopNavLayout>
        {page}
    </TopNavLayout>
);