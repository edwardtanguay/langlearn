import json
import re

with open('c:/edward/projects/apps/langlearn/scratch/inject_conjugations.py', 'r', encoding='utf-8') as f:
    script = f.read()

# Replace the re.sub line with string slicing
script = script.replace(
    "content = re.sub(r'const data = \\{.*?\\};', data_str, content, flags=re.DOTALL)",
    "match = re.search(r'const data = \\{.*?\\};', content, flags=re.DOTALL)\nif match:\n    content = content[:match.start()] + data_str + content[match.end():]"
)

with open('c:/edward/projects/apps/langlearn/scratch/inject_conjugations.py', 'w', encoding='utf-8') as f:
    f.write(script)
