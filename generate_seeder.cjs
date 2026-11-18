const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('PENYUSUNAN PL-CPL TI FINAL.xlsx');

// 1. Profil Lulusan
let plData = [];
if (wb.Sheets['1. Profil Lulusan']) {
    const data = xlsx.utils.sheet_to_json(wb.Sheets['1. Profil Lulusan'], {header: 1});
    for (const row of data) {
        if (row[1] && row[1].toString().startsWith('PL')) {
            plData.push({
                kode_pl: row[1].toString().trim(),
                deskripsi: row[2] ? row[2].toString().trim().replace(/'/g, "\\'") : '',
                kategori: row[3] ? row[3].toString().trim().replace(/'/g, "\\'") : '',
                profesi: row[5] ? row[5].toString().trim().replace(/'/g, "\\'") : ''
            });
        }
    }
}

// 3. CPL
let cplData = [];
if (wb.Sheets['3. CPL Prodi']) {
    const data = xlsx.utils.sheet_to_json(wb.Sheets['3. CPL Prodi'], {header: 1});
    for (const row of data) {
        if (row[1] && row[1].toString().startsWith('CPL')) {
            cplData.push({
                kode_cpl: row[1].toString().trim(),
                deskripsi: row[2] ? row[2].toString().trim().replace(/'/g, "\\'") : ''
            });
        }
    }
}

// 6. BK
let bkData = [];
if (wb.Sheets['6. Bahan Kajian']) {
    const data = xlsx.utils.sheet_to_json(wb.Sheets['6. Bahan Kajian'], {header: 1});
    for (const row of data) {
        if (row[1] && row[1].toString().startsWith('BK')) {
            bkData.push({
                kode_bk: row[1].toString().trim(),
                nama_bk: row[2] ? row[2].toString().trim().replace(/'/g, "\\'") : '',
                deskripsi_bk: ''
            });
        }
    }
}

// 11. Mata Kuliah
let mkData = [];
let mkMap = {};
if (wb.Sheets['11. Susunan Mata Kuliah']) {
    const data = xlsx.utils.sheet_to_json(wb.Sheets['11. Susunan Mata Kuliah'], {header: 1});
    for (const row of data) {
        if (row[1] && typeof row[1] === 'string' && row[1].length > 4 && row[0] && typeof row[0] === 'number') {
            const kode = row[1].toString().trim();
            const nama = row[2] ? row[2].toString().trim().replace(/'/g, "\\'") : '';
            const sks = parseInt(row[3]) || 2;
            const nonNullItems = row.filter(i => i !== undefined && i !== null);
            let semString = nonNullItems[nonNullItems.length - 1];
            let sem = 1;
            if (semString === 'I') sem = 1;
            else if (semString === 'II') sem = 2;
            else if (semString === 'III') sem = 3;
            else if (semString === 'IV') sem = 4;
            else if (semString === 'V') sem = 5;
            else if (semString === 'VI') sem = 6;
            else if (semString === 'VII') sem = 7;
            else if (semString === 'VIII') sem = 8;
            else if (typeof semString === 'number') sem = semString;
            
            if (!mkMap[kode]) {
                mkMap[kode] = true;
                mkData.push({
                    kode_mk: kode,
                    nama_mk: nama,
                    sks_teori: sks,
                    sks_praktek: 0,
                    semester_plot: sem
                });
            }
        }
    }
}

// 9. CPL-MK
let cplMkData = [];
if (wb.Sheets['9. CPL-MK']) {
    const data = xlsx.utils.sheet_to_json(wb.Sheets['9. CPL-MK'], {header: 1});
    let cplHeaders = [];
    if (data[1]) {
        for (let i = 3; i < data[1].length; i++) {
            if (data[1][i] && data[1][i].toString().startsWith('CPL')) {
                cplHeaders[i] = data[1][i].toString().trim();
            }
        }
    }
    
    for (let i = 2; i < data.length; i++) {
        const row = data[i];
        if (row[1] && typeof row[1] === 'string' && row[1].length > 4 && row[0]) {
            const kodeMk = row[1].toString().trim();
            for (let j = 3; j < row.length; j++) {
                if (row[j] && (row[j].toString().toLowerCase() === 'v' || row[j].toString().toLowerCase() === 'm' || row[j].toString().toLowerCase() === 's')) {
                    if (cplHeaders[j]) {
                        cplMkData.push({
                            kode_mk: kodeMk,
                            kode_cpl: cplHeaders[j],
                            tingkat: 'S' // Default
                        });
                    }
                }
            }
        }
    }
}

const seederCode = `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Facades\\Schema;
use App\\Models\\ProfilLulusan;
use App\\Models\\CplProdi;
use App\\Models\\BahanKajian;
use App\\Models\\MataKuliah;

class ExcelDataSeeder extends Seeder
{
    public function run()
    {
        // Truncate existing
        Schema::disableForeignKeyConstraints();
        ProfilLulusan::truncate();
        CplProdi::truncate();
        BahanKajian::truncate();
        MataKuliah::truncate();
        DB::table('map_mk_cpl')->truncate();
        Schema::enableForeignKeyConstraints();

        $pl = [
${plData.map(p => `            ['kode_pl' => '${p.kode_pl}', 'deskripsi' => '${p.deskripsi}', 'kategori' => '${p.kategori}', 'profesi' => '${p.profesi}']`).join(',\n')}
        ];
        foreach ($pl as $item) ProfilLulusan::create($item);

        $cpl = [
${cplData.map(p => `            ['kode_cpl' => '${p.kode_cpl}', 'deskripsi' => '${p.deskripsi}']`).join(',\n')}
        ];
        $cplMap = [];
        foreach ($cpl as $item) {
            $m = CplProdi::create($item);
            $cplMap[$m->kode_cpl] = $m->id;
        }

        $bk = [
${bkData.map(p => `            ['kode_bk' => '${p.kode_bk}', 'nama_bahan_kajian' => '${p.nama_bk}', 'deskripsi' => '${p.deskripsi_bk}']`).join(',\n')}
        ];
        foreach ($bk as $item) BahanKajian::create($item);

        $mk = [
${mkData.map(p => `            ['kode_mk' => '${p.kode_mk}', 'nama_mk' => '${p.nama_mk}', 'sks_teori' => ${p.sks_teori}, 'sks_praktek' => ${p.sks_praktek}, 'semester_plot' => ${p.semester_plot}]`).join(',\n')}
        ];
        $mkMap = [];
        foreach ($mk as $item) {
            $m = MataKuliah::create($item);
            $mkMap[$m->kode_mk] = $m->id;
        }

        $cplMk = [
${cplMkData.map(p => `            ['kode_mk' => '${p.kode_mk}', 'kode_cpl' => '${p.kode_cpl}', 'tingkat' => '${p.tingkat}']`).join(',\n')}
        ];
        foreach ($cplMk as $rel) {
            if (isset($mkMap[$rel['kode_mk']]) && isset($cplMap[$rel['kode_cpl']])) {
                DB::table('map_mk_cpl')->insert([
                    'mk_id' => $mkMap[$rel['kode_mk']],
                    'cpl_prodi_id' => $cplMap[$rel['kode_cpl']],
                    'bobot_pembebanan' => 1.0
                ]);
            }
        }
    }
}
`;

fs.writeFileSync('database/seeders/ExcelDataSeeder.php', seederCode);
console.log('Seeder created: database/seeders/ExcelDataSeeder.php');
