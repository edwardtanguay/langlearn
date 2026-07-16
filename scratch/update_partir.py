import json
import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const data = (\{.*?\});', content, flags=re.DOTALL)
if match:
    data_str = match.group(1)
    data = json.loads(data_str)
    
    g3 = next(g for g in data['groups'] if g['id'] == 'g3')
    g3_2 = next(sg for sg in g3['subgroups'] if sg['id'] == 'g3_2')
    partir = next(v for v in g3_2['verbs'] if v['name'] == 'partir')
    
    # We will update partir's conjugations with specific base rules and inline styling.
    # Note: we set reg: True so the base class is regular (white commas), 
    # and we specifically use <span class='irreg'> for red words, and <span class='reg'> if needed.
    
    partir['conjugations'] = {
        "PRES": {
            "val": "<span class='irreg'>pars</span>, <span class='irreg'>pars</span>, <span class='reg'>part</span>, <span class='reg'>partons</span>, <span class='reg'>partez</span>, <span class='reg'>partent</span>",
            "base_rule": "-s, -s, -, -ons, -ez, -ent",
            "reg": True
        },
        "IMPE": {
            "val": "partais, partais, partait, partions, partiez, partaient",
            "base_rule": "-ais, -ais, -ait, -ions, -iez, -aient",
            "reg": True
        },
        "PRPE": {
            "val": "ai/suis <span class='irreg'>parti</span>",
            "base_rule": "ai/suis -u",
            "reg": True
        },
        "SIMP": {
            "val": "partis, partis, partit, partîmes, partîtes, partirent",
            "base_rule": "-is, -is, -it, -îmes, -îtes, -irent",
            "reg": True
        },
        "FUTU": {
            "val": "<span class='irreg'>partirai</span>, <span class='irreg'>partiras</span>, <span class='irreg'>partira</span>, <span class='irreg'>partirons</span>, <span class='irreg'>partirez</span>, <span class='irreg'>partiront</span>",
            "base_rule": "-rai, -ras, -ra, -rons, -rez, -ront",
            "reg": True
        },
        "COND": {
            "val": "<span class='irreg'>partirais</span>, <span class='irreg'>partirais</span>, <span class='irreg'>partirait</span>, <span class='irreg'>partirions</span>, <span class='irreg'>partiriez</span>, <span class='irreg'>partiraient</span>",
            "base_rule": "-rais, -rais, -rait, -rions, -riez, -raient",
            "reg": True
        },
        "PRSU": {
            "val": "parte, partes, parte, partions, partiez, partent",
            "base_rule": "-e, -es, -e, -ions, -iez, -ent",
            "reg": True
        },
        "IMSU": {
            "val": "partisse, partisses, partît, partissions, partissiez, partissent",
            "base_rule": "-isse, -isses, -ît, -issions, -issiez, -issent",
            "reg": True
        },
        "IPER": {
            "val": "<span class='irreg'>pars</span>, <span class='reg'>partons</span>, <span class='reg'>partez</span>",
            "base_rule": "-s, -ons, -ez",
            "reg": True
        },
        "PRPA": {
            "val": "partant",
            "base_rule": "-ant",
            "reg": True
        }
    }

    new_data_str = json.dumps(data)
    content = content[:match.start(1)] + new_data_str + content[match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
