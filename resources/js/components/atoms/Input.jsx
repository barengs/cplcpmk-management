import React from 'react';

export default function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1 mb-4 w-full">
            {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
            <input 
                className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                {...props}
            />
        </div>
    );
}
