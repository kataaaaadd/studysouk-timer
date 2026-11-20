/**
 * StudySouk Timer - STEM Flashcards & Formula Trainer (Luxury Edition)
 * Real academic database for all Moroccan curriculum levels:
 * - Collège (3AC) (Examen Régional)
 * - Tronc Commun (TC) (TCS / TCT)
 * - 1BAC (SM / Sciences Exp)
 * - 2BAC (National Watani SM / PC / SVT / STE)
 * - CPGE (MPSI, PCSI, MP, PSI, TSI)
 * - Concours (ENSA, ENSAM, Médecine, CNC)
 * 
 * Modes:
 *   1. Leitner 3D Flip (Spaced-Repetition across 3 boxes)
 *   2. Active Recall QCM (Multiple-Choice Formula Quiz with Instant Correction)
 *   3. Chrono Blitz 60s (Speed Formula Challenge with Combo Streaks)
 */

const STUDY_FLASHCARDS = [
    {
        "id": "FC_3AC_MATH_PYTH",
        "discipline": "Maths",
        "level": "Collège (3AC)",
        "chapter": "Géométrie & Triangle Rectangle",
        "title": "Théorème de Pythagore",
        "question": "Dans un triangle $ABC$ rectangle en $A$, quelle relation fondamentale relie les longueurs des trois côtés ?",
        "latex": "BC^2 = AB^2 + AC^2 \\iff BC = \\sqrt{AB^2 + AC^2}",
        "tip": "⚠️ Condition impérative : Le triangle doit être strictement rectangle. L'hypoténuse $BC$ est le plus grand côté face à l'angle droit.",
        "choices": [
            "BC^2 = AB^2 + AC^2",
            "BC = AB + AC",
            "AB^2 = BC^2 + AC^2",
            "BC^2 = AB^2 - AC^2"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_MATH_THALES",
        "discipline": "Maths",
        "level": "Collège (3AC)",
        "chapter": "Théorème de Thalès",
        "title": "Théorème de Thalès dans le Triangle",
        "question": "Si $(MN) \\parallel (BC)$ avec $M \\in [AB]$ et $N \\in [AC]$, quels rapports de longueurs sont égaux ?",
        "latex": "\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}",
        "tip": "💡 Pour la réciproque de Thalès : les points doivent impérativement être alignés dans le même ordre sur les deux droites.",
        "choices": [
            "\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}",
            "\\frac{AM}{AN} = \\frac{AB}{AC} = \\frac{BC}{MN}",
            "\\frac{AB}{AM} = \\frac{MN}{BC}",
            "\\frac{AM}{AC} = \\frac{AN}{AB}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_MATH_TRIGO",
        "discipline": "Maths",
        "level": "Collège (3AC)",
        "chapter": "Trigonométrie",
        "title": "Rapports Trigonométriques (CAH-SOH-TOA)",
        "question": "Dans un triangle rectangle, comment calcule-t-on le cosinus, le sinus et la tangente d'un angle aigu $\\alpha$ ?",
        "latex": "\\cos(\\alpha) = \\frac{\\text{Adjacent}}{\\text{Hypoténuse}}, \\quad \\sin(\\alpha) = \\frac{\\text{Opposé}}{\\text{Hypoténuse}}, \\quad \\tan(\\alpha) = \\frac{\\text{Opposé}}{\\text{Adjacent}}",
        "tip": "💡 Mnémotechnique universelle : CAH-SOH-TOA (Cosinus-Adj/Hyp, Sinus-Opp/Hyp, Tangente-Opp/Adj).",
        "choices": [
            "\\cos = \\frac{\\text{adj}}{\\text{hyp}}, \\; \\sin = \\frac{\\text{opp}}{\\text{hyp}}, \\; \\tan = \\frac{\\text{opp}}{\\text{adj}}",
            "\\cos = \\frac{\\text{opp}}{\\text{hyp}}, \\; \\sin = \\frac{\\text{adj}}{\\text{hyp}}, \\; \\tan = \\frac{\\text{adj}}{\\text{opp}}",
            "\\cos = \\frac{\\text{adj}}{\\text{opp}}, \\; \\sin = \\frac{\\text{hyp}}{\\text{adj}}",
            "\\tan = \\cos(\\alpha) \\cdot \\sin(\\alpha)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_MATH_IDREM",
        "discipline": "Maths",
        "level": "Collège (3AC)",
        "chapter": "Calcul Littéral",
        "title": "Identités Remarquables (3AC)",
        "question": "Quels sont les développements des 3 identités remarquables fondamentales ?",
        "latex": "(a+b)^2 = a^2 + 2ab + b^2, \\quad (a-b)^2 = a^2 - 2ab + b^2, \\quad a^2 - b^2 = (a-b)(a+b)",
        "tip": "⚠️ Piège fréquent au Régional : $(a+b)^2 \\neq a^2 + b^2$ ! Ne jamais oublier le double produit $2ab$.",
        "choices": [
            "(a+b)^2 = a^2 + 2ab + b^2 \\text{ et } a^2-b^2=(a-b)(a+b)",
            "(a+b)^2 = a^2 + b^2",
            "(a-b)^2 = a^2 - b^2",
            "(a+b)^2 = a^2 + ab + b^2"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_MATH_RACINE",
        "discipline": "Maths",
        "level": "Collège (3AC)",
        "chapter": "Racines Carrées",
        "title": "Propriétés des Racines Carrées",
        "question": "Pour deux réels $a > 0$ et $b > 0$, quelle relation est mathématiquement exacte ?",
        "latex": "\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b} \\quad \\text{et} \\quad \\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}",
        "tip": "⚠️ Attention : $\\sqrt{a+b} \\neq \\sqrt{a} + \\sqrt{b}$ (ex: $\\sqrt{9+16} = 5 \\neq 3+4=7$).",
        "choices": [
            "\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}",
            "\\sqrt{a+b} = \\sqrt{a} + \\sqrt{b}",
            "\\sqrt{a-b} = \\sqrt{a} - \\sqrt{b}",
            "\\sqrt{a^2 + b^2} = a + b"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_MATH_CHASLES",
        "discipline": "Maths",
        "level": "Collège (3AC)",
        "chapter": "Vecteurs & Translation",
        "title": "Relation de Chasles",
        "question": "Pour trois points quelconques du plan $A$, $B$ et $C$, quelle est la relation vectorielle de Chasles ?",
        "latex": "\\vec{AB} + \\vec{BC} = \\vec{AC} \\quad \\text{avec } \\vec{AB} = -\\vec{BA}",
        "tip": "💡 L'origine du second vecteur coïncide avec l'extrémité du premier.",
        "choices": [
            "\\vec{AB} + \\vec{BC} = \\vec{AC}",
            "\\vec{AB} + \\vec{BC} = \\vec{CA}",
            "\\vec{AB} + \\vec{AC} = \\vec{BC}",
            "\\vec{AB} - \\vec{BC} = \\vec{AC}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_MATH_EQUA",
        "discipline": "Maths",
        "level": "Collège (3AC)",
        "chapter": "Équations & Inéquations",
        "title": "Résolution de l'Équation ax + b = 0",
        "question": "Pour tout réel $a \\neq 0$, quelle est l'unique solution de l'équation $ax + b = 0$ ?",
        "latex": "ax + b = 0 \\iff ax = -b \\iff x = -\\frac{b}{a}",
        "tip": "⚠️ Piège lors de la division d'une inéquation par un nombre négatif : le sens de l'inégalité s'inverse !",
        "choices": [
            "x = -\\frac{b}{a}",
            "x = \\frac{b}{a}",
            "x = -\\frac{a}{b}",
            "x = -(a + b)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_MATH_ANGLES",
        "discipline": "Maths",
        "level": "Collège (3AC)",
        "chapter": "Angles Inscrits & Cercle",
        "title": "Angle au Centre & Angle Inscrit",
        "question": "Si un angle au centre $\\widehat{AOB}$ et un angle inscrit $\\widehat{AMB}$ interceptent le même arc de cercle $\\overset{\\frown}{AB}$ :",
        "latex": "\\widehat{AOB} = 2 \\cdot \\widehat{AMB} \\iff \\widehat{AMB} = \\frac{1}{2} \\widehat{AOB}",
        "tip": "💡 Deux angles inscrits qui interceptent le même arc ont exactement la même mesure.",
        "choices": [
            "\\widehat{AOB} = 2 \\cdot \\widehat{AMB}",
            "\\widehat{AOB} = \\widehat{AMB}",
            "\\widehat{AOB} = 3 \\cdot \\widehat{AMB}",
            "\\widehat{AMB} = 2 \\cdot \\widehat{AOB}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_PHYS_POIDS",
        "discipline": "Physique",
        "level": "Collège (3AC)",
        "chapter": "Mécanique",
        "title": "Poids et Masse d'un Corps",
        "question": "Quelle formule relie l'intensité du poids $P$ d'un objet à sa masse $m$ ?",
        "latex": "P = m \\cdot g \\quad \\text{avec } P \\text{ en [N], } m \\text{ en [kg], et } g \\approx 9.8 \\text{ ou } 10 \\text{ N/kg}",
        "tip": "💡 La masse $m$ est constante dans tout l'univers ; le poids $P$ varie selon l'astre et l'altitude.",
        "choices": [
            "P = m \\cdot g",
            "P = \\frac{m}{g}",
            "m = P \\cdot g",
            "P = m + g"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_PHYS_OHM",
        "discipline": "Physique",
        "level": "Collège (3AC)",
        "chapter": "Électricité",
        "title": "Loi d'Ohm pour un Conducteur Ohmique",
        "question": "Quelle relation relie la tension $U$ aux bornes d'un dipôle ohmique à l'intensité $I$ qui le traverse ?",
        "latex": "U = R \\cdot I \\quad \\text{avec } U \\text{ en [V], } R \\text{ en [\\Omega], } I \\text{ en [A]}",
        "tip": "💡 La courbe caractéristique $U = f(I)$ est une droite passant par l'origine de pente égale à la résistance $R$.",
        "choices": [
            "U = R \\cdot I",
            "U = \\frac{R}{I}",
            "I = U \\cdot R",
            "R = U \\cdot I"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_PHYS_PUISS",
        "discipline": "Physique",
        "level": "Collège (3AC)",
        "chapter": "Électricité",
        "title": "Puissance & Énergie Électrique",
        "question": "Quelles expressions relient la puissance $P$ et l'énergie électrique consommée $E$ pendant la durée $t$ ?",
        "latex": "P = U \\cdot I \\quad \\text{et} \\quad E = P \\cdot t = U \\cdot I \\cdot t",
        "tip": "💡 Si $t$ est en secondes, $E$ est en Joules ($1\\text{ J} = 1\\text{ W}\\cdot\\text{s}$). Si $t$ est en heures, $E$ est en $\\text{W}\\cdot\\text{h}$ ($1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}$).",
        "choices": [
            "P = U \\cdot I \\text{ et } E = P \\cdot t",
            "P = \\frac{U}{I} \\text{ et } E = \\frac{P}{t}",
            "E = P + t",
            "P = U^2 \\cdot I"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_3AC_CHIM_PH",
        "discipline": "Chimie",
        "level": "Collège (3AC)",
        "chapter": "Solutions Aqueuses",
        "title": "Échelle de pH à 25°C",
        "question": "Quel est le domaine de pH d'une solution aqueuse acide, neutre ou basique à 25°C ?",
        "latex": "\\text{Acide : } pH < 7, \\quad \\text{Neutre : } pH = 7, \\quad \\text{Basique : } pH > 7",
        "tip": "💡 Lors de la dilution d'un acide par de l'eau pure, son $pH$ augmente progressivement mais ne dépasse jamais 7.",
        "choices": [
            "\\text{Acide : } pH < 7, \\; \\text{Neutre : } pH = 7, \\; \\text{Basique : } pH > 7",
            "\\text{Acide : } pH > 7, \\; \\text{Basique : } pH < 7",
            "\\text{Acide : } pH = 0, \\; \\text{Basique : } pH = 14",
            "\\text{Tout } pH < 0 \\text{ est basique}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_MATH_DELTA",
        "discipline": "Maths",
        "level": "Tronc Commun (TC)",
        "chapter": "Équations du 2nd Degré",
        "title": "Discriminant Delta (Δ)",
        "question": "Pour l'équation $ax^2 + bx + c = 0$ ($a \\neq 0$), que vaut le discriminant $\\Delta$ et les solutions pour $\\Delta > 0$ ?",
        "latex": "\\Delta = b^2 - 4ac \\implies x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}",
        "tip": "💡 Si $\\Delta = 0$ : solution double $x_0 = -b/(2a)$. Si $\\Delta < 0$ : aucune racine réelle dans $\\mathbb{R}$.",
        "choices": [
            "\\Delta = b^2 - 4ac, \\; x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}",
            "\\Delta = b^2 + 4ac, \\; x = \\frac{-b \\pm \\sqrt{\\Delta}}{a}",
            "\\Delta = 2b - 4ac, \\; x = \\frac{b}{2a}",
            "\\Delta = b^2 - ac"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_MATH_TRIGO",
        "discipline": "Maths",
        "level": "Tronc Commun (TC)",
        "chapter": "Trigonométrie",
        "title": "Formule Fondamentale de la Trigonométrie",
        "question": "Pour tout réel $x$, quelle relation fondamentale relie $\\cos(x)$ et $\\sin(x)$ ?",
        "latex": "\\cos^2(x) + \\sin^2(x) = 1 \\quad \\text{et} \\quad 1 + \\tan^2(x) = \\frac{1}{\\cos^2(x)}",
        "tip": "💡 Valable pour tout point du cercle trigonométrique de rayon unité $R=1$.",
        "choices": [
            "\\cos^2(x) + \\sin^2(x) = 1",
            "\\cos^2(x) - \\sin^2(x) = 1",
            "\\cos(x) + \\sin(x) = 1",
            "\\cos^2(x) + \\sin^2(x) = 0"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_MATH_COLIN",
        "discipline": "Maths",
        "level": "Tronc Commun (TC)",
        "chapter": "Géométrie Analytique",
        "title": "Colinéarité & Déterminant de 2 Vecteurs",
        "question": "Dans un repère $(O, \\vec{i}, \\vec{j})$, à quelle condition $\\vec{u}(x, y)$ et $\\vec{v}(x', y')$ sont-ils colinéaires ?",
        "latex": "\\det(\\vec{u}, \\vec{v}) = xy' - x'y = 0 \\iff \\vec{u} \\text{ et } \\vec{v} \\text{ sont colinéaires}",
        "tip": "💡 Si $\\det(\\vec{u}, \\vec{v}) \\neq 0$, la famille $(\\vec{u}, \\vec{v})$ forme une base du plan.",
        "choices": [
            "xy' - x'y = 0",
            "xx' + yy' = 0",
            "xy + x'y' = 0",
            "\\frac{x}{y} = \\frac{y'}{x'}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_MATH_DROITE",
        "discipline": "Maths",
        "level": "Tronc Commun (TC)",
        "chapter": "La Droite dans le Plan",
        "title": "Équation Cartésienne & Vecteur Directeur",
        "question": "Pour la droite $(\\mathcal{D})$ d'équation cartésienne $ax + by + c = 0$, quel est un vecteur directeur $\\vec{u}$ ?",
        "latex": "\\vec{u}(-b, a) \\text{ est un vecteur directeur, et } \\vec{n}(a, b) \\text{ est un vecteur normal}",
        "tip": "💡 Si $b \\neq 0$, la pente (coefficient directeur) vaut $m = -a/b$.",
        "choices": [
            "\\vec{u}(-b, a)",
            "\\vec{u}(a, b)",
            "\\vec{u}(b, -a)",
            "\\vec{u}(a, -c)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_MATH_ARITH",
        "discipline": "Maths",
        "level": "Tronc Commun (TC)",
        "chapter": "Arithmétique dans N",
        "title": "Relation PGCD & PPCM",
        "question": "Pour deux entiers naturels non nuls $a$ et $b$, quelle est la relation fondamentale entre leur PGCD et leur PPCM ?",
        "latex": "\\operatorname{PGCD}(a, b) \\times \\operatorname{PPCM}(a, b) = a \\times b",
        "tip": "💡 Deux entiers sont premiers entre eux si et seulement si $\\operatorname{PGCD}(a, b) = 1$.",
        "choices": [
            "\\operatorname{PGCD}(a,b) \\times \\operatorname{PPCM}(a,b) = a \\times b",
            "\\operatorname{PGCD}(a,b) + \\operatorname{PPCM}(a,b) = a + b",
            "\\operatorname{PGCD}(a,b) = a \\times b",
            "\\frac{\\operatorname{PGCD}(a,b)}{\\operatorname{PPCM}(a,b)} = 1"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_MATH_VAL_ABS",
        "discipline": "Maths",
        "level": "Tronc Commun (TC)",
        "chapter": "Ordre dans R",
        "title": "Valeur Absolue & Encadrement",
        "question": "Pour un réel $r > 0$, à quel encadrement l'inégalité $|x - a| \\le r$ est-elle équivalente ?",
        "latex": "|x - a| \\le r \\iff -r \\le x - a \\le r \\iff a - r \\le x \\le a + r",
        "tip": "💡 Géométriquement, $|x - a|$ représente la distance euclidienne entre le point d'abscisse $x$ et le centre $a$.",
        "choices": [
            "a - r \\le x \\le a + r",
            "x \\le a + r",
            "-r \\le x \\le r",
            "x \\ge a - r"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_PHYS_GRAVIT",
        "discipline": "Physique",
        "level": "Tronc Commun (TC)",
        "chapter": "Gravitation Universelle",
        "title": "Loi de Newton de la Gravitation",
        "question": "Quelle est l'intensité de la force d'attraction gravitationnelle entre deux masses $m_A$ et $m_B$ séparées de la distance $d$ ?",
        "latex": "F_{A/B} = F_{B/A} = G \\frac{m_A \\cdot m_B}{d^2} \\quad \\text{avec } G \\approx 6.67 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2",
        "tip": "⚠️ Attention aux unités : la distance $d$ doit impérativement être convertie en mètres [m] !",
        "choices": [
            "F = G \\frac{m_A m_B}{d^2}",
            "F = G \\frac{m_A m_B}{d}",
            "F = G \\frac{m_A + m_B}{d^2}",
            "F = m_A g d"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_PHYS_EQUIL",
        "discipline": "Physique",
        "level": "Tronc Commun (TC)",
        "chapter": "Équilibre d'un Solide",
        "title": "Condition d'Équilibre (2 Forces)",
        "question": "Quelles sont les conditions d'équilibre d'un solide soumis à deux forces $\\vec{F}_1$ et $\\vec{F}_2$ ?",
        "latex": "\\vec{F}_1 + \\vec{F}_2 = \\vec{0} \\iff \\vec{F}_1 = -\\vec{F}_2 \\quad \\text{(même intensité, sens opposés, même droite d'action)}",
        "tip": "💡 Si le corps est soumis à 3 forces non parallèles en équilibre, les forces sont coplanaires et concourantes en un point.",
        "choices": [
            "\\vec{F}_1 + \\vec{F}_2 = \\vec{0} \\text{ (même droite d'action)}",
            "\\vec{F}_1 = \\vec{F}_2",
            "\\vec{F}_1 \\cdot \\vec{F}_2 = 0",
            "\\|\\vec{F}_1\\| + \\|\\vec{F}_2\\| = 0"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_PHYS_JOULE",
        "discipline": "Physique",
        "level": "Tronc Commun (TC)",
        "chapter": "Courant Électrique Continu",
        "title": "Puissance Dissipée par Effet Joule",
        "question": "Quelle est l'expression de la puissance thermique dissipée par effet Joule dans un résistor de résistance $R$ ?",
        "latex": "P_J = R \\cdot I^2 = \\frac{U^2}{R} = U \\cdot I",
        "tip": "💡 L'énergie thermique dissipée pendant une durée $\\Delta t$ vaut $E_J = P_J \\cdot \\Delta t = R \\cdot I^2 \\cdot \\Delta t$.",
        "choices": [
            "P_J = R \\cdot I^2 = \\frac{U^2}{R}",
            "P_J = R^2 \\cdot I",
            "P_J = \\frac{R}{I^2}",
            "P_J = U \\cdot R^2"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TC_CHIM_MOLE",
        "discipline": "Chimie",
        "level": "Tronc Commun (TC)",
        "chapter": "La Mole & Quantité de Matière",
        "title": "Formules de la Quantité de Matière",
        "question": "Quelles relations permettent de calculer la quantité de matière $n$ selon l'état de la matière ?",
        "latex": "n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{V_m} \\quad \\text{et pour une solution } n = C \\cdot V",
        "tip": "💡 $V_m$ est le volume molaire des gaz ($22.4\\text{ L/mol}$ dans les conditions normales de température et pression).",
        "choices": [
            "n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{V_m}",
            "n = m \\cdot M = C / V",
            "n = \\frac{M}{m} = N \\cdot N_A",
            "n = V_m \\cdot V"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_MATH_ALKASHI",
        "discipline": "Maths",
        "level": "1BAC",
        "chapter": "Produit Scalaire",
        "title": "Théorème d'Al-Kashi (Pythagore Généralisé)",
        "question": "Dans un triangle $ABC$ quelconque, quelle est la formule d'Al-Kashi reliant le côté $a=BC$ aux côtés $b$ et $c$ ?",
        "latex": "a^2 = b^2 + c^2 - 2bc \\cos(\\hat{A})",
        "tip": "💡 Si $\\hat{A} = 90^\\circ$, alors $\\cos(90^\\circ)=0$ et on retrouve le théorème de Pythagore classique.",
        "choices": [
            "a^2 = b^2 + c^2 - 2bc \\cos(\\hat{A})",
            "a^2 = b^2 + c^2 + 2bc \\cos(\\hat{A})",
            "a^2 = b^2 + c^2 - 2bc \\sin(\\hat{A})",
            "a = b + c - 2bc \\cos(\\hat{A})"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_MATH_TRIG_ADD",
        "discipline": "Maths",
        "level": "1BAC",
        "chapter": "Trigonométrie",
        "title": "Formules d'Addition Trigonométrique",
        "question": "Donnez les expressions de $\\cos(a+b)$ et $\\sin(a+b)$ pour deux réels $a$ et $b$ :",
        "latex": "\\cos(a+b) = \\cos a \\cos b - \\sin a \\sin b, \\quad \\sin(a+b) = \\sin a \\cos b + \\cos a \\sin b",
        "tip": "💡 Duplication essentielle : $\\cos(2a) = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1$ et $\\sin(2a) = 2\\sin a \\cos a$.",
        "choices": [
            "\\cos(a+b) = \\cos a \\cos b - \\sin a \\sin b",
            "\\cos(a+b) = \\cos a \\cos b + \\sin a \\sin b",
            "\\cos(a+b) = \\cos a + \\cos b",
            "\\sin(a+b) = \\sin a \\sin b - \\cos a \\cos b"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_MATH_SUITE_ARITH",
        "discipline": "Maths",
        "level": "1BAC",
        "chapter": "Suites Numériques",
        "title": "Somme d'une Suite Arithmétique",
        "question": "Quelle est la somme des $n$ premiers termes d'une suite arithmétique de premier terme $u_1$ et raison $r$ ?",
        "latex": "S_n = \\sum_{k=1}^n u_k = n \\times \\frac{u_1 + u_n}{2} = \\frac{\\text{Nombre de termes} \\times (\\text{Premier} + \\text{Dernier})}{2}",
        "tip": "💡 Terme général : $u_n = u_p + (n-p)r$.",
        "choices": [
            "n \\times \\frac{u_1 + u_n}{2}",
            "\\frac{u_1 + u_n}{n}",
            "u_1 \\times \\frac{1-r^n}{1-r}",
            "n(u_1 + r)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_MATH_SUITE_GEOM",
        "discipline": "Maths",
        "level": "1BAC",
        "chapter": "Suites Numériques",
        "title": "Somme d'une Suite Géométrique",
        "question": "Pour une suite géométrique de premier terme $u_0$ et raison $q \\neq 1$, que vaut $\\sum_{k=0}^n u_k$ ?",
        "latex": "S_n = u_0 \\frac{1 - q^{n+1}}{1 - q} \\quad \\text{avec } (n+1) \\text{ termes}",
        "tip": "⚠️ Attention à l'exposant : c'est toujours le nombre exact de termes sommés ($n+1$ termes de $0$ à $n$).",
        "choices": [
            "u_0 \\frac{1 - q^{n+1}}{1 - q}",
            "u_0 \\frac{1 - q^n}{1 - q}",
            "u_0 \\frac{q^{n+1} - 1}{q}",
            "u_0 (1 - q^n)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_MATH_TANGENTE",
        "discipline": "Maths",
        "level": "1BAC",
        "chapter": "Dérivation",
        "title": "Équation de la Tangente à une Courbe",
        "question": "Quelle est l'équation cartésienne de la droite tangente $(T)$ à la courbe $\\mathcal{C}_f$ au point d'abscisse $x_0$ ?",
        "latex": "y = f'(x_0)(x - x_0) + f(x_0)",
        "tip": "💡 Le coefficient directeur de la tangente est précisément la valeur du nombre dérivé $f'(x_0)$.",
        "choices": [
            "y = f'(x_0)(x - x_0) + f(x_0)",
            "y = f'(x_0)(x + x_0) - f(x_0)",
            "y = f(x_0)(x - x_0) + f'(x_0)",
            "y = \\frac{f(x) - f(x_0)}{x - x_0}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_MATH_DERIV_USUELLES",
        "discipline": "Maths",
        "level": "1BAC",
        "chapter": "Dérivation",
        "title": "Dérivées de √u et uⁿ",
        "question": "Pour une fonction dérivable strictement positive $u$, quelles sont les dérivées de $\\sqrt{u}$ et $u^n$ ($n \\in \\mathbb{Z}^*$) ?",
        "latex": "(\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}} \\quad \\text{et} \\quad (u^n)' = n \\cdot u' \\cdot u^{n-1}",
        "tip": "💡 En particulier pour $(\\frac{1}{u})' = -\\frac{u'}{u^2}$ (cas $n = -1$).",
        "choices": [
            "(\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}} \\text{ et } (u^n)' = n u' u^{n-1}",
            "(\\sqrt{u})' = \\frac{1}{2\\sqrt{u}} \\text{ et } (u^n)' = n u^{n-1}",
            "(\\sqrt{u})' = \\frac{u'}{\\sqrt{u}}",
            "(u^n)' = u' u^n"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_MATH_BARY",
        "discipline": "Maths",
        "level": "1BAC",
        "chapter": "Barycentre",
        "title": "Barycentre de Points Pondérés",
        "question": "Pour deux points pondérés $(A, \\alpha)$ et $(B, \\beta)$ avec $\\alpha + \\beta \\neq 0$, comment est défini le barycentre $G$ ?",
        "latex": "\\alpha \\vec{GA} + \\beta \\vec{GB} = \\vec{0} \\iff \\vec{AG} = \\frac{\\beta}{\\alpha + \\beta} \\vec{AB}",
        "tip": "💡 Propriété fondamentale de réduction : pour tout point $M$, $\\alpha\\vec{MA} + \\beta\\vec{MB} = (\\alpha+\\beta)\\vec{MG}$.",
        "choices": [
            "\\alpha \\vec{GA} + \\beta \\vec{GB} = \\vec{0}",
            "\\alpha \\vec{AG} + \\beta \\vec{BG} = \\vec{AB}",
            "\\vec{GA} = \\vec{GB}",
            "\\vec{OG} = \\alpha \\vec{OA} + \\beta \\vec{OB}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_MATH_LOGIQUE",
        "discipline": "Maths",
        "level": "1BAC",
        "chapter": "Notions de Logique",
        "title": "Principe de la Contraposée",
        "question": "Quelle est l'équivalence logique fondamentale de la contraposée de la proposition $(P \\implies Q)$ ?",
        "latex": "(P \\implies Q) \\iff (\\overline{Q} \\implies \\overline{P})",
        "tip": "💡 Très puissant pour démontrer que deux expressions sont différentes en montrant l'égalité par négation.",
        "choices": [
            "(P \\implies Q) \\iff (\\overline{Q} \\implies \\overline{P})",
            "(P \\implies Q) \\iff (\\overline{P} \\implies \\overline{Q})",
            "(P \\implies Q) \\iff (Q \\implies P)",
            "\\overline{P \\implies Q} \\iff P \\implies Q"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_PHYS_TRAVAIL",
        "discipline": "Physique",
        "level": "1BAC",
        "chapter": "Travail & Énergie",
        "title": "Travail d'une Force Constante",
        "question": "Quelle est l'expression du travail $W_{AB}(\\vec{F})$ d'une force constante $\\vec{F}$ lors d'un déplacement de $A$ à $B$ ?",
        "latex": "W_{AB}(\\vec{F}) = \\vec{F} \\cdot \\vec{AB} = F \\cdot AB \\cdot \\cos(\\alpha)",
        "tip": "💡 Si $\\alpha < 90^\\circ$ : travail moteur ($W > 0$). Si $\\alpha > 90^\\circ$ : travail résistant ($W < 0$). Si $\\alpha = 90^\\circ$ : travail nul.",
        "choices": [
            "W_{AB}(\\vec{F}) = F \\cdot AB \\cdot \\cos(\\alpha)",
            "W_{AB}(\\vec{F}) = F \\cdot AB \\cdot \\sin(\\alpha)",
            "W_{AB}(\\vec{F}) = \\frac{F \\cdot AB}{\\cos(\\alpha)}",
            "W_{AB}(\\vec{F}) = F + AB"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_PHYS_TEC",
        "discipline": "Physique",
        "level": "1BAC",
        "chapter": "Théorème de l'Énergie Cinétique",
        "title": "Théorème de l'Énergie Cinétique (TEC)",
        "question": "Énoncez le TEC pour un solide en translation entre deux positions $A$ et $B$ :",
        "latex": "\\Delta E_c = E_{c,B} - E_{c,A} = \\frac{1}{2}m v_B^2 - \\frac{1}{2}m v_A^2 = \\sum W_{AB}(\\vec{F}_{ext})",
        "tip": "💡 Clé de voûte des calculs de vitesse d'arrivée sans intégrer les équations horaires de Newton.",
        "choices": [
            "\\Delta E_c = \\sum W_{AB}(\\vec{F}_{ext})",
            "\\Delta E_c = \\sum \\vec{F}_{ext}",
            "E_c = m \\cdot v^2",
            "\\Delta E_c = W(P) - W(R)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_PHYS_ENERGIE_POT",
        "discipline": "Physique",
        "level": "1BAC",
        "chapter": "Énergie Mécanique",
        "title": "Conservation de l'Énergie Mécanique",
        "question": "Pour un système conservatif (sans frottements), que vaut l'énergie mécanique totale $E_m$ ?",
        "latex": "E_m = E_c + E_{pp} = \\text{Constante} \\implies \\Delta E_m = 0",
        "tip": "💡 En présence de forces de frottement non conservatives : $\\Delta E_m = W(\\vec{f}) < 0$ (énergie dissipée sous forme thermique).",
        "choices": [
            "E_m = E_c + E_{pp} = \\text{cste}",
            "E_m = E_c - E_{pp} = 0",
            "\\Delta E_m = E_c \\cdot E_{pp}",
            "E_m = \\frac{1}{2} m g h"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_1BAC_CHIM_KOHLRAUSCH",
        "discipline": "Chimie",
        "level": "1BAC",
        "chapter": "Conductimétrie",
        "title": "Loi de Kohlrausch",
        "question": "Donnez l'expression de la conductivité $\\sigma$ d'une solution ionique diluée selon Kohlrausch :",
        "latex": "\\sigma = \\sum_{i} \\lambda_i \\cdot [X_i] \\quad \\text{avec } \\sigma \\text{ en [S/m], } [X_i] \\text{ en [mol/m}^3\\text{]}",
        "tip": "⚠️ Attention cruciale aux unités : les concentrations doivent impérativement être en $\\text{mol/m}^3$ ($1\\text{ mol/L} = 1000\\text{ mol/m}^3$) !",
        "choices": [
            "\\sigma = \\sum \\lambda_i [X_i] \\; (\\text{en mol/m}^3)",
            "\\sigma = \\sum \\frac{\\lambda_i}{[X_i]}",
            "\\sigma = G \\cdot \\frac{L}{S}",
            "\\sigma = \\sum \\lambda_i^2 [X_i]"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_DERIV_01",
        "discipline": "Maths",
        "level": "2BAC SM/PC",
        "chapter": "Dérivabilité",
        "title": "Dérivée de Arctan(u)",
        "question": "Quelle est la dérivée de la fonction $x \\mapsto \\arctan(u(x))$ ?",
        "latex": "(\\arctan(u))'(x) = \\frac{u'(x)}{1 + u(x)^2}",
        "tip": "⚠️ Piège National : Ne jamais oublier le $u'(x)$ au numérateur !",
        "choices": [
            "\\frac{u'(x)}{1 + u(x)^2}",
            "\\frac{u'(x)}{\\sqrt{1 - u(x)^2}}",
            "-\\frac{u'(x)}{1 + u(x)^2}",
            "\\frac{1}{1 + u(x)^2}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_DERIV_02",
        "discipline": "Maths",
        "level": "2BAC SM/PC",
        "chapter": "Dérivabilité",
        "title": "Dérivée de la réciproque f⁻¹",
        "question": "Si $f$ est bijective et dérivable en $x_0$ avec $f'(x_0) \\neq 0$, quelle est la dérivée de $f^{-1}$ en $y_0 = f(x_0)$ ?",
        "latex": "(f^{-1})'(y_0) = \\frac{1}{f'(f^{-1}(y_0))} = \\frac{1}{f'(x_0)}",
        "tip": "⚠️ Condition impérative : $f'(x_0)$ doit être NON NUL (tangente verticale sinon).",
        "choices": [
            "\\frac{1}{f'(f^{-1}(y_0))}",
            "f'(f^{-1}(y_0))",
            "-\\frac{1}{[f'(y_0)]^2}",
            "\\frac{1}{f'(y_0)}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PRIM_01",
        "discipline": "Maths",
        "level": "2BAC SM/PC",
        "chapter": "Calcul Intégral",
        "title": "Intégration par parties (IPP)",
        "question": "Quelle est la formule d'IPP pour deux fonctions $u, v$ de classe $\\mathcal{C}^1$ ?",
        "latex": "\\int_a^b u'(t) v(t) \\, dt = \\Big[ u(t) v(t) \\Big]_a^b - \\int_a^b u(t) v'(t) \\, dt",
        "tip": "💡 Règle mnémotechnique ALPES : Arc-tangente, Logarithme, Polynôme, Exponentielle, Sinus.",
        "choices": [
            "[uv]_a^b - \\int_a^b uv' dt",
            "[uv]_a^b + \\int_a^b uv' dt",
            "[u'v']_a^b - \\int_a^b uv dt",
            "\\int_a^b u'v' dt - [uv]_a^b"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PRIM_02",
        "discipline": "Maths",
        "level": "2BAC SM",
        "chapter": "Calcul Intégral",
        "title": "Sommes de Riemann",
        "question": "Quelle est la limite de la somme de Riemann classique pour $f$ continue sur $[a, b]$ ?",
        "latex": "\\lim_{n \\to +\\infty} \\frac{b-a}{n} \\sum_{k=1}^n f\\left(a + k\\frac{b-a}{n}\\right) = \\int_a^b f(x) \\, dx",
        "tip": "💡 Utilisée dans 80% des épreuves nationales SM & CNC pour calculer des limites de sommes discrètes.",
        "choices": [
            "\\int_a^b f(x) \\, dx",
            "\\int_0^1 f(x) \\, dx",
            "\\frac{1}{b-a}\\int_a^b f(x) \\, dx",
            "f(b) - f(a)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_ANA_ROLLE",
        "discipline": "Maths",
        "level": "2BAC SM",
        "chapter": "Théorèmes d'Analyse",
        "title": "Théorème de Rolle",
        "question": "Quelles sont les 3 hypothèses du Théorème de Rolle sur $[a, b]$ et sa conclusion ?",
        "latex": "f \\in \\mathcal{C}([a, b]), \\; f \\text{ dérivable sur } ]a, b[, \\; f(a)=f(b) \\implies \\exists c \\in ]a, b[, \\; f'(c)=0",
        "tip": "⚠️ Dérivabilité sur l'ouvert $]a, b[$, continuité sur le fermé $[a, b]$.",
        "choices": [
            "\\exists c \\in ]a, b[, \\; f'(c) = 0",
            "\\exists c \\in [a, b], \\; f''(c) = 0",
            "\\forall c \\in ]a, b[, \\; f'(c) = 0",
            "\\exists c \\in ]a, b[, \\; f(c) = 0"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_ANA_TAF",
        "discipline": "Maths",
        "level": "2BAC SM / CPGE",
        "chapter": "Théorèmes d'Analyse",
        "title": "Théorème des Accroissements Finis (TAF)",
        "question": "Énoncez la relation du TAF pour $f \\in \\mathcal{C}([a, b])$ dérivable sur $]a, b[$ :",
        "latex": "\\exists c \\in ]a, b[, \\quad f(b) - f(a) = f'(c)(b - a)",
        "tip": "💡 Interprétation géométrique : il existe une tangente parallèle à la corde reliant $(a, f(a))$ et $(b, f(b))$.",
        "choices": [
            "f(b) - f(a) = f'(c)(b - a)",
            "f(b) + f(a) = f'(c)(b + a)",
            "f'(c) = \\frac{f(b) + f(a)}{b - a}",
            "f(b) - f(a) = f''(c)(b - a)^2"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_ANA_EULER",
        "discipline": "Maths",
        "level": "2BAC SM",
        "chapter": "Nombres Complexes",
        "title": "Formules d'Euler & Moivre",
        "question": "Donnez les expressions de $\\cos(\\theta)$ et $\\sin(\\theta)$ selon Euler :",
        "latex": "\\cos(\\theta) = \\frac{e^{i\\theta} + e^{-i\\theta}}{2}, \\quad \\sin(\\theta) = \\frac{e^{i\\theta} - e^{-i\\theta}}{2i}",
        "tip": "💡 Outil indispensable pour la linéarisation d'intégrales trigonométriques.",
        "choices": [
            "\\cos = \\frac{e^{i\\theta}+e^{-i\\theta}}{2}, \\; \\sin = \\frac{e^{i\\theta}-e^{-i\\theta}}{2i}",
            "\\cos = \\frac{e^{i\\theta}-e^{-i\\theta}}{2}, \\; \\sin = \\frac{e^{i\\theta}+e^{-i\\theta}}{2i}",
            "\\cos = e^{i\\theta} + e^{-i\\theta}, \\; \\sin = e^{i\\theta} - e^{-i\\theta}",
            "\\cos = \\frac{e^{i\\theta}+e^{-i\\theta}}{2i}, \\; \\sin = \\frac{e^{i\\theta}-e^{-i\\theta}}{2}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_2BAC_MATH_LIMITS",
        "discipline": "Maths",
        "level": "2BAC",
        "chapter": "Fonctions Log & Exp",
        "title": "Limites Remarquables Log & Exp",
        "question": "Quelles sont les limites fondamentales en 0 pour l'exponentielle et le logarithme népérien ?",
        "latex": "\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1 \\quad \\text{et} \\quad \\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1",
        "tip": "💡 Découle directement de la définition du nombre dérivé de $e^x$ et $\\ln(1+x)$ en 0.",
        "choices": [
            "\\lim_{x \\to 0}\\frac{e^x-1}{x} = 1 \\text{ et } \\lim_{x \\to 0}\\frac{\\ln(1+x)}{x} = 1",
            "\\lim_{x \\to 0}\\frac{e^x-1}{x} = 0",
            "\\lim_{x \\to 0}\\frac{\\ln(1+x)}{x} = 0",
            "\\lim_{x \\to 0}\\frac{e^x-1}{x} = +\\infty"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_2BAC_MATH_BINOMIAL",
        "discipline": "Maths",
        "level": "2BAC",
        "chapter": "Probabilités",
        "title": "Loi Binomiale B(n, p)",
        "question": "Si une variable aléatoire $X$ suit la loi binomiale $\\mathcal{B}(n, p)$, quelle est la probabilité d'obtenir $k$ succès ?",
        "latex": "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k} \\quad \\text{avec } E(X) = n \\cdot p",
        "tip": "💡 Rappel de combinaison : $\\binom{n}{k} = C_n^k = \\frac{n!}{k!(n-k)!}$.",
        "choices": [
            "P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}",
            "P(X=k) = n \\cdot p^k (1-p)",
            "P(X=k) = p^k (1-p)^{n-k}",
            "P(X=k) = \\binom{n}{k} p^{n-k}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PHYS_01",
        "discipline": "Physique",
        "level": "2BAC SM/PC",
        "chapter": "Électricité RLC",
        "title": "Période propre oscillateur LC",
        "question": "Quelle est l'expression de la période propre $T_0$ d'un circuit LC idéal ?",
        "latex": "T_0 = 2\\pi \\sqrt{L C} \\quad \\text{et pulsation} \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}}",
        "tip": "💡 Énergie électromagnétique totale conservée : $E_{tot} = \\frac{1}{2}Cu^2 + \\frac{1}{2}Li^2 = \\text{cste}$.",
        "choices": [
            "T_0 = 2\\pi \\sqrt{LC}",
            "T_0 = \\frac{1}{2\\pi \\sqrt{LC}}",
            "T_0 = 2\\pi LC",
            "T_0 = 2\\pi \\sqrt{\\frac{L}{C}}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_2BAC_PHYS_RC",
        "discipline": "Physique",
        "level": "2BAC",
        "chapter": "Dipôle RC",
        "title": "Constante de Temps Tau (τ) du Circuit RC",
        "question": "Quelle est l'expression de la constante de temps $\\tau$ d'un dipôle RC et la tension à $t = \\tau$ pendant la charge ?",
        "latex": "\\tau = R \\cdot C \\quad \\text{et à } t = \\tau : u_C(\\tau) \\approx 0.63 \\cdot E \\; (63\\%)",
        "tip": "💡 À $t = 5\\tau$, le condensateur est considéré comme complètement chargé ($99.3\\% E$). L'asymptote horizontale est $u_C = E$.",
        "choices": [
            "\\tau = R \\cdot C \\; (u_C(\\tau) = 0.63 E)",
            "\\tau = \\frac{R}{C} \\; (u_C(\\tau) = 0.50 E)",
            "\\tau = \\frac{C}{R} \\; (u_C(\\tau) = 0.37 E)",
            "\\tau = R^2 C"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PHYS_02",
        "discipline": "Physique",
        "level": "2BAC SM/PC",
        "chapter": "Mécanique de Newton",
        "title": "2ème Loi de Newton (RFD)",
        "question": "Énoncez la relation fondamentale de la dynamique dans un référentiel galiléen :",
        "latex": "\\sum \\vec{F}_{ext} = m \\cdot \\vec{a}_G = \\frac{d\\vec{p}}{dt}",
        "tip": "⚠️ Toujours préciser le système étudié et le référentiel supposé galiléen !",
        "choices": [
            "\\sum \\vec{F}_{ext} = m \\vec{a}_G",
            "\\sum \\vec{F}_{ext} = \\vec{0}",
            "\\sum \\vec{F}_{ext} = m \\vec{v}_G",
            "\\vec{F} = \\frac{1}{2} m v^2"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PHYS_03",
        "discipline": "Physique",
        "level": "2BAC SM",
        "chapter": "Physique Nucléaire",
        "title": "Loi de décroissance radioactive",
        "question": "Quelle est l'expression du nombre de noyaux $N(t)$ restants avec la demi-vie $t_{1/2}$ ?",
        "latex": "N(t) = N_0 \\cdot e^{-\\lambda t} \\quad \\text{avec} \\quad t_{1/2} = \\frac{\\ln(2)}{\\lambda}",
        "tip": "💡 Activité $A(t) = -\\frac{dN}{dt} = \\lambda N(t)$ en Becquerels ($1\\text{ Bq} = 1\\text{ désintégration/sec}$).",
        "choices": [
            "N(t) = N_0 e^{-\\lambda t} \\; (t_{1/2} = \\ln 2 / \\lambda)",
            "N(t) = N_0 e^{\\lambda t} \\; (t_{1/2} = \\lambda / \\ln 2)",
            "N(t) = N_0 - \\lambda t",
            "N(t) = \\frac{N_0}{1 + \\lambda t}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PHYS_OPT",
        "discipline": "Physique",
        "level": "2BAC SM/PC / CPGE",
        "chapter": "Optique Ondulatoire",
        "title": "Interfrange Fentes d'Young",
        "question": "Quelle est l'expression de l'interfrange $i$ sur un écran à distance $D$ pour des fentes distantes de $a$ ?",
        "latex": "i = \\frac{\\lambda \\cdot D}{a}",
        "tip": "💡 L'interfrange est la distance séparant deux franges brillantes (ou sombres) consécutives.",
        "choices": [
            "i = \\frac{\\lambda D}{a}",
            "i = \\frac{\\lambda a}{D}",
            "i = \\frac{a D}{\\lambda}",
            "i = \\sqrt{\\frac{\\lambda D}{a}}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CHIM_01",
        "discipline": "Chimie",
        "level": "2BAC SM/PC",
        "chapter": "Équilibre Acido-Basique",
        "title": "Relation d'Henderson-Hasselbalch",
        "question": "Donnez l'expression du pH en fonction du $pK_a$ et des concentrations à l'équilibre :",
        "latex": "pH = pK_a + \\log\\left( \\frac{[A^-]_{eq}}{[AH]_{eq}} \\right)",
        "tip": "💡 Si $[A^-] = [AH]$, alors $pH = pK_a$ (point de demi-équivalence du titrage).",
        "choices": [
            "pH = pK_a + \\log\\left(\\frac{[A^-]}{[AH]}\\right)",
            "pH = pK_a - \\log\\left(\\frac{[A^-]}{[AH]}\\right)",
            "pH = -\\log(pK_a) + [A^-]",
            "pH = pK_a + \\ln\\left(\\frac{[AH]}{[A^-]}\\right)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CHIM_KS",
        "discipline": "Chimie",
        "level": "2BAC SM/PC / CPGE",
        "chapter": "Précipitation",
        "title": "Produit de Solubilité Ks",
        "question": "Expression du $K_s$ pour la dissolution du sel peu soluble $A_n B_m(s)$ :",
        "latex": "K_s = [A^{m+}]^n \\cdot [B^{n-}]^m",
        "tip": "💡 Condition d'apparition du précipité : le quotient réactionnel initial $Q_{r,i}$ dépasse $K_s$.",
        "choices": [
            "K_s = [A^{m+}]^n \\cdot [B^{n-}]^m",
            "K_s = [A^{m+}] + [B^{n-}]",
            "K_s = n [A] \\times m [B]",
            "K_s = \\frac{[A]^n}{[B]^m}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_TAYLOR_01",
        "discipline": "Maths",
        "level": "CPGE MP/PSI",
        "chapter": "Développements Limités",
        "title": "Formule de Taylor-Young",
        "question": "Quelle est la formule de Taylor-Young en 0 à l'ordre $n$ pour $f \\in \\mathcal{C}^n$ ?",
        "latex": "f(x) = \\sum_{k=0}^n \\frac{f^{(k)}(0)}{k!} x^k + o(x^n)",
        "tip": "💡 Clé fondamentale pour tous les équivalents et calculs de limites indéterminées en prépa.",
        "choices": [
            "\\sum_{k=0}^n \\frac{f^{(k)}(0)}{k!} x^k + o(x^n)",
            "\\sum_{k=0}^n f^{(k)}(0) x^k + o(x^n)",
            "\\sum_{k=1}^n \\frac{f^{(k)}(0)}{k} x^k + o(x^n)",
            "\\sum_{k=0}^n \\frac{f^{(k)}(0)}{(k+1)!} x^{k+1} + o(x^n)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_ALG_CAYLEY",
        "discipline": "Maths",
        "level": "CPGE MP/PSI/TSI",
        "chapter": "Réduction",
        "title": "Théorème de Cayley-Hamilton",
        "question": "Quel est l'énoncé fondamental du théorème de Cayley-Hamilton pour $A \\in \\mathcal{M}_n(\\mathbb{K})$ ?",
        "latex": "\\chi_A(A) = 0 \\quad \\text{où} \\quad \\chi_A(X) = \\det(X \\cdot I_n - A)",
        "tip": "💡 Tout endomorphisme annule son polynôme caractéristique. Très utile pour exprimer $A^{-1}$ en fonction des puissances de $A$.",
        "choices": [
            "\\chi_A(A) = 0",
            "\\chi_A(A) = I_n",
            "\\det(A) = \\operatorname{Tr}(A)",
            "A^n = 0"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_ALG_CS",
        "discipline": "Maths",
        "level": "CPGE MP/PSI/TSI",
        "chapter": "Espaces Préhilbertiens",
        "title": "Inégalité de Cauchy-Schwarz",
        "question": "Énoncez l'inégalité de Cauchy-Schwarz dans un espace préhilbertien :",
        "latex": "|\\langle x, y \\rangle| \\le \\|x\\| \\cdot \\|y\\|",
        "tip": "💡 Cas d'égalité ssi les vecteurs $x$ et $y$ sont colinéaires.",
        "choices": [
            "|\\langle x, y \\rangle| \\le \\|x\\| \\cdot \\|y\\|",
            "\\langle x, y \\rangle \\le \\|x + y\\|",
            "\\|x + y\\|^2 \\le \\|x\\|^2 + \\|y\\|^2",
            "|\\langle x, y \\rangle| = \\|x\\| + \\|y\\|"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CPGE_MATH_RANG",
        "discipline": "Maths",
        "level": "CPGE",
        "chapter": "Algèbre Linéaire",
        "title": "Théorème du Rang",
        "question": "Pour une application linéaire $u \\in \\mathcal{L}(E, F)$ avec $E$ de dimension finie :",
        "latex": "\\dim(E) = \\dim(\\ker u) + \\operatorname{rg}(u) = \\dim(\\ker u) + \\dim(\\operatorname{Im} u)",
        "tip": "💡 Corollaire capital : si $\\dim(E) = \\dim(F)$, alors $u$ injective $\\iff u$ surjective $\\iff u$ bijective.",
        "choices": [
            "\\dim(E) = \\dim(\\ker u) + \\dim(\\operatorname{Im} u)",
            "\\dim(E) = \\dim(\\ker u) \\times \\dim(\\operatorname{Im} u)",
            "\\operatorname{rg}(u) = \\dim(F) - \\dim(E)",
            "\\dim(\\ker u) = \\dim(\\operatorname{Im} u)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_ANA_SERIES",
        "discipline": "Maths",
        "level": "CPGE MP/PSI",
        "chapter": "Séries Entières",
        "title": "Règle de d'Alembert pour le Rayon",
        "question": "Si $\\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| = \\ell$, quel est le rayon de convergence $R$ de $\\sum a_n z^n$ ?",
        "latex": "R = \\frac{1}{\\ell} \\quad (\\text{avec convention } \\frac{1}{0} = +\\infty, \\frac{1}{+\\infty} = 0)",
        "tip": "💡 Si la limite n'existe pas, utiliser la règle d'Hadamard ou encadrer par comparaison.",
        "choices": [
            "R = 1 / \\ell",
            "R = \\ell",
            "R = \\sqrt{\\ell}",
            "R = \\ln(\\ell)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CPGE_MATH_GAUSS",
        "discipline": "Maths",
        "level": "CPGE",
        "chapter": "Intégrales Généralisées",
        "title": "Intégrale de Gauss",
        "question": "Quelle est la valeur exacte de l'intégrale de Gauss sur $\\mathbb{R}$ ?",
        "latex": "\\int_{-\\infty}^{+\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi} \\quad \\text{et} \\quad \\int_0^{+\\infty} e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}",
        "tip": "💡 Démonstration classique par passage en coordonnées polaires dans $\\mathbb{R}^2$.",
        "choices": [
            "\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}",
            "\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\pi",
            "\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = 1",
            "\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PHYS_MAXWELL",
        "discipline": "Physique",
        "level": "CPGE MP/PSI",
        "chapter": "Électromagnétisme",
        "title": "Équations de Maxwell-Faraday",
        "question": "Quelle est la relation de Maxwell-Faraday exprimant le phénomène d'induction électromagnétique ?",
        "latex": "\\vec{\\nabla} \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}",
        "tip": "💡 Conduisent avec Maxwell-Ampère à l'équation d'onde de D'Alembert pour la lumière avec $c = 1/\\sqrt{\\varepsilon_0\\mu_0}$.",
        "choices": [
            "\\vec{\\nabla} \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}",
            "\\vec{\\nabla} \\cdot \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}",
            "\\vec{\\nabla} \\times \\vec{B} = \\vec{0}",
            "\\vec{\\nabla} \\times \\vec{E} = \\mu_0 \\vec{j}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PHYS_POYNTING",
        "discipline": "Physique",
        "level": "CPGE MP/PSI",
        "chapter": "Électromagnétisme",
        "title": "Vecteur de Poynting",
        "question": "Quelle est la définition du vecteur de Poynting $\\vec{\\Pi}$ et son unité SI ?",
        "latex": "\\vec{\\Pi} = \\frac{\\vec{E} \\times \\vec{B}}{\\mu_0} \\quad [\\text{W} \\cdot \\text{m}^{-2}]",
        "tip": "💡 Représente la densité volumique ou surfacique de flux de puissance transporté par l'onde électromagnétique.",
        "choices": [
            "\\vec{\\Pi} = \\frac{\\vec{E} \\times \\vec{B}}{\\mu_0} \\; [\\text{W}\\cdot\\text{m}^{-2}]",
            "\\vec{\\Pi} = \\mu_0 (\\vec{E} \\cdot \\vec{B}) \\; [\\text{J}]",
            "\\vec{\\Pi} = \\varepsilon_0 \\frac{\\vec{E}}{\\vec{B}} \\; [\\text{V}]",
            "\\vec{\\Pi} = \\frac{\\vec{B} \\times \\vec{E}}{\\varepsilon_0} \\; [\\text{N}]"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PHYS_TMC",
        "discipline": "Physique",
        "level": "CPGE / 2BAC SM",
        "chapter": "Mécanique du Point",
        "title": "Théorème du Moment Cinétique",
        "question": "Énoncez le TMC par rapport à un point fixe $O$ dans un référentiel galiléen :",
        "latex": "\\frac{d\\vec{L}_O}{dt} = \\sum \\vec{\\mathcal{M}}_O(\\vec{F}_{ext}) \\quad \\text{avec} \\quad \\vec{L}_O = \\vec{OM} \\times (m\\vec{v})",
        "tip": "💡 Si le moment des forces est nul (forces centrales), le moment cinétique est conservé (loi des aires).",
        "choices": [
            "\\frac{d\\vec{L}_O}{dt} = \\sum \\vec{\\mathcal{M}}_O(\\vec{F})",
            "\\frac{d\\vec{L}_O}{dt} = \\vec{v} \\times \\vec{a}",
            "\\vec{L}_O = m \\vec{a} \\times \\vec{r}",
            "\\frac{d\\vec{L}_O}{dt} = \\vec{0}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_PHYS_THERMO1",
        "discipline": "Physique",
        "level": "CPGE MP/PSI/TSI",
        "chapter": "Thermodynamique",
        "title": "Premier Principe de la Thermo",
        "question": "Donnez l'expression différentielle et intégrée du 1er principe pour un système fermé :",
        "latex": "dU = \\delta W + \\delta Q \\implies \\Delta U = W + Q",
        "tip": "💡 Pour un gaz parfait (1ère loi de Joule) : $dU = C_v dT$ et $dH = C_p dT$.",
        "choices": [
            "dU = \\delta W + \\delta Q",
            "dU = \\delta W - T dS",
            "dH = \\delta Q - V dP",
            "\\Delta U = W - Q"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CHIM_NERNST",
        "discipline": "Chimie",
        "level": "2BAC SM/PC / CPGE",
        "chapter": "Électrochimie",
        "title": "Formule de Nernst",
        "question": "Potentiel d'électrode pour le couple $\\alpha \\text{Ox} + n e^- \\rightleftharpoons \\beta \\text{Red}$ à 25°C :",
        "latex": "E = E^\\circ + \\frac{0.059}{n} \\log\\left( \\frac{[\\text{Ox}]^\\alpha}{[\\text{Red}]^\\beta} \\right)",
        "tip": "💡 À l'équilibre électrochimique (pile complètement déchargée) : $\\Delta E = E_{\\text{cathode}} - E_{\\text{anode}} = 0$.",
        "choices": [
            "E = E^\\circ + \\frac{0.059}{n} \\log\\left( \\frac{[\\text{Ox}]^\\alpha}{[\\text{Red}]^\\beta} \\right)",
            "E = E^\\circ - \\frac{0.059}{n} \\log\\left( \\frac{[\\text{Ox}]^\\alpha}{[\\text{Red}]^\\beta} \\right)",
            "E = E^\\circ + \\frac{RT}{n} [\\text{Ox}]",
            "E = \\frac{E^\\circ}{n} + 0.059 \\log(K)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CHIM_ARRHENIUS",
        "discipline": "Chimie",
        "level": "CPGE / 2BAC SM",
        "chapter": "Cinétique Chimique",
        "title": "Loi d'Arrhenius",
        "question": "Comment varie la constante de vitesse $k$ en fonction de la température $T$ ?",
        "latex": "k = A \\cdot \\exp\\left(-\\frac{E_a}{R \\cdot T}\\right)",
        "tip": "💡 Tracer $\\ln(k)$ en fonction de $1/T$ donne une droite de pente négative $-\\frac{E_a}{R}$.",
        "choices": [
            "k = A \\exp\\left(-\\frac{E_a}{RT}\\right)",
            "k = A \\exp\\left(+\\frac{E_a}{RT}\\right)",
            "k = A \\cdot R \\cdot T",
            "k = \\frac{E_a}{RT}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_INFO_01",
        "discipline": "Informatique",
        "level": "CPGE / SM",
        "chapter": "Algorithmique",
        "title": "Complexité du Quicksort",
        "question": "Complexité temporelle moyenne et au pire cas du tri rapide (Quicksort) :",
        "latex": "T_{\\text{moyen}}(n) = \\mathcal{O}(n \\log n), \\quad T_{\\text{pire}}(n) = \\mathcal{O}(n^2)",
        "tip": "💡 Le pire cas survient lorsque le pivot choisi est systématiquement l'élément extrême (tableau déjà trié).",
        "choices": [
            "\\mathcal{O}(n \\log n) \\text{ moyen, } \\mathcal{O}(n^2) \\text{ pire}",
            "\\mathcal{O}(n^2) \\text{ moyen, } \\mathcal{O}(n^3) \\text{ pire}",
            "\\mathcal{O}(n) \\text{ moyen, } \\mathcal{O}(n \\log n) \\text{ pire}",
            "\\mathcal{O}(\\log n) \\text{ partout}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_INFO_02",
        "discipline": "Informatique",
        "level": "CPGE / SM",
        "chapter": "Graphes",
        "title": "Algorithme de Dijkstra",
        "question": "Complexité temporelle de Dijkstra avec file de priorité (tas binaire) :",
        "latex": "\\mathcal{O}\\big((|V| + |E|) \\log |V|\\big)",
        "tip": "⚠️ Exige impérativement des poids d'arêtes STRICTEMENT positifs ou nuls.",
        "choices": [
            "\\mathcal{O}\\big((|V| + |E|) \\log |V|\\big)",
            "\\mathcal{O}(|V|^3)",
            "\\mathcal{O}(|E| \\cdot |V|)",
            "\\mathcal{O}(\\log |V|)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_INFO_DICHO",
        "discipline": "Informatique",
        "level": "CPGE / SM",
        "chapter": "Algorithmique",
        "title": "Recherche par Dichotomie",
        "question": "Quelle est la complexité dans le pire des cas d'une dichotomie sur un tableau trié de taille $n$ ?",
        "latex": "\\mathcal{O}(\\log n)",
        "tip": "💡 Divise l'espace de recherche par deux à chaque étape de comparaison.",
        "choices": [
            "\\mathcal{O}(\\log n)",
            "\\mathcal{O}(n)",
            "\\mathcal{O}(n \\log n)",
            "\\mathcal{O}(1)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_INFO_SQL",
        "discipline": "Informatique",
        "level": "CPGE / Concours",
        "chapter": "SQL & Bases",
        "title": "Ordre d'Évaluation Logique SQL",
        "question": "Dans quel ordre logique le moteur SQL évalue-t-il les clauses d'une requête ?",
        "latex": "\\text{FROM} \\to \\text{WHERE} \\to \\text{GROUP BY} \\to \\text{HAVING} \\to \\text{SELECT} \\to \\text{ORDER BY}",
        "tip": "💡 C'est pourquoi un alias défini dans SELECT n'est PAS accessible dans la clause WHERE !",
        "choices": [
            "FROM \\to WHERE \\to GROUP BY \\to HAVING \\to SELECT \\to ORDER BY",
            "SELECT \\to FROM \\to WHERE \\to GROUP BY \\to ORDER BY",
            "WHERE \\to FROM \\to SELECT \\to ORDER BY",
            "FROM \\to SELECT \\to WHERE \\to HAVING"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_MATH_HOPITAL",
        "discipline": "Maths",
        "level": "Concours",
        "chapter": "Calcul Différentiel",
        "title": "Règle de L'Hôpital (Speedrun Limites)",
        "question": "Dans un concours QCM (ENSA/ENSAM), comment lever instantanément une forme indéterminée $\\frac{0}{0}$ ou $\\frac{\\infty}{\\infty}$ ?",
        "latex": "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)} \\quad \\text{(si } g'(a) \\neq 0 \\text{ et la limite existe)}",
        "tip": "⚡ Gain de temps concours : dérivez numérateur et dénominateur séparément (ne pas calculer la dérivée du quotient !).",
        "choices": [
            "\\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
            "\\lim_{x \\to a} \\frac{f'(x)g(x) - f(x)g'(x)}{g(x)^2}",
            "\\lim_{x \\to a} \\frac{f''(x)}{g(x)}",
            "\\lim_{x \\to a} [f'(x) - g'(x)]"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_MATH_EQUIV",
        "discipline": "Maths",
        "level": "Concours",
        "chapter": "Développements & Équivalents",
        "title": "Équivalents Usuels en 0 (Speedrun QCM)",
        "question": "Quels sont les équivalents usuels fondamentaux au voisinage de 0 pour $\\sin(x)$, $\\ln(1+x)$ et $1-\\cos(x)$ ?",
        "latex": "\\sin(x) \\sim x, \\quad \\ln(1+x) \\sim x, \\quad e^x - 1 \\sim x, \\quad 1 - \\cos(x) \\sim \\frac{x^2}{2}",
        "tip": "⚠️ Attention piège mortel en concours : On ne somme JAMAIS les équivalents ! Valable uniquement pour produits et quotients.",
        "choices": [
            "\\sin x \\sim x, \\; \\ln(1+x) \\sim x, \\; 1-\\cos x \\sim \\frac{x^2}{2}",
            "\\sin x \\sim 1, \\; 1-\\cos x \\sim x",
            "\\ln(1+x) \\sim x^2, \\; e^x-1 \\sim x",
            "\\sin x \\sim x^3"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_MATH_STIRLING",
        "discipline": "Maths",
        "level": "CPGE / Concours",
        "chapter": "Suites & Factorielle",
        "title": "Formule de Stirling",
        "question": "Quel est l'équivalent asymptotique de la factorielle $n!$ quand $n \\to +\\infty$ ?",
        "latex": "n! \\sim \\sqrt{2\\pi n} \\cdot \\left(\\frac{n}{e}\\right)^n",
        "tip": "💡 Très fréquent dans les épreuves CNC, ENSA et Mines pour évaluer la convergence de séries comportant $n!$.",
        "choices": [
            "n! \\sim \\sqrt{2\\pi n} \\left(\\frac{n}{e}\\right)^n",
            "n! \\sim n^n e^{-n}",
            "n! \\sim \\sqrt{\\pi n} \\left(\\frac{e}{n}\\right)^n",
            "n! \\sim n! e^n"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_MATH_WALLIS",
        "discipline": "Maths",
        "level": "CPGE / Concours",
        "chapter": "Intégrales de Wallis",
        "title": "Relation de Récurrence de Wallis",
        "question": "Pour $W_n = \\int_0^{\\pi/2} \\sin^n(t) \\, dt$, quelle relation de récurrence lie $W_{n+2}$ à $W_n$ ?",
        "latex": "W_{n+2} = \\frac{n+1}{n+2} \\cdot W_n \\quad \\text{avec } W_0 = \\frac{\\pi}{2} \\text{ et } W_1 = 1",
        "tip": "💡 Permet de démontrer la formule de Stirling et le produit infini de Wallis pour $\\pi$.",
        "choices": [
            "W_{n+2} = \\frac{n+1}{n+2} W_n",
            "W_{n+2} = \\frac{n}{n+1} W_n",
            "W_{n+2} = \\frac{n+2}{n+1} W_n",
            "W_{n+2} = W_n + \\frac{\\pi}{2}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_MATH_HARMONIC",
        "discipline": "Maths",
        "level": "CPGE / Concours",
        "chapter": "Séries Numériques",
        "title": "Développement Asymptotique Série Harmonique",
        "question": "Quel est le comportement asymptotique de la somme partielle harmonique $H_n = \\sum_{k=1}^n \\frac{1}{k}$ ?",
        "latex": "\\sum_{k=1}^n \\frac{1}{k} = \\ln(n) + \\gamma + o(1) \\quad \\text{où } \\gamma \\approx 0.5772 \\text{ (Constante d'Euler-Mascheroni)}",
        "tip": "💡 Prouve que la série harmonique diverge à vitesse logarithmique.",
        "choices": [
            "H_n = \\ln(n) + \\gamma + o(1)",
            "H_n = n \\ln(n)",
            "H_n = \\frac{n(n+1)}{2}",
            "H_n = \\pi + \\ln(n)"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_PHYS_DIV_TENSION",
        "discipline": "Physique",
        "level": "Concours",
        "chapter": "Électrocinétique",
        "title": "Pont Diviseur de Tension Express",
        "question": "Dans une branche de deux résistances $R_1$ et $R_2$ en série soumise à la tension totale $U$, que vaut la tension $U_2$ aux bornes de $R_2$ ?",
        "latex": "U_2 = U \\cdot \\frac{R_2}{R_1 + R_2}",
        "tip": "💡 Pour un pont diviseur de courant avec $R_1$ et $R_2$ en parallèle : $I_2 = I \\cdot \\frac{R_1}{R_1 + R_2}$ (résistance opposée au numérateur).",
        "choices": [
            "U_2 = U \\cdot \\frac{R_2}{R_1 + R_2}",
            "U_2 = U \\cdot \\frac{R_1}{R_1 + R_2}",
            "U_2 = U \\cdot \\frac{R_1 + R_2}{R_2}",
            "U_2 = U \\cdot \\frac{R_1 R_2}{R_1 + R_2}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_PHYS_PASSE_BAS",
        "discipline": "Physique",
        "level": "Concours",
        "chapter": "Filtres Électroniques",
        "title": "Fréquence de Coupure Filtre RC Passe-Bas",
        "question": "Quelle est la pulsation de coupure $\\omega_c$ et la fréquence de coupure $f_c$ d'un filtre passe-bas RC du premier ordre ?",
        "latex": "\\omega_c = \\frac{1}{R C} \\implies f_c = \\frac{1}{2\\pi R C} \\quad \\text{(Gain atténué de } -3\\text{ dB à } f_c)",
        "tip": "💡 À la fréquence de coupure, la tension de sortie vaut $U_s = \\frac{U_e}{\\sqrt{2}} \\approx 0.707 U_e$.",
        "choices": [
            "f_c = \\frac{1}{2\\pi R C}",
            "f_c = 2\\pi R C",
            "f_c = \\frac{R}{2\\pi C}",
            "f_c = \\frac{1}{\\sqrt{LC}}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_PHYS_CARNOT",
        "discipline": "Physique",
        "level": "CPGE / Concours",
        "chapter": "Thermodynamique",
        "title": "Rendement Maximal de Carnot",
        "question": "Quel est le rendement maximal théorique d'une machine thermique ditherme entre la source froide $T_F$ et la source chaude $T_C$ ?",
        "latex": "\\eta_{\\text{Carnot}} = 1 - \\frac{T_F}{T_C} \\quad \\text{avec les températures en Kelvins [K]}",
        "tip": "⚠️ Toujours convertir les températures en Kelvins ($T[\\text{K}] = \\theta[\\text{°C}] + 273.15$) avant d'effectuer le calcul !",
        "choices": [
            "\\eta = 1 - \\frac{T_F}{T_C}",
            "\\eta = 1 - \\frac{T_C}{T_F}",
            "\\eta = \\frac{T_F}{T_C}",
            "\\eta = 1 + \\frac{T_F}{T_C}"
        ],
        "correctIndex": 0
    },
    {
        "id": "FC_CONC_CHIM_ORDRE1",
        "discipline": "Chimie",
        "level": "Concours",
        "chapter": "Cinétique Chimique",
        "title": "Cinétique d'Ordre 1 & Demi-Vie",
        "question": "Pour une réaction d'ordre 1 ($v = k[A]$), quelle est la relation entre le temps de demi-réaction $t_{1/2}$ et la constante de vitesse $k$ ?",
        "latex": "t_{1/2} = \\frac{\\ln(2)}{k} \\approx \\frac{0.693}{k} \\quad (\\text{indépendant de la concentration initiale } [A]_0)",
        "tip": "💡 Si $t_{1/2}$ reste invariant quand on double la concentration initiale, la réaction est nécessairement d'ordre 1.",
        "choices": [
            "t_{1/2} = \\frac{\\ln 2}{k}",
            "t_{1/2} = \\frac{1}{k [A]_0}",
            "t_{1/2} = \\frac{[A]_0}{2k}",
            "t_{1/2} = k \\cdot \\ln 2"
        ],
        "correctIndex": 0
    }
];

class FlashcardViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.mode = "leitner"; // "leitner" | "qcm" | "blitz"
        this.currentIndex = 0;
        this.isFlipped = false;
        
        // Filtering state with persistent level
        this.selectedDiscipline = "All";
        this.selectedLevel = localStorage.getItem("ss_fc_selected_level") || "All";
        this.selectedBox = "All"; // "All" | 1 | 2 | 3
        this.searchQuery = "";

        // Leitner Boxes: Map cardId -> box (1, 2, or 3)
        this.leitnerData = this.loadLeitnerData();

        // QCM mode state
        this.selectedChoiceIndex = null;
        this.isChoiceSubmitted = false;

        // Blitz 60s Mode state
        this.blitzTimer = null;
        this.blitzTimeLeft = 60;
        this.blitzScore = 0;
        this.blitzStreak = 0;
        this.blitzActive = false;

        // Session Stats
        this.sessionCardsSeen = 0;
        this.sessionCorrect = 0;

        this.bindGlobalKeyboard();
    }

    loadLeitnerData() {
        try {
            const raw = localStorage.getItem("ss_leitner_boxes_v2");
            if (raw) return JSON.parse(raw);
        } catch (e) {}

        // Fallback from old legacy storage if present
        const oldMastered = new Set(JSON.parse(localStorage.getItem("ss_mastered_cards") || "[]"));
        const map = {};
        STUDY_FLASHCARDS.forEach(c => {
            map[c.id] = oldMastered.has(c.id) ? 3 : 1;
        });
        return map;
    }

    saveLeitnerData() {
        try {
            localStorage.setItem("ss_leitner_boxes_v2", JSON.stringify(this.leitnerData));
        } catch (e) {}
    }

    matchesLevel(cardLevel, targetLevel) {
        if (!targetLevel || targetLevel === "All") return true;
        const cl = String(cardLevel).toUpperCase();
        const tl = String(targetLevel).toUpperCase();

        if (tl === "3AC" || tl.includes("COLLÈGE") || tl.includes("COLLEGE")) {
            return cl.includes("3AC") || cl.includes("COLLÈGE") || cl.includes("COLLEGE");
        }
        if (tl === "TC" || tl.includes("TRONC")) {
            return cl.includes("TC") || cl.includes("TRONC");
        }
        if (tl === "1BAC") {
            return cl.includes("1BAC") || cl.includes("1 BAC") || cl.includes("1ÈRE BAC") || cl.includes("1ERE BAC");
        }
        if (tl === "2BAC") {
            return cl.includes("2BAC") || cl.includes("2 BAC") || cl.includes("2ÈME BAC") || cl.includes("2EME BAC") || cl.includes("WATANI");
        }
        if (tl === "CPGE") {
            return cl.includes("CPGE") || cl.includes("MPSI") || cl.includes("PCSI") || cl.includes("MP") || cl.includes("PSI") || cl.includes("TSI");
        }
        if (tl === "CONCOURS" || tl.includes("CNC") || tl.includes("ENSA") || tl.includes("MÉDECINE") || tl.includes("MEDECINE")) {
            return cl.includes("CONCOURS") || cl.includes("CNC") || cl.includes("ENSA") || cl.includes("ENSAM") || cl.includes("MÉDECINE") || cl.includes("MEDECINE");
        }
        return cl.includes(tl);
    }

    getLevelCounts() {
        const levels = ["All", "CPGE", "Concours", "2BAC", "1BAC", "TC", "3AC"];
        const counts = {};
        levels.forEach(lvl => {
            counts[lvl] = STUDY_FLASHCARDS.filter(c => this.matchesLevel(c.level, lvl)).length;
        });
        return counts;
    }

    getFilteredCards() {
        return STUDY_FLASHCARDS.filter(c => {
            if (this.selectedDiscipline !== "All" && c.discipline !== this.selectedDiscipline) return false;
            if (!this.matchesLevel(c.level, this.selectedLevel)) return false;
            if (this.selectedBox !== "All" && this.leitnerData[c.id] !== Number(this.selectedBox)) return false;
            if (this.searchQuery.trim()) {
                const q = this.searchQuery.toLowerCase();
                const matched = c.title.toLowerCase().includes(q) ||
                                c.chapter.toLowerCase().includes(q) ||
                                c.question.toLowerCase().includes(q);
                if (!matched) return false;
            }
            return true;
        });
    }

    getStats(scopedCards) {
        const cardsToMeasure = scopedCards || (this.selectedLevel === "All" ? STUDY_FLASHCARDS : STUDY_FLASHCARDS.filter(c => this.matchesLevel(c.level, this.selectedLevel)));
        let box1 = 0, box2 = 0, box3 = 0;
        cardsToMeasure.forEach(c => {
            const b = this.leitnerData[c.id] || 1;
            if (b === 3) box3++;
            else if (b === 2) box2++;
            else box1++;
        });
        const total = Math.max(1, cardsToMeasure.length);
        const actualTotal = cardsToMeasure.length;
        const pctMastered = Math.round((box3 / total) * 100);
        return { box1, box2, box3, total: actualTotal, pctMastered };
    }

    bindGlobalKeyboard() {
        document.addEventListener("keydown", (e) => {
            const flashcardTab = document.getElementById("tab-flashcards");
            if (!flashcardTab || flashcardTab.classList.contains("hidden")) return;
            if (e.target.matches("input, textarea, select")) return;

            if (e.code === "Space" || e.key === " ") {
                e.preventDefault();
                this.handleFlipCard();
            } else if (e.key === "ArrowRight") {
                this.navigateCard(1);
            } else if (e.key === "ArrowLeft") {
                this.navigateCard(-1);
            } else if (e.key === "1" && this.isFlipped) {
                this.rateCard(1);
            } else if (e.key === "2" && this.isFlipped) {
                this.rateCard(2);
            } else if (e.key === "3" && this.isFlipped) {
                this.rateCard(3);
            } else if (e.key.toLowerCase() === "s") {
                this.shuffleCards();
            }
        });
    }

    render() {
        if (!this.container) return;

        if (this.mode === "blitz") {
            this.renderBlitzMode();
        } else {
            this.renderStandardMode();
        }

        // Render KaTeX formulas
        if (window.renderMathInElement) {
            this.container.querySelectorAll(".fc-latex-render").forEach(el => {
                try {
                    window.renderMathInElement(el, {
                        delimiters: [
                            { left: "$$", right: "$$", display: true },
                            { left: "$", right: "$", display: false }
                        ],
                        throwOnError: false
                    });
                } catch (e) {}
            });
        }
    }

    renderStandardMode() {
        const cards = this.getFilteredCards();
        const stats = this.getStats();
        const levelCounts = this.getLevelCounts();

        if (this.currentIndex >= cards.length) this.currentIndex = 0;
        const card = cards[this.currentIndex] || cards[0];
        const currentBox = card ? (this.leitnerData[card.id] || 1) : 1;

        const levelOptions = [
            { id: "All", label: "✨ Tous les Niveaux", shortLabel: "✨ Tous", count: levelCounts["All"] },
            { id: "CPGE", label: "🏛️ CPGE (MPSI/PCSI/MP/PSI)", shortLabel: "🏛️ CPGE", count: levelCounts["CPGE"] },
            { id: "Concours", label: "🏆 Concours (ENSA/ENSAM/Méd/CNC)", shortLabel: "🏆 Concours", count: levelCounts["Concours"] },
            { id: "2BAC", label: "🎯 2BAC (National SM/PC/SVT)", shortLabel: "🎯 2BAC", count: levelCounts["2BAC"] },
            { id: "1BAC", label: "📐 1BAC (Régional SM/Sc. Exp)", shortLabel: "📐 1BAC", count: levelCounts["1BAC"] },
            { id: "TC", label: "🌱 Tronc Commun (TCS/TCT)", shortLabel: "🌱 Tronc Commun", count: levelCounts["TC"] },
            { id: "3AC", label: "📘 Collège (3AC Brevet/Régional)", shortLabel: "📘 Collège (3AC)", count: levelCounts["3AC"] }
        ];

        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-xl mx-auto space-y-3.5 w-full">
                
                <!-- TOP HEADER & CONTROLS -->
                <div class="w-full glass-panel rounded-2xl p-3 border border-brand-borderSubtle shadow-xl flex flex-col gap-2.5">
                    
                    <!-- Title & Mode Tabs -->
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cherry via-brand-gold to-brand-goldLight p-0.5 shadow-md flex items-center justify-center text-brand-darker font-black text-sm">
                                🃏
                            </div>
                            <div>
                                <h3 class="text-xs sm:text-sm font-black font-outfit text-white tracking-wide flex items-center gap-1.5">
                                    Flashcards d'Élite <span class="text-[10px] text-brand-gold font-mono px-1.5 py-0.2 rounded bg-brand-gold/10 border border-brand-gold/30">Morocco All Levels</span>
                                </h3>
                                <p class="text-[10px] text-brand-muted">Mémorisation Leitner • 3AC, TC, 1BAC, 2BAC, CPGE & Concours</p>
                            </div>
                        </div>

                        <!-- Mode Switcher -->
                        <div class="flex items-center gap-1 bg-brand-darker p-1 rounded-xl border border-brand-borderSubtle text-[11px] font-outfit font-bold">
                            <button id="fc-mode-leitner" class="px-2.5 py-1 rounded-lg transition ${this.mode === 'leitner' ? 'bg-brand-cherry text-white shadow font-black border border-brand-gold/40' : 'text-brand-muted hover:text-white'}">
                                🗃️ 3D Flip
                            </button>
                            <button id="fc-mode-qcm" class="px-2.5 py-1 rounded-lg transition ${this.mode === 'qcm' ? 'bg-brand-cherry text-white shadow font-black border border-brand-gold/40' : 'text-brand-muted hover:text-white'}">
                                🎯 Active Recall
                            </button>
                            <button id="fc-mode-blitz" class="px-2.5 py-1 rounded-lg transition ${this.mode === 'blitz' ? 'bg-brand-cherry text-white shadow font-black border border-brand-gold/40' : 'text-brand-muted hover:text-white'}">
                                ⚡ Blitz 60s
                            </button>
                        </div>
                    </div>

                    <!-- INTERACTIVE ACADEMIC LEVEL CHIPS SELECTOR -->
                    <div class="w-full pt-1">
                        <div class="text-[10px] text-brand-gold font-outfit font-black tracking-wider uppercase flex items-center gap-1 mb-1.5">
                            <i class="fa-solid fa-layer-group text-[9px]"></i> Niveau Scolaire (Sélection Rapide) :
                        </div>
                        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
                            ${levelOptions.map(opt => {
                                const isActive = this.selectedLevel === opt.id;
                                const activeClass = isActive 
                                    ? "bg-gradient-to-r from-brand-cherry to-brand-cherryDark text-white ring-2 ring-brand-gold/60 border border-brand-gold font-black shadow-md shadow-brand-cherry/40 scale-[1.02]"
                                    : "bg-brand-darker text-slate-300 hover:text-white hover:bg-white/5 border border-brand-borderSubtle font-semibold";
                                return `
                                    <button data-level="${opt.id}" class="fc-level-chip shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-outfit transition-all flex items-center gap-1.5 active:scale-95 ${activeClass}">
                                        <span>${opt.shortLabel}</span>
                                        <span class="text-[9px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/50 text-brand-goldLight border border-brand-gold/40' : 'bg-white/5 text-brand-muted'}">
                                            ${opt.count}
                                        </span>
                                    </button>
                                `;
                            }).join("")}
                        </div>
                    </div>

                    <!-- LEITNER MASTERY METRICS SCOPED TO SELECTED LEVEL -->
                    <div class="grid grid-cols-4 gap-1.5 pt-1 text-center font-outfit">
                        <div class="p-1.5 rounded-xl bg-brand-darker border border-brand-borderSubtle flex flex-col items-center">
                            <span class="text-[9px] text-brand-muted font-bold">Total (${this.selectedLevel})</span>
                            <span class="text-xs font-black text-white font-mono">${stats.total}</span>
                        </div>
                        <div class="p-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex flex-col items-center">
                            <span class="text-[9px] text-rose-300 font-bold">Box 1 (À Revoir)</span>
                            <span class="text-xs font-black text-rose-400 font-mono">${stats.box1}</span>
                        </div>
                        <div class="p-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex flex-col items-center">
                            <span class="text-[9px] text-amber-300 font-bold">Box 2 (En Cours)</span>
                            <span class="text-xs font-black text-amber-400 font-mono">${stats.box2}</span>
                        </div>
                        <div class="p-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col items-center">
                            <span class="text-[9px] text-emerald-300 font-bold">Box 3 (Maîtrisé)</span>
                            <span class="text-xs font-black text-emerald-400 font-mono">${stats.box3} (${stats.pctMastered}%)</span>
                        </div>
                    </div>

                    <!-- PROGRESS BAR -->
                    <div class="w-full bg-brand-darker h-2 rounded-full overflow-hidden border border-brand-borderSubtle flex">
                        <div style="width: ${stats.total > 0 ? (stats.box1 / stats.total) * 100 : 0}%" class="bg-rose-500/70 transition-all duration-300" title="Box 1"></div>
                        <div style="width: ${stats.total > 0 ? (stats.box2 / stats.total) * 100 : 0}%" class="bg-amber-500/70 transition-all duration-300" title="Box 2"></div>
                        <div style="width: ${stats.total > 0 ? (stats.box3 / stats.total) * 100 : 0}%" class="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 shadow-sm" title="Box 3"></div>
                    </div>

                    <!-- FILTER & SEARCH BAR -->
                    <div class="flex items-center gap-1.5 flex-wrap pt-1">
                        <div class="relative flex-1 min-w-[130px]">
                            <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-muted"></i>
                            <input id="fc-search-input" type="text" placeholder="Rechercher (ex: Pythagore, Rolle, RLC...)" value="${this.searchQuery}" class="w-full bg-brand-darker border border-brand-borderSubtle rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-brand-muted/60 focus:outline-none focus:border-brand-gold font-outfit" />
                        </div>

                        <!-- Level Dropdown Selector -->
                        <select id="fc-filter-level" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2.5 py-1.5 text-xs text-brand-gold font-outfit font-bold focus:outline-none focus:border-brand-gold">
                            ${levelOptions.map(opt => `
                                <option value="${opt.id}" ${this.selectedLevel === opt.id ? 'selected' : ''}>${opt.label}</option>
                            `).join("")}
                        </select>

                        <!-- Discipline Filter -->
                        <select id="fc-filter-discipline" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2.5 py-1.5 text-xs text-brand-goldLight font-outfit font-bold focus:outline-none focus:border-brand-gold">
                            <option value="All" ${this.selectedDiscipline === 'All' ? 'selected' : ''}>Toutes Matières</option>
                            <option value="Maths" ${this.selectedDiscipline === 'Maths' ? 'selected' : ''}>📐 Maths</option>
                            <option value="Physique" ${this.selectedDiscipline === 'Physique' ? 'selected' : ''}>⚛️ Physique</option>
                            <option value="Chimie" ${this.selectedDiscipline === 'Chimie' ? 'selected' : ''}>🧪 Chimie</option>
                            <option value="Informatique" ${this.selectedDiscipline === 'Informatique' ? 'selected' : ''}>💻 Informatique</option>
                        </select>

                        <!-- Box Filter -->
                        <select id="fc-filter-box" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2 py-1.5 text-xs text-brand-goldLight font-outfit font-bold focus:outline-none focus:border-brand-gold">
                            <option value="All" ${this.selectedBox === 'All' ? 'selected' : ''}>Toutes Boîtes</option>
                            <option value="1" ${this.selectedBox === '1' ? 'selected' : ''}>🔴 Box 1</option>
                            <option value="2" ${this.selectedBox === '2' ? 'selected' : ''}>🟡 Box 2</option>
                            <option value="3" ${this.selectedBox === '3' ? 'selected' : ''}>🟢 Box 3</option>
                        </select>
                    </div>
                </div>

                <!-- MAIN CARD STAGE -->
                ${cards.length === 0 ? `
                    <div class="w-full glass-card p-8 rounded-2xl border border-brand-borderSubtle text-center space-y-2">
                        <i class="fa-solid fa-filter-circle-xmark text-3xl text-brand-muted/50 mb-2"></i>
                        <h4 class="text-sm font-bold text-white font-outfit">Aucune flashcard ne correspond à vos filtres</h4>
                        <p class="text-xs text-brand-muted">Essayez d'effacer votre recherche ou de changer de niveau / boîte Leitner.</p>
                        <button id="fc-reset-filters" class="mt-2 px-3 py-1.5 rounded-xl bg-brand-cherry text-white text-xs font-bold font-outfit">
                            Réinitialiser les Filtres
                        </button>
                    </div>
                ` : `
                    <!-- 3D PERSPECTIVE CARD -->
                    <div class="w-full perspective-1000">
                        <div id="fc-interactive-card" class="relative w-full min-h-[310px] rounded-2xl cursor-pointer transition-all duration-300 transform-style-3d select-none group">
                            
                            <!-- CARD INNER WRAPPER -->
                            <div class="w-full h-full min-h-[310px] rounded-2xl glass-card border ${currentBox === 3 ? 'border-emerald-500/50 shadow-emerald-950/40' : (currentBox === 2 ? 'border-amber-500/40' : 'border-brand-borderSubtle')} p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-brand-gold/60">
                                
                                <!-- Decorative Ambient Glow -->
                                <div class="absolute -right-12 -top-12 w-32 h-32 bg-brand-cherry/20 rounded-full blur-2xl pointer-events-none"></div>

                                <!-- CARD TOP ROW -->
                                <div class="flex items-center justify-between gap-2 z-10 flex-wrap">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-darker text-brand-goldLight border border-brand-borderSubtle font-bold">
                                            ${card.discipline} • ${card.chapter}
                                        </span>
                                        <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-cherry/20 text-brand-gold border border-brand-gold/30 font-bold">
                                            ${card.level}
                                        </span>
                                    </div>

                                    <!-- Leitner Box Badge & Flip hint -->
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-[10px] font-outfit font-black px-2 py-0.5 rounded-full border ${currentBox === 3 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : (currentBox === 2 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40')}">
                                            ${currentBox === 3 ? '🟢 Box 3 (Maîtrisé)' : (currentBox === 2 ? '🟡 Box 2 (En Cours)' : '🔴 Box 1 (À Revoir)')}
                                        </span>
                                        <span class="text-xs text-brand-muted group-hover:text-brand-gold transition ml-1" title="Cliquez ou Espace pour retourner">
                                            <i class="fa-solid fa-arrows-rotate"></i>
                                        </span>
                                    </div>
                                </div>

                                <!-- CARD BODY -->
                                <div class="my-4 text-center flex flex-col items-center justify-center flex-1 z-10 px-2">
                                    ${this.mode === 'leitner' ? `
                                        <!-- LEITNER FLIP MODE -->
                                        ${!this.isFlipped ? `
                                            <span class="text-xs uppercase tracking-widest text-brand-gold font-black font-outfit mb-2">
                                                ${card.title}
                                            </span>
                                            <div class="text-sm sm:text-base font-bold text-white leading-relaxed fc-latex-render px-1 max-w-full overflow-x-auto">
                                                ${card.question}
                                            </div>
                                            <span class="text-[11px] text-brand-muted mt-4 italic flex items-center gap-1.5 font-outfit font-semibold">
                                                <i class="fa-solid fa-hand-pointer text-brand-gold animate-bounce"></i> Cliquez ou appuyez sur [Espace] pour révéler la formule
                                            </span>
                                        ` : `
                                            <span class="text-xs uppercase tracking-widest text-emerald-400 font-black font-outfit mb-2 flex items-center gap-1">
                                                <i class="fa-solid fa-check"></i> Formule d'Excellence
                                            </span>
                                            <div class="my-2 p-3 rounded-xl bg-brand-darker border border-brand-borderSubtle text-brand-goldLight font-mono text-sm sm:text-base font-bold shadow-inner fc-latex-render max-w-full overflow-x-auto">
                                                $$${card.latex}$$
                                            </div>
                                            <div class="text-[11px] text-slate-200 mt-2 p-2.5 rounded-xl bg-brand-card/90 border border-brand-borderSubtle text-left leading-normal font-sans font-medium w-full shadow">
                                                ${card.tip}
                                            </div>
                                        `}
                                    ` : `
                                        <!-- ACTIVE RECALL QCM MODE -->
                                        <span class="text-xs uppercase tracking-widest text-brand-gold font-black font-outfit mb-2">
                                            ${card.title}
                                        </span>
                                        <div class="text-sm font-bold text-white leading-relaxed fc-latex-render px-1 mb-3">
                                            ${card.question}
                                        </div>

                                        <!-- 4 Multiple Choice Grid -->
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-left">
                                            ${(card.choices || []).map((ch, idx) => {
                                                const isSelected = this.selectedChoiceIndex === idx;
                                                const isCorrect = idx === card.correctIndex;
                                                let btnClass = "bg-brand-darker hover:bg-white/5 border-brand-borderSubtle text-white";

                                                if (this.isChoiceSubmitted) {
                                                    if (isCorrect) {
                                                        btnClass = "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-black shadow-lg shadow-emerald-950/40";
                                                    } else if (isSelected) {
                                                        btnClass = "bg-rose-950/80 border-rose-500 text-rose-300 font-bold";
                                                    } else {
                                                        btnClass = "opacity-40 bg-brand-darker border-transparent";
                                                    }
                                                }

                                                return `
                                                    <button data-choice-idx="${idx}" class="fc-qcm-option p-2.5 rounded-xl border text-xs transition active:scale-98 flex items-center gap-2 ${btnClass}">
                                                        <span class="w-5 h-5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                                                            ${String.fromCharCode(65 + idx)}
                                                        </span>
                                                        <span class="fc-latex-render text-xs truncate max-w-full">
                                                            $${ch}$
                                                        </span>
                                                    </button>
                                                `;
                                            }).join("")}
                                        </div>

                                        ${this.isChoiceSubmitted ? `
                                            <div class="mt-3 p-2.5 rounded-xl bg-brand-darker border border-brand-borderSubtle text-left text-[11px] text-slate-200 w-full animate-fadeIn">
                                                <div class="font-bold text-brand-gold font-outfit mb-1 flex items-center gap-1">
                                                    <i class="fa-solid fa-lightbulb"></i> Démonstration :
                                                </div>
                                                <div class="fc-latex-render font-mono text-xs text-brand-goldLight mb-1">
                                                    $$${card.latex}$$
                                                </div>
                                                <div>${card.tip}</div>
                                            </div>
                                        ` : ''}
                                    `}
                                </div>

                                <!-- CARD FOOTER -->
                                <div class="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs z-10">
                                    <button id="fc-prev-btn" class="text-brand-muted hover:text-white flex items-center gap-1 font-outfit font-semibold transition px-2 py-1 rounded-lg hover:bg-white/5">
                                        <i class="fa-solid fa-arrow-left"></i> Précédent
                                    </button>

                                    <!-- Index Tracker & Shuffle -->
                                    <div class="flex items-center gap-2">
                                        <button id="fc-shuffle-btn" title="Mélanger l'ordre des cartes (S)" class="text-brand-muted hover:text-brand-gold transition px-2 py-1 rounded-lg hover:bg-white/5 text-xs">
                                            <i class="fa-solid fa-shuffle"></i>
                                        </button>
                                        <span class="font-mono text-brand-muted text-[11px] font-bold">
                                            ${this.currentIndex + 1} / ${cards.length}
                                        </span>
                                    </div>

                                    <button id="fc-next-btn" class="text-brand-goldLight hover:text-white font-bold flex items-center gap-1 font-outfit transition px-2 py-1 rounded-lg hover:bg-white/5">
                                        Suivant <i class="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- LEITNER RATING ACTIONS (Shown when flipped in Leitner mode) -->
                    ${(this.mode === 'leitner' && this.isFlipped) ? `
                        <div class="grid grid-cols-3 gap-2 w-full animate-fadeIn">
                            <button id="fc-rate-1" class="py-2.5 px-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 text-rose-300 font-bold text-xs font-outfit transition active:scale-95 flex flex-col items-center">
                                <span>🔴 À Revoir [1]</span>
                                <span class="text-[9px] font-normal text-rose-400">Reste en Box 1</span>
                            </button>
                            <button id="fc-rate-2" class="py-2.5 px-2 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold text-xs font-outfit transition active:scale-95 flex flex-col items-center">
                                <span>🟡 En Cours [2]</span>
                                <span class="text-[9px] font-normal text-amber-400">Passe en Box 2</span>
                            </button>
                            <button id="fc-rate-3" class="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs font-outfit transition active:scale-95 flex flex-col items-center shadow-lg shadow-emerald-950/50">
                                <span>🟢 Maîtrisé [3]</span>
                                <span class="text-[9px] font-bold text-emerald-200">+20 XP • Box 3</span>
                            </button>
                        </div>
                    ` : ''}

                    <!-- QCM NEXT BUTTON (Shown when answered in QCM mode) -->
                    ${(this.mode === 'qcm' && this.isChoiceSubmitted) ? `
                        <button id="fc-qcm-continue-btn" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-cherry to-brand-cherryDark border border-brand-gold text-white font-bold text-xs font-outfit transition active:scale-98 shadow-md">
                            Question Suivante <i class="fa-solid fa-arrow-right ml-1"></i>
                        </button>
                    ` : ''}
                `}
            </div>
        `;

        this.attachStandardListeners();
    }

    renderBlitzMode() {
        const cards = this.getFilteredCards();
        if (cards.length === 0) {
            this.container.innerHTML = `
                <div class="glass-card p-6 rounded-2xl text-center space-y-3">
                    <p class="text-sm text-white">Aucune carte disponible pour le niveau "${this.selectedLevel}".</p>
                    <button id="fc-exit-blitz" class="px-3 py-1.5 rounded-xl bg-brand-cherry text-white text-xs font-bold">Retour</button>
                </div>
            `;
            document.getElementById("fc-exit-blitz")?.addEventListener("click", () => {
                this.mode = "leitner";
                this.render();
            });
            return;
        }

        if (this.currentIndex >= cards.length) this.currentIndex = 0;
        const currentCard = cards[this.currentIndex];

        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-sm mx-auto space-y-4 w-full">
                <!-- Blitz Header -->
                <div class="w-full glass-panel rounded-2xl p-4 border border-brand-borderSubtle text-center space-y-3">
                    <div class="flex items-center justify-between">
                        <button id="fc-exit-blitz" class="text-xs text-brand-muted hover:text-white flex items-center gap-1 font-outfit">
                            <i class="fa-solid fa-arrow-left"></i> Quitter Blitz
                        </button>
                        <span class="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                            <i class="fa-solid fa-fire animate-pulse text-amber-500"></i> Combo x${Math.max(1, Math.floor(this.blitzStreak / 3) + 1)}
                        </span>
                    </div>

                    <div class="py-2">
                        <div class="text-3xl font-black font-mono text-white ${this.blitzTimeLeft <= 10 ? 'text-rose-500 animate-ping' : ''}">
                            ${this.blitzTimeLeft}s
                        </div>
                        <div class="text-xs text-brand-muted font-outfit">Score : <strong class="text-brand-gold font-mono">${this.blitzScore} pts</strong> (${this.selectedLevel})</div>
                    </div>

                    ${!this.blitzActive ? `
                        <div class="space-y-3">
                            <p class="text-xs text-slate-300 leading-relaxed">
                                Défi Chrono 60s (${this.selectedLevel}) : Combien de formules peux-tu identifier sans faire d'erreur ?
                            </p>
                            <button id="fc-start-blitz-btn" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-brand-darker font-black text-xs uppercase tracking-wider font-outfit shadow-lg shadow-amber-950/50 hover:brightness-110 active:scale-95 transition">
                                🚀 Lancer le Chrono Blitz 60s
                            </button>
                        </div>
                    ` : `
                        <!-- Active Blitz Question -->
                        <div class="space-y-3 text-left">
                            <div class="p-3 rounded-xl bg-brand-darker border border-brand-borderSubtle text-center">
                                <span class="text-[10px] font-mono text-brand-gold">${currentCard.title} (${currentCard.level})</span>
                                <div class="text-xs font-bold text-white mt-1 fc-latex-render">
                                    ${currentCard.question}
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <button id="fc-blitz-pass" class="py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold text-xs font-outfit active:scale-95 transition">
                                    ❌ Passer (0 pt)
                                </button>
                                <button id="fc-blitz-know" class="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs font-outfit active:scale-95 transition shadow-lg">
                                    ✅ Je la Connais (+10)
                                </button>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;

        document.getElementById("fc-exit-blitz")?.addEventListener("click", () => {
            if (this.blitzTimer) clearInterval(this.blitzTimer);
            this.blitzActive = false;
            this.mode = "leitner";
            this.render();
        });

        document.getElementById("fc-start-blitz-btn")?.addEventListener("click", () => {
            this.startBlitzTimer();
        });

        document.getElementById("fc-blitz-know")?.addEventListener("click", () => {
            window.ambience?.playSuccess();
            this.blitzStreak++;
            const mult = Math.max(1, Math.floor(this.blitzStreak / 3) + 1);
            this.blitzScore += 10 * mult;
            const validCards = this.getFilteredCards();
            this.currentIndex = Math.floor(Math.random() * validCards.length);
            this.render();
        });

        document.getElementById("fc-blitz-pass")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.blitzStreak = 0;
            const validCards = this.getFilteredCards();
            this.currentIndex = Math.floor(Math.random() * validCards.length);
            this.render();
        });
    }

    startBlitzTimer() {
        this.blitzActive = true;
        this.blitzTimeLeft = 60;
        this.blitzScore = 0;
        this.blitzStreak = 0;
        const validCards = this.getFilteredCards();
        this.currentIndex = Math.floor(Math.random() * validCards.length);
        this.render();

        if (this.blitzTimer) clearInterval(this.blitzTimer);
        this.blitzTimer = setInterval(() => {
            this.blitzTimeLeft--;
            if (this.blitzTimeLeft <= 0) {
                clearInterval(this.blitzTimer);
                this.blitzActive = false;
                window.levelSystem?.addXP(this.blitzScore, `Score Blitz (${this.selectedLevel})`);
                alert(`🏁 Chrono Terminé ! Score : ${this.blitzScore} points ! (+${this.blitzScore} XP)`);
            }
            this.render();
        }, 1000);
    }

    handleFlipCard() {
        if (this.mode !== "leitner") return;
        window.ambience?.playClick();
        this.isFlipped = !this.isFlipped;
        this.render();
    }

    navigateCard(dir) {
        window.ambience?.playClick();
        const cards = this.getFilteredCards();
        if (cards.length === 0) return;
        this.currentIndex = (this.currentIndex + dir + cards.length) % cards.length;
        this.isFlipped = false;
        this.selectedChoiceIndex = null;
        this.isChoiceSubmitted = false;
        this.render();
    }

    rateCard(box) {
        window.ambience?.playClick();
        const cards = this.getFilteredCards();
        const currentCard = cards[this.currentIndex];
        if (currentCard) {
            this.leitnerData[currentCard.id] = box;
            this.saveLeitnerData();
            if (box === 3) {
                window.ambience?.playSuccess();
                window.levelSystem?.addXP(20, "Formule Maîtrisée (Box 3)");
            }
        }
        this.navigateCard(1);
    }

    shuffleCards() {
        window.ambience?.playClick();
        const cards = this.getFilteredCards();
        if (cards.length === 0) return;
        this.currentIndex = Math.floor(Math.random() * cards.length);
        this.isFlipped = false;
        this.selectedChoiceIndex = null;
        this.isChoiceSubmitted = false;
        this.render();
    }

    attachStandardListeners() {
        // Mode Switches
        document.getElementById("fc-mode-leitner")?.addEventListener("click", () => {
            this.mode = "leitner";
            this.isFlipped = false;
            this.render();
        });
        document.getElementById("fc-mode-qcm")?.addEventListener("click", () => {
            this.mode = "qcm";
            this.isFlipped = false;
            this.selectedChoiceIndex = null;
            this.isChoiceSubmitted = false;
            this.render();
        });
        document.getElementById("fc-mode-blitz")?.addEventListener("click", () => {
            this.mode = "blitz";
            this.render();
        });

        // Level Chips Selection
        document.querySelectorAll(".fc-level-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const lvl = chip.dataset.level;
                if (!lvl) return;
                window.ambience?.playClick();
                this.selectedLevel = lvl;
                localStorage.setItem("ss_fc_selected_level", lvl);
                this.currentIndex = 0;
                this.isFlipped = false;
                this.selectedChoiceIndex = null;
                this.isChoiceSubmitted = false;
                this.render();
            });
        });

        // Search Input
        document.getElementById("fc-search-input")?.addEventListener("input", (e) => {
            this.searchQuery = e.target.value;
            this.currentIndex = 0;
            this.render();
        });

        // Level Dropdown Filter
        document.getElementById("fc-filter-level")?.addEventListener("change", (e) => {
            window.ambience?.playClick();
            this.selectedLevel = e.target.value;
            localStorage.setItem("ss_fc_selected_level", e.target.value);
            this.currentIndex = 0;
            this.isFlipped = false;
            this.selectedChoiceIndex = null;
            this.isChoiceSubmitted = false;
            this.render();
        });

        // Discipline Filter
        document.getElementById("fc-filter-discipline")?.addEventListener("change", (e) => {
            this.selectedDiscipline = e.target.value;
            this.currentIndex = 0;
            this.render();
        });

        // Box Filter
        document.getElementById("fc-filter-box")?.addEventListener("change", (e) => {
            this.selectedBox = e.target.value;
            this.currentIndex = 0;
            this.render();
        });

        // Reset Filters Button
        document.getElementById("fc-reset-filters")?.addEventListener("click", () => {
            this.searchQuery = "";
            this.selectedDiscipline = "All";
            this.selectedLevel = "All";
            this.selectedBox = "All";
            localStorage.setItem("ss_fc_selected_level", "All");
            this.currentIndex = 0;
            this.render();
        });

        // Interactive Card Click
        document.getElementById("fc-interactive-card")?.addEventListener("click", (e) => {
            if (e.target.closest("button") || e.target.closest("select") || e.target.closest("input")) return;
            if (this.mode === "leitner") {
                this.handleFlipCard();
            }
        });

        // Navigation Buttons
        document.getElementById("fc-prev-btn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.navigateCard(-1);
        });
        document.getElementById("fc-next-btn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.navigateCard(1);
        });
        document.getElementById("fc-shuffle-btn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.shuffleCards();
        });

        // Leitner Rating Buttons
        document.getElementById("fc-rate-1")?.addEventListener("click", () => this.rateCard(1));
        document.getElementById("fc-rate-2")?.addEventListener("click", () => this.rateCard(2));
        document.getElementById("fc-rate-3")?.addEventListener("click", () => this.rateCard(3));

        // Active Recall QCM Choices
        document.querySelectorAll(".fc-qcm-option").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if (this.isChoiceSubmitted) return;
                const idx = parseInt(btn.dataset.choiceIdx);
                this.selectedChoiceIndex = idx;
                this.isChoiceSubmitted = true;

                const cards = this.getFilteredCards();
                const card = cards[this.currentIndex];
                const isCorrect = idx === card.correctIndex;

                if (isCorrect) {
                    window.ambience?.playSuccess();
                    window.levelSystem?.addXP(25, "Active Recall Exact");
                    this.leitnerData[card.id] = Math.min(3, (this.leitnerData[card.id] || 1) + 1);
                } else {
                    window.ambience?.playClick();
                    this.leitnerData[card.id] = 1; // Demote to box 1 on mistake
                }
                this.saveLeitnerData();
                this.render();
            });
        });

        document.getElementById("fc-qcm-continue-btn")?.addEventListener("click", () => {
            this.navigateCard(1);
        });
    }
}

window.FlashcardViewer = FlashcardViewer;
