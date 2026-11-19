/**
 * StudySouk Timer - STEM Flashcards & Formula Trainer (Luxury Edition)
 * Real academic database extracted directly from StudySouk Master (2BAC SM/PC & CPGE).
 * Modes:
 *   1. Leitner 3D Flip (Spaced-Repetition System across 3 boxes)
 *   2. Active Recall QCM (Multiple-Choice Formula Quiz with Instant Correction)
 *   3. Chrono Blitz 60s (Speed Formula Challenge with Combo Streaks)
 */

const STUDY_FLASHCARDS = [
    // --- MATHÉMATIQUES ---
    {
        id: "FC_DERIV_01",
        discipline: "Maths",
        level: "2BAC SM/PC",
        chapter: "Dérivabilité",
        title: "Dérivée de Arctan(u)",
        question: "Quelle est la dérivée de la fonction $x \\mapsto \\arctan(u(x))$ ?",
        latex: "(\\arctan(u))'(x) = \\frac{u'(x)}{1 + u(x)^2}",
        tip: "⚠️ Piège Concours : Ne jamais oublier le u'(x) au numérateur !",
        choices: [
            "\\frac{u'(x)}{1 + u(x)^2}",
            "\\frac{u'(x)}{\\sqrt{1 - u(x)^2}}",
            "-\\frac{u'(x)}{1 + u(x)^2}",
            "\\frac{1}{1 + u(x)^2}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_DERIV_02",
        discipline: "Maths",
        level: "2BAC SM/PC",
        chapter: "Dérivabilité",
        title: "Dérivée de la réciproque f⁻¹",
        question: "Si $f$ est bijective et dérivable en $x_0$ avec $f'(x_0) \\neq 0$, quelle est la dérivée de $f^{-1}$ en $y_0 = f(x_0)$ ?",
        latex: "(f^{-1})'(y_0) = \\frac{1}{f'(f^{-1}(y_0))} = \\frac{1}{f'(x_0)}",
        tip: "⚠️ Condition impérative : f'(x₀) doit être NON NUL (tangente verticale sinon).",
        choices: [
            "\\frac{1}{f'(f^{-1}(y_0))}",
            "f'(f^{-1}(y_0))",
            "-\\frac{1}{[f'(y_0)]^2}",
            "\\frac{1}{f'(y_0)}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PRIM_01",
        discipline: "Maths",
        level: "2BAC SM/PC",
        chapter: "Calcul Intégral",
        title: "Intégration par parties (IPP)",
        question: "Quelle est la formule d'IPP pour deux fonctions $u, v$ de classe $\\mathcal{C}^1$ ?",
        latex: "\\int_a^b u'(t) v(t) \\, dt = \\Big[ u(t) v(t) \\Big]_a^b - \\int_a^b u(t) v'(t) \\, dt",
        tip: "💡 Règle mnémotechnique ALPES : Arc-tangente, Logarithme, Polynôme, Exponentielle, Sinus.",
        choices: [
            "[uv]_a^b - \\int_a^b uv' dt",
            "[uv]_a^b + \\int_a^b uv' dt",
            "[u'v']_a^b - \\int_a^b uv dt",
            "\\int_a^b u'v' dt - [uv]_a^b"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PRIM_02",
        discipline: "Maths",
        level: "2BAC SM",
        chapter: "Calcul Intégral",
        title: "Sommes de Riemann",
        question: "Quelle est la limite de la somme de Riemann classique pour $f$ continue sur $[a, b]$ ?",
        latex: "\\lim_{n \\to +\\infty} \\frac{b-a}{n} \\sum_{k=1}^n f\\left(a + k\\frac{b-a}{n}\\right) = \\int_a^b f(x) \\, dx",
        tip: "💡 Utilisée dans 80% des épreuves CNC / ENSA pour calculer des limites de sommes discrètes.",
        choices: [
            "\\int_a^b f(x) \\, dx",
            "\\int_0^1 f(x) \\, dx",
            "\\frac{1}{b-a}\\int_a^b f(x) \\, dx",
            "f(b) - f(a)"
        ],
        correctIndex: 0
    },
    {
        id: "FC_ANA_ROLLE",
        discipline: "Maths",
        level: "2BAC SM",
        chapter: "Théorèmes d'Analyse",
        title: "Théorème de Rolle",
        question: "Quelles sont les 3 hypothèses du Théorème de Rolle sur $[a, b]$ et sa conclusion ?",
        latex: "f \\in \\mathcal{C}([a, b]), \\; f \\text{ dérivable sur } ]a, b[, \\; f(a)=f(b) \\implies \\exists c \\in ]a, b[, \\; f'(c)=0",
        tip: "⚠️ Dérivabilité sur l'intervalle ouvert ]a, b[, continuité sur le fermé [a, b].",
        choices: [
            "\\exists c \\in ]a, b[, \\; f'(c) = 0",
            "\\exists c \\in [a, b], \\; f''(c) = 0",
            "\\forall c \\in ]a, b[, \\; f'(c) = 0",
            "\\exists c \\in ]a, b[, \\; f(c) = 0"
        ],
        correctIndex: 0
    },
    {
        id: "FC_ANA_TAF",
        discipline: "Maths",
        level: "2BAC SM / CPGE",
        chapter: "Théorèmes d'Analyse",
        title: "Théorème des Accroissements Finis (TAF)",
        question: "Énoncez la relation du TAF pour $f \\in \\mathcal{C}([a, b])$ dérivable sur $]a, b[$ :",
        latex: "\\exists c \\in ]a, b[, \\quad f(b) - f(a) = f'(c)(b - a)",
        tip: "💡 Interprétation : il existe une tangente parallèle à la corde reliant (a, f(a)) et (b, f(b)).",
        choices: [
            "f(b) - f(a) = f'(c)(b - a)",
            "f(b) + f(a) = f'(c)(b + a)",
            "f'(c) = \\frac{f(b) + f(a)}{b - a}",
            "f(b) - f(a) = f''(c)(b - a)^2"
        ],
        correctIndex: 0
    },
    {
        id: "FC_TAYLOR_01",
        discipline: "Maths",
        level: "CPGE MP/PSI",
        chapter: "Développements Limités",
        title: "Formule de Taylor-Young",
        question: "Quelle est la formule de Taylor-Young en 0 à l'ordre $n$ pour $f \\in \\mathcal{C}^n$ ?",
        latex: "f(x) = \\sum_{k=0}^n \\frac{f^{(k)}(0)}{k!} x^k + o(x^n)",
        tip: "💡 Clé fondamentale pour tous les équivalents et calculs de limites indéterminées en prépa.",
        choices: [
            "\\sum_{k=0}^n \\frac{f^{(k)}(0)}{k!} x^k + o(x^n)",
            "\\sum_{k=0}^n f^{(k)}(0) x^k + o(x^n)",
            "\\sum_{k=1}^n \\frac{f^{(k)}(0)}{k} x^k + o(x^n)",
            "\\sum_{k=0}^n \\frac{f^{(k)}(0)}{(k+1)!} x^{k+1} + o(x^n)"
        ],
        correctIndex: 0
    },
    {
        id: "FC_ALG_CAYLEY",
        discipline: "Maths",
        level: "CPGE MP/PSI/TSI",
        chapter: "Réduction",
        title: "Théorème de Cayley-Hamilton",
        question: "Quel est l'énoncé fondamental du théorème de Cayley-Hamilton pour $A \\in \\mathcal{M}_n(\\mathbb{K})$ ?",
        latex: "\\chi_A(A) = 0 \\quad \\text{où} \\quad \\chi_A(X) = \\det(X \\cdot I_n - A)",
        tip: "💡 Tout endomorphisme annule son polynôme caractéristique. Très utile pour exprimer A⁻¹ en fonction de A.",
        choices: [
            "\\chi_A(A) = 0",
            "\\chi_A(A) = I_n",
            "\\det(A) = \\operatorname{Tr}(A)",
            "A^n = 0"
        ],
        correctIndex: 0
    },
    {
        id: "FC_ALG_CS",
        discipline: "Maths",
        level: "CPGE MP/PSI/TSI",
        chapter: "Espaces Préhilbertiens",
        title: "Inégalité de Cauchy-Schwarz",
        question: "Énoncez l'inégalité de Cauchy-Schwarz dans un espace préhilbertien :",
        latex: "|\\langle x, y \\rangle| \\le \\|x\\| \\cdot \\|y\\|",
        tip: "💡 Cas d'égalité ssi les vecteurs x et y sont colinéaires (liés).",
        choices: [
            "|\\langle x, y \\rangle| \\le \\|x\\| \\cdot \\|y\\|",
            "\\langle x, y \\rangle \\le \\|x + y\\|",
            "\\|x + y\\|^2 \\le \\|x\\|^2 + \\|y\\|^2",
            "|\\langle x, y \\rangle| = \\|x\\| + \\|y\\|"
        ],
        correctIndex: 0
    },
    {
        id: "FC_ANA_SERIES",
        discipline: "Maths",
        level: "CPGE MP/PSI",
        chapter: "Séries Entières",
        title: "Règle de d'Alembert pour le Rayon",
        question: "Si $\\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| = \\ell$, quel est le rayon de convergence $R$ de $\\sum a_n z^n$ ?",
        latex: "R = \\frac{1}{\\ell} \\quad (\\text{avec convention } \\frac{1}{0} = +\\infty, \\frac{1}{+\\infty} = 0)",
        tip: "💡 Si la limite n'existe pas, utiliser la règle d'Hadamard ou encadrer par comparaison.",
        choices: [
            "R = 1 / \\ell",
            "R = \\ell",
            "R = \\sqrt{\\ell}",
            "R = \\ln(\\ell)"
        ],
        correctIndex: 0
    },
    {
        id: "FC_ANA_EULER",
        discipline: "Maths",
        level: "2BAC SM",
        chapter: "Nombres Complexes",
        title: "Formules d'Euler & Moivre",
        question: "Donnez les expressions de $\\cos(\\theta)$ et $\\sin(\\theta)$ selon Euler :",
        latex: "\\cos(\\theta) = \\frac{e^{i\\theta} + e^{-i\\theta}}{2}, \\quad \\sin(\\theta) = \\frac{e^{i\\theta} - e^{-i\\theta}}{2i}",
        tip: "💡 Outil indispensable pour la linéarisation d'intégrales trigonométriques.",
        choices: [
            "\\cos = \\frac{e^{i\\theta}+e^{-i\\theta}}{2}, \\; \\sin = \\frac{e^{i\\theta}-e^{-i\\theta}}{2i}",
            "\\cos = \\frac{e^{i\\theta}-e^{-i\\theta}}{2}, \\; \\sin = \\frac{e^{i\\theta}+e^{-i\\theta}}{2i}",
            "\\cos = e^{i\\theta} + e^{-i\\theta}, \\; \\sin = e^{i\\theta} - e^{-i\\theta}",
            "\\cos = \\frac{e^{i\\theta}+e^{-i\\theta}}{2i}, \\; \\sin = \\frac{e^{i\\theta}-e^{-i\\theta}}{2}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PROB_BAYES",
        discipline: "Maths",
        level: "2BAC SM / CPGE",
        chapter: "Probabilités",
        title: "Formule de Bayes",
        question: "Si $(A_k)_{1 \\le k \\le n}$ est un système complet d'événements, quelle est l'expression de $P(A_i | B)$ ?",
        latex: "P(A_i | B) = \\frac{P(B | A_i) \\cdot P(A_i)}{\\sum_{k=1}^n P(B | A_k) \\cdot P(A_k)}",
        tip: "💡 Permet d'inverser les probabilités conditionnelles ('probabilité des causes').",
        choices: [
            "\\frac{P(B | A_i) P(A_i)}{\\sum_k P(B | A_k) P(A_k)}",
            "\\frac{P(A_i | B) P(B)}{\\sum_k P(A_k)}",
            "P(B | A_i) \\cdot P(A_i)",
            "\\frac{P(B \\cap A_i)}{P(A_i)}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_MATH_JENSEN",
        discipline: "Maths",
        level: "2BAC SM / CPGE",
        chapter: "Convexité",
        title: "Inégalité de Jensen",
        question: "Pour une fonction convexe $f$ sur un intervalle $I$ et des poids $\\sum_{k=1}^n \\lambda_k = 1$ (avec $\\lambda_k \\ge 0$) :",
        latex: "f\\left( \\sum_{k=1}^n \\lambda_k x_k \\right) \\le \\sum_{k=1}^n \\lambda_k f(x_k)",
        tip: "💡 Démonstration classique des inégalités arithmético-géométriques et de Hölder.",
        choices: [
            "f\\left( \\sum \\lambda_k x_k \\right) \\le \\sum \\lambda_k f(x_k)",
            "f\\left( \\sum \\lambda_k x_k \\right) \\ge \\sum \\lambda_k f(x_k)",
            "\\sum \\lambda_k f(x_k) = f(\\max x_k)",
            "f(\\bar{x}) = \\bar{f(x)}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_MATH_WRONSK",
        discipline: "Maths",
        level: "CPGE MP/PSI",
        chapter: "Équations Différentielles",
        title: "Wronskien & Liberté",
        question: "Pour deux solutions $y_1, y_2$ d'une équation linéaire scalaire d'ordre 2, le Wronskien $W(x)$ vaut :",
        latex: "W(x) = y_1(x) y_2'(x) - y_1'(x) y_2(x) \\neq 0 \\iff (y_1, y_2) \\text{ est une base de solutions}",
        tip: "💡 Si W(x₀) ≠ 0 en un seul point, alors W(x) ≠ 0 partout sur l'intervalle.",
        choices: [
            "y_1(x) y_2'(x) - y_1'(x) y_2(x)",
            "y_1(x) y_2(x) + y_1'(x) y_2'(x)",
            "y_1''(x) y_2(x) - y_1(x) y_2''(x)",
            "\\frac{y_1'(x)}{y_2'(x)}"
        ],
        correctIndex: 0
    },

    // --- PHYSIQUE ---
    {
        id: "FC_PHYS_01",
        discipline: "Physique",
        level: "2BAC SM/PC",
        chapter: "Électricité RLC",
        title: "Période propre oscillateur LC",
        question: "Quelle est l'expression de la période propre $T_0$ d'un circuit LC idéal ?",
        latex: "T_0 = 2\\pi \\sqrt{L C} \\quad \\text{et pulsation} \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}}",
        tip: "💡 Énergie électromagnétique totale conservée : E_tot = (1/2)Cu² + (1/2)Li² = cste.",
        choices: [
            "T_0 = 2\\pi \\sqrt{LC}",
            "T_0 = \\frac{1}{2\\pi \\sqrt{LC}}",
            "T_0 = 2\\pi LC",
            "T_0 = 2\\pi \\sqrt{\\frac{L}{C}}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PHYS_02",
        discipline: "Physique",
        level: "2BAC SM/PC",
        chapter: "Mécanique de Newton",
        title: "2ème Loi de Newton (RFD)",
        question: "Énoncez la relation fondamentale de la dynamique dans un référentiel galiléen :",
        latex: "\\sum \\vec{F}_{ext} = m \\cdot \\vec{a}_G = \\frac{d\\vec{p}}{dt}",
        tip: "⚠️ Toujours préciser le système étudié et le référentiel supposé galiléen !",
        choices: [
            "\\sum \\vec{F}_{ext} = m \\vec{a}_G",
            "\\sum \\vec{F}_{ext} = \\vec{0}",
            "\\sum \\vec{F}_{ext} = m \\vec{v}_G",
            "\\vec{F} = \\frac{1}{2} m v^2"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PHYS_03",
        discipline: "Physique",
        level: "2BAC SM",
        chapter: "Physique Nucléaire",
        title: "Loi de décroissance radioactive",
        question: "Quelle est l'expression du nombre de noyaux $N(t)$ restants avec la demi-vie $t_{1/2}$ ?",
        latex: "N(t) = N_0 \\cdot e^{-\\lambda t} \\quad \\text{avec} \\quad t_{1/2} = \\frac{\\ln(2)}{\\lambda}",
        tip: "💡 Activité A(t) = -dN/dt = λN(t) en Becquerels (1 Bq = 1 désintégration/sec).",
        choices: [
            "N(t) = N_0 e^{-\\lambda t} \\; (t_{1/2} = \\ln 2 / \\lambda)",
            "N(t) = N_0 e^{\\lambda t} \\; (t_{1/2} = \\lambda / \\ln 2)",
            "N(t) = N_0 - \\lambda t",
            "N(t) = \\frac{N_0}{1 + \\lambda t}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PHYS_MAXWELL",
        discipline: "Physique",
        level: "CPGE MP/PSI",
        chapter: "Électromagnétisme",
        title: "Équations de Maxwell (dans le vide)",
        question: "Quelle est la relation de Maxwell-Faraday exprimant l'induction ?",
        latex: "\\vec{\\nabla} \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}",
        tip: "💡 Conduisent avec Maxwell-Ampère à l'équation de D'Alembert pour la lumière avec c = 1/√(ε₀μ₀).",
        choices: [
            "\\vec{\\nabla} \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}",
            "\\vec{\\nabla} \\cdot \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}",
            "\\vec{\\nabla} \\times \\vec{B} = \\vec{0}",
            "\\vec{\\nabla} \\times \\vec{E} = \\mu_0 \\vec{j}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PHYS_POYNTING",
        discipline: "Physique",
        level: "CPGE MP/PSI",
        chapter: "Électromagnétisme",
        title: "Vecteur de Poynting",
        question: "Quelle est la définition du vecteur de Poynting $\\vec{\\Pi}$ et son unité SI ?",
        latex: "\\vec{\\Pi} = \\frac{\\vec{E} \\times \\vec{B}}{\\mu_0} \\quad [\\text{W} \\cdot \\text{m}^{-2}]",
        tip: "💡 Représente la densité surfacique de puissance transportée par l'onde électromagnétique.",
        choices: [
            "\\vec{\\Pi} = \\frac{\\vec{E} \\times \\vec{B}}{\\mu_0} \\; [\\text{W}\\cdot\\text{m}^{-2}]",
            "\\vec{\\Pi} = \\mu_0 (\\vec{E} \\cdot \\vec{B}) \\; [\\text{J}]",
            "\\vec{\\Pi} = \\varepsilon_0 \\frac{\\vec{E}}{\\vec{B}} \\; [\\text{V}]",
            "\\vec{\\Pi} = \\frac{\\vec{B} \\times \\vec{E}}{\\varepsilon_0} \\; [\\text{N}]"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PHYS_TMC",
        discipline: "Physique",
        level: "CPGE / 2BAC SM",
        chapter: "Mécanique du Point",
        title: "Théorème du Moment Cinétique",
        question: "Énoncez le TMC par rapport à un point fixe $O$ dans un référentiel galiléen :",
        latex: "\\frac{d\\vec{L}_O}{dt} = \\sum \\vec{\\mathcal{M}}_O(\\vec{F}_{ext}) \\quad \\text{avec} \\quad \\vec{L}_O = \\vec{OM} \\times (m\\vec{v})",
        tip: "💡 Si le moment est nul (forces centrales), le moment cinétique est conservé (loi des aires).",
        choices: [
            "\\frac{d\\vec{L}_O}{dt} = \\sum \\vec{\\mathcal{M}}_O(\\vec{F})",
            "\\frac{d\\vec{L}_O}{dt} = \\vec{v} \\times \\vec{a}",
            "\\vec{L}_O = m \\vec{a} \\times \\vec{r}",
            "\\frac{d\\vec{L}_O}{dt} = \\vec{0}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PHYS_THERMO1",
        discipline: "Physique",
        level: "CPGE MP/PSI/TSI",
        chapter: "Thermodynamique",
        title: "Premier Principe de la Thermo",
        question: "Donnez l'expression différentielle et intégrée du 1er principe pour un système fermé :",
        latex: "dU = \\delta W + \\delta Q \\implies \\Delta U = W + Q",
        tip: "💡 Pour un gaz parfait (1ère loi de Joule) : dU = C_v dT et dH = C_p dT.",
        choices: [
            "dU = \\delta W + \\delta Q",
            "dU = \\delta W - T dS",
            "dH = \\delta Q - V dP",
            "\\Delta U = W - Q"
        ],
        correctIndex: 0
    },
    {
        id: "FC_PHYS_OPT",
        discipline: "Physique",
        level: "2BAC SM/PC / CPGE",
        chapter: "Optique Ondulatoire",
        title: "Interfrange Fentes d'Young",
        question: "Quelle est l'expression de l'interfrange $i$ sur un écran à distance $D$ pour des fentes distantes de $a$ ?",
        latex: "i = \\frac{\\lambda \\cdot D}{a}",
        tip: "💡 L'interfrange est la distance séparant deux franges brillantes (ou sombres) consécutives.",
        choices: [
            "i = \\frac{\\lambda D}{a}",
            "i = \\frac{\\lambda a}{D}",
            "i = \\frac{a D}{\\lambda}",
            "i = \\sqrt{\\frac{\\lambda D}{a}}"
        ],
        correctIndex: 0
    },

    // --- CHIMIE ---
    {
        id: "FC_CHIM_01",
        discipline: "Chimie",
        level: "2BAC SM/PC",
        chapter: "Équilibre Acido-Basique",
        title: "Relation d'Henderson-Hasselbalch",
        question: "Donnez l'expression du pH en fonction du $pK_a$ et des concentrations à l'équilibre :",
        latex: "pH = pK_a + \\log\\left( \\frac{[A^-]_{eq}}{[AH]_{eq}} \\right)",
        tip: "💡 Si [A⁻] = [AH], alors pH = pKa (point de demi-équivalence du titrage).",
        choices: [
            "pH = pK_a + \\log\\left(\\frac{[A^-]}{[AH]}\\right)",
            "pH = pK_a - \\log\\left(\\frac{[A^-]}{[AH]}\\right)",
            "pH = -\\log(pK_a) + [A^-]",
            "pH = pK_a + \\ln\\left(\\frac{[AH]}{[A^-]}\\right)"
        ],
        correctIndex: 0
    },
    {
        id: "FC_CHIM_NERNST",
        discipline: "Chimie",
        level: "2BAC SM/PC / CPGE",
        chapter: "Électrochimie",
        title: "Formule de Nernst",
        question: "Potentiel d'électrode pour le couple $\\alpha \\text{Ox} + n e^- \\rightleftharpoons \\beta \\text{Red}$ à 25°C :",
        latex: "E = E^\\circ + \\frac{0.059}{n} \\log\\left( \\frac{[\\text{Ox}]^\\alpha}{[\\text{Red}]^\\beta} \\right)",
        tip: "💡 À l'équilibre électrochimique (pile usée) : E_cathode = E_anode et f.e.m. ΔE = 0.",
        choices: [
            "E = E^\\circ + \\frac{0.059}{n} \\log\\left( \\frac{[\\text{Ox}]^\\alpha}{[\\text{Red}]^\\beta} \\right)",
            "E = E^\\circ - \\frac{0.059}{n} \\log\\left( \\frac{[\\text{Ox}]^\\alpha}{[\\text{Red}]^\\beta} \\right)",
            "E = E^\\circ + \\frac{RT}{n} [\\text{Ox}]",
            "E = \\frac{E^\\circ}{n} + 0.059 \\log(K)"
        ],
        correctIndex: 0
    },
    {
        id: "FC_CHIM_ARRHENIUS",
        discipline: "Chimie",
        level: "CPGE / 2BAC SM",
        chapter: "Cinétique Chimique",
        title: "Loi d'Arrhenius",
        question: "Comment varie la constante de vitesse $k$ en fonction de la température $T$ ?",
        latex: "k = A \\cdot \\exp\\left(-\\frac{E_a}{R \\cdot T}\\right)",
        tip: "💡 Tracer ln(k) en fonction de 1/T donne une droite de pente -Ea/R.",
        choices: [
            "k = A \\exp\\left(-\\frac{E_a}{RT}\\right)",
            "k = A \\exp\\left(+\\frac{E_a}{RT}\\right)",
            "k = A \\cdot R \\cdot T",
            "k = \\frac{E_a}{RT}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_CHIM_KS",
        discipline: "Chimie",
        level: "2BAC SM/PC / CPGE",
        chapter: "Précipitation",
        title: "Produit de Solubilité Ks",
        question: "Expression du $K_s$ pour la dissolution du sel peu soluble $A_n B_m(s)$ :",
        latex: "K_s = [A^{m+}]^n \\cdot [B^{n-}]^m",
        tip: "💡 Condition d'apparition du précipité : le produit ionique Q_r dépasse Ks.",
        choices: [
            "K_s = [A^{m+}]^n \\cdot [B^{n-}]^m",
            "K_s = [A^{m+}] + [B^{n-}]",
            "K_s = n [A] \\times m [B]",
            "K_s = \\frac{[A]^n}{[B]^m}"
        ],
        correctIndex: 0
    },

    // --- INFORMATIQUE ---
    {
        id: "FC_INFO_01",
        discipline: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        title: "Complexité du Quicksort",
        question: "Complexité temporelle moyenne et au pire cas du tri rapide :",
        latex: "T_{\\text{moyen}}(n) = \\mathcal{O}(n \\log n), \\quad T_{\\text{pire}}(n) = \\mathcal{O}(n^2)",
        tip: "💡 Le pire cas survient lorsque le pivot est systématiquement l'élément extrême.",
        choices: [
            "\\mathcal{O}(n \\log n) \\text{ moyen, } \\mathcal{O}(n^2) \\text{ pire}",
            "\\mathcal{O}(n^2) \\text{ moyen, } \\mathcal{O}(n^3) \\text{ pire}",
            "\\mathcal{O}(n) \\text{ moyen, } \\mathcal{O}(n \\log n) \\text{ pire}",
            "\\mathcal{O}(\\log n) \\text{ partout}"
        ],
        correctIndex: 0
    },
    {
        id: "FC_INFO_02",
        discipline: "Informatique",
        level: "CPGE / SM",
        chapter: "Graphes",
        title: "Algorithme de Dijkstra",
        question: "Complexité temporelle de Dijkstra avec file de priorité (tas binaire) :",
        latex: "\\mathcal{O}\\big((|V| + |E|) \\log |V|\\big)",
        tip: "⚠️ Exige impérativement des poids d'arêtes STRICTEMENT positifs ou nuls.",
        choices: [
            "\\mathcal{O}\\big((|V| + |E|) \\log |V|\\big)",
            "\\mathcal{O}(|V|^3)",
            "\\mathcal{O}(|E| \\cdot |V|)",
            "\\mathcal{O}(\\log |V|)"
        ],
        correctIndex: 0
    },
    {
        id: "FC_INFO_DICHO",
        discipline: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        title: "Recherche par Dichotomie",
        question: "Quelle est la complexité dans le pire des cas d'une dichotomie sur tableau trié ?",
        latex: "\\mathcal{O}(\\log n)",
        tip: "💡 Divise l'espace de recherche par deux à chaque étape.",
        choices: [
            "\\mathcal{O}(\\log n)",
            "\\mathcal{O}(n)",
            "\\mathcal{O}(n \\log n)",
            "\\mathcal{O}(1)"
        ],
        correctIndex: 0
    },
    {
        id: "FC_INFO_SQL",
        discipline: "Informatique",
        level: "CPGE / Concours",
        chapter: "SQL & Bases",
        title: "Ordre d'Évaluation Logique SQL",
        question: "Dans quel ordre logique le moteur SQL évalue-t-il les clauses ?",
        latex: "\\text{FROM} \\to \\text{WHERE} \\to \\text{GROUP BY} \\to \\text{HAVING} \\to \\text{SELECT} \\to \\text{ORDER BY}",
        tip: "💡 C'est pourquoi un alias défini dans SELECT n'est PAS visible dans la clause WHERE !",
        choices: [
            "FROM \\to WHERE \\to GROUP BY \\to HAVING \\to SELECT \\to ORDER BY",
            "SELECT \\to FROM \\to WHERE \\to GROUP BY \\to ORDER BY",
            "WHERE \\to FROM \\to SELECT \\to ORDER BY",
            "FROM \\to SELECT \\to WHERE \\to HAVING"
        ],
        correctIndex: 0
    }
];

class FlashcardViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.mode = "leitner"; // "leitner" | "qcm" | "blitz"
        this.currentIndex = 0;
        this.isFlipped = false;
        
        // Filtering state
        this.selectedDiscipline = "All";
        this.selectedLevel = "All";
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

    getFilteredCards() {
        return STUDY_FLASHCARDS.filter(c => {
            if (this.selectedDiscipline !== "All" && c.discipline !== this.selectedDiscipline) return false;
            if (this.selectedLevel !== "All" && !c.level.includes(this.selectedLevel)) return false;
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

    getStats() {
        let box1 = 0, box2 = 0, box3 = 0;
        STUDY_FLASHCARDS.forEach(c => {
            const b = this.leitnerData[c.id] || 1;
            if (b === 3) box3++;
            else if (b === 2) box2++;
            else box1++;
        });
        const total = STUDY_FLASHCARDS.length;
        const pctMastered = Math.round((box3 / total) * 100);
        return { box1, box2, box3, total, pctMastered };
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

        if (this.currentIndex >= cards.length) this.currentIndex = 0;
        const card = cards[this.currentIndex] || cards[0];
        const currentBox = card ? (this.leitnerData[card.id] || 1) : 1;

        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-xl mx-auto space-y-3.5 w-full">
                
                <!-- TOP HEADER & MODE SELECTOR -->
                <div class="w-full glass-panel rounded-2xl p-3 border border-brand-borderSubtle shadow-xl flex flex-col gap-2.5">
                    
                    <!-- Title & Mode Tabs -->
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cherry via-brand-gold to-brand-goldLight p-0.5 shadow-md flex items-center justify-center text-brand-darker font-black text-sm">
                                🃏
                            </div>
                            <div>
                                <h3 class="text-xs sm:text-sm font-black font-outfit text-white tracking-wide flex items-center gap-1.5">
                                    Flashcards d'Élite <span class="text-[10px] text-brand-gold font-mono px-1.5 py-0.2 rounded bg-brand-gold/10 border border-brand-gold/30">Morocco CPGE/2BAC</span>
                                </h3>
                                <p class="text-[10px] text-brand-muted">Mémorisation espacée Leitner & Active Recall</p>
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

                    <!-- LEITNER MASTERY METRICS -->
                    <div class="grid grid-cols-4 gap-1.5 pt-1 text-center font-outfit">
                        <div class="p-1.5 rounded-xl bg-brand-darker border border-brand-borderSubtle flex flex-col items-center">
                            <span class="text-[9px] text-brand-muted font-bold">Total</span>
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
                        <div style="width: ${(stats.box1 / stats.total) * 100}%" class="bg-rose-500/70 transition-all duration-300" title="Box 1"></div>
                        <div style="width: ${(stats.box2 / stats.total) * 100}%" class="bg-amber-500/70 transition-all duration-300" title="Box 2"></div>
                        <div style="width: ${(stats.box3 / stats.total) * 100}%" class="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 shadow-sm" title="Box 3"></div>
                    </div>

                    <!-- FILTER & SEARCH BAR -->
                    <div class="flex items-center gap-1.5 flex-wrap pt-1">
                        <div class="relative flex-1 min-w-[140px]">
                            <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-muted"></i>
                            <input id="fc-search-input" type="text" placeholder="Rechercher (ex: Rolle, RLC...)" value="${this.searchQuery}" class="w-full bg-brand-darker border border-brand-borderSubtle rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-brand-muted/60 focus:outline-none focus:border-brand-gold font-outfit" />
                        </div>

                        <!-- Discipline Filter -->
                        <select id="fc-filter-discipline" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2.5 py-1.5 text-xs text-brand-goldLight font-outfit font-bold focus:outline-none">
                            <option value="All" ${this.selectedDiscipline === 'All' ? 'selected' : ''}>Toutes Matières</option>
                            <option value="Maths" ${this.selectedDiscipline === 'Maths' ? 'selected' : ''}>📐 Maths</option>
                            <option value="Physique" ${this.selectedDiscipline === 'Physique' ? 'selected' : ''}>⚛️ Physique</option>
                            <option value="Chimie" ${this.selectedDiscipline === 'Chimie' ? 'selected' : ''}>🧪 Chimie</option>
                            <option value="Informatique" ${this.selectedDiscipline === 'Informatique' ? 'selected' : ''}>💻 Informatique</option>
                        </select>

                        <!-- Box Filter -->
                        <select id="fc-filter-box" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2 py-1.5 text-xs text-brand-goldLight font-outfit font-bold focus:outline-none">
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
                        <p class="text-xs text-brand-muted">Essayez d'effacer votre recherche ou de changer de boîte Leitner.</p>
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
                                <div class="flex items-center justify-between gap-2 z-10">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-darker text-brand-goldLight border border-brand-borderSubtle font-bold">
                                            ${card.discipline} • ${card.chapter}
                                        </span>
                                        <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
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
                        <div class="text-xs text-brand-muted font-outfit">Score : <strong class="text-brand-gold font-mono">${this.blitzScore} pts</strong></div>
                    </div>

                    ${!this.blitzActive ? `
                        <div class="space-y-3">
                            <p class="text-xs text-slate-300 leading-relaxed">
                                Défi Chrono 60 secondes : Combien de formules peux-tu identifier sans faire d'erreur ?
                            </p>
                            <button id="fc-start-blitz-btn" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-brand-darker font-black text-xs uppercase tracking-wider font-outfit shadow-lg shadow-amber-950/50 hover:brightness-110 active:scale-95 transition">
                                🚀 Lancer le Chrono Blitz 60s
                            </button>
                        </div>
                    ` : `
                        <!-- Active Blitz Question -->
                        <div class="space-y-3 text-left">
                            <div class="p-3 rounded-xl bg-brand-darker border border-brand-borderSubtle text-center">
                                <span class="text-[10px] font-mono text-brand-gold">${STUDY_FLASHCARDS[this.currentIndex].title}</span>
                                <div class="text-xs font-bold text-white mt-1 fc-latex-render">
                                    ${STUDY_FLASHCARDS[this.currentIndex].question}
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
            this.currentIndex = Math.floor(Math.random() * STUDY_FLASHCARDS.length);
            this.render();
        });

        document.getElementById("fc-blitz-pass")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.blitzStreak = 0;
            this.currentIndex = Math.floor(Math.random() * STUDY_FLASHCARDS.length);
            this.render();
        });
    }

    startBlitzTimer() {
        this.blitzActive = true;
        this.blitzTimeLeft = 60;
        this.blitzScore = 0;
        this.blitzStreak = 0;
        this.currentIndex = Math.floor(Math.random() * STUDY_FLASHCARDS.length);
        this.render();

        if (this.blitzTimer) clearInterval(this.blitzTimer);
        this.blitzTimer = setInterval(() => {
            this.blitzTimeLeft--;
            if (this.blitzTimeLeft <= 0) {
                clearInterval(this.blitzTimer);
                this.blitzActive = false;
                window.levelSystem?.addXP(this.blitzScore, "Score Blitz Flashcards");
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

        // Search Input
        document.getElementById("fc-search-input")?.addEventListener("input", (e) => {
            this.searchQuery = e.target.value;
            this.currentIndex = 0;
            this.render();
        });

        // Filters
        document.getElementById("fc-filter-discipline")?.addEventListener("change", (e) => {
            this.selectedDiscipline = e.target.value;
            this.currentIndex = 0;
            this.render();
        });
        document.getElementById("fc-filter-box")?.addEventListener("change", (e) => {
            this.selectedBox = e.target.value;
            this.currentIndex = 0;
            this.render();
        });
        document.getElementById("fc-reset-filters")?.addEventListener("click", () => {
            this.searchQuery = "";
            this.selectedDiscipline = "All";
            this.selectedBox = "All";
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
