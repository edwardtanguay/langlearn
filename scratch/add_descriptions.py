import re
import json

filepath = 'c:/edward/projects/apps/langLearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. We need to update renderGroup to display the description
render_group_update = """        function renderGroup(g) {
            const content = document.getElementById('main-content');
            let html = `<h2>${g.name}</h2>`;
            if (g.description) html += `<p class="group-description" style="font-size: 1.1em; color: #b0bec5; margin-bottom: 20px;">${g.description}</p>`;
            if (g.examples) html += `<p><strong>Exemples :</strong> ${formatExamples(g.examples)}</p>`;"""

content = re.sub(
    r'function renderGroup\(g\) \{.*?if \(g\.examples\)',
    render_group_update.replace('if (g.examples)', 'if (g.examples)'),
    content,
    flags=re.DOTALL
)

# 2. Add description to group 3 and 4 in the JSON data
match = re.search(r'const data = (\{"groups".*?\});', content)
if match:
    data_str = match.group(1)
    # Parse JSON
    # Wait, the data contains HTML spans like <span class='group-num'> which JSON might struggle with if not properly escaped, but json.loads can handle it since it's just a string.
    try:
        data = json.loads(data_str)
        for g in data['groups']:
            if g['id'] == 'g3':
                g['description'] = "Ce groupe contient des verbes qui présentent des irrégularités modérées. Il est divisé en plusieurs sous-groupes basés sur leurs terminaisons (comme -re ou -ir) ou sur des modèles de conjugaison spécifiques (comme prendre, mettre, dire). La plupart partagent une base commune avec quelques exceptions selon le temps."
            elif g['id'] == 'g4':
                g['description'] = "Ce groupe regroupe les verbes les plus irréguliers et les plus fréquents de la langue française, tels que être, avoir, aller et faire. Leurs conjugaisons ne suivent souvent aucune règle standard et doivent être mémorisées individuellement."
        
        new_data_str = json.dumps(data)
        content = content[:match.start(1)] + new_data_str + content[match.end(1):]
    except Exception as e:
        print("JSON Error:", e)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
