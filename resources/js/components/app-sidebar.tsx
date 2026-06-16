import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, FileText, ClipboardList, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// 1. MENU UMUM (Muncul untuk semua orang)
const commonNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

// 2. MENU KHUSUS ADMIN
const adminNavItems: NavItem[] = [
    {
        title: 'Kelola Berita',
        href: '/admin/berita',
        icon: BookOpen,
    },
    {
        title: 'Persetujuan Ijin',
        href: '#',
        icon: ClipboardList,
    },
];

// 3. MENU KHUSUS GURU
const guruNavItems: NavItem[] = [
    {
        title: 'Pengajuan Ijin',
        href: '#',
        icon: FileText,
    },
    {
        title: 'Jurnal Refleksi',
        href: '#',
        icon: BookOpen,
    },
    {
        title: 'Laporan Kegiatan',
        href: '#',
        icon: Users,
    },
];

export function AppSidebar() {
    // 👇 CARA BENAR MENGAMBIL DATA DARI LARAVEL 👇
    const page = usePage();
    const { auth } = page.props as any; 
    const role = auth?.user?.role;

    // 👇 GABUNGKAN MENU SECARA DINAMIS 👇
    const navItems = [
        ...commonNavItems,
        ...(role === 'admin' ? adminNavItems : []),
        ...(role === 'guru' ? guruNavItems : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Kita masukkan variabel navItems yang sudah digabung ke sini */}
                <NavMain items={navItems} />

               {/* JEBAKAN BATMAN (Otomatis hilang kalau sidebar dilipat) */}
                <div className="p-4 mx-4 mt-4 text-xs font-bold text-red-700 bg-red-100 rounded-lg text-center border border-red-300 group-data-[collapsible=icon]:hidden">
                    CEK ROLE KAMU: {role || 'KOSONG'}
                </div>
            </SidebarContent>

            <SidebarFooter>
                {/* NavFooter (Repository/Docs) saya hapus agar lebih rapi untuk web sekolah */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}