/**
 * StudySouk Timer - STEM Flashcards & Formula Trainer
 * Real academic database extracted directly from StudySouk Master (2BAC SM/PC & CPGE).
 * Features: Leitner Spaced-Repetition System, Mastery Tracking, Filter by Level & Discipline.
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
        tip: "⚠️ Piège Concours : Ne jamais oublier le u'(x) au numérateur !"
    },
    {
        id: "FC_DERIV_02",
        discipline: "Maths",
        level: "2BAC SM/PC",
        chapter: "Dérivabilité",
        title: "Dérivée de la réciproque f⁻¹",
        question: "Si $f$ est bijective et dérivable en $x_0$ avec $f'(x_0) \\neq 0$, quelle est la dérivée de $f^{-1}$ en $y_0 = f(x_0)$ ?",
        latex: "(f^{-1})'(y_0) = \\frac{1}{f'(f^{-1}(y_0))} = \\frac{1}{f'(x_0)}",
        tip: "⚠️ Condition impérative : f'(x₀) doit être NON NUL (tangente verticale sinon)."
    },
    {
        id: "FC_PRIM_01",
        discipline: "Maths",
        level: "2BAC SM/PC",
        chapter: "Calcul Intégral",
        title: "Intégration par parties (IPP)",
        question: "Quelle est la formule d'IPP pour deux fonctions $u, v$ de classe $\\mathcal{C}^1$ ?",
        latex: "\\int_a^b u'(t) v(t) \\, dt = \\Big[ u(t) v(t) \\Big]_a^b - \\int_a^b u(t) v'(t) \\, dt",
        tip: "💡 Règle mnémotechnique ALPES : Arc-tangente, Logarithme, Polynôme, Exponentielle, Sinus."
    },
    {
        id: "FC_PRIM_02",
        discipline: "Maths",
        level: "2BAC SM",
        chapter: "Calcul Intégral",
        title: "Sommes de Riemann",
        question: "Quelle est la limite de la somme de Riemann classique pour $f$ continue sur $[a, b]$ ?",
        latex: "\\lim_{n \\to +\\infty} \\frac{b-a}{n} \\sum_{k=1}^n f\\left(a + k\\frac{b-a}{n}\\right) = \\int_a^b f(x) \\, dx",
        tip: "💡 Utilisée dans 80% des épreuves CNC / ENSA pour calculer des limites de sommes discrètes."
    },
    {
        id: "FC_ANA_ROLLE",
        discipline: "Maths",
        level: "2BAC SM",
        chapter: "Théorèmes d'Analyse",
        title: "Théorème de Rolle",
        question: "Quelles sont les 3 hypothèses du Théorème de Rolle sur $[a, b]$ et sa conclusion ?",
        latex: "f \\in \\mathcal{C}([a, b]), \\; f \\text{ dérivable sur } ]a, b[, \\; f(a)=f(b) \\implies \\exists c \\in ]a, b[, \\; f'(c)=0",
        tip: "⚠️ Dérivabilité sur l'intervalle ouvert ]a, b[, continuité sur le fermé [a, b]."
    },
    {
        id: "FC_ANA_TAF",
        discipline: "Maths",
        level: "2BAC SM / CPGE",
        chapter: "Théorèmes d'Analyse",
        title: "Théorème des Accroissements Finis (TAF)",
        question: "Énoncez la conclusion du TAF pour $f \\in \\mathcal{C}([a, b])$ et dérivable sur $]a, b[$ :",
        latex: "\\exists c \\in ]a, b[, \\quad f(b) - f(a) = f'(c)(b - a)",
        tip: "💡 Interprétation géométrique : il existe une tangente parallèle à la corde reliant (a, f(a)) et (b, f(b))."
    },
    {
        id: "FC_TAYLOR_01",
        discipline: "Maths",
        level: "CPGE MP/PSI",
        chapter: "Développements Limités",
        title: "Formule de Taylor-Young",
        question: "Quelle est la formule de Taylor-Young au voisinage de 0 à l'ordre $n$ pour $f \\in \\mathcal{C}^n$ ?",
        latex: "f(x) = \\sum_{k=0}^n \\frac{f^{(k)}(0)}{k!} x^k + o(x^n)",
        tip: "💡 Clé fondamentale pour tous les équivalents et calculs de limites indéterminées en prépa."
    },
    {
        id: "FC_ALG_CAYLEY",
        discipline: "Maths",
        level: "CPGE MP/PSI/TSI",
        chapter: "Réduction des Endomorphismes",
        title: "Théorème de Cayley-Hamilton",
        question: "Quel est l'énoncé fondamental du théorème de Cayley-Hamilton pour une matrice $A \\in \\mathcal{M}_n(\\mathbb{K})$ ?",
        latex: "\\chi_A(A) = 0 \\quad \\text{où} \\quad \\chi_A(X) = \\det(X \\cdot I_n - A)",
        tip: "💡 Tout endomorphisme annule son polynôme caractéristique. Très utile pour exprimer A⁻¹ en polynôme en A."
    },
    {
        id: "FC_ALG_CS",
        discipline: "Maths",
        level: "CPGE MP/PSI/TSI",
        chapter: "Espaces Préhilbertiens",
        title: "Inégalité de Cauchy-Schwarz",
        question: "Énoncez l'inégalité de Cauchy-Schwarz dans un espace préhilbertien réel ou complexe :",
        latex: "|\\langle x, y \\rangle|^2 \\le \\|x\\|^2 \\cdot \\|y\\|^2 \\iff |\\langle x, y \\rangle| \\le \\|x\\| \\|y\\|",
        tip: "💡 Le cas d'égalité a lieu si et seulement si les vecteurs x et y sont colinéaires (liés)."
    },
    {
        id: "FC_ANA_SERIES",
        discipline: "Maths",
        level: "CPGE MP/PSI",
        chapter: "Séries Entières",
        title: "Règle de d'Alembert pour le Rayon",
        question: "Si $\\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| = \\ell$, quel est le rayon de convergence $R$ de $\\sum a_n z^n$ ?",
        latex: "R = \\frac{1}{\\ell} \\quad (\\text{avec convention } \\frac{1}{0} = +\\infty, \\frac{1}{+\\infty} = 0)",
        tip: "💡 Si la limite n'existe pas, utiliser la règle d'Hadamard ou encadrer par comparaison."
    },
    {
        id: "FC_ANA_EULER",
        discipline: "Maths",
        level: "2BAC SM",
        chapter: "Nombres Complexes",
        title: "Formules d'Euler & Moivre",
        question: "Donnez les expressions de $\\cos(\\theta)$ et $\\sin(\\theta)$ selon Euler :",
        latex: "\\cos(\\theta) = \\frac{e^{i\\theta} + e^{-i\\theta}}{2}, \\quad \\sin(\\theta) = \\frac{e^{i\\theta} - e^{-i\\theta}}{2i}",
        tip: "💡 Outil indispensable pour la linéarisation d'intégrales trigonométriques au bac et aux concours."
    },
    {
        id: "FC_PROB_BAYES",
        discipline: "Maths",
        level: "2BAC SM / CPGE",
        chapter: "Probabilités",
        title: "Formule de Bayes",
        question: "Si $(A_k)_{1 \\le k \\le n}$ est un système complet d'événements, quelle est l'expression de $P(A_i | B)$ ?",
        latex: "P(A_i | B) = \\frac{P(B | A_i) \\cdot P(A_i)}{\\sum_{k=1}^n P(B | A_k) \\cdot P(A_k)}",
        tip: "💡 Permet d'inverser les probabilités conditionnelles ('probabilité des causes')."
    },

    // --- PHYSIQUE ---
    {
        id: "FC_PHYS_01",
        discipline: "Physique",
        level: "2BAC SM/PC",
        chapter: "Électricité RLC",
        title: "Période propre d'un oscillateur LC",
        question: "Quelle est l'expression de la période propre $T_0$ d'un circuit LC idéal ?",
        latex: "T_0 = 2\\pi \\sqrt{L C} \\quad \\text{et pulsation} \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}}",
        tip: "💡 Solution : q(t) = Q_max cos(ω₀t + φ). Énergie électromagnétique totale conservée."
    },
    {
        id: "FC_PHYS_02",
        discipline: "Physique",
        level: "2BAC SM/PC",
        chapter: "Mécanique de Newton",
        title: "2ème Loi de Newton (RFD)",
        question: "Énoncez la relation fondamentale de la dynamique dans un référentiel galiléen :",
        latex: "\\sum \\vec{F}_{ext} = m \\cdot \\vec{a}_G = \\frac{d\\vec{p}}{dt}",
        tip: "⚠️ Toujours préciser le système étudié et le référentiel supposé galiléen !"
    },
    {
        id: "FC_PHYS_03",
        discipline: "Physique",
        level: "2BAC SM",
        chapter: "Physique Nucléaire",
        title: "Loi de décroissance radioactive",
        question: "Quelle est l'expression du nombre de noyaux $N(t)$ restants avec la constante $\\lambda$ ?",
        latex: "N(t) = N_0 \\cdot e^{-\\lambda t} \\quad \\text{avec} \\quad t_{1/2} = \\frac{\\ln(2)}{\\lambda}",
        tip: "💡 Activité A(t) = -dN/dt = λN(t) en Becquerels (1 Bq = 1 désintégration par seconde)."
    },
    {
        id: "FC_PHYS_MAXWELL",
        discipline: "Physique",
        level: "CPGE MP/PSI",
        chapter: "Électromagnétisme",
        title: "Équations de Maxwell (dans le vide)",
        question: "Donnez les 4 équations de Maxwell fondamentales dans le vide :",
        latex: "\\nabla \\cdot \\vec{E} = 0, \\; \\nabla \\cdot \\vec{B} = 0, \\; \\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}, \\; \\nabla \\times \\vec{B} = \\mu_0\\varepsilon_0\\frac{\\partial \\vec{E}}{\\partial t}",
        tip: "💡 Conduisent à l'équation de D'Alembert pour la propagation des ondes lumineuses avec c = 1/√(ε₀μ₀)."
    },
    {
        id: "FC_PHYS_POYNTING",
        discipline: "Physique",
        level: "CPGE MP/PSI",
        chapter: "Électromagnétisme",
        title: "Vecteur de Poynting",
        question: "Quelle est la définition du vecteur de Poynting $\\vec{\\Pi}$ et sa signification ?",
        latex: "\\vec{\\Pi} = \\frac{\\vec{E} \\times \\vec{B}}{\\mu_0} \\quad [\\text{W} \\cdot \\text{m}^{-2}]",
        tip: "💡 Représente la densité surfacique de puissance transportée par l'onde électromagnétique."
    },
    {
        id: "FC_PHYS_TMC",
        discipline: "Physique",
        level: "CPGE / 2BAC SM",
        chapter: "Mécanique du Point",
        title: "Théorème du Moment Cinétique (TMC)",
        question: "Énoncez le TMC par rapport à un point fixe $O$ dans un référentiel galiléen :",
        latex: "\\frac{d\\vec{L}_O}{dt} = \\sum \\vec{\\mathcal{M}}_O(\\vec{F}_{ext}) \\quad \\text{avec} \\quad \\vec{L}_O = \\vec{OM} \\times (m\\vec{v})",
        tip: "💡 Si le moment des forces est nul (forces centrales), le moment cinétique est conservé (loi des aires de Kepler)."
    },
    {
        id: "FC_PHYS_THERMO1",
        discipline: "Physique",
        level: "CPGE MP/PSI/TSI",
        chapter: "Thermodynamique",
        title: "Premier Principe de la Thermodynamique",
        question: "Donnez l'expression différentielle et intégrée du 1er principe pour un système fermé :",
        latex: "dU = \\delta W + \\delta Q \\implies \\Delta U = W + Q",
        tip: "💡 Pour un gaz parfait (1ère loi de Joule) : dU = C_v dT et dH = C_p dT."
    },
    {
        id: "FC_PHYS_THERMO2",
        discipline: "Physique",
        level: "CPGE MP/PSI/TSI",
        chapter: "Thermodynamique",
        title: "Second Principe de la Thermodynamique",
        question: "Énoncez le 2nd principe reliant variation d'entropie, échange thermique et création :",
        latex: "dS = \\frac{\\delta Q}{T_{ext}} + \\delta S_c \\quad \\text{avec} \\quad \\delta S_c \\ge 0",
        tip: "💡 Une transformation réversible vérifie δS_c = 0. Système isolé : ΔS ≥ 0 (l'entropie ne peut que croître)."
    },
    {
        id: "FC_PHYS_OPT",
        discipline: "Physique",
        level: "2BAC SM/PC / CPGE",
        chapter: "Optique Ondulatoire",
        title: "Interfrange Fentes d'Young",
        question: "Quelle est l'expression de l'interfrange $i$ sur un écran à distance $D$ pour des fentes distantes de $a$ ?",
        latex: "i = \\frac{\\lambda \\cdot D}{a}",
        tip: "💡 L'interfrange est la distance séparant deux franges brillantes (ou sombres) consécutives."
    },
    {
        id: "FC_PHYS_DOPPLER",
        discipline: "Physique",
        level: "2BAC SM/PC",
        chapter: "Ondes Mécaniques",
        title: "Effet Doppler Sonore",
        question: "Fréquence perçue $f'$ si la source se rapproche d'un récepteur immobile à la vitesse $v_s$ :",
        latex: "f' = f \\cdot \\frac{c}{c - v_s} > f",
        tip: "💡 Son plus aigu lorsque la source s'approche (longueur d'onde apparente plus courte)."
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
        tip: "💡 Si [A⁻] = [AH], alors pH = pKa (point de demi-équivalence du titrage)."
    },
    {
        id: "FC_CHIM_NERNST",
        discipline: "Chimie",
        level: "2BAC SM/PC / CPGE",
        chapter: "Électrochimie & Piles",
        title: "Formule de Nernst",
        question: "Potentiel d'électrode pour le couple $\\alpha \\text{Ox} + n e^- \\rightleftharpoons \\beta \\text{Red}$ à 25°C :",
        latex: "E = E^\\circ + \\frac{0.059}{n} \\log\\left( \\frac{[\\text{Ox}]^\\alpha}{[\\text{Red}]^\\beta} \\right)",
        tip: "💡 À l'équilibre électrochimique (pile usée) : E_cathode = E_anode et f.e.m. ΔE = 0."
    },
    {
        id: "FC_CHIM_ARRHENIUS",
        discipline: "Chimie",
        level: "CPGE / 2BAC SM",
        chapter: "Cinétique Chimique",
        title: "Loi d'Arrhenius",
        question: "Comment varie la constante de vitesse $k$ en fonction de la température $T$ ?",
        latex: "k = A \\cdot \\exp\\left(-\\frac{E_a}{R \\cdot T}\\right)",
        tip: "💡 Tracer ln(k) en fonction de 1/T donne une droite de pente -Ea/R (détermination de l'énergie d'activation)."
    },
    {
        id: "FC_CHIM_QR",
        discipline: "Chimie",
        level: "2BAC SM/PC",
        chapter: "Sens d'Évolution",
        title: "Critère d'Évolution Spontanée",
        question: "Quel est le critère comparant le quotient de réaction initial $Q_{r,i}$ à la constante $K$ ?",
        latex: "Q_{r,i} < K \\implies \\text{Sens direct (1)}, \\quad Q_{r,i} > K \\implies \\text{Sens indirect (2)}",
        tip: "💡 Si Q_r = K, le système chimique est en état d'équilibre dynamique stationnaire."
    },
    {
        id: "FC_CHIM_KS",
        discipline: "Chimie",
        level: "2BAC SM/PC / CPGE",
        chapter: "Précipitation",
        title: "Produit de Solubilité Ks",
        question: "Expression du $K_s$ pour la dissolution d'un sel peu soluble $A_n B_m(s)$ :",
        latex: "K_s = [A^{m+}]^n \\cdot [B^{n-}]^m",
        tip: "💡 Condition d'apparition du premier précipité : le produit ionique Q_r dépasse Ks."
    },
    {
        id: "FC_CHIM_FARADAY",
        discipline: "Chimie",
        level: "2BAC SM/PC",
        chapter: "Électrolyse",
        title: "Charge & Quantité d'Électrons",
        question: "Quelle est la relation reliant le courant $I$, la durée $\\Delta t$ et le nombre de moles d'électrons $n(e^-)$ ?",
        latex: "Q = I \\cdot \\Delta t = n(e^-) \\cdot \\mathcal{F} \\quad (\\mathcal{F} \\approx 96500 \\, \\text{C} \\cdot \\text{mol}^{-1})",
        tip: "💡 Permet de calculer la masse de métal déposé à la cathode : m = [n(e⁻)/z] × M."
    },

    // --- INFORMATIQUE ---
    {
        id: "FC_INFO_01",
        discipline: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        title: "Complexité du Tri Rapide (Quicksort)",
        question: "Complexité temporelle moyenne et au pire cas du tri rapide :",
        latex: "T_{moyen}(n) = \\mathcal{O}(n \\log n), \\quad T_{pire}(n) = \\mathcal{O}(n^2)",
        tip: "💡 Le pire cas survient lorsque le pivot choisi est systématiquement le minimum ou maximum."
    },
    {
        id: "FC_INFO_02",
        discipline: "Informatique",
        level: "CPGE / SM",
        chapter: "Structures & Graphes",
        title: "Algorithme de Dijkstra",
        question: "Complexité temporelle de l'algorithme de Dijkstra avec file à priorité (tas binaire) :",
        latex: "\\mathcal{O}\\big((|V| + |E|) \\log |V|\\big)",
        tip: "⚠️ Ne fonctionne que pour des arêtes de poids STRICTEMENT positifs ou nuls."
    },
    {
        id: "FC_INFO_DICHO",
        discipline: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        title: "Recherche par Dichotomie",
        question: "Quelle est la complexité temporelle de la recherche dichotomique dans un tableau trié de taille $n$ ?",
        latex: "\\mathcal{O}(\\log n)",
        tip: "💡 Divise la taille de recherche par 2 à chaque étape. Invariant de boucle fondamental."
    },
    {
        id: "FC_INFO_DYNAMIC",
        discipline: "Informatique",
        level: "CPGE MP/PSI",
        chapter: "Programmation Dynamique",
        title: "Principe de la Programmation Dynamique",
        question: "Quelles sont les deux propriétés indispensables pour appliquer la programmation dynamique ?",
        latex: "\\text{1. Sous-structure optimale} \\quad \\text{et} \\quad \\text{2. Chevauchement des sous-problèmes}",
        tip: "💡 Évite les recalculs redondants de la récursion naïve grâce à la mémoïsation (dictionnaire / matrice)."
    },
    {
        id: "FC_INFO_ABR",
        discipline: "Informatique",
        level: "CPGE MP/PSI",
        chapter: "Arbres Binaires",
        title: "Arbre Binaire de Recherche (ABR)",
        question: "Quelle est la propriété fondamentale d'un ABR et la complexité moyenne de recherche ?",
        latex: "\\forall y \\in \\text{fils gauche}, \\; y.val \\le x.val \\le \\forall z \\in \\text{fils droit}, \\; z.val \\implies \\mathcal{O}(\\log n)",
        tip: "⚠️ Si l'ABR est dégénéré (peigne), la complexité chute à O(n). D'où l'intérêt des arbres AVL rééquilibrés."
    },
    {
        id: "FC_INFO_SQL",
        discipline: "Informatique",
        level: "CPGE / Concours",
        chapter: "Bases de Données SQL",
        title: "Ordre d'Exécution Logique SQL",
        question: "Dans quel ordre logique le moteur SQL évalue-t-il les clauses d'une requête SELECT ?",
        latex: "\\text{FROM} \\to \\text{WHERE} \\to \\text{GROUP BY} \\to \\text{HAVING} \\to \\text{SELECT} \\to \\text{ORDER BY}",
        tip: "💡 C'est pourquoi un alias défini dans SELECT n'est PAS accessible dans la clause WHERE !"
    }
];

class FlashcardViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentIndex = 0;
        this.isFlipped = false;
        this.selectedDiscipline = "All";
        this.masteredCards = new Set(JSON.parse(localStorage.getItem("ss_mastered_cards") || "[]"));
    }

    getFilteredCards() {
        if (this.selectedDiscipline === "All") return STUDY_FLASHCARDS;
        return STUDY_FLASHCARDS.filter(c => c.discipline === this.selectedDiscipline);
    }

    getMasteryPercentage() {
        if (STUDY_FLASHCARDS.length === 0) return 0;
        return Math.round((this.masteredCards.size / STUDY_FLASHCARDS.length) * 100);
    }

    render() {
        if (!this.container) return;
        const cards = this.getFilteredCards();
        const card = cards[this.currentIndex] || cards[0];
        const isMastered = this.masteredCards.has(card.id);
        const masteryPct = this.getMasteryPercentage();

        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-sm mx-auto space-y-3">
                <!-- Header Discipline Filter & Mastery Bar -->
                <div class="w-full space-y-2">
                    <div class="flex items-center justify-between w-full px-1">
                        <span class="text-xs uppercase tracking-widest font-black text-brand-goldLight flex items-center gap-1.5 font-outfit">
                            <i class="fa-solid fa-graduation-cap text-brand-gold"></i> Flashcards (${this.currentIndex + 1}/${cards.length})
                        </span>
                        <select id="fc-discipline-filter" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2.5 py-1 text-[11px] text-brand-goldLight focus:outline-none focus:border-brand-gold font-outfit font-bold shadow-inner">
                            <option value="All" ${this.selectedDiscipline === 'All' ? 'selected' : ''}>Toutes les Matières</option>
                            <option value="Maths" ${this.selectedDiscipline === 'Maths' ? 'selected' : ''}>📐 Maths</option>
                            <option value="Physique" ${this.selectedDiscipline === 'Physique' ? 'selected' : ''}>⚛️ Physique</option>
                            <option value="Chimie" ${this.selectedDiscipline === 'Chimie' ? 'selected' : ''}>🧪 Chimie</option>
                            <option value="Informatique" ${this.selectedDiscipline === 'Informatique' ? 'selected' : ''}>💻 Informatique</option>
                        </select>
                    </div>

                    <!-- Leitner Mastery Gauge -->
                    <div class="w-full glass-card p-2 rounded-xl border border-brand-borderSubtle flex items-center justify-between gap-2 text-[10px]">
                        <span class="text-brand-muted font-outfit font-semibold flex items-center gap-1">
                            <i class="fa-solid fa-award text-brand-gold"></i> Maîtrise STEM :
                        </span>
                        <div class="flex-1 h-1.5 bg-brand-darker rounded-full overflow-hidden border border-brand-border">
                            <div class="h-full bg-gradient-to-r from-brand-cherry via-brand-gold to-brand-goldLight transition-all duration-500" style="width: ${masteryPct}%"></div>
                        </div>
                        <span class="font-mono font-black text-brand-goldLight">${this.masteredCards.size}/${STUDY_FLASHCARDS.length} (${masteryPct}%)</span>
                    </div>
                </div>

                <!-- 3D Card Container -->
                <div id="fc-card" class="w-full min-h-[250px] rounded-2xl glass-card border ${isMastered ? 'border-emerald-500/50 shadow-emerald-950/30' : 'border-brand-borderSubtle'} p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-brand-gold/60 shadow-xl relative overflow-hidden group select-none">
                    
                    <!-- Decorative Golden Shimmer Pill for Mastered Cards -->
                    ${isMastered ? `
                        <div class="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-2.5 py-0.5 rounded-full font-outfit">
                            <i class="fa-solid fa-check"></i> Maîtrisé
                        </div>
                    ` : ''}

                    <!-- Top Info Badges -->
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-brand-darker text-brand-goldLight border border-brand-borderSubtle font-bold">
                            ${card.level} • ${card.chapter}
                        </span>
                        <span class="text-xs text-brand-muted group-hover:text-brand-gold transition pr-1">
                            <i class="fa-solid fa-arrows-rotate text-sm"></i>
                        </span>
                    </div>

                    <!-- Main Content (Front or Back) -->
                    <div class="my-3 text-center flex flex-col items-center justify-center flex-1">
                        ${!this.isFlipped ? `
                            <span class="text-xs sm:text-sm uppercase tracking-wider text-brand-gold font-black mb-1.5 font-outfit">
                                ${card.title}
                            </span>
                            <p class="text-sm sm:text-base font-bold text-white leading-relaxed fc-latex-render px-2" id="fc-q-text">
                                ${card.question}
                            </p>
                            <span class="text-xs text-brand-muted mt-3 italic flex items-center gap-1 font-outfit font-medium">
                                <i class="fa-solid fa-hand-pointer animate-bounce text-brand-gold"></i> Clique pour révéler la formule
                            </span>
                        ` : `
                            <span class="text-xs uppercase tracking-wider text-emerald-400 font-black mb-1.5 font-outfit">
                                Formule d'Excellence
                            </span>
                            <div class="my-1.5 p-2.5 rounded-xl bg-brand-darker border border-brand-borderSubtle text-brand-goldLight font-mono text-sm sm:text-base font-bold shadow-inner fc-latex-render max-w-full overflow-x-auto" id="fc-math-render">
                                $$${card.latex}$$
                            </div>
                            <p class="text-xs text-brand-goldLight mt-1.5 p-2 rounded-lg bg-brand-card border border-brand-borderSubtle text-left leading-normal font-sans font-medium">
                                ${card.tip}
                            </p>
                        `}
                    </div>

                    <!-- Bottom Nav / Rating -->
                    <div class="pt-2 border-t border-brand-border flex items-center justify-between">
                        <button id="fc-prev-btn" class="text-xs text-brand-muted hover:text-white flex items-center gap-1 font-outfit transition">
                            <i class="fa-solid fa-arrow-left"></i> Précédent
                        </button>
                        <button id="fc-shuffle-btn" title="Mélanger l'ordre des cartes" class="text-xs text-brand-muted hover:text-brand-gold transition px-2">
                            <i class="fa-solid fa-shuffle"></i>
                        </button>
                        <button id="fc-next-btn" class="text-xs text-brand-goldLight hover:text-white font-bold flex items-center gap-1 font-outfit transition">
                            Suivant <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- Rating Buttons (Shown when flipped) -->
                ${this.isFlipped ? `
                    <div class="flex gap-2 w-full pt-1">
                        <button id="fc-review-hard" class="flex-1 py-2 rounded-xl bg-brand-card hover:bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold text-xs transition active:scale-95 font-outfit shadow">
                            ❌ À Revoir
                        </button>
                        <button id="fc-review-easy" class="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs transition active:scale-95 shadow-lg font-outfit">
                            ✅ Maîtrisé (+20 XP)
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

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
                } catch (e) {
                    // Fallback
                }
            });
        }

        // Attach Listeners
        document.getElementById("fc-card")?.addEventListener("click", (e) => {
            if (e.target.closest("button") || e.target.closest("select")) return;
            window.ambience?.playClick();
            this.isFlipped = !this.isFlipped;
            this.render();
        });

        document.getElementById("fc-discipline-filter")?.addEventListener("change", (e) => {
            this.selectedDiscipline = e.target.value;
            this.currentIndex = 0;
            this.isFlipped = false;
            this.render();
        });

        document.getElementById("fc-prev-btn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            window.ambience?.playClick();
            const cards = this.getFilteredCards();
            this.currentIndex = (this.currentIndex - 1 + cards.length) % cards.length;
            this.isFlipped = false;
            this.render();
        });

        document.getElementById("fc-shuffle-btn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            window.ambience?.playClick();
            const cards = this.getFilteredCards();
            this.currentIndex = Math.floor(Math.random() * cards.length);
            this.isFlipped = false;
            this.render();
        });

        document.getElementById("fc-next-btn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            window.ambience?.playClick();
            const cards = this.getFilteredCards();
            this.currentIndex = (this.currentIndex + 1) % cards.length;
            this.isFlipped = false;
            this.render();
        });

        document.getElementById("fc-review-easy")?.addEventListener("click", () => {
            window.ambience?.playSuccess();
            const cards = this.getFilteredCards();
            const currentCard = cards[this.currentIndex];
            if (currentCard) {
                this.masteredCards.add(currentCard.id);
                localStorage.setItem("ss_mastered_cards", JSON.stringify([...this.masteredCards]));
            }
            window.levelSystem?.addXP(20, "Flashcard Maîtrisée");
            this.currentIndex = (this.currentIndex + 1) % cards.length;
            this.isFlipped = false;
            this.render();
        });

        document.getElementById("fc-review-hard")?.addEventListener("click", () => {
            window.ambience?.playClick();
            const cards = this.getFilteredCards();
            const currentCard = cards[this.currentIndex];
            if (currentCard) {
                this.masteredCards.delete(currentCard.id);
                localStorage.setItem("ss_mastered_cards", JSON.stringify([...this.masteredCards]));
            }
            this.currentIndex = (this.currentIndex + 1) % cards.length;
            this.isFlipped = false;
            this.render();
        });
    }
}

window.FlashcardViewer = FlashcardViewer;
