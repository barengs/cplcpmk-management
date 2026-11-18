import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2 } from 'lucide-react';

export default function ProfilLulusan() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/master/profil-lulusan');
            setData(res.data);
        } catch (error) {
            toast.error('Gagal memuat data Profil Lulusan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setEditId(null);
        reset({ kode_pl: '', deskripsi: '', kategori: '', profesi: '' });
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
            await api.delete(`/master/profil-lulusan/${id}`);
            toast.success('Data berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus data');
        }
    };

    const onSubmit = async (formData) => {
        try {
            if (editId) {
                await api.put(`/master/profil-lulusan/${editId}`, formData);
                toast.success('Data berhasil diperbarui');
            } else {
                await api.post('/master/profil-lulusan', formData);
                toast.success('Data berhasil ditambahkan');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const columns = [
        { accessorKey: 'kode_pl', header: 'Kode PL', cell: info => <span className="font-mono font-bold text-[#1e3a8a] bg-blue-50 px-2 py-1 rounded">{info.getValue()}</span> },
        { accessorKey: 'deskripsi', header: 'Deskripsi Profil', cell: info => <div className="max-w-md whitespace-normal">{info.getValue()}</div> },
        { accessorKey: 'kategori', header: 'Kategori' },
        { accessorKey: 'profesi', header: 'Profesi/Pekerjaan' },
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
                title="Master Data: Profil Lulusan (PL)"
                data={data}
                columns={columns}
                onAdd={openAddModal}
                loading={loading}
                searchPlaceholder="Cari Profil Lulusan..."
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editId ? "Edit Profil Lulusan" : "Tambah Profil Lulusan"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <Input label="Kode PL" placeholder="Contoh: PL-01" {...register('kode_pl', { required: 'Kode PL wajib diisi' })} />
                        {errors.kode_pl && <span className="text-red-500 text-xs mt-1 block">{errors.kode_pl.message}</span>}
                    </div>
                    <div>
                        <Input label="Deskripsi Profil" placeholder="Deskripsi kompetensi profil lulusan..." {...register('deskripsi', { required: 'Deskripsi wajib diisi' })} />
                        {errors.deskripsi && <span className="text-red-500 text-xs mt-1 block">{errors.deskripsi.message}</span>}
                    </div>
                    <Input label="Kategori (Opsional)" placeholder="Misal: Akademik, Industri" {...register('kategori')} />
                    <Input label="Profesi/Pekerjaan (Opsional)" placeholder="Misal: Software Engineer" {...register('profesi')} />
                    
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button type="submit">Simpan Data</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
