#!/usr/bin/env python3
"""
Transparent Background Script using RemBG
Makes image backgrounds transparent with adjustable transparency levels
"""

import sys
import os
import io
from PIL import Image
import numpy as np

def make_transparent(input_path, output_path, transparency_level=100):
    """
    Make image background transparent using simple color-based detection
    
    Args:
        input_path (str): Path to input image
        output_path (str): Path to output image
        transparency_level (int): 0-100, where 100 is fully transparent
    """
    try:
        # Load the image
        image = Image.open(input_path).convert('RGBA')
        width, height = image.size
        
        # Convert to numpy array for processing
        data = np.array(image)
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        
        # Simple background detection based on corner colors
        # Get the corners to determine background color
        corners = [
            data[0, 0],      # top-left
            data[0, -1],     # top-right
            data[-1, 0],     # bottom-left
            data[-1, -1]     # bottom-right
        ]
        
        # Find the most common corner color (likely background)
        corner_colors = [tuple(corner[:3]) for corner in corners]
        background_color_rgb = max(set(corner_colors), key=corner_colors.count)
        
        # Create mask for background pixels
        tolerance = 30  # Color tolerance
        bg_r, bg_g, bg_b = background_color_rgb
        
        # Create mask where pixels are similar to background color
        background_mask = (
            (np.abs(r - bg_r) < tolerance) &
            (np.abs(g - bg_g) < tolerance) &
            (np.abs(b - bg_b) < tolerance)
        )
        
        # Convert transparency level to alpha value (0-255)
        alpha_value = int((transparency_level / 100) * 255)
        
        if transparency_level < 100:
            # Apply transparency to background pixels
            new_alpha = np.where(background_mask, alpha_value, 255)
            data[:,:,3] = new_alpha
        else:
            # Make background completely transparent
            data[:,:,3] = np.where(background_mask, 0, 255)
        
        # Convert back to PIL Image
        result_image = Image.fromarray(data, 'RGBA')
        
        # Save the result
        result_image.save(output_path, 'PNG')
        
        print(f"Background made transparent successfully: {output_path}")
        print(f"Transparency level: {transparency_level}%")
        print("Note: Using basic color-based detection. For better results, install RemBG.")
        
    except Exception as e:
        print(f"Error during transparency processing: {e}")
        # Ultimate fallback - just convert to PNG with basic transparency
        try:
            image = Image.open(input_path).convert('RGBA')
            
            # Simple white background removal
            data = np.array(image)
            r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
            
            # Create mask for white/light background
            white_mask = (r > 240) & (g > 240) & (b > 240)
            
            # Apply transparency
            alpha_value = int((transparency_level / 100) * 255)
            new_alpha = np.where(white_mask, alpha_value, 255)
            data[:,:,3] = new_alpha
            
            result_image = Image.fromarray(data, 'RGBA')
            result_image.save(output_path, 'PNG')
            print(f"Background made transparent with fallback method: {output_path}")
            
        except Exception as fallback_error:
            print(f"Fallback transparency failed: {fallback_error}")
            sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python transparent_background.py <input_path> <output_path> [transparency_level]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    transparency_level = int(sys.argv[3]) if len(sys.argv) > 3 else 100
    
    # Validate transparency level
    if not 0 <= transparency_level <= 100:
        print("Transparency level must be between 0 and 100")
        sys.exit(1)
    
    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    make_transparent(input_path, output_path, transparency_level)
