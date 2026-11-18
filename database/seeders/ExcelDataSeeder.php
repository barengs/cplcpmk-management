<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\ProfilLulusan;
use App\Models\CplProdi;
use App\Models\BahanKajian;
use App\Models\MataKuliah;

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
            ['kode_pl' => 'PL01', 'deskripsi' => 'Lulusan memiliki kemampuan menganalisis persoalan computing serta menerapkan prinsip-prinsip computing dan disiplin ilmu relevan lainnya untuk mengidentifikasi solusi bagi organisasi.', 'kategori' => 'P', 'profesi' => 'Programming and Software Development (Software Engineer, Web Developer, dll), 2. IT Mobility and Internet of Things (Cloud Computing Developer, Advance Mobile Computing), 3. Artificial Intelligence (AI Engineer), 4. Instruktur Dan Asisten Peneliti Bidang Informatika/Ilmu Komputer'],
            ['kode_pl' => 'PL02', 'deskripsi' => 'Lulusan memiliki kemampuan mendesain, mengimplementasi dan mengevaluasi solusi berbasis computing yang memenuhi kebutuhan pengguna dengan pendekatan yang sesuai.', 'kategori' => 'KK', 'profesi' => ''],
            ['kode_pl' => 'PL03', 'deskripsi' => 'Lulusan mampu bertindak dan menilai secara professional dan Mimiliki kepatuhan terhadap aspek legal, aspek sosial budaya dan etika profesi. Berasaskan ajaran ahlussunnah wal jamaah annadliyah.', 'kategori' => 'S', 'profesi' => ''],
            ['kode_pl' => 'PL04', 'deskripsi' => 'Lulusan mampu berpikir logis, kritis serta
sistematis dalam memanfaatkan ilmu pengetahuan informatika/ilmu komputer untuk menyelesaikan masalah nyata.', 'kategori' => 'KU', 'profesi' => '']
        ];
        foreach ($pl as $item) ProfilLulusan::create($item);

        $cpl = [
            ['kode_cpl' => 'CPL01', 'deskripsi' => 'Bertakwa kepada Tuhan Yang Maha Esa, taat hukum, dan disiplin dalam kehidupan bermasyarakat dan bernegara.'],
            ['kode_cpl' => 'CPL02', 'deskripsi' => 'Menunjukkan sikap profesional dalam bentuk Institusi/Universitas kepatuhan pada etika profesi, kemampuan bekerjasama dalam tim multidisiplin, pemahaman tentang pembelajaran sepanjang hayat, dan respon terhadap isu sosial dan perkembangan teknologi.'],
            ['kode_cpl' => 'CPL03', 'deskripsi' => 'Memiliki pengetahuan yang memadai terkait cara kerja sistem komputer dan mampu menerapkan/menggunakan berbagai algoritma/metode untuk memecahkan masalah pada suatu organisasi.'],
            ['kode_cpl' => 'CPL04', 'deskripsi' => 'Memiliki kompetensi untuk menganalisis persoalan computing yang kompleks untuk mengidentifikasi solusi pengelolaan proyek teknologi bidang informatika/ilmu komputer dengan mempertimbangkan wawasan perkembangan ilmu transdisiplin'],
            ['kode_cpl' => 'CPL05', 'deskripsi' => 'Menguasai konsep teoritis bidang pengetahuan Ilmu Komputer/Informatika dalam mendesain dan mensimulasikan aplikasi teknologi multi-platform yang relevan dengan kebutuhan industri dan masyarakat.'],
            ['kode_cpl' => 'CPL06', 'deskripsi' => 'Memiliki kemampuan (pengelolaan) manajerial tim dan kerja sama (team work ), manajemen diri, mampu berkomunikasi baik lisan maupun tertulis dengan baik dan mampu melakukan presentasi.'],
            ['kode_cpl' => 'CPL07', 'deskripsi' => 'Menyusun deskripsi saintifik hasil kajian implikasi pengembangan atau implementasi ilmu pengetahuan teknologi dalam bentuk skripsi atau laporan tugas akhir atau artikel ilmiah.'],
            ['kode_cpl' => 'CPL08', 'deskripsi' => 'Kemampuan mengimplementasi kebutuhan computing dengan mempertimbangkan berbagai metode/algoritma yang sesuai.'],
            ['kode_cpl' => 'CPL09', 'deskripsi' => 'Kemampuan menganalisis, merancang, membuat dan mengevaluasi user interface dan aplikasi interaktif dengan mempertimbangkan kebutuhan pengguna dan perkembangan ilmu transdisiplin.'],
            ['kode_cpl' => 'CPL10', 'deskripsi' => 'Kemampuan mendesain, mengimplementasi dan mengevaluasi solusi berbasis computing multi-platform yang memenuhi kebutuhankebutuhan computing pada sebuah organisasi.']
        ];
        $cplMap = [];
        foreach ($cpl as $item) {
            $m = CplProdi::create($item);
            $cplMap[$m->kode_cpl] = $m->id;
        }

        $bk = [
            ['kode_bk' => 'BK Penciri Utama  Bidang Infromatika', 'nama_bahan_kajian' => '', 'deskripsi' => ''],
            ['kode_bk' => 'BK01', 'nama_bahan_kajian' => 'Social Issues and Professional Practice', 'deskripsi' => ''],
            ['kode_bk' => 'BK02', 'nama_bahan_kajian' => 'Security Policy and Management', 'deskripsi' => ''],
            ['kode_bk' => 'BK03', 'nama_bahan_kajian' => 'Project Management', 'deskripsi' => ''],
            ['kode_bk' => 'BK04', 'nama_bahan_kajian' => 'User Experience Design', 'deskripsi' => ''],
            ['kode_bk' => 'BK05', 'nama_bahan_kajian' => 'Security Issues and Principles', 'deskripsi' => ''],
            ['kode_bk' => 'BK06', 'nama_bahan_kajian' => 'Data and Information Management', 'deskripsi' => ''],
            ['kode_bk' => 'BK07', 'nama_bahan_kajian' => 'Parallel and Distributed Computing', 'deskripsi' => ''],
            ['kode_bk' => 'BK08', 'nama_bahan_kajian' => 'Computer Networks', 'deskripsi' => ''],
            ['kode_bk' => 'BK09', 'nama_bahan_kajian' => 'Security Technology and Implementation', 'deskripsi' => ''],
            ['kode_bk' => 'BK10', 'nama_bahan_kajian' => 'Software Design', 'deskripsi' => ''],
            ['kode_bk' => 'BK11', 'nama_bahan_kajian' => 'Operating Systems', 'deskripsi' => ''],
            ['kode_bk' => 'BK12', 'nama_bahan_kajian' => 'Data Structures, Algorithms and Complexity', 'deskripsi' => ''],
            ['kode_bk' => 'BK13', 'nama_bahan_kajian' => 'Programming Languages', 'deskripsi' => ''],
            ['kode_bk' => 'BK14', 'nama_bahan_kajian' => 'Programming Fundamentals', 'deskripsi' => ''],
            ['kode_bk' => 'BK15', 'nama_bahan_kajian' => 'Computing Systems Fundamentals', 'deskripsi' => ''],
            ['kode_bk' => 'BK16', 'nama_bahan_kajian' => 'Architecture and Organization', 'deskripsi' => ''],
            ['kode_bk' => 'BK17', 'nama_bahan_kajian' => 'Graphics and Visualization', 'deskripsi' => ''],
            ['kode_bk' => 'BK18', 'nama_bahan_kajian' => 'Intelligent Systems', 'deskripsi' => ''],
            ['kode_bk' => 'BK19', 'nama_bahan_kajian' => 'Platform-based Development', 'deskripsi' => ''],
            ['kode_bk' => 'BK Penciri Pedukung Bidang Informatika/Ilmu Komputer**', 'nama_bahan_kajian' => '', 'deskripsi' => ''],
            ['kode_bk' => 'BK20', 'nama_bahan_kajian' => 'Computational Science', 'deskripsi' => ''],
            ['kode_bk' => 'BK21', 'nama_bahan_kajian' => 'Discrete Structures', 'deskripsi' => ''],
            ['kode_bk' => 'BK22', 'nama_bahan_kajian' => 'Human-Computer Interaction', 'deskripsi' => ''],
            ['kode_bk' => 'BK23', 'nama_bahan_kajian' => 'Information Assurance and Security', 'deskripsi' => ''],
            ['kode_bk' => 'BK24', 'nama_bahan_kajian' => 'Software Development Fundamentals', 'deskripsi' => ''],
            ['kode_bk' => 'BK25', 'nama_bahan_kajian' => 'Software Process', 'deskripsi' => ''],
            ['kode_bk' => 'BK26', 'nama_bahan_kajian' => 'Systems Analysis & Design', 'deskripsi' => ''],
            ['kode_bk' => 'BK27', 'nama_bahan_kajian' => 'Virtual System and sevice', 'deskripsi' => ''],
            ['kode_bk' => 'BK28', 'nama_bahan_kajian' => 'Software Quality, Verification and Validation', 'deskripsi' => ''],
            ['kode_bk' => 'BK29', 'nama_bahan_kajian' => 'Software Modeling and Analysis', 'deskripsi' => ''],
            ['kode_bk' => 'BK Penciri Utama SN Dikti', 'nama_bahan_kajian' => '', 'deskripsi' => ''],
            ['kode_bk' => 'BK30', 'nama_bahan_kajian' => 'Pengembangan Diri', 'deskripsi' => ''],
            ['kode_bk' => 'BK Penciri Utama Umum', 'nama_bahan_kajian' => '', 'deskripsi' => ''],
            ['kode_bk' => 'BK31', 'nama_bahan_kajian' => 'Metodologi Penelitian', 'deskripsi' => ''],
            ['kode_bk' => 'BK32', 'nama_bahan_kajian' => 'Lima Menara Ilmu', 'deskripsi' => ''],
            ['kode_bk' => 'BK33', 'nama_bahan_kajian' => 'Keindonesiaan', 'deskripsi' => ''],
            ['kode_bk' => 'BK34', 'nama_bahan_kajian' => 'Kepesantrenan', 'deskripsi' => ''],
            ['kode_bk' => 'BK35', 'nama_bahan_kajian' => 'Kemaduraan', 'deskripsi' => ''],
            ['kode_bk' => 'BK36', 'nama_bahan_kajian' => 'keaswajaan', 'deskripsi' => '']
        ];
        foreach ($bk as $item) BahanKajian::create($item);

        $mk = [
            ['kode_mk' => 'MBB020102', 'nama_mk' => 'KKN', 'sks_teori' => 4, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MBB020103', 'nama_mk' => 'Kerja Praktek', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020101', 'nama_mk' => 'Arsitektur Dan Organisasi Komputer', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020102', 'nama_mk' => 'Basis Data', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020104', 'nama_mk' => 'Sistem Operasi', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020105', 'nama_mk' => 'Pemrograman Berorientasi Objek', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020106', 'nama_mk' => 'PRAKTIKUM PEMPROGRAMAN BERORIENTASI OBJEK', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020108', 'nama_mk' => 'Rekayasa Perangkat Lunak', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020109', 'nama_mk' => 'Pemrograman basis data lanjut', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020110', 'nama_mk' => 'TECHNOPRENEURSHIP', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020111', 'nama_mk' => 'Analisis dan Perancangan Teknologi Informasi', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020112', 'nama_mk' => 'Jaringan Komputer', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020113', 'nama_mk' => 'PRAKTIKUM JARINGAN KOMPUTER', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020114', 'nama_mk' => 'Metodologi Penelitian', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020115', 'nama_mk' => 'Interaksi Manusia & Komputer', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020116', 'nama_mk' => 'Tugas Akhir', 'sks_teori' => 6, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020117', 'nama_mk' => 'Aplikasi SIG', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020122', 'nama_mk' => 'Mobile Programming lanjut', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020125', 'nama_mk' => 'PRAKTIKUM BASIS DATA', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020126', 'nama_mk' => 'PRAKTIKUM PEMPROGRAMAN WEB', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 1],
            ['kode_mk' => 'MKB020127', 'nama_mk' => 'Jairngan Komputer Tingkat Lanjut', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020128', 'nama_mk' => 'Pemrograman Web', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKB020130', 'nama_mk' => 'Etika dan Profesi', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKI1002', 'nama_mk' => 'Pendidikan Aswaja', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKI0003', 'nama_mk' => 'Kepesantrenan dan Kemaduraan', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKI0004', 'nama_mk' => 'Bahasa Inggris 1', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKI0006', 'nama_mk' => 'Literasi Digital', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKI-9005', 'nama_mk' => 'filsafat umum', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020101', 'nama_mk' => 'Algoritma Pemrograman 1', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020102', 'nama_mk' => 'PRAKTIKUM ALGORITMA DAN PEMPROGRAMAN 1', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020105', 'nama_mk' => 'Algoritma Pemrograman 2', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020106', 'nama_mk' => 'PRAKTIKUM ALGORITMA DAN PEMPROGRAMAN 2', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020108', 'nama_mk' => 'Matematika Komputasi 2', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020111', 'nama_mk' => 'Matematika Komputasi 3', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020112', 'nama_mk' => 'Struktur Data', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020113', 'nama_mk' => 'PRAKTIKUM STRUKTUR DATA', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020115', 'nama_mk' => 'Analisa Algoritma', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020116', 'nama_mk' => 'Data Mining', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020117', 'nama_mk' => 'Kecerdasan Buatan', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020120', 'nama_mk' => 'Grafika Komputer', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020121', 'nama_mk' => 'RISET OPERASI', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020123', 'nama_mk' => 'Sistem Infromasi Geografis', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020124', 'nama_mk' => 'Keamanan Sistem Cyber', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020126', 'nama_mk' => 'Bahasa Inggris Informatika 2', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020127', 'nama_mk' => 'Sistem cerdas', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020129', 'nama_mk' => 'Sistem Pendukung Keputusan', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020133', 'nama_mk' => 'Internet of Things', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020134', 'nama_mk' => 'Matematika Komputasi 1', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020135', 'nama_mk' => 'Digital Forensik', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020137', 'nama_mk' => 'Optimasi', 'sks_teori' => 3, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020144', 'nama_mk' => 'PRAKTIKUM MOBILE PROGRAMING', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKK020145', 'nama_mk' => 'Mobile Programing', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKN0001', 'nama_mk' => 'Pendidikan Agama Islam', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKN0002', 'nama_mk' => 'Pancasila', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKN0003', 'nama_mk' => 'Kewarganegaraan', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MKN0004', 'nama_mk' => 'Bahasa Indonesia', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5],
            ['kode_mk' => 'MPB020102', 'nama_mk' => 'Seminar Tugas Akhir', 'sks_teori' => 2, 'sks_praktek' => 0, 'semester_plot' => 5]
        ];
        $mkMap = [];
        foreach ($mk as $item) {
            $m = MataKuliah::create($item);
            $mkMap[$m->kode_mk] = $m->id;
        }

        $cplMk = [
            ['kode_mk' => 'MBB020102', 'kode_cpl' => 'CPL01', 'tingkat' => 'S'],
            ['kode_mk' => 'MBB020102', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MBB020102', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MBB020103', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MBB020103', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MBB020103', 'kode_cpl' => 'CPL07', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020101', 'kode_cpl' => 'CPL04', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020101', 'kode_cpl' => 'CPL05', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020102', 'kode_cpl' => 'CPL05', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020102', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020104', 'kode_cpl' => 'CPL03', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020104', 'kode_cpl' => 'CPL05', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020105', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020106', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020108', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020109', 'kode_cpl' => 'CPL05', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020109', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020110', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020110', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020110', 'kode_cpl' => 'CPL07', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020111', 'kode_cpl' => 'CPL04', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020111', 'kode_cpl' => 'CPL05', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020112', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020113', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020114', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020114', 'kode_cpl' => 'CPL07', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020115', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020116', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020116', 'kode_cpl' => 'CPL07', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020117', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020122', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020122', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020125', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020126', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020127', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020128', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020128', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020130', 'kode_cpl' => 'CPL01', 'tingkat' => 'S'],
            ['kode_mk' => 'MKB020130', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI1002', 'kode_cpl' => 'CPL01', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI1002', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI0003', 'kode_cpl' => 'CPL01', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI0003', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI0004', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI0004', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI0006', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI0006', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI-9005', 'kode_cpl' => 'CPL01', 'tingkat' => 'S'],
            ['kode_mk' => 'MKI-9005', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020101', 'kode_cpl' => 'CPL03', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020101', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020102', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020105', 'kode_cpl' => 'CPL03', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020105', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020106', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020108', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020108', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020111', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020111', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020112', 'kode_cpl' => 'CPL03', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020112', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020113', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020115', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020116', 'kode_cpl' => 'CPL03', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020116', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020117', 'kode_cpl' => 'CPL03', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020117', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020120', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020121', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020123', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020124', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020126', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020126', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020127', 'kode_cpl' => 'CPL03', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020127', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020129', 'kode_cpl' => 'CPL03', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020129', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020133', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020134', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020134', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020135', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020137', 'kode_cpl' => 'CPL08', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020144', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020145', 'kode_cpl' => 'CPL09', 'tingkat' => 'S'],
            ['kode_mk' => 'MKK020145', 'kode_cpl' => 'CPL10', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0001', 'kode_cpl' => 'CPL01', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0001', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0002', 'kode_cpl' => 'CPL01', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0002', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0003', 'kode_cpl' => 'CPL01', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0003', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0004', 'kode_cpl' => 'CPL02', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0004', 'kode_cpl' => 'CPL06', 'tingkat' => 'S'],
            ['kode_mk' => 'MKN0004', 'kode_cpl' => 'CPL07', 'tingkat' => 'S'],
            ['kode_mk' => 'MPB020102', 'kode_cpl' => 'CPL07', 'tingkat' => 'S']
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
