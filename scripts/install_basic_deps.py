#!/usr/bin/env python3
"""
Install basic dependencies for AI tools
Only installs essential packages that work without heavy AI models
"""

import subprocess
import sys
import os

def install_package(package):
    """Install a Python package using pip"""
    try:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✓ Successfully installed {package}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install {package}: {e}")
        return False

def main():
    """Install basic packages for AI tools"""
    print("Installing basic dependencies for AI tools...")
    print("=" * 50)
    
    # Basic packages that work without heavy AI models
    basic_packages = [
        "Pillow>=9.0.0",
        "numpy>=1.20.0",
        "scipy>=1.7.0"
    ]
    
    print("Installing basic packages...")
    success_count = 0
    for package in basic_packages:
        if install_package(package):
            success_count += 1
    
    print(f"\nBasic packages: {success_count}/{len(basic_packages)} installed successfully")
    
    print("\n" + "=" * 50)
    print("Basic setup complete!")
    print("\nAI tools will now work with basic functionality:")
    print("  - Background removal (color-based detection)")
    print("  - Image upscaling (high-quality interpolation)")
    print("  - Transparent backgrounds (color-based detection)")
    print("\nFor advanced AI features, you can install RemBG later:")
    print("  pip install rembg")

if __name__ == "__main__":
    main()
