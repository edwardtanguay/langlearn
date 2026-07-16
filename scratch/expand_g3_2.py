import re
import json

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const data = (\{"groups".*?\});', content)
if match:
    data_str = match.group(1)
    
    # We will do a targeted string replacement for g3_2.
    # Current g3_2:
    # {"id": "g3_2", "name": "<span class='group-num'>3.2</span> sous-groupe: <span class='highlight-unique'>-ir</span>", "examples": "partir, sortir, dormir, sentir, servir, mentir", "conjugations": {"PRES": {"val": "racine perd la dernière consonne au singulier (ex: je pars, je dors)", "reg": false}, "FUTU": {"val": "racine + i (ex: je partirai)", "reg": false}, "COND": {"val": "racine + i (ex: je partirais)", "reg": false}, "PRPE": {"val": "ai/suis -i", "reg": false}}, "note": "identique à 3.1 à l'exception de ces temps"}
    
    # New g3_2 conjugations string:
    new_conj = '"conjugations": {"PRES": {"val": "racine perd la dernière consonne au singulier (ex: je pars, je dors)", "reg": false}, "IMPE": {"val": "-ais, -ais, -ait, -ions, -iez, -aient", "reg": true}, "PRPE": {"val": "ai/suis -i", "reg": false}, "SIMP": {"val": "-is, -is, -it, -îmes, -îtes, -irent", "reg": false}, "FUTU": {"val": "racine + i (ex: je partirai)", "reg": false}, "COND": {"val": "racine + i (ex: je partirais)", "reg": false}, "PRSU": {"val": "-e, -es, -e, -ions, -iez, -ent", "reg": true}, "IMSU": {"val": "-isse, -isses, -ît, -issions, -issiez, -issent", "reg": false}, "IPER": {"val": "-s, -ons, -ez", "reg": false}, "PRPA": {"val": "-ant", "reg": true}}'

    # I'll replace the existing "conjugations" and "note" for g3_2
    
    old_g3_2_pattern = r'"conjugations": \{"PRES": \{"val": "racine perd la dernière consonne au singulier \(ex: je pars, je dors\)", "reg": false\}, "FUTU": \{"val": "racine \+ i \(ex: je partirai\)", "reg": false\}, "COND": \{"val": "racine \+ i \(ex: je partirais\)", "reg": false\}, "PRPE": \{"val": "ai/suis -i", "reg": false\}\}, "note": "identique à 3\.1 à l\'exception de ces temps"'
    
    data_str = re.sub(old_g3_2_pattern, new_conj, data_str)

    content = content[:match.start(1)] + data_str + content[match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
