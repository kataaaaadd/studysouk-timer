/**
 * StudySouk Timer - Collaborative Whiteboard & LaTeX Mathematical Scratchpad
 * Allows students to sketch physics/math schemas and share live formulas in the voice channel.
 */

const QUICK_FORMULAS = [
    { cat: "Maths", name: "Formule d'Euler", code: "e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)" },
    { cat: "Maths", name: "IPP", code: "\\int_a^b u'v = [uv]_a^b - \\int_a^b uv'" },
    { cat: "Maths", name: "Somme de Riemann", code: "\\lim_{n \\to \\infty} \\frac{1}{n}\\sum_{k=1}^n f(\\frac{k}{n}) = \\int_0^1 f(x)dx" },
    { cat: "Maths", name: "DL Sinus & Cosinus", code: "\\sin(x) = x - \\frac{x^3}{6} + o(x^3), \\; \\cos(x) = 1 - \\frac{x^2}{2} + o(x^2)" },
    { cat: "Physique", name: "Éq. Diff RLC", code: "\\frac{d^2u_c}{dt^2} + 2\\lambda\\frac{du_c}{dt} + \\omega_0^2 u_c = 0" },
    { cat: "Physique", name: "Période LC", code: "T_0 = 2\\pi \\sqrt{LC}" },
    { cat: "Physique", name: "Énergie Condensateur", code: "E_e = \\frac{1}{2} C u_c^2 = \\frac{1}{2} \\frac{q^2}{C}" },
    { cat: "Chimie", name: "pH Henderson", code: "pH = pK_a + \\log\\left(\\frac{[A^-]}{[AH]}\\right)" },
    { cat: "Info", name: "Complexité Quicksort", code: "T(n) = 2T(n/2) + O(n) \\implies O(n \\log n)" }
];

class FormulaScratchpad {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeMode = "board"; // "board" (drawing) or "latex"
        this.notes = localStorage.getItem("ss_scratchpad_notes") || "\\int_0^1 x^2 \\, dx = \\frac{1}{3}";

        // Drawing state
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentColor = "#D4AF37"; // StudySouk Gold
        this.currentSize = 3;
        this.currentTool = "pen"; // "pen", "highlighter", "eraser"
        this.lastX = 0;
        this.lastY = 0;

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
            <div class="flex flex-col h-full max-w-lg mx-auto space-y-3">
                
                <!-- Submode Switcher (Tableau vs LaTeX) -->
                <div class="flex items-center justify-between pb-2 border-b border-brand-borderLight">
                    <div class="flex items-center gap-1.5 p-1 rounded-xl bg-brand-darker border border-brand-border">
                        <button id="sp-tab-board" class="px-3 py-1 rounded-lg text-xs font-bold font-outfit transition ${this.activeMode === 'board' ? 'bg-brand-cherry text-brand-goldLight border border-brand-gold shadow' : 'text-brand-muted hover:text-brand-text'}">
                            <i class="fa-solid fa-paintbrush mr-1"></i> Tableau Partagé
                        </button>
                        <button id="sp-tab-latex" class="px-3 py-1 rounded-lg text-xs font-semibold font-outfit transition ${this.activeMode === 'latex' ? 'bg-brand-cherry text-brand-goldLight border border-brand-gold shadow' : 'text-brand-muted hover:text-brand-text'}">
                            <i class="fa-solid fa-square-root-variable mr-1"></i> Formules LaTeX
                        </button>
                    </div>

                    <div class="flex items-center gap-1">
                        <span id="whiteboard-sync-badge" class="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live Room
                        </span>
                    </div>
                </div>

                <!-- MODE 1: COLLABORATIVE DRAWING WHITEBOARD -->
                <div id="sp-view-board" class="${this.activeMode === 'board' ? 'block' : 'hidden'} space-y-2">
                    
                    <!-- Drawing Controls Bar -->
                    <div class="flex flex-wrap items-center justify-between gap-1.5 p-2 rounded-xl bg-brand-darker border border-brand-borderLight text-xs">
                        
                        <!-- Tools: Pen, Highlighter, Eraser -->
                        <div class="flex items-center gap-1">
                            <button id="wb-tool-pen" title="Stylo Or" class="wb-tool-btn px-2.5 py-1 rounded-md bg-brand-cherry border border-brand-gold text-brand-goldLight font-bold">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button id="wb-tool-highlighter" title="Surligneur" class="wb-tool-btn px-2.5 py-1 rounded-md bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text">
                                <i class="fa-solid fa-highlighter"></i>
                            </button>
                            <button id="wb-tool-eraser" title="Gomme" class="wb-tool-btn px-2.5 py-1 rounded-md bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text">
                                <i class="fa-solid fa-eraser"></i>
                            </button>
                        </div>

                        <!-- Color Palette -->
                        <div class="flex items-center gap-1.5">
                            ${[
                                { c: "#D4AF37", title: "Or Royal" },
                                { c: "#E63946", title: "Cerise" },
                                { c: "#4CC9F0", title: "Cyan" },
                                { c: "#2EC4B6", title: "Émeraude" },
                                { c: "#FDF7F9", title: "Craie Blanche" }
                            ].map(item => `
                                <button data-color="${item.c}" title="${item.title}" class="wb-color-btn w-5 h-5 rounded-full border ${item.c === this.currentColor ? 'border-white scale-110 shadow' : 'border-black/50'} transition" style="background-color: ${item.c};"></button>
                            `).join('')}
                        </div>

                        <!-- Stroke Size -->
                        <div class="flex items-center gap-1 text-[11px] text-brand-muted">
                            <i class="fa-solid fa-circle text-[8px] text-brand-gold"></i>
                            <input id="wb-size-slider" type="range" min="2" max="14" step="1" value="3" class="w-16">
                        </div>

                        <!-- Clear Canvas -->
                        <button id="wb-clear-btn" class="text-[11px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded bg-brand-card border border-rose-950 transition active:scale-95">
                            <i class="fa-solid fa-trash-can mr-1"></i> Nettoyer
                        </button>
                    </div>

                    <!-- Whiteboard Canvas Box -->
                    <div class="relative w-full rounded-2xl overflow-hidden border border-brand-borderLight shadow-2xl bg-[#070204]">
                        <canvas id="whiteboard-canvas" width="600" height="360" class="w-full h-72 sm:h-80 cursor-crosshair touch-none"></canvas>
                        <div class="absolute bottom-2 left-3 pointer-events-none text-[10px] text-brand-muted/60 font-mono">
                            ✍️ Dessin synchronisé en temps réel avec le salon vocal
                        </div>
                    </div>
                </div>

                <!-- MODE 2: LATEX FORMULAS & SCRATCHPAD -->
                <div id="sp-view-latex" class="${this.activeMode === 'latex' ? 'block' : 'hidden'} space-y-3">
                    
                    <!-- Math Quick Symbol Palette -->
                    <div class="flex flex-wrap gap-1 p-1.5 rounded-xl bg-brand-darker border border-brand-borderLight">
                        ${[
                            "\\int_a^b", "\\sum_{k=1}^n", "\\lim_{x \\to 0}", "\\sqrt{x}", "\\infty", "\\alpha", "\\beta", "\\theta", "\\lambda", "\\Delta", "\\frac{a}{b}", "\\vec{F}"
                        ].map(sym => `
                            <button data-sym="${sym}" class="math-sym-btn px-2 py-1 rounded-md bg-brand-card hover:bg-brand-cherry text-brand-goldLight text-[11px] font-mono border border-brand-border transition active:scale-95">
                                ${sym}
                            </button>
                        `).join('')}
                    </div>

                    <!-- Textarea Scratchpad -->
                    <div class="relative w-full">
                        <textarea id="sp-textarea" rows="3" placeholder="Tape ton expression LaTeX ici (ex: \\int_0^1 x^2 dx)..."
                            class="w-full bg-brand-darker border border-brand-borderLight rounded-xl p-3 text-xs font-mono text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold resize-none leading-relaxed shadow-inner">${this.notes}</textarea>
                        
                        <div class="flex items-center justify-between mt-1 px-1">
                            <span id="sp-save-indicator" class="text-[10px] text-emerald-400 font-mono opacity-0 transition-opacity">
                                <i class="fa-solid fa-check"></i> Sauvegardé
                            </span>
                            <button id="sp-share-room-btn" class="px-2.5 py-1 rounded-lg bg-gradient-to-r from-brand-accent to-brand-cherry text-brand-goldLight text-xs font-bold border border-brand-gold/60 shadow hover:brightness-110 active:scale-95 transition font-outfit">
                                <i class="fa-solid fa-bullhorn mr-1 text-brand-gold"></i> Partager sur le Vocal
                            </button>
                        </div>
                    </div>

                    <!-- Live KaTeX Mathematical Rendering Preview -->
                    <div class="space-y-1">
                        <span class="text-[10px] uppercase font-bold text-brand-gold font-outfit flex items-center gap-1">
                            <i class="fa-solid fa-eye"></i> Aperçu Mathématique HD (KaTeX)
                        </span>
                        <div id="sp-math-preview" class="p-3 rounded-xl glass-card border border-brand-borderLight text-center min-h-[50px] flex items-center justify-center text-brand-goldLight font-bold text-sm overflow-x-auto shadow-inner">
                            $$${this.notes}$$
                        </div>
                    </div>

                    <!-- Quick Formula Cheat Sheet -->
                    <div class="space-y-1.5 pt-1">
                        <span class="text-[11px] text-brand-muted font-bold font-outfit block">
                            Banque de Formules STEM :
                        </span>
                        <div class="space-y-1 max-h-28 overflow-y-auto pr-1">
                            ${QUICK_FORMULAS.map(f => `
                                <div class="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-borderLight flex items-center justify-between text-xs transition">
                                    <div class="truncate mr-2">
                                        <span class="text-[10px] font-bold text-brand-gold font-outfit mr-1.5">[${f.cat}] ${f.name}</span>
                                        <code class="text-[10px] text-brand-muted font-mono">${f.code}</code>
                                    </div>
                                    <div class="flex items-center gap-1 shrink-0">
                                        <button data-insert="${f.code}" class="insert-formula-btn text-brand-gold hover:text-white px-1.5 py-0.5 rounded bg-brand-darker border border-brand-border text-[10px] font-outfit font-semibold" title="Insérer">
                                            Insérer
                                        </button>
                                        <button data-copy="${f.code}" class="copy-formula-btn text-brand-muted hover:text-brand-goldLight p-1" title="Copier">
                                            <i class="fa-regular fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                </div>

            </div>
        `;

        this.bindModeSwitcher();
        this.initCanvasDrawing();
        this.bindLatexControls();
    }

    bindModeSwitcher() {
        const btnBoard = document.getElementById("sp-tab-board");
        const btnLatex = document.getElementById("sp-tab-latex");
        const viewBoard = document.getElementById("sp-view-board");
        const viewLatex = document.getElementById("sp-view-latex");

        btnBoard?.addEventListener("click", () => {
            this.activeMode = "board";
            btnBoard.className = "px-3 py-1 rounded-lg text-xs font-bold font-outfit transition bg-brand-cherry text-brand-goldLight border border-brand-gold shadow";
            btnLatex.className = "px-3 py-1 rounded-lg text-xs font-semibold font-outfit transition text-brand-muted hover:text-brand-text";
            viewBoard?.classList.remove("hidden");
            viewLatex?.classList.add("hidden");
            this.resizeCanvas();
        });

        btnLatex?.addEventListener("click", () => {
            this.activeMode = "latex";
            btnLatex.className = "px-3 py-1 rounded-lg text-xs font-bold font-outfit transition bg-brand-cherry text-brand-goldLight border border-brand-gold shadow";
            btnBoard.className = "px-3 py-1 rounded-lg text-xs font-semibold font-outfit transition text-brand-muted hover:text-brand-text";
            viewLatex?.classList.remove("hidden");
            viewBoard?.classList.add("hidden");
            this.updateLatexPreview();
        });
    }

    // --- DRAWING CANVAS ENGINE ---
    initCanvasDrawing() {
        this.canvas = document.getElementById("whiteboard-canvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();

        window.addEventListener("resize", () => this.resizeCanvas());

        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (this.canvas.width / rect.width),
                y: (clientY - rect.top) * (this.canvas.height / rect.height)
            };
        };

        const startDraw = (e) => {
            e.preventDefault();
            this.isDrawing = true;
            const pos = getPos(e);
            this.lastX = pos.x;
            this.lastY = pos.y;
        };

        const drawMove = (e) => {
            if (!this.isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);

            this.drawLine(this.lastX, this.lastY, pos.x, pos.y, this.currentColor, this.currentSize, this.currentTool);

            // Broadcast to room
            if (window.roomSync) {
                window.roomSync.sendWhiteboard("stroke", {
                    x0: Math.round(this.lastX),
                    y0: Math.round(this.lastY),
                    x1: Math.round(pos.x),
                    y1: Math.round(pos.y),
                    color: this.currentColor,
                    size: this.currentSize,
                    tool: this.currentTool
                });
            }

            this.lastX = pos.x;
            this.lastY = pos.y;
        };

        const endDraw = () => {
            this.isDrawing = false;
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
            Object.keys(toolBtns).forEach(k => {
                const b = toolBtns[k];
                if (!b) return;
                if (k === tool) {
                    b.className = "wb-tool-btn px-2.5 py-1 rounded-md bg-brand-cherry border border-brand-gold text-brand-goldLight font-bold";
                } else {
                    b.className = "wb-tool-btn px-2.5 py-1 rounded-md bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text";
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
                this.container.querySelectorAll(".wb-color-btn").forEach(b => {
                    b.classList.remove("border-white", "scale-110", "shadow");
                    b.classList.add("border-black/50");
                });
                btn.classList.add("border-white", "scale-110", "shadow");
                btn.classList.remove("border-black/50");
                selectTool("pen");
            });
        });

        // Size slider
        document.getElementById("wb-size-slider")?.addEventListener("input", (e) => {
            this.currentSize = parseInt(e.target.value, 10);
        });

        // Clear
        document.getElementById("wb-clear-btn")?.addEventListener("click", () => {
            this.clearLocalCanvas();
            if (window.roomSync) {
                window.roomSync.sendWhiteboard("clear", {});
            }
        });
    }

    resizeCanvas() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        if (rect.width > 0 && (this.canvas.width !== 600 || this.canvas.height !== 360)) {
            // Keep internal HD resolution
            this.canvas.width = 600;
            this.canvas.height = 360;
        }
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
            this.ctx.lineWidth = size * 3;
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
            this.drawLine(msg.x0, msg.y0, msg.x1, msg.y1, msg.color, msg.size, msg.tool);
        } else if (msg.action === "clear") {
            this.clearLocalCanvas();
            window.studyApp?.showToast(`🧹 Le tableau a été nettoyé par ${msg.author?.name || 'un camarade'}`);
        } else if (msg.action === "share_formula") {
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
                const pos = textarea.selectionStart;
                const text = textarea.value;
                textarea.value = text.slice(0, pos) + sym + text.slice(pos);
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = pos + sym.length;
                this.notes = textarea.value;
                localStorage.setItem("ss_scratchpad_notes", this.notes);
                this.updateLatexPreview();
            });
        });

        // Insert Formula
        this.container.querySelectorAll(".insert-formula-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const code = btn.dataset.insert;
                window.ambience?.playKeyClick();
                textarea.value = code;
                this.notes = code;
                localStorage.setItem("ss_scratchpad_notes", this.notes);
                this.updateLatexPreview();
                window.studyApp?.showToast(`✏️ Formule insérée dans l'ardoise !`);
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

        // Share Formula with Room
        document.getElementById("sp-share-room-btn")?.addEventListener("click", () => {
            const formula = textarea.value.trim();
            if (!formula) return;
            if (window.roomSync) {
                window.roomSync.sendWhiteboard("share_formula", {
                    formula: formula
                });
                window.ambience?.playSuccess();
                window.studyApp?.showToast(`🚀 Formule partagée avec le salon vocal !`);
            }
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
