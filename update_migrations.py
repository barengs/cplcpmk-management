import os
import glob

migrations_dir = 'database/migrations'

def replace_in_file(glob_pattern, target, replacement):
    files = glob.glob(os.path.join(migrations_dir, glob_pattern))
    for f in files:
        with open(f, 'r') as file:
            content = file.read()
        content = content.replace(target, replacement)
        with open(f, 'w') as file:
            file.write(content)

# users
replace_in_file('*create_users_table.php', 
    "$table->string('name');", 
    "$table->string('name');\n            $table->string('gelar_depan')->nullable();\n            $table->string('gelar_belakang')->nullable();\n            $table->string('nidn')->nullable();\n            $table->string('ttd_path')->nullable();\n            $table->boolean('is_active')->default(true);")

base_target = "            $table->id();\n            $table->timestamps();"

# profil_lulusans
replace_in_file('*create_profil_lulusans_table.php', base_target,
    base_target + """
            $table->string('kode_pl')->unique();
            $table->text('deskripsi');
            $table->string('kategori')->nullable();
            $table->string('profesi')->nullable();""")

# cpl_sn_diktis
replace_in_file('*create_cpl_sn_diktis_table.php', base_target,
    base_target + """
            $table->string('kode_cpl_sn')->unique();
            $table->text('deskripsi');
            $table->string('kategori');""")

# cpl_prodis
replace_in_file('*create_cpl_prodis_table.php', base_target,
    base_target + """
            $table->string('kode_cpl')->unique();
            $table->text('deskripsi');""")

# bahan_kajians
replace_in_file('*create_bahan_kajians_table.php', base_target,
    base_target + """
            $table->string('kode_bk')->unique();
            $table->string('nama_bahan_kajian');
            $table->text('deskripsi')->nullable();""")

# rumpun_mks
replace_in_file('*create_rumpun_mks_table.php', base_target,
    base_target + """
            $table->string('nama_rumpun');
            $table->foreignId('koordinator_id')->nullable()->constrained('users')->onDelete('set null');""")

# mata_kuliahs
replace_in_file('*create_mata_kuliahs_table.php', base_target,
    base_target + """
            $table->string('kode_mk')->unique();
            $table->string('nama_mk');
            $table->foreignId('rumpun_id')->nullable()->constrained('rumpun_mks')->onDelete('set null');
            $table->integer('sks_teori')->default(0);
            $table->integer('sks_praktek')->default(0);
            $table->integer('semester_plot');
            $table->text('deskripsi_singkat')->nullable();
            $table->json('prasyarat_mk_ids')->nullable();""")

# cpmks
replace_in_file('*create_cpmks_table.php', base_target,
    base_target + """
            $table->string('kode_cpmk');
            $table->foreignId('mk_id')->constrained('mata_kuliahs')->onDelete('cascade');
            $table->text('deskripsi_cpmk');""")

# sub_cpmks
replace_in_file('*create_sub_cpmks_table.php', base_target,
    base_target + """
            $table->string('kode_sub_cpmk');
            $table->foreignId('cpmk_id')->constrained('cpmks')->onDelete('cascade');
            $table->text('deskripsi_sub_cpmk');
            $table->string('level_taksonomi')->nullable();""")

# rps_dokumens
replace_in_file('*create_rps_dokumens_table.php', base_target,
    base_target + """
            $table->foreignId('mk_id')->constrained('mata_kuliahs')->onDelete('cascade');
            $table->string('tahun_akademik');
            $table->enum('semester_pelaksanaan', ['Ganjil', 'Genap']);
            $table->date('tgl_penyusunan');
            $table->foreignId('pengembang_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('koordinator_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('kaprodi_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['Draft', 'Reviewed', 'Approved'])->default('Draft');""")

# rps_mingguans
replace_in_file('*create_rps_mingguans_table.php', base_target,
    base_target + """
            $table->foreignId('rps_id')->constrained('rps_dokumens')->onDelete('cascade');
            $table->integer('minggu_ke');
            $table->json('sub_cpmk_ids')->nullable();
            $table->text('bahan_kajian');
            $table->string('bentuk_metode_pembelajaran');
            $table->text('pengalaman_belajar')->nullable();
            $table->integer('waktu_tm')->default(0);
            $table->integer('waktu_pt')->default(0);
            $table->integer('waktu_bm')->default(0);
            $table->string('media_pembelajaran')->nullable();
            $table->json('referensi_ids')->nullable();""")

# rps_asesmens
replace_in_file('*create_rps_asesmens_table.php', base_target,
    base_target + """
            $table->foreignId('rps_mingguan_id')->constrained('rps_mingguans')->onDelete('cascade');
            $table->text('indikator_penilaian');
            $table->string('teknik_penilaian');
            $table->text('kriteria_penilaian')->nullable();
            $table->decimal('bobot_persen', 5, 2)->default(0);""")

# rps_rubriks
replace_in_file('*create_rps_rubriks_table.php', base_target,
    base_target + """
            $table->foreignId('rps_id')->constrained('rps_dokumens')->onDelete('cascade');
            $table->enum('tipe_tugas', ['Individu', 'Kelompok', 'Proyek']);
            $table->string('dimensi_penilaian');
            $table->text('skala_1')->nullable();
            $table->text('skala_2')->nullable();
            $table->text('skala_3')->nullable();
            $table->text('skala_4')->nullable();
            $table->text('skala_5')->nullable();
            $table->decimal('bobot', 5, 2)->default(0);""")

# referensis
replace_in_file('*create_referensis_table.php', base_target,
    base_target + """
            $table->enum('kategori', ['Utama', 'Pendukung']);
            $table->string('penulis');
            $table->string('tahun', 4);
            $table->string('judul');
            $table->string('penerbit')->nullable();
            $table->string('url')->nullable();""")

# pivot_tables
replace_in_file('*create_pivot_tables.php', base_target,
    """
            Schema::create('map_pl_cpl_prodi', function (Blueprint $table) {
                $table->foreignId('pl_id')->constrained('profil_lulusans')->onDelete('cascade');
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
            });
            Schema::create('map_cpl_prodi_sndikti', function (Blueprint $table) {
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
                $table->foreignId('cpl_sn_dikti_id')->constrained('cpl_sn_diktis')->onDelete('cascade');
            });
            Schema::create('map_cpl_bk', function (Blueprint $table) {
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
                $table->foreignId('bk_id')->constrained('bahan_kajians')->onDelete('cascade');
            });
            Schema::create('map_mk_cpl', function (Blueprint $table) {
                $table->id();
                $table->foreignId('mk_id')->constrained('mata_kuliahs')->onDelete('cascade');
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
                $table->decimal('bobot_pembebanan', 5, 2)->default(0);
                $table->timestamps();
            });
            Schema::create('map_cpmk_cpl', function (Blueprint $table) {
                $table->foreignId('cpmk_id')->constrained('cpmks')->onDelete('cascade');
                $table->foreignId('cpl_prodi_id')->constrained('cpl_prodis')->onDelete('cascade');
            });
            Schema::create('rps_dosen_pengampu', function (Blueprint $table) {
                $table->foreignId('rps_id')->constrained('rps_dokumens')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            });
""")

replace_in_file('*create_pivot_tables.php', "Schema::dropIfExists('pivot_tables');",
    """
        Schema::dropIfExists('rps_dosen_pengampu');
        Schema::dropIfExists('map_cpmk_cpl');
        Schema::dropIfExists('map_mk_cpl');
        Schema::dropIfExists('map_cpl_bk');
        Schema::dropIfExists('map_cpl_prodi_sndikti');
        Schema::dropIfExists('map_pl_cpl_prodi');
""")

