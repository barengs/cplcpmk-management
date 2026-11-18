import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStep } from '../redux/rpsBuilderSlice';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import api from '../lib/axios';
import { FileText, List, Calendar, CheckSquare, Edit3, ArrowLeft, Bot, X } from 'lucide-react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import toast, { Toaster } from 'react-hot-toast';

export default function RpsBuilder() {
    const dispatch = useDispatch();
    const { step } = useSelector((state) => state.rpsBuilder);
    const [instruksiAi, setInstruksiAi] = useState('');
    const [mode, setMode] = useState('choice'); // 'choice', 'ai', 'manual'
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [hasilAi, setHasilAi] = useState(null);   // HTML string untuk tampilan
    const [rpsData, setRpsData] = useState(null);   // JSON untuk simpan ke DB
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [mataKuliahList, setMataKuliahList] = useState([]);
    const [saveForm, setSaveForm] = useState({
        mk_id: '',
        tahun_akademik: '',
        semester_pelaksanaan: 'Ganjil',
        tgl_penyusunan: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        api.get('/master/mata-kuliah').then(res => {
            setMataKuliahList(res.data?.data || res.data || []);
        }).catch(() => {});
    }, []);

    const handleGenerateAi = async () => {
        if (!instruksiAi) {
            toast.error('Silakan masukkan instruksi tambahan terlebih dahulu.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('prompt', instruksiAi);
            const fileInput = document.getElementById('template-upload');
            if (fileInput && fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            }

            const res = await api.post('/generate-rps', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Response baru: { success, html, rps_data }
            setHasilAi(res.data.html || res.data.data || '');
            setRpsData(res.data.rps_data || null);

            // Pre-fill form simpan dari data AI jika ada
            if (res.data.rps_data) {
                setSaveForm(prev => ({
                    ...prev,
                    tahun_akademik: res.data.rps_data.tahun_akademik || prev.tahun_akademik,
                    semester_pelaksanaan: res.data.rps_data.semester_pelaksanaan || prev.semester_pelaksanaan,
                    tgl_penyusunan: res.data.rps_data.tgl_penyusunan || prev.tgl_penyusunan,
                }));
            }

            toast.success('Draft RPS berhasil di-generate!');
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Gagal menghubungi AI Provider.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!saveForm.mk_id) {
            toast.error('Pilih mata kuliah terlebih dahulu.');
            return;
        }
        if (!rpsData?.mingguans?.length) {
            toast.error('Data RPS tidak lengkap. Silakan generate ulang.');
            return;
        }

        setSavingDraft(true);
        try {
            const payload = {
                ...saveForm,
                mingguans: rpsData.mingguans,
            };
            const res = await api.post('/rps-ai-draft', payload);
            toast.success(`Draft RPS berhasil disimpan! (ID: ${res.data.rps_id})`);
            setShowSaveModal(false);
        } catch (error) {
            const msg = error.response?.data?.message || 'Gagal menyimpan draft.';
            toast.error(msg);
        } finally {
            setSavingDraft(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600"/> Informasi Mata Kuliah</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Mata Kuliah" placeholder="Pilih Mata Kuliah" />
                            <Input label="Dosen Pengampu" placeholder="Nama Dosen" />
                            <Input label="Rumpun Keilmuan" placeholder="Misal: Rekayasa Perangkat Lunak" />
                            <Input label="Semester" placeholder="Semester" type="number" />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat MK</label>
                            <textarea className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><List className="w-5 h-5 text-blue-600"/> Capaian Pembelajaran (CPL & CPMK)</h3>
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <p className="text-sm text-blue-800 mb-2 font-medium">Pilih CPL yang dibebankan pada mata kuliah ini:</p>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> CPL-01: Mampu mengidentifikasi masalah komputasi</label>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> CPL-02: Mampu mendesain solusi perangkat lunak</label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Daftar CPMK</label>
                            <div className="flex items-center gap-2 mb-2">
                                <Input placeholder="Kode (ex: CPMK-1)" className="w-1/4" />
                                <Input placeholder="Deskripsi CPMK" className="flex-1" />
                                <Button variant="secondary" className="px-3 py-2 text-sm">Tambah</Button>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600"/> Rencana Pembelajaran Mingguan</h3>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="grid grid-cols-12 gap-3 mb-2 font-semibold text-sm text-gray-700">
                                <div className="col-span-1">Mg Ke-</div>
                                <div className="col-span-3">Kemampuan Akhir (Sub-CPMK)</div>
                                <div className="col-span-3">Bahan Kajian (Materi)</div>
                                <div className="col-span-2">Metode / Pengalaman</div>
                                <div className="col-span-2">Kriteria Penilaian</div>
                                <div className="col-span-1">Bobot</div>
                            </div>
                            <div className="grid grid-cols-12 gap-3 items-start">
                                <div className="col-span-1"><Input defaultValue="1" type="number" /></div>
                                <div className="col-span-3"><textarea className="w-full border-gray-300 rounded text-sm p-1" rows="2"></textarea></div>
                                <div className="col-span-3"><textarea className="w-full border-gray-300 rounded text-sm p-1" rows="2"></textarea></div>
                                <div className="col-span-2"><textarea className="w-full border-gray-300 rounded text-sm p-1" rows="2"></textarea></div>
                                <div className="col-span-2"><textarea className="w-full border-gray-300 rounded text-sm p-1" rows="2"></textarea></div>
                                <div className="col-span-1"><Input placeholder="%" /></div>
                            </div>
                            <Button variant="secondary" className="mt-3 text-xs w-full py-1">+ Tambah Minggu</Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-blue-600"/> Referensi & Pengesahan</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Referensi Utama</label>
                                <textarea className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Referensi Pendukung</label>
                                <textarea className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <Input label="Tanggal Penyusunan" type="date" />
                            <Input label="Koordinator Konsorsium / Kaprodi" placeholder="Nama Koordinator" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (mode === 'choice') {
        return (
            <div className="p-8 max-w-[1000px] mx-auto text-center h-full flex flex-col justify-center min-h-[70vh]">
                <Toaster position="top-right" />
                <h1 className="text-3xl font-bold mb-3 text-gray-800">Pembuatan RPS (Rencana Pembelajaran Semester)</h1>
                <p className="text-gray-500 mb-10">Pilih metode penyusunan RPS yang sesuai dengan preferensi Anda.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* AI Generator Card */}
                    <div 
                        onClick={() => setMode('ai')}
                        className="bg-white border-2 border-transparent hover:border-purple-400 hover:shadow-xl transition-all p-8 rounded-2xl cursor-pointer group flex flex-col items-center text-center shadow-md relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50 z-0"></div>
                        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 z-10 group-hover:scale-110 transition-transform">
                            <Bot className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3 z-10">AI Auto-Generate</h2>
                        <p className="text-gray-500 text-sm mb-6 z-10 leading-relaxed">Susun RPS secara otomatis dibantu oleh AI Agent menggunakan template .docx atau PDF. Cepat, cerdas, dan efisien.</p>
                        <span className="text-purple-600 font-bold text-sm z-10 flex items-center gap-2 group-hover:gap-3 transition-all">Pilih Metode Ini &rarr;</span>
                    </div>

                    {/* Manual Builder Card */}
                    <div 
                        onClick={() => {
                            setMode('manual');
                            dispatch(setStep(1));
                        }}
                        className="bg-white border-2 border-transparent hover:border-blue-400 hover:shadow-xl transition-all p-8 rounded-2xl cursor-pointer group flex flex-col items-center text-center shadow-md relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 z-0"></div>
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 z-10 group-hover:scale-110 transition-transform">
                            <Edit3 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3 z-10">Manual Builder</h2>
                        <p className="text-gray-500 text-sm mb-6 z-10 leading-relaxed">Susun RPS langkah-demi-langkah dari informasi umum hingga rancangan evaluasi menggunakan form interaktif terstruktur.</p>
                        <span className="text-blue-600 font-bold text-sm z-10 flex items-center gap-2 group-hover:gap-3 transition-all">Pilih Metode Ini &rarr;</span>
                    </div>
                </div>
            </div>
        );
    }

    const renderSaveModal = () => {
        if (!showSaveModal) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Simpan Draft RPS ke Database</h3>
                        <button onClick={() => setShowSaveModal(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Mata Kuliah <span className="text-red-500">*</span></label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                                value={saveForm.mk_id}
                                onChange={e => setSaveForm(p => ({ ...p, mk_id: e.target.value }))}
                            >
                                <option value="">-- Pilih Mata Kuliah --</option>
                                {mataKuliahList.map(mk => (
                                    <option key={mk.id} value={mk.id}>{mk.nama_mk} ({mk.kode_mk})</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Tahun Akademik</label>
                                <input className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-purple-500" value={saveForm.tahun_akademik} onChange={e => setSaveForm(p => ({ ...p, tahun_akademik: e.target.value }))} placeholder="2026/2027" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
                                <select className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-purple-500" value={saveForm.semester_pelaksanaan} onChange={e => setSaveForm(p => ({ ...p, semester_pelaksanaan: e.target.value }))}>
                                    <option>Ganjil</option>
                                    <option>Genap</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Penyusunan</label>
                            <input type="date" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-purple-500" value={saveForm.tgl_penyusunan} onChange={e => setSaveForm(p => ({ ...p, tgl_penyusunan: e.target.value }))} />
                        </div>
                        {!rpsData?.mingguans?.length && (
                            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                                ⚠️ AI tidak menghasilkan data terstruktur. Hanya tampilan preview yang tersedia; data mingguan tidak dapat disimpan secara otomatis.
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setShowSaveModal(false)}>Batal</Button>
                        <Button
                            onClick={handleSaveDraft}
                            disabled={savingDraft || !rpsData?.mingguans?.length}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {savingDraft ? 'Menyimpan...' : 'Simpan Draft'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderHasilAi = () => {
        if (!hasilAi) return null;

        return (
            <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                    <span>Draf Rencana Pembelajaran Semester (RPS)</span>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="text-sm px-3 py-1" onClick={() => { setHasilAi(null); setRpsData(null); }}>Tutup</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1" onClick={() => setShowSaveModal(true)}>Simpan ke Database</Button>
                    </div>
                </h3>

                <div className="overflow-x-auto bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                    <div
                        className="prose prose-sm md:prose-base prose-blue max-w-none
                            [&_table]:w-full [&_table]:border-collapse
                            [&_th]:border [&_th]:border-gray-400 [&_th]:p-2 [&_th]:bg-gray-100 [&_th]:text-left
                            [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_td]:align-top"
                        dangerouslySetInnerHTML={{ __html: hasilAi }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-[1200px] mx-auto">
            <Toaster position="top-right" />
            {renderSaveModal()}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setMode('choice')} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">RPS Builder Wizard</h1>
            </div>
            
            {mode === 'ai' && (
                <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-xl mb-6">
                    <h2 className="text-xl font-bold mb-6 text-purple-700 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Bot className="w-6 h-6" />
                        </div>
                        AI Auto-Generate
                    </h2>
                    <div className="grid grid-cols-1 gap-6 mb-8 max-w-3xl">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Template RPS (Opsional, format .docx / .pdf)</label>
                            <input 
                                id="template-upload"
                                type="file" 
                                accept=".pdf"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-gray-300 rounded-md p-1 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">Upload template PDF dari fakultas agar AI mengikuti strukturnya secara tepat.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Instruksi Tambahan (Prompt)</label>
                            <textarea 
                                className="w-full border border-gray-300 rounded-md p-3 outline-none focus:ring-2 focus:ring-purple-500 text-sm" 
                                rows="4"
                                placeholder="Contoh: Fokuskan pendekatan pembelajaran pada project-based learning dan berikan studi kasus yang relevan dengan industri digital..."
                                value={instruksiAi}
                                onChange={(e) => setInstruksiAi(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-6">
                        <Button 
                            onClick={handleGenerateAi} 
                            disabled={loading}
                            className={`bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 text-sm flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? '⏳ Sedang meng-generate...' : '✨ Generate Draft RPS dengan AI'}
                        </Button>
                    </div>
                    
                    {renderHasilAi()}
                </div>
            )}

            {mode === 'manual' && (
                <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Edit3 className="w-6 h-6 text-blue-600" /> Manual Builder
                        </h2>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((s) => (
                                <div 
                                    key={s} 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === s ? 'bg-blue-600 text-white shadow-md' : step > s ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="min-h-[300px] mb-8">
                        {renderStepContent()}
                    </div>

                    <div className="flex justify-between border-t border-gray-100 pt-4">
                        <Button 
                            variant="secondary" 
                            onClick={() => dispatch(setStep(Math.max(1, step - 1)))}
                            disabled={step === 1}
                            className={step === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            Sebelumnya
                        </Button>
                        {step < 4 ? (
                            <Button onClick={() => dispatch(setStep(step + 1))}>Selanjutnya</Button>
                        ) : (
                            <Button className="bg-green-600 hover:bg-green-700">Simpan & Terbitkan RPS</Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
