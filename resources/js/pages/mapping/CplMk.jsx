import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import { Share2, Info, Loader2 } from 'lucide-react';

export default function CplMk() {
    const [cpls, setCpls] = useState([]);
    const [mataKuliah, setMataKuliah] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get('/mapping/cpl-mk');
            setCpls(res.data.cpls);
            setMataKuliah(res.data.mata_kuliah);
        } catch (error) {
            toast.error('Gagal memuat data matriks pemetaan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMappingChange = async (mkId, cplId, newValue) => {
        setSaving(true);
        try {
            if (newValue === '') {
                await api.delete('/mapping/cpl-mk', { data: { mata_kuliah_id: mkId, cpl_id: cplId } });
            } else {
                await api.post('/mapping/cpl-mk', { mata_kuliah_id: mkId, cpl_id: cplId, tingkat_penekanan: newValue });
            }
            toast.success('Matriks berhasil disimpan');
            
            // Optimistic update
            setMataKuliah(prev => prev.map(mk => {
                if (mk.id === mkId) {
                    const newMappings = { ...mk.mappings };
                    if (newValue === '') {
                        delete newMappings[cplId];
                    } else {
                        newMappings[cplId] = newValue;
                    }
                    return { ...mk, mappings: newMappings };
                }
                return mk;
            }));

        } catch (error) {
            toast.error('Gagal menyimpan matriks');
            fetchData(); // Rollback
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12 text-gray-400"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-4">
            <Toaster position="top-right" />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Share2 className="w-5 h-5" /> Matriks Pemetaan CPL ke Mata Kuliah</h2>
                    <p className="text-xs text-gray-500 mt-1">Isi matriks dengan bobot: M (Mayor), S (Sedang), m (Minor)</p>
                </div>
                {saving && <div className="text-xs text-blue-600 font-bold flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Menyimpan perubahan...</div>}
            </div>

            <div className="bg-[#f8faff] p-2.5 border border-blue-100 text-[11px] flex items-center gap-4 px-4 font-medium rounded-lg">
                <span className="font-bold text-blue-900">Legenda Tingkat Penekanan:</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1e3a8a]"></span> M: Mayor (Penguasaan Penuh)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-300"></span> S: Sedang (Penerapan Konsep)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200"></span> m: Minor (Pengenalan/Dasar)</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#f1f5f9] text-indigo-900 border-b border-gray-200">
                        <tr>
                            <th className="p-3 font-bold w-[90px] pl-4">Kode MK</th>
                            <th className="p-3 font-bold min-w-[200px]">Nama Mata Kuliah</th>
                            <th className="p-3 font-bold w-[100px]">SKS</th>
                            {cpls.map(cpl => (
                                <th key={cpl.id} className="p-2 font-bold text-center w-[45px] leading-tight text-[10px]" title={cpl.deskripsi}>
                                    {cpl.kode_cpl}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mataKuliah.map(mk => (
                            <tr key={mk.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 pl-4 font-mono font-bold text-blue-800 text-[11px]">{mk.kode_mk}</td>
                                <td className="p-3 font-bold text-gray-800 text-sm">{mk.nama_mk}</td>
                                <td className="p-3 text-gray-600 font-semibold">{parseInt(mk.sks_teori) + parseInt(mk.sks_praktek)} SKS</td>
                                
                                {cpls.map(cpl => {
                                    const value = mk.mappings[cpl.id] || '';
                                    let bgClass = "bg-gray-50 text-gray-400";
                                    if (value === 'M') bgClass = "bg-[#1e3a8a] text-white";
                                    if (value === 'S') bgClass = "bg-blue-300 text-white";
                                    if (value === 'm') bgClass = "bg-gray-200 text-gray-700";

                                    return (
                                        <td key={cpl.id} className="p-1.5 text-center">
                                            <select 
                                                value={value}
                                                onChange={(e) => handleMappingChange(mk.id, cpl.id, e.target.value)}
                                                className={`w-full h-8 text-center text-xs font-bold rounded-md outline-none cursor-pointer hover:ring-2 ring-blue-300 appearance-none ${bgClass}`}
                                            >
                                                <option value="" className="bg-white text-gray-500">-</option>
                                                <option value="M" className="bg-white text-gray-900">M</option>
                                                <option value="S" className="bg-white text-gray-900">S</option>
                                                <option value="m" className="bg-white text-gray-900">m</option>
                                            </select>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                        {mataKuliah.length === 0 && (
                            <tr><td colSpan={3 + cpls.length} className="p-8 text-center text-gray-500">Belum ada data mata kuliah.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
