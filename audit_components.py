import os
import re
from collections import defaultdict

TARGET_DIRS = [
    r"c:\Users\shash\Documents\AG Workspace\Easy D2C\components",
    r"c:\Users\shash\Documents\AG Workspace\Easy D2C\app\(storefront)"
]

violations = {
    "bg-white": 0,
    "bg-black": 0,
    "text-white": 0,
    "text-black": 0,
    "bg-blue-": 0,
    "text-blue-": 0,
    "bg-red-": 0,
    "text-red-": 0,
    "bg-green-": 0,
    "text-green-": 0,
    "bg-yellow-": 0,
    "text-yellow-": 0,
    "bg-gray-": 0,
    "text-gray-": 0,
    "border-gray-": 0,
    "bg-slate-": 0,
    "text-slate-": 0,
    "border-slate-": 0,
    "bg-neutral-": 0,
    "text-neutral-": 0,
    "border-neutral-": 0,
}

files_with_violations = defaultdict(list)

def scan_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    found_any = False
    for v in violations.keys():
        if v.endswith('-'):
            pattern = r'\b' + v + r'\d+\b'
        else:
            pattern = r'\b' + v + r'\b'
        
        matches = re.findall(pattern, content)
        if matches:
            violations[v] += len(matches)
            files_with_violations[filepath].append(v + "x" + str(len(matches)))

for target_dir in TARGET_DIRS:
    for root, _, files in os.walk(target_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                scan_file(os.path.join(root, file))

with open("audit_report.txt", "w", encoding='utf-8') as f:
    f.write("Violation Summary:\n")
    for k, v in violations.items():
        if v > 0:
            f.write(f"  {k}: {v}\n")

    f.write("\nFiles to fix:\n")
    sorted_files = sorted(files_with_violations.items(), key=lambda x: len(x[1]), reverse=True)
    for file, issues in sorted_files:
        f.write(f"  {file}: {', '.join(issues)}\n")
