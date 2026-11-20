/**
 * StudySouk Timer - STEM Duel Arena 1v1 & Concours Quiz (Luxury Edition)
 * Curated STEM challenges (Maths, Physique-Chimie, Informatique, Médecine) for 2BAC SM/PC & CPGE.
 * Features:
 *   1. Concours Blanc Express (Solo QCM with Moroccan Grading +1 / -0.25)
 *   2. Solo vs Major IA (3 difficulty tiers: Admissible, Major CNC, Génie)
 *   3. Realtime 1v1 Multiplayer in Discord Voice Channel (via roomSync)
 *   4. Detailed Step-by-Step Review & Solutions Screen (Corrigé Y. Alaoui)
 */

const DUEL_QUESTIONS_BANK = [
    // --- MATHÉMATIQUES (ANALYSE & INTÉGRALES) ---
    {
        id: "M_ANA_01",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Dérivabilité & Fonctions",
        question: "Quelle est la dérivée de la fonction réciproque $f(x) = \\arctan(x)$ sur $\\mathbb{R}$ ?",
        options: {
            "A": "\\frac{1}{1+x^2}",
            "B": "\\frac{1}{\\sqrt{1-x^2}}",
            "C": "-\\frac{1}{1+x^2}",
            "D": "\\frac{1}{1-x^2}"
        },
        correct: "A",
        explanation: "Par dérivation de la réciproque de $\\tan$ sur $]-\\frac{\\pi}{2}, \\frac{\\pi}{2}[$, $(\\arctan)'(x) = \\frac{1}{1+x^2}$."
    },
    {
        id: "M_ANA_02",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Calcul Intégral",
        question: "Une primitive sur $]1, +\\infty[$ de la fonction $f(x) = \\frac{1}{x \\ln(x)}$ est :",
        options: {
            "A": "\\ln(x) + C",
            "B": "\\ln(\\ln(x)) + C",
            "C": "\\frac{1}{\\ln^2(x)} + C",
            "D": "-\\frac{1}{x^2} + C"
        },
        correct: "B",
        explanation: "De la forme $\\frac{u'(x)}{u(x)}$ avec $u(x) = \\ln(x) > 0$, d'où $\\int \\frac{dx}{x\\ln x} = \\ln(|u(x)|) + C = \\ln(\\ln x) + C$."
    },
    {
        id: "M_ANA_03",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Limites & Continuité",
        question: "Quelle est la valeur de la limite $\\lim_{x \\to 0} \\frac{\\sin(3x)}{\\ln(1+2x)}$ ?",
        options: {
            "A": "\\frac{3}{2}",
            "B": "\\frac{2}{3}",
            "C": "0",
            "D": "+\\infty"
        },
        correct: "A",
        explanation: "$\\frac{\\sin(3x)}{\\ln(1+2x)} = \\frac{\\sin(3x)}{3x} \\times \\frac{2x}{\\ln(1+2x)} \\times \\frac{3}{2} \\xrightarrow[x \\to 0]{} 1 \\times 1 \\times \\frac{3}{2} = \\frac{3}{2}$."
    },
    {
        id: "M_ANA_04",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Calcul Intégral",
        question: "Valeur exacte de l'intégrale $I = \\int_{0}^{1} \\frac{1}{1+x^2} \\, dx$ :",
        options: {
            "A": "\\frac{\\pi}{4}",
            "B": "\\frac{\\pi}{2}",
            "C": "1",
            "D": "\\ln(2)"
        },
        correct: "A",
        explanation: "Une primitive immédiate est $\\arctan(x)$, donc $I = \\arctan(1) - \\arctan(0) = \\frac{\\pi}{4} - 0 = \\frac{\\pi}{4}$."
    },
    {
        id: "M_ANA_EXP",
        subject: "Maths",
        level: "2BAC SM/PC",
        chapter: "Limites & Dérivées",
        question: "Quelle est la valeur de la limite $\\lim_{x \\to 0} \\frac{e^{5x} - 1}{2x}$ ?",
        options: {
            "A": "\\frac{5}{2}",
            "B": "\\frac{2}{5}",
            "C": "1",
            "D": "0"
        },
        correct: "A",
        explanation: "Taux d'accroissement de $t \\mapsto e^{5t}$ en 0 : $\\lim_{x \\to 0} \\frac{e^{5x}-1}{5x} \\times \\frac{5}{2} = 1 \\times \\frac{5}{2} = \\frac{5}{2}$."
    },
    {
        id: "M_ANA_EQUIV",
        subject: "Maths",
        level: "CPGE MP/PSI",
        chapter: "Développements Limités",
        question: "Quel est l'équivalent au voisinage de 0 de $f(x) = \\cos(x) - 1$ ?",
        options: {
            "A": "-\\frac{x^2}{2}",
            "B": "\\frac{x^2}{2}",
            "C": "-x",
            "D": "-\\frac{x^4}{24}"
        },
        correct: "A",
        explanation: "Le développement limité à l'ordre 2 est $\\cos(x) = 1 - \\frac{x^2}{2} + o(x^2)$, donc $\\cos(x) - 1 \\sim -\\frac{x^2}{2}$."
    },

    // --- MATHÉMATIQUES (ALGÈBRE & GÉOMÉTRIE) ---
    {
        id: "M_ALG_01",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Nombres Complexes",
        question: "Quelle est la forme exponentielle de $z = 1 + i\\sqrt{3}$ ?",
        options: {
            "A": "2 e^{i\\frac{\\pi}{3}}",
            "B": "2 e^{i\\frac{\\pi}{6}}",
            "C": "\\sqrt{2} e^{i\\frac{\\pi}{3}}",
            "D": "e^{i\\frac{\\pi}{3}}"
        },
        correct: "A",
        explanation: "$|z| = \\sqrt{1^2 + (\\sqrt{3})^2} = 2$. On a $\\cos \\theta = 1/2$ et $\\sin \\theta = \\sqrt{3}/2 \\implies \\theta = \\frac{\\pi}{3}$."
    },
    {
        id: "M_ALG_RANG",
        subject: "Maths",
        level: "CPGE / 2BAC SM",
        chapter: "Algèbre Linéaire",
        question: "Pour une application linéaire $u: E \\to F$ avec $\\dim(E) < \\infty$, le théorème du rang énonce :",
        options: {
            "A": "\\dim(E) = \\dim(\\ker u) + \\operatorname{rg}(u)",
            "B": "\\dim(F) = \\dim(\\ker u) + \\operatorname{rg}(u)",
            "C": "\\operatorname{rg}(u) = \\dim(E) \\times \\dim(F)",
            "D": "\\dim(\\ker u) = \\operatorname{rg}(u)"
        },
        correct: "A",
        explanation: "Théorème du rang : $\\dim(E) = \\dim(\\ker u) + \\dim(\\operatorname{Im} u)$ avec $\\operatorname{rg}(u) = \\dim(\\operatorname{Im} u)$."
    },
    {
        id: "M_PROB_BINOM",
        subject: "Maths",
        level: "2BAC SM / CPGE",
        chapter: "Dénombrement & Probas",
        question: "Quel est le coefficient de $x^3$ dans le développement de $(1+x)^5$ ?",
        options: {
            "A": "10",
            "B": "5",
            "C": "15",
            "D": "20"
        },
        correct: "A",
        explanation: "Formule du binôme de Newton : le terme en $x^3$ est $\\binom{5}{3} x^3 = \\frac{5!}{3! \\times 2!} x^3 = 10 x^3$."
    },
    {
        id: "M_ALG_DET",
        subject: "Maths",
        level: "CPGE MP/PSI/TSI",
        chapter: "Matrices & Déterminants",
        question: "Si $A \\in \\mathcal{M}_n(\\mathbb{K})$ et $\\lambda \\in \\mathbb{K}$, que vaut $\\det(\\lambda A)$ ?",
        options: {
            "A": "\\lambda^n \\det(A)",
            "B": "\\lambda \\det(A)",
            "C": "n \\lambda \\det(A)",
            "D": "\\lambda^{n-1} \\det(A)"
        },
        correct: "A",
        explanation: "Le déterminant est une forme n-linéaire alternée : factoriser un scalaire sur chacune des $n$ colonnes donne $\\lambda^n$."
    },

    // --- PHYSIQUE (ÉLECTRICITÉ & ONDES) ---
    {
        id: "P_ONDE_01",
        subject: "Physique",
        level: "2BAC SM/PC",
        chapter: "Ondes Mécaniques",
        question: "La célérité $v$ d'une onde sur une corde sous tension $F$ et masse linéique $\\mu$ :",
        options: {
            "A": "v = \\sqrt{\\frac{F}{\\mu}}",
            "B": "v = \\sqrt{\\frac{\\mu}{F}}",
            "C": "v = \\frac{F}{\\mu}",
            "D": "v = \\sqrt{F \\cdot \\mu}"
        },
        correct: "A",
        explanation: "D'après l'analyse dimensionnelle, $[F/\\mu] = (\\text{kg}\\cdot\\text{m}\\cdot\\text{s}^{-2})/(\\text{kg}\\cdot\\text{m}^{-1}) = \\text{m}^2\\cdot\\text{s}^{-2} \\implies v = \\sqrt{F/\\mu}$."
    },
    {
        id: "P_ELEC_COND",
        subject: "Physique",
        level: "2BAC SM/PC",
        chapter: "Électricité RC",
        question: "Quelle est l'énergie électrostatique stockée dans un condensateur $C$ sous la tension $U_C$ ?",
        options: {
            "A": "\\frac{1}{2} C U_C^2",
            "B": "C U_C^2",
            "C": "\\frac{1}{2} C^2 U_C",
            "D": "\\frac{U_C^2}{2C}"
        },
        correct: "A",
        explanation: "L'énergie électrostatique est $\\mathcal{E}_e = \\int u \\cdot i \\, dt = \\int C u \\, du = \\frac{1}{2} C U_C^2 = \\frac{q^2}{2C}$."
    },
    {
        id: "P_ELEC_BOBINE",
        subject: "Physique",
        level: "2BAC SM/PC",
        chapter: "Électricité RL",
        question: "Quelle est l'énergie magnétique stockée dans une bobine d'inductance $L$ traversée par un courant $i$ ?",
        options: {
            "A": "\\frac{1}{2} L i^2",
            "B": "L i^2",
            "C": "\\frac{1}{2} L^2 i",
            "D": "\\frac{i^2}{2L}"
        },
        correct: "A",
        explanation: "L'énergie magnétique emmagasinée par une bobine est $\\mathcal{E}_m = \\frac{1}{2} L i^2$."
    },
    {
        id: "P_ELEC_RESONANCE",
        subject: "Physique",
        level: "2BAC SM",
        chapter: "RLC Forcé",
        question: "À la résonance d'intensité dans un circuit RLC série, l'impédance totale $Z$ est :",
        options: {
            "A": "Z = R \\quad (\\text{minimale})",
            "B": "Z = 0",
            "C": "Z = \\sqrt{R^2 + (L\\omega)^2}",
            "D": "Z \\to +\\infty"
        },
        correct: "A",
        explanation: "On a $Z = \\sqrt{R^2 + (L\\omega - \\frac{1}{C\\omega})^2}$. À la résonance, $L\\omega_0 = \\frac{1}{C\\omega_0}$, donc $Z = R$ est minimale et $I_0$ maximale."
    },

    // --- PHYSIQUE (MÉCANIQUE & THERMO) ---
    {
        id: "P_MECA_01",
        subject: "Physique",
        level: "2BAC SM/PC",
        chapter: "Lois de Newton",
        question: "Quelle est l'énergie cinétique de translation d'un solide de masse $m$ à la vitesse $v$ ?",
        options: {
            "A": "\\frac{1}{2} m v^2",
            "B": "m v^2",
            "C": "\\frac{1}{2} m^2 v",
            "D": "m g h"
        },
        correct: "A",
        explanation: "Par définition dans un référentiel galiléen, l'énergie cinétique de translation est $E_c = \\frac{1}{2} m v^2$."
    },
    {
        id: "P_KEPLER_3",
        subject: "Physique",
        level: "2BAC SM/PC / CPGE",
        chapter: "Gravitation & Satellites",
        question: "Selon la 3ème loi de Kepler, pour une planète de période $T$ et demi-grand axe $a$ :",
        options: {
            "A": "\\frac{T^2}{a^3} = \\text{constante}",
            "B": "\\frac{T^3}{a^2} = \\text{constante}",
            "C": "T^2 \\cdot a^3 = \\text{constante}",
            "D": "\\frac{T}{a} = \\text{constante}"
        },
        correct: "A",
        explanation: "La 3ème loi de Kepler stipule que $\\frac{T^2}{a^3} = \\frac{4\\pi^2}{G M_{\\text{astre}}} = \\text{cste}$, indépendant de la masse du satellite."
    },
    {
        id: "P_THERMO_GP",
        subject: "Physique",
        level: "CPGE MP/PSI/TSI",
        chapter: "Thermodynamique",
        question: "Dans une transformation adiabatique réversible d'un gaz parfait (Loi de Laplace) :",
        options: {
            "A": "P \\cdot V^\\gamma = \\text{constante}",
            "B": "P \\cdot V = \\text{constante}",
            "C": "T \\cdot V^\\gamma = \\text{constante}",
            "D": "P^\\gamma \\cdot V = \\text{constante}"
        },
        correct: "A",
        explanation: "Loi de Laplace pour une transformation isentropique (adiabatique réversible) : $P V^\\gamma = \\text{cste}$ et $T V^{\\gamma-1} = \\text{cste}$."
    },

    // --- CHIMIE ---
    {
        id: "C_CHIM_01",
        subject: "Chimie",
        level: "2BAC SM/PC",
        chapter: "Solutions Aqueuses",
        question: "Quel est le produit ionique de l'eau pure $K_e$ à 25°C ?",
        options: {
            "A": "1.0 \\times 10^{-14}",
            "B": "1.0 \\times 10^{-7}",
            "C": "1.0 \\times 10^{14}",
            "D": "1.0"
        },
        correct: "A",
        explanation: "À 25°C, l'autoprotolyse de l'eau donne $K_e = [H_3O^+][HO^-] = 1.0 \\times 10^{-14}$ et $pK_e = 14$."
    },
    {
        id: "C_DO_OXYGENE",
        subject: "Chimie",
        level: "2BAC SM/PC / CPGE",
        chapter: "Oxydoréduction",
        question: "Quel est le nombre d'oxydation de l'atome de soufre dans l'ion sulfate $\\text{SO}_4^{2-}$ ?",
        options: {
            "A": "+VI",
            "B": "+IV",
            "C": "+II",
            "D": "-II"
        },
        correct: "A",
        explanation: "On a $\\operatorname{no}(S) + 4 \\times (-2) = -2 \\implies \\operatorname{no}(S) = -2 + 8 = +6$ (+VI)."
    },
    {
        id: "C_GAZ_PARFAIT",
        subject: "Chimie",
        level: "2BAC SM/PC / CPGE",
        chapter: "Thermodynamique",
        question: "Dans l'équation des gaz parfaits $P \\cdot V = n \\cdot R \\cdot T$, quelle est l'unité SI de la pression $P$ ?",
        options: {
            "A": "Pascal (Pa)",
            "B": "Bar",
            "C": "Atmosphère (atm)",
            "D": "Torr"
        },
        correct: "A",
        explanation: "Dans le Système International (SI), la pression est en Pascals (Pa), le volume en mètres cubes ($m^3$) et $T$ en Kelvins (K)."
    },
    {
        id: "C_CHIM_CINETIQUE",
        subject: "Chimie",
        level: "2BAC SM/PC",
        chapter: "Cinétique Chimique",
        question: "La vitesse volumique de réaction $v(t)$ dans un volume constant $V$ s'exprime par :",
        options: {
            "A": "v = \\frac{1}{V} \\frac{dx}{dt}",
            "B": "v = V \\frac{dx}{dt}",
            "C": "v = \\frac{dx}{dt}",
            "D": "v = \\frac{1}{V^2} x(t)"
        },
        correct: "A",
        explanation: "Par définition, $v(t) = \\frac{1}{V} \\frac{dx}{dt}$, proportionnelle au coefficient directeur de la tangente à la courbe de l'avancement $x(t)$."
    },

    // --- INFORMATIQUE ---
    {
        id: "I_INFO_01",
        subject: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        question: "Quelle est la complexité temporelle moyenne du tri rapide (Quicksort) ?",
        options: {
            "A": "\\mathcal{O}(n \\log n)",
            "B": "\\mathcal{O}(n^2)",
            "C": "\\mathcal{O}(n)",
            "D": "\\mathcal{O}(\\log n)"
        },
        correct: "A",
        explanation: "En moyenne, Quicksort partitionne le tableau en sous-tableaux équilibrés, d'où $\\mathcal{O}(n \\log n)$. Pire cas (pivot extrême) : $\\mathcal{O}(n^2)$."
    },
    {
        id: "I_INFO_02",
        subject: "Informatique",
        level: "CPGE / SM",
        chapter: "Structures de données",
        question: "Quel principe suit une file d'attente (Queue) en algorithmique ?",
        options: {
            "A": "FIFO (First In First Out)",
            "B": "LIFO (Last In First Out)",
            "C": "FILO",
            "D": "Random Access"
        },
        correct: "A",
        explanation: "Une file respecte le principe FIFO (Premier entré, premier sorti), alors qu'une pile suit le principe LIFO (Last In First Out)."
    },
    {
        id: "I_INFO_DICHO",
        subject: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        question: "Quelle est la complexité dans le pire des cas de la recherche dichotomique sur tableau trié ?",
        options: {
            "A": "\\mathcal{O}(\\log n)",
            "B": "\\mathcal{O}(n)",
            "C": "\\mathcal{O}(n \\log n)",
            "D": "\\mathcal{O}(1)"
        },
        correct: "A",
        explanation: "L'intervalle de recherche est divisé par 2 à chaque étape, soit un nombre d'itérations proportionnel à $\\log_2(n)$."
    },
    {
        id: "I_INFO_PYTHON",
        subject: "Informatique",
        level: "CPGE / SM",
        chapter: "Python & Mémoire",
        question: "En Python, que renvoie l'expression par compréhension `[x**2 for x in range(4)]` ?",
        options: {
            "A": "[0, 1, 4, 9]",
            "B": "[1, 4, 9, 16]",
            "C": "[0, 1, 4, 9, 16]",
            "D": "(0, 1, 4, 9)"
        },
        correct: "A",
        explanation: "`range(4)` produit les entiers 0, 1, 2, 3. Leurs carrés respectifs forment la liste `[0, 1, 4, 9]`."
    }
];

class DuelArena {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.mode = "concours"; // "concours" (solo exam) | "ai" (vs bot) | "multiplayer" (1v1 voice)
        this.questions = [];
        this.currentRound = 0;
        this.totalRounds = 5;
        this.playerScore = 0;
        this.opponentScore = 0;
        
        // Quiz & Timer settings
        this.timer = null;
        this.maxTime = 30; // 15, 30, 60, or 0 (no timer)
        this.timeLeft = 30;
        this.streak = 0;
        this.selectedSubject = "All";
        this.aiDifficulty = "major"; // "admissible" (70%) | "major" (90%) | "genie" (98%)
        
        // State tracking
        this.isRoundFinished = false;
        this.isPlaying = false;
        this.sessionHistory = []; // stores user choices, correctness, explanations for review
        
        // Multiplayer sync state
        this.isHost = false;
        this.currentChallengeId = null;
        this.opponentUser = null;
        this.waitingForOpponent = false;

        this.initMultiplayerSync();
    }

    initMultiplayerSync() {
        if (!window.roomSync) return;
        window.roomSync.on("duel_message", (msg) => {
            this.handleRemoteDuelMessage(msg);
        });
    }

    render() {
        if (!this.container) return;

        if (this.waitingForOpponent) {
            this.renderWaitingRoom();
        } else if (!this.isPlaying) {
            this.renderLobby();
        } else if (this.currentRound >= this.totalRounds) {
            this.renderResults();
        } else {
            this.renderQuestion();
        }

        // Render KaTeX formulas
        if (window.renderMathInElement) {
            this.container.querySelectorAll(".duel-latex-render").forEach(el => {
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

    renderLobby() {
        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-xl mx-auto space-y-4 w-full">
                
                <!-- HERO BANNER -->
                <div class="relative w-full rounded-2xl overflow-hidden glass-panel border border-brand-borderSubtle p-5 text-center shadow-xl">
                    <div class="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-cherry via-brand-gold to-brand-goldLight p-0.5 shadow-lg shadow-brand-cherry/40 mb-2.5">
                        <div class="w-full h-full bg-brand-darker rounded-[14px] flex items-center justify-center">
                            <i class="fa-solid fa-bolt text-xl text-brand-gold"></i>
                        </div>
                    </div>
                    <h2 class="text-base sm:text-lg font-black text-white font-outfit">
                        StudySouk <span class="text-brand-goldLight">Quiz & Duels STEM</span>
                    </h2>
                    <p class="text-xs text-brand-muted mt-1 leading-relaxed max-w-md mx-auto">
                        Entraînez-vous en conditions de <strong>Concours Blanc (+1 / -0.25)</strong>, affrontez le <strong>Major IA</strong> ou défiez vos pairs en <strong>1v1 direct</strong> !
                    </p>
                </div>

                <!-- 3 MAIN GAME MODES -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                    <button id="duel-mode-concours" class="p-3.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center text-center gap-1.5 font-outfit ${this.mode === 'concours' ? 'bg-brand-cherry border-brand-gold text-white shadow-xl shadow-brand-cherry/40 font-black' : 'glass-card border-brand-borderSubtle text-brand-muted hover:text-white'}">
                        <i class="fa-solid fa-graduation-cap text-lg text-brand-gold"></i>
                        <span class="text-white text-xs">Concours Blanc</span>
                        <span class="text-[10px] font-normal text-emerald-400">Solo QCM Officiel</span>
                    </button>

                    <button id="duel-mode-ai" class="p-3.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center text-center gap-1.5 font-outfit ${this.mode === 'ai' ? 'bg-brand-cherry border-brand-gold text-white shadow-xl shadow-brand-cherry/40 font-black' : 'glass-card border-brand-borderSubtle text-brand-muted hover:text-white'}">
                        <i class="fa-solid fa-robot text-lg text-brand-gold"></i>
                        <span class="text-white text-xs">Major IA 🤖</span>
                        <span class="text-[10px] font-normal text-amber-300">Entraînement Solo</span>
                    </button>

                    <button id="duel-mode-mp" class="p-3.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center text-center gap-1.5 font-outfit ${this.mode === 'multiplayer' ? 'bg-brand-cherry border-brand-gold text-white shadow-xl shadow-brand-cherry/40 font-black' : 'glass-card border-brand-borderSubtle text-brand-muted hover:text-white'}">
                        <i class="fa-solid fa-users-viewfinder text-lg text-brand-gold"></i>
                        <span class="text-white text-xs">1v1 Vocal Live</span>
                        <span class="text-[10px] font-normal text-cyan-300">Multiplayer Discord</span>
                    </button>
                </div>

                <!-- CONFIGURATION DRAWER -->
                <div class="w-full glass-panel rounded-2xl p-4 border border-brand-borderSubtle space-y-3 shadow-lg">
                    <div class="text-[11px] font-bold uppercase tracking-wider text-brand-goldLight font-mono flex items-center gap-1.5">
                        <i class="fa-solid fa-sliders"></i> Paramètres de l'Épreuve
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-outfit">
                        <!-- Subject Selector -->
                        <div class="flex flex-col gap-1">
                            <label class="text-[10px] text-brand-muted font-bold">Matière :</label>
                            <select id="duel-subject-select" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-brand-gold">
                                <option value="All" ${this.selectedSubject === 'All' ? 'selected' : ''}>Toutes les STEM</option>
                                <option value="Maths" ${this.selectedSubject === 'Maths' ? 'selected' : ''}>📐 Mathématiques</option>
                                <option value="Physique" ${this.selectedSubject === 'Physique' ? 'selected' : ''}>⚛️ Physique</option>
                                <option value="Chimie" ${this.selectedSubject === 'Chimie' ? 'selected' : ''}>🧪 Chimie</option>
                                <option value="Informatique" ${this.selectedSubject === 'Informatique' ? 'selected' : ''}>💻 Informatique</option>
                            </select>
                        </div>

                        <!-- Rounds Count -->
                        <div class="flex flex-col gap-1">
                            <label class="text-[10px] text-brand-muted font-bold">Nombre de Questions :</label>
                            <select id="duel-rounds-select" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-brand-gold">
                                <option value="5" ${this.totalRounds === 5 ? 'selected' : ''}>5 Questions (Express)</option>
                                <option value="10" ${this.totalRounds === 10 ? 'selected' : ''}>10 Questions (Standard)</option>
                                <option value="15" ${this.totalRounds === 15 ? 'selected' : ''}>15 Questions (Grand Concours)</option>
                            </select>
                        </div>

                        <!-- Time Per Question -->
                        <div class="flex flex-col gap-1">
                            <label class="text-[10px] text-brand-muted font-bold">Chrono par Question :</label>
                            <select id="duel-timer-select" class="bg-brand-darker border border-brand-borderSubtle rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-brand-gold">
                                <option value="15" ${this.maxTime === 15 ? 'selected' : ''}>15s (Blitz Reflex)</option>
                                <option value="30" ${this.maxTime === 30 ? 'selected' : ''}>30s (Concours Moyen)</option>
                                <option value="60" ${this.maxTime === 60 ? 'selected' : ''}>60s (Démonstration)</option>
                                <option value="0" ${this.maxTime === 0 ? 'selected' : ''}>Pas de Chrono (Serein)</option>
                            </select>
                        </div>
                    </div>

                    ${this.mode === 'ai' ? `
                        <div class="pt-2 border-t border-brand-borderSubtle flex items-center justify-between text-xs font-outfit">
                            <span class="text-[11px] text-brand-muted font-bold flex items-center gap-1">
                                <i class="fa-solid fa-brain text-brand-gold"></i> Niveau du Bot IA :
                            </span>
                            <div class="flex gap-1.5">
                                <button data-ai="admissible" class="ai-lvl-btn px-2.5 py-1 rounded-lg text-[10px] font-bold border ${this.aiDifficulty === 'admissible' ? 'bg-amber-600 text-white border-amber-400' : 'bg-brand-darker text-brand-muted border-brand-borderSubtle'}">
                                    Admissible (70%)
                                </button>
                                <button data-ai="major" class="ai-lvl-btn px-2.5 py-1 rounded-lg text-[10px] font-bold border ${this.aiDifficulty === 'major' ? 'bg-brand-cherry text-white border-brand-gold' : 'bg-brand-darker text-brand-muted border-brand-borderSubtle'}">
                                    Major CNC (90%)
                                </button>
                                <button data-ai="genie" class="ai-lvl-btn px-2.5 py-1 rounded-lg text-[10px] font-bold border ${this.aiDifficulty === 'genie' ? 'bg-purple-700 text-white border-purple-400' : 'bg-brand-darker text-brand-muted border-brand-borderSubtle'}">
                                    X / Mines (98%)
                                </button>
                            </div>
                        </div>
                    ` : ''}
                    ${this.mode === 'multiplayer' ? `
                        <div class="p-3 rounded-2xl bg-brand-darker border border-cyan-500/30 text-xs font-outfit space-y-2">
                            <div class="flex items-center justify-between text-[11px] font-bold text-cyan-300">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                    Membres du salon vocal (1v1 Live) :
                                </span>
                                <span class="text-[10px] text-brand-muted font-mono font-normal">Multiplayer Actif</span>
                            </div>
                            <div class="flex flex-wrap gap-1.5 pt-0.5">
                                ${this.renderVoiceRoomPeers()}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- START BUTTON -->
                <button id="duel-start-btn" class="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-cherry via-brand-cherryDark to-brand-cherry border border-brand-gold text-white font-black text-xs uppercase tracking-wider transition active:scale-98 shadow-xl shadow-brand-cherry/50 hover:brightness-110 font-outfit flex items-center justify-center gap-2">
                    <i class="fa-solid ${this.mode === 'multiplayer' ? 'fa-bullhorn' : 'fa-play'}"></i>
                    <span>${this.mode === 'multiplayer' ? 'Défier le Salon Vocal (1v1 Live)' : (this.mode === 'concours' ? 'Démarrer le Concours Blanc (+50 XP)' : 'Défier le Major IA (+50 XP)')}</span>
                </button>
            </div>
        `;

        this.attachLobbyListeners();
    }

    attachLobbyListeners() {
        document.getElementById("duel-mode-concours")?.addEventListener("click", () => {
            this.mode = "concours";
            window.ambience?.playClick();
            this.renderLobby();
        });
        document.getElementById("duel-mode-ai")?.addEventListener("click", () => {
            this.mode = "ai";
            window.ambience?.playClick();
            this.renderLobby();
        });
        document.getElementById("duel-mode-mp")?.addEventListener("click", () => {
            this.mode = "multiplayer";
            window.ambience?.playClick();
            this.renderLobby();
        });

        document.getElementById("duel-subject-select")?.addEventListener("change", (e) => {
            this.selectedSubject = e.target.value;
        });
        document.getElementById("duel-rounds-select")?.addEventListener("change", (e) => {
            this.totalRounds = parseInt(e.target.value);
        });
        document.getElementById("duel-timer-select")?.addEventListener("change", (e) => {
            this.maxTime = parseInt(e.target.value);
            this.timeLeft = this.maxTime;
        });

        document.querySelectorAll(".ai-lvl-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.aiDifficulty = btn.dataset.ai;
                window.ambience?.playClick();
                this.renderLobby();
            });
        });

        document.getElementById("duel-start-btn")?.addEventListener("click", () => {
            if (this.mode === "multiplayer") {
                this.launchMultiplayerChallenge();
            } else {
                this.startMatch();
            }
        });
    }

    startMatch() {
        let pool = DUEL_QUESTIONS_BANK;
        if (this.selectedSubject !== "All") {
            pool = DUEL_QUESTIONS_BANK.filter(q => q.subject.includes(this.selectedSubject));
            if (pool.length < this.totalRounds) pool = DUEL_QUESTIONS_BANK;
        }

        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        this.questions = shuffled.slice(0, this.totalRounds);
        this.currentRound = 0;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.streak = 0;
        this.sessionHistory = [];
        this.isPlaying = true;
        this.waitingForOpponent = false;

        if (this.mode === "ai") {
            const aiTitles = {
                "admissible": "Candidat Admissible 🤖",
                "major": "Major CNC Y. Alaoui 🤖",
                "genie": "Polytechnicien X 🤖"
            };
            this.opponentUser = { name: aiTitles[this.aiDifficulty] || "Major IA 🤖", avatar: null };
        } else {
            this.opponentUser = null;
        }

        window.ambience?.playSuccess();
        this.startRound();
    }

    startRound() {
        this.isRoundFinished = false;
        this.timeLeft = this.maxTime;
        clearInterval(this.timer);

        this.renderQuestion();

        if (this.maxTime > 0) {
            this.timer = setInterval(() => {
                this.timeLeft -= 1;
                const bar = document.getElementById("duel-timer-bar");
                const timeText = document.getElementById("duel-timer-text");

                if (bar) {
                    const pct = (this.timeLeft / this.maxTime) * 100;
                    bar.style.width = `${pct}%`;
                    if (this.timeLeft <= 5) {
                        bar.className = "h-full bg-rose-500 transition-all duration-300";
                    }
                }
                if (timeText) timeText.textContent = `${this.timeLeft}s`;

                if (this.timeLeft <= 0) {
                    clearInterval(this.timer);
                    this.handleTimeout();
                }
            }, 1000);
        }
    }

    renderQuestion() {
        const q = this.questions[this.currentRound];
        if (!q) return;

        const oppName = this.opponentUser ? this.opponentUser.name : (this.mode === "ai" ? "Major IA 🤖" : null);

        this.container.innerHTML = `
            <div class="flex flex-col max-w-xl mx-auto space-y-3.5 w-full">
                
                <!-- TOP SCOREBOARD -->
                <div class="flex items-center justify-between p-3 rounded-2xl glass-panel border border-brand-borderSubtle text-xs font-outfit shadow-lg">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                        <span class="font-bold text-white">Toi</span>
                        <span class="font-mono font-black text-sm text-brand-goldLight" id="duel-my-score">${this.playerScore}</span>
                        ${this.streak > 1 ? `
                            <span class="text-[10px] font-bold text-amber-400 flex items-center gap-0.5 animate-pulse">
                                <i class="fa-solid fa-fire"></i> x${this.streak}
                            </span>
                        ` : ''}
                    </div>

                    <div class="px-3 py-1 rounded-xl bg-brand-cherry border border-brand-gold/40 text-xs font-black text-white font-mono shadow-sm">
                        Q ${this.currentRound + 1} / ${this.totalRounds}
                    </div>

                    ${oppName ? `
                        <div class="flex items-center gap-2">
                            <span class="font-mono font-black text-sm text-slate-200" id="duel-opp-score">${this.opponentScore}</span>
                            <span class="font-bold text-brand-muted truncate max-w-[100px]">${oppName}</span>
                            <span class="w-3 h-3 rounded-full bg-rose-400"></span>
                        </div>
                    ` : `
                        <div class="text-[11px] text-brand-muted font-bold">
                            Barème : <span class="text-emerald-400">+1</span> / <span class="text-rose-400">-0.25</span>
                        </div>
                    `}
                </div>

                <!-- TIMER PROGRESS (IF ENABLED) -->
                ${this.maxTime > 0 ? `
                    <div class="w-full bg-brand-darker rounded-full h-2 overflow-hidden border border-brand-borderSubtle relative">
                        <div id="duel-timer-bar" class="h-full bg-gradient-to-r from-brand-cherry via-brand-gold to-brand-goldLight transition-all duration-300" style="width: 100%"></div>
                    </div>
                ` : ''}

                <!-- QUESTION CARD -->
                <div class="glass-card rounded-2xl p-5 border border-brand-borderSubtle shadow-xl space-y-4">
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-darker text-brand-goldLight border border-brand-borderSubtle font-bold">
                            ${q.subject} • ${q.chapter}
                        </span>
                        ${this.maxTime > 0 ? `
                            <span class="font-mono font-bold text-xs text-brand-goldLight" id="duel-timer-text">
                                ${this.timeLeft}s
                            </span>
                        ` : ''}
                    </div>

                    <div class="text-sm sm:text-base font-bold text-white text-center py-2 duel-latex-render leading-relaxed">
                        ${q.question}
                    </div>

                    <!-- 4 MULTIPLE CHOICE OPTIONS -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        ${Object.entries(q.options).map(([letter, text]) => `
                            <button data-letter="${letter}" class="duel-opt-btn p-3 rounded-xl bg-brand-darker hover:bg-white/5 border border-brand-borderSubtle text-left text-xs text-white transition active:scale-98 flex items-center gap-2.5 group">
                                <span class="w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-[11px] text-brand-goldLight group-hover:scale-105 transition shrink-0">
                                    ${letter}
                                </span>
                                <span class="duel-latex-render truncate max-w-full font-medium">
                                    $${text}$
                                </span>
                            </button>
                        `).join("")}
                    </div>
                </div>

                <!-- LIVE 1v1 INTERACTIVE REACTIONS DOCK -->
                ${(this.mode === 'multiplayer' || this.opponentUser) ? `
                    <div class="flex items-center justify-center gap-2 pt-1 font-outfit">
                        <span class="text-[10px] text-brand-muted font-bold mr-1">Réagir :</span>
                        ${['🔥', '💀', '🧠', '⚡', '🦉', '👏'].map(em => `
                            <button data-emoji="${em}" class="duel-reaction-btn w-8 h-8 rounded-xl glass-card border border-brand-borderSubtle hover:border-brand-gold text-sm flex items-center justify-center transition active:scale-90 hover:scale-110 shadow-sm" title="Envoyer une réaction">
                                ${em}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- ROUND FEEDBACK MODAL / DRAWER -->
                <div id="duel-feedback-container" class="hidden"></div>
            </div>
        `;

        this.attachQuestionListeners();
    }

    attachQuestionListeners() {
        document.querySelectorAll(".duel-opt-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                if (this.isRoundFinished) return;
                const chosenLetter = btn.dataset.letter;
                this.handleAnswer(chosenLetter);
            });
        });

        document.querySelectorAll(".duel-reaction-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const em = btn.dataset.emoji;
                window.ambience?.playClick();
                this.showFloatingDuelReaction(em, "Moi");
                if (this.mode === "multiplayer" && window.roomSync) {
                    window.roomSync.sendDuel("reaction", {
                        challengeId: this.currentChallengeId,
                        emoji: em
                    });
                }
            });
        });
    }

    handleAnswer(chosenLetter) {
        this.isRoundFinished = true;
        clearInterval(this.timer);

        const q = this.questions[this.currentRound];
        const isCorrect = chosenLetter === q.correct;

        // Scoring rules: Concours (+1 / -0.25) or standard
        let pointsEarned = 0;
        if (isCorrect) {
            window.ambience?.playSuccess();
            this.streak++;
            pointsEarned = 1;
            this.playerScore += pointsEarned;
        } else {
            window.ambience?.playClick();
            this.streak = 0;
            if (this.mode === "concours") {
                pointsEarned = -0.25;
                this.playerScore = Math.max(0, this.playerScore - 0.25);
            }
        }

        // Record history for final detailed review
        this.sessionHistory.push({
            question: q.question,
            chapter: q.chapter,
            subject: q.subject,
            chosenLetter,
            chosenText: q.options[chosenLetter] || "Temps Écoulé",
            correctLetter: q.correct,
            correctText: q.options[q.correct],
            isCorrect,
            explanation: q.explanation
        });

        // Simulate AI opponent response if in AI mode
        if (this.mode === "ai") {
            const accuracyProb = this.aiDifficulty === "genie" ? 0.98 : (this.aiDifficulty === "major" ? 0.90 : 0.70);
            const aiIsCorrect = Math.random() < accuracyProb;
            if (aiIsCorrect) this.opponentScore += 1;
        }

        // Multiplayer broadcast
        if (this.mode === "multiplayer" && window.roomSync) {
            window.roomSync.sendDuel("answer", {
                challengeId: this.currentChallengeId,
                round: this.currentRound,
                score: this.playerScore
            });
        }

        this.showRoundFeedback(isCorrect, chosenLetter, q);
    }

    handleTimeout() {
        this.handleAnswer(null);
    }

    showRoundFeedback(isCorrect, chosenLetter, q) {
        const feedbackContainer = document.getElementById("duel-feedback-container");
        if (!feedbackContainer) return;

        feedbackContainer.classList.remove("hidden");
        feedbackContainer.innerHTML = `
            <div class="glass-panel rounded-2xl p-4 border ${isCorrect ? 'border-emerald-500/50' : 'border-rose-500/50'} space-y-3 animate-fadeIn shadow-2xl">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-black font-outfit ${isCorrect ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1.5">
                        <i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                        ${isCorrect ? 'Excellente Réponse ! (+1 pt)' : (chosenLetter ? 'Réponse Incorrecte (-0.25 pt)' : 'Temps Écoulé ! (0 pt)')}
                    </span>
                    <button id="duel-next-round-btn" class="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cherry to-brand-cherryDark border border-brand-gold text-white font-bold text-xs font-outfit shadow transition active:scale-95">
                        ${this.currentRound + 1 < this.totalRounds ? 'Question Suivante →' : 'Voir le Bilan Final 🏆'}
                    </button>
                </div>

                <div class="text-xs text-slate-200 p-3 rounded-xl bg-brand-darker border border-brand-borderSubtle leading-relaxed">
                    <div class="font-bold text-brand-gold font-outfit mb-1 flex items-center gap-1">
                        <i class="fa-solid fa-lightbulb"></i> Corrigé & Démonstration :
                    </div>
                    <div class="duel-latex-render font-mono text-xs text-brand-goldLight">
                        ${q.explanation}
                    </div>
                </div>
            </div>
        `;

        // Highlight buttons
        document.querySelectorAll(".duel-opt-btn").forEach(btn => {
            const letter = btn.dataset.letter;
            if (letter === q.correct) {
                btn.className = "duel-opt-btn p-3 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 text-left text-xs text-emerald-300 font-black shadow-lg shadow-emerald-950/40 flex items-center gap-2.5";
            } else if (letter === chosenLetter) {
                btn.className = "duel-opt-btn p-3 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-left text-xs text-rose-300 font-bold flex items-center gap-2.5";
            } else {
                btn.className = "duel-opt-btn p-3 rounded-xl bg-brand-darker opacity-40 border border-transparent text-left text-xs text-brand-muted flex items-center gap-2.5";
            }
        });

        // Trigger next
        document.getElementById("duel-next-round-btn")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.currentRound += 1;
            if (this.currentRound >= this.totalRounds) {
                this.renderResults();
            } else {
                this.startRound();
            }
        });

        // Render math in feedback
        if (window.renderMathInElement) {
            window.renderMathInElement(feedbackContainer, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ],
                throwOnError: false
            });
        }
    }

    renderResults() {
        const correctCount = this.sessionHistory.filter(h => h.isCorrect).length;
        const noteSur20 = ((Math.max(0, this.playerScore) / this.totalRounds) * 20).toFixed(2);
        
        let mention = "Admissible";
        let mentionColor = "text-brand-gold";
        if (noteSur20 >= 16) {
            mention = "Mention Très Honorable (Major de Promo) 🏆";
            mentionColor = "text-emerald-400";
        } else if (noteSur20 >= 14) {
            mention = "Mention Bien (Grandes Écoles d'Ingénieurs) ⭐";
            mentionColor = "text-brand-goldLight";
        } else if (noteSur20 >= 10) {
            mention = "Admissible (Travail Régulier Recommandé) 📚";
            mentionColor = "text-amber-300";
        } else {
            mention = "Révisions Approfondies Nécessaires ⚠️";
            mentionColor = "text-rose-400";
        }

        const xpEarned = Math.round(this.playerScore * 20) + 30;
        window.levelSystem?.addXP(xpEarned, "Épreuve Concours QCM");
        window.studyApp?.triggerConfetti?.();

        let versusHtml = "";
        if (this.mode === "multiplayer" || (this.mode === "ai" && this.opponentUser)) {
            const oppName = this.opponentUser ? this.opponentUser.name : "Adversaire";
            const myScore = this.playerScore;
            const oppScore = this.opponentScore;
            
            let outcomeTitle = "";
            let outcomeColor = "";
            let outcomeIcon = "";
            if (myScore > oppScore) {
                outcomeTitle = "👑 VICTOIRE ÉCLATANTE !";
                outcomeColor = "text-emerald-400";
                outcomeIcon = "fa-trophy";
            } else if (myScore < oppScore) {
                outcomeTitle = "⚔️ DÉFAITE HONORABLE";
                outcomeColor = "text-rose-400";
                outcomeIcon = "fa-shield";
            } else {
                outcomeTitle = "🤝 ÉGALITÉ PARFAITE !";
                outcomeColor = "text-amber-300";
                outcomeIcon = "fa-handshake";
            }

            versusHtml = `
                <div class="p-3.5 rounded-2xl bg-brand-darker border border-brand-gold/40 text-center space-y-2.5 shadow-inner">
                    <div class="text-xs font-black ${outcomeColor} font-outfit uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <i class="fa-solid ${outcomeIcon}"></i>
                        ${outcomeTitle}
                    </div>
                    <div class="flex items-center justify-center gap-6 font-outfit">
                        <div class="flex flex-col items-center gap-0.5">
                            <span class="text-[11px] font-bold text-white">Toi</span>
                            <span class="font-mono text-xl font-black text-brand-goldLight">${myScore} pts</span>
                            ${myScore > oppScore ? '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">Vainqueur 🏆</span>' : ''}
                        </div>
                        <span class="text-xs font-black text-brand-muted font-mono">VS</span>
                        <div class="flex flex-col items-center gap-0.5">
                            <span class="text-[11px] font-bold text-brand-muted truncate max-w-[110px]">${oppName}</span>
                            <span class="font-mono text-xl font-black text-slate-300">${oppScore} pts</span>
                            ${oppScore > myScore ? '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">Vainqueur 🏆</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-xl mx-auto space-y-4 w-full">
                
                <!-- VICTORY HERO -->
                <div class="w-full glass-panel rounded-2xl p-5 border border-brand-borderSubtle text-center space-y-3 shadow-2xl relative overflow-hidden">
                    <div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-cherry via-brand-gold to-brand-goldLight p-0.5 shadow-xl flex items-center justify-center">
                        <i class="fa-solid fa-award text-2xl text-brand-darker"></i>
                    </div>

                    <div>
                        <h2 class="text-lg font-black text-white font-outfit">Bilan de l'Épreuve</h2>
                        <div class="text-sm font-extrabold ${mentionColor} font-outfit mt-1">
                            ${mention}
                        </div>
                    </div>

                    ${versusHtml}

                    <!-- SCORE SUMMARY CARDS -->
                    <div class="grid grid-cols-3 gap-2 pt-1 font-outfit text-center">
                        <div class="p-3 rounded-xl bg-brand-darker border border-brand-borderSubtle">
                            <span class="text-[9px] text-brand-muted font-bold block uppercase">Note /20</span>
                            <span class="font-mono text-xl font-black text-brand-goldLight">${noteSur20} / 20</span>
                        </div>
                        <div class="p-3 rounded-xl bg-brand-darker border border-brand-borderSubtle">
                            <span class="text-[9px] text-brand-muted font-bold block uppercase">Bonnes Réponses</span>
                            <span class="font-mono text-xl font-black text-emerald-400">${correctCount} / ${this.totalRounds}</span>
                        </div>
                        <div class="p-3 rounded-xl bg-brand-darker border border-brand-borderSubtle">
                            <span class="text-[9px] text-brand-muted font-bold block uppercase">XP Gagnés</span>
                            <span class="font-mono text-xl font-black text-brand-gold">+${xpEarned} XP</span>
                        </div>
                    </div>

                    <!-- ACTION BUTTONS -->
                    <div class="flex gap-2 pt-2">
                        <button id="duel-replay-btn" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-cherry to-brand-cherryDark border border-brand-gold text-white font-black text-xs uppercase tracking-wider font-outfit shadow active:scale-95 transition">
                            <i class="fa-solid fa-rotate-right mr-1"></i> Rejouer l'Épreuve
                        </button>
                        <button id="duel-back-lobby-btn" class="px-4 py-3 rounded-xl glass-card border border-brand-borderSubtle text-brand-muted hover:text-white font-bold text-xs font-outfit active:scale-95 transition">
                            Retour Menu
                        </button>
                    </div>
                </div>

                <!-- DETAILED SOLUTIONS & CORRIGÉ REVIEW -->
                <div class="w-full space-y-2.5">
                    <div class="flex items-center justify-between px-1">
                        <h3 class="text-xs font-black uppercase tracking-wider text-brand-gold font-outfit flex items-center gap-1.5">
                            <i class="fa-solid fa-list-check"></i> Corrigé Détaillé des Questions (${this.sessionHistory.length})
                        </h3>
                        <span class="text-[10px] text-brand-muted font-mono">Démonstrations KaTeX</span>
                    </div>

                    ${this.sessionHistory.map((item, idx) => `
                        <div class="glass-card rounded-2xl p-3.5 border ${item.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'} space-y-2 text-xs">
                            <div class="flex items-center justify-between text-[11px] font-outfit font-bold">
                                <span class="text-white flex items-center gap-1.5">
                                    <i class="fa-solid ${item.isCorrect ? 'fa-check text-emerald-400' : 'fa-xmark text-rose-400'}"></i>
                                    Question ${idx + 1} • <span class="text-brand-muted font-mono font-normal">${item.chapter}</span>
                                </span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${item.isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'}">
                                    ${item.isCorrect ? '+1 pt' : '-0.25 pt'}
                                </span>
                            </div>

                            <div class="duel-latex-render font-medium text-slate-100 py-1">
                                ${item.question}
                            </div>

                            <div class="p-2.5 rounded-xl bg-brand-darker border border-brand-borderSubtle text-[11px] space-y-1">
                                <div class="flex items-center justify-between text-brand-muted">
                                    <span>Votre réponse : <strong class="${item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}">$${item.chosenText}$</strong></span>
                                    ${!item.isCorrect ? `<span>Réponse exacte : <strong class="text-emerald-400 font-bold">$${item.correctText}$</strong></span>` : ''}
                                </div>
                                <div class="pt-1 border-t border-brand-borderSubtle text-slate-300 duel-latex-render">
                                    <strong class="text-brand-gold">Astuce Concours :</strong> ${item.explanation}
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

        document.getElementById("duel-replay-btn")?.addEventListener("click", () => {
            this.startMatch();
        });
        document.getElementById("duel-back-lobby-btn")?.addEventListener("click", () => {
            this.isPlaying = false;
            this.render();
        });

        if (window.renderMathInElement) {
            window.renderMathInElement(this.container, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ],
                throwOnError: false
            });
        }
    }

    renderWaitingRoom() {
        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-sm mx-auto space-y-4 text-center">
                <div class="w-16 h-16 rounded-2xl bg-brand-darker border-2 border-brand-gold flex items-center justify-center shadow-xl animate-pulse">
                    <i class="fa-solid fa-radar text-2xl text-brand-gold"></i>
                </div>
                <div>
                    <h3 class="text-sm font-extrabold text-white font-outfit">En attente d'un adversaire...</h3>
                    <p class="text-xs text-brand-muted mt-1">Invitation envoyée à tous les membres du salon vocal !</p>
                </div>

                <div class="p-3 rounded-xl bg-brand-darker border border-brand-borderSubtle text-xs text-brand-goldLight font-mono">
                    Matière : ${this.selectedSubject} • ${this.totalRounds} Questions
                </div>

                <button id="duel-cancel-btn" class="text-xs text-rose-400 hover:text-rose-300 font-bold py-2 px-4 rounded-lg bg-brand-card border border-rose-950 transition">
                    <i class="fa-solid fa-xmark mr-1"></i> Annuler l'invitation
                </button>
            </div>
        `;

        document.getElementById("duel-cancel-btn")?.addEventListener("click", () => {
            this.waitingForOpponent = false;
            this.render();
        });
    }

    launchMultiplayerChallenge() {
        if (!window.roomSync) {
            window.studyApp?.showToast("Synchronisation indisponible. Passage en mode Solo.");
            this.startMatch();
            return;
        }

        let pool = DUEL_QUESTIONS_BANK;
        if (this.selectedSubject !== "All") {
            pool = DUEL_QUESTIONS_BANK.filter(q => q.subject.includes(this.selectedSubject));
            if (pool.length < this.totalRounds) pool = DUEL_QUESTIONS_BANK;
        }

        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selectedQ = shuffled.slice(0, this.totalRounds);
        const qIds = selectedQ.map(q => q.id);

        this.questions = selectedQ;
        this.currentChallengeId = "duel_" + Date.now();
        this.isHost = true;
        this.waitingForOpponent = true;
        this.renderWaitingRoom();

        // Broadcast challenge
        window.roomSync.sendDuel("challenge", {
            challengeId: this.currentChallengeId,
            subject: this.selectedSubject,
            questionIds: qIds
        });

        window.studyApp?.showToast("⚔️ Défi 1v1 envoyé dans le salon vocal !");
    }

    handleRemoteDuelMessage(msg) {
        if (!msg) return;

        if (msg.action === "challenge") {
            if (this.isPlaying || this.waitingForOpponent) return;

            window.studyApp?.showDuelChallengeToast({
                host: msg.author,
                challengeId: msg.challengeId,
                subject: msg.subject,
                onAccept: () => {
                    this.acceptChallenge(msg);
                }
            });
        } else if (msg.action === "accept") {
            if (this.isHost && this.currentChallengeId === msg.challengeId) {
                this.opponentUser = msg.author;
                this.waitingForOpponent = false;
                window.studyApp?.showToast(`⚔️ ${msg.author.name} a rejoint le Duel !`);
                this.beginMultiplayerMatch();
            }
        } else if (msg.action === "answer") {
            if (this.isPlaying && this.currentChallengeId === msg.challengeId) {
                this.opponentScore = msg.score;
                const oppScoreEl = document.getElementById("duel-opp-score");
                if (oppScoreEl) oppScoreEl.textContent = this.opponentScore;
            }
        } else if (msg.action === "reaction") {
            if (this.isPlaying && this.currentChallengeId === msg.challengeId) {
                this.showFloatingDuelReaction(msg.emoji, msg.author?.name);
            }
        }
    }

    showFloatingDuelReaction(emoji, senderName) {
        const floater = document.createElement("div");
        floater.className = "fixed bottom-24 right-6 pointer-events-none z-50 flex items-center gap-2 px-3 py-2 rounded-2xl glass-panel border border-brand-gold shadow-2xl animate-bounce text-sm font-bold font-outfit text-white backdrop-blur-md";
        floater.innerHTML = `
            <span class="text-2xl">${emoji}</span>
            <span class="text-xs text-brand-goldLight font-mono">${senderName || 'Adversaire'}</span>
        `;
        document.body.appendChild(floater);
        setTimeout(() => {
            floater.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            floater.style.transform = "translateY(-70px) scale(1.1)";
            floater.style.opacity = "0";
            setTimeout(() => floater.remove(), 600);
        }, 1400);
    }

    renderVoiceRoomPeers() {
        if (!window.roomSync || !window.roomSync.roster) {
            return `<span class="text-[10px] text-brand-muted italic">Connecté au salon vocal. Invite un camarade !</span>`;
        }
        const peers = [];
        const myId = window.roomSync.currentUser?.id;
        for (const [id, data] of window.roomSync.roster.entries()) {
            if (data.user && data.user.id !== myId) {
                peers.push(data.user);
            }
        }
        if (peers.length === 0) {
            return `
                <div class="text-[10px] text-brand-muted py-1 flex items-center gap-2">
                    <i class="fa-solid fa-user-group text-cyan-400"></i>
                    <span>Invite un ami dans le salon vocal pour jouer en 1v1 direct !</span>
                </div>
            `;
        }
        return peers.map(p => `
            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-brand-card border border-brand-borderSubtle text-xs">
                <img src="${(p.avatar && !p.avatar.includes('dicebear')) ? p.avatar : 'assets/avatars/default.svg'}" onerror="this.onerror=null;this.src='assets/avatars/default.svg'" class="w-5 h-5 rounded-full border border-brand-gold object-cover">
                <span class="font-bold text-white text-[11px]">${p.name}</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">Prêt</span>
            </div>
        `).join('');
    }

    acceptChallenge(challengeMsg) {
        this.mode = "multiplayer";
        this.isHost = false;
        this.currentChallengeId = challengeMsg.challengeId;
        this.opponentUser = challengeMsg.author;

        const qMap = new Map(DUEL_QUESTIONS_BANK.map(q => [q.id, q]));
        this.questions = challengeMsg.questionIds.map(id => qMap.get(id)).filter(Boolean);
        if (this.questions.length === 0) {
            this.questions = DUEL_QUESTIONS_BANK.slice(0, 5);
        }

        window.roomSync.sendDuel("accept", {
            challengeId: this.currentChallengeId
        });

        window.studyApp?.switchTab("tab-duel");
        this.beginMultiplayerMatch();
    }

    beginMultiplayerMatch() {
        this.currentRound = 0;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.streak = 0;
        this.sessionHistory = [];
        this.isPlaying = true;
        this.waitingForOpponent = false;

        window.ambience?.playSuccess();
        this.startRound();
    }
}

window.DuelArena = DuelArena;
