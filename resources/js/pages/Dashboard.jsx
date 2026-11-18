import React, { useState, useEffect } from 'react';
import { 
    Download, Plus, Search, ChevronDown, CheckCircle, 
    FileText, FileCheck, Info, AlertTriangle, ArrowRight,
    Users, Award, Share2, LayoutDashboard, Calendar, ShieldCheck
} from 'lucide-react';
import api from '../lib/axios';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Memuat data dashboard...</div>;
    }

    const { metrics, cpl_balance, mata_kuliah } = data || {};
    const mataKuliahList = mata_kuliah?.data || [];
    
    // Fallbacks if data is empty
    const mTotal = metrics || {};
    const cpls = cpl_balance || [];

    const MetricCard = ({ title, value, subtitle, max, percent, icon: Icon, colorClass }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-gray-500">{title}</span>
                <Icon className={`w-4 h-4 ${colorClass}`} />
            </div>
            <div className="text-3xl font-extrabold text-gray-800 flex items-end gap-1 font-sans">
                {value}
                {max !== undefined && <span className="text-sm font-semibold text-gray-400 mb-1">/ {max} MK</span>}
            </div>
            {max !== undefined && (
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 mb-1">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${max > 0 ? (value/max)*100 : 0}%` }}></div>
                </div>
            )}
            <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-auto pt-2 font-medium">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${percent ? 'bg-blue-300' : 'bg-blue-600'}`}></div>
                {percent && <span className="font-bold text-gray-700">{percent}</span>}
                <span className="truncate">{subtitle}</span>
            </div>
        </div>
    );

    const FlowBox = ({ step, title, desc, verified, info, isLast }) => (
        <div className="flex items-center">
            <div className="bg-[#24469e] text-white p-3.5 rounded-md min-w-[210px] flex-1 relative shadow-sm border border-blue-400/20">
                <div className="flex items-center gap-2 mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-200">
                    TAHAP {step}
                    {verified && <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full flex items-center gap-1 tracking-normal"><CheckCircle className="w-3 h-3" /> Terverifikasi</span>}
                    {info && <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full tracking-normal">{info}</span>}
                </div>
                <div className="font-bold text-sm mb-1 leading-snug">{title}</div>
                <div className="text-[11px] text-blue-200 opacity-90 leading-tight">{desc}</div>
            </div>
            {!isLast && <ArrowRight className="w-5 h-5 text-[#3b5eb7] mx-2 shrink-0" />}
        </div>
    );

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-gray-800 mb-2 tracking-tight">Dashboard Kurikulum OBE & Matriks Pemetaan CPL</h1>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-100 text-[#1e3a8a] text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-widest uppercase">Akreditasi Internasional IABEE</span>
                        <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide">Siklus 2024-2029</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Program Studi S1 Teknik Informatika • Kurikulum 2024 (Berbasis SN-Dikti & Standar Mutu IABEE / ASIIN / LAM-INFOKOM)</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-md text-xs font-bold transition-colors">
                        <Download className="w-4 h-4" /> Export Matriks (Excel)
                    </button>
                    <button className="flex items-center gap-2 bg-[#1e3a8a] text-white hover:bg-blue-900 px-4 py-2 rounded-md text-xs font-bold transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Tambah Relasi Pemetaan
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-5 gap-4">
                <MetricCard title="Profil Lulusan (PL)" value={mTotal.profil_lulusan} subtitle="Terdefinisi Industri" icon={Users} colorClass="text-blue-500" />
                <MetricCard title="CPL SN-Dikti" value={mTotal.cpl_sn_dikti} subtitle="Sikap & Keterampilan" icon={CheckCircle} colorClass="text-blue-500" />
                <MetricCard title="CPL Prodi Unggulan" value={mTotal.cpl_prodi} subtitle="Matang" icon={Award} colorClass="text-blue-500" />
                <MetricCard title="Mata Kuliah Terpetakan" value={mTotal.mk_mapped} max={mTotal.mk_total} subtitle=" " icon={Share2} colorClass="text-blue-600" />
                <MetricCard title="Ketersian RPS Resmi" value={mTotal.rps_approved} max={mTotal.rps_total} subtitle="Dalam Telaah" icon={FileCheck} colorClass="text-blue-600" />
            </div>

            {/* Process Flow */}
            <div className="bg-[#1e3a8a] p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-white font-bold tracking-wide text-[13px] uppercase">
                        <Share2 className="w-4 h-4 opacity-80" /> 
                        Alur Konstruktif Kurikulum Berbasis Luaran (OBE Cascading Flow)
                    </div>
                    <div className="text-[10px] text-blue-200 font-medium tracking-wide">Penyelarasan Kompetensi Menuju Akreditasi Level Unggul</div>
                </div>
                <div className="flex justify-between items-stretch gap-1 overflow-x-auto pb-1 hide-scrollbar">
                    <FlowBox step="01" verified title="Profil Lulusan (PL)" desc={`${mTotal.profil_lulusan} Bidang Kerja • Masukan Industri`} />
                    <FlowBox step="02" info="SN-Dikti" title="CPL Standar Nasional" desc={`${mTotal.cpl_sn_dikti} Capaian Standar (Sikap & Keterampilan)`} />
                    <FlowBox step="03" info={`${mTotal.cpl_prodi} Capaian`} title="CPL Program Studi" desc="Kompetensi Inti Lulusan Informatika" />
                    <FlowBox step="04" info={`${mTotal.bahan_kajian} Bahan`} title="Bahan Kajian (BK)" desc="Kedalaman Body of Knowledge ACM/IEEE" />
                    <FlowBox step="05" info={`${mTotal.mk_total} MK`} title="Pembebanan MK & CPMK" desc="RPS • Rubrik Asesmen • Portofolio" isLast />
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
                <div className="p-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between gap-4 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Cari kode MK, nama mata kuliah..." className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-[11px] font-medium w-[260px] outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button className="px-4 py-1.5 bg-white shadow-sm rounded text-[11px] font-bold text-gray-800">Matriks CPL vs MK</button>
                    </div>
                </div>

                <div className="bg-[#f8faff] p-2.5 border-b border-gray-200 text-[10px] flex items-center gap-4 px-4 font-medium">
                    <span className="font-bold text-gray-700">Tingkat Penekanan CPL:</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1e3a8a]"></span> Mayor (Penguasaan Penuh)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-300"></span> Sedang (Penerapan Konsep)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200"></span> Minor (Pengenalan/Dasar)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-50 border border-gray-200"></span> Tidak Terpetakan</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-[#f1f5f9] text-indigo-900 border-b border-gray-200">
                            <tr>
                                <th className="p-3 font-bold w-[90px] pl-4">Kode MK</th>
                                <th className="p-3 font-bold min-w-[220px]">Nama Mata Kuliah</th>
                                <th className="p-3 font-bold w-[140px]">Semester & SKS</th>
                                {cpls.map((cpl) => (
                                    <th key={cpl.id} className="p-3 font-bold text-center w-[40px] leading-tight text-[10px]" title={cpl.deskripsi_cpl}>
                                        {cpl.kode_cpl}
                                    </th>
                                ))}
                                <th className="p-3 font-bold text-center w-[60px] text-[10px]">Total<br/>CPMK</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mataKuliahList.map((mk) => {
                                // Extract pivot data for mapping
                                const mkCpls = {};
                                (mk.cpls || []).forEach(c => {
                                    mkCpls[c.id] = c.pivot.bobot_pembebanan;
                                });

                                return (
                                <tr key={mk.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 pl-4 font-mono font-bold text-blue-800 text-[11px]">{mk.kode_mk}</td>
                                    <td className="p-3">
                                        <div className="font-bold text-gray-800 flex items-center gap-1.5 text-sm">
                                            {mk.nama_mk}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="font-semibold text-gray-700 text-xs">Sem. {mk.semester_plot || '-'}</div>
                                        <div className="text-[10px] mt-1 font-mono font-medium text-gray-500">{mk.sks_teori}T / {mk.sks_praktek}P</div>
                                    </td>
                                    {cpls.map((cpl) => {
                                        const val = mkCpls[cpl.id];
                                        let bgClass = "bg-gray-50 text-transparent border border-gray-100";
                                        if (val === 'M') bgClass = "bg-[#1e3a8a] text-white font-bold";
                                        if (val === 'S') bgClass = "bg-blue-300 text-white font-bold";
                                        if (val === 'm') bgClass = "bg-gray-200 text-gray-700 font-bold";

                                        return (
                                            <td key={cpl.id} className="p-3 text-center">
                                                <div className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center text-[9px] cursor-pointer hover:ring-2 ring-offset-1 ring-blue-300 transition-all ${bgClass}`}>
                                                    {val || '-'}
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td className="p-3 text-center font-extrabold text-[#1e3a8a] text-sm">{(mk.cpmks || []).length} <span className="text-[9px] font-bold text-gray-400">CPMK</span></td>
                                </tr>
                            )})}
                            {mataKuliahList.length === 0 && (
                                <tr>
                                    <td colSpan={5 + cpls.length} className="text-center p-8 text-gray-500">Tidak ada data mata kuliah.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Widgets */}
            <div className="grid grid-cols-3 gap-6 mb-4">
                {/* Chart Widget */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">Keseimbangan Beban CPL Prodi (CPL Balance)</h3>
                    <p className="text-[11px] font-medium text-gray-500 mb-2">Frekuensi keterpenuhan mata kuliah per outcome lulusan</p>
                    
                    <div className="flex flex-col gap-2.5 pr-8 mt-6">
                        {cpls.map(bar => {
                            const isDanger = bar.mk_count < 2; // threshold as example
                            const maxMk = Math.max(...cpls.map(c => c.mk_count), 1);
                            const w = `${(bar.mk_count / maxMk) * 100}%`;
                            return (
                            <div key={bar.id} className="flex items-center gap-4 text-[10px]">
                                <div className={`font-mono font-bold w-14 ${isDanger ? 'text-red-600' : 'text-gray-600'}`}>{bar.kode_cpl}</div>
                                <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                    <div className={`absolute left-0 top-0 h-full rounded-full ${isDanger ? 'bg-red-600 shadow-sm shadow-red-200' : 'bg-[#1e3a8a]'}`} style={{width: w}}></div>
                                </div>
                                <div className={`font-bold w-10 text-right font-mono ${isDanger ? 'text-red-600' : 'text-blue-800'}`}>{bar.mk_count} MK</div>
                            </div>
                        )})}
                    </div>
                </div>

                {/* Audit Checklist Widget */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-800 text-sm">Kesiapan Audit OBE</h3>
                        <ShieldCheck className="w-5 h-5 text-[#1e3a8a]" />
                    </div>
                    <p className="text-[11px] font-medium text-gray-500 mb-6 leading-relaxed">Checklist kelengkapan data kurikulum OBE prodi untuk asesmen akreditasi.</p>
                    
                    <div className="flex flex-col gap-5">
                        <div className="flex gap-3 items-start">
                            <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="text-sm font-bold text-gray-800 leading-none mb-1.5">Pemetaan CPL </div>
                                <div className="text-[11px] font-medium text-gray-500">{mTotal.cpl_prodi} CPL Terdefinisi</div>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="text-sm font-bold text-gray-800 leading-none mb-1.5">Mata Kuliah & RPS</div>
                                <div className="text-[11px] font-medium text-gray-500">{mTotal.mk_mapped} dari {mTotal.mk_total} MK terpetakan</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
