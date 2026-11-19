/**
 * StudySouk Timer - STEM Flashcards & Formula Trainer
 * Real academic database extracted directly from StudySouk Master (2BAC SM/PC & CPGE).
 */

const STUDY_FLASHCARDS = [
    {
        id: "FC_DERIV_01",
        discipline: "Maths",
        level: "2BAC SM/PC",
        chapter: "Dérivabilité",
        title: "Dérivée de Arctan(u)",
        question: "Quelle est la dérivée de la fonction $x \\mapsto \\arctan(u(x))$ ?",
        latex: "(\\arctan(u))'(x) = \\frac{u'(x)}{1 + u(x)^2}",
        tip: "⚠️ Piège National : Ne jamais oublier le u'(x) au numérateur !"
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
        tip: "💡 Utilisée dans 80% des concours ENSA/ENSAM pour calculer des limites de sommes."
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
        id: "FC_PHYS_01",
        discipline: "Physique",
        level: "2BAC SM/PC",
        chapter: "Électricité RLC",
        title: "Période propre d'un oscillateur LC",
        question: "Quelle est l'expression de la période propre $T_0$ d'un circuit LC non amorti ?",
        latex: "T_0 = 2\\pi \\sqrt{L C}",
        tip: "💡 Démonstration classique : injection de la solution q(t) = Q_max cos(ω₀t + φ) dans l'éq. diff."
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
        tip: "💡 Ne confondez pas activité A(t) = λN(t) en Becquerel (Bq) et la masse m(t)."
    },
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
        id: "FC_INFO_01",
        discipline: "Informatique",
        level: "CPGE / SM",
        chapter: "Algorithmique",
        question: "Complexité temporelle moyenne et au pire cas du tri rapide (Quicksort) :",
        latex: "T_{moyen}(n) = \\mathcal{O}(n \\log n), \\quad T_{pire}(n) = \\mathcal{O}(n^2)",
        tip: "💡 Le pire cas survient lorsque le pivot choisi est systématiquement le minimum ou maximum."
    },
    {
        id: "FC_INFO_02",
        discipline: "Informatique",
        level: "CPGE / SM",
        chapter: "Structures & Graphes",
        question: "Complexité temporelle de l'algorithme de Dijkstra avec file à priorité (tas binaire) :",
        latex: "\\mathcal{O}\\big((|V| + |E|) \\log |V|\\big)",
        tip: "⚠️ Ne fonctionne que pour des poids d'arêtes STRICTEMENT positifs ou nuls."
    }
];

class FlashcardViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentIndex = 0;
        this.isFlipped = false;
        this.selectedDiscipline = "All";
    }

    getFilteredCards() {
        if (this.selectedDiscipline === "All") return STUDY_FLASHCARDS;
        return STUDY_FLASHCARDS.filter(c => c.discipline === this.selectedDiscipline);
    }

    render() {
        if (!this.container) return;
        const cards = this.getFilteredCards();
        const card = cards[this.currentIndex] || cards[0];

        this.container.innerHTML = `
            <div class="flex flex-col items-center max-w-sm mx-auto space-y-3">
                <!-- Header Discipline Filter -->
                <div class="flex items-center justify-between w-full px-1">
                    <span class="text-xs uppercase tracking-widest font-bold text-brand-goldLight flex items-center gap-1.5 font-outfit">
                        <i class="fa-solid fa-graduation-cap text-brand-gold"></i> Flashcards STEM (${this.currentIndex + 1}/${cards.length})
                    </span>
                    <select id="fc-discipline-filter" class="bg-brand-card border border-brand-borderLight rounded-lg px-2 py-1 text-[11px] text-brand-goldLight focus:outline-none focus:border-brand-gold font-outfit">
                        <option value="All" ${this.selectedDiscipline === 'All' ? 'selected' : ''}>Toutes</option>
                        <option value="Maths" ${this.selectedDiscipline === 'Maths' ? 'selected' : ''}>Maths</option>
                        <option value="Physique" ${this.selectedDiscipline === 'Physique' ? 'selected' : ''}>Physique</option>
                        <option value="Chimie" ${this.selectedDiscipline === 'Chimie' ? 'selected' : ''}>Chimie</option>
                        <option value="Informatique" ${this.selectedDiscipline === 'Informatique' ? 'selected' : ''}>Informatique</option>
                    </select>
                </div>

                <!-- 3D Card Container -->
                <div id="fc-card" class="w-full min-h-[240px] rounded-2xl glass-card border border-brand-borderLight p-5 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:border-brand-gold/60 shadow-xl relative overflow-hidden group">
                    <!-- Top Info Badges -->
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cherry text-brand-goldLight border border-brand-borderLight font-bold">
                            ${card.level} • ${card.chapter}
                        </span>
                        <span class="text-xs text-brand-muted group-hover:text-brand-gold transition">
                            <i class="fa-solid fa-rotate text-sm"></i>
                        </span>
                    </div>

                    <!-- Main Content (Front or Back) -->
                    <div class="my-3 text-center flex flex-col items-center justify-center flex-1">
                        ${!this.isFlipped ? `
                            <span class="text-xs uppercase tracking-wider text-brand-gold font-bold mb-1 font-outfit">
                                ${card.title}
                            </span>
                            <p class="text-sm font-semibold text-brand-text leading-relaxed fc-latex-render" id="fc-q-text">
                                ${card.question}
                            </p>
                            <span class="text-[11px] text-brand-muted mt-3 italic flex items-center gap-1">
                                <i class="fa-solid fa-hand-pointer animate-bounce text-brand-gold"></i> Clique pour révéler la formule
                            </span>
                        ` : `
                            <span class="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2 font-outfit">
                                Formule d'Excellence
                            </span>
                            <div class="my-2 p-3 rounded-xl bg-brand-darker border border-brand-borderLight text-brand-goldLight font-mono text-sm sm:text-base font-bold shadow-inner fc-latex-render" id="fc-math-render">
                                $$${card.latex}$$
                            </div>
                            <p class="text-[11px] text-brand-goldLight/90 mt-2 p-2 rounded-lg bg-brand-card border border-brand-border">
                                ${card.tip}
                            </p>
                        `}
                    </div>

                    <!-- Bottom Nav / Rating -->
                    <div class="pt-2 border-t border-brand-border flex items-center justify-between">
                        <button id="fc-prev-btn" class="text-xs text-brand-muted hover:text-brand-text flex items-center gap-1 font-outfit">
                            <i class="fa-solid fa-arrow-left"></i> Précédent
                        </button>
                        <button id="fc-next-btn" class="text-xs text-brand-goldLight hover:text-white font-bold flex items-center gap-1 font-outfit">
                            Suivant <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- Rating Buttons (Shown when flipped) -->
                ${this.isFlipped ? `
                    <div class="flex gap-2 w-full pt-1">
                        <button id="fc-review-hard" class="flex-1 py-2 rounded-xl bg-brand-card hover:bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold text-xs transition active:scale-95 font-outfit">
                            ❌ À Revoir
                        </button>
                        <button id="fc-review-easy" class="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs transition active:scale-95 shadow font-outfit">
                            ✅ Maîtrisé (+20 XP)
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        // Render KaTeX
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

        // Listeners
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
            window.levelSystem?.addXP(20, "Flashcard Maîtrisée");
            const cards = this.getFilteredCards();
            this.currentIndex = (this.currentIndex + 1) % cards.length;
            this.isFlipped = false;
            this.render();
        });

        document.getElementById("fc-review-hard")?.addEventListener("click", () => {
            window.ambience?.playClick();
            const cards = this.getFilteredCards();
            this.currentIndex = (this.currentIndex + 1) % cards.length;
            this.isFlipped = false;
            this.render();
        });
    }
}

window.FlashcardViewer = FlashcardViewer;
