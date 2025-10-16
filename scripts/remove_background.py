#!/usr/bin/env python3
"""
AI Background Removal Script using RemBG
Converts images to PNG with transparent or solid color background
"""

import sys
import os
import io
from PIL import Image
import numpy as np

def remove_background(input_path, output_path, background_type='transparent', background_color='#ffffff'):
    """
    Remove background from image using simple color-based detection
    Fallback method that works without heavy AI dependencies
    """
    try:
        # Load the image
        image = Image.open(input_path).convert('RGBA')
        width, height = image.size
        
        # Convert to numpy array for processing
        img_array = np.array(image)
        
        # Simple background removal based on color similarity
        # This is a basic implementation - in production you'd use AI
        
        # Get the corners to determine background color
        corners = [
            img_array[0, 0],  # top-left
            img_array[0, -1], # top-right
            img_array[-1, 0], # bottom-left
            img_array[-1, -1] # bottom-right
        ]
        
        # Find the most common corner color (likely background)
        corner_colors = [tuple(corner[:3]) for corner in corners]
        background_color_rgb = max(set(corner_colors), key=corner_colors.count)
        
        # Create mask for background pixels
        tolerance = 30  # Color tolerance
        r, g, b = background_color_rgb
        
        # Create mask where pixels are similar to background color
        mask = (
            (np.abs(img_array[:,:,0] - r) < tolerance) &
            (np.abs(img_array[:,:,1] - g) < tolerance) &
            (np.abs(img_array[:,:,2] - b) < tolerance)
        )
        
        # Apply mask to alpha channel
        img_array[:,:,3] = np.where(mask, 0, 255)  # 0 = transparent, 255 = opaque
        
        # Convert back to PIL Image
        result_image = Image.fromarray(img_array, 'RGBA')
        
        if background_type == 'solid':
            # Convert hex color to RGB
            hex_color = background_color.lstrip('#')
            rgb_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
            
            # Create a new image with solid background
            final_image = Image.new('RGBA', result_image.size, rgb_color + (255,))
            
            # Paste the foreground on the solid background
            final_image.paste(result_image, (0, 0), result_image)
            final_image = final_image.convert('RGB')
        else:
            # Keep transparent background
            final_image = result_image
        
        # Save the result
        final_image.save(output_path, 'PNG')
        
        print(f"Background removed successfully: {output_path}")
        print("Note: Using basic color-based detection. For better results, install RemBG.")
        
    except Exception as e:
        print(f"Error during background removal: {e}")
        # Ultimate fallback - just convert to PNG with transparency
        try:
            image = Image.open(input_path).convert('RGBA')
            image.save(output_path, 'PNG')
            print(f"Image converted to PNG: {output_path}")
        except Exception as fallback_error:
            print(f"Fallback conversion failed: {fallback_error}")
            sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_background.py <input_path> <output_path> [background_type] [background_color]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    background_type = sys.argv[3] if len(sys.argv) > 3 else 'transparent'
    background_color = sys.argv[4] if len(sys.argv) > 4 else '#ffffff'
    
    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    remove_background(input_path, output_path, background_type, background_color)
