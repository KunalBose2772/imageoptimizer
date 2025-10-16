#!/usr/bin/env python3
"""
Setup script for AI tools dependencies
Installs required Python packages for AI image processing
"""

import subprocess
import sys
import os

def install_package(package):
    """Install a Python package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✓ Successfully installed {package}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install {package}: {e}")
        return False

def main():
    """Install all required packages for AI tools"""
    print("Setting up AI tools dependencies...")
    print("=" * 50)
    
    # Core packages
    packages = [
        "rembg==2.0.50",
        "Pillow==10.0.1", 
        "numpy==1.24.3",
        "scipy==1.11.3",
        "opencv-python-headless==4.8.1.78",
        "scikit-image==0.21.0",
        "python-multipart==0.0.6"
    ]
    
    # Optional packages for advanced features
    optional_packages = [
        "torch==2.0.1",
        "torchvision==0.15.2"
    ]
    
    print("Installing core packages...")
    success_count = 0
    for package in packages:
        if install_package(package):
            success_count += 1
    
    print(f"\nCore packages: {success_count}/{len(packages)} installed successfully")
    
    # Ask user if they want to install optional packages
    print("\nOptional packages for advanced AI features:")
    for package in optional_packages:
        print(f"  - {package}")
    
    install_optional = input("\nInstall optional packages? (y/N): ").lower().strip()
    
    if install_optional in ['y', 'yes']:
        print("\nInstalling optional packages...")
        optional_success = 0
        for package in optional_packages:
            if install_package(package):
                optional_success += 1
        print(f"Optional packages: {optional_success}/{len(optional_packages)} installed successfully")
    
    print("\n" + "=" * 50)
    print("Setup complete!")
    print("\nAI tools are now ready to use:")
    print("  - AI Background Remover")
    print("  - AI Image Upscaler") 
    print("  - Transparent Background")
    print("\nNote: First-time usage may take longer as AI models are downloaded.")

if __name__ == "__main__":
    main()
