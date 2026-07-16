import json
import re

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const data = (\{.*?\});', content, flags=re.DOTALL)
if match:
    data_str = match.group(1)
    data = json.loads(data_str)

def r(root, suffix):
    if not root: return f"<span class='suffix'>{suffix}</span>"
    if not suffix: return f"<span class='reg-part'>{root}</span>"
    return f"<span class='reg-part'>{root}</span><span class='suffix'>{suffix}</span>"

def i(root, suffix):
    if not root: return f"<span class='suffix'>{suffix}</span>"
    if not suffix: return f"<span class='irreg-part'>{root}</span>"
    return f"<span class='irreg-part'>{root}</span><span class='suffix'>{suffix}</span>"

def t(val, base_rule):
    return {"val": val, "base_rule": base_rule, "reg": True}

verbs_data = {}

# 3.3 venir, tenir
verbs_data['venir'] = {
    "PRES": t(f"{i('vien','s')}, {i('vien','s')}, {i('vien','t')}, {r('ven','ons')}, {r('ven','ez')}, {i('vienn','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{r('ven','ais')}, {r('ven','ais')}, {r('ven','ait')}, {r('ven','ions')}, {r('ven','iez')}, {r('ven','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"suis {r('ven','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('vin','s')}, {i('vin','s')}, {i('vin','t')}, {i('vîn','mes')}, {i('vîn','tes')}, {i('vin','rent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('viend','rai')}, {i('viend','ras')}, {i('viend','ra')}, {i('viend','rons')}, {i('viend','rez')}, {i('viend','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('viend','rais')}, {i('viend','rais')}, {i('viend','rait')}, {i('viend','rions')}, {i('viend','riez')}, {i('viend','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('vienn','e')}, {i('vienn','es')}, {i('vienn','e')}, {r('ven','ions')}, {r('ven','iez')}, {i('vienn','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('vin','sse')}, {i('vin','sses')}, {i('vîn','t')}, {i('vin','ssions')}, {i('vin','ssiez')}, {i('vin','ssent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('vien','s')}, {r('ven','ons')}, {r('ven','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{r('ven','ant')}", "-ant")
}

verbs_data['tenir'] = {
    "PRES": t(f"{i('tien','s')}, {i('tien','s')}, {i('tien','t')}, {r('ten','ons')}, {r('ten','ez')}, {i('tienn','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{r('ten','ais')}, {r('ten','ais')}, {r('ten','ait')}, {r('ten','ions')}, {r('ten','iez')}, {r('ten','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {r('ten','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('tin','s')}, {i('tin','s')}, {i('tin','t')}, {i('tîn','mes')}, {i('tîn','tes')}, {i('tin','rent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('tiend','rai')}, {i('tiend','ras')}, {i('tiend','ra')}, {i('tiend','rons')}, {i('tiend','rez')}, {i('tiend','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('tiend','rais')}, {i('tiend','rais')}, {i('tiend','rait')}, {i('tiend','rions')}, {i('tiend','riez')}, {i('tiend','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('tienn','e')}, {i('tienn','es')}, {i('tienn','e')}, {r('ten','ions')}, {r('ten','iez')}, {i('tienn','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('tin','sse')}, {i('tin','sses')}, {i('tîn','t')}, {i('tin','ssions')}, {i('tin','ssiez')}, {i('tin','ssent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('tien','s')}, {r('ten','ons')}, {r('ten','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{r('ten','ant')}", "-ant")
}

verbs_data['prendre'] = {
    "PRES": t(f"{r('prend','s')}, {r('prend','s')}, {r('prend','')}, {i('pren','ons')}, {i('pren','ez')}, {i('prenn','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('pren','ais')}, {i('pren','ais')}, {i('pren','ait')}, {i('pren','ions')}, {i('pren','iez')}, {i('pren','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('pr','is')}", "ai/suis -u"),
    "SIMP": t(f"{i('pr','is')}, {i('pr','is')}, {i('pr','it')}, {i('pr','îmes')}, {i('pr','îtes')}, {i('pr','irent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{r('prend','rai')}, {r('prend','ras')}, {r('prend','ra')}, {r('prend','rons')}, {r('prend','rez')}, {r('prend','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{r('prend','rais')}, {r('prend','rais')}, {r('prend','rait')}, {r('prend','rions')}, {r('prend','riez')}, {r('prend','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('prenn','e')}, {i('prenn','es')}, {i('prenn','e')}, {i('pren','ions')}, {i('pren','iez')}, {i('prenn','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('pr','isse')}, {i('pr','isses')}, {i('pr','ît')}, {i('pr','issions')}, {i('pr','issiez')}, {i('pr','issent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{r('prend','s')}, {i('pren','ons')}, {i('pren','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('pren','ant')}", "-ant")
}

verbs_data['mettre'] = {
    "PRES": t(f"{i('met','s')}, {i('met','s')}, {i('met','')}, {r('mett','ons')}, {r('mett','ez')}, {r('mett','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{r('mett','ais')}, {r('mett','ais')}, {r('mett','ait')}, {r('mett','ions')}, {r('mett','iez')}, {r('mett','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('m','is')}", "ai/suis -u"),
    "SIMP": t(f"{i('m','is')}, {i('m','is')}, {i('m','it')}, {i('m','îmes')}, {i('m','îtes')}, {i('m','irent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{r('mett','rai')}, {r('mett','ras')}, {r('mett','ra')}, {r('mett','rons')}, {r('mett','rez')}, {r('mett','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{r('mett','rais')}, {r('mett','rais')}, {r('mett','rait')}, {r('mett','rions')}, {r('mett','riez')}, {r('mett','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{r('mett','e')}, {r('mett','es')}, {r('mett','e')}, {r('mett','ions')}, {r('mett','iez')}, {r('mett','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('m','isse')}, {i('m','isses')}, {i('m','ît')}, {i('m','issions')}, {i('m','issiez')}, {i('m','issent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('met','s')}, {r('mett','ons')}, {r('mett','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{r('mett','ant')}", "-ant")
}

verbs_data['dire'] = {
    "PRES": t(f"{i('di','s')}, {i('di','s')}, {i('di','t')}, {i('dis','ons')}, {i('dit','es')}, {i('dis','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('dis','ais')}, {i('dis','ais')}, {i('dis','ait')}, {i('dis','ions')}, {i('dis','iez')}, {i('dis','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('di','t')}", "ai/suis -u"),
    "SIMP": t(f"{i('d','is')}, {i('d','is')}, {i('d','it')}, {i('d','îmes')}, {i('d','îtes')}, {i('d','irent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('di','rai')}, {i('di','ras')}, {i('di','ra')}, {i('di','rons')}, {i('di','rez')}, {i('di','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('di','rais')}, {i('di','rais')}, {i('di','rait')}, {i('di','rions')}, {i('di','riez')}, {i('di','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('dis','e')}, {i('dis','es')}, {i('dis','e')}, {i('dis','ions')}, {i('dis','iez')}, {i('dis','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('d','isse')}, {i('d','isses')}, {i('d','ît')}, {i('d','issions')}, {i('d','issiez')}, {i('d','issent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('di','s')}, {i('dis','ons')}, {i('dit','es')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('dis','ant')}", "-ant")
}

verbs_data['lire'] = {
    "PRES": t(f"{i('li','s')}, {i('li','s')}, {i('li','t')}, {i('lis','ons')}, {i('lis','ez')}, {i('lis','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('lis','ais')}, {i('lis','ais')}, {i('lis','ait')}, {i('lis','ions')}, {i('lis','iez')}, {i('lis','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('l','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('l','us')}, {i('l','us')}, {i('l','ut')}, {i('l','ûmes')}, {i('l','ûtes')}, {i('l','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('li','rai')}, {i('li','ras')}, {i('li','ra')}, {i('li','rons')}, {i('li','rez')}, {i('li','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('li','rais')}, {i('li','rais')}, {i('li','rait')}, {i('li','rions')}, {i('li','riez')}, {i('li','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('lis','e')}, {i('lis','es')}, {i('lis','e')}, {i('lis','ions')}, {i('lis','iez')}, {i('lis','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('l','usse')}, {i('l','usses')}, {i('l','ût')}, {i('l','ussions')}, {i('l','ussiez')}, {i('l','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('li','s')}, {i('lis','ons')}, {i('lis','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('lis','ant')}", "-ant")
}

verbs_data['écrire'] = {
    "PRES": t(f"{i('écri','s')}, {i('écri','s')}, {i('écri','t')}, {i('écriv','ons')}, {i('écriv','ez')}, {i('écriv','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('écriv','ais')}, {i('écriv','ais')}, {i('écriv','ait')}, {i('écriv','ions')}, {i('écriv','iez')}, {i('écriv','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('écri','t')}", "ai/suis -u"),
    "SIMP": t(f"{i('écriv','is')}, {i('écriv','is')}, {i('écriv','it')}, {i('écriv','îmes')}, {i('écriv','îtes')}, {i('écriv','irent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('écri','rai')}, {i('écri','ras')}, {i('écri','ra')}, {i('écri','rons')}, {i('écri','rez')}, {i('écri','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('écri','rais')}, {i('écri','rais')}, {i('écri','rait')}, {i('écri','rions')}, {i('écri','riez')}, {i('écri','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('écriv','e')}, {i('écriv','es')}, {i('écriv','e')}, {i('écriv','ions')}, {i('écriv','iez')}, {i('écriv','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('écriv','isse')}, {i('écriv','isses')}, {i('écriv','ît')}, {i('écriv','issions')}, {i('écriv','issiez')}, {i('écriv','issent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('écri','s')}, {i('écriv','ons')}, {i('écriv','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('écriv','ant')}", "-ant")
}

verbs_data['boire'] = {
    "PRES": t(f"{i('boi','s')}, {i('boi','s')}, {i('boi','t')}, {i('buv','ons')}, {i('buv','ez')}, {i('boiv','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('buv','ais')}, {i('buv','ais')}, {i('buv','ait')}, {i('buv','ions')}, {i('buv','iez')}, {i('buv','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('b','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('b','us')}, {i('b','us')}, {i('b','ut')}, {i('b','ûmes')}, {i('b','ûtes')}, {i('b','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('boi','rai')}, {i('boi','ras')}, {i('boi','ra')}, {i('boi','rons')}, {i('boi','rez')}, {i('boi','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('boi','rais')}, {i('boi','rais')}, {i('boi','rait')}, {i('boi','rions')}, {i('boi','riez')}, {i('boi','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('boiv','e')}, {i('boiv','es')}, {i('boiv','e')}, {i('buv','ions')}, {i('buv','iez')}, {i('boiv','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('b','usse')}, {i('b','usses')}, {i('b','ût')}, {i('b','ussions')}, {i('b','ussiez')}, {i('b','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('boi','s')}, {i('buv','ons')}, {i('buv','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('buv','ant')}", "-ant")
}

verbs_data['croire'] = {
    "PRES": t(f"{i('croi','s')}, {i('croi','s')}, {i('croi','t')}, {i('croy','ons')}, {i('croy','ez')}, {i('croi','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('croy','ais')}, {i('croy','ais')}, {i('croy','ait')}, {i('croy','ions')}, {i('croy','iez')}, {i('croy','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('cr','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('cr','us')}, {i('cr','us')}, {i('cr','ut')}, {i('cr','ûmes')}, {i('cr','ûtes')}, {i('cr','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('croi','rai')}, {i('croi','ras')}, {i('croi','ra')}, {i('croi','rons')}, {i('croi','rez')}, {i('croi','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('croi','rais')}, {i('croi','rais')}, {i('croi','rait')}, {i('croi','rions')}, {i('croi','riez')}, {i('croi','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('croi','e')}, {i('croi','es')}, {i('croi','e')}, {i('croy','ions')}, {i('croy','iez')}, {i('croi','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('cr','usse')}, {i('cr','usses')}, {i('cr','ût')}, {i('cr','ussions')}, {i('cr','ussiez')}, {i('cr','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('croi','s')}, {i('croy','ons')}, {i('croy','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('croy','ant')}", "-ant")
}

verbs_data['voir'] = {
    "PRES": t(f"{i('voi','s')}, {i('voi','s')}, {i('voi','t')}, {i('voy','ons')}, {i('voy','ez')}, {i('voi','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('voy','ais')}, {i('voy','ais')}, {i('voy','ait')}, {i('voy','ions')}, {i('voy','iez')}, {i('voy','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('v','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('v','is')}, {i('v','is')}, {i('v','it')}, {i('v','îmes')}, {i('v','îtes')}, {i('v','irent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('ver','rai')}, {i('ver','ras')}, {i('ver','ra')}, {i('ver','rons')}, {i('ver','rez')}, {i('ver','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('ver','rais')}, {i('ver','rais')}, {i('ver','rait')}, {i('ver','rions')}, {i('ver','riez')}, {i('ver','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('voi','e')}, {i('voi','es')}, {i('voi','e')}, {i('voy','ions')}, {i('voy','iez')}, {i('voi','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('v','isse')}, {i('v','isses')}, {i('v','ît')}, {i('v','issions')}, {i('v','issiez')}, {i('v','issent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('voi','s')}, {i('voy','ons')}, {i('voy','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('voy','ant')}", "-ant")
}

verbs_data['ouvrir'] = {
    "PRES": t(f"{i('ouvr','e')}, {i('ouvr','es')}, {i('ouvr','e')}, {r('ouvr','ons')}, {r('ouvr','ez')}, {i('ouvr','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{r('ouvr','ais')}, {r('ouvr','ais')}, {r('ouvr','ait')}, {r('ouvr','ions')}, {r('ouvr','iez')}, {r('ouvr','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('ouvert','')}", "ai/suis -u"),
    "SIMP": t(f"{i('ouvr','is')}, {i('ouvr','is')}, {i('ouvr','it')}, {i('ouvr','îmes')}, {i('ouvr','îtes')}, {i('ouvr','irent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('ouvri','rai')}, {i('ouvri','ras')}, {i('ouvri','ra')}, {i('ouvri','rons')}, {i('ouvri','rez')}, {i('ouvri','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('ouvri','rais')}, {i('ouvri','rais')}, {i('ouvri','rait')}, {i('ouvri','rions')}, {i('ouvri','riez')}, {i('ouvri','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{r('ouvr','e')}, {r('ouvr','es')}, {r('ouvr','e')}, {r('ouvr','ions')}, {r('ouvr','iez')}, {r('ouvr','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('ouvr','isse')}, {i('ouvr','isses')}, {i('ouvr','ît')}, {i('ouvr','issions')}, {i('ouvr','issiez')}, {i('ouvr','issent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('ouvr','e')}, {r('ouvr','ons')}, {r('ouvr','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{r('ouvr','ant')}", "-ant")
}

verbs_data['être'] = {
    "PRES": t(f"{i('sui','s')}, {i('e','s')}, {i('es','t')}, {i('somm','es')}, {i('êt','es')}, {i('son','t')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('ét','ais')}, {i('ét','ais')}, {i('ét','ait')}, {i('ét','ions')}, {i('ét','iez')}, {i('ét','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('ét','é')}", "ai/suis -u"),
    "SIMP": t(f"{i('f','us')}, {i('f','us')}, {i('f','ut')}, {i('f','ûmes')}, {i('f','ûtes')}, {i('f','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('se','rai')}, {i('se','ras')}, {i('se','ra')}, {i('se','rons')}, {i('se','rez')}, {i('se','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('se','rais')}, {i('se','rais')}, {i('se','rait')}, {i('se','rions')}, {i('se','riez')}, {i('se','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('soi','s')}, {i('soi','s')}, {i('soi','t')}, {i('soy','ons')}, {i('soy','ez')}, {i('soi','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('f','usse')}, {i('f','usses')}, {i('f','ût')}, {i('f','ussions')}, {i('f','ussiez')}, {i('f','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('soi','s')}, {i('soy','ons')}, {i('soy','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('ét','ant')}", "-ant")
}

verbs_data['avoir'] = {
    "PRES": t(f"{i('a','i')}, {i('a','s')}, {i('a','')}, {i('av','ons')}, {i('av','ez')}, {i('on','t')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('av','ais')}, {i('av','ais')}, {i('av','ait')}, {i('av','ions')}, {i('av','iez')}, {i('av','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('e','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('e','us')}, {i('e','us')}, {i('e','ut')}, {i('e','ûmes')}, {i('e','ûtes')}, {i('e','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('au','rai')}, {i('au','ras')}, {i('au','ra')}, {i('au','rons')}, {i('au','rez')}, {i('au','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('au','rais')}, {i('au','rais')}, {i('au','rait')}, {i('au','rions')}, {i('au','riez')}, {i('au','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('ai','e')}, {i('ai','es')}, {i('ai','t')}, {i('ay','ons')}, {i('ay','ez')}, {i('ai','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('e','usse')}, {i('e','usses')}, {i('e','ût')}, {i('e','ussions')}, {i('e','ussiez')}, {i('e','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('ai','e')}, {i('ay','ons')}, {i('ay','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('ay','ant')}", "-ant")
}

verbs_data['aller'] = {
    "PRES": t(f"{i('vai','s')}, {i('va','s')}, {i('va','')}, {i('all','ons')}, {i('all','ez')}, {i('von','t')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('all','ais')}, {i('all','ais')}, {i('all','ait')}, {i('all','ions')}, {i('all','iez')}, {i('all','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"suis {i('all','é')}", "ai/suis -u"),
    "SIMP": t(f"{i('all','ai')}, {i('all','as')}, {i('all','a')}, {i('all','âmes')}, {i('all','âtes')}, {i('all','èrent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('i','rai')}, {i('i','ras')}, {i('i','ra')}, {i('i','rons')}, {i('i','rez')}, {i('i','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('i','rais')}, {i('i','rais')}, {i('i','rait')}, {i('i','rions')}, {i('i','riez')}, {i('i','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('aill','e')}, {i('aill','es')}, {i('aill','e')}, {i('all','ions')}, {i('all','iez')}, {i('aill','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('all','asse')}, {i('all','asses')}, {i('all','ât')}, {i('all','assions')}, {i('all','assiez')}, {i('all','assent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('va','')}, {i('all','ons')}, {i('all','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('all','ant')}", "-ant")
}

verbs_data['vouloir'] = {
    "PRES": t(f"{i('veu','x')}, {i('veu','x')}, {i('veu','t')}, {i('voul','ons')}, {i('voul','ez')}, {i('veul','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('voul','ais')}, {i('voul','ais')}, {i('voul','ait')}, {i('voul','ions')}, {i('voul','iez')}, {i('voul','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('voul','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('voul','us')}, {i('voul','us')}, {i('voul','ut')}, {i('voul','ûmes')}, {i('voul','ûtes')}, {i('voul','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('voud','rai')}, {i('voud','ras')}, {i('voud','ra')}, {i('voud','rons')}, {i('voud','rez')}, {i('voud','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('voud','rais')}, {i('voud','rais')}, {i('voud','rait')}, {i('voud','rions')}, {i('voud','riez')}, {i('voud','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('veuill','e')}, {i('veuill','es')}, {i('veuill','e')}, {i('voul','ions')}, {i('voul','iez')}, {i('veuill','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('voul','usse')}, {i('voul','usses')}, {i('voul','ût')}, {i('voul','ussions')}, {i('voul','ussiez')}, {i('voul','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('veuill','e')}, {i('veuill','ons')}, {i('veuill','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('voul','ant')}", "-ant")
}

verbs_data['devoir'] = {
    "PRES": t(f"{i('doi','s')}, {i('doi','s')}, {i('doi','t')}, {i('dev','ons')}, {i('dev','ez')}, {i('doiv','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('dev','ais')}, {i('dev','ais')}, {i('dev','ait')}, {i('dev','ions')}, {i('dev','iez')}, {i('dev','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('d','û')}", "ai/suis -u"),
    "SIMP": t(f"{i('d','us')}, {i('d','us')}, {i('d','ut')}, {i('d','ûmes')}, {i('d','ûtes')}, {i('d','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('dev','rai')}, {i('dev','ras')}, {i('dev','ra')}, {i('dev','rons')}, {i('dev','rez')}, {i('dev','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('dev','rais')}, {i('dev','rais')}, {i('dev','rait')}, {i('dev','rions')}, {i('dev','riez')}, {i('dev','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('doiv','e')}, {i('doiv','es')}, {i('doiv','e')}, {i('dev','ions')}, {i('dev','iez')}, {i('doiv','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('d','usse')}, {i('d','usses')}, {i('d','ût')}, {i('d','ussions')}, {i('d','ussiez')}, {i('d','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('doi','s')}, {i('dev','ons')}, {i('dev','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('dev','ant')}", "-ant")
}

verbs_data['pouvoir'] = {
    "PRES": t(f"{i('peu','x')}, {i('peu','x')}, {i('peu','t')}, {i('pouv','ons')}, {i('pouv','ez')}, {i('peuv','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('pouv','ais')}, {i('pouv','ais')}, {i('pouv','ait')}, {i('pouv','ions')}, {i('pouv','iez')}, {i('pouv','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('p','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('p','us')}, {i('p','us')}, {i('p','ut')}, {i('p','ûmes')}, {i('p','ûtes')}, {i('p','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('pour','rai')}, {i('pour','ras')}, {i('pour','ra')}, {i('pour','rons')}, {i('pour','rez')}, {i('pour','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('pour','rais')}, {i('pour','rais')}, {i('pour','rait')}, {i('pour','rions')}, {i('pour','riez')}, {i('pour','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('puiss','e')}, {i('puiss','es')}, {i('puiss','e')}, {i('puiss','ions')}, {i('puiss','iez')}, {i('puiss','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('p','usse')}, {i('p','usses')}, {i('p','ût')}, {i('p','ussions')}, {i('p','ussiez')}, {i('p','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"-", "-s, -ons, -ez"),
    "PRPA": t(f"{i('pouv','ant')}", "-ant")
}

verbs_data['savoir'] = {
    "PRES": t(f"{i('sai','s')}, {i('sai','s')}, {i('sai','t')}, {i('sav','ons')}, {i('sav','ez')}, {i('sav','ent')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('sav','ais')}, {i('sav','ais')}, {i('sav','ait')}, {i('sav','ions')}, {i('sav','iez')}, {i('sav','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('s','u')}", "ai/suis -u"),
    "SIMP": t(f"{i('s','us')}, {i('s','us')}, {i('s','ut')}, {i('s','ûmes')}, {i('s','ûtes')}, {i('s','urent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('sau','rai')}, {i('sau','ras')}, {i('sau','ra')}, {i('sau','rons')}, {i('sau','rez')}, {i('sau','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('sau','rais')}, {i('sau','rais')}, {i('sau','rait')}, {i('sau','rions')}, {i('sau','riez')}, {i('sau','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('sach','e')}, {i('sach','es')}, {i('sach','e')}, {i('sach','ions')}, {i('sach','iez')}, {i('sach','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('s','usse')}, {i('s','usses')}, {i('s','ût')}, {i('s','ussions')}, {i('s','ussiez')}, {i('s','ussent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('sach','e')}, {i('sach','ons')}, {i('sach','ez')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('sach','ant')}", "-ant")
}

verbs_data['faire'] = {
    "PRES": t(f"{i('fai','s')}, {i('fai','s')}, {i('fai','t')}, {i('fais','ons')}, {i('fait','es')}, {i('f','ont')}", "-s, -s, -, -ons, -ez, -ent"),
    "IMPE": t(f"{i('fais','ais')}, {i('fais','ais')}, {i('fais','ait')}, {i('fais','ions')}, {i('fais','iez')}, {i('fais','aient')}", "-ais, -ais, -ait, -ions, -iez, -aient"),
    "PRPE": t(f"ai {i('fai','t')}", "ai/suis -u"),
    "SIMP": t(f"{i('f','is')}, {i('f','is')}, {i('f','it')}, {i('f','îmes')}, {i('f','îtes')}, {i('f','irent')}", "-is, -is, -it, -îmes, -îtes, -irent"),
    "FUTU": t(f"{i('fe','rai')}, {i('fe','ras')}, {i('fe','ra')}, {i('fe','rons')}, {i('fe','rez')}, {i('fe','ront')}", "-rai, -ras, -ra, -rons, -rez, -ront"),
    "COND": t(f"{i('fe','rais')}, {i('fe','rais')}, {i('fe','rait')}, {i('fe','rions')}, {i('fe','riez')}, {i('fe','raient')}", "-rais, -rais, -rait, -rions, -riez, -raient"),
    "PRSU": t(f"{i('fass','e')}, {i('fass','es')}, {i('fass','e')}, {i('fass','ions')}, {i('fass','iez')}, {i('fass','ent')}", "-e, -es, -e, -ions, -iez, -ent"),
    "IMSU": t(f"{i('f','isse')}, {i('f','isses')}, {i('f','ît')}, {i('f','issions')}, {i('f','issiez')}, {i('f','issent')}", "-isse, -isses, -ît, -issions, -issiez, -issent"),
    "IPER": t(f"{i('fai','s')}, {i('fais','ons')}, {i('fait','es')}", "-s, -ons, -ez"),
    "PRPA": t(f"{i('fais','ant')}", "-ant")
}

for g in data['groups']:
    if 'subgroups' in g:
        for sg in g['subgroups']:
            if 'verbs' in sg:
                for v in sg['verbs']:
                    if v['name'] in verbs_data:
                        v['conjugations'] = verbs_data[v['name']]

new_data_str = json.dumps(data)

content = content[:match.start(1)] + new_data_str + content[match.end(1):]
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
