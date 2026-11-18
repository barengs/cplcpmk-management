import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2 } from 'lucide-react';

export default function Cpmk() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [mataKuliahList, setMataKuliahList] = useState([]);
    const [cplList, setCplList] = useState([]);
    const [selectedCpl, setSelectedCpl] = useState([]);
    const [filterMk, setFilterMk] = useState('');
    const { register, handleSubmit, reset, watch } = useForm();

    const fetchData = async (mkId = '') => {
        setLoading(true);
        try {
            const params = mkId ? { mk_id: mkId } : {};
            const [res, mks, cpls] = await Promise.all([
                api.get('/master/cpmk', { params }),
                api.get('/master/mata-kuliah'),
                api.get('/master/cpl'),
            ]);
            setData(res.data);
            setMataKuliahList(mks.data);
            setCplList(cpls.data);
        } catch { toast.error('Gagal memuat data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openAddModal = () => {
        setEditId(null);
        reset({});
        setSelectedCpl([]);
        setIsModalOpen(true);
    };

    const openEditModal = (row) => {
        setEditId(row.id);
        reset(row);
        setSelectedCpl((row.cpl_prodis || []).map(c => c.id));
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus CPMK ini?')) return;
        try { await api.delete(`/master/cpmk/${id}`); toast.success('CPMK dihapus'); fetchData(filterMk); }
        catch { toast.error('Gagal menghapus'); }
    };

    const toggleCpl = (id) => setSelectedCpl(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const onSubmit = async (formData) => {
        const payload = { ...formData, cpl_prodi_ids: selectedCpl };
        try {
            editId ? await api.put(`/master/cpmk/${editId}`, payload) : await api.post('/master/cpmk', payload);
            toast.success('CPMK tersimpan');
            setIsModalOpen(false);
            fetchData(filterMk);
        } catch (e) { toast.error(e.response?.data?.message || 'Terjadi kesalahan'); }
    };

    const columns = [
        {
            accessorKey: 'kode_cpmk', header: 'Kode CPMK',
            cell: info => <span className="font-mono font-bold text-[#1e3a8a] bg-blue-50 px-2 py-1 rounded text-xs">{info.getValue()}</span>
        },
        {
            id: 'mk', header: 'Mata Kuliah',
            cell: ({ row }) => (
                <div>
                    <div className="font-semibold text-gray-800 text-sm">{row.original.mata_kuliah?.nama_mk || '-'}</div>
                    <div className="text-[10px] font-mono text-gray-400">{row.original.mata_kuliah?.kode_mk}</div>
                </div>
            )
        },
        {
            accessorKey: 'deskripsi_cpmk', header: 'Deskripsi CPMK',
            cell: info => <div className="max-w-sm text-xs text-gray-600 leading-relaxed">{info.getValue()}</div>
        },
        {
            id: 'cpl_mapping', header: 'Mapping CPL',
            cell: ({ row }) => (
                <div className="flex gap-1 flex-wrap">
                    {(row.original.cpl_prodis || []).map(c => (
                        <span key={c.id} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded text-[10px] font-bold">{c.kode_cpl}</span>
                    ))}
                    {(row.original.cpl_prodis || []).length === 0 && <span className="text-gray-400 text-xs">Belum dipetakan</span>}
                </div>
            )
        },
        {
            id: 'actions', header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(row.original)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(row.original.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            <Toaster position="top-right" />

            {/* Filter by MK */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <label className="text-sm font-semibold text-gray-700 shrink-0">Filter Mata Kuliah:</label>
                <select
                    value={filterMk}
                    onChange={e => { setFilterMk(e.target.value); fetchData(e.target.value); }}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1 max-w-xs"
                >
                    <option value="">Semua Mata Kuliah</option>
                    {mataKuliahList.map(mk => <option key={mk.id} value={mk.id}>{mk.kode_mk} – {mk.nama_mk}</option>)}
                </select>
            </div>

            <DataTable
                title="Capaian Pembelajaran Mata Kuliah (CPMK)"
                data={data}
                columns={columns}
                onAdd={openAddModal}
                loading={loading}
                searchPlaceholder="Cari kode atau deskripsi CPMK..."
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit CPMK' : 'Tambah CPMK'}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mata Kuliah</label>
                        <select {...register('mk_id', { required: true })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Pilih Mata Kuliah --</option>
                            {mataKuliahList.map(mk => <option key={mk.id} value={mk.id}>{mk.kode_mk} – {mk.nama_mk}</option>)}
                        </select>
                    </div>
                    <Input label="Kode CPMK" placeholder="CPMK-01" {...register('kode_cpmk', { required: true })} />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi CPMK</label>
                        <textarea
                            {...register('deskripsi_cpmk', { required: true })}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Mampu merancang dan mengimplementasikan..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Peta ke CPL Prodi</label>
                        <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-md bg-gray-50 max-h-40 overflow-y-auto">
                            {cplList.map(c => (
                                <label key={c.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors text-sm ${selectedCpl.includes(c.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <input type="checkbox" checked={selectedCpl.includes(c.id)} onChange={() => toggleCpl(c.id)} className="w-4 h-4 accent-blue-700" />
                                    <span className="font-mono font-bold text-blue-800">{c.kode_cpl}</span>
                                    <span className="text-xs text-gray-400 truncate">{c.deskripsi_cpl?.substring(0, 30)}...</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
