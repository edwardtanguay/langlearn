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

    def build_word(root, suffix, root_type):
        root_cls = 'irreg-part' if root_type == 'irreg' else 'reg-part'
        if not root:
            return f"<span class='suffix'>{suffix}</span>"
        if not suffix:
            return f"<span class='{root_cls}'>{root}</span>"
        return f"<span class='{root_cls}'>{root}</span><span class='suffix'>{suffix}</span>"

    def r(root, suffix): return build_word(root, suffix, 'reg')
    def i(root, suffix): return build_word(root, suffix, 'irreg')

    val_pres = f"{i('par','s')}, {i('par','s')}, {r('part','')}, {r('part','ons')}, {r('part','ez')}, {r('part','ent')}"
    val_impe = f"{r('part','ais')}, {r('part','ais')}, {r('part','ait')}, {r('part','ions')}, {r('part','iez')}, {r('part','aient')}"
    val_simp = f"{r('part','is')}, {r('part','is')}, {r('part','it')}, {r('part','îmes')}, {r('part','îtes')}, {r('part','irent')}"
    val_futu = f"{i('parti','rai')}, {i('parti','ras')}, {i('parti','ra')}, {i('parti','rons')}, {i('parti','rez')}, {i('parti','ront')}"
    val_cond = f"{i('parti','rais')}, {i('parti','rais')}, {i('parti','rait')}, {i('parti','rions')}, {i('parti','riez')}, {i('parti','raient')}"
    val_prsu = f"{r('part','e')}, {r('part','es')}, {r('part','e')}, {r('part','ions')}, {r('part','iez')}, {r('part','ent')}"
    val_imsu = f"{r('part','isse')}, {r('part','isses')}, {r('part','ît')}, {r('part','issions')}, {r('part','issiez')}, {r('part','issent')}"
    val_iper = f"{i('par','s')}, {r('part','ons')}, {r('part','ez')}"
    val_prpa = f"{r('part','ant')}"

    partir['conjugations']['PRES']['val'] = val_pres
    partir['conjugations']['IMPE']['val'] = val_impe
    partir['conjugations']['PRPE']['val'] = f"ai/suis <span class='reg-part'>part</span><span class='irreg-part'>i</span>"
    partir['conjugations']['SIMP']['val'] = val_simp
    partir['conjugations']['FUTU']['val'] = val_futu
    partir['conjugations']['COND']['val'] = val_cond
    partir['conjugations']['PRSU']['val'] = val_prsu
    partir['conjugations']['IMSU']['val'] = val_imsu
    partir['conjugations']['IPER']['val'] = val_iper
    partir['conjugations']['PRPA']['val'] = val_prpa

    new_data_str = json.dumps(data)
    content = content[:match.start(1)] + new_data_str + content[match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
