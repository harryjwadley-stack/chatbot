import os, sys
project_home = os.path.expanduser('~/random_api')  # adjust to your folder
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# activate venv
activate_this = os.path.expanduser('~/random_api/venv/bin/activate_this.py')
with open(activate_this) as f:
    exec(f.read(), {'__file__': activate_this})

from app import app as application
