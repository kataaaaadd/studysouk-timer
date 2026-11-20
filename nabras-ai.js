/**
 * StudySouk Academy — Nabras AI Chatbot (نبراس - المساعد الأكاديمي الذكي)
 * Multilingual AI Tutor (🇲🇦 Darija, 🇫🇷 Français, 🇸🇦 العربية)
 * 3 Pillars: شرح الدروس (Explain), حل وفهم التمارين (Q&A/Doubt Solving), تحفيز وتركيز (Motivation)
 */

class NabrasAI {
    constructor() {
        this.language = localStorage.getItem("ss_nabras_lang") || "fr";
        this.mode = localStorage.getItem("ss_nabras_mode") || "explain";
        this.history = this.loadHistory();
        this.isGenerating = false;

        this.PROMPT_SUGGESTIONS = {
            fr: {
                explain: [
                    "Explique-moi le théorème des valeurs intermédiaires (TVI) et son application au Bac",
                    "Comment résoudre les équations différentielles du 2nd ordre en physique RLC ?",
                    "Donne-moi une synthèse claire sur la cinétique chimique et la vitesse volumique",
                    "Quels sont les pièges classiques dans l'étude des branches infinies et asymptotes ?"
                ],
                qa: [
                    "Comment lever l'indétermination sur la limite en +inf de sqrt(x^2+1) - x ?",
                    "Aide-moi à démontrer proprement par récurrence double au Bac SM",
                    "Comment déterminer la constante d'acidité Ka à partir d'un dosage acido-basique ?",
                    "Explique-moi la méthode d'Euler pour déterminer la vitesse limite"
                ],
                motivate: [
                    "Donne-moi un boost de discipline pour valider 2 blocs de révision intense !",
                    "Comment garder une concentration absolue et vaincre la procrastination ?",
                    "Motive-moi à réussir le concours d'ingénieur CNC / CPGE !",
                    "Rappelle-moi pourquoi chaque heure de deep work forge mon avenir"
                ]
            },
            darija: {
                explain: [
                    "Chre7 lia Théorème des Valeurs Intermédiaires (TVI) w l-fayda dyalo f l-Watani",
                    "Kifach n-fhem les circuits RLC w l-équations différentielles?",
                    "Chno houwa l-farq bin la mitose w la méiose f SVT?",
                    "3tini résumé sahla 3la les intégrales w calcul d'aire"
                ],
                qa: [
                    "3ndi had l-limite m3aqda: lim (x->0) de (sin(x) - x)/x^3, kifach n-kherjha?",
                    "Kifach n-tbet anna suite géométrique convergeante?",
                    "Ma fhemtech l-méthode d'Euler f Physique, 3tini exemple",
                    "Kifach n-dir l-plan dialectique f production écrite d 1BAC?"
                ],
                motivate: [
                    "3ndi Watani qrib w 7as b l-khedma kter mn l-qeyass, motivini!",
                    "Kifach n-7areb l-taswif (procrastination) w n-focussi 100% f Pomodoro?",
                    "3tini conseil bach n-jib mention Très Bien f 2BAC",
                    "3yit mn l-Maths lyoma, 3tini boost d l-énergie bach nkemmel!"
                ]
            },
            ar: {
                explain: [
                    "اشرح لي مبرهنة القيم الوسيطية وأهم تطبيقاتها في الامتحان الوطني",
                    "كيف أفهم المعادلات التفاضلية في الدارات الكهربائية RLC؟",
                    "ما هي مراحل الانقسام الاختزالي وأهميته البيولوجية في SVT؟",
                    "أعطني ملخصاً مركزاً لحساب التكامل وحساب المساحات"
                ],
                qa: [
                    "كيف أزيل الشكل غير المحدد في حساب النهايات المثلثية؟",
                    "ساعدني في فهم خطوات البرهان بالترجع بطريقة سليمة",
                    "ما هي المنهجية المثالية لتحليل نص فلسفي في الامتحان الوطني؟",
                    "كيف أتعامل مع أسئلة الكيمياء في تفاعلات أسترة وحلمأة؟"
                ],
                motivate: [
                    "أعطني جرعة تحفيز قوية للتغلب على التعب ومواصلة المذاكرة!",
                    "كيف أنظم وقتي وأتخلص من التسويف أثناء التحضير للامتحان الوطني؟",
                    "ذكّرني بأهدافي وطموحاتي لأستعيد طاقتي للتركيز الآن",
                    "نصيحة ذهبية لنيل ميزة حسن جداً في الباكالوريا"
                ]
            }
        };

        this.WELCOME_MESSAGES = {
            fr: {
                explain: "Bienvenue sur **Nabras AI** 🦉, le tuteur académique d'élite de StudySouk Academy.\n\nEn mode **Explication de Cours**, pose-moi n'importe quelle question sur tes cours (Maths, Physique-Chimie, SVT, Informatique, SI...). Je t'expliquerai chaque notion avec rigueur, méthode et clarté mathématique.",
                qa: "Bonjour ! En mode **Résolution & Méthodes** 🦉, partage ton exercice, énoncé ou question complexe. Nous décortiquerons la démarche pas à pas sans sauter d'étapes.",
                motivate: "Prêt à conquérir ta session ? En mode **Motivation & Focus** 🦉, je suis là pour booster ton moral, vaincre la procrastination et t'accompagner vers l'excellence aux concours et au Bac !"
            },
            darija: {
                explain: "Marhba bik m3aya! Ana **Nabras (نبراس)**، l-Assistant d l-AI w l-Boma d StudySouk Academy 🦉.\n\nF had l-mode d **شرح الدروس**، goli ay dars wla concept ma wadhech lik (Maths, PC, SVT, Philo...), w ghadi nchre7houlik b Darija sahla, b amthila w b les astuces d l-mtihanat!",
                qa: "Salam! Ana **Nabras** 🦉. F had l-mode d **حل وفهم التمارين**، 3tini l-exercice wla l-point li 7siti fih b l-blocage, w ghadi n-khedmouh m3a b3diyatna étape par étape!",
                motivate: "Marhba l-batal! Ana **Nabras** 🦉. Had l-mode dial **التحفيز والتركيز** kayn bach y-3tik énergie ijabiya, y-fekrek b l-ahdaf dyalk, w y-khellik t-focussi f had l-Pomodoro b toute discipline!"
            },
            ar: {
                explain: "مرحباً بك! أنا **نبراس (Nabras)**، المساعد الأكاديمي الذكي لمنصة StudySouk Academy 🦉.\n\nفي نمط **شرح الدروس**، اطلب أي درس أو نظرية أو مفهوم غامض في مقررك، وسأشرحه لك بأسلوب تربوي ميسّر ودقيق علمياً.",
                qa: "أهلاً بك! في نمط **حل وفهم التمارين** 🦉، اطرح تساؤلك أو مسألتك العلمية وسنعمل معاً على حلها وتوضيح خطوات التفكير السليم للوصول إلى الحل.",
                motivate: "أهلاً ببطل المستقبل! في نمط **التحفيز والتركيز** 🦉، أنا هنا لأشحذ همتك وأدعمك بالطاقة الإيجابية والانضباط لإنجاز جلسات المذاكرة المركزة بنجاح وتفوق!"
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderLanguageChips();
        this.renderModeChips();
        this.renderSuggestions();
        this.renderChatMessages();

        // Connect quick floating Nabras trigger if present
        document.getElementById("btn-floating-nabras")?.addEventListener("click", () => {
            window.ambience?.playClick();
            window.app?.switchTab("tab-nabras");
        });

        document.getElementById("btn-open-nabras-ai")?.addEventListener("click", () => {
            window.ambience?.playClick();
            window.app?.switchTab("tab-nabras");
        });

        document.getElementById("btn-mobile-nabras-action")?.addEventListener("click", () => {
            window.ambience?.playClick();
            document.getElementById("mobile-actions-menu")?.classList.add("hidden");
            window.app?.switchTab("tab-nabras");
        });
    }

    bindEvents() {
        // Send button
        const sendBtn = document.getElementById("nabras-send-btn");
        const inputEl = document.getElementById("nabras-chat-input");

        sendBtn?.addEventListener("click", () => this.handleSend());

        inputEl?.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Auto-expand textarea
        inputEl?.addEventListener("input", () => {
            inputEl.style.height = "auto";
            inputEl.style.height = `${Math.min(inputEl.scrollHeight, 120)}px`;
        });

        // Clear chat button
        document.getElementById("nabras-clear-btn")?.addEventListener("click", () => {
            if (confirm(this.language === "ar" ? "هل تريد حقاً مسح سجل المحادثة؟" : (this.language === "fr" ? "Voulez-vous vraiment effacer l'historique du chat ?" : "Wesh bssah bghiti t-mseh had l-chat?"))) {
                this.history = [];
                this.saveHistory();
                this.renderChatMessages();
                window.ambience?.playClick();
            }
        });

        // Language Buttons
        document.querySelectorAll(".nabras-lang-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const lang = btn.dataset.lang;
                if (lang && lang !== this.language) {
                    window.ambience?.playClick();
                    this.setLanguage(lang);
                }
            });
        });

        // Mode Buttons
        document.querySelectorAll(".nabras-mode-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const mode = btn.dataset.mode;
                if (mode && mode !== this.mode) {
                    window.ambience?.playClick();
                    this.setMode(mode);
                }
            });
        });
    }

    setLanguage(lang) {
        this.language = lang;
        localStorage.setItem("ss_nabras_lang", lang);
        this.renderLanguageChips();
        this.renderSuggestions();
        this.updateInputPlaceholder();

        // If no user messages yet, update welcome message
        if (this.history.length === 0) {
            this.renderChatMessages();
        }
    }

    setMode(mode) {
        this.mode = mode;
        localStorage.setItem("ss_nabras_mode", mode);
        this.renderModeChips();
        this.renderSuggestions();
        this.updateModeBanner();

        // If no user messages yet, update welcome message
        if (this.history.length === 0) {
            this.renderChatMessages();
        }
    }

    renderLanguageChips() {
        document.querySelectorAll(".nabras-lang-btn").forEach((btn) => {
            const isSelected = btn.dataset.lang === this.language;
            if (isSelected) {
                btn.className = "nabras-lang-btn px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-brand-cherry text-brand-goldLight border border-brand-gold shadow-md";
            } else {
                btn.className = "nabras-lang-btn px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 glass-card border border-brand-borderSubtle text-brand-muted hover:text-white";
            }
        });
    }

    renderModeChips() {
        document.querySelectorAll(".nabras-mode-btn").forEach((btn) => {
            const isSelected = btn.dataset.mode === this.mode;
            if (isSelected) {
                btn.className = "nabras-mode-btn px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-brand-gold/20 text-brand-goldLight border border-brand-gold shadow-md";
            } else {
                btn.className = "nabras-mode-btn px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 glass-card border border-brand-borderSubtle text-brand-muted hover:text-white";
            }
        });
    }

    updateModeBanner() {
        const bannerText = document.getElementById("nabras-mode-banner-text");
        if (!bannerText) return;

        const descriptions = {
            fr: {
                explain: "📚 Mode : Explication des cours et notions clés (Démarche rigoureuse, définitions & astuces)",
                qa: "💡 Mode : Résolution méthodique d'exercices & déblocage des doutes",
                motivate: "⚡ Mode : Motivation intense, discipline d'étude & gestion du stress"
            },
            darija: {
                explain: "📚 Mode: شرح الدروس والمفاهيم (Maths, PC, SVT, Philo) بأسلوب دارجة ذكي ومبسط",
                qa: "💡 Mode: حل وفهم التمارين (إزالة الغموض وشرح الخطوات خطوة بخطوة)",
                motivate: "⚡ Mode: التحفيز والطاقة الإيجابية للتركيز ومحاربة التسويف"
            },
            ar: {
                explain: "📚 النمط: شرح الدروس والمفاهيم العلمية بطريقة تربوية دقيقة وميسرة",
                qa: "💡 النمط: حل التمارين والإجابة عن الاستفسارات خطوة بخطوة",
                motivate: "⚡ النمط: شحذ الهمم، بث الطاقة الإيجابية والانضباط لمواصلة المذاكرة"
            }
        };

        bannerText.textContent = descriptions[this.language]?.[this.mode] || descriptions.fr.explain;
    }

    updateInputPlaceholder() {
        const inputEl = document.getElementById("nabras-chat-input");
        if (!inputEl) return;

        const placeholders = {
            fr: "Pose une question sur un cours, un exercice, ou demande un boost de motivation...",
            darija: "Sawel Nabras f ay dars, exercice, wla tleb motivation...",
            ar: "اطرح سؤالك حول أي درس، تمرين، أو اطلب جرعة تحفيز..."
        };

        inputEl.placeholder = placeholders[this.language] || placeholders.fr;
    }

    renderSuggestions() {
        const container = document.getElementById("nabras-suggestions-container");
        if (!container) return;

        const suggestions = this.PROMPT_SUGGESTIONS[this.language]?.[this.mode] || this.PROMPT_SUGGESTIONS.fr.explain;

        container.innerHTML = suggestions.map((prompt) => `
            <button class="nabras-prompt-chip px-3 py-1.5 rounded-xl glass-card border border-brand-borderSubtle hover:border-brand-gold text-brand-muted hover:text-white text-[11px] font-outfit text-left truncate transition active:scale-95 flex items-center gap-1.5 group shrink-0">
                <i class="fa-solid fa-arrow-turn-down text-[9px] text-brand-gold group-hover:translate-x-0.5 transition-transform"></i>
                <span class="truncate">${this.escapeHtml(prompt)}</span>
            </button>
        `).join("");

        container.querySelectorAll(".nabras-prompt-chip").forEach((chip, idx) => {
            chip.addEventListener("click", () => {
                const prompt = suggestions[idx];
                if (prompt) {
                    window.ambience?.playClick();
                    const inputEl = document.getElementById("nabras-chat-input");
                    if (inputEl) {
                        inputEl.value = prompt;
                        this.handleSend();
                    }
                }
            });
        });
    }

    loadHistory() {
        try {
            const raw = localStorage.getItem("ss_nabras_chat_history");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    saveHistory() {
        try {
            // Keep last 30 messages in storage
            const trimmed = this.history.slice(-30);
            localStorage.setItem("ss_nabras_chat_history", JSON.stringify(trimmed));
        } catch (e) {
            console.warn("[Nabras AI] Save history error:", e);
        }
    }

    renderChatMessages() {
        const feed = document.getElementById("nabras-chat-feed");
        if (!feed) return;

        if (this.history.length === 0) {
            const welcomeText = this.WELCOME_MESSAGES[this.language]?.[this.mode] || this.WELCOME_MESSAGES.darija.explain;
            feed.innerHTML = `
                <div class="flex items-start gap-3 my-2 animate-fadeIn max-w-2xl">
                    <div class="w-9 h-9 rounded-2xl bg-brand-darker border border-brand-gold flex items-center justify-center text-brand-gold shrink-0 shadow-lg p-1">
                        <img src="assets/designs/studysouk_logo_clean_cutout.png" alt="Nabras" class="w-full h-full object-contain filter drop-shadow">
                    </div>
                    <div class="flex-1 glass-panel border border-brand-gold/40 rounded-2xl rounded-tl-sm p-3.5 shadow-md text-xs text-white leading-relaxed font-outfit">
                        <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-brand-borderSubtle">
                            <span class="font-black text-brand-goldLight text-[11px] flex items-center gap-1.5">
                                <i class="fa-solid fa-wand-magic-sparkles text-[10px] text-brand-gold"></i>
                                Nabras AI • نبراس
                            </span>
                            <span class="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> En ligne
                            </span>
                        </div>
                        <div class="prose-chat whitespace-pre-line">${this.formatMarkdown(welcomeText)}</div>
                    </div>
                </div>
            `;
            return;
        }

        feed.innerHTML = this.history.map((msg, idx) => {
            const isUser = msg.role === "user";
            return `
                <div class="flex items-start gap-2.5 sm:gap-3 my-2.5 ${isUser ? 'flex-row-reverse self-end ml-auto' : 'self-start mr-auto'} max-w-[88%] sm:max-w-2xl animate-fadeIn">
                    <div class="w-8 h-8 rounded-2xl ${isUser ? 'bg-brand-cherry border border-brand-gold/60' : 'bg-brand-darker border border-brand-gold'} flex items-center justify-center text-xs shrink-0 shadow-md p-1">
                        ${isUser ? '<i class="fa-solid fa-graduation-cap text-brand-goldLight"></i>' : '<img src="assets/designs/studysouk_logo_clean_cutout.png" alt="Nabras" class="w-full h-full object-contain">'}
                    </div>
                    <div class="flex-1 ${isUser ? 'bg-gradient-to-br from-brand-cherryDark to-brand-cherry border border-brand-gold/60 text-white rounded-2xl rounded-tr-sm' : 'glass-panel border border-brand-gold/30 text-white rounded-2xl rounded-tl-sm'} p-3 sm:p-3.5 shadow-lg text-xs leading-relaxed font-outfit relative group">
                        <div class="flex items-center justify-between pb-1 mb-1.5 border-b ${isUser ? 'border-white/10' : 'border-brand-borderSubtle'}">
                            <span class="font-black ${isUser ? 'text-white' : 'text-brand-goldLight'} text-[11px] flex items-center gap-1">
                                ${isUser ? 'Toi (Étudiant)' : '<i class="fa-solid fa-wand-magic-sparkles text-[10px] text-brand-gold"></i> Nabras AI'}
                            </span>
                            <span class="text-[9px] font-mono text-brand-muted">
                                ${msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                        </div>
                        <div class="prose-chat whitespace-pre-wrap">${this.formatMarkdown(msg.text)}</div>
                        ${!isUser ? `
                            <button data-idx="${idx}" class="nabras-copy-btn opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-brand-darker border border-brand-gold/40 text-brand-goldLight hover:bg-brand-cherry flex items-center gap-1 shadow-sm">
                                <i class="fa-solid fa-copy text-[8px]"></i> Copier
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join("");

        // Attach copy buttons
        feed.querySelectorAll(".nabras-copy-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const idx = Number(btn.dataset.idx);
                const msg = this.history[idx];
                if (msg && msg.text) {
                    navigator.clipboard.writeText(msg.text);
                    btn.innerHTML = `<i class="fa-solid fa-check text-[8px] text-emerald-400"></i> Copié !`;
                    setTimeout(() => {
                        btn.innerHTML = `<i class="fa-solid fa-copy text-[8px]"></i> Copier`;
                    }, 2000);
                }
            });
        });

        this.scrollToBottom();
    }

    async handleSend() {
        if (this.isGenerating) return;

        const inputEl = document.getElementById("nabras-chat-input");
        const text = inputEl?.value?.trim();
        if (!text) return;

        // Clear input & reset height
        inputEl.value = "";
        inputEl.style.height = "auto";

        window.ambience?.playClick();

        // 1. Add user message
        const userMsg = {
            role: "user",
            text,
            timestamp: Date.now()
        };
        this.history.push(userMsg);
        this.saveHistory();
        this.renderChatMessages();

        // 2. Show thinking indicator
        this.isGenerating = true;
        this.showThinkingIndicator();

        try {
            const endpoint = window.location.pathname.startsWith("/.proxy") ? "/.proxy/api/ai/chat" : "/api/ai/chat";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    language: this.language,
                    mode: this.mode,
                    history: this.history.slice(-6)
                })
            });

            const data = await response.json();
            this.hideThinkingIndicator();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || "Erreur de réponse");
            }

            const botReply = data.reply || "";
            const botMsg = {
                role: "assistant",
                text: botReply,
                timestamp: Date.now()
            };
            this.history.push(botMsg);
            this.saveHistory();
            this.renderChatMessages();

        } catch (err) {
            console.error("[Nabras AI] Generation error:", err);
            this.hideThinkingIndicator();

            const fallbackReply = this.getFallbackReply(text);
            const botMsg = {
                role: "assistant",
                text: fallbackReply,
                timestamp: Date.now()
            };
            this.history.push(botMsg);
            this.saveHistory();
            this.renderChatMessages();
        } finally {
            this.isGenerating = false;
        }
    }

    showThinkingIndicator() {
        const feed = document.getElementById("nabras-chat-feed");
        if (!feed) return;

        const thinkingDiv = document.createElement("div");
        thinkingDiv.id = "nabras-thinking-bubble";
        thinkingDiv.className = "flex items-start gap-3 my-2.5 max-w-xl animate-fadeIn";
        thinkingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-2xl bg-brand-darker border border-brand-gold flex items-center justify-center text-xs shrink-0 shadow-md p-1 animate-pulse">
                <img src="assets/designs/studysouk_logo_clean_cutout.png" alt="Nabras" class="w-full h-full object-contain">
            </div>
            <div class="glass-panel border border-brand-gold/40 rounded-2xl rounded-tl-sm p-3 shadow-md text-xs text-white flex items-center gap-2 font-outfit">
                <i class="fa-solid fa-wand-magic-sparkles text-brand-gold animate-spin"></i>
                <span class="text-brand-goldLight font-bold">Nabras réfléchit à la solution...</span>
                <span class="flex items-center gap-1 ml-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce [animation-delay:0.2s]"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce [animation-delay:0.4s]"></span>
                </span>
            </div>
        `;
        feed.appendChild(thinkingDiv);
        this.scrollToBottom();
    }

    hideThinkingIndicator() {
        document.getElementById("nabras-thinking-bubble")?.remove();
    }

    scrollToBottom() {
        const feed = document.getElementById("nabras-chat-feed");
        if (feed) {
            feed.scrollTop = feed.scrollHeight;
        }
    }

    onTabVisible() {
        this.renderChatMessages();
        this.renderSuggestions();
        this.updateModeBanner();
        this.updateInputPlaceholder();
        const inputEl = document.getElementById("nabras-chat-input");
        setTimeout(() => inputEl?.focus(), 150);
    }

    formatMarkdown(text) {
        if (!text) return "";

        let safe = this.escapeHtml(text);

        // 1. Math block: $$...$$
        safe = safe.replace(/\$\$([\s\S]*?)\$\$/g, (_match, math) => {
            return `<div class="my-2 p-2 rounded-xl bg-brand-darker/80 border border-brand-gold/40 text-center font-mono text-brand-goldLight overflow-x-auto shadow-inner text-[11px] sm:text-xs">$$ ${math.trim()} $$</div>`;
        });

        // 2. Math inline: $...$
        safe = safe.replace(/\$([^\$\n]+)\$/g, (_match, math) => {
            return `<code class="px-1.5 py-0.5 rounded bg-brand-darker border border-brand-gold/30 text-brand-goldLight font-mono text-[10px] sm:text-[11px] font-bold">$${math}$</code>`;
        });

        // 3. Bold: **text**
        safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-brand-goldLight">$1</strong>');

        // 4. Italic: *text*
        safe = safe.replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>');

        // 5. Code blocks: ```...```
        safe = safe.replace(/```([a-z]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
            return `<pre class="my-2 p-2.5 rounded-xl bg-black/80 border border-brand-borderSubtle text-brand-goldLight font-mono text-[10px] sm:text-xs overflow-x-auto"><code>${code.trim()}</code></pre>`;
        });

        // 6. Inline code: `...`
        safe = safe.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/50 text-brand-goldLight font-mono text-[10px] border border-brand-borderSubtle">$1</code>');

        // 7. Bullet lists: "- " or "* "
        safe = safe.replace(/^[\s]*[-*]\s+(.*)$/gm, '<li class="ml-4 list-disc text-slate-200">$1</li>');

        return safe;
    }

    escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    getFallbackReply(userQuery) {
        if (this.language === "fr") {
            return `Je suis ravi de t'aider sur cette question !\n\nConcernant "${userQuery}" :\n1. **Approche méthodique** : Identifie toujours les hypothèses données dans l'énoncé et la conclusion visée.\n2. **Rigueur de rédaction** : Dans le système marocain (Bac / CPGE), la clarté des étapes et la justification par les théorèmes fondamentaux rapportent l'essentiel des points.\n3. **Action** : Fais une session Pomodoro de 25 minutes concentré sur cet exercice, et valide ton résultat !\n\nTu es capable de tout réussir, garde le cap ! 🎓`;
        } else if (this.language === "ar") {
            return `يسعدني جداً مساعدتك في دراستك!\n\nبخصوص "${userQuery}" :\n1. **المنهجية السليمة**: حدد دائماً المعطيات والمكتسبات السابقة، ثم اربطها بالمطلوب خطوة بخطوة.\n2. **الدقة العلمية**: احرص على ذكر الشروط الرياضية والعلمية وتبرير كل خطوة، فذلك يضمن لك النقطة الكاملة في الامتحان الوطني ومباريات ولوج المدارس العليا.\n3. **التطبيق**: خصص جلسة عمل عميق الآن لحل تطبيق مباشر وترسيخ الفكرة!\n\nاستمر في الاجتهاد، فالمثابرة هي سر النجاح والتفوق! 🦉✨`;
        } else {
            return `3la slamtek! B khossouss "${userQuery}" :\n1. **L-Fikra l-Asasiya**: Dima 3zel les données dyalk f werqa d l-brouillon, w chouf chmen théorème wla règle li ghadi t-weslek l l-jawab direct.\n2. **Rigueur f l-khdma**: F l-imti7an l-watani w les concours, l-fasil w l-khatte nqi w t3lil d les étapes houma li kayjibou l-points.\n3. **Zid kheddem**: Khellik m-focussi f had l-Pomodoro w ma t-zgelch had l-forsa bach t-fhem had l-concept 100%!\n\nNta qedder 3liha, ghadi t-jibouha incha'Allah! 🚀🦉`;
        }
    }
}

// Global initialization
window.NabrasAI = NabrasAI;
