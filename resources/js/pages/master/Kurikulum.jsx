import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';

export default function Kurikulum() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [standarKurikulumList, setStandarKurikulumList] = useState([]);
    const [programStudiList, setProgramStudiList] = useState([]);
    const [standarMutuList, setStandarMutuList] = useState([]);
    const [selectedStandarMutu, setSelectedStandarMutu] = useState([]);
    const { register, handleSubmit, reset } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [res, sk, ps, sm] = await Promise.all([
                api.get('/master/kurikulum'),
                api.get('/master/standar-kurikulum'),
                api.get('/master/program-studi'),
                api.get('/master/standar-mutu'),
            ]);
            setData(res.data);
            setStandarKurikulumList(sk.data);
            setProgramStudiList(ps.data);
            setStandarMutuList(sm.data);
        } catch { toast.error('Gagal memuat data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openAddModal = () => {
        setEditId(null);
        reset({ tahun_berlaku: new Date().getFullYear(), is_active: false });
        setSelectedStandarMutu([]);
        setIsModalOpen(true);
    };

    const openEditModal = (row) => {
        setEditId(row.id);
        reset(row);
        setSelectedStandarMutu((row.standar_mutus || []).map(s => s.id));
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus kurikulum ini?')) return;
        try { await api.delete(`/master/kurikulum/${id}`); toast.success('Kurikulum dihapus'); fetchData(); }
        catch { toast.error('Gagal menghapus'); }
    };

    const toggleStandarMutu = (id) => {
        setSelectedStandarMutu(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const onSubmit = async (formData) => {
        const payload = { ...formData, standar_mutu_ids: selectedStandarMutu };
        try {
            editId ? await api.put(`/master/kurikulum/${editId}`, payload) : await api.post('/master/kurikulum', payload);
            toast.success('Data tersimpan'); setIsModalOpen(false); fetchData();
        } catch (e) { toast.error(e.response?.data?.message || 'Terjadi kesalahan'); }
    };

    const columns = [
        { accessorKey: 'nama_kurikulum', header: 'Nama Kurikulum', cell: info => <span className="font-bold text-gray-800">{info.getValue()}</span> },
        { accessorKey: 'tahun_berlaku', header: 'Tahun', cell: info => <span className="font-mono text-blue-700 font-bold">{info.getValue()}</span> },
        {
            id: 'standar_kurikulum', header: 'Tipe Kurikulum',
            cell: ({ row }) => <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">{row.original.standar_kurikulum?.singkatan || '-'}</span>
        },
        {
            id: 'standar_mutus', header: 'Standar Mutu',
            cell: ({ row }) => (
                <div className="flex gap-1 flex-wrap">
                    {(row.original.standar_mutus || []).map(sm => (
                        <span key={sm.id} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded text-[10px] font-bold">{sm.singkatan || sm.nama}</span>
                    ))}
                </div>
            )
        },
        {
            accessorKey: 'is_active', header: 'Status',
            cell: info => info.getValue()
                ? <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Aktif</span>
                : <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-bold">Nonaktif</span>
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
            <DataTable title="Manajemen Kurikulum" data={data} columns={columns} onAdd={openAddModal} loading={loading} searchPlaceholder="Cari kurikulum..." />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Kurikulum' : 'Tambah Kurikulum'}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input label="Nama Kurikulum" placeholder="Kurikulum Informatika 2024" {...register('nama_kurikulum', { required: true })} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Tahun Berlaku" type="number" placeholder="2024" {...register('tahun_berlaku', { required: true })} />
                        <Input label="Tahun Berakhir (Opsional)" type="number" placeholder="2029" {...register('tahun_berakhir')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe Kurikulum</label>
                            <select {...register('standar_kurikulum_id')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">-- Pilih --</option>
                                {standarKurikulumList.map(sk => <option key={sk.id} value={sk.id}>{sk.singkatan} – {sk.nama}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Program Studi</label>
                            <select {...register('program_studi_id')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">-- Pilih --</option>
                                {programStudiList.map(ps => <option key={ps.id} value={ps.id}>{ps.jenjang} {ps.nama_prodi}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Target Standar Mutu / Akreditasi</label>
                        <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                            {standarMutuList.map(sm => (
                                <label key={sm.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${selectedStandarMutu.includes(sm.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <input type="checkbox" checked={selectedStandarMutu.includes(sm.id)} onChange={() => toggleStandarMutu(sm.id)} className="w-4 h-4 accent-blue-700" />
                                    <span className="text-sm font-semibold text-gray-700">{sm.singkatan || sm.nama}</span>
                                    <span className="text-xs text-gray-400 truncate">{sm.lembaga_penilai}</span>
                                </label>
                            ))}
                            {standarMutuList.length === 0 && <p className="text-xs text-gray-400 col-span-2">Belum ada standar mutu. Tambahkan dulu di menu Standar Mutu.</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Visi (Opsional)</label>
                        <textarea {...register('visi')} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Misi (Opsional)</label>
                        <textarea {...register('misi')} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active_kr" {...register('is_active')} className="w-4 h-4 accent-blue-700" />
                        <label htmlFor="is_active_kr" className="text-sm font-medium text-gray-700">Jadikan Kurikulum Aktif</label>
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
