import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS
css_to_add = """
        .group-num {
            font-weight: bold;
            color: #4dd0e1;
            background-color: rgba(77, 208, 225, 0.15);
            padding: 2px 6px;
            border-radius: 4px;
            margin-right: 4px;
        }"""
content = content.replace("</style>", css_to_add + "\n    </style>")

# Update textContent to innerHTML
content = content.replace("a.textContent = g.name;", "a.innerHTML = g.name;")
content = content.replace("subA.textContent = sg.name;", "subA.innerHTML = sg.name;")

# Extract data line
match = re.search(r'const data = (\{"groups".*?\});', content)
if match:
    data_str = match.group(1)
    
    # 1e groupe: -> <span class='group-num'>1.</span>
    data_str = re.sub(r'"(\d)e groupe: ', r'"<span class=\'group-num\'>\1.</span> ', data_str)
    
    # 3.1 -> <span class='group-num'>3.1</span>
    data_str = re.sub(r'"(\d\.\d) ', r'"<span class=\'group-num\'>\1</span> ', data_str)

    content = content[:match.start(1)] + data_str + content[match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
