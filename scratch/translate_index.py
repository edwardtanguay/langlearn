import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "French Verb Conjugations": "Conjugaisons des verbes français",
    "Explore the four groups of French verbs with clear visual distinctions between regular and irregular conjugations.": "Explorez les quatre groupes de verbes français avec des distinctions visuelles claires entre les conjugaisons régulières et irrégulières.",
    "Explore Verbs": "Explorer les verbes",
    "New": "Nouveau"
}

for eng, fre in replacements.items():
    content = content.replace(eng, fre)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
