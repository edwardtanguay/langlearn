import json
import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will parse the JSON data out of the HTML file
match = re.search(r'const data = (\{.*?\});', content, flags=re.DOTALL)
if match:
    data_str = match.group(1)
    data = json.loads(data_str)
    
    # 1. Revert g1
    g1 = next(g for g in data['groups'] if g['id'] == 'g1')
    g1['conjugations'] = {
        "PRES": {"val": "-e, -es, -e, -ons, -ez, -ent", "reg": True},
        "IMPE": {"val": "-ais, -ais, -ait, -ions, -iez, -aient", "reg": True},
        "PRPE": {"val": "ai/suis -é", "reg": True},
        "SIMP": {"val": "-ai, -as, -a, -âmes, -âtes, -èrent", "reg": True},
        "FUTU": {"val": "-erai, -eras, -era, -erons, -erez, -eront", "reg": True},
        "COND": {"val": "-erais, -erais, -erait, -erions, -eriez, -eraient", "reg": True},
        "PRSU": {"val": "-e, -es, -e, -ions, -iez, -ent", "reg": True},
        "IMSU": {"val": "-asse, -asse, -ât, -assions, -assiez, -assent", "reg": True},
        "IPER": {"val": "-e, -ons, -ez", "reg": True},
        "PRPA": {"val": "-ant", "reg": True}
    }
    
    # 2. Revert g2
    g2 = next(g for g in data['groups'] if g['id'] == 'g2')
    g2['conjugations'] = {
        "PRES": {"val": "-is, -is, -it, -issons, -issez, -issent", "reg": True},
        "IMPE": {"val": "-issais, -issais, -issait, -issions, -issiez, -issaient", "reg": True},
        "PRPE": {"val": "ai/suis -i", "reg": True},
        "SIMP": {"val": "-is, -is, -it, -îmes, -îtes, -irent", "reg": True},
        "FUTU": {"val": "-irai, -iras, -ira, -irons, -irez, -iront", "reg": True},
        "COND": {"val": "-irais, -irais, -irait, -irions, -iriez, -iraient", "reg": True},
        "PRSU": {"val": "-isse, -isses, -isse, -issions, -issiez, -issent", "reg": True},
        "IMSU": {"val": "-isse, -isses, -ît, -issions, -issiez, -issent", "reg": True},
        "IPER": {"val": "-is, -issons, -issez", "reg": True},
        "PRPA": {"val": "-issant", "reg": True}
    }
    
    # 3. Revert g3_1
    g3 = next(g for g in data['groups'] if g['id'] == 'g3')
    g3_1 = next(sg for sg in g3['subgroups'] if sg['id'] == 'g3_1')
    
    # Remove "verbs" list and use "conjugations" directly
    if 'verbs' in g3_1:
        del g3_1['verbs']
    
    g3_1['conjugations'] = {
        "PRES": {"val": "-s, -s, -, -ons, -ez, -ent", "reg": True},
        "IMPE": {"val": "-ais, -ais, -ait, -ions, -iez, -aient", "reg": True},
        "PRPE": {"val": "ai/suis -u", "reg": True},
        "SIMP": {"val": "-is, -is, -it, -îmes, -îtes, -irent", "reg": True},
        "FUTU": {"val": "-rai, -ras, -ra, -rons, -rez, -ront", "reg": True},
        "COND": {"val": "-rais, -rais, -rait, -rions, -riez, -raient", "reg": True},
        "PRSU": {"val": "-e, -es, -e, -ions, -iez, -ent", "reg": True},
        "IMSU": {"val": "-isse, -isses, -ît, -issions, -issiez, -issent", "reg": True},
        "IPER": {"val": "-s, -ons, -ez", "reg": True},
        "PRPA": {"val": "-ant", "reg": True}
    }

    # Dump the modified JSON string
    new_data_str = json.dumps(data)
    
    # Put it back into the file content
    content = content[:match.start(1)] + new_data_str + content[match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
