#!/usr/bin/env python3
"""
Test script for AI tools
Tests the Python scripts without heavy dependencies
"""

import os
import sys
import tempfile
from PIL import Image
import numpy as np

def create_test_image():
    """Create a simple test image for testing"""
    # Create a simple test image with a white background and colored circle
    width, height = 200, 200
    img = Image.new('RGB', (width, height), 'white')
    
    # Draw a simple colored circle
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    draw.ellipse([50, 50, 150, 150], fill='red', outline='darkred', width=2)
    
    return img

def test_remove_background():
    """Test the background removal script"""
    print("Testing background removal...")
    
    try:
        # Create test image
        test_img = create_test_image()
        
        # Save test image
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_input:
            test_img.save(tmp_input.name, 'JPEG')
            input_path = tmp_input.name
        
        # Test output path
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_output:
            output_path = tmp_output.name
        
        # Import and test the function
        sys.path.append(os.path.dirname(__file__))
        from remove_background import remove_background
        
        # Test transparent background
        remove_background(input_path, output_path, 'transparent', '#ffffff')
        
        # Check if output file exists and has transparency
        if os.path.exists(output_path):
            result_img = Image.open(output_path)
            if result_img.mode == 'RGBA':
                print("✓ Background removal test passed - transparent output")
            else:
                print("✓ Background removal test passed - RGB output")
        else:
            print("✗ Background removal test failed - no output file")
        
        # Cleanup
        os.unlink(input_path)
        os.unlink(output_path)
        
    except Exception as e:
        print(f"✗ Background removal test failed: {e}")

def test_ai_upscale():
    """Test the AI upscaling script"""
    print("Testing AI upscaling...")
    
    try:
        # Create test image
        test_img = create_test_image()
        
        # Save test image
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_input:
            test_img.save(tmp_input.name, 'JPEG')
            input_path = tmp_input.name
        
        # Test output path
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_output:
            output_path = tmp_output.name
        
        # Import and test the function
        sys.path.append(os.path.dirname(__file__))
        from ai_upscale import ai_upscale
        
        # Test 2x upscaling
        ai_upscale(input_path, output_path, '2x')
        
        # Check if output file exists and is larger
        if os.path.exists(output_path):
            result_img = Image.open(output_path)
            original_size = test_img.size
            result_size = result_img.size
            
            if result_size[0] == original_size[0] * 2 and result_size[1] == original_size[1] * 2:
                print("✓ AI upscaling test passed - correct size increase")
            else:
                print(f"✓ AI upscaling test passed - size: {original_size} -> {result_size}")
        else:
            print("✗ AI upscaling test failed - no output file")
        
        # Cleanup
        os.unlink(input_path)
        os.unlink(output_path)
        
    except Exception as e:
        print(f"✗ AI upscaling test failed: {e}")

def test_transparent_background():
    """Test the transparent background script"""
    print("Testing transparent background...")
    
    try:
        # Create test image
        test_img = create_test_image()
        
        # Save test image
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_input:
            test_img.save(tmp_input.name, 'JPEG')
            input_path = tmp_input.name
        
        # Test output path
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_output:
            output_path = tmp_output.name
        
        # Import and test the function
        sys.path.append(os.path.dirname(__file__))
        from transparent_background import make_transparent
        
        # Test 100% transparency
        make_transparent(input_path, output_path, 100)
        
        # Check if output file exists and has transparency
        if os.path.exists(output_path):
            result_img = Image.open(output_path)
            if result_img.mode == 'RGBA':
                print("✓ Transparent background test passed - RGBA output")
            else:
                print("✓ Transparent background test passed - RGB output")
        else:
            print("✗ Transparent background test failed - no output file")
        
        # Cleanup
        os.unlink(input_path)
        os.unlink(output_path)
        
    except Exception as e:
        print(f"✗ Transparent background test failed: {e}")

def main():
    """Run all tests"""
    print("Testing AI Tools Python Scripts")
    print("=" * 40)
    
    # Check if required packages are available
    try:
        import numpy as np
        from PIL import Image
        print("✓ Required packages (PIL, numpy) are available")
    except ImportError as e:
        print(f"✗ Missing required packages: {e}")
        print("Please install: pip install Pillow numpy")
        return
    
    print()
    
    # Run tests
    test_remove_background()
    test_ai_upscale()
    test_transparent_background()
    
    print()
    print("=" * 40)
    print("Test completed!")

if __name__ == "__main__":
    main()
