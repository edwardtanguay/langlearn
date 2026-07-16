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
    
    # We replace:
    # <span class='irreg'><u>TEXT</u></span> with <span class='root-irreg'>TEXT</span>
    # <span class='reg'><u>TEXT</u></span> with <span class='root-reg'>TEXT</span>
    # <u>TEXT</u> (without outer span) with <span class='root-reg'>TEXT</span>
    
    for tense, info in partir['conjugations'].items():
        val = info['val']
        # 1. Replace <span class='irreg'><u>...</u></span>  with root-irreg
        val = re.sub(r"<span class='irreg'><u>(.*?)</u></span>", r"<span class='root-irreg'>\1</span>", val)
        # 2. Replace <span class='reg'><u>...</u></span> with root-reg
        val = re.sub(r"<span class='reg'><u>(.*?)</u></span>", r"<span class='root-reg'>\1</span>", val)
        # 3. Replace raw <u>...</u> with root-reg
        val = re.sub(r"<u>(.*?)</u>", r"<span class='root-reg'>\1</span>", val)
        
        info['val'] = val

    new_data_str = json.dumps(data)
    content = content[:match.start(1)] + new_data_str + content[match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
