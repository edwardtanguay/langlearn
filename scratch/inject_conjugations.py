import json
import re

# We will generate the entire new data object for groups
data = {
    "groups": [
        {
            "id": "g1",
            "name": "<span class='group-num'>1.</span> verbes réguliers en <span class='highlight-unique'>-er</span>",
            "examples": "parler, aimer, chanter, travailler",
            "conjugations": {
                "PRES": {"val": "parle, parles, parle, parlons, parlez, parlent", "reg": True},
                "IMPE": {"val": "parlais, parlais, parlait, parlions, parliez, parlaient", "reg": True},
                "PRPE": {"val": "ai/suis parlé", "reg": True},
                "SIMP": {"val": "parlai, parlas, parla, parlâmes, parlâtes, parlèrent", "reg": True},
                "FUTU": {"val": "parlerai, parleras, parlera, parlerons, parlerez, parleront", "reg": True},
                "COND": {"val": "parlerais, parlerais, parlerait, parlerions, parleriez, parleraient", "reg": True},
                "PRSU": {"val": "parle, parles, parle, parlions, parliez, parlent", "reg": True},
                "IMSU": {"val": "parlasse, parlasses, parlât, parlassions, parlassiez, parlassent", "reg": True},
                "IPER": {"val": "parle, parlons, parlez", "reg": True},
                "PRPA": {"val": "parlant", "reg": True}
            },
            "exceptions": [
                {
                    "name": "manger",
                    "conjugations": {
                        "IMPE": {"val": "<span class='irreg'>mangeais</span>, <span class='irreg'>mangeais</span>, <span class='irreg'>mangeait</span>, <span class='reg'>mangions</span>, <span class='reg'>mangiez</span>, <span class='irreg'>mangeaient</span>", "reg": True},
                        "IMSU": {"val": "<span class='irreg'>mangeasse</span>, <span class='irreg'>mangeasses</span>, <span class='irreg'>mangeât</span>, <span class='irreg'>mangeassions</span>, <span class='irreg'>mangeassiez</span>, <span class='irreg'>mangeassent</span>", "reg": True}
                    }
                }
            ]
        },
        {
            "id": "g2",
            "name": "<span class='group-num'>2.</span> verbes réguliers en <span class='highlight-unique'>-ir avec -iss-</span>",
            "examples": "finir, choisir, grandir, réussir, remplir",
            "conjugations": {
                "PRES": {"val": "finis, finis, finit, finissons, finissez, finissent", "reg": True},
                "IMPE": {"val": "finissais, finissais, finissait, finissions, finissiez, finissaient", "reg": True},
                "PRPE": {"val": "ai/suis fini", "reg": True},
                "SIMP": {"val": "finis, finis, finit, finîmes, finîtes, finirent", "reg": True},
                "FUTU": {"val": "finirai, finiras, finira, finirons, finirez, finiront", "reg": True},
                "COND": {"val": "finirais, finirais, finirait, finirions, finiriez, finiraient", "reg": True},
                "PRSU": {"val": "finisse, finisses, finisse, finissions, finissiez, finissent", "reg": True},
                "IMSU": {"val": "finisse, finisses, finît, finissions, finissiez, finissent", "reg": True},
                "IPER": {"val": "finis, finissons, finissez", "reg": True},
                "PRPA": {"val": "finissant", "reg": True}
            }
        },
        {
            "id": "g3",
            "name": "<span class='group-num'>3.</span> verbes à irrégularité modérée",
            "description": "Ce groupe contient des verbes qui présentent des irrégularités modérées. Il est divisé en <span class='highlight-unique'>plusieurs sous-groupes basés sur leurs terminaisons (comme -re ou -ir) ou sur des modèles de conjugaison spécifiques (comme prendre, mettre, dire). La plupart partagent une base commune avec quelques exceptions selon le temps.</span>",
            "subgroups": [
                {
                    "id": "g3_1",
                    "name": "<span class='group-num'>3.1</span> sous-groupe: <span class='highlight-unique'>-re</span>",
                    "examples": "vendre, attendre, descendre, perdre, répondre",
                    "verbs": [
                        {
                            "name": "vendre",
                            "conjugations": {
                                "PRES": {"val": "vends, vends, vend, vendons, vendez, vendent", "reg": False},
                                "IMPE": {"val": "vendais, vendais, vendait, vendions, vendiez, vendaient", "reg": True},
                                "PRPE": {"val": "ai/suis vendu", "reg": False},
                                "SIMP": {"val": "vendis, vendis, vendit, vendîmes, vendîtes, vendirent", "reg": False},
                                "FUTU": {"val": "vendrai, vendras, vendra, vendrons, vendrez, vendront", "reg": False},
                                "COND": {"val": "vendrais, vendrais, vendrait, vendrions, vendriez, vendraient", "reg": False},
                                "PRSU": {"val": "vende, vendes, vende, vendions, vendiez, vendent", "reg": True},
                                "IMSU": {"val": "vendisse, vendisses, vendît, vendissions, vendissiez, vendissent", "reg": False},
                                "IPER": {"val": "vends, vendons, vendez", "reg": False},
                                "PRPA": {"val": "vendant", "reg": True}
                            }
                        }
                    ]
                },
                {
                    "id": "g3_2",
                    "name": "<span class='group-num'>3.2</span> sous-groupe: <span class='highlight-unique'>-ir</span>",
                    "examples": "partir, sortir, dormir, sentir, servir, mentir",
                    "verbs": [
                        {
                            "name": "partir",
                            "conjugations": {
                                "PRES": {"val": "pars, pars, part, partons, partez, partent", "reg": False},
                                "IMPE": {"val": "partais, partais, partait, partions, partiez, partaient", "reg": True},
                                "PRPE": {"val": "ai/suis parti", "reg": False},
                                "SIMP": {"val": "partis, partis, partit, partîmes, partîtes, partirent", "reg": False},
                                "FUTU": {"val": "partirai, partiras, partira, partirons, partirez, partiront", "reg": False},
                                "COND": {"val": "partirais, partirais, partirait, partirions, partiriez, partiraient", "reg": False},
                                "PRSU": {"val": "parte, partes, parte, partions, partiez, partent", "reg": True},
                                "IMSU": {"val": "partisse, partisses, partît, partissions, partissiez, partissent", "reg": False},
                                "IPER": {"val": "pars, partons, partez", "reg": False},
                                "PRPA": {"val": "partant", "reg": True}
                            }
                        }
                    ]
                },
                {
                    "id": "g3_3",
                    "name": "<span class='group-num'>3.3</span> sous-groupe: <span class='highlight-unique'>venir, tenir</span>",
                    "verbs": [
                        {
                            "name": "venir",
                            "conjugations": {
                                "PRES": {"val": "viens, viens, vient, venons, venez, viennent", "reg": False},
                                "IMPE": {"val": "venais, venais, venait, venions, veniez, venaient", "reg": True},
                                "PRPE": {"val": "suis venu", "reg": False},
                                "SIMP": {"val": "vins, vins, vint, vînmes, vîntes, vinrent", "reg": False},
                                "FUTU": {"val": "viendrai, viendras, viendra, viendrons, viendrez, viendront", "reg": False},
                                "COND": {"val": "viendrais, viendrais, viendrait, viendrions, viendriez, viendraient", "reg": False},
                                "PRSU": {"val": "vienne, viennes, vienne, venions, veniez, viennent", "reg": False},
                                "IMSU": {"val": "vinsse, vinsses, vînt, vinssions, vinssiez, vinssent", "reg": False},
                                "IPER": {"val": "viens, venons, venez", "reg": False},
                                "PRPA": {"val": "venant", "reg": True}
                            }
                        },
                        {
                            "name": "tenir",
                            "conjugations": {
                                "PRES": {"val": "tiens, tiens, tient, tenons, tenez, tiennent", "reg": False},
                                "IMPE": {"val": "tenais, tenais, tenait, tenions, teniez, tenaient", "reg": True},
                                "PRPE": {"val": "ai tenu", "reg": False},
                                "SIMP": {"val": "tins, tins, tint, tînmes, tîntes, tinrent", "reg": False},
                                "FUTU": {"val": "tiendrai, tiendras, tiendra, tiendrons, tiendrez, tiendront", "reg": False},
                                "COND": {"val": "tiendrais, tiendrais, tiendrait, tiendrions, tiendriez, tiendraient", "reg": False},
                                "PRSU": {"val": "tienne, tiennes, tienne, tenions, teniez, tiennent", "reg": False},
                                "IMSU": {"val": "tinsse, tinsses, tînt, tinssions, tinssiez, tinssent", "reg": False},
                                "IPER": {"val": "tiens, tenons, tenez", "reg": False},
                                "PRPA": {"val": "tenant", "reg": True}
                            }
                        }
                    ]
                },
                {
                    "id": "g3_4",
                    "name": "<span class='group-num'>3.4</span> sous-groupe: <span class='highlight-unique'>prendre</span>",
                    "verbs": [
                        {
                            "name": "prendre",
                            "conjugations": {
                                "PRES": {"val": "prends, prends, prend, prenons, prenez, prennent", "reg": False},
                                "IMPE": {"val": "prenais, prenais, prenait, prenions, preniez, prenaient", "reg": False},
                                "PRPE": {"val": "ai pris", "reg": False},
                                "SIMP": {"val": "pris, pris, prit, prîmes, prîtes, prirent", "reg": False},
                                "FUTU": {"val": "prendrai, prendras, prendra, prendrons, prendrez, prendront", "reg": False},
                                "COND": {"val": "prendrais, prendrais, prendrait, prendrions, prendriez, prendraient", "reg": False},
                                "PRSU": {"val": "prenne, prennes, prenne, prenions, preniez, prennent", "reg": False},
                                "IMSU": {"val": "prisse, prisses, prît, prissions, prissiez, prissent", "reg": False},
                                "IPER": {"val": "prends, prenons, prenez", "reg": False},
                                "PRPA": {"val": "prenant", "reg": True}
                            }
                        }
                    ]
                },
                {
                    "id": "g3_5",
                    "name": "<span class='group-num'>3.5</span> sous-groupe: <span class='highlight-unique'>mettre</span>",
                    "verbs": [
                        {
                            "name": "mettre",
                            "conjugations": {
                                "PRES": {"val": "mets, mets, met, mettons, mettez, mettent", "reg": False},
                                "IMPE": {"val": "mettais, mettais, mettait, mettions, mettiez, mettaient", "reg": True},
                                "PRPE": {"val": "ai mis", "reg": False},
                                "SIMP": {"val": "mis, mis, mit, mîmes, mîtes, mirent", "reg": False},
                                "FUTU": {"val": "mettrai, mettras, mettra, mettrons, mettrez, mettront", "reg": False},
                                "COND": {"val": "mettrais, mettrais, mettrait, mettrions, mettriez, mettraient", "reg": False},
                                "PRSU": {"val": "mette, mettes, mette, mettions, mettiez, mettent", "reg": True},
                                "IMSU": {"val": "misse, misses, mît, missions, missiez, missent", "reg": False},
                                "IPER": {"val": "mets, mettons, mettez", "reg": False},
                                "PRPA": {"val": "mettant", "reg": True}
                            }
                        }
                    ]
                },
                {
                    "id": "g3_6",
                    "name": "<span class='group-num'>3.6</span> sous-groupe: <span class='highlight-unique'>dire, lire, écrire</span>",
                    "verbs": [
                        {
                            "name": "dire",
                            "conjugations": {
                                "PRES": {"val": "dis, dis, dit, disons, dites, disent", "reg": False},
                                "IMPE": {"val": "disais, disais, disait, disions, disiez, disaient", "reg": False},
                                "PRPE": {"val": "ai dit", "reg": False},
                                "SIMP": {"val": "dis, dis, dit, dîmes, dîtes, dirent", "reg": False},
                                "FUTU": {"val": "dirai, diras, dira, dirons, direz, diront", "reg": False},
                                "COND": {"val": "dirais, dirais, dirait, dirions, diriez, diraient", "reg": False},
                                "PRSU": {"val": "dise, dises, dise, disions, disiez, disent", "reg": False},
                                "IMSU": {"val": "disse, disses, dît, dissions, dissiez, dissent", "reg": False},
                                "IPER": {"val": "dis, disons, dites", "reg": False},
                                "PRPA": {"val": "disant", "reg": True}
                            }
                        },
                        {
                            "name": "lire",
                            "conjugations": {
                                "PRES": {"val": "lis, lis, lit, lisons, lisez, lisent", "reg": False},
                                "IMPE": {"val": "lisais, lisais, lisait, lisions, lisiez, lisaient", "reg": False},
                                "PRPE": {"val": "ai lu", "reg": False},
                                "SIMP": {"val": "lus, lus, lut, lûmes, lûtes, lurent", "reg": False},
                                "FUTU": {"val": "lirai, liras, lira, lirons, lirez, liront", "reg": False},
                                "COND": {"val": "lirais, lirais, lirait, lirions, liriez, liraient", "reg": False},
                                "PRSU": {"val": "lise, lises, lise, lisions, lisiez, lisent", "reg": False},
                                "IMSU": {"val": "lusse, lusses, lût, lussions, lussiez, lussent", "reg": False},
                                "IPER": {"val": "lis, lisons, lisez", "reg": False},
                                "PRPA": {"val": "lisant", "reg": True}
                            }
                        },
                        {
                            "name": "écrire",
                            "conjugations": {
                                "PRES": {"val": "écris, écris, écrit, écrivons, écrivez, écrivent", "reg": False},
                                "IMPE": {"val": "écrivais, écrivais, écrivait, écrivions, écriviez, écrivaient", "reg": False},
                                "PRPE": {"val": "ai écrit", "reg": False},
                                "SIMP": {"val": "écrivis, écrivis, écrivit, écrivîmes, écrivîtes, écrivirent", "reg": False},
                                "FUTU": {"val": "écrirai, écriras, écrira, écrirons, écrirez, écriront", "reg": False},
                                "COND": {"val": "écrirais, écrirais, écrirait, écririons, écririez, écriraient", "reg": False},
                                "PRSU": {"val": "écrive, écrives, écrive, écrivions, écriviez, écrivent", "reg": False},
                                "IMSU": {"val": "écrivisse, écrivisses, écrivît, écrivissions, écrivissiez, écrivissent", "reg": False},
                                "IPER": {"val": "écris, écrivons, écrivez", "reg": False},
                                "PRPA": {"val": "écrivant", "reg": True}
                            }
                        }
                    ]
                },
                {
                    "id": "g3_7",
                    "name": "<span class='group-num'>3.7</span> sous-groupe: <span class='highlight-unique'>boire, croire, voir</span>",
                    "verbs": [
                        {
                            "name": "boire",
                            "conjugations": {
                                "PRES": {"val": "bois, bois, boit, buvons, buvez, boivent", "reg": False},
                                "IMPE": {"val": "buvais, buvais, buvait, buvions, buviez, buvaient", "reg": False},
                                "PRPE": {"val": "ai bu", "reg": False},
                                "SIMP": {"val": "bus, bus, but, bûmes, bûtes, burent", "reg": False},
                                "FUTU": {"val": "boirai, boiras, boira, boirons, boirez, boiront", "reg": False},
                                "COND": {"val": "boirais, boirais, boirait, boirions, boiriez, boiraient", "reg": False},
                                "PRSU": {"val": "boive, boives, boive, buvions, buviez, boivent", "reg": False},
                                "IMSU": {"val": "busse, busses, bût, bussions, bussiez, bussent", "reg": False},
                                "IPER": {"val": "bois, buvons, buvez", "reg": False},
                                "PRPA": {"val": "buvant", "reg": True}
                            }
                        },
                        {
                            "name": "croire",
                            "conjugations": {
                                "PRES": {"val": "crois, crois, croit, croyons, croyez, croient", "reg": False},
                                "IMPE": {"val": "croyais, croyais, croyait, croyions, croyiez, croyaient", "reg": False},
                                "PRPE": {"val": "ai cru", "reg": False},
                                "SIMP": {"val": "crus, crus, crut, crûmes, crûtes, crurent", "reg": False},
                                "FUTU": {"val": "croirai, croiras, croira, croirons, croirez, croiront", "reg": False},
                                "COND": {"val": "croirais, croirais, croirait, croirions, croiriez, croiraient", "reg": False},
                                "PRSU": {"val": "croie, croies, croie, croyions, croyiez, croient", "reg": False},
                                "IMSU": {"val": "crusse, crusses, crût, crussions, crussiez, crussent", "reg": False},
                                "IPER": {"val": "crois, croyons, croyez", "reg": False},
                                "PRPA": {"val": "croyant", "reg": True}
                            }
                        },
                        {
                            "name": "voir",
                            "conjugations": {
                                "PRES": {"val": "vois, vois, voit, voyons, voyez, voient", "reg": False},
                                "IMPE": {"val": "voyais, voyais, voyait, voyions, voyiez, voyaient", "reg": False},
                                "PRPE": {"val": "ai vu", "reg": False},
                                "SIMP": {"val": "vis, vis, vit, vîmes, vîtes, virent", "reg": False},
                                "FUTU": {"val": "verrai, verras, verra, verrons, verrez, verront", "reg": False},
                                "COND": {"val": "verrais, verrais, verrait, verrions, verriez, verraient", "reg": False},
                                "PRSU": {"val": "voie, voies, voie, voyions, voyiez, voient", "reg": False},
                                "IMSU": {"val": "visse, visses, vît, vissions, vissiez, vissent", "reg": False},
                                "IPER": {"val": "vois, voyons, voyez", "reg": False},
                                "PRPA": {"val": "voyant", "reg": True}
                            }
                        }
                    ]
                },
                {
                    "id": "g3_8",
                    "name": "<span class='group-num'>3.8</span> sous-groupe: <span class='highlight-unique'>couvrir, offrir, ouvrir, souffrir</span>",
                    "verbs": [
                        {
                            "name": "ouvrir",
                            "conjugations": {
                                "PRES": {"val": "ouvre, ouvres, ouvre, ouvrons, ouvrez, ouvrent", "reg": False},
                                "IMPE": {"val": "ouvrais, ouvrais, ouvrait, ouvrions, ouvriez, ouvraient", "reg": True},
                                "PRPE": {"val": "ai ouvert", "reg": False},
                                "SIMP": {"val": "ouvris, ouvris, ouvrit, ouvrîmes, ouvrîtes, ouvrirent", "reg": False},
                                "FUTU": {"val": "ouvrirai, ouvriras, ouvrira, ouvrirons, ouvrirez, ouvriront", "reg": False},
                                "COND": {"val": "ouvrirais, ouvrirais, ouvrirait, ouvririons, ouvririez, ouvriraient", "reg": False},
                                "PRSU": {"val": "ouvre, ouvres, ouvre, ouvrions, ouvriez, ouvrent", "reg": True},
                                "IMSU": {"val": "ouvrisse, ouvrisses, ouvrît, ouvrissions, ouvrissiez, ouvrissent", "reg": False},
                                "IPER": {"val": "ouvre, ouvrons, ouvrez", "reg": False},
                                "PRPA": {"val": "ouvrant", "reg": True}
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "g4",
            "name": "<span class='group-num'>4.</span> verbes hautement irréguliers",
            "description": "Ce groupe regroupe les verbes les plus irréguliers et les plus fréquents de la langue française, tels que être, avoir, aller et faire. Leurs conjugaisons ne suivent souvent aucune règle standard et doivent être mémorisées individuellement.",
            "subgroups": [
                {
                    "id": "g4_1",
                    "name": "<span class='group-num'>4.1</span> sous-groupe: <span class='highlight-unique'>être, avoir, aller</span>",
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
                    "name": "<span class='group-num'>4.2</span> sous-groupe: <span class='highlight-unique'>vouloir, devoir, pouvoir, savoir</span>",
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
                    "name": "<span class='group-num'>4.3</span> sous-groupe: <span class='highlight-unique'>faire</span>",
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

data_str = "const data = " + json.dumps(data) + ";"

filepath = 'c:/edward/projects/apps/langlearn/output/miniapps/french-verbs/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const data = \{.*?\};', content, flags=re.DOTALL)
if match:
    content = content[:match.start()] + data_str + content[match.end():]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
