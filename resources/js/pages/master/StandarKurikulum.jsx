import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2 } from 'lucide-react';

export default function StandarKurikulum() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const { register, handleSubmit, reset } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try { const res = await api.get('/master/standar-kurikulum'); setData(res.data); }
        catch { toast.error('Gagal memuat data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openAddModal = () => { setEditId(null); reset({}); setIsModalOpen(true); };
    const openEditModal = (row) => { setEditId(row.id); reset(row); setIsModalOpen(true); };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus?')) return;
        try { await api.delete(`/master/standar-kurikulum/${id}`); toast.success('Dihapus'); fetchData(); }
        catch { toast.error('Gagal menghapus'); }
    };

    const onSubmit = async (formData) => {
        try {
            editId ? await api.put(`/master/standar-kurikulum/${editId}`, formData) : await api.post('/master/standar-kurikulum', formData);
            toast.success('Data tersimpan'); setIsModalOpen(false); fetchData();
        } catch (e) { toast.error(e.response?.data?.message || 'Terjadi kesalahan'); }
    };

    const columns = [
        { accessorKey: 'singkatan', header: 'Singkatan', cell: info => <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded">{info.getValue()}</span> },
        { accessorKey: 'nama', header: 'Nama Standar' },
        { accessorKey: 'dasar_regulasi', header: 'Dasar Regulasi' },
        { accessorKey: 'deskripsi', header: 'Deskripsi', cell: info => <div className="max-w-xs truncate text-gray-500 text-xs">{info.getValue()}</div> },
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
            <DataTable title="Master Data: Standar Kurikulum" data={data} columns={columns} onAdd={openAddModal} loading={loading} searchPlaceholder="Cari standar kurikulum..." />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Standar Kurikulum' : 'Tambah Standar Kurikulum'}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input label="Nama Standar" placeholder="Outcome-Based Education" {...register('nama', { required: true })} />
                    <Input label="Singkatan" placeholder="OBE" {...register('singkatan')} />
                    <Input label="Dasar Regulasi" placeholder="Permendikbudristek No. 53/2023" {...register('dasar_regulasi')} />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                        <textarea {...register('deskripsi')} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Penjelasan singkat tentang standar ini..." />
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
