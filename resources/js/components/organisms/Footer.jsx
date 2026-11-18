import React from 'react';

export default function Footer() {
    return (
        <div className="h-10 border-t border-gray-200 bg-white px-6 flex items-center justify-between text-[10px] text-gray-400 font-medium shrink-0 mt-auto">
            <div>
                &copy; 2025 Universitas Islam Madura. Fakultas Teknik Kurikulum OBE & RPS Generator Terakreditasi Internasional.
            </div>
            <div className="flex items-center gap-4 font-mono">
                <span>LATENCY: 24ms</span>
                <span className="text-gray-300">|</span>
                <span>ENGINE V3.8-PROD</span>
            </div>
        </div>
    );
}
