import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 className="font-bold text-gray-800 text-sm tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto bg-gray-50/50">
                    {children}
                </div>
            </div>
        </div>
    );
}
