<?php

namespace Database\Seeders;

use App\Models\Kurikulum;
use App\Models\ProgramStudi;
use App\Models\StandarKurikulum;
use App\Models\StandarMutu;
use App\Models\TahunAkademik;
use Illuminate\Database\Seeder;

class MasterCurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Program Studi
        $prodiTi = ProgramStudi::firstOrCreate(
            ['nama_prodi' => 'Teknik Informatika'],
            [
                'jenjang' => 'S1',
                'nama_fakultas' => 'Ilmu Komputer',
                'akreditasi_nasional' => 'Unggul'
            ]
        );

        $prodiSi = ProgramStudi::firstOrCreate(
            ['nama_prodi' => 'Sistem Informasi'],
            [
                'jenjang' => 'S1',
                'nama_fakultas' => 'Ilmu Komputer',
                'akreditasi_nasional' => 'Baik Sekali'
            ]
        );

        // 2. Standar Kurikulum
        $skObe = StandarKurikulum::firstOrCreate(
            ['singkatan' => 'OBE'],
            [
                'nama' => 'Outcome-Based Education',
                'deskripsi' => 'Kurikulum Berbasis Luaran sesuai standar SN-Dikti'
            ]
        );

        $skKkni = StandarKurikulum::firstOrCreate(
            ['singkatan' => 'KKNI'],
            [
                'nama' => 'Kerangka Kualifikasi Nasional Indonesia',
                'deskripsi' => 'Kurikulum berbasis KKNI Level 6 untuk S1'
            ]
        );

        // 3. Standar Mutu
        $smIabee = StandarMutu::firstOrCreate(
            ['singkatan' => 'IABEE'],
            [
                'nama' => 'Indonesian Accreditation Board for Engineering Education',
                'deskripsi' => 'Standar akreditasi internasional bidang keteknikan'
            ]
        );

        $smAsiin = StandarMutu::firstOrCreate(
            ['singkatan' => 'ASIIN'],
            [
                'nama' => 'Akkreditierungsagentur für Studiengänge der Ingenieurwissenschaften',
                'deskripsi' => 'Standar akreditasi internasional dari Jerman'
            ]
        );

        // 4. Manajemen Kurikulum
        $kurikulumTi = Kurikulum::firstOrCreate(
            ['nama_kurikulum' => 'Kurikulum S1 Teknik Informatika 2024 (OBE)'],
            [
                'program_studi_id' => $prodiTi->id,
                'standar_kurikulum_id' => $skObe->id,
                'is_active' => true,
                'tahun_berlaku' => 2024,
                'visi' => 'Menjadi program studi unggul berbasis OBE.'
            ]
        );
        $kurikulumTi->standarMutus()->syncWithoutDetaching([$smIabee->id, $smAsiin->id]);

        $kurikulumSi = Kurikulum::firstOrCreate(
            ['nama_kurikulum' => 'Kurikulum S1 Sistem Informasi 2024 (OBE)'],
            [
                'program_studi_id' => $prodiSi->id,
                'standar_kurikulum_id' => $skObe->id,
                'is_active' => true,
                'tahun_berlaku' => 2024,
                'visi' => 'Menjadi program studi sistem informasi yang inovatif.'
            ]
        );
        $kurikulumSi->standarMutus()->syncWithoutDetaching([$smIabee->id]);

        // 5. Tahun Akademik
        TahunAkademik::firstOrCreate(
            ['tahun_akademik' => '2024/2025', 'semester' => 'Ganjil'],
            ['is_active' => false]
        );
        TahunAkademik::firstOrCreate(
            ['tahun_akademik' => '2024/2025', 'semester' => 'Genap'],
            ['is_active' => true]
        );
    }
}
