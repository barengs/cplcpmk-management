import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/axios';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/organisms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';

export default function TahunAkademik() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [kurikulumList, setKurikulumList] = useState([]);
    const { register, handleSubmit, reset, watch, setValue } = useForm();
    const tanggalMulai = watch('tanggal_mulai');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [res, kr] = await Promise.all([api.get('/master/tahun-akademik'), api.get('/master/kurikulum')]);
            setData(res.data);
            setKurikulumList(kr.data);
        } catch { toast.error('Gagal memuat data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    // Auto-fill tanggal selesai (approx 6 months) when tanggal mulai is set
    useEffect(() => {
        if (tanggalMulai) {
            const startDate = new Date(tanggalMulai);
            if (!isNaN(startDate)) {
                startDate.setMonth(startDate.getMonth() + 6);
                setValue('tanggal_selesai', startDate.toISOString().split('T')[0], { shouldValidate: true, shouldDirty: true });
            }
        }
    }, [tanggalMulai, setValue]);

    const openAddModal = () => { setEditId(null); reset({}); setIsModalOpen(true); };
    const openEditModal = (row) => { setEditId(row.id); reset(row); setIsModalOpen(true); };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin?')) return;
        try { await api.delete(`/master/tahun-akademik/${id}`); toast.success('Dihapus'); fetchData(); }
        catch { toast.error('Gagal'); }
    };

    const onSubmit = async (formData) => {
        try {
            editId ? await api.put(`/master/tahun-akademik/${editId}`, formData) : await api.post('/master/tahun-akademik', formData);
            toast.success('Tersimpan'); setIsModalOpen(false); fetchData();
        } catch (e) { toast.error(e.response?.data?.message || 'Terjadi kesalahan'); }
    };

    const columns = [
        { accessorKey: 'tahun_akademik', header: 'Tahun Akademik', cell: info => <span className="font-mono font-bold text-blue-800">{info.getValue()}</span> },
        { accessorKey: 'semester', header: 'Semester', cell: info => <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${info.getValue() === 'Ganjil' ? 'bg-orange-50 text-orange-700' : 'bg-teal-50 text-teal-700'}`}>{info.getValue()}</span> },
        { id: 'kurikulum', header: 'Kurikulum', cell: ({ row }) => <span className="text-sm text-gray-600">{row.original.kurikulum?.nama_kurikulum || '-'}</span> },
        { accessorKey: 'tanggal_mulai', header: 'Mulai' },
        { accessorKey: 'tanggal_selesai', header: 'Selesai' },
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
            <DataTable title="Master Data: Tahun Akademik" data={data} columns={columns} onAdd={openAddModal} loading={loading} searchPlaceholder="Cari tahun akademik..." />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Tahun Akademik' : 'Tambah Tahun Akademik'}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input label="Tahun Akademik" placeholder="2024/2025" {...register('tahun_akademik', { required: true })} />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
                        <select {...register('semester', { required: true })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Ganjil">Ganjil</option>
                            <option value="Genap">Genap</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Kurikulum yang Berlaku</label>
                        <select {...register('kurikulum_id')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Pilih Kurikulum --</option>
                            {kurikulumList.map(k => <option key={k.id} value={k.id}>{k.nama_kurikulum} ({k.tahun_berlaku})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Tanggal Mulai" type="date" {...register('tanggal_mulai')} />
                        <Input label="Tanggal Selesai" type="date" {...register('tanggal_selesai')} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active_ta" {...register('is_active')} className="w-4 h-4 accent-blue-700" />
                        <label htmlFor="is_active_ta" className="text-sm font-medium text-gray-700">Jadikan TA Aktif (Semester Berjalan)</label>
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
