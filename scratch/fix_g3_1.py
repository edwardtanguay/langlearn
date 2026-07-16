import json
import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all "reg": false with "reg": true in the "vendre" conjugations
# To avoid replacing globally, we can use regex to find the `g3_1` block.
def replace_reg(match):
    return match.group(0).replace('"reg": false', '"reg": true')

content = re.sub(r'\{"id": "g3_1", "name": ".*?\]\}', replace_reg, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
