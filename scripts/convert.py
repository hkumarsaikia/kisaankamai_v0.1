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

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
export_dir = os.path.join(base_dir, 'extfiles')

# Generic page wrapper template
def wrap_page(c, name):
    return f'''import {{ Header }} from "@/components/Header";
import {{ Footer }} from "@/components/Footer";

export default function {name}() {{
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">
{c}
      </main>
      <Footer />
    </div>
  );
}}
'''

mappings = [
  {"file": 'pages (1).html', "dest": 'app/locations/[city]/page.tsx', "wrapper": lambda c: wrap_page(c, 'RegionalSearch')},
  {"file": 'pages (4).html', "dest": 'app/booking/[equipmentId]/page.tsx', "wrapper": lambda c: wrap_page(c, 'BookingFlow')},
  {"file": 'pages (5).html', "dest": 'app/locations/[city]/no-results/page.tsx', "wrapper": lambda c: wrap_page(c, 'NoResultsLoc')},
  {"file": 'pages (2).html', "dest": 'app/catalog/[slug]/page.tsx', "wrapper": lambda c: wrap_page(c, 'EquipmentDetail')},
  {"file": 'pages (3).html', "dest": 'app/catalog/[slug]/gallery/page.tsx', "wrapper": lambda c: wrap_page(c, 'EquipmentDetailVariant')},
  {"file": 'pages (6).html', "dest": 'app/list-equipment/page.tsx', "wrapper": lambda c: wrap_page(c, 'ListEquipment')},
  {"file": 'pages (7).html', "dest": 'app/owner-experience/page.tsx', "wrapper": lambda c: wrap_page(c, 'OwnerExperience')},
  {"file": 'pages (8).html', "dest": 'app/owner-registration/page.tsx', "wrapper": lambda c: wrap_page(c, 'OwnerRegistration')},
  {"file": 'pages (9).html', "dest": 'app/owner-profile/bookings/page.tsx', "wrapper": lambda c: wrap_page(c, 'OwnerDashboardBookings')},
  {"file": 'pages (10).html', "dest": 'app/locations/page.tsx', "wrapper": lambda c: wrap_page(c, 'Locations')},
  {"file": 'pages (11).html', "dest": 'app/about/page.tsx', "wrapper": lambda c: wrap_page(c, 'AboutUs')},
  {"file": 'pages (12).html', "dest": 'app/legal/page.tsx', "wrapper": lambda c: wrap_page(c, 'LegalCenter')},
  {"file": 'pages (13).html', "dest": 'app/trust-safety/page.tsx', "wrapper": lambda c: wrap_page(c, 'TrustSafety')}
]

for m in mappings:
    source_path = os.path.join(export_dir, m['file'])
    tsx_content = convert_to_tsx(source_path)
    if tsx_content is not None:
        dest_path = os.path.join(base_dir, m['dest'])
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        # Strip internal duplicated navs
        if m['dest'].startswith('app/'):
            tsx_content = re.sub(r'<header[^>]*>.*?</header>', '', tsx_content, flags=re.IGNORECASE|re.DOTALL)
            tsx_content = re.sub(r'<footer[^>]*>.*?</footer>', '', tsx_content, flags=re.IGNORECASE|re.DOTALL)
            tsx_content = re.sub(r'<nav[^>]*>.*?</nav>', '', tsx_content, flags=re.IGNORECASE|re.DOTALL)
        
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(m['wrapper'](tsx_content))
        print("Successfully integrated mapping: ", m['file'], " ===> ", m['dest'])
    else:
        print("Warning: Could not process", m['file'])

print("Phase 1: Extension Pages Base Conversion finished.")
