import json
import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

metadata = {
    "g1": {
        "verb_count": "~6 000 verbes (environ 90% des verbes français)",
        "similar_verbs": "aimer, chanter, travailler, manger, commencer, appeler, jeter, envoyer"
    },
    "g2": {
        "verb_count": "~300 verbes (environ 3% des verbes français)",
        "similar_verbs": "finir, choisir, grandir, réussir, remplir, obéir, punir, réagir, bâtir"
    },
    "g3": {
        "verb_count": "~370 verbes (environ 7% des verbes français, divisés en sous-groupes)",
        "similar_verbs": ""
    },
    "g3_1": {
        "verb_count": "~250 verbes",
        "similar_verbs": "vendre, attendre, descendre, perdre, répondre, entendre, défendre, correspondre"
    },
    "g3_2": {
        "verb_count": "~30 verbes",
        "similar_verbs": "repartir, ressortir, s’endormir, ressentir, pressentir, consentir, desservir, resservir, démentir"
    },
    "g3_3": {
        "verb_count": "~30 verbes",
        "similar_verbs": "devenir, revenir, parvenir, intervenir, prévenir, retenir, contenir, maintenir, appartenir, soutenir"
    },
    "g3_4": {
        "verb_count": "~10 verbes",
        "similar_verbs": "apprendre, comprendre, surprendre, entreprendre, reprendre, désapprendre"
    },
    "g3_5": {
        "verb_count": "~15 verbes",
        "similar_verbs": "admettre, permettre, promettre, soumettre, transmettre, remettre, commettre, omettre, émettre"
    },
    "g3_6": {
        "verb_count": "~15 verbes",
        "similar_verbs": "redire, contredire, décrire, inscrire, relire, transcrire, prescrire, souscrire"
    },
    "g3_7": {
        "verb_count": "~15 verbes",
        "similar_verbs": "revoir, prévoir, entrevoir, apercevoir, concevoir, décevoir, percevoir, recevoir"
    },
    "g3_8": {
        "verb_count": "~10 verbes",
        "similar_verbs": "découvrir, recouvrir, offrir, ouvrir, souffrir, rouvrir, entrouvrir"
    },
    "g4": {
        "verb_count": "8 verbes ultra-fréquents (<0.1% des verbes)",
        "similar_verbs": "être, avoir, aller, vouloir, devoir, pouvoir, savoir, faire"
    },
    "g4_1": {
        "verb_count": "3 verbes auxiliaires/fondamentaux",
        "similar_verbs": "être, avoir, aller"
    },
    "g4_2": {
        "verb_count": "4 verbes modaux/courants",
        "similar_verbs": "vouloir, devoir, pouvoir, savoir"
    },
    "g4_3": {
        "verb_count": "1 verbe d'action fondamental",
        "similar_verbs": "faire, refaire, défaire, satisfaire"
    }
}

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const data = (\{.*?\});', content, flags=re.DOTALL)
if match:
    data_str = match.group(1)
    data = json.loads(data_str)
    
    for g in data['groups']:
        gid = g['id']
        if gid in metadata:
            g['verb_count'] = metadata[gid]['verb_count']
            if metadata[gid]['similar_verbs']:
                g['similar_verbs'] = metadata[gid]['similar_verbs']
        
        if 'subgroups' in g:
            for sg in g['subgroups']:
                sgid = sg['id']
                if sgid in metadata:
                    sg['verb_count'] = metadata[sgid]['verb_count']
                    if metadata[sgid]['similar_verbs']:
                        sg['similar_verbs'] = metadata[sgid]['similar_verbs']
                        
    new_data_str = json.dumps(data)
    content = content[:match.start(1)] + new_data_str + content[match.end(1):]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully injected verb metadata into index.html JSON!")
else:
    print("Error: Could not parse const data from index.html")
