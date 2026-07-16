import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace g3
content = content.replace(
    '{"id": "g3", "name":',
    '{"id": "g3", "description": "Ce groupe contient des verbes qui présentent des irrégularités modérées. Il est divisé en plusieurs sous-groupes basés sur leurs terminaisons (comme -re ou -ir) ou sur des modèles de conjugaison spécifiques (comme prendre, mettre, dire). La plupart partagent une base commune avec quelques exceptions selon le temps.", "name":'
)

# Replace g4
content = content.replace(
    '{"id": "g4", "name":',
    '{"id": "g4", "description": "Ce groupe regroupe les verbes les plus irréguliers et les plus fréquents de la langue française, tels que être, avoir, aller et faire. Leurs conjugaisons ne suivent souvent aucune règle standard et doivent être mémorisées individuellement.", "name":'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
