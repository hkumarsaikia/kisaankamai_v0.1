import os
import re

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app'))

# Strict contextual image mappings (Priority Order matters)
images = [
    ('harvester', '/assets/generated/harvester_action.png'),
    ('combin', '/assets/generated/harvester_action.png'),
    ('rotavator', '/assets/generated/rotavator.png'),
    ('till', '/assets/generated/rotavator.png'),
    ('spray', '/assets/generated/sprayer.png'),
    ('water pump', '/assets/generated/water_pump.png'),
    ('pump', '/assets/generated/water_pump.png'),
    ('baler', '/assets/generated/baler_4k.png'),
    ('bale', '/assets/generated/baler_4k.png'),
    ('thresher', '/assets/generated/thresher_4k.png'),
    ('handshake', '/assets/generated/farmer_handshake.png'),
    ('yard', '/assets/generated/farm_yard.png'),
    ('dusk', '/assets/generated/farm_yard.png'),
    ('portrait', '/assets/generated/farmer_portrait.png'),
    ('face', '/assets/generated/farmer_portrait.png'),
    ('smiling', '/assets/generated/farmer_portrait.png'),
    ('rajesh', '/assets/generated/farmer_portrait.png'),
    ('sanjay', '/assets/generated/farmer_portrait.png'),
    ('vikas', '/assets/generated/farmer_portrait.png'),
    ('owner', '/assets/generated/farmer_portrait.png'),
    ('entrepreneur', '/assets/generated/modern_farm_tech.png'),
    ('tablet', '/assets/generated/modern_farm_tech.png'),
    ('dealer', '/assets/generated/modern_farm_tech.png'),
    ('plough', '/assets/generated/rotavator.png'),
    ('wheat', '/assets/generated/hero_tractor.png'),
    ('field', '/assets/generated/hero_tractor.png'),
    ('seeder', '/assets/generated/seed_drill.png'),
    ('drill', '/assets/generated/seed_drill.png'),
    ('trailer', '/assets/generated/trolley.png'),
    ('trolley', '/assets/generated/trolley.png'),
    ('tractor', '/assets/generated/hero_tractor.png')
]

default_image = '/assets/generated/hero_tractor.png'

def replace_images_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    modified = False
    for i, line in enumerate(lines):
        # We target all placeholder injections and fix them
        if '/assets/generated/' in line:
            
            # Search context precisely within Alt tags exclusively
            alt_match = re.search(r'alt="([^"]*)"', line, re.IGNORECASE)
            data_alt_match = re.search(r'data-alt="([^"]*)"', line, re.IGNORECASE)
            
            context = ""
            if alt_match: context += alt_match.group(1).lower() + " "
            if data_alt_match: context += data_alt_match.group(1).lower()

            # Next.js maps arrays via maps, context might be in code directly before/after (e.g. name: "Balers")
            if not context.strip():
                if i > 0: context += lines[i-1].lower() + " "
                if i < len(lines)-1: context += lines[i+1].lower() + " "
                if i > 1: context += lines[i-2].lower()

            replacement = default_image
            # Evaluate using strictly non-url semantic context
            for kw, img in images:
                if kw in context:
                    replacement = img
                    break
            
            # Replace the broken generic image with the rigorously checked variant (Array properties and src tags)
            new_line = re.sub(r'(src=|img:\s*|ownerImg:\s*)["\']/assets/generated/[^"\']*["\']', fr'\g<1>"{replacement}"', line)
            
            if new_line != lines[i]:
                lines[i] = new_line
                modified = True
                
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"Corrected context assignments in {os.path.relpath(filepath, base_dir)}")

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx'):
            replace_images_in_file(os.path.join(root, file))

print("Image Context Alignment Fix: Completely finished!")
