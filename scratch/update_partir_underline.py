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
    
    partir['conjugations'] = {
        "PRES": {
            "val": "<span class='irreg'><u>par</u>s</span>, <span class='irreg'><u>par</u>s</span>, <span class='reg'><u>part</u></span>, <span class='reg'><u>part</u>ons</span>, <span class='reg'><u>part</u>ez</span>, <span class='reg'><u>part</u>ent</span>",
            "base_rule": "-s, -s, -, -ons, -ez, -ent",
            "reg": True
        },
        "IMPE": {
            "val": "<u>part</u>ais, <u>part</u>ais, <u>part</u>ait, <u>part</u>ions, <u>part</u>iez, <u>part</u>aient",
            "base_rule": "-ais, -ais, -ait, -ions, -iez, -aient",
            "reg": True
        },
        "PRPE": {
            "val": "ai/suis <span class='irreg'><u>part</u>i</span>",
            "base_rule": "ai/suis -u",
            "reg": True
        },
        "SIMP": {
            "val": "<u>part</u>is, <u>part</u>is, <u>part</u>it, <u>part</u>îmes, <u>part</u>îtes, <u>part</u>irent",
            "base_rule": "-is, -is, -it, -îmes, -îtes, -irent",
            "reg": True
        },
        "FUTU": {
            "val": "<span class='irreg'><u>parti</u>rai</span>, <span class='irreg'><u>parti</u>ras</span>, <span class='irreg'><u>parti</u>ra</span>, <span class='irreg'><u>parti</u>rons</span>, <span class='irreg'><u>parti</u>rez</span>, <span class='irreg'><u>parti</u>ront</span>",
            "base_rule": "-rai, -ras, -ra, -rons, -rez, -ront",
            "reg": True
        },
        "COND": {
            "val": "<span class='irreg'><u>parti</u>rais</span>, <span class='irreg'><u>parti</u>rais</span>, <span class='irreg'><u>parti</u>rait</span>, <span class='irreg'><u>parti</u>rions</span>, <span class='irreg'><u>parti</u>riez</span>, <span class='irreg'><u>parti</u>raient</span>",
            "base_rule": "-rais, -rais, -rait, -rions, -riez, -raient",
            "reg": True
        },
        "PRSU": {
            "val": "<u>part</u>e, <u>part</u>es, <u>part</u>e, <u>part</u>ions, <u>part</u>iez, <u>part</u>ent",
            "base_rule": "-e, -es, -e, -ions, -iez, -ent",
            "reg": True
        },
        "IMSU": {
            "val": "<u>part</u>isse, <u>part</u>isses, <u>part</u>ît, <u>part</u>issions, <u>part</u>issiez, <u>part</u>issent",
            "base_rule": "-isse, -isses, -ît, -issions, -issiez, -issent",
            "reg": True
        },
        "IPER": {
            "val": "<span class='irreg'><u>par</u>s</span>, <span class='reg'><u>part</u>ons</span>, <span class='reg'><u>part</u>ez</span>",
            "base_rule": "-s, -ons, -ez",
            "reg": True
        },
        "PRPA": {
            "val": "<u>part</u>ant",
            "base_rule": "-ant",
            "reg": True
        }
    }

    new_data_str = json.dumps(data)
    content = content[:match.start(1)] + new_data_str + content[match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
