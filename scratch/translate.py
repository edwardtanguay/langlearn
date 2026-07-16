import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "French Verb Conjugations": "Conjugaisons des verbes français",
    "Verb Groups": "Groupes de verbes",
    "Back to Miniapps": "Retour aux miniapps",
    "Select a group from the sidebar to view the conjugations. Regular tenses are shown in white/black, and irregular tenses are shown in": "Sélectionnez un groupe dans la barre latérale pour voir les conjugaisons. Les temps réguliers sont affichés en blanc, et les temps irréguliers sont affichés en",
    "red</span>": "rouge</span>",
    "Examples:": "Exemples :",
    "Conjugations</h3>": "Conjugaisons</h3>",
    "Exception:": "Exception :"
}

for eng, fre in replacements.items():
    content = content.replace(eng, fre)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
