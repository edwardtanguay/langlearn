import json
import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

def r(root, suffix):
    if not root: return f"<span class='suffix'>{suffix}</span>"
    if not suffix: return f"<span class='reg-part'>{root}</span>"
    return f"<span class='reg-part'>{root}</span><span class='suffix'>{suffix}</span>"

parler_conjugations = {
    "PRES": {"val": f"{r('parl','e')}, {r('parl','es')}, {r('parl','e')}, {r('parl','ons')}, {r('parl','ez')}, {r('parl','ent')}", "base_rule": "-e, -es, -e, -ons, -ez, -ent", "reg": True},
    "IMPE": {"val": f"{r('parl','ais')}, {r('parl','ais')}, {r('parl','ait')}, {r('parl','ions')}, {r('parl','iez')}, {r('parl','aient')}", "base_rule": "-ais, -ais, -ait, -ions, -iez, -aient", "reg": True},
    "PRPE": {"val": f"ai {r('parl','é')}", "base_rule": "ai/suis -é", "reg": True},
    "SIMP": {"val": f"{r('parl','ai')}, {r('parl','as')}, {r('parl','a')}, {r('parl','âmes')}, {r('parl','âtes')}, {r('parl','èrent')}", "base_rule": "-ai, -as, -a, -âmes, -âtes, -èrent", "reg": True},
    "FUTU": {"val": f"{r('parler','ai')}, {r('parler','as')}, {r('parler','a')}, {r('parler','ons')}, {r('parler','ez')}, {r('parler','ont')}", "base_rule": "-er- + endings: -ai, -as, -a, -ons, -ez, -ont", "reg": True},
    "COND": {"val": f"{r('parler','ais')}, {r('parler','ais')}, {r('parler','ait')}, {r('parler','ions')}, {r('parler','iez')}, {r('parler','aient')}", "base_rule": "-er- + endings: -ais, -ais, -ait, -ions, -iez, -aient", "reg": True},
    "PRSU": {"val": f"{r('parl','e')}, {r('parl','es')}, {r('parl','e')}, {r('parl','ions')}, {r('parl','iez')}, {r('parl','ent')}", "base_rule": "-e, -es, -e, -ions, -iez, -ent", "reg": True},
    "IMSU": {"val": f"{r('parl','asse')}, {r('parl','asses')}, {r('parl','ât')}, {r('parl','assions')}, {r('parl','assiez')}, {r('parl','assent')}", "base_rule": "-asse, -asses, -ât, -assions, -assiez, -assent", "reg": True},
    "IPER": {"val": f"{r('parl','e')}, {r('parl','ons')}, {r('parl','ez')}", "base_rule": "-e, -ons, -ez", "reg": True},
    "PRPA": {"val": f"{r('parl','ant')}", "base_rule": "-ant", "reg": True}
}

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const data = (\{.*?\});', content, flags=re.DOTALL)
if match:
    data_str = match.group(1)
    data = json.loads(data_str)
    data['groups'][0]['conjugations'] = parler_conjugations
    
    new_data_str = json.dumps(data)
    content = content[:match.start(1)] + new_data_str + content[match.end(1):]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated Parler conjugations!")
else:
    print("Error: Could not parse const data from index.html")
