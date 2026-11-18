import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown, Calendar, LayoutDashboard, Database, ShieldCheck } from 'lucide-react';
import api from '../../lib/axios';

export default function TopNavbar() {
    const [konteks, setKonteks] = useState(null);

    useEffect(() => {
        api.get('/master/kurikulum-aktif').then(res => setKonteks(res.data)).catch(() => {});
    }, []);

    const taLabel = konteks?.tahun_akademik
        ? `${konteks.tahun_akademik.tahun_akademik} - ${konteks.tahun_akademik.semester}`
        : 'Tahun Akademik';

    const standarMutuList = konteks?.kurikulum?.standar_mutus || [];

    return (
        <div className="flex flex-col bg-white border-b border-gray-200 shrink-0">
            {/* Row 1 */}
            <div className="h-16 px-6 flex items-center justify-between">
                {/* Left: Konteks TA & Standar Mutu aktif */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md bg-white text-xs font-medium text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{taLabel}</span>
                        {konteks?.tahun_akademik && <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                    {standarMutuList.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            {standarMutuList.map(sm => (
                                <span key={sm.id} className="flex items-center gap-1 px-2.5 py-1.5 border border-blue-100 rounded-md bg-blue-50 text-xs font-bold text-blue-800">
                                    {sm.singkatan || sm.nama}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-5">
                    <button className="relative p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 border-l pl-5 border-gray-200">
                        <div className="text-right flex flex-col leading-tight">
                            <span className="text-sm font-bold text-gray-800">Administrator</span>
                            <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                                {konteks?.kurikulum?.standar_kurikulum?.singkatan
                                    ? `Kurikulum ${konteks.kurikulum.standar_kurikulum.singkatan}`
                                    : 'CPL Manager'}
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shrink-0">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=1e3a8a&color=fff&rounded=true&bold=true" alt="User Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Subheader / Breadcrumbs */}
            <div className="h-9 px-6 bg-gray-50 flex items-center justify-between border-t border-gray-200 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="text-gray-700 font-semibold">SIM-OBE</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-700 font-semibold">
                        {konteks?.kurikulum?.program_studi?.nama_prodi || 'Program Studi'}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span>{konteks?.kurikulum?.nama_kurikulum || 'Sistem Penjaminan Mutu & Kurikulum'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-600" />
                        <span>MySQL</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
                        <span>
                            {standarMutuList.length > 0
                                ? standarMutuList.map(s => s.singkatan || s.nama).join(' / ') + ' Compliant'
                                : 'Audit Compliant'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

