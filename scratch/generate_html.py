import json
import os

data = {
    "groups": [
        {
            "id": "g1",
            "name": "1e groupe: verbes réguliers en -er",
            "examples": "parler, manger, aimer, chanter, travailler, aller (wait, aller is 4th), arriver",
            "conjugations": {
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
            },
            "exceptions": [
                {
                    "name": "manger",
                    "conjugations": {
                        "IMPE": {"val": "mang-, mange-", "reg": False},
                        "IMSU": {"val": "mang-, mange-", "reg": False}
                    }
                }
            ]
        },
        {
            "id": "g2",
            "name": "2e groupe: verbes réguliers en -ir avec -iss-",
            "examples": "finir, choisir, grandir, réussir, remplir",
            "conjugations": {
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
        },
        {
            "id": "g3",
            "name": "3e groupe: verbes à irrégularité modérée",
            "subgroups": [
                {
                    "id": "g3_1",
                    "name": "3.1 sous-groupe: -re",
                    "examples": "vendre, prendre, attendre, mettre, dire, desendre, naître, perdre, répondre",
                    "conjugations": {
                        "PRES": {"val": "-s, -s, -, -ons, -ez, -ent", "reg": False},
                        "IMPE": {"val": "-ais, -ais, -ait, -ions, -iez, -aient", "reg": True},
                        "PRPE": {"val": "ai/suis -u", "reg": False},
                        "SIMP": {"val": "-is, -is, -it, -îmes, -îtes, -irent", "reg": False},
                        "FUTU": {"val": "-rai, -ras, -ra, -rons, -rez, -ront", "reg": False},
                        "COND": {"val": "-rais, -rais, -rait, -rions, -riez, -raient", "reg": False},
                        "PRSU": {"val": "-e, -es, -e, -ions, -iez, -ent", "reg": True},
                        "IMSU": {"val": "-isse, -isses, -ît, -issions, -issiez, -issent", "reg": False},
                        "IPER": {"val": "-s, -ons, -ez", "reg": False},
                        "PRPA": {"val": "-ant", "reg": True}
                    }
                },
                {
                    "id": "g3_2",
                    "name": "3.2 sous-groupe: -ir",
                    "examples": "partir, sortir, dormir, sentir, servir, mentir",
                    "conjugations": {
                        "PRES": {"val": "racine perd la dernière consonne au singulier (ex: je pars, je dors)", "reg": False},
                        "FUTU": {"val": "racine + i (ex: je partirai)", "reg": False},
                        "COND": {"val": "racine + i (ex: je partirais)", "reg": False},
                        "PRPE": {"val": "ai/suis -i", "reg": False}
                    },
                    "note": "identique à 3.1 à l'exception de ces temps"
                },
                {
                    "id": "g3_3",
                    "name": "3.3 sous-groupe: venir, tenir",
                    "conjugations": {
                        "PRES": {"val": "viens, viens, vient, venons, venez, viennent / tiens, tiens...", "reg": False},
                        "SIMP": {"val": "vins, vins, vint, vînmes, vîntes, vinrent", "reg": False},
                        "PRSU": {"val": "vienne, viennes, vienne, venions, veniez, viennent", "reg": False},
                        "IMSU": {"val": "vinsse, vinsses, vînt, vinssions, vinssiez, vinssent", "reg": False}
                    },
                    "note": "identique à 3.1 à l'exception de ces temps"
                },
                {
                    "id": "g3_4",
                    "name": "3.4 sous-groupe: prendre",
                    "conjugations": {
                        "IMPE": {"val": "pren- (prenais, prenais...)", "reg": False},
                        "SIMP": {"val": "pr- (pris, pris...)", "reg": False},
                        "PRSU": {"val": "prenn-, prenn-, prenn-, pren-, pren-, prenn-", "reg": False},
                        "IMSU": {"val": "pr- (prisse, prisses...)", "reg": False}
                    },
                    "note": "identique à 3.1 à l'exception de ces temps"
                },
                {
                    "id": "g3_5",
                    "name": "3.5 sous-groupe: mettre",
                    "conjugations": {
                        "PRES": {"val": "met-, met-, met-, mett-, mett-, mett-", "reg": False},
                        "SIMP": {"val": "m- (mis, mis...)", "reg": False},
                        "IMSU": {"val": "m- (misse, misses...)", "reg": False}
                    },
                    "note": "identique à 3.1 à l'exception de ces temps"
                },
                {
                    "id": "g3_6",
                    "name": "3.6 sous-groupe: dire, lire, écrire",
                    "conjugations": {
                        "PRES": {"val": "di-, écri-, l- (exceptions diverses)", "reg": False},
                        "IMPE": {"val": "dis-, écriv-, lis-", "reg": False},
                        "SIMP": {"val": "d-, écriv-, lus...", "reg": False},
                        "PRSU": {"val": "dis-, écriv-, lis-", "reg": False},
                        "IMSU": {"val": "d-, écriv-, lusse...", "reg": False}
                    },
                    "note": "identique à 3.1 à l'exception de ces temps"
                },
                {
                    "id": "g3_7",
                    "name": "3.7 sous-groupe: boire, croire, voir",
                    "conjugations": {
                        "PRES": {"val": "boi-, croi-, voi-", "reg": False},
                        "IMPE": {"val": "buv-, croy-, voy-", "reg": False},
                        "SIMP": {"val": "bus, crus, v-", "reg": False},
                        "PRSU": {"val": "boiv-, croi-, voi-", "reg": False},
                        "IMSU": {"val": "busse, crusse, v-", "reg": False}
                    },
                    "note": "identique à 3.1 à l'exception de ces temps"
                },
                {
                    "id": "g3_8",
                    "name": "3.8 sous-groupe: couvrir, offrir, ouvrir, souffrir",
                    "conjugations": {
                        "PRES": {"val": "couvre, offre, ouvre, souffre", "reg": False},
                        "PRPE": {"val": "ai couvert, offert, ouvert, souffert", "reg": False},
                        "FUTU": {"val": "couvri-, offri-, ouvri-, souffri-", "reg": False},
                        "COND": {"val": "couvri-, offri-, ouvri-, souffri-", "reg": False}
                    },
                    "note": "identique à 3.1 à l'exception de ces temps"
                }
            ]
        },
        {
            "id": "g4",
            "name": "4e groupe: verbes hautement irréguliers",
            "subgroups": [
                {
                    "id": "g4_1",
                    "name": "4.1 sous-groupe: être, avoir, aller",
                    "verbs": [
                        {
                            "name": "être",
                            "conjugations": {
                                "PRES": {"val": "suis, es, est, sommes, êtes, sont", "reg": False},
                                "IMPE": {"val": "étais, étais, était, étions, étiez, étaient", "reg": False},
                                "PRPE": {"val": "ai été", "reg": False},
                                "SIMP": {"val": "fus, fus, fut, fûmes, fûtes, furent", "reg": False},
                                "FUTU": {"val": "serai, seras, sera, serons, serez, seront", "reg": False},
                                "COND": {"val": "serais, serais, serait, serions, seriez, seraient", "reg": False},
                                "PRSU": {"val": "sois, sois, soit, soyons, soyez, soient", "reg": False},
                                "IMSU": {"val": "fusse, fusses, fût, fussions, fussiez, fussent", "reg": False},
                                "IPER": {"val": "sois, soyons, soyez", "reg": False},
                                "PRPA": {"val": "étant", "reg": False}
                            }
                        },
                        {
                            "name": "avoir",
                            "conjugations": {
                                "PRES": {"val": "ai, as, a, avons, avez, ont", "reg": False},
                                "IMPE": {"val": "avais, avais, avait, avions, aviez, avaient", "reg": True},
                                "PRPE": {"val": "ai eu", "reg": False},
                                "SIMP": {"val": "eus, eus, eut, eûmes, eûtes, eurent", "reg": False},
                                "FUTU": {"val": "aurai, auras, aura, aurons, aurez, auront", "reg": False},
                                "COND": {"val": "aurais, aurais, aurait, aurions, auriez, auraient", "reg": False},
                                "PRSU": {"val": "aie, aies, ait, ayons, ayez, aient", "reg": False},
                                "IMSU": {"val": "eusse, eusses, eût, eussions, eussiez, eussent", "reg": False},
                                "IPER": {"val": "aie, ayons, ayez", "reg": False},
                                "PRPA": {"val": "ayant", "reg": True}
                            }
                        },
                        {
                            "name": "aller",
                            "conjugations": {
                                "PRES": {"val": "vais, vas, va, allons, allez, vont", "reg": False},
                                "IMPE": {"val": "allais, allais, allait, allions, alliez, allaient", "reg": True},
                                "PRPE": {"val": "suis allé", "reg": True},
                                "SIMP": {"val": "allai, allas, alla, allâmes, allâtes, allèrent", "reg": True},
                                "FUTU": {"val": "irai, iras, ira, irons, irez, iront", "reg": False},
                                "COND": {"val": "irais, irais, irait, irions, iriez, iraient", "reg": False},
                                "PRSU": {"val": "aille, ailles, aille, allions, alliez, aillent", "reg": False},
                                "IMSU": {"val": "allasse, allasses, allât, allassions, allassiez, allassent", "reg": True},
                                "IPER": {"val": "va, allons, allez", "reg": False},
                                "PRPA": {"val": "allant", "reg": True}
                            }
                        }
                    ]
                },
                {
                    "id": "g4_2",
                    "name": "4.2 sous-groupe: vouloir, devoir, pouvoir, savoir",
                    "verbs": [
                        {
                            "name": "vouloir",
                            "conjugations": {
                                "PRES": {"val": "veux, veux, veut, voulons, voulez, veulent", "reg": False},
                                "IMPE": {"val": "voulais, voulais, voulait, voulions, vouliez, voulaient", "reg": True},
                                "PRPE": {"val": "ai voulu", "reg": False},
                                "SIMP": {"val": "voulus, voulus, voulut, voulûmes, voulûtes, voulurent", "reg": False},
                                "FUTU": {"val": "voudrai, voudras, voudra, voudrons, voudrez, voudront", "reg": False},
                                "COND": {"val": "voudrais, voudrais, voudrait, voudrions, voudriez, voudraient", "reg": False},
                                "PRSU": {"val": "veuille, veuilles, veuille, voulions, vouliez, veuillent", "reg": False},
                                "IMSU": {"val": "voulusse, voulusses, voulût, voulussions, voulussiez, voulussent", "reg": False},
                                "IPER": {"val": "veuille, veuillons, veuillez", "reg": False},
                                "PRPA": {"val": "voulant", "reg": True}
                            }
                        },
                        {
                            "name": "devoir",
                            "conjugations": {
                                "PRES": {"val": "dois, dois, doit, devons, devez, doivent", "reg": False},
                                "IMPE": {"val": "devais, devais, devait, devions, deviez, devaient", "reg": True},
                                "PRPE": {"val": "ai dû", "reg": False},
                                "SIMP": {"val": "dus, dus, dut, dûmes, dûtes, durent", "reg": False},
                                "FUTU": {"val": "devrai, devras, devra, devrons, devrez, devront", "reg": False},
                                "COND": {"val": "devrais, devrais, devrait, devrions, devriez, devraient", "reg": False},
                                "PRSU": {"val": "doive, doives, doive, devions, deviez, doivent", "reg": False},
                                "IMSU": {"val": "dusse, dusses, dût, dussions, dussiez, dussent", "reg": False},
                                "IPER": {"val": "dois, devons, devez", "reg": False},
                                "PRPA": {"val": "devant", "reg": True}
                            }
                        },
                        {
                            "name": "pouvoir",
                            "conjugations": {
                                "PRES": {"val": "peux, peux, peut, pouvons, pouvez, peuvent", "reg": False},
                                "IMPE": {"val": "pouvais, pouvais, pouvait, pouvions, pouviez, pouvaient", "reg": True},
                                "PRPE": {"val": "ai pu", "reg": False},
                                "SIMP": {"val": "pus, pus, put, pûmes, pûtes, purent", "reg": False},
                                "FUTU": {"val": "pourrai, pourras, pourra, pourrons, pourrez, pourront", "reg": False},
                                "COND": {"val": "pourrais, pourrais, pourrait, pourrions, pourriez, pourraient", "reg": False},
                                "PRSU": {"val": "puisse, puisses, puisse, puissions, puissiez, puissent", "reg": False},
                                "IMSU": {"val": "pusse, pusses, pût, pussions, puissiez, pussent", "reg": False},
                                "IPER": {"val": "-", "reg": False},
                                "PRPA": {"val": "pouvant", "reg": True}
                            }
                        },
                        {
                            "name": "savoir",
                            "conjugations": {
                                "PRES": {"val": "sais, sais, sait, savons, savez, savent", "reg": False},
                                "IMPE": {"val": "savais, savais, savait, savions, saviez, savaient", "reg": True},
                                "PRPE": {"val": "ai su", "reg": False},
                                "SIMP": {"val": "sus, sus, sut, sûmes, sûtes, surent", "reg": False},
                                "FUTU": {"val": "saurai, sauras, saura, saurons, saurez, sauront", "reg": False},
                                "COND": {"val": "saurais, saurais, saurait, saurions, sauriez, sauraient", "reg": False},
                                "PRSU": {"val": "sache, saches, sache, sachions, sachiez, sachent", "reg": False},
                                "IMSU": {"val": "susse, susses, sût, sussions, sussiez, sussent", "reg": False},
                                "IPER": {"val": "sache, sachons, sachez", "reg": False},
                                "PRPA": {"val": "sachant", "reg": False}
                            }
                        }
                    ]
                },
                {
                    "id": "g4_3",
                    "name": "4.3 sous-groupe: faire",
                    "verbs": [
                        {
                            "name": "faire",
                            "conjugations": {
                                "PRES": {"val": "fais, fais, fait, faisons, faites, font", "reg": False},
                                "IMPE": {"val": "faisais, faisais, faisait, faisions, faisiez, faisaient", "reg": True},
                                "PRPE": {"val": "ai fait", "reg": False},
                                "SIMP": {"val": "fis, fis, fit, fûmes, fûtes, firent", "reg": False},
                                "FUTU": {"val": "ferai, feras, fera, ferons, ferez, feront", "reg": False},
                                "COND": {"val": "ferais, ferais, ferait, ferions, feriez, feraient", "reg": False},
                                "PRSU": {"val": "fasse, fasses, fasse, fassions, fassiez, fassent", "reg": False},
                                "IMSU": {"val": "fisse, fisses, fît, fissions, fissiez, fissent", "reg": False},
                                "IPER": {"val": "fais, faisons, faites", "reg": False},
                                "PRPA": {"val": "faisant", "reg": False}
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>French Verb Conjugations</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #121212;
            color: #e0e0e0;
            margin: 0;
            padding: 0;
            display: flex;
            height: 100vh;
            overflow: hidden;
            opacity: 0;
            transition: opacity 0.5s ease-in;
        }}
        body.loaded {{
            opacity: 1;
        }}
        .sidebar {{
            width: 300px;
            background-color: #1e1e1e;
            border-right: 1px solid #333;
            padding: 20px;
            overflow-y: auto;
        }}
        .content {{
            flex-grow: 1;
            padding: 40px;
            overflow-y: auto;
            background-color: #121212;
        }}
        h1, h2, h3 {{
            color: #ffffff;
        }}
        .back-link {{
            display: inline-block;
            margin-bottom: 20px;
            color: #64b5f6;
            text-decoration: none;
        }}
        .back-link:hover {{
            text-decoration: underline;
        }}
        ul {{
            list-style-type: none;
            padding: 0;
        }}
        li {{
            margin-bottom: 10px;
        }}
        a.nav-link {{
            color: #e0e0e0;
            text-decoration: none;
            cursor: pointer;
            display: block;
            padding: 8px;
            border-radius: 4px;
            transition: background 0.2s;
        }}
        a.nav-link:hover, a.nav-link.active {{
            background-color: #333;
            color: #90caf9;
        }}
        .sub-nav {{
            padding-left: 15px;
            font-size: 0.9em;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: #1e1e1e;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }}
        th, td {{
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #333;
        }}
        th {{
            background-color: #2c2c2c;
            color: #fff;
        }}
        .reg {{
            color: #ffffff;
        }}
        .irreg {{
            color: #ef5350;
        }}
        .card {{
            background-color: #1e1e1e;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }}
        .tense-label {{
            font-weight: bold;
            color: #bb86fc;
            width: 80px;
            display: inline-block;
        }}
        .conjugation-row {{
            margin-bottom: 8px;
            padding: 8px;
            border-bottom: 1px solid #333;
        }}
        .conjugation-row:last-child {{
            border-bottom: none;
        }}
    </style>
</head>
<body>
    <div class="sidebar">
        <a href="../../miniapps/index.html" class="back-link">&larr; Back to Miniapps</a>
        <h2>Verb Groups</h2>
        <ul id="nav-list"></ul>
    </div>
    <div class="content" id="main-content">
        <h1>French Verb Conjugations</h1>
        <p>Select a group from the sidebar to view the conjugations. Regular tenses are shown in white/black, and irregular tenses are shown in <span class="irreg">red</span>.</p>
    </div>

    <script>
        const data = {json.dumps(data)};
        
        window.addEventListener('load', () => {{
            document.body.classList.add('loaded');
            renderNav();
        }});

        function renderNav() {{
            const nav = document.getElementById('nav-list');
            data.groups.forEach(g => {{
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.className = 'nav-link';
                a.textContent = g.name;
                a.onclick = () => renderGroup(g);
                li.appendChild(a);
                
                if (g.subgroups) {{
                    const subUl = document.createElement('ul');
                    subUl.className = 'sub-nav';
                    g.subgroups.forEach(sg => {{
                        const subLi = document.createElement('li');
                        const subA = document.createElement('a');
                        subA.className = 'nav-link';
                        subA.textContent = sg.name;
                        subA.onclick = () => renderSubgroup(sg, g.name);
                        subLi.appendChild(subA);
                        subUl.appendChild(subLi);
                    }});
                    li.appendChild(subUl);
                }}
                nav.appendChild(li);
            }});
        }}

        function renderConjugations(conj) {{
            if (!conj) return '';
            let html = '<div class="card">';
            for (const [tense, info] of Object.entries(conj)) {{
                const cls = info.reg ? 'reg' : 'irreg';
                html += `<div class="conjugation-row">
                            <span class="tense-label">${{tense}}</span> 
                            <span class="${{cls}}">${{info.val}}</span>
                         </div>`;
            }}
            html += '</div>';
            return html;
        }}

        function renderGroup(g) {{
            const content = document.getElementById('main-content');
            let html = `<h2>${{g.name}}</h2>`;
            if (g.examples) html += `<p><strong>Examples:</strong> ${{g.examples}}</p>`;
            
            if (g.conjugations) {{
                html += `<h3>Conjugations</h3>`;
                html += renderConjugations(g.conjugations);
            }}
            
            if (g.exceptions) {{
                g.exceptions.forEach(ex => {{
                    html += `<h3>Exception: ${{ex.name}}</h3>`;
                    html += renderConjugations(ex.conjugations);
                }});
            }}
            
            content.innerHTML = html;
        }}

        function renderSubgroup(sg, parentName) {{
            const content = document.getElementById('main-content');
            let html = `<h2>${{sg.name}}</h2>`;
            html += `<p><small>${{parentName}}</small></p>`;
            if (sg.examples) html += `<p><strong>Examples:</strong> ${{sg.examples}}</p>`;
            if (sg.note) html += `<p><em>${{sg.note}}</em></p>`;
            
            if (sg.conjugations) {{
                html += `<h3>Conjugations</h3>`;
                html += renderConjugations(sg.conjugations);
            }}
            
            if (sg.verbs) {{
                sg.verbs.forEach(v => {{
                    html += `<h3>${{v.name}}</h3>`;
                    html += renderConjugations(v.conjugations);
                }});
            }}
            
            content.innerHTML = html;
        }}
    </script>
</body>
</html>
"""

with open('c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
