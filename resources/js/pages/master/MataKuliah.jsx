import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2, BookOpen } from 'lucide-react';

export default function MataKuliah() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/master/mata-kuliah');
            setData(res.data);
        } catch (error) {
            toast.error('Gagal memuat data Mata Kuliah');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setEditId(null);
        reset({ kode_mk: '', nama_mk: '', sks_teori: 2, sks_praktek: 1, semester: 1, deskripsi_mk: '' });
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
            await api.delete(`/master/mata-kuliah/${id}`);
            toast.success('Data berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus data');
        }
    };

    const onSubmit = async (formData) => {
        try {
            if (editId) {
                await api.put(`/master/mata-kuliah/${editId}`, formData);
                toast.success('Data berhasil diperbarui');
            } else {
                await api.post('/master/mata-kuliah', formData);
                toast.success('Data berhasil ditambahkan');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const columns = [
        { accessorKey: 'kode_mk', header: 'Kode MK', cell: info => <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">{info.getValue()}</span> },
        { accessorKey: 'nama_mk', header: 'Nama Mata Kuliah', cell: info => <span className="font-bold text-gray-800 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-gray-400" /> {info.getValue()}</span> },
        { id: 'sks', header: 'Total SKS', cell: ({ row }) => <span className="font-bold text-[#1e3a8a]">{parseInt(row.original.sks_teori) + parseInt(row.original.sks_praktek)} SKS <span className="text-[10px] font-medium text-gray-500">({row.original.sks_teori}T / {row.original.sks_praktek}P)</span></span> },
        { accessorKey: 'semester', header: 'Semester', cell: info => <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-700">Sem. {info.getValue()}</span> },
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
                title="Master Data: Mata Kuliah"
                data={data}
                columns={columns}
                onAdd={openAddModal}
                loading={loading}
                searchPlaceholder="Cari Mata Kuliah..."
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editId ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input label="Kode MK" placeholder="Contoh: MKK020145" {...register('kode_mk', { required: 'Kode MK wajib diisi' })} />
                            {errors.kode_mk && <span className="text-red-500 text-xs mt-1 block">{errors.kode_mk.message}</span>}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Semester</label>
                            <input type="number" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" {...register('semester', { required: true })} />
                        </div>
                    </div>
                    <div>
                        <Input label="Nama Mata Kuliah" placeholder="Misal: Pemrograman Web" {...register('nama_mk', { required: 'Nama MK wajib diisi' })} />
                        {errors.nama_mk && <span className="text-red-500 text-xs mt-1 block">{errors.nama_mk.message}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">SKS Teori</label>
                            <input type="number" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" {...register('sks_teori', { required: true })} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">SKS Praktek</label>
                            <input type="number" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" {...register('sks_praktek', { required: true })} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Deskripsi (Opsional)</label>
                        <textarea 
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white min-h-[80px]"
                            placeholder="Deskripsi..." 
                            {...register('deskripsi_mk')}
                        />
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
