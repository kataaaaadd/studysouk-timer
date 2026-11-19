/**
 * StudySouk Timer - STEM Duel Arena 1v1 & Realtime Multiplayer
 * Curated STEM challenges (Maths, Physique-Chimie, Informatique) for 2BAC SM, PC & CPGE.
 * Features: Solo vs Major IA + Realtime 1v1 Multiplayer in the Discord Voice Channel.
 */

const DUEL_QUESTIONS_BANK = [
    {
        id: "M_ANA_01",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Dérivabilité & Fonctions",
        question: "Quelle est la dérivée de $f(x) = \\arctan(x)$ sur $\\mathbb{R}$ ?",
        options: {
            "A": "\\frac{1}{1+x^2}",
            "B": "\\frac{1}{\\sqrt{1-x^2}}",
            "C": "-\\frac{1}{1+x^2}",
            "D": "\\frac{1}{1-x^2}"
        },
        correct: "A",
        explanation: "Par définition de la fonction réciproque de la tangente, $(\\arctan)'(x) = \\frac{1}{1+x^2}$."
    },
    {
        id: "M_ANA_02",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Calcul Intégral",
        question: "Une primitive sur $]1, +\\infty[$ de $f(x) = \\frac{1}{x \\ln(x)}$ est :",
        options: {
            "A": "\\ln(x) + C",
            "B": "\\ln(\\ln(x)) + C",
            "C": "\\frac{1}{\\ln^2(x)} + C",
            "D": "-\\frac{1}{x^2} + C"
        },
        correct: "B",
        explanation: "Forme $\\frac{u'(x)}{u(x)}$ avec $u(x) = \\ln(x) > 0$, donc $\\int \\frac{dx}{x\\ln x} = \\ln(\\ln x) + C$."
    },
    {
        id: "M_ANA_03",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Limites & Continuité",
        question: "Quelle est la valeur de $\\lim_{x \\to 0} \\frac{\\sin(3x)}{\\ln(1+2x)}$ ?",
        options: {
            "A": "\\frac{3}{2}",
            "B": "\\frac{2}{3}",
            "C": "0",
            "D": "+\\infty"
        },
        correct: "A",
        explanation: "$\\frac{\\sin(3x)}{\\ln(1+2x)} = \\frac{\\sin(3x)}{3x} \\times \\frac{2x}{\\ln(1+2x)} \\times \\frac{3}{2} \\to 1 \\times 1 \\times \\frac{3}{2} = \\frac{3}{2}$."
    },
    {
        id: "M_ANA_04",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Calcul Intégral",
        question: "Valeur de l'intégrale $I = \\int_{0}^{1} \\frac{1}{1+x^2} \\, dx$ :",
        options: {
            "A": "\\frac{\\pi}{4}",
            "B": "\\frac{\\pi}{2}",
            "C": "1",
            "D": "\\ln(2)"
        },
        correct: "A",
        explanation: "Une primitive est $\\arctan(x)$, donc $I = \\arctan(1) - \\arctan(0) = \\frac{\\pi}{4}$."
    },
    {
        id: "M_ALG_01",
        subject: "Maths",
        level: "2BAC SM",
        chapter: "Nombres Complexes",
        question: "Forme exponentielle de $z = 1 + i\\sqrt{3}$ :",
        options: {
            "A": "2 e^{i\\frac{\\pi}{3}}",
            "B": "2 e^{i\\frac{\\pi}{6}}",
            "C": "\\sqrt{2} e^{i\\frac{\\pi}{3}}",
            "D": "e^{i\\frac{\\pi}{3}}"
        },
        correct: "A",
        explanation: "$|z| = \\sqrt{1+3} = 2$. $\\cos \\theta = 1/2, \\sin \\theta = \\sqrt{3}/2 \\implies \\theta = \\pi/3$."
    },
    {
        id: "P_ONDE_01",
        subject: "Physique",
        level: "2BAC SM/PC",
        chapter: "Ondes Mécaniques",
        question: "La célérité $v$ d'une onde sur une corde de tension $F$ et masse linéique $\\mu$ :",
        options: {
            "A": "v = \\sqrt{\\frac{F}{\\mu}}",
            "B": "v = \\sqrt{\\frac{\\mu}{F}}",
            "C": "v = \\frac{F}{\\mu}",
            "D": "v = \\sqrt{F \\cdot \\mu}"
        },
        correct: "A",
        explanation: "D'après l'analyse dimensionnelle, $v = \\sqrt{F/\\mu}$."
    },
    {
        id: "P_MECA_01",
        subject: "Physique",
        level: "2BAC SM/PC",
        chapter: "Lois de Newton",
        question: "Énergie cinétique de translation d'un solide de masse $m$ à la vitesse $v$ :",
        options: {
            "A": "\\frac{1}{2} m v^2",
            "B": "m v^2",
            "C": "\\frac{1}{2} m^2 v",
            "D": "m g h"
        },
        correct: "A",
        explanation: "Par définition, l'énergie cinétique de translation est $E_c = \\frac{1}{2} m v^2$."
    },
    {
        id: "C_CHIM_01",
        subject: "Chimie",
        level: "2BAC SM/PC",
        chapter: "Solutions Aqueuses",
        question: "Produit ionique de l'eau $K_e$ à 25°C :",
        options: {
            "A": "10^{-14}",
            "B": "10^{-7}",
            "C": "10^{14}",
            "D": "1.0"
        },
        correct: "A",
        explanation: "À 25°C, $K_e = [H_3O^+][HO^-] = 1.0 \\times 10^{-14}$."
    },
    {
        id: "I_INFO_01",
        subject: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        question: "Complexité temporelle moyenne du tri rapide (Quicksort) :",
        options: {
            "A": "O(n \\log n)",
            "B": "O(n^2)",
            "C": "O(n)",
            "D": "O(\\log n)"
        },
        correct: "A",
        explanation: "En moyenne, Quicksort effectue un partitionnement équilibré en $O(n \\log n)$. Pire cas : $O(n^2)$."
    },
    {
        id: "I_INFO_02",
        subject: "Informatique",
        level: "CPGE / SM",
        chapter: "Structures de données",
        question: "Quel principe suit une file (Queue) en algorithmique ?",
        options: {
            "A": "FIFO (First In First Out)",
            "B": "LIFO (Last In First Out)",
            "C": "FILO",
            "D": "Random Access"
        },
        correct: "A",
        explanation: "Une file respecte le principe FIFO (Premier entré, premier sorti), contrairement à une pile (LIFO)."
    },
    {
        id: "M_ALG_RANG",
        subject: "Maths",
        level: "CPGE / 2BAC SM",
        chapter: "Algèbre Linéaire",
        question: "Pour une application linéaire $f: E \\to F$ avec $\\dim(E) < \\infty$, le théorème du rang énonce :",
        options: {
            "A": "\\dim(E) = \\dim(\\ker f) + \\mathrm{rg}(f)",
            "B": "\\dim(F) = \\dim(\\ker f) + \\mathrm{rg}(f)",
            "C": "\\mathrm{rg}(f) = \\dim(E) \\times \\dim(F)",
            "D": "\\dim(\\ker f) = \\mathrm{rg}(f)"
        },
        correct: "A",
        explanation: "Théorème du rang : $\\dim(E) = \\dim(\\ker f) + \\dim(\\mathrm{Im} f)$ où $\\mathrm{rg}(f) = \\dim(\\mathrm{Im} f)$."
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
        explanation: "Taux d'accroissement de $x \\mapsto e^{5x}$ en 0 : $\\lim_{x \\to 0} \\frac{e^{5x}-1}{5x} \\times \\frac{5}{2} = 1 \\times \\frac{5}{2} = \\frac{5}{2}$."
    },
    {
        id: "M_PROB_BINOM",
        subject: "Maths",
        level: "2BAC SM / CPGE",
        chapter: "Dénombrement & Probas",
        question: "Quel est le coefficient de $x^3$ dans le développement de $(1+x)^5$ ?",
        latex: "\\binom{5}{3} = \\frac{5!}{3!2!} = 10",
        options: {
            "A": "10",
            "B": "5",
            "C": "15",
            "D": "20"
        },
        correct: "A",
        explanation: "D'après la formule du binôme de Newton, le terme est $\\binom{5}{3} x^3 = 10 x^3$."
    },
    {
        id: "P_ELEC_COND",
        subject: "Physique",
        level: "2BAC SM/PC",
        chapter: "Électricité RC",
        question: "Quelle est l'énergie emmagasinée par un condensateur de capacité $C$ sous la tension $U_C$ ?",
        options: {
            "A": "\\frac{1}{2} C U_C^2",
            "B": "C U_C^2",
            "C": "\\frac{1}{2} C^2 U_C",
            "D": "\\frac{U_C^2}{2C}"
        },
        correct: "A",
        explanation: "L'énergie électrostatique emmagasinée est $\\mathcal{E}_e = \\frac{1}{2} C U_C^2 = \\frac{q^2}{2C}$."
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
        explanation: "L'énergie magnétique emmagasinée dans la bobine est $\\mathcal{E}_m = \\frac{1}{2} L i^2$."
    },
    {
        id: "P_KEPLER_3",
        subject: "Physique",
        level: "2BAC SM/PC / CPGE",
        chapter: "Gravitation & Satellites",
        question: "Selon la 3ème loi de Kepler, pour une planète de période $T$ et de demi-grand axe $a$ :",
        options: {
            "A": "\\frac{T^2}{a^3} = \\text{cste}",
            "B": "\\frac{T^3}{a^2} = \\text{cste}",
            "C": "T^2 \\cdot a^3 = \\text{cste}",
            "D": "\\frac{T}{a} = \\text{cste}"
        },
        correct: "A",
        explanation: "La 3ème loi de Kepler stipule que $\\frac{T^2}{a^3} = \\frac{4\\pi^2}{G M_S} = \\text{constante}$."
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
        explanation: "$\\text{n.o.}(S) + 4 \\times (-2) = -2 \\implies \\text{n.o.}(S) = +6$ (+VI)."
    },
    {
        id: "C_GAZ_PARFAIT",
        subject: "Chimie",
        level: "2BAC SM/PC / CPGE",
        chapter: "Thermodynamique",
        question: "Dans l'équation d'état des gaz parfaits $P \\cdot V = n \\cdot R \\cdot T$, quelle est l'unité de $P$ dans le SI ?",
        options: {
            "A": "Pascal (Pa)",
            "B": "Bar",
            "C": "Atmosphère (atm)",
            "D": "Torr"
        },
        correct: "A",
        explanation: "Dans le Système International (SI), la pression $P$ s'exprime impérativement en Pascals ($1 \\text{ bar} = 10^5 \\text{ Pa}$)."
    },
    {
        id: "I_INFO_DICHO",
        subject: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        question: "Quelle est la complexité dans le pire des cas de la recherche dichotomique dans une liste triée de taille $n$ ?",
        options: {
            "A": "O(\\log n)",
            "B": "O(n)",
            "C": "O(n \\log n)",
            "D": "O(1)"
        },
        correct: "A",
        explanation: "À chaque itération, l'espace de recherche est divisé par 2, ce qui donne une complexité logarithmique $O(\\log_2 n)$."
    },
    {
        id: "I_INFO_PYTHON",
        subject: "Informatique",
        level: "CPGE / SM",
        chapter: "Python & Mémoire",
        question: "En Python, que renvoie l'expression `[x**2 for x in range(4)]` ?",
        options: {
            "A": "[0, 1, 4, 9]",
            "B": "[1, 4, 9, 16]",
            "C": "[0, 1, 4, 9, 16]",
            "D": "(0, 1, 4, 9)"
        },
        correct: "A",
        explanation: "`range(4)` produit les entiers de 0 à 3, dont les carrés sont 0, 1, 4, 9 sous forme de liste."
    }
];

class DuelArena {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.mode = "ai"; // "ai" or "multiplayer"
        this.questions = [];
        this.currentRound = 0;
        this.totalRounds = 5;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.timer = null;
        this.timeLeft = 15;
        this.maxTime = 15;
        this.streak = 0;
        this.selectedSubject = "All";
        this.isRoundFinished = false;
        this.isPlaying = false;

        // Multiplayer state
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
            this.renderVictory();
        } else {
            this.renderQuestion();
        }
    }

    renderLobby() {
        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-sm mx-auto space-y-4">
                <!-- Banner -->
                <div class="relative w-full rounded-2xl overflow-hidden glass-card border border-brand-borderLight p-5 text-center">
                    <div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-accent via-brand-gold to-brand-goldLight p-0.5 shadow-lg shadow-brand-cherry/40 mb-3">
                        <div class="w-full h-full bg-brand-darker rounded-[14px] flex items-center justify-center">
                            <i class="fa-solid fa-bolt text-2xl text-brand-gold"></i>
                        </div>
                    </div>
                    <h2 class="text-base font-extrabold text-brand-text font-outfit">
                        StudySouk <span class="text-brand-goldLight">Duel d'Élite</span>
                    </h2>
                    <p class="text-xs text-brand-muted mt-1 leading-relaxed">
                        Affronte tes camarades du salon vocal en direct ou défie le <strong>Major de Promo IA</strong> !
                    </p>
                </div>

                <!-- Mode Selectors -->
                <div class="grid grid-cols-2 gap-2 w-full">
                    <button id="duel-mode-mp" class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 font-outfit ${this.mode === 'multiplayer' ? 'bg-brand-cherry border-brand-gold text-brand-goldLight shadow-md' : 'bg-brand-card border-brand-border text-brand-muted hover:text-brand-text'}">
                        <i class="fa-solid fa-users-viewfinder text-base text-brand-gold"></i>
                        <span>1v1 Salon Vocal</span>
                        <span class="text-[9px] font-normal text-emerald-400">Multiplayer Live</span>
                    </button>
                    <button id="duel-mode-ai" class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 font-outfit ${this.mode === 'ai' ? 'bg-brand-cherry border-brand-gold text-brand-goldLight shadow-md' : 'bg-brand-card border-brand-border text-brand-muted hover:text-brand-text'}">
                        <i class="fa-solid fa-robot text-base text-brand-gold"></i>
                        <span>VS Major IA</span>
                        <span class="text-[9px] font-normal text-brand-muted">Entraînement Solo</span>
                    </button>
                </div>

                <!-- Subject Filter -->
                <div class="w-full flex items-center justify-between p-2.5 rounded-xl glass-card border border-brand-borderLight text-xs">
                    <span class="text-[11px] font-bold text-brand-gold font-outfit flex items-center gap-1">
                        <i class="fa-solid fa-filter"></i> Matière :
                    </span>
                    <select id="duel-subject-select" class="bg-brand-darker border border-brand-borderLight rounded-lg px-2 py-1 text-xs text-brand-goldLight font-outfit focus:outline-none">
                        <option value="All" ${this.selectedSubject === 'All' ? 'selected' : ''}>Toutes les STEM</option>
                        <option value="Maths" ${this.selectedSubject === 'Maths' ? 'selected' : ''}>Maths Exclusif</option>
                        <option value="Physique" ${this.selectedSubject === 'Physique' ? 'selected' : ''}>Physique-Chimie</option>
                        <option value="Informatique" ${this.selectedSubject === 'Informatique' ? 'selected' : ''}>Informatique</option>
                    </select>
                </div>

                <!-- Start Button -->
                <button id="duel-start-btn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-accent via-brand-gold to-brand-goldDark text-brand-darker font-extrabold text-xs uppercase tracking-wider transition active:scale-95 shadow-xl shadow-brand-goldGlow font-outfit flex items-center justify-center gap-2">
                    <i class="fa-solid ${this.mode === 'multiplayer' ? 'fa-bullhorn' : 'fa-play'}"></i>
                    <span>${this.mode === 'multiplayer' ? 'Défier le Salon Vocal (1v1)' : 'Lancer le Duel Solo (+50 XP)'}</span>
                </button>
            </div>
        `;

        document.getElementById("duel-mode-mp")?.addEventListener("click", () => {
            this.mode = "multiplayer";
            window.ambience?.playClick();
            this.renderLobby();
        });

        document.getElementById("duel-mode-ai")?.addEventListener("click", () => {
            this.mode = "ai";
            window.ambience?.playClick();
            this.renderLobby();
        });

        document.getElementById("duel-subject-select")?.addEventListener("change", (e) => {
            this.selectedSubject = e.target.value;
        });

        document.getElementById("duel-start-btn")?.addEventListener("click", () => {
            if (this.mode === "multiplayer") {
                this.launchMultiplayerChallenge();
            } else {
                this.startSoloDuel();
            }
        });
    }

    renderWaitingRoom() {
        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-sm mx-auto space-y-4 text-center">
                <div class="w-16 h-16 rounded-2xl bg-brand-darker border-2 border-brand-gold flex items-center justify-center shadow-xl animate-pulse">
                    <i class="fa-solid fa-radar text-2xl text-brand-gold"></i>
                </div>
                <div>
                    <h3 class="text-sm font-extrabold text-brand-text font-outfit">En attente d'un adversaire...</h3>
                    <p class="text-xs text-brand-muted mt-1">Invitation envoyée à tous les membres du salon vocal !</p>
                </div>

                <div class="p-3 rounded-xl bg-brand-darker border border-brand-border text-xs text-brand-goldLight font-mono">
                    Matière : ${this.selectedSubject} • 5 Questions
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
            this.startSoloDuel();
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

    startSoloDuel() {
        let pool = DUEL_QUESTIONS_BANK;
        if (this.selectedSubject !== "All") {
            pool = DUEL_QUESTIONS_BANK.filter(q => q.subject.includes(this.selectedSubject));
            if (pool.length < this.totalRounds) pool = DUEL_QUESTIONS_BANK;
        }

        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        this.questions = shuffled.slice(0, this.totalRounds);
        this.opponentUser = { name: "Major IA 🤖", avatar: null };
        this.beginMatch();
    }

    beginMatch() {
        this.currentRound = 0;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.streak = 0;
        this.isPlaying = true;
        this.waitingForOpponent = false;

        window.ambience?.playSuccess();
        this.startRound();
    }

    startRound() {
        this.isRoundFinished = false;
        this.timeLeft = this.maxTime;
        clearInterval(this.timer);

        this.renderQuestion();

        this.timer = setInterval(() => {
            this.timeLeft -= 1;
            const bar = document.getElementById("duel-timer-bar");
            const timeText = document.getElementById("duel-timer-text");

            if (bar) {
                const pct = (this.timeLeft / this.maxTime) * 100;
                bar.style.width = `${pct}%`;
                if (this.timeLeft <= 4) {
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

    renderQuestion() {
        const q = this.questions[this.currentRound];
        if (!q) return;

        const oppName = this.opponentUser ? this.opponentUser.name : (this.mode === "ai" ? "Major IA 🤖" : "Adversaire");

        this.container.innerHTML = `
            <div class="flex flex-col max-w-sm mx-auto space-y-3">
                <!-- Scoreboard -->
                <div class="flex items-center justify-between p-2.5 rounded-xl glass-card border border-brand-borderLight text-xs">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <span class="font-bold text-brand-goldLight font-outfit">Toi</span>
                        <span class="font-mono font-extrabold text-sm text-brand-text" id="duel-my-score">${this.playerScore}</span>
                    </div>

                    <div class="px-2.5 py-0.5 rounded bg-brand-cherry text-xs font-black text-brand-goldLight font-outfit border border-brand-borderLight">
                        Round ${this.currentRound + 1}/${this.totalRounds}
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="font-mono font-extrabold text-sm text-brand-text" id="duel-opp-score">${this.opponentScore}</span>
                        <span class="font-bold text-brand-muted font-outfit truncate max-w-[80px]">${oppName}</span>
                        <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    </div>
                </div>

                <!-- Timer Bar -->
                <div class="w-full bg-brand-darker rounded-full h-2 overflow-hidden border border-brand-borderLight relative">
                    <div id="duel-timer-bar" class="h-full bg-gradient-to-r from-brand-accent to-brand-gold transition-all duration-300" style="width: 100%"></div>
                </div>
                <div class="flex justify-between text-xs text-white px-1 font-mono font-bold">
                    <span>${q.subject} • ${q.level}</span>
                    <span id="duel-timer-text" class="font-black text-brand-goldLight">${this.timeLeft}s</span>
                </div>

                <!-- Question Card -->
                <div class="rounded-2xl glass-panel border border-brand-borderLight p-4 shadow-xl">
                    <span class="text-xs uppercase font-black text-brand-gold font-outfit block mb-1">
                        ${q.chapter}
                    </span>
                    <p class="text-sm sm:text-base font-bold text-white leading-relaxed duel-latex-render" id="duel-q-text">
                        ${q.question}
                    </p>
                </div>

                <!-- Options Grid -->
                <div class="grid grid-cols-1 gap-2 pt-1" id="duel-options-grid">
                    ${Object.entries(q.options).map(([key, val]) => `
                        <button data-opt="${key}" class="duel-opt-btn p-3 rounded-xl glass-card border border-brand-border hover:border-brand-gold hover:bg-brand-cherry text-left text-xs sm:text-sm font-bold text-white transition flex items-center justify-between group active:scale-[0.98]">
                            <div class="flex items-center gap-2.5">
                                <span class="w-6 h-6 rounded-lg bg-brand-darker group-hover:bg-brand-accent text-brand-goldLight flex items-center justify-center font-mono font-bold text-xs border border-brand-borderLight">
                                    ${key}
                                </span>
                                <span class="duel-latex-render font-mono text-xs sm:text-sm text-white font-semibold">${val}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>

                <!-- Explanation Banner (Shown after answer) -->
                <div id="duel-explanation" class="hidden p-3 rounded-xl glass-card border border-brand-borderLight text-xs space-y-1">
                    <div class="flex items-center justify-between">
                        <span id="duel-result-text" class="font-bold text-xs font-outfit"></span>
                        <span id="duel-opp-answer-text" class="text-xs text-brand-muted font-outfit"></span>
                    </div>
                    <p id="duel-expl-text" class="text-xs text-white duel-latex-render leading-relaxed font-medium"></p>
                    <button id="duel-next-round-btn" class="w-full mt-2 py-2 rounded-lg bg-brand-cherry hover:bg-brand-accent border border-brand-gold text-brand-goldLight font-bold text-xs font-outfit transition">
                        ${this.currentRound + 1 >= this.totalRounds ? "Voir le Podium Final 🏆" : "Round Suivant ➡️"}
                    </button>
                </div>
            </div>
        `;

        this.applyLatexRendering();

        // Bind Option Clicks
        this.container.querySelectorAll(".duel-opt-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                if (this.isRoundFinished) return;
                const chosen = btn.dataset.opt;
                this.handleAnswer(chosen);
            });
        });
    }

    applyLatexRendering() {
        if (window.renderMathInElement) {
            this.container.querySelectorAll(".duel-latex-render").forEach(el => {
                try {
                    window.renderMathInElement(el, {
                        delimiters: [
                            { left: "$$", right: "$$", display: true },
                            { left: "$", right: "$", display: false },
                            { left: "\\(", right: "\\)", display: false },
                            { left: "\\[", right: "\\]", display: true }
                        ],
                        throwOnError: false
                    });
                } catch (e) {
                    // Fallback
                }
            });
        }
    }

    handleAnswer(playerChoice) {
        this.isRoundFinished = true;
        clearInterval(this.timer);
        const q = this.questions[this.currentRound];
        const isCorrect = playerChoice === q.correct;

        let oppCorrect = false;
        if (this.mode === "ai") {
            oppCorrect = Math.random() < 0.82; // Major de promo
            if (oppCorrect) this.opponentScore += 100;
        }

        if (isCorrect) {
            this.streak += 1;
            const points = this.streak > 1 ? 150 : 100;
            this.playerScore += points;
            window.ambience?.playSuccess();
        } else {
            this.streak = 0;
            window.ambience?.playClick();
        }

        // Send multiplayer progress
        if (this.mode === "multiplayer" && window.roomSync) {
            window.roomSync.sendDuel("answer", {
                challengeId: this.currentChallengeId,
                round: this.currentRound,
                isCorrect,
                score: this.playerScore
            });
        }

        this.revealRoundResult(playerChoice, q.correct, isCorrect, oppCorrect, q.explanation);
    }

    handleTimeout() {
        this.isRoundFinished = true;
        const q = this.questions[this.currentRound];
        this.streak = 0;
        window.ambience?.playClick();

        let oppCorrect = false;
        if (this.mode === "ai") {
            oppCorrect = Math.random() < 0.75;
            if (oppCorrect) this.opponentScore += 100;
        }

        if (this.mode === "multiplayer" && window.roomSync) {
            window.roomSync.sendDuel("answer", {
                challengeId: this.currentChallengeId,
                round: this.currentRound,
                isCorrect: false,
                score: this.playerScore
            });
        }

        this.revealRoundResult(null, q.correct, false, oppCorrect, q.explanation);
    }

    revealRoundResult(playerChoice, correctKey, isCorrect, oppCorrect, explanation) {
        const explBox = document.getElementById("duel-explanation");
        const resText = document.getElementById("duel-result-text");
        const oppText = document.getElementById("duel-opp-answer-text");
        const explText = document.getElementById("duel-expl-text");

        this.container.querySelectorAll(".duel-opt-btn").forEach(btn => {
            const opt = btn.dataset.opt;
            if (opt === correctKey) {
                btn.className = "duel-opt-btn p-3 rounded-xl bg-emerald-950/70 border border-emerald-500 text-left text-xs font-semibold text-emerald-200 transition flex items-center justify-between";
            } else if (opt === playerChoice && !isCorrect) {
                btn.className = "duel-opt-btn p-3 rounded-xl bg-rose-950/70 border border-rose-500 text-left text-xs font-semibold text-rose-200 transition flex items-center justify-between";
            } else {
                btn.classList.add("opacity-40");
            }
        });

        if (explBox && resText && oppText && explText) {
            explBox.classList.remove("hidden");
            if (isCorrect) {
                resText.innerHTML = `<span class="text-emerald-400"><i class="fa-solid fa-circle-check"></i> Excellente réponse (+${this.streak > 1 ? '150 Combo' : '100'} pts) !</span>`;
            } else if (playerChoice === null) {
                resText.innerHTML = `<span class="text-amber-400"><i class="fa-solid fa-hourglass-end"></i> Temps écoulé !</span>`;
            } else {
                resText.innerHTML = `<span class="text-rose-400"><i class="fa-solid fa-circle-xmark"></i> Mauvaise réponse.</span>`;
            }

            const oppName = this.opponentUser ? this.opponentUser.name : (this.mode === "ai" ? "Major IA" : "Adversaire");
            oppText.innerHTML = oppCorrect 
                ? `<span class="text-emerald-400"><i class="fa-solid fa-check"></i> ${oppName} a trouvé (+100)</span>` 
                : `<span class="text-rose-400"><i class="fa-solid fa-xmark"></i> ${oppName} a raté</span>`;

            explText.textContent = `💡 Explication : ${explanation}`;
            this.applyLatexRendering();
        }

        document.getElementById("duel-next-round-btn")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.currentRound += 1;
            if (this.currentRound >= this.totalRounds) {
                this.renderVictory();
            } else {
                this.startRound();
            }
        });
    }

    renderVictory() {
        const isWinner = this.playerScore > this.opponentScore;
        const isTie = this.playerScore === this.opponentScore;

        if (isWinner) {
            window.ambience?.playSuccess();
            window.levelSystem?.addXP(80, "Victoire Duel d'Élite");
            window.studyApp?.triggerConfetti?.();
        } else {
            window.ambience?.playSuccess();
            window.levelSystem?.addXP(35, "Participation Duel");
        }

        const oppName = this.opponentUser ? this.opponentUser.name : (this.mode === "ai" ? "Major IA" : "Adversaire");

        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-sm mx-auto space-y-4 text-center">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-accent via-brand-gold to-brand-goldLight p-0.5 shadow-2xl shadow-brand-goldGlow">
                    <div class="w-full h-full bg-brand-darker rounded-[14px] flex items-center justify-center">
                        <i class="fa-solid ${isWinner ? 'fa-trophy text-3xl text-brand-gold' : isTie ? 'fa-handshake text-2xl text-brand-gold' : 'fa-medal text-2xl text-brand-muted'}"></i>
                    </div>
                </div>

                <div>
                    <h2 class="text-lg font-extrabold text-brand-text font-outfit">
                        ${isWinner ? "🏆 Victoire Écrasante !" : isTie ? "🤝 Égalité Parfaite !" : "⚔️ Beau Combat !"}
                    </h2>
                    <p class="text-xs text-brand-goldLight mt-1 font-outfit">
                        ${isWinner ? `Tu as battu ${oppName} !` : `${oppName} était particulièrement redoutable.`}
                    </p>
                </div>

                <!-- Final Score Table -->
                <div class="grid grid-cols-2 gap-3 w-full p-4 rounded-2xl glass-card border border-brand-borderLight">
                    <div class="text-center p-2 rounded-xl bg-brand-darker border border-brand-border">
                        <span class="text-[10px] text-brand-muted uppercase font-bold block font-outfit">Ton Score</span>
                        <span class="font-mono text-2xl font-extrabold text-brand-gold">${this.playerScore}</span>
                        <span class="text-[9px] text-emerald-400 block font-outfit font-semibold">+${isWinner ? '80' : '35'} XP Gagnés</span>
                    </div>
                    <div class="text-center p-2 rounded-xl bg-brand-darker border border-brand-border">
                        <span class="text-[10px] text-brand-muted uppercase font-bold block font-outfit truncate">${oppName}</span>
                        <span class="font-mono text-2xl font-extrabold text-brand-text">${this.opponentScore}</span>
                        <span class="text-[9px] text-brand-muted block font-outfit">Adversaire</span>
                    </div>
                </div>

                <!-- Rematch Button -->
                <button id="duel-rematch-btn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-accent via-brand-gold to-brand-goldDark text-brand-darker font-extrabold text-xs uppercase tracking-wider transition active:scale-95 shadow font-outfit flex items-center justify-center gap-2">
                    <i class="fa-solid fa-rotate-right"></i> Revanche Immédiate
                </button>
            </div>
        `;

        document.getElementById("duel-rematch-btn")?.addEventListener("click", () => {
            this.isPlaying = false;
            window.ambience?.playClick();
            this.render();
        });
    }

    // --- MULTIPLAYER MESSAGE DISPATCHER ---
    handleRemoteDuelMessage(msg) {
        if (!msg) return;

        if (msg.action === "challenge") {
            // Received a challenge from another player in the room!
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
            // The opponent accepted host's challenge!
            if (this.isHost && this.currentChallengeId === msg.challengeId) {
                this.opponentUser = msg.author;
                this.waitingForOpponent = false;
                window.studyApp?.showToast(`⚔️ ${msg.author.name} a rejoint le Duel !`);
                this.beginMatch();
            }
        } else if (msg.action === "answer") {
            // Opponent answered a question
            if (this.isPlaying && this.currentChallengeId === msg.challengeId) {
                this.opponentScore = msg.score;
                const oppScoreEl = document.getElementById("duel-opp-score");
                if (oppScoreEl) oppScoreEl.textContent = this.opponentScore;
            }
        }
    }

    acceptChallenge(challengeMsg) {
        this.mode = "multiplayer";
        this.isHost = false;
        this.currentChallengeId = challengeMsg.challengeId;
        this.opponentUser = challengeMsg.author;

        // Load the exact same questions by IDs
        const qMap = new Map(DUEL_QUESTIONS_BANK.map(q => [q.id, q]));
        this.questions = challengeMsg.questionIds.map(id => qMap.get(id)).filter(Boolean);
        if (this.questions.length === 0) {
            this.questions = DUEL_QUESTIONS_BANK.slice(0, 5);
        }

        // Notify host that we accepted
        window.roomSync.sendDuel("accept", {
            challengeId: this.currentChallengeId
        });

        // Switch to duel tab if not already on it
        window.studyApp?.switchTab("tab-duel");
        this.beginMatch();
    }
}

window.DuelArena = DuelArena;
