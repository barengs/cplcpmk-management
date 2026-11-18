import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Users, CheckCircle, FileText, Share2, 
    PlusSquare, Calendar, FileBox, ShieldCheck, PieChart, 
    Settings, DownloadCloud 
} from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const menus = [
        { 
            title: '1. KURIKULUM OBE', 
            items: [
                { name: 'Dashboard & Matriks OBE', icon: LayoutDashboard, path: '/dashboard' },
                { name: 'Profil Lulusan (PL)', icon: Users, path: '/master/profil-lulusan' },
                { name: 'CPL SN-Dikti & Prodi', icon: CheckCircle, path: '/master/cpl' },
                { name: 'Bahan Kajian (BK)', icon: FileText, path: '/master/bahan-kajian' },
                { name: 'Mata Kuliah', icon: FileText, path: '/master/mata-kuliah' },
                { name: 'CPMK (Capaian Per MK)', icon: CheckCircle, path: '/master/cpmk' },
                { name: 'Pemetaan CPL ke MK', icon: Share2, path: '/mapping/cpl-mk' },
            ]
        },
        {
            title: '2. GENERATOR RPS',
            items: [
                { name: 'Buat RPS Baru', icon: PlusSquare, path: '/rps-builder' },
                { name: 'Rencana Mingguan', icon: Calendar, path: '#' },
                { name: 'Daftar Dokumen RPS', icon: FileBox, path: '#' },
                { name: 'Validasi & Pengesahan', icon: ShieldCheck, path: '#' },
            ]
        },
        {
            title: '3. LAPORAN & DOKUMEN',
            items: [
                { name: 'Portofolio Capaian CPL', icon: PieChart, path: '#' },
                { name: 'Export PDF / Akreditasi', icon: DownloadCloud, path: '#' },
            ]
        },
        {
            title: '4. PENGATURAN KURIKULUM',
            items: [
                { name: 'Program Studi', icon: Users, path: '/master/program-studi' },
                { name: 'Standar Kurikulum', icon: FileBox, path: '/master/standar-kurikulum' },
                { name: 'Standar Mutu', icon: ShieldCheck, path: '/master/standar-mutu' },
                { name: 'Manajemen Kurikulum', icon: Settings, path: '/master/kurikulum' },
                { name: 'Tahun Akademik', icon: Calendar, path: '/master/tahun-akademik' },
            ]
        },
        {
            title: '5. PENGATURAN SISTEM',
            items: [
                { name: 'User & Role (RBAC)', icon: Users, path: '#' },
                { name: 'Konfigurasi Umum', icon: Settings, path: '#' },
            ]
        }
    ];

    return (
        <div className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col h-full shrink-0">
            <div className="h-[101px] px-4 border-b border-gray-200 bg-white flex flex-col justify-center shrink-0">
                <div className="font-bold text-blue-900 text-[15px] flex flex-col leading-tight tracking-tight">
                    <span>SIM-OBE & RPS Engine</span>
                    <span className="text-[10px] text-blue-600 font-bold tracking-widest mt-0.5">V2.4 CORE</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-2 leading-tight">
                    Fakultas Teknik - Universitas Islam Indonesia
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
                {menus.map((group, idx) => (
                    <div key={idx} className="mb-6">
                        <div className="text-[10px] font-bold text-gray-400 mb-2 px-4 tracking-widest uppercase">
                            {group.title}
                        </div>
                        <ul className="space-y-0.5">
                            {group.items.map((item, itemIdx) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={itemIdx} className="px-2">
                                        <Link to={item.path} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-800'}`}>
                                            <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-500 flex flex-col gap-1.5 font-mono">
                <div className="flex items-center justify-between">
                    <span>Laravel API v12.1</span>
                    <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> SYNC</div>
                </div>
                <div>DB Node: cluster-asia-ui.ac.id</div>
            </div>
        </div>
    );
}
