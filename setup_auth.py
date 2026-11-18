import re

auth_file = 'config/auth.php'
with open(auth_file, 'r') as f:
    content = f.read()

# Laravel 11/12 auth.php structure usually has 'web' guard. Let's add API guard if missing.
api_guard = """'api' => [
            'driver' => 'jwt',
            'provider' => 'users',
        ],
"""
if "'api' => [" not in content:
    content = content.replace("'guards' => [", "'guards' => [\n        " + api_guard)
else:
    # If exists, replace driver with jwt
    content = re.sub(r"'api' => \[\s*'driver' => '.*?',", "'api' => [\n            'driver' => 'jwt',", content)

with open(auth_file, 'w') as f:
    f.write(content)
