import os, re

files = [f"pages ({i}).html" for i in range(1, 14)]
dir_path = "c:/Users/hkuma/OneDrive/Desktop/Work/kisan_kamai_v1/extfiles"

print("--- FILE ANALYSIS ---")
for file in files:
    path = os.path.join(dir_path, file)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
            
            title = title_match.group(1).strip() if title_match else "No Title"
            h1 = h1_match.group(1).strip() if h1_match else "No H1"
            # Strip inner html from H1
            h1 = re.sub(r'<[^>]+>', '', h1).strip()
            print(f"{file}:\n  TITLE: {title}\n  H1: {h1[:100]}\n")
    else:
        print(f"{file} NOT FOUND\n")
