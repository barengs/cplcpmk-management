import os
import glob

models_dir = 'app/Models'

files = glob.glob(os.path.join(models_dir, '*.php'))
for f in files:
    with open(f, 'r') as file:
        content = file.read()
    if 'protected $guarded' not in content:
        content = content.replace('use HasFactory;', 'use HasFactory;\n    protected $guarded = [];')
        with open(f, 'w') as file:
            file.write(content)
