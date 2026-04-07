import os
import re

def convert_to_tsx(html_path):
    if not os.path.exists(html_path):
        return None
        
    with open(html_path, 'r', encoding='utf-8') as f:
        text = f.read()
        
    body_match = re.search(r'<body[^>]*>(.*?)</body>', text, re.IGNORECASE | re.DOTALL)
    if not body_match:
        return None
        
    body_content = body_match.group(1)
    
    # Remove scripts and styles
    body_content = re.sub(r'<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>', '', body_content, flags=re.IGNORECASE)
    body_content = re.sub(r'<style\b[^<]*(?:(?!</style>)<[^<]*)*</style>', '', body_content, flags=re.IGNORECASE)
    
    # Close void tags: img, input, br, hr
    body_content = re.sub(r'<(img|input|br|hr)([^>]*?)(?<!/)>', r'<\1\2/>', body_content)
    
    # replace class= with className=
    body_content = re.sub(r'\bclass=', 'className=', body_content)
    # replace for= with htmlFor=
    body_content = re.sub(r'\bfor=', 'htmlFor=', body_content)
    
    def style_replacer(match):
        styles = match.group(1)
        jsx_styles = []
        for style in styles.split(';'):
            if not style.strip(): continue
            parts = style.split(':')
            if len(parts) >= 2:
                prop = parts[0].strip()
                prop = re.sub(r'-([a-z])', lambda x: x.group(1).upper().replace('-',''), prop)
                val = parts[1].strip()
                val = val.replace("'", "\\'") 
                jsx_styles.append(f"'{prop}': '{val}'")
        return "style={{" + ", ".join(jsx_styles) + "}}"

    body_content = re.sub(r'style="([^"]*)"', style_replacer, body_content)
    
    # Comments in JSX
    body_content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', body_content, flags=re.DOTALL)
    
    return body_content

base_dir = '/home/hksaikia/Desktop/Work/Website/kisan_kamai_v1'
export_dir = os.path.join(base_dir, 'FilesKisanKamai')

mappings = [
  {"file": '17.html', "dest": 'components/Header.tsx', "wrapper": lambda c: f'export const Header = () => {{\n  return (\n    <>\n{c}\n    </>\n  );\n}};\n' },
  {"file": '68.html', "dest": 'components/Footer.tsx', "wrapper": lambda c: f'export const Footer = () => {{\n  return (\n    <>\n{c}\n    </>\n  );\n}};\n' },
  {"file": '13.html', "dest": 'app/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function Home() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' },
  {"file": '112.html', "dest": 'app/rent-equipment/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function RentEquipment() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' },
  {"file": '118.html', "dest": 'app/list-equipment/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function ListEquipment() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' },
  {"file": '74.html', "dest": 'app/equipment/[slug]/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function EquipmentDetail() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' },
  {"file": '12.html', "dest": 'app/support/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function Support() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' },
  {"file": '4.html', "dest": 'app/faq/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function FAQ() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' },
  {"file": '80.html', "dest": 'app/about/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function About() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' },
  {"file": '27.html', "dest": 'app/mr/rent-equipment/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function MR_RentEquipment() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' },
  {"file": '41.html', "dest": 'app/mr/list-equipment/page.tsx', "wrapper": lambda c: f'import {{ Header }} from "@/components/Header";\nimport {{ Footer }} from "@/components/Footer";\n\nexport default function MR_ListEquipment() {{\n  return (\n    <div className="min-h-screen flex flex-col">\n      <Header />\n      <main className="flex-grow">\n{c}\n      </main>\n      <Footer />\n    </div>\n  );\n}}\n' }
]

for m in mappings:
    source_path = os.path.join(export_dir, m['file'])
    tsx_content = convert_to_tsx(source_path)
    if tsx_content is not None:
        dest_path = os.path.join(base_dir, m['dest'])
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        # Remove original headers/footers/navbars if it's a page and already imported
        if m['dest'].startswith('app/'):
            tsx_content = re.sub(r'<header[^>]*>.*?</header>', '', tsx_content, flags=re.IGNORECASE|re.DOTALL)
            tsx_content = re.sub(r'<footer[^>]*>.*?</footer>', '', tsx_content, flags=re.IGNORECASE|re.DOTALL)
            tsx_content = re.sub(r'<nav[^>]*>.*?</nav>', '', tsx_content, flags=re.IGNORECASE|re.DOTALL)
        
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(m['wrapper'](tsx_content))
        print("Converted", m['file'], "to", m['dest'])
    else:
        print("Skipped", m['file'])

print("Conversion script finished.")
