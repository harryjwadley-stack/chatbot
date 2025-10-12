import sys
import os

# Folder where your Flask file lives
project_home = '/home/harrywadley6'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import your Flask app
from random_number_app import app as application
