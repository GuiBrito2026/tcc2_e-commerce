"""Compatibility entrypoint for the deterministic computer-accessories fixtures."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name("catalog-fixtures.py")), run_name="__main__")
