import React, { useState } from 'react';
import { 
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender 
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function DataTable({ 
    data, 
    columns, 
    onAdd, 
    searchPlaceholder = "Cari data...",
    title = "Data",
    loading = false
}) {
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
                <h2 className="font-bold text-gray-800 text-sm tracking-tight">{title}</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            type="text" 
                            placeholder={searchPlaceholder} 
                            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-[11px] w-64 outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                        />
                    </div>
                    {onAdd && (
                        <button onClick={onAdd} className="flex items-center gap-2 bg-[#1e3a8a] text-white hover:bg-blue-900 px-4 py-2 rounded-md text-xs font-bold transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Tambah Baru
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#f8faff] text-[#1e3a8a] border-b border-gray-200">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="p-3 px-4 font-bold text-[11px] uppercase tracking-wider">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={columns.length} className="p-8 text-center text-gray-500 font-medium">Memuat data...</td></tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr><td colSpan={columns.length} className="p-8 text-center text-gray-500 font-medium">Data tidak ditemukan</td></tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="p-3 px-4 text-gray-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-2.5 px-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-[11px] text-gray-500 rounded-b-xl font-medium">
                <div>
                    Menampilkan <strong className="text-gray-800">{table.getRowModel().rows.length}</strong> dari <strong className="text-gray-800">{data.length}</strong> entri
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => table.previousPage()} 
                        disabled={!table.getCanPreviousPage()}
                        className="p-1.5 text-gray-500 hover:text-[#1e3a8a] disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 font-bold text-gray-700 bg-white border border-gray-200 rounded">
                        Hal {table.getState().pagination.pageIndex + 1} dari {table.getPageCount() || 1}
                    </span>
                    <button 
                        onClick={() => table.nextPage()} 
                        disabled={!table.getCanNextPage()}
                        className="p-1.5 text-gray-500 hover:text-[#1e3a8a] disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
