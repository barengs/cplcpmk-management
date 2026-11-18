import { createSlice } from '@reduxjs/toolkit';

// Initial dummy state matching the provided screenshot
const initialState = {
    metrics: {
        profilLulusan: { total: 6, subtitle: "100% Terdefinisi Industri" },
        cplSnDikti: { total: 12, subtitle: "Sikap (3) • KU (3) • Peng (..." },
        cplProdi: { total: 9, subtitle: "CPL-01 s.d CPL-09 Matang" },
        mkTerpetakan: { total: 48, max: 52 },
        rpsResmi: { total: 38, percent: "73%", subtitle: "10 Dokumen Dalam Telaah" }
    },
    mataKuliahList: [
        { kode: 'MKK020145', nama: 'Pemrograman Bergerak (Mobile Programming)', pengampu: 'Tim KBK Mobile • Sem. 5', rumpun: 'Rumpun RPL', sks: '3 SKS (2T / 1P)', totalCpmk: 4, statusRps: 'Approved', cplMap: { 'CPL-02': 'M', 'CPL-05': 'M', 'CPL-09': 'S' } },
        { kode: 'MKK020120', nama: 'Rekayasa Perangkat Lunak (Software Engineering)', pengampu: 'Prof. Hendra • Sem. 4', rumpun: 'Rumpun RPL', sks: '4 SKS (3T / 1P)', totalCpmk: 5, statusRps: 'Approved', cplMap: { 'CPL-01': 'M', 'CPL-03': 'M', 'CPL-05': 'M', 'CPL-08': 'S' } },
        { kode: 'MKK020133', nama: 'Sistem Basis Data Terdistribusi', pengampu: 'Dr. Farhanudin • Sem. 4', rumpun: 'Rumpun Sains Data', sks: '3 SKS (2T / 1P)', totalCpmk: 3, statusRps: 'In Review', cplMap: { 'CPL-03': 'S', 'CPL-04': 'M' } },
        { kode: 'MKK020188', nama: 'Kecerdasan Artifisial & Pembelajaran Mesin', pengampu: 'Tim AI Research Group • Sem. 6', rumpun: 'Rumpun AI', sks: '3 SKS (3T / 0P)', totalCpmk: 3, statusRps: 'Draft Dosen', cplMap: { 'CPL-02': 'M', 'CPL-06': 'S', 'CPL-07': 'S' } },
        { kode: 'MKK020199', nama: 'Tugas Akhir / Capstone Project', pengampu: 'Komisi Ujian Skripsi • Sem. 8', rumpun: 'Kulminasi Terbuka', sks: '6 SKS (Praktik Mandiri)', totalCpmk: 8, statusRps: 'Approved', cplMap: { 'CPL-01': 'M', 'CPL-02': 'M', 'CPL-03': 'M', 'CPL-04': 'M', 'CPL-05': 'M', 'CPL-06': 'M', 'CPL-07': 'M', 'CPL-08': 'M', 'CPL-09': 'M' } }
    ]
};

const masterDataSlice = createSlice({
    name: 'masterData',
    initialState,
    reducers: {
        setMasterData: (state, action) => {
            const { key, data } = action.payload;
            state[key] = data;
        },
    },
});

export const { setMasterData } = masterDataSlice.actions;
export default masterDataSlice.reducer;
