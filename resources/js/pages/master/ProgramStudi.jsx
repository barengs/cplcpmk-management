import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2 } from 'lucide-react';

export default function ProgramStudi() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/master/program-studi');
            setData(res.data);
        } catch {
            toast.error('Gagal memuat data Program Studi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openAddModal = () => { setEditId(null); reset({}); setIsModalOpen(true); };
    const openEditModal = (row) => { setEditId(row.id); reset(row); setIsModalOpen(true); };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus data ini?')) return;
        try {
            await api.delete(`/master/program-studi/${id}`);
            toast.success('Data berhasil dihapus');
            fetchData();
        } catch { toast.error('Gagal menghapus data'); }
    };

    const onSubmit = async (formData) => {
        try {
            if (editId) {
                await api.put(`/master/program-studi/${editId}`, formData);
                toast.success('Data berhasil diperbarui');
            } else {
                await api.post('/master/program-studi', formData);
                toast.success('Data berhasil ditambahkan');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    const columns = [
        { accessorKey: 'nama_prodi', header: 'Nama Prodi', cell: info => <span className="font-semibold text-gray-800">{info.getValue()}</span> },
        { accessorKey: 'jenjang', header: 'Jenjang', cell: info => <span className="font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">{info.getValue()}</span> },
        { accessorKey: 'nama_fakultas', header: 'Fakultas' },
        { accessorKey: 'nama_universitas', header: 'Universitas' },
        { accessorKey: 'akreditasi_nasional', header: 'Akreditasi' },
        {
            accessorKey: 'is_active', header: 'Status',
            cell: info => info.getValue()
                ? <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-xs font-bold">Aktif</span>
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
            <DataTable title="Master Data: Program Studi" data={data} columns={columns} onAdd={openAddModal} loading={loading} searchPlaceholder="Cari Program Studi..." />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Program Studi' : 'Tambah Program Studi'}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <Input label="Nama Program Studi" placeholder="S1 Teknik Informatika" {...register('nama_prodi', { required: 'Wajib diisi' })} />
                        {errors.nama_prodi && <span className="text-red-500 text-xs mt-1 block">{errors.nama_prodi.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Jenjang</label>
                        <select {...register('jenjang', { required: 'Wajib diisi' })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                            {['D3','D4','S1','S2','S3'].map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                    </div>
                    <Input label="Nama Jurusan (Opsional)" {...register('nama_jurusan')} />
                    <Input label="Nama Fakultas" {...register('nama_fakultas')} />
                    <Input label="Nama Universitas" {...register('nama_universitas')} />
                    <Input label="Akreditasi Nasional (Opsional)" placeholder="Unggul / A / Baik Sekali" {...register('akreditasi_nasional')} />
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active_ps" {...register('is_active')} className="w-4 h-4 accent-blue-700" />
                        <label htmlFor="is_active_ps" className="text-sm font-medium text-gray-700">Jadikan Program Studi Aktif</label>
                    </div>
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button type="submit">Simpan Data</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
