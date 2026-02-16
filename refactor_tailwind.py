import os
import re

TARGET_DIRS = [
    r"c:\Users\shash\Documents\AG Workspace\Easy D2C\components",
    r"c:\Users\shash\Documents\AG Workspace\Easy D2C\app\(storefront)"
]

# Mapping raw tailwind classes to semantic V3 equivalent classes
REPLACEMENTS = [
    # Backgrounds
    (r'\bbg-white\b', 'bg-card'),
    (r'\bbg-black\b', 'bg-foreground'),
    
    # Grays/Slates/Neutrals to Surface/Muted/Border
    (r'\bbg-(gray|slate|neutral|zinc)-100\b', 'bg-secondary'),
    (r'\bbg-(gray|slate|neutral|zinc)-50\b', 'bg-muted'),
    (r'\bbg-(gray|slate|neutral|zinc)-200\b', 'bg-accent'),
    
    # Text
    (r'\btext-white\b', 'text-primary-foreground'),
    (r'\btext-black\b', 'text-foreground'),
    (r'\btext-(gray|slate|neutral|zinc)-900\b', 'text-foreground'),
    (r'\btext-(gray|slate|neutral|zinc)-800\b', 'text-foreground'),
    (r'\btext-(gray|slate|neutral|zinc)-700\b', 'text-foreground'),
    (r'\btext-(gray|slate|neutral|zinc)-600\b', 'text-muted-foreground'),
    (r'\btext-(gray|slate|neutral|zinc)-500\b', 'text-muted-foreground'),
    (r'\btext-(gray|slate|neutral|zinc)-400\b', 'text-muted-foreground'),
    
    # Borders
    (r'\bborder-(gray|slate|neutral|zinc)-200\b', 'border-border'),
    (r'\bborder-(gray|slate|neutral|zinc)-300\b', 'border-border'),
    (r'\bborder-(gray|slate|neutral|zinc)-100\b', 'border-border'),
    
    # Colors
    (r'\bbg-blue-(500|600|700)\b', 'bg-primary'),
    (r'\btext-blue-(500|600|700)\b', 'text-primary'),
    (r'\bbg-red-(50|100)\b', 'bg-destructive/10'),
    (r'\btext-red-(500|600)\b', 'text-destructive'),
]

files_modified = 0

for target_dir in TARGET_DIRS:
    for root, _, files in os.walk(target_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                for pattern, replacement in REPLACEMENTS:
                    new_content = re.sub(pattern, replacement, new_content)

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    files_modified += 1
                    # print(f"Updated: {os.path.relpath(filepath, target_dir)}")

print(f"\nRefactoring complete. {files_modified} files modified successfully aligning them to V3 Tokens.")
