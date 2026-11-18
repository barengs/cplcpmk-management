import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2 } from 'lucide-react';

export default function BahanKajian() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/master/bahan-kajian');
            setData(res.data);
        } catch (error) {
            toast.error('Gagal memuat data Bahan Kajian');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setEditId(null);
        reset({ kode_bk: '', nama_bk: '', deskripsi: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (row) => {
        setEditId(row.id);
        reset(row);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus data ini?')) return;
        try {
            await api.delete(`/master/bahan-kajian/${id}`);
            toast.success('Data berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus data');
        }
    };

    const onSubmit = async (formData) => {
        try {
            if (editId) {
                await api.put(`/master/bahan-kajian/${editId}`, formData);
                toast.success('Data berhasil diperbarui');
            } else {
                await api.post('/master/bahan-kajian', formData);
                toast.success('Data berhasil ditambahkan');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const columns = [
        { accessorKey: 'kode_bk', header: 'Kode BK', cell: info => <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{info.getValue()}</span> },
        { accessorKey: 'nama_bk', header: 'Bahan Kajian', cell: info => <span className="font-bold text-gray-800">{info.getValue()}</span> },
        { accessorKey: 'deskripsi', header: 'Deskripsi', cell: info => <div className="max-w-xl whitespace-normal text-gray-600">{info.getValue() || '-'}</div> },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(row.original)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(row.original.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            <Toaster position="top-right" />
            <DataTable 
                title="Master Data: Bahan Kajian (BK)"
                data={data}
                columns={columns}
                onAdd={openAddModal}
                loading={loading}
                searchPlaceholder="Cari Bahan Kajian..."
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editId ? "Edit Bahan Kajian" : "Tambah Bahan Kajian"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <Input label="Kode BK" placeholder="Contoh: BK-01" {...register('kode_bk', { required: 'Kode BK wajib diisi' })} />
                        {errors.kode_bk && <span className="text-red-500 text-xs mt-1 block">{errors.kode_bk.message}</span>}
                    </div>
                    <div>
                        <Input label="Nama Bahan Kajian" placeholder="Misal: Algoritma & Pemrograman" {...register('nama_bk', { required: 'Nama BK wajib diisi' })} />
                        {errors.nama_bk && <span className="text-red-500 text-xs mt-1 block">{errors.nama_bk.message}</span>}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Deskripsi (Opsional)</label>
                        <textarea 
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white min-h-[100px]"
                            placeholder="Deskripsi..." 
                            {...register('deskripsi')}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button type="submit">Simpan Data</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
