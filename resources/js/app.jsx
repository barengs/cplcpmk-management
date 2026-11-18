import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RpsBuilder from './pages/RpsBuilder';
import ProfilLulusan from './pages/master/ProfilLulusan';
import Cpl from './pages/master/Cpl';
import BahanKajian from './pages/master/BahanKajian';
import MataKuliah from './pages/master/MataKuliah';
import CplMk from './pages/mapping/CplMk';
import DashboardLayout from './components/templates/DashboardLayout';
import Cpmk from './pages/master/Cpmk';
import ProgramStudi from './pages/master/ProgramStudi';
import StandarKurikulum from './pages/master/StandarKurikulum';
import StandarMutu from './pages/master/StandarMutu';
import Kurikulum from './pages/master/Kurikulum';
import TahunAkademik from './pages/master/TahunAkademik';

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                <Route path="/rps-builder" element={<DashboardLayout><RpsBuilder /></DashboardLayout>} />
                
                {/* Master Data Routes */}
                <Route path="/master/profil-lulusan" element={<DashboardLayout><ProfilLulusan /></DashboardLayout>} />
                <Route path="/master/cpl" element={<DashboardLayout><Cpl /></DashboardLayout>} />
                <Route path="/master/bahan-kajian" element={<DashboardLayout><BahanKajian /></DashboardLayout>} />
                <Route path="/master/mata-kuliah" element={<DashboardLayout><MataKuliah /></DashboardLayout>} />
                <Route path="/master/cpmk" element={<DashboardLayout><Cpmk /></DashboardLayout>} />
                
                {/* Kurikulum Module Routes */}
                <Route path="/master/program-studi" element={<DashboardLayout><ProgramStudi /></DashboardLayout>} />
                <Route path="/master/standar-kurikulum" element={<DashboardLayout><StandarKurikulum /></DashboardLayout>} />
                <Route path="/master/standar-mutu" element={<DashboardLayout><StandarMutu /></DashboardLayout>} />
                <Route path="/master/kurikulum" element={<DashboardLayout><Kurikulum /></DashboardLayout>} />
                <Route path="/master/tahun-akademik" element={<DashboardLayout><TahunAkademik /></DashboardLayout>} />
                
                {/* Mapping Routes */}
                <Route path="/mapping/cpl-mk" element={<DashboardLayout><CplMk /></DashboardLayout>} />
            </Routes>
        </Provider>
    );
}

const container = document.getElementById('app');
if (container) {
    if (!container._reactRoot) {
        container._reactRoot = createRoot(container);
    }
    container._reactRoot.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
