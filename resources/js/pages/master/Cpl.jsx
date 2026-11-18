import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2 } from 'lucide-react';

export default function Cpl() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/master/cpl');
            setData(res.data);
        } catch (error) {
            toast.error('Gagal memuat data CPL');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setEditId(null);
        reset({ kode_cpl: '', deskripsi: '', kategori: 'Sikap' });
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
            await api.delete(`/master/cpl/${id}`);
            toast.success('Data berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus data');
        }
    };

    const onSubmit = async (formData) => {
        try {
            if (editId) {
                await api.put(`/master/cpl/${editId}`, formData);
                toast.success('Data berhasil diperbarui');
            } else {
                await api.post('/master/cpl', formData);
                toast.success('Data berhasil ditambahkan');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const columns = [
        { accessorKey: 'kode_cpl', header: 'Kode CPL', cell: info => <span className="font-mono font-bold text-[#1e3a8a] bg-blue-50 px-2 py-1 rounded">{info.getValue()}</span> },
        { accessorKey: 'kategori', header: 'Kategori', cell: info => <span className="bg-gray-100 text-gray-700 font-semibold px-2 py-1 rounded text-[10px]">{info.getValue()}</span> },
        { accessorKey: 'deskripsi', header: 'Deskripsi CPL', cell: info => <div className="max-w-xl whitespace-normal">{info.getValue()}</div> },
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
                title="Master Data: Capaian Pembelajaran Lulusan (CPL)"
                data={data}
                columns={columns}
                onAdd={openAddModal}
                loading={loading}
                searchPlaceholder="Cari CPL..."
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editId ? "Edit CPL" : "Tambah CPL"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <Input label="Kode CPL" placeholder="Contoh: CPL-01" {...register('kode_cpl', { required: 'Kode CPL wajib diisi' })} />
                        {errors.kode_cpl && <span className="text-red-500 text-xs mt-1 block">{errors.kode_cpl.message}</span>}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Kategori</label>
                        <select 
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            {...register('kategori')}
                        >
                            <option value="Sikap">Sikap (SN-Dikti)</option>
                            <option value="Pengetahuan">Pengetahuan (SN-Dikti)</option>
                            <option value="Keterampilan Umum">Keterampilan Umum (SN-Dikti)</option>
                            <option value="Keterampilan Khusus">Keterampilan Khusus (Prodi)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Deskripsi CPL</label>
                        <textarea 
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white min-h-[100px]"
                            placeholder="Deskripsi..." 
                            {...register('deskripsi', { required: 'Deskripsi wajib diisi' })}
                        />
                        {errors.deskripsi && <span className="text-red-500 text-xs mt-1 block">{errors.deskripsi.message}</span>}
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
