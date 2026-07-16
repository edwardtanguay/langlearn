import json
import re
import copy

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const data = (\{.*?\});', content, flags=re.DOTALL)
if match:
    data_str = match.group(1)
    data = json.loads(data_str)
    
    # Find g3_2 subgroup
    g3 = next(g for g in data['groups'] if g['id'] == 'g3')
    g3_2 = next(sg for sg in g3['subgroups'] if sg['id'] == 'g3_2')
    
    # Get partir as template
    partir_verb = next(v for v in g3_2['verbs'] if v['name'] == 'partir')
    partir_conj = partir_verb['conjugations']
    
    def make_verb(name, sing_root, pl_root, past_part, aux):
        v_conj = copy.deepcopy(partir_conj)
        for tense, t_data in v_conj.items():
            val = t_data['val']
            
            # Hide class names containing 'part' to avoid corrupting them during replacement
            val = val.replace("class='irreg-part'", "class='__IRREG__'")
            val = val.replace("class='reg-part'", "class='__REG__'")
            
            # Replace longer tokens first
            val = val.replace('parti', past_part)
            val = val.replace('part', pl_root)
            val = val.replace('par', sing_root)
            
            if tense == 'PRPE':
                val = val.replace('ai/suis', aux)
                
            # Restore class names
            val = val.replace("class='__IRREG__'", "class='irreg-part'")
            val = val.replace("class='__REG__'", "class='reg-part'")
            
            t_data['val'] = val
        return {"name": name, "conjugations": v_conj}
    
    new_verbs = [
        partir_verb, # keep partir first
        make_verb("sortir", "sor", "sort", "sorti", "suis"),
        make_verb("dormir", "dor", "dorm", "dormi", "ai"),
        make_verb("sentir", "sen", "sent", "senti", "ai"),
        make_verb("servir", "ser", "serv", "servi", "ai"),
        make_verb("mentir", "men", "ment", "menti", "ai")
    ]
    
    g3_2['verbs'] = new_verbs
    
    new_data_str = json.dumps(data)
    content = content[:match.start(1)] + new_data_str + content[match.end(1):]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully corrected and injected all -ir subgroup verb conjugations!")
else:
    print("Error: Could not parse const data from index.html")
