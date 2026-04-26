import re
import os

config_path = 'tailwind.config.mjs'
with open(config_path, 'r') as f:
    config = f.read()

# Extract hex colors inside colors block
pattern = re.compile(r'\"([a-z0-9\-]+)\":\s*\"(#[a-fA-F0-9]+)\"')
matches = pattern.findall(config)

new_config = config
css_vars = []

for name, hex_val in matches:
    new_config = new_config.replace(f'"{name}": "{hex_val}"', f'"{name}": "var(--color-{name}, {hex_val})"')

# Define dark mode inverted equivalents manually for keys that matter
dark_overrides = {
    'background': '#111418',
    'surface': '#111418',
    'surface-bright': '#1c2126',
    'surface-dim': '#0a0d11',
    'surface-variant': '#283038',
    'surface-container-lowest': '#05070a',
    'surface-container-low': '#0d1014',
    'surface-container': '#111418',
    'surface-container-high': '#1c2126',
    'surface-container-highest': '#283038',
    'on-surface': '#e2e4e9',
    'on-background': '#e2e4e9',
    'on-surface-variant': '#b0b7c1',
    'outline': '#7c8591',
    'outline-variant': '#3a424a',
    'primary-container': '#8bd2ae',
    'on-primary-container': '#002113',
    'error-container': '#93000a',
    'on-error-container': '#ffdad6',
}

css_injections = '\n'.join([f'    --color-{k}: {v};' for k, v in dark_overrides.items()])

with open(config_path, 'w') as f:
    f.write(new_config)

# Update globals.css
css_path = 'app/globals.css'
with open(css_path, 'r') as f:
    css = f.read()

css = re.sub(r'\.dark\s*\{[^}]*\}', f'.dark {{\n{css_injections}\n  }}', css)

with open(css_path, 'w') as f:
    f.write(css)

print('Success')
