/**
 * StudySouk Timer - Master Collaborative Whiteboard & LaTeX Mathematical Studio
 * Designed for CPGE & 2BAC STEM Students (Realtime Voice Channel Synchronization).
 */

const QUICK_FORMULAS = [
    // --- MATHÉMATIQUES CPGE ---
    { cat: "Maths", name: "Formule d'Euler", code: "e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)" },
    { cat: "Maths", name: "Intégration Par Parties (IPP)", code: "\\int_a^b u'(t)v(t)\\,dt = [u(t)v(t)]_a^b - \\int_a^b u(t)v'(t)\\,dt" },
    { cat: "Maths", name: "Somme de Riemann", code: "\\lim_{n \\to \\infty} \\frac{1}{n}\\sum_{k=1}^n f\\left(\\frac{k}{n}\\right) = \\int_0^1 f(x)\\,dx" },
    { cat: "Maths", name: "DL Sinus & Cosinus en 0", code: "\\sin(x) = x - \\frac{x^3}{6} + o(x^3), \\quad \\cos(x) = 1 - \\frac{x^2}{2} + o(x^2)" },
    { cat: "Maths", name: "Inégalité de Cauchy-Schwarz", code: "|\\langle x, y \\rangle|^2 \\le \\langle x, x \\rangle \\cdot \\langle y, y \\rangle" },
    { cat: "Maths", name: "Formule de Taylor-Lagrange", code: "f(b) = \\sum_{k=0}^n \\frac{f^{(k)}(a)}{k!}(b-a)^k + \\int_a^b \\frac{(b-t)^n}{n!}f^{(n+1)}(t)\\,dt" },

    // --- PHYSIQUE & ÉLECTRICITÉ ---
    { cat: "Physique", name: "Équation Différentielle RLC", code: "\\frac{d^2u_c}{dt^2} + 2\\lambda\\frac{du_c}{dt} + \\omega_0^2 u_c = 0" },
    { cat: "Physique", name: "Période Propre Circuit LC", code: "T_0 = 2\\pi \\sqrt{LC}, \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}}" },
    { cat: "Physique", name: "Énergie Électromagnétique", code: "E = \\frac{1}{2} C u_c^2 + \\frac{1}{2} L i^2 = \\text{cste}" },
    { cat: "Physique", name: "Équations de Maxwell (Vide)", code: "\\nabla \\cdot \\vec{E} = 0, \\quad \\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}" },
    { cat: "Physique", name: "2ème Loi de Newton", code: "\\sum \\vec{F}_{\\text{ext}} = \\frac{d\\vec{p}}{dt} = m \\vec{a}_G" },

    // --- CHIMIE & THERMODYNAMIQUE ---
    { cat: "Chimie", name: "Relation de Henderson-Hasselbalch", code: "\\text{pH} = \\text{p}K_a + \\log\\left(\\frac{[A^-]}{[AH]}\\right)" },
    { cat: "Chimie", name: "Formule de Nernst", code: "E = E^\\circ + \\frac{0.059}{n}\\log\\left(\\frac{[\\text{Ox}]^a}{[\\text{Red}]^b}\\right)" },
    { cat: "Chimie", name: "Premier Principe Thermo", code: "\\Delta U = W + Q, \\quad dH = dU + d(PV)" },

    // --- INFORMATIQUE & ALGORITHMES ---
    { cat: "Info", name: "Master Theorem (Diviser pour Régner)", code: "T(n) = aT(n/b) + O(n^d) \\implies O(n^{\\log_b a})" },
    { cat: "Info", name: "Complexité Tri Rapide (Quicksort)", code: "T_{\\text{moyen}}(n) = O(n \\log n), \\quad T_{\\text{pire}}(n) = O(n^2)" }
];

class FormulaScratchpad {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeMode = "board"; // "board" (drawing) or "latex"
        this.activeFilter = "Tous"; // "Tous", "Maths", "Physique", "Chimie", "Info"
        this.notes = localStorage.getItem("ss_scratchpad_notes") || "\\int_0^1 x^2 \\, dx = \\frac{1}{3}";

        // Drawing state
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentColor = "#FFFFFF"; // StudySouk Platinum Silver
        this.currentSize = 3;
        this.currentTool = "pen"; // "pen", "highlighter", "eraser"
        this.lastX = 0;
        this.lastY = 0;
        this.points = [];
        this.history = []; // Undo stack (max 15 snapshots)

        this.initSyncListener();
    }

    initSyncListener() {
        if (window.roomSync) {
            window.roomSync.on("whiteboard_message", (msg) => {
                this.handleRemoteWhiteboard(msg);
            });
        }
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="flex flex-col h-full w-full max-w-5xl mx-auto space-y-3">
                
                <!-- Submode Switcher (Tableau vs LaTeX) -->
                <div class="flex items-center justify-between pb-1 border-b border-brand-borderSubtle">
                    <div class="flex items-center gap-1.5 p-1 rounded-2xl glass-card border border-brand-borderSubtle shadow-inner">
                        <button id="sp-tab-board" class="px-4 py-1.5 rounded-xl text-xs font-black font-outfit transition ${this.activeMode === 'board' ? 'bg-brand-cherry text-brand-goldLight border border-brand-gold shadow-md' : 'text-brand-muted hover:text-white'}">
                            <i class="fa-solid fa-paintbrush mr-1.5 text-brand-gold"></i> Tableau Grand Format
                        </button>
                        <button id="sp-tab-latex" class="px-4 py-1.5 rounded-xl text-xs font-black font-outfit transition ${this.activeMode === 'latex' ? 'bg-brand-cherry text-brand-goldLight border border-brand-gold shadow-md' : 'text-brand-muted hover:text-white'}">
                            <i class="fa-solid fa-square-root-variable mr-1.5 text-brand-gold"></i> Formulaire LaTeX
                        </button>
                    </div>

                    <div class="flex items-center gap-1.5">
                        <span id="whiteboard-sync-badge" class="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1.5 glass-card px-2.5 py-1 rounded-full border border-emerald-500/30">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Multi-Joueurs Actif
                        </span>
                    </div>
                </div>

                <!-- MODE 1: COLLABORATIVE DRAWING WHITEBOARD (Widescreen + Lateral Controls Dock "f jnab") -->
                <div id="sp-view-board" class="${this.activeMode === 'board' ? 'flex' : 'hidden'} flex-col md:flex-row items-stretch gap-3 w-full">
                    
                    <!-- LATERAL DRAWING CONTROLS DOCK (On the side / "f jnab") -->
                    <div class="flex flex-row md:flex-col items-center justify-between md:justify-start gap-2.5 p-2 sm:p-2.5 rounded-2xl glass-panel border border-brand-gold/30 text-xs shadow-xl shrink-0 w-full md:w-20 lg:w-24 bg-brand-card/90">
                        
                        <!-- Tool Selectors (Vertical on md) -->
                        <div class="flex flex-row md:flex-col items-center gap-1.5 bg-brand-darker p-1 rounded-xl border border-brand-borderSubtle w-full justify-center">
                            <button id="wb-tool-pen" title="Stylo Plume (Tracé net)" class="wb-tool-btn w-9 h-9 rounded-xl bg-brand-cherry border border-brand-gold text-brand-goldLight font-bold flex items-center justify-center transition active:scale-90 shadow-md">
                                <i class="fa-solid fa-pen-nib text-sm"></i>
                            </button>
                            <button id="wb-tool-highlighter" title="Surligneur Fluorescent" class="wb-tool-btn w-9 h-9 rounded-xl text-brand-muted hover:text-white border border-transparent flex items-center justify-center transition active:scale-90">
                                <i class="fa-solid fa-highlighter text-sm"></i>
                            </button>
                            <button id="wb-tool-eraser" title="Gomme" class="wb-tool-btn w-9 h-9 rounded-xl text-brand-muted hover:text-white border border-transparent flex items-center justify-center transition active:scale-90">
                                <i class="fa-solid fa-eraser text-sm"></i>
                            </button>
                        </div>

                        <div class="hidden md:block w-full h-[1px] bg-brand-borderSubtle"></div>

                        <!-- Color Palette (Vertical on md) -->
                        <div class="grid grid-cols-6 md:grid-cols-2 gap-1.5 p-1 bg-brand-darker rounded-xl border border-brand-borderSubtle">
                            ${[
                                { c: "#FFFFFF", title: "Argent Platine" }, { c: "#9E1838", title: "Dark Cherry" },
                                { c: "#E63946", title: "Rouge Cerise" },
                                { c: "#00F0FF", title: "Cyan Électrique" },
                                { c: "#10B981", title: "Émeraude" },
                                { c: "#FFFFFF", title: "Craie Blanche" },
                                { c: "#A855F7", title: "Lavande Math" }
                            ].map(item => `
                                <button data-color="${item.c}" title="${item.title}" class="wb-color-btn w-5 h-5 rounded-full border ${item.c === this.currentColor ? 'border-white scale-125 shadow-lg ring-1 ring-brand-gold' : 'border-black/60 opacity-80'} transition-all hover:scale-110" style="background-color: ${item.c};"></button>
                            `).join('')}
                        </div>

                        <div class="hidden md:block w-full h-[1px] bg-brand-borderSubtle"></div>

                        <!-- Thickness Presets (Vertical on md) -->
                        <div class="flex flex-row md:flex-col items-center gap-1 bg-brand-darker p-1 rounded-xl border border-brand-borderSubtle w-full justify-center">
                            <button data-size="2" title="Trait Fin" class="wb-size-btn text-[10px] w-full py-1 rounded-lg font-bold ${this.currentSize === 2 ? 'bg-brand-cherry text-brand-goldLight font-black border border-brand-gold/40' : 'text-brand-muted'} text-center transition">Fin</button>
                            <button data-size="4" title="Trait Moyen" class="wb-size-btn text-[10px] w-full py-1 rounded-lg font-bold ${this.currentSize === 4 ? 'bg-brand-cherry text-brand-goldLight font-black border border-brand-gold/40' : 'text-brand-muted'} text-center transition">Moy</button>
                            <button data-size="8" title="Trait Épais" class="wb-size-btn text-[10px] w-full py-1 rounded-lg font-bold ${this.currentSize === 8 ? 'bg-brand-cherry text-brand-goldLight font-black border border-brand-gold/40' : 'text-brand-muted'} text-center transition">Épais</button>
                        </div>

                        <div class="hidden md:block w-full h-[1px] bg-brand-borderSubtle"></div>

                        <!-- Action Buttons: Undo, Export & Clear -->
                        <div class="flex flex-row md:flex-col items-center gap-1.5 w-full justify-center">
                            <button id="wb-undo-btn" title="Annuler le dernier trait (Ctrl+Z)" class="w-8 h-8 rounded-xl glass-card text-brand-muted hover:text-white text-xs flex items-center justify-center border border-brand-borderSubtle active:scale-90 transition shadow-sm hover:border-brand-gold">
                                <i class="fa-solid fa-arrow-rotate-left"></i>
                            </button>
                            <button id="wb-export-btn" title="Télécharger le schéma (PNG)" class="w-8 h-8 rounded-xl glass-card text-brand-goldLight hover:text-white text-xs flex items-center justify-center border border-brand-gold/40 active:scale-90 transition shadow-sm hover:border-brand-gold">
                                <i class="fa-solid fa-download"></i>
                            </button>
                            <button id="wb-clear-btn" title="Effacer tout le tableau" class="w-8 h-8 rounded-xl glass-card border-rose-950/80 text-rose-400 hover:text-rose-300 text-xs flex items-center justify-center border active:scale-90 transition shadow-sm hover:border-rose-600">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>

                    <!-- EXPANDED WHITEBOARD CANVAS BOX ("kbr white board") -->
                    <div class="relative flex-1 rounded-2xl overflow-hidden border border-brand-gold/40 shadow-2xl bg-[#08080C] min-h-[480px] sm:min-h-[550px] md:min-h-[620px] flex flex-col">
                        <!-- Engineering Dot Grid Watermark -->
                        <div class="absolute inset-0 pointer-events-none opacity-25" style="background-image: radial-gradient(rgba(212, 175, 55, 0.45) 1px, transparent 1px); background-size: 24px 24px;"></div>
                        
                        <canvas id="whiteboard-canvas" width="1200" height="700" class="relative z-10 w-full h-full flex-1 cursor-crosshair touch-none"></canvas>
                        
                        <div class="absolute bottom-2 left-3 z-20 pointer-events-none text-[10px] text-brand-muted/80 font-mono flex items-center gap-1.5 bg-brand-darker/85 px-2.5 py-1 rounded-lg border border-brand-borderSubtle backdrop-blur-sm shadow-md">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <i class="fa-solid fa-pen text-[9px] text-brand-gold"></i> Tableau Grand Format • Synchronisé en direct avec le salon vocal
                        </div>
                    </div>
                </div>

                <!-- MODE 2: LATEX FORMULAS & SCRATCHPAD -->
                <div id="sp-view-latex" class="${this.activeMode === 'latex' ? 'block' : 'hidden'} space-y-3">
                    
                    <!-- Math Quick Symbol Toolbar -->
                    <div class="flex flex-wrap gap-1 p-2 rounded-2xl glass-panel border border-brand-borderSubtle">
                        ${[
                            "\\int_a^b", "\\sum_{k=1}^n", "\\lim_{x \\to 0}", "\\sqrt{x}", "\\infty", "\\alpha", "\\beta", "\\theta", "\\lambda", "\\Delta", "\\nabla", "\\partial", "\\frac{a}{b}", "\\vec{F}", "\\in", "\\oplus", "\\iff"
                        ].map(sym => `
                            <button data-sym="${sym}" class="math-sym-btn px-2.5 py-1 rounded-lg bg-brand-darker hover:bg-brand-cherry text-brand-goldLight text-[11px] font-mono border border-brand-borderSubtle transition-all active:scale-95 shadow-sm">
                                ${sym}
                            </button>
                        `).join('')}
                    </div>

                    <!-- Textarea Editor with Save Indicator -->
                    <div class="relative w-full">
                        <textarea id="sp-textarea" rows="3" placeholder="Écris ton expression en code LaTeX (ex: \\int_0^1 x^2 dx = \\frac{1}{3})..."
                            class="w-full bg-brand-darker border border-brand-borderSubtle rounded-2xl p-3.5 text-xs font-mono text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold resize-none leading-relaxed shadow-inner">${this.notes}</textarea>
                        
                        <div class="flex items-center justify-between mt-1 px-1">
                            <span id="sp-save-indicator" class="text-[10px] text-emerald-400 font-mono font-bold opacity-0 transition-opacity flex items-center gap-1">
                                <i class="fa-solid fa-check"></i> Sauvegardé automatiquement
                            </span>
                            <button id="sp-share-room-btn" class="px-3.5 py-1.5 rounded-xl cherry-glow-btn text-white text-xs font-bold border border-brand-gold/60 shadow active:scale-95 transition font-outfit flex items-center gap-1.5">
                                <i class="fa-solid fa-bullhorn text-brand-goldLight"></i> Diffuser sur le Vocal
                            </button>
                        </div>
                    </div>

                    <!-- Live KaTeX Mathematical Rendering Display Plaque -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] uppercase tracking-wider font-extrabold text-brand-gold font-outfit flex items-center gap-1.5">
                                <i class="fa-solid fa-eye text-xs"></i> Rendu Mathématique HD (KaTeX)
                            </span>
                            <button id="btn-copy-preview-code" class="text-[10px] text-brand-muted hover:text-brand-goldLight font-mono flex items-center gap-1">
                                <i class="fa-regular fa-copy"></i> Copier le code
                            </button>
                        </div>
                        <div id="sp-math-preview" class="p-4 rounded-2xl glass-card border border-brand-gold/40 text-center min-h-[64px] flex items-center justify-center text-white font-bold text-base sm:text-lg overflow-x-auto shadow-xl">
                            $$${this.notes}$$
                        </div>
                    </div>

                    <!-- Categorized Quick Formula Reference Library -->
                    <div class="space-y-2 pt-1">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] text-brand-muted font-extrabold font-outfit">
                                Formulaire Officiel des Concours :
                            </span>
                            <!-- Category Filter Chips -->
                            <div class="flex items-center gap-1 text-[10px] font-outfit">
                                ${["Tous", "Maths", "Physique", "Chimie", "Info"].map(cat => `
                                    <button data-cat="${cat}" class="formula-cat-btn px-2 py-0.5 rounded-lg border transition ${cat === this.activeFilter ? 'bg-brand-cherry text-brand-goldLight border-brand-gold' : 'glass-card border-brand-borderSubtle text-brand-muted'}">
                                        ${cat}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div id="formulas-library-list" class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            ${this.renderFormulasList()}
                        </div>
                    </div>

                </div>

            </div>
        `;

        this.bindModeSwitcher();
        this.initCanvasDrawing();
        this.bindLatexControls();
    }

    renderFormulasList() {
        const filtered = this.activeFilter === "Tous" 
            ? QUICK_FORMULAS 
            : QUICK_FORMULAS.filter(f => f.cat === this.activeFilter);

        return filtered.map(f => `
            <div class="p-2 rounded-xl glass-card hover:border-brand-gold/50 flex items-center justify-between text-xs transition group">
                <div class="truncate mr-2">
                    <span class="text-[10px] font-extrabold text-brand-gold font-outfit mr-1.5">[${f.cat}] ${f.name}</span>
                    <code class="text-[10px] text-brand-muted font-mono block truncate">${f.code}</code>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button data-insert="${f.code.replace(/"/g, '&quot;')}" class="insert-formula-btn text-brand-gold hover:text-white px-2 py-1 rounded-lg bg-brand-darker border border-brand-borderSubtle text-[10px] font-outfit font-bold hover:border-brand-gold transition" title="Insérer dans l'éditeur">
                        Insérer
                    </button>
                    <button data-copy="${f.code.replace(/"/g, '&quot;')}" class="copy-formula-btn text-brand-muted hover:text-brand-goldLight p-1" title="Copier le code LaTeX">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    bindModeSwitcher() {
        const btnBoard = document.getElementById("sp-tab-board");
        const btnLatex = document.getElementById("sp-tab-latex");
        const viewBoard = document.getElementById("sp-view-board");
        const viewLatex = document.getElementById("sp-view-latex");

        btnBoard?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.activeMode = "board";
            btnBoard.className = "px-4 py-1.5 rounded-xl text-xs font-black font-outfit transition bg-brand-cherry text-brand-goldLight border border-brand-gold shadow-md";
            btnLatex.className = "px-4 py-1.5 rounded-xl text-xs font-black font-outfit transition text-brand-muted hover:text-white";
            viewBoard?.classList.remove("hidden");
            viewBoard?.classList.add("flex");
            viewLatex?.classList.add("hidden");
            this.resizeCanvas();
        });

        btnLatex?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.activeMode = "latex";
            btnLatex.className = "px-4 py-1.5 rounded-xl text-xs font-black font-outfit transition bg-brand-cherry text-brand-goldLight border border-brand-gold shadow-md";
            btnBoard.className = "px-4 py-1.5 rounded-xl text-xs font-black font-outfit transition text-brand-muted hover:text-white";
            viewLatex?.classList.remove("hidden");
            viewBoard?.classList.add("hidden");
            viewBoard?.classList.remove("flex");
            this.updateLatexPreview();
        });
    }

    // --- DRAWING CANVAS ENGINE WITH QUADRATIC BEZIER SMOOTHING ---
    initCanvasDrawing() {
        this.canvas = document.getElementById("whiteboard-canvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
        this.resizeCanvas();

        window.addEventListener("resize", () => this.resizeCanvas(), { passive: true });

        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (this.canvas.width / rect.width),
                y: (clientY - rect.top) * (this.canvas.height / rect.height)
            };
        };

        const saveHistoryState = () => {
            if (!this.ctx || !this.canvas) return;
            if (this.history.length >= 15) this.history.shift();
            this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
        };

        const startDraw = (e) => {
            e.preventDefault();
            this.isDrawing = true;
            saveHistoryState();
            const pos = getPos(e);
            this.lastX = pos.x;
            this.lastY = pos.y;
            this.points = [pos];
        };

        const drawMove = (e) => {
            if (!this.isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);
            this.points.push(pos);

            if (this.points.length >= 3) {
                const p0 = this.points[this.points.length - 3];
                const p1 = this.points[this.points.length - 2];
                const p2 = this.points[this.points.length - 1];

                // Quadratic smoothing midpoint
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                this.drawSmoothSegment(p0.x, p0.y, p1.x, p1.y, midX, midY, this.currentColor, this.currentSize, this.currentTool);

                // Broadcast stroke to voice channel
                if (window.roomSync) {
                    window.roomSync.sendWhiteboard("stroke", {
                        x0: Math.round(p0.x),
                        y0: Math.round(p0.y),
                        x1: Math.round(p1.x),
                        y1: Math.round(p1.y),
                        midX: Math.round(midX),
                        midY: Math.round(midY),
                        color: this.currentColor,
                        size: this.currentSize,
                        tool: this.currentTool
                    });
                }
            } else {
                this.drawLine(this.lastX, this.lastY, pos.x, pos.y, this.currentColor, this.currentSize, this.currentTool);
            }

            this.lastX = pos.x;
            this.lastY = pos.y;
        };

        const endDraw = () => {
            this.isDrawing = false;
            this.points = [];
        };

        this.canvas.addEventListener("mousedown", startDraw);
        this.canvas.addEventListener("mousemove", drawMove);
        window.addEventListener("mouseup", endDraw);

        this.canvas.addEventListener("touchstart", startDraw, { passive: false });
        this.canvas.addEventListener("touchmove", drawMove, { passive: false });
        window.addEventListener("touchend", endDraw);

        // Tool buttons
        const toolBtns = {
            pen: document.getElementById("wb-tool-pen"),
            highlighter: document.getElementById("wb-tool-highlighter"),
            eraser: document.getElementById("wb-tool-eraser")
        };

        const selectTool = (tool) => {
            this.currentTool = tool;
            window.ambience?.playClick();
            Object.keys(toolBtns).forEach(k => {
                const b = toolBtns[k];
                if (!b) return;
                if (k === tool) {
                    b.className = "wb-tool-btn w-9 h-9 rounded-xl bg-brand-cherry border border-brand-gold text-brand-goldLight font-bold flex items-center justify-center transition active:scale-90 shadow-md";
                } else {
                    b.className = "wb-tool-btn w-9 h-9 rounded-xl text-brand-muted hover:text-white border border-transparent flex items-center justify-center transition active:scale-90";
                }
            });
        };

        toolBtns.pen?.addEventListener("click", () => selectTool("pen"));
        toolBtns.highlighter?.addEventListener("click", () => selectTool("highlighter"));
        toolBtns.eraser?.addEventListener("click", () => selectTool("eraser"));

        // Colors
        this.container.querySelectorAll(".wb-color-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.currentColor = btn.dataset.color;
                window.ambience?.playClick();
                this.container.querySelectorAll(".wb-color-btn").forEach(b => {
                    b.classList.remove("border-white", "scale-125", "shadow-lg", "ring-1", "ring-brand-gold");
                    b.classList.add("border-black/60", "opacity-80");
                });
                btn.classList.add("border-white", "scale-125", "shadow-lg", "ring-1", "ring-brand-gold");
                btn.classList.remove("border-black/60", "opacity-80");
                selectTool("pen");
            });
        });

        // Size presets
        this.container.querySelectorAll(".wb-size-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.currentSize = parseInt(btn.dataset.size, 10);
                window.ambience?.playClick();
                this.container.querySelectorAll(".wb-size-btn").forEach(b => {
                    b.classList.remove("bg-brand-cherry", "text-brand-goldLight", "font-black", "border", "border-brand-gold/40");
                    b.classList.add("text-brand-muted");
                });
                btn.classList.add("bg-brand-cherry", "text-brand-goldLight", "font-black", "border", "border-brand-gold/40");
                btn.classList.remove("text-brand-muted");
            });
        });

        // Undo Button
        document.getElementById("wb-undo-btn")?.addEventListener("click", () => {
            if (this.history.length > 0 && this.ctx) {
                const prev = this.history.pop();
                this.ctx.putImageData(prev, 0, 0);
                window.ambience?.playClick();
            }
        });

        // Export Snapshot
        document.getElementById("wb-export-btn")?.addEventListener("click", () => {
            if (!this.canvas) return;
            const link = document.createElement("a");
            link.download = `StudySouk_Schema_${Date.now()}.png`;
            link.href = this.canvas.toDataURL("image/png");
            link.click();
            window.ambience?.playSuccess();
            window.studyApp?.showToast("📥 Schéma téléchargé en PNG !");
        });

        // Clear Canvas
        document.getElementById("wb-clear-btn")?.addEventListener("click", () => {
            saveHistoryState();
            this.clearLocalCanvas();
            window.ambience?.playClick();
            if (window.roomSync) {
                window.roomSync.sendWhiteboard("clear", {});
            }
        });
    }

    resizeCanvas() {
        if (!this.canvas) return;
        const targetW = 1200;
        const targetH = 700;
        if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
            let tempImg = null;
            if (this.ctx && this.canvas.width > 0 && this.canvas.height > 0) {
                try {
                    tempImg = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                } catch(e) {}
            }
            this.canvas.width = targetW;
            this.canvas.height = targetH;
            if (tempImg && this.ctx) {
                try {
                    this.ctx.putImageData(tempImg, 0, 0);
                } catch(e) {}
            }
        }
    }

    drawSmoothSegment(x0, y0, cx, cy, x1, y1, color, size, tool) {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        if (tool === "eraser") {
            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.lineWidth = size * 3.5;
        } else if (tool === "highlighter") {
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.globalAlpha = 0.35;
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = size * 3.2;
        } else {
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.globalAlpha = 1.0;
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = size;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.quadraticCurveTo(cx, cy, x1, y1);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawLine(x0, y0, x1, y1, color, size, tool) {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        if (tool === "eraser") {
            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.lineWidth = size * 3.5;
        } else if (tool === "highlighter") {
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.globalAlpha = 0.35;
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = size * 3.2;
        } else {
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.globalAlpha = 1.0;
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = size;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
        this.ctx.restore();
    }

    clearLocalCanvas() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    handleRemoteWhiteboard(msg) {
        if (!msg) return;
        if (msg.action === "stroke") {
            if (msg.midX !== undefined && msg.midY !== undefined) {
                this.drawSmoothSegment(msg.x0, msg.y0, msg.x1, msg.y1, msg.midX, msg.midY, msg.color, msg.size, msg.tool);
            } else {
                this.drawLine(msg.x0, msg.y0, msg.x1, msg.y1, msg.color, msg.size, msg.tool);
            }
        } else if (msg.action === "clear") {
            this.clearLocalCanvas();
            window.studyApp?.showToast(`🧹 Le tableau a été nettoyé par ${msg.author?.name || 'un camarade'}`);
        } else if (msg.action === "share_formula") {
            window.ambience?.playSuccess();
            window.studyApp?.showToast(`📐 ${msg.author?.name || 'Un camarade'} a partagé une formule !`);
            const textarea = document.getElementById("sp-textarea");
            if (textarea) {
                textarea.value = msg.formula;
                this.notes = msg.formula;
                this.updateLatexPreview();
            }
        }
    }

    // --- LATEX CONTROLS ---
    bindLatexControls() {
        const textarea = document.getElementById("sp-textarea");
        const saveIndicator = document.getElementById("sp-save-indicator");

        this.updateLatexPreview();

        textarea?.addEventListener("input", () => {
            this.notes = textarea.value;
            localStorage.setItem("ss_scratchpad_notes", this.notes);
            this.updateLatexPreview();

            if (saveIndicator) {
                saveIndicator.classList.remove("opacity-0");
                clearTimeout(this.saveTimer);
                this.saveTimer = setTimeout(() => saveIndicator.classList.add("opacity-0"), 1200);
            }
        });

        // Insert Math Symbol
        this.container.querySelectorAll(".math-sym-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const sym = btn.dataset.sym;
                window.ambience?.playKeyClick();
                const pos = textarea.selectionStart || 0;
                const text = textarea.value;
                textarea.value = text.slice(0, pos) + sym + text.slice(pos);
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = pos + sym.length;
                this.notes = textarea.value;
                localStorage.setItem("ss_scratchpad_notes", this.notes);
                this.updateLatexPreview();
            });
        });

        // Category Filter for Formulas Library
        this.container.querySelectorAll(".formula-cat-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.activeFilter = btn.dataset.cat;
                window.ambience?.playClick();
                this.container.querySelectorAll(".formula-cat-btn").forEach(b => {
                    b.className = "formula-cat-btn px-2 py-0.5 rounded-lg border transition glass-card border-brand-borderSubtle text-brand-muted";
                });
                btn.className = "formula-cat-btn px-2 py-0.5 rounded-lg border transition bg-brand-cherry text-brand-goldLight border-brand-gold";
                
                const list = document.getElementById("formulas-library-list");
                if (list) {
                    list.innerHTML = this.renderFormulasList();
                    this.bindFormulaActionButtons();
                }
            });
        });

        this.bindFormulaActionButtons();

        // Copy Preview Code Button
        document.getElementById("btn-copy-preview-code")?.addEventListener("click", () => {
            const code = textarea ? textarea.value.trim() : this.notes;
            navigator.clipboard?.writeText(code);
            window.ambience?.playSuccess();
            window.studyApp?.showToast("📋 Code LaTeX copié dans le presse-papier !");
        });

        // Share Formula with Room
        document.getElementById("sp-share-room-btn")?.addEventListener("click", () => {
            const formula = textarea.value.trim();
            if (!formula) return;
            if (window.roomSync) {
                window.roomSync.sendWhiteboard("share_formula", {
                    formula: formula
                });
                window.ambience?.playSuccess();
                window.studyApp?.showToast(`🚀 Formule diffusée dans le salon vocal !`);
            }
        });
    }

    bindFormulaActionButtons() {
        const textarea = document.getElementById("sp-textarea");

        // Insert Formula
        this.container.querySelectorAll(".insert-formula-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const code = btn.dataset.insert;
                window.ambience?.playKeyClick();
                if (textarea) {
                    textarea.value = code;
                    this.notes = code;
                    localStorage.setItem("ss_scratchpad_notes", this.notes);
                    this.updateLatexPreview();
                }
                window.studyApp?.showToast(`✏️ Formule insérée dans l'éditeur !`);
            });
        });

        // Copy Formula
        this.container.querySelectorAll(".copy-formula-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const code = btn.dataset.copy;
                navigator.clipboard?.writeText(code);
                window.ambience?.playSuccess();
                window.studyApp?.showToast(`📋 Formule copiée !`);
            });
        });
    }

    updateLatexPreview() {
        const preview = document.getElementById("sp-math-preview");
        const textarea = document.getElementById("sp-textarea");
        if (!preview) return;
        const content = textarea ? textarea.value.trim() : this.notes;
        preview.innerHTML = `$$${content || "\\text{Ardoise vide}"}$$`;
        if (window.renderMathInElement) {
            try {
                window.renderMathInElement(preview, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false }
                    ],
                    throwOnError: false
                });
            } catch (e) {
                preview.textContent = content;
            }
        }
    }
}

window.FormulaScratchpad = FormulaScratchpad;
