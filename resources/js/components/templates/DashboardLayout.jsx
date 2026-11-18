import React from 'react';
import Sidebar from '../organisms/Sidebar';
import TopNavbar from '../organisms/TopNavbar';
import Footer from '../organisms/Footer';

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans text-slate-800">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
