import os
import re

base_dir = '/home/hksaikia/Desktop/Work/Website/kisan_kamai_v1'

def fix_jsx_in_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Common SVG attribute fixes
    replacements = {
        r'stroke-width=': 'strokeWidth=',
        r'stroke-linecap=': 'strokeLinecap=',
        r'stroke-linejoin=': 'strokeLinejoin=',
        r'fill-rule=': 'fillRule=',
        r'clip-rule=': 'clipRule=',
        r'stroke-miterlimit=': 'strokeMiterlimit=',
        # other common hyphenated attributes
        r'clip-path=': 'clipPath=',
        r'xmlns:xlink=': 'xmlnsXlink=',
        r'href=': 'href=', # not an error, just being safe
        r'data-icon=': 'data-icon=', # data-* are valid
        r'style="([^"]*)"': lambda m: "style={{" + m.group(1).replace(";", ",") + "}}" # Just in case it missed some styles
    }
    
    modified = content
    for pattern, repl in replacements.items():
        if callable(repl):
            continue # I won't do the style one again because it was done in convert.py
        modified = re.sub(pattern, repl, modified)

    # Some of the templates injected 'data-icon="home"' which is valid JSX.
    
    if modified != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Fixed JSX inside {filepath}")

for root, dirs, files in os.walk(base_dir):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.tsx'):
            fix_jsx_in_file(os.path.join(root, file))

print("JSX Fix phase complete")
