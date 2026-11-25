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
        this.currentTool = "pen"; // "pen", "highlighter", "laser", "eraser"
        this.lastX = 0;
        this.lastY = 0;
        this.points = [];
        this.history = []; // Undo stack (max 15 snapshots)
        this.isTheaterMode = false;

        // Collaborative Multi-User State (2+ people live)
        this.remoteCursors = new Map(); // senderId -> { el, timer }
        this.hasContent = false;
        this.lastCursorBroadcast = 0;
        this.activeWhiteboardUsers = new Map(); // id -> { name, avatar, lastSeen }
        this.writingIndicatorTimer = null;
        this.localLaserTimer = null;

        // Split-Screen PDF Viewer State
        this.isSplitScreen = false;
        this.splitPdfDoc = null;
        this.splitPdfNumPages = 0;
        this.splitPdfPageNum = 1;
        this.splitPdfZoom = 1.0;
        this.splitPdfRendering = false;
        this.splitPdfPending = null;
        this.currentPdfRenderTask = null;
        window.scratchpad = this;

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
            <div id="scratchpad-main-container" class="flex flex-col h-full w-full max-w-7xl mx-auto space-y-2">
                
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
                        <div id="whiteboard-collaborators-badge" class="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1.5 glass-card px-2.5 py-1 rounded-full border border-emerald-500/30 shadow-sm">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span id="whiteboard-presence-text">Collaboratif Live (2+)</span>
                        </div>
                        <button id="wb-force-sync-btn" title="Demander la dernière version du tableau aux camarades" class="px-2.5 py-1 rounded-full glass-card border border-brand-borderSubtle text-brand-muted hover:text-brand-goldLight text-[10px] font-bold transition flex items-center gap-1">
                            <i class="fa-solid fa-arrows-rotate text-[9px]"></i>
                            <span class="hidden sm:inline">Sync</span>
                        </button>
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
                            <button id="wb-tool-laser" title="Pointeur Laser Live (Pointez pour le salon)" class="wb-tool-btn w-9 h-9 rounded-xl text-brand-muted hover:text-white border border-transparent flex items-center justify-center transition active:scale-90 relative">
                                <i class="fa-solid fa-bullseye text-sm text-rose-500"></i>
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

                        <!-- Action Buttons: Split-Screen, Undo, Plein Écran, Export & Clear -->
                        <div class="flex flex-row md:flex-col items-center gap-1.5 w-full justify-center">
                            <button id="wb-splitscreen-btn" title="Mode Split-Screen : Ouvrir un PDF / Série d'exercices à côté de la Sbora" class="w-8 h-8 rounded-xl glass-card text-brand-gold hover:text-white text-xs flex items-center justify-center border border-brand-gold/60 active:scale-90 transition shadow-sm hover:border-brand-gold cursor-pointer ${this.isSplitScreen ? 'bg-brand-cherry text-brand-goldLight ring-2 ring-brand-gold' : ''}">
                                <i class="fa-solid fa-book-open"></i>
                            </button>
                            <button id="wb-undo-btn" title="Annuler le dernier trait (Ctrl+Z)" class="w-8 h-8 rounded-xl glass-card text-brand-muted hover:text-white text-xs flex items-center justify-center border border-brand-borderSubtle active:scale-90 transition shadow-sm hover:border-brand-gold">
                                <i class="fa-solid fa-arrow-rotate-left"></i>
                            </button>
                            <button id="wb-fullscreen-btn" onclick="window.studyApp?.scratchpad?.toggleFullscreen()" title="Agrandir la Sbora (Plein Écran)" class="w-8 h-8 rounded-xl glass-card text-brand-gold hover:text-white text-xs flex items-center justify-center border border-brand-gold/60 active:scale-90 transition shadow-sm hover:border-brand-gold cursor-pointer">
                                <i class="fa-solid fa-expand"></i>
                            </button>
                            <button id="wb-export-btn" title="Télécharger le schéma (PNG)" class="w-8 h-8 rounded-xl glass-card text-brand-goldLight hover:text-white text-xs flex items-center justify-center border border-brand-gold/40 active:scale-90 transition shadow-sm hover:border-brand-gold">
                                <i class="fa-solid fa-download"></i>
                            </button>
                            <button id="wb-clear-btn" title="Effacer tout le tableau" class="w-8 h-8 rounded-xl glass-card border-rose-950/80 text-rose-400 hover:text-rose-300 text-xs flex items-center justify-center border active:scale-90 transition shadow-sm hover:border-rose-600">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>

                    <!-- EXPANDED WHITEBOARD & SPLIT-SCREEN WORKSPACE CONTAINER -->
                    <div id="sbora-workspace-container" class="flex-1 flex flex-col lg:flex-row items-stretch gap-2.5 min-h-[580px] sm:min-h-[680px] md:min-h-[780px] h-[78vh] overflow-hidden">
                        
                        <!-- LEFT PANEL: SPLIT-SCREEN PDF VIEWER (Toggleable) -->
                        <div id="sbora-pdf-panel" class="${this.isSplitScreen ? 'flex' : 'hidden'} flex-col w-full lg:w-1/2 rounded-2xl border border-brand-gold/50 shadow-2xl bg-[#0B0B14] overflow-hidden relative transition-all duration-300">
                            
                            <!-- PDF Viewer Toolbar -->
                            <div class="p-2 bg-brand-darker/95 border-b border-brand-borderSubtle flex flex-wrap items-center justify-between gap-1.5 shrink-0 z-20">
                                <!-- Preset Document Selector -->
                                <div class="flex items-center gap-1.5 flex-1 min-w-[170px]">
                                    <span class="text-xs text-brand-gold shrink-0">📖</span>
                                    <select id="sbora-pdf-select" class="bg-black/60 border border-brand-gold/40 text-brand-goldLight text-[11px] font-outfit font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-brand-gold flex-1 truncate cursor-pointer">
                                        <optgroup label="📐 Mathématiques 2BAC (National SM & PC)">
                                            <option value="assets/docs/StudySouk_30_Exos_Calcul_Integral_2BAC_SM_Elite.pdf">Calcul Intégral • 30 Exos 2BAC SM</option>
                                            <option value="assets/docs/StudySouk_25_Exos_Fonctions_2BAC_PC_Elite.pdf">Étude de Fonctions • 25 Exos 2BAC PC</option>
                                            <option value="assets/docs/StudySouk_30_Exos_Fonctions_2BAC_PC_Elite.pdf">Fonctions Approfondies • 30 Exos 2BAC PC</option>
                                            <option value="assets/docs/StudySouk_Etude_Fonctions_2BAC_PC_Sujet.pdf">Étude de Fonctions (Sujet) • 2BAC PC</option>
                                            <option value="assets/docs/StudySouk_Etude_Fonctions_2BAC_PC_Corrige.pdf">Étude de Fonctions (Corrigé) • 2BAC PC</option>
                                            <option value="assets/docs/StudySouk_Serie_Suites_Implicites_TAF_IAF_2BAC_SM.pdf">Suites Implicites & TAF • 2BAC SM</option>
                                            <option value="assets/docs/StudySouk_Suites_2BAC_PC_Sujet.pdf">Suites Numériques (Sujet) • 2BAC PC</option>
                                            <option value="assets/docs/StudySouk_Suites_2BAC_PC_Corrige.pdf">Suites Numériques (Corrigé) • 2BAC PC</option>
                                            <option value="assets/docs/StudySouk_Exercice_0_Limite_Logarithmes_2BAC_SM_Corrige_Elite.pdf">Limites & Logarithmes (Exo 0 Corrigé) • SM</option>
                                            <option value="assets/docs/StudySouk_Corriges_Photos_et_Blanc_2BAC_SM.pdf">Examen Blanc & Corrigés • 2BAC SM</option>
                                            <option value="assets/docs/StudySouk_DimaDima_Analyse_Elite.pdf">Dima Dima Analyse d'Élite • 2BAC</option>
                                        </optgroup>
                                        <optgroup label="🧪 Physique & Chimie 2BAC">
                                            <option value="assets/docs/StudySouk_AcidoBase_15_Exercices_Sujet.pdf">Chimie Acido-Basique (15 Exos Sujet) • 2BAC</option>
                                            <option value="assets/docs/StudySouk_AcidoBase_15_Exercices_Corrige.pdf">Chimie Acido-Basique (Corrigé) • 2BAC</option>
                                            <option value="assets/docs/StudySouk_AcidoBase_Sujet_Resume_Elite.pdf">Résumé Acido-Basique & Équilibres • 2BAC</option>
                                            <option value="assets/docs/StudySouk_AcidoBase_Corrige_Integral_Elite.pdf">Corrigé Intégral Acido-Basique • 2BAC</option>
                                        </optgroup>
                                        <optgroup label="🏛️ CPGE & Classes Préparatoires (MP/PSI/TSI)">
                                            <option value="assets/docs/Calcul_Matriciel_MP_Star.pdf">Calcul Matriciel Approfondi • MP*</option>
                                            <option value="assets/docs/Resume_Optique_Systemes_Appareils_CPGE.pdf">Optique Géométrique & Systèmes • CPGE</option>
                                            <option value="assets/docs/Theorie_Des_Ensembles_MP_Star.pdf">Théorie des Ensembles & Structures • MP*</option>
                                            <option value="assets/docs/StudySouk_Analyse_Complexe_Masterclass_Clean.pdf">Analyse Complexe • Masterclass CPGE/Univ</option>
                                            <option value="assets/docs/StudySouk_Grand_Cours_Analyse_Fondamentale.pdf">Grand Cours Analyse Fondamentale • CPGE</option>
                                            <option value="assets/docs/StudySouk_Masterclass_Analyse_Fondamentale_Elite.pdf">Masterclass Analyse Fondamentale • CPGE</option>
                                            <option value="assets/docs/StudySouk_Module_Complet_Analyse_Fondamentale.pdf">Module Analyse Fondamentale • CPGE</option>
                                            <option value="assets/docs/studysouk_exact_template_5_problemes.pdf">5 Grands Problèmes de Concours CPGE</option>
                                            <option value="assets/docs/studysouk_agregation_monumental.pdf">Agrégation Monumentale & Problèmes</option>
                                        </optgroup>
                                        <optgroup label="🌿 Bac Libre SVT & Méthodologie">
                                            <option value="assets/docs/StudySouk_Guide_Ultime_Bac_Libre_SVT.pdf">Guide Ultime Bac Libre SVT</option>
                                            <option value="assets/docs/StudySouk_Programme_Bac_Libre_SVT.pdf">Programme Officiel Bac Libre SVT</option>
                                            <option value="assets/docs/StudySouk_Plan_Action_Bac_Libre_17.pdf">Plan d'Action 17/20 Bac Libre</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <!-- Upload Custom Student PDF Button -->
                                <label for="sbora-pdf-file-input" class="px-2 py-1 rounded-lg bg-brand-cherry/80 hover:bg-brand-cherry text-brand-goldLight text-[10px] font-outfit font-black border border-brand-gold/50 cursor-pointer flex items-center gap-1 transition shrink-0 active:scale-95 shadow-sm">
                                    <i class="fa-solid fa-cloud-arrow-up text-[10px]"></i>
                                    <span class="hidden sm:inline">Mon PDF</span>
                                    <input type="file" id="sbora-pdf-file-input" accept=".pdf" class="hidden">
                                </label>

                                <!-- Page Navigation & Zoom Controls -->
                                <div class="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-lg border border-brand-borderSubtle shrink-0">
                                    <button id="sbora-pdf-prev" title="Page Précédente" class="w-6 h-6 rounded flex items-center justify-center text-brand-muted hover:text-white transition active:scale-90 cursor-pointer">
                                        <i class="fa-solid fa-chevron-left text-[10px]"></i>
                                    </button>
                                    <div class="text-[10px] font-mono text-brand-goldLight px-1 select-none flex items-center gap-0.5">
                                        <span id="sbora-pdf-page-num">1</span>/<span id="sbora-pdf-page-count">--</span>
                                    </div>
                                    <button id="sbora-pdf-next" title="Page Suivante" class="w-6 h-6 rounded flex items-center justify-center text-brand-muted hover:text-white transition active:scale-90 cursor-pointer">
                                        <i class="fa-solid fa-chevron-right text-[10px]"></i>
                                    </button>
                                    <span class="w-[1px] h-3 bg-brand-borderSubtle mx-0.5"></span>
                                    <button id="sbora-pdf-zoom-out" title="Dézoomer" class="w-5 h-6 rounded flex items-center justify-center text-brand-muted hover:text-white transition active:scale-90 cursor-pointer">
                                        <i class="fa-solid fa-minus text-[9px]"></i>
                                    </button>
                                    <button id="sbora-pdf-zoom-in" title="Zoomer" class="w-5 h-6 rounded flex items-center justify-center text-brand-muted hover:text-white transition active:scale-90 cursor-pointer">
                                        <i class="fa-solid fa-plus text-[9px]"></i>
                                    </button>
                                </div>

                                <!-- Close Split-Screen Button -->
                                <button id="sbora-pdf-close" title="Fermer le Split-Screen" class="w-6 h-6 rounded-lg text-rose-400 hover:text-white hover:bg-rose-950/80 transition flex items-center justify-center active:scale-90 cursor-pointer">
                                    <i class="fa-solid fa-xmark text-xs"></i>
                                </button>
                            </div>

                            <!-- PDF Document Scrollable Viewport & Canvas -->
                            <div id="sbora-pdf-viewport" class="flex-1 overflow-auto flex items-start justify-center p-2.5 bg-[#0e0e16] relative custom-scrollbar">
                                <!-- Loading Indicator -->
                                <div id="sbora-pdf-loading" class="absolute inset-0 bg-[#0B0B14]/85 backdrop-blur-sm flex flex-col items-center justify-center z-30 transition-opacity">
                                    <i class="fa-solid fa-circle-notch fa-spin text-2xl text-brand-gold mb-2"></i>
                                    <span class="text-xs font-outfit font-bold text-white">Chargement du document PDF...</span>
                                </div>
                                
                                <!-- Render Target Canvas -->
                                <canvas id="sbora-pdf-canvas" class="shadow-2xl rounded-lg max-w-full bg-white transition-transform origin-top"></canvas>
                            </div>
                        </div>

                        <!-- RIGHT PANEL: EXPANDED WHITEBOARD CANVAS BOX ("Sbora Canvas") -->
                        <div id="whiteboard-canvas-wrapper" class="relative ${this.isSplitScreen ? 'w-full lg:w-1/2' : 'w-full flex-1'} rounded-2xl overflow-hidden border border-brand-gold/40 shadow-2xl bg-[#08080C] flex flex-col">
                            <!-- Engineering Dot Grid Watermark -->
                            <div class="absolute inset-0 pointer-events-none opacity-25" style="background-image: radial-gradient(rgba(212, 175, 55, 0.45) 1px, transparent 1px); background-size: 24px 24px;"></div>
                            
                            <canvas id="whiteboard-canvas" width="1600" height="900" class="relative z-10 w-full h-full flex-1 cursor-crosshair touch-none"></canvas>
                            
                            <!-- MULTI-USER LIVE CURSORS & LASERS OVERLAY -->
                            <div id="whiteboard-remote-cursors" class="absolute inset-0 pointer-events-none z-30 overflow-hidden"></div>

                            <div class="absolute bottom-2 left-3 z-20 pointer-events-none text-[10px] text-brand-muted/80 font-mono flex items-center gap-1.5 bg-brand-darker/85 px-2.5 py-1 rounded-lg border border-brand-borderSubtle backdrop-blur-sm shadow-md">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <i class="fa-solid fa-users text-[9px] text-brand-gold"></i> <span id="sbora-mode-label">${this.isSplitScreen ? 'Split-Screen • PDF & Sbora' : 'Tableau Collaboratif HD'}</span>
                            </div>

                            <!-- LIVE WRITING INDICATOR (Bottom Right) -->
                            <div id="wb-writing-badge" class="absolute bottom-2 right-3 z-20 pointer-events-none text-[10px] text-brand-goldLight font-mono flex items-center gap-1.5 bg-brand-darker/90 px-2.5 py-1 rounded-lg border border-brand-gold/30 backdrop-blur-sm shadow-md transition-opacity duration-300 opacity-0">
                                <i class="fa-solid fa-pen-fancy text-emerald-400 animate-bounce"></i>
                                <span id="wb-writing-name">Un camarade écrit...</span>
                            </div>
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
        this.bindSplitScreenControls();
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
            const pos = getPos(e);
            
            if (this.currentTool === "laser") {
                this.renderLocalLaser(pos.x, pos.y);
                this.broadcastCursor(pos, true);
                return;
            }

            saveHistoryState();
            this.hasContent = true;
            this.lastX = pos.x;
            this.lastY = pos.y;
            this.points = [pos];
            this.broadcastCursor(pos, false);
        };

        const drawMove = (e) => {
            const pos = getPos(e);

            if (this.currentTool === "laser") {
                if (this.isDrawing) {
                    e.preventDefault();
                    this.renderLocalLaser(pos.x, pos.y);
                    this.broadcastCursor(pos, true);
                }
                return;
            }

            // Desktop hover cursor broadcast (when not drawing)
            if (!this.isDrawing) {
                this.broadcastCursor(pos, false);
                return;
            }

            e.preventDefault();
            this.hasContent = true;
            this.points.push(pos);
            this.broadcastCursor(pos, false);

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
            laser: document.getElementById("wb-tool-laser"),
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
        toolBtns.laser?.addEventListener("click", () => selectTool("laser"));
        toolBtns.eraser?.addEventListener("click", () => selectTool("eraser"));

        // Force Sync Button
        document.getElementById("wb-force-sync-btn")?.addEventListener("click", () => {
            window.ambience?.playClick();
            if (window.roomSync) {
                window.roomSync.sendWhiteboard("request_state", {});
                window.studyApp?.showToast("🔄 Demande de synchronisation du tableau envoyée au salon !");
            }
        });

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

        // Fullscreen Sbora Button
        document.getElementById("wb-fullscreen-btn")?.addEventListener("click", () => {
            this.toggleFullscreen();
        });

        document.addEventListener("fullscreenchange", () => {
            const btn = document.getElementById("wb-fullscreen-btn");
            if (document.fullscreenElement) {
                if (btn) btn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            } else {
                if (btn) btn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            }
            setTimeout(() => this.resizeCanvas(), 250);
        });

        // Escape key to exit CSS theater mode
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isTheaterMode) {
                this.toggleTheaterMode(false);
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
        const targetW = 1600;
        const targetH = 900;
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

    toggleFullscreen() {
        const container = document.getElementById("tab-scratchpad") || document.getElementById("scratchpad-main-container");
        const btn = document.getElementById("wb-fullscreen-btn");

        if (this.isTheaterMode) {
            this.toggleTheaterMode(false);
            return;
        }

        if (!document.fullscreenElement) {
            let req = null;
            try {
                if (container?.requestFullscreen) {
                    req = container.requestFullscreen();
                } else if (container?.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            } catch (e) {
                console.warn("[Sbora] requestFullscreen exception:", e);
            }

            if (req && typeof req.then === "function") {
                req.then(() => {
                    if (btn) btn.innerHTML = '<i class="fa-solid fa-compress"></i>';
                }).catch(() => {
                    // Browser or Discord Activity denied fullscreen -> fallback to CSS theater mode
                    this.toggleTheaterMode(true);
                });
            } else if (!document.fullscreenElement) {
                this.toggleTheaterMode(true);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(e => console.warn(e));
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            if (btn) btn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            this.toggleTheaterMode(false);
        }
        setTimeout(() => this.resizeCanvas(), 250);
    }

    toggleTheaterMode(forceState) {
        this.isTheaterMode = typeof forceState === "boolean" ? forceState : !this.isTheaterMode;
        const container = document.getElementById("tab-scratchpad");
        const wrapper = document.getElementById("whiteboard-canvas-wrapper");
        const btn = document.getElementById("wb-fullscreen-btn");

        if (this.isTheaterMode) {
            container?.classList.add("sbora-theater-fixed");
            wrapper?.classList.add("sbora-theater-wrapper");
            if (btn) btn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            window.studyApp?.showToast?.("🖥️ Sbora en Plein Écran Virtuel (Échap ou bouton pour réduire)");
        } else {
            container?.classList.remove("sbora-theater-fixed");
            wrapper?.classList.remove("sbora-theater-wrapper");
            if (btn) btn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
        setTimeout(() => this.resizeCanvas(), 250);
    }

    bindSplitScreenControls() {
        const splitBtn = document.getElementById("wb-splitscreen-btn");
        const closeBtn = document.getElementById("sbora-pdf-close");
        const selectDoc = document.getElementById("sbora-pdf-select");
        const fileInput = document.getElementById("sbora-pdf-file-input");
        const prevBtn = document.getElementById("sbora-pdf-prev");
        const nextBtn = document.getElementById("sbora-pdf-next");
        const zoomInBtn = document.getElementById("sbora-pdf-zoom-in");
        const zoomOutBtn = document.getElementById("sbora-pdf-zoom-out");

        splitBtn?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.toggleSplitScreen();
        });

        closeBtn?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.toggleSplitScreen(false);
        });

        selectDoc?.addEventListener("change", (e) => {
            const url = e.target.value;
            if (url) {
                window.ambience?.playClick();
                this.loadSplitScreenPdf(url);
            }
        });

        fileInput?.addEventListener("change", (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            window.ambience?.playClick();
            const reader = new FileReader();
            reader.onload = (ev) => {
                const arrayBuffer = ev.target?.result;
                if (arrayBuffer) {
                    this.loadSplitScreenPdf(arrayBuffer, file.name);
                }
            };
            reader.readAsArrayBuffer(file);
        });

        prevBtn?.addEventListener("click", () => {
            if (this.splitPdfDoc && this.splitPdfPageNum > 1) {
                window.ambience?.playClick();
                this.splitPdfPageNum--;
                this.renderSplitPdfPage(this.splitPdfPageNum);
            }
        });

        nextBtn?.addEventListener("click", () => {
            if (this.splitPdfDoc && this.splitPdfPageNum < this.splitPdfNumPages) {
                window.ambience?.playClick();
                this.splitPdfPageNum++;
                this.renderSplitPdfPage(this.splitPdfPageNum);
            }
        });

        zoomInBtn?.addEventListener("click", () => {
            if (this.splitPdfZoom < 2.2) {
                window.ambience?.playClick();
                this.splitPdfZoom += 0.2;
                this.renderSplitPdfPage(this.splitPdfPageNum);
            }
        });

        zoomOutBtn?.addEventListener("click", () => {
            if (this.splitPdfZoom > 0.6) {
                window.ambience?.playClick();
                this.splitPdfZoom -= 0.2;
                this.renderSplitPdfPage(this.splitPdfPageNum);
            }
        });
    }

    toggleSplitScreen(forceState) {
        this.isSplitScreen = (typeof forceState === "boolean") ? forceState : !this.isSplitScreen;
        const panel = document.getElementById("sbora-pdf-panel");
        const wrapper = document.getElementById("whiteboard-canvas-wrapper");
        const btn = document.getElementById("wb-splitscreen-btn");
        const label = document.getElementById("sbora-mode-label");

        if (this.isSplitScreen) {
            panel?.classList.remove("hidden");
            panel?.classList.add("flex");
            wrapper?.classList.remove("w-full", "flex-1");
            wrapper?.classList.add("w-full", "lg:w-1/2");
            btn?.classList.add("bg-brand-cherry", "text-brand-goldLight", "ring-2", "ring-brand-gold");
            if (label) label.textContent = "Split-Screen • PDF & Sbora";
            window.studyApp?.showToast?.("📖 Mode Split-Screen Activé : Document PDF & Sbora");

            // Auto-load default PDF if not loaded yet
            if (!this.splitPdfDoc) {
                const selectEl = document.getElementById("sbora-pdf-select");
                const defaultDoc = selectEl?.value || "assets/docs/StudySouk_30_Exos_Calcul_Integral_2BAC_SM_Elite.pdf";
                this.loadSplitScreenPdf(defaultDoc);
            } else {
                this.renderSplitPdfPage(this.splitPdfPageNum || 1);
            }
        } else {
            panel?.classList.add("hidden");
            panel?.classList.remove("flex");
            wrapper?.classList.add("w-full", "flex-1");
            wrapper?.classList.remove("w-full", "lg:w-1/2");
            btn?.classList.remove("bg-brand-cherry", "text-brand-goldLight", "ring-2", "ring-brand-gold");
            if (label) label.textContent = "Tableau Collaboratif HD";
        }

        setTimeout(() => this.resizeCanvas(), 200);
    }

    async loadSplitScreenPdf(src, customName = null) {
        if (!window.pdfjsLib) {
            console.warn("[Sbora PDF] pdfjsLib is not loaded on window.");
            return;
        }

        const loadingEl = document.getElementById("sbora-pdf-loading");
        if (loadingEl) loadingEl.classList.remove("hidden");

        try {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdfjs/pdf.worker.min.js";
            
            let dataBuffer = src;
            if (typeof src === "string") {
                let fetchUrl = src;
                if (window.location.pathname.includes('/.proxy') && !fetchUrl.startsWith('/.proxy') && !fetchUrl.startsWith('http')) {
                    const apiPrefix = window.location.pathname.replace(/\/index\.html.*$/, '').replace(/\/+$/, '');
                    fetchUrl = `${apiPrefix}/${src}`.replace(/([^:]\/)\/+/g, "$1");
                }
                const res = await fetch(fetchUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                dataBuffer = await res.arrayBuffer();
            }

            const loadingTask = window.pdfjsLib.getDocument({
                data: dataBuffer,
                cMapPacked: true
            });

            this.splitPdfDoc = await loadingTask.promise;
            this.splitPdfNumPages = this.splitPdfDoc.numPages;
            this.splitPdfPageNum = 1;

            const pageCountEl = document.getElementById("sbora-pdf-page-count");
            if (pageCountEl) pageCountEl.textContent = this.splitPdfNumPages;

            if (customName) {
                window.studyApp?.showToast?.(`📄 Document ouvert : ${customName}`);
            }

            await this.renderSplitPdfPage(1);
        } catch (err) {
            console.error("[Sbora PDF] Error loading PDF:", err);
            window.studyApp?.showToast?.("⚠️ Impossible d'ouvrir ce fichier PDF.");
        } finally {
            if (loadingEl) loadingEl.classList.add("hidden");
        }
    }

    async renderSplitPdfPage(num) {
        if (!this.splitPdfDoc) return;
        if (this.splitPdfRendering) {
            this.splitPdfPending = num;
            return;
        }

        this.splitPdfRendering = true;
        const canvas = document.getElementById("sbora-pdf-canvas");
        const viewportContainer = document.getElementById("sbora-pdf-viewport");
        if (!canvas || !viewportContainer) {
            this.splitPdfRendering = false;
            return;
        }

        const ctx = canvas.getContext("2d");

        try {
            const page = await this.splitPdfDoc.getPage(num);
            const availableW = Math.max(300, viewportContainer.clientWidth - 24);

            const unscaledViewport = page.getViewport({ scale: 1.0 });
            const fitScale = (availableW / unscaledViewport.width) * (this.splitPdfZoom || 1.0);
            const clampedScale = Math.max(0.6, Math.min(2.5, fitScale));
            const viewport = page.getViewport({ scale: clampedScale });

            const outputScale = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";

            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

            const renderContext = {
                canvasContext: ctx,
                transform: transform,
                viewport: viewport
            };

            if (this.currentPdfRenderTask) {
                try {
                    this.currentPdfRenderTask.cancel();
                } catch (e) {}
            }

            this.currentPdfRenderTask = page.render(renderContext);
            await this.currentPdfRenderTask.promise;
            this.splitPdfRendering = false;

            const pageNumEl = document.getElementById("sbora-pdf-page-num");
            if (pageNumEl) pageNumEl.textContent = num;

            if (this.splitPdfPending !== null) {
                const next = this.splitPdfPending;
                this.splitPdfPending = null;
                this.renderSplitPdfPage(next);
            }
        } catch (err) {
            if (err?.name !== "RenderingCancelledException") {
                console.error("[Sbora PDF] Error rendering page:", err);
            }
            this.splitPdfRendering = false;
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

    broadcastCursor(pos, isLaser = false) {
        const now = Date.now();
        const minInterval = isLaser ? 30 : 60;
        if (now - this.lastCursorBroadcast > minInterval) {
            this.lastCursorBroadcast = now;
            if (window.roomSync) {
                window.roomSync.sendWhiteboard("cursor", {
                    x: Math.round(pos.x),
                    y: Math.round(pos.y),
                    laser: isLaser,
                    color: this.currentColor,
                    tool: this.currentTool
                });
            }
        }
    }

    renderLocalLaser(x, y) {
        const container = document.getElementById("whiteboard-remote-cursors");
        if (!container) return;
        let localLaser = document.getElementById("wb-local-laser-dot");
        if (!localLaser) {
            localLaser = document.createElement("div");
            localLaser.id = "wb-local-laser-dot";
            localLaser.className = "absolute pointer-events-none transition-all duration-75 z-40 -translate-x-1/2 -translate-y-1/2";
            localLaser.innerHTML = `
                <div class="relative">
                    <span class="w-6 h-6 rounded-full bg-rose-500 block animate-ping absolute inset-0 opacity-80"></span>
                    <span class="w-4 h-4 rounded-full bg-rose-400 border-2 border-white block shadow-[0_0_15px_#f43f5e]"></span>
                </div>
            `;
            container.appendChild(localLaser);
        }
        const pctX = (x / 1200) * 100;
        const pctY = (y / 700) * 100;
        localLaser.style.left = `${pctX}%`;
        localLaser.style.top = `${pctY}%`;
        localLaser.style.opacity = "1";
        clearTimeout(this.localLaserTimer);
        this.localLaserTimer = setTimeout(() => {
            if (localLaser) localLaser.style.opacity = "0";
        }, 1500);
    }

    renderRemoteCursor(msg) {
        const container = document.getElementById("whiteboard-remote-cursors");
        if (!container || !msg.author) return;

        const senderId = msg.author.id || msg.author.name || "peer";
        const pctX = (msg.x / 1200) * 100;
        const pctY = (msg.y / 700) * 100;

        let cursorData = this.remoteCursors.get(senderId);
        if (!cursorData) {
            const el = document.createElement("div");
            el.className = "absolute pointer-events-none transition-all duration-75 flex items-center gap-1.5 z-40";
            container.appendChild(el);
            cursorData = { el, timer: null };
            this.remoteCursors.set(senderId, cursorData);
        }

        const el = cursorData.el;
        el.style.left = `${pctX}%`;
        el.style.top = `${pctY}%`;
        el.style.opacity = "1";

        const userColor = msg.laser ? "#F43F5E" : (msg.color || "#00F0FF");
        const userName = msg.author.name || "Étudiant";

        if (msg.laser) {
            el.innerHTML = `
                <div class="relative -translate-x-1/2 -translate-y-1/2">
                    <span class="w-6 h-6 rounded-full bg-rose-500 block animate-ping absolute inset-0 opacity-80"></span>
                    <span class="w-4 h-4 rounded-full bg-rose-400 border-2 border-white block shadow-[0_0_15px_#f43f5e]"></span>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white shadow-lg bg-rose-600/95 border border-white/40 -translate-y-4 whitespace-nowrap">
                    🔴 ${userName}
                </span>
            `;
        } else {
            el.innerHTML = `
                <svg class="w-4 h-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] -translate-x-1 -translate-y-1" style="color: ${userColor};" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.428v-20.549z"/>
                </svg>
                <span class="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold text-white shadow-md border border-white/20 whitespace-nowrap" style="background-color: ${userColor};">
                    ${userName}
                </span>
            `;
        }

        clearTimeout(cursorData.timer);
        cursorData.timer = setTimeout(() => {
            el.style.opacity = "0";
            setTimeout(() => {
                if (el.style.opacity === "0") {
                    el.remove();
                    this.remoteCursors.delete(senderId);
                }
            }, 300);
        }, 2200);
    }

    showWritingIndicator(userName) {
        const badge = document.getElementById("wb-writing-badge");
        const nameEl = document.getElementById("wb-writing-name");
        if (!badge || !nameEl) return;
        nameEl.textContent = `${userName || 'Un camarade'} écrit...`;
        badge.classList.remove("opacity-0");
        clearTimeout(this.writingIndicatorTimer);
        this.writingIndicatorTimer = setTimeout(() => {
            badge.classList.add("opacity-0");
        }, 1200);
    }

    trackUserPresence(author) {
        if (!author) return;
        const id = author.id || author.name;
        this.activeWhiteboardUsers.set(id, {
            name: author.name || "Étudiant",
            avatar: author.avatar || "assets/avatars/default.svg",
            lastSeen: Date.now()
        });
        this.updatePresenceBadge();
    }

    updatePresenceBadge() {
        const textEl = document.getElementById("whiteboard-presence-text");
        if (!textEl) return;
        const now = Date.now();
        for (const [id, user] of this.activeWhiteboardUsers.entries()) {
            if (now - user.lastSeen > 45000) {
                this.activeWhiteboardUsers.delete(id);
            }
        }
        const count = Math.max(1, this.activeWhiteboardUsers.size + 1);
        if (count > 1) {
            textEl.textContent = `👥 ${count} au tableau`;
        } else {
            textEl.textContent = `Collaboratif Live (2+)`;
        }
    }

    onTabVisible() {
        this.resizeCanvas();
        if (window.roomSync) {
            window.roomSync.sendWhiteboard("presence", {});
            window.roomSync.sendWhiteboard("request_state", {});
        }
    }

    handleRemoteWhiteboard(msg) {
        if (!msg) return;
        if (msg.action === "stroke") {
            this.hasContent = true;
            if (msg.midX !== undefined && msg.midY !== undefined) {
                this.drawSmoothSegment(msg.x0, msg.y0, msg.x1, msg.y1, msg.midX, msg.midY, msg.color, msg.size, msg.tool);
            } else {
                this.drawLine(msg.x0, msg.y0, msg.x1, msg.y1, msg.color, msg.size, msg.tool);
            }
            this.showWritingIndicator(msg.author?.name);
            this.trackUserPresence(msg.author);
        } else if (msg.action === "cursor") {
            this.renderRemoteCursor(msg);
            this.trackUserPresence(msg.author);
        } else if (msg.action === "clear") {
            this.clearLocalCanvas();
            this.hasContent = false;
            window.studyApp?.showToast(`🧹 Le tableau a été nettoyé par ${msg.author?.name || 'un camarade'}`);
        } else if (msg.action === "request_state") {
            if (this.hasContent && this.canvas) {
                window.roomSync?.sendWhiteboard("sync_state", {
                    image: this.canvas.toDataURL("image/png")
                });
            }
        } else if (msg.action === "sync_state") {
            if (msg.image) {
                const img = new Image();
                img.onload = () => {
                    if (this.ctx) {
                        this.ctx.drawImage(img, 0, 0);
                        this.hasContent = true;
                        window.studyApp?.showToast(`📋 Tableau synchronisé avec ${msg.author?.name || 'le salon'}`);
                    }
                };
                img.src = msg.image;
            }
            this.trackUserPresence(msg.author);
        } else if (msg.action === "presence") {
            this.trackUserPresence(msg.author);
        } else if (msg.action === "share_formula") {
            window.ambience?.playSuccess();
            window.studyApp?.showToast(`📐 ${msg.author?.name || 'Un camarade'} a partagé une formule !`);
            const textarea = document.getElementById("sp-textarea");
            if (textarea) {
                textarea.value = msg.formula;
                this.notes = msg.formula;
                this.updateLatexPreview();
            }
            this.trackUserPresence(msg.author);
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
