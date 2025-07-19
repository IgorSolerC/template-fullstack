from pathlib import Path
from importlib import import_module

# Get the path to the current directory (app/models)
package_dir = Path(__file__).resolve().parent

# Iterate over all .py files in the directory, except __init__.py itself
for module_file in package_dir.glob("*.py"):
    if module_file.name != "__init__.py":
        # Convert the file path to a module path that can be imported
        # e.g., '.../app/models/user.py' -> 'app.models.user'
        module_name = f"app.models.{module_file.stem}"
        
        # Import the module dynamically
        import_module(module_name)