import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS
css_to_add = """
        .highlight-unique {
            color: #fdd835; /* Yellow */
            font-weight: bold;
        }"""
content = content.replace("</style>", css_to_add + "\n    </style>")

# Update JSON
match = re.search(r'const data = (\{"groups".*?\});', content)
if match:
    data_str = match.group(1)
    
    # Highlight after "en " (e.g. "en -er", "en -ir avec -iss-")
    data_str = re.sub(r' en (.*?)(",)', r' en <span class=\'highlight-unique\'>\1</span>\2', data_str)
    
    # Highlight after "sous-groupe: " (e.g. "sous-groupe: venir, tenir")
    data_str = re.sub(r'sous-groupe: (.*?)(",)', r'sous-groupe: <span class=\'highlight-unique\'>\1</span>\2', data_str)

    content = content[:match.start(1)] + data_str + content[match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
