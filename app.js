/**
 * StudySouk Academy — Master Application Controller
 * High-End Academic Architecture for CPGE & 2BAC STEM Excellence.
 * 100% Original StudySouk Identity with Realtime Voice Channel Sync.
 */

const CLIENT_ID = '1572928085362479104';

const STUDY_QUOTES = [
    { quote: "In Mathematics, the mind resolves during the pause that follows intense effort.", author: "Henri Poincaré" },
    { quote: "Le génie n'est qu'une plus grande aptitude à la patience.", author: "Buffon" },
    { quote: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.", author: "Sénèque" },
    { quote: "La simplicité est la sophistication suprême.", author: "Léonard de Vinci" },
    { quote: "En prépa comme au concours, la régularité et la rigueur surclassent toujours l'improvisation.", author: "StudySouk Academy" }
];

const AVATAR_PRESETS = [
    { name: "StudySouk Royal", url: "assets/avatars/official_crest.png" },
    { name: "Faucon d'Élite", url: "assets/avatars/falcon_crest.jpg" },
    { name: "Major CNC CPGE", url: "assets/avatars/major_cnc.png" },
    { name: "Érudit d'Élite", url: "assets/avatars/elite_scholar.png" },
    { name: "Olympiades STEM", url: "assets/avatars/olympiad.png" },
    { name: "Podium d'Or", url: "assets/avatars/podium_gold.png" },
    { name: "Al-Khwarizmi", url: "assets/avatars/khwarizmi.svg" },
    { name: "Ibn Sina", url: "assets/avatars/ibnsina.svg" },
    { name: "Euler", url: "assets/avatars/euler.svg" },
    { name: "Poincaré", url: "assets/avatars/poincare.svg" },
    { name: "Marie Curie", url: "assets/avatars/mariecurie.svg" },
    { name: "Ada Lovelace", url: "assets/avatars/adalovelace.svg" },
    { name: "Alan Turing", url: "assets/avatars/turing.svg" },
    { name: "Ramanujan", url: "assets/avatars/ramanujan.svg" },
    { name: "Hypatia", url: "assets/avatars/hypatia.svg" },
    { name: "Khwanss SM", url: "assets/avatars/khwanss.svg" },
    { name: "Major STEM", url: "assets/avatars/majorstem.svg" },
    { name: "Nabras Owl", url: "assets/avatars/default.svg" }
];

class StudySoukTimerApp {
    constructor() {
        window.studyApp = this;
        window.app = this;
        this.discordUser = null;
        this.isInDiscord = false;
        this.sdk = null;
        this.sync = null;

        // Timer Modes
        this.modes = {
            focus25: { label: "25m Focus", duration: 25 * 60, type: "focus" },
            focus50: { label: "50m Deep Work", duration: 50 * 60, type: "focus" },
            focus90: { label: "90m Épreuve", duration: 90 * 60, type: "focus" },
            break5: { label: "5m Pause", duration: 5 * 60, type: "break" },
            break15: { label: "15m Longue", duration: 15 * 60, type: "break" }
        };
        this.currentModeKey = "focus25";
        this.currentSubject = localStorage.getItem("ss_active_subject") || "Maths: Analyse";
        this.timeLeft = this.modes[this.currentModeKey].duration;
        this.totalDuration = this.timeLeft;
        this.isRunning = false;
        this.timerInterval = null;
        this.sessionsCompleted = parseInt(localStorage.getItem("ss_timer_sessions") || "0", 10);
        this.totalFocusMinutes = parseInt(localStorage.getItem("ss_timer_minutes") || "0", 10);
        this.ticTacEnabled = localStorage.getItem("ss_tictac_enabled") !== "false";

        // Academic Modules
        this.canvas = null;
        this.reactions = null;
        this.levelSystem = null;
        this.duel = null;
        this.flashcards = null;
        this.scratchpad = null;

        // Tasks & Objectives
        this.tasks = JSON.parse(localStorage.getItem("ss_timer_tasks") || "[]");

        // STEM Dashboard & Analytics
        this.subjectMinutes = JSON.parse(localStorage.getItem("ss_subject_minutes") || '{"Maths":0,"Physique":0,"Chimie":0,"Info":0}');
        this.focusHistory = JSON.parse(localStorage.getItem("ss_focus_history") || '[]');
        this.activeTaskFilter = "all";

        // Table d'Étude Virtuelle & Duo Focus Pact
        this.activePact = null;
        this.pendingPactInvite = null;
    }

    async init() {
        // 0. Init Realtime Sync Engine
        if (window.RoomSyncEngine) {
            this.sync = new window.RoomSyncEngine();
            window.roomSync = this.sync;
        }

        // 1. Init Ambient Particle Canvas
        if (window.AmbientCanvas) {
            this.canvas = new window.AmbientCanvas("ambient-canvas");
            const savedTheme = localStorage.getItem("ss_active_theme") || "cherry";
            if (this.canvas.setTheme) {
                this.canvas.setTheme(savedTheme);
            }
            if (savedTheme === "owl") {
                document.body.classList.add("theme-owl");
            }
            const targetBtn = document.querySelector(`[data-canvas-theme="${savedTheme}"]`);
            if (targetBtn) {
                document.querySelectorAll(".canvas-theme-btn").forEach(b => {
                    b.classList.remove("bg-brand-cherry", "border-brand-gold", "text-brand-goldLight", "shadow");
                    b.classList.add("glass-card", "border-brand-borderSubtle", "text-brand-muted");
                });
                targetBtn.classList.add("bg-brand-cherry", "border-brand-gold", "text-brand-goldLight", "shadow");
                targetBtn.classList.remove("glass-card", "border-brand-borderSubtle", "text-brand-muted");
            }
        }

        // 2. Init Academic Level & XP System
        if (window.LevelSystem) {
            this.levelSystem = new window.LevelSystem("user-level-badge");
            window.levelSystem = this.levelSystem;
        }

        // 3. Init Floating Room Reactions
        if (window.ReactionsEngine) {
            this.reactions = new window.ReactionsEngine("reactions-container");
        }

        // 4. Init Flashcards, Scratchpad & STEM Duel (Safely Isolated)
        try {
            if (window.FlashcardViewer) {
                this.flashcards = new window.FlashcardViewer("flashcards-container");
                this.flashcards.render();
            }
        } catch (e) {
            console.error("[StudySouk] Flashcards initialization warning:", e);
        }

        try {
            if (window.FormulaScratchpad) {
                this.scratchpad = new window.FormulaScratchpad("scratchpad-container");
                this.scratchpad.render();
            }
        } catch (e) {
            console.error("[StudySouk] Scratchpad initialization warning:", e);
        }

        try {
            if (window.DuelArena) {
                this.duel = new window.DuelArena("duel-container");
                this.duel.render();
            }
        } catch (e) {
            console.error("[StudySouk] Duel initialization warning:", e);
        }

        // 5. Connect Discord SDK & Identity
        try {
            await this.initDiscordSDK();
        } catch (e) {
            console.warn("[StudySouk] Discord SDK connection fallback:", e);
        }

        // 6. Bind Listeners & Controls
        this.bindNavigation();
        this.bindZenMode();
        this.bindKeyboardShortcuts();
        this.bindSubjectSelector();
        this.bindTimerControls();
        this.bindAmbienceControls();
        this.bindRadioControls();
        this.bindChronoLoFiControls();
        this.bindTaskControls();
        this.bindDashboardControls();
        this.bindModals();
        this.bindDeskControls();
        this.initMultiplayerTimerSync();

        this.bindLiveMoroccoClock();
        this.updateTicTacUI();
        this.renderSubjectLabels();
        this.startCountdownHub();
        this.updateTimerDisplay();
        this.renderCycleDots();
        this.renderTasks();
        this.renderDashboard();
        this.renderStats();
        this.renderVirtualStudyDesk([]);
        this.rotateQuote();
        this.bindDraggableWidgets();

        if (window.NabrasAI) {
            this.nabrasAI = new window.NabrasAI();
            window.nabrasAI = this.nabrasAI;
        }

        // Check if a specific tab was requested via ?tab= or #
        const urlParams = new URLSearchParams(window.location.search);
        const requestedTab = urlParams.get("tab") || window.location.hash.replace("#", "");
        if (requestedTab && document.getElementById(requestedTab)) {
            this.switchTab(requestedTab);
        }

        console.log("%c[StudySouk Academy] Official Academic Activity Ready! 🎓", "color: #E2E8F0; font-weight: bold; font-size: 13px;");
    }

    // --- CONCOURS COUNTDOWN HUB (RIGHT FLANK SIDEBAR & GOAL STATION) ---
    startCountdownHub() {
        this.targetExamKey = localStorage.getItem("ss_target_exam") || "bac";

        const EXAMS = {
            bac: {
                id: "bac",
                category: "2bac",
                name: "Examen National 2BAC (Watani 2026)",
                badge: "Watani 2BAC",
                icon: "🎯",
                filieres: "SM-A, SM-B, PC, SVT, STE, STM, Éco",
                dateText: "1, 2, 3 Juin",
                month: 6, day: 1, hour: 7, min: 0,
                desc: "L'épreuve décisive comptant pour 75% du Baccalauréat marocain.",
                advices: [
                    "Priorité absolue à la résolution des examens nationaux de 2018 à 2025 sous chronomètre réel !",
                    "La rigueur de rédaction mathématique rapporte jusqu'à 30% des points au Bac SM/PC.",
                    "En Physique-Chimie, maîtrisez la méthode d'Euler, la RLC et les dosages acido-basiques."
                ]
            },
            cnc: {
                id: "cnc",
                category: "cpge",
                name: "Concours National Commun (CNC CPGE)",
                badge: "CNC CPGE",
                icon: "🏛️",
                filieres: "Classes Prépas MP, PSI, TSI, BCPST",
                dateText: "14 au 20 Mai",
                month: 5, day: 14, hour: 7, min: 0,
                desc: "Porte d'entrée des Grandes Écoles d'Ingénieurs marocaines (EHTP, EMI, ENSIAS, INPT, Mines...).",
                advices: [
                    "Visez les questions faciles et classiques du début de problème pour sécuriser l'admissibilité.",
                    "Chaque minute compte au CNC. Entraînez-vous à poser les intégrales et matrices sans hésitation.",
                    "Le Major CNC se démarque par sa clarté et sa propreté de copie."
                ]
            },
            medecine: {
                id: "medecine",
                category: "concours",
                name: "Concours Médecine & Pharmacie (FMP/FMD)",
                badge: "FMP / FMD 2026",
                icon: "🩺",
                filieres: "Facultés de Médecine, Dentaire & Pharmacie",
                dateText: "15 Juillet",
                month: 7, day: 15, hour: 7, min: 0,
                desc: "QCM d'accès aux Facultés de Médecine et de Pharmacie du Royaume (Casablanca, Rabat, Fès...).",
                advices: [
                    "La vitesse de résolution des QCM de SVT et Chimie organique fera toute la différence !",
                    "Entraînez-vous aux QCM chronométrés et à la gestion stricte du temps (40 min par épreuve)."
                ]
            },
            ensa: {
                id: "ensa",
                category: "concours",
                name: "Concours Écoles d'Ingénieurs (ENSA / ENSAM)",
                badge: "ENSA & ENSAM",
                icon: "⚙️",
                filieres: "Réseau ENSA Maroc & ENSAM Meknès / Casablanca",
                dateText: "20 Juillet",
                month: 7, day: 20, hour: 7, min: 0,
                desc: "Concours unifié d'ingénierie post-bac (Mathématiques & Physique-Chimie).",
                advices: [
                    "Revenez sur les QCM de calcul mental, les limites trigonométriques et les circuits RLC.",
                    "Résolvez au minimum les 5 derniers sujets d'accès ENSA et ENSAM."
                ]
            },
            regio: {
                id: "regio",
                category: "2bac",
                name: "Examen Régional 1BAC",
                badge: "Régional 1BAC",
                icon: "📝",
                filieres: "Français, Éduc Islamique, Histoire-Géo, Arabe",
                dateText: "28, 29 Mai",
                month: 5, day: 28, hour: 7, min: 0,
                desc: "Pèse 25% de la moyenne générale du Baccalauréat.",
                advices: [
                    "L'Examen Régional pèse 25% de votre note finale du Bac : assurez une mention dès maintenant !",
                    "Relisez les œuvres (Le Dernier Jour, Antigone, La Boîte à Merveilles) avec leurs axes thématiques.",
                    "En production écrite, soignez le plan dialectique et les connecteurs logiques."
                ]
            },
            fr: {
                id: "fr",
                category: "cpge",
                name: "Concours Français CPGE",
                badge: "Mines / Centrale / X",
                icon: "🇫🇷",
                filieres: "Mines-Ponts, Centrale-Supélec, CCINP, X-ENS",
                dateText: "19 Avril au 7 Mai",
                month: 4, day: 19, hour: 7, min: 0,
                desc: "Écrits des Grandes Écoles d'Ingénieurs françaises pour les taupins CPGE.",
                advices: [
                    "Les écrits des concours français exigent une analyse pointue des hypothèses des théorèmes.",
                    "Ne bloquez jamais sur une question : sautez et avancez sur les questions indépendantes."
                ]
            },
            fac: {
                id: "fac",
                category: "univ",
                name: "Examens Universitaires (Session Normale & Rattrapage)",
                badge: "Facultés S1/S2",
                icon: "🎓",
                filieres: "FST, FS, ENCG, EST, Facultés",
                dateText: "11 Janvier & 5 Juin",
                month: 1, day: 11, hour: 7, min: 30,
                desc: "Validation des modules universitaires avec mention dès la Session Normale.",
                advices: [
                    "Validez vos modules dès la Session Normale pour aborder les semestres avec sérénité et sans rattrapage !"
                ]
            }
        };

        this.EXAMS = EXAMS;
        window.EXAMS = EXAMS;

        const getNextExamDate = (month, day, hour = 7, min = 0) => {
            const now = new Date();
            const currentUtcYear = now.getUTCFullYear();
            const examUtcThisYear = new Date(Date.UTC(currentUtcYear, month - 1, day, hour, min, 0));
            if (now.getTime() > examUtcThisYear.getTime()) {
                return new Date(Date.UTC(currentUtcYear + 1, month - 1, day, hour, min, 0));
            }
            return examUtcThisYear;
        };

        const updateCountdowns = () => {
            const now = new Date();

            // 1. Update Hero Exam Card
            const heroConfig = EXAMS[this.targetExamKey] || EXAMS.bac;
            const heroDate = getNextExamDate(heroConfig.month, heroConfig.day, heroConfig.hour, heroConfig.min);
            const diffMs = heroDate.getTime() - now.getTime();

            const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const elHeroBadge = document.getElementById("hero-cd-badge");
            const elHeroDateText = document.getElementById("hero-cd-datetext");
            const elHeroTitle = document.getElementById("hero-cd-title");
            const elHeroFilieres = document.getElementById("hero-cd-filieres");
            const elDays = document.getElementById("hero-cd-days");
            const elHours = document.getElementById("hero-cd-hours");
            const elMins = document.getElementById("hero-cd-mins");
            const elSecs = document.getElementById("hero-cd-secs");

            if (elHeroBadge) elHeroBadge.textContent = heroConfig.badge;
            if (elHeroDateText) elHeroDateText.textContent = heroConfig.dateText;
            if (elHeroTitle) elHeroTitle.textContent = heroConfig.name;
            if (elHeroFilieres) elHeroFilieres.textContent = heroConfig.filieres;
            if (elDays) elDays.textContent = days;
            if (elHours) elHours.textContent = String(hours).padStart(2, "0");
            if (elMins) elMins.textContent = String(minutes).padStart(2, "0");
            if (elSecs) elSecs.textContent = String(seconds).padStart(2, "0");

            // Modal Hero Card Elements
            const modalBadge = document.getElementById("modal-hero-badge");
            const modalDateText = document.getElementById("modal-hero-datetext");
            const modalTitle = document.getElementById("modal-hero-title");
            const modalFilieres = document.getElementById("modal-hero-filieres");
            const modalDays = document.getElementById("modal-hero-days");
            const modalHours = document.getElementById("modal-hero-hours");
            const modalMins = document.getElementById("modal-hero-mins");
            const modalSecs = document.getElementById("modal-hero-secs");
            const modalProgPct = document.getElementById("modal-hero-progress-pct");
            const modalProgBar = document.getElementById("modal-hero-progress-bar");
            const modalTip = document.getElementById("modal-hero-tip");

            // School year progress (Assuming school year started Sept 1)
            const schoolYearStartYear = (now.getUTCMonth() >= 8) ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
            const schoolYearStart = new Date(Date.UTC(schoolYearStartYear, 8, 1));
            const totalDuration = heroDate.getTime() - schoolYearStart.getTime();
            const elapsed = now.getTime() - schoolYearStart.getTime();
            const progressPct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)).toFixed(1);

            const elProgPct = document.getElementById("hero-cd-progress-pct");
            const elProgBar = document.getElementById("hero-cd-progress-bar");
            if (elProgPct) elProgPct.textContent = `${progressPct}%`;
            if (elProgBar) elProgBar.style.width = `${progressPct}%`;

            if (modalBadge) modalBadge.textContent = heroConfig.badge;
            if (modalDateText) modalDateText.textContent = heroConfig.dateText;
            if (modalTitle) modalTitle.textContent = heroConfig.name;
            if (modalFilieres) modalFilieres.textContent = heroConfig.filieres;
            if (modalDays) modalDays.textContent = days;
            if (modalHours) modalHours.textContent = String(hours).padStart(2, "0");
            if (modalMins) modalMins.textContent = String(minutes).padStart(2, "0");
            if (modalSecs) modalSecs.textContent = String(seconds).padStart(2, "0");
            if (modalProgPct) modalProgPct.textContent = `${progressPct}%`;
            if (modalProgBar) modalProgBar.style.width = `${progressPct}%`;

            // Dynamic Advice from Nabras
            const adviceEl = document.getElementById("sidebar-nabras-tip");
            if (heroConfig.advices?.length > 0) {
                const adviceIdx = Math.floor(days / 15) % heroConfig.advices.length;
                if (adviceEl) adviceEl.textContent = heroConfig.advices[adviceIdx];
                if (modalTip) modalTip.textContent = heroConfig.advices[adviceIdx];
            }

            // 2. Render Other Moroccan Concours List in Sidebar
            const listContainer = document.getElementById("sidebar-countdown-list");
            if (listContainer) {
                const otherExams = Object.values(EXAMS).filter(e => e.id !== this.targetExamKey);
                listContainer.innerHTML = otherExams.map(ex => {
                    const exDate = getNextExamDate(ex.month, ex.day, ex.hour, ex.min);
                    const exDiff = Math.max(0, Math.floor((exDate.getTime() - now.getTime()) / (1000 * 86400)));
                    return `
                        <div data-target="${ex.id}" class="sidebar-exam-item p-2 rounded-xl glass-card border border-brand-borderSubtle hover:border-brand-gold/60 flex items-center justify-between text-xs cursor-pointer transition active:scale-[0.98] group">
                            <div class="flex items-center gap-2 truncate">
                                <span class="text-xs group-hover:scale-110 transition shrink-0">${ex.icon}</span>
                                <div class="truncate">
                                    <span class="font-bold text-white group-hover:text-brand-goldLight text-[11px] block truncate font-outfit">
                                        ${ex.name}
                                    </span>
                                    <span class="text-[9px] text-brand-muted font-mono block">
                                        ${ex.dateText}
                                    </span>
                                </div>
                            </div>
                            <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-brand-darker text-brand-goldLight border border-brand-borderSubtle group-hover:bg-brand-cherry group-hover:border-brand-gold transition shrink-0">
                                J-${exDiff}
                            </span>
                        </div>
                    `;
                }).join("");

                // Attach click to switch target
                listContainer.querySelectorAll(".sidebar-exam-item").forEach(item => {
                    item.addEventListener("click", () => {
                        const targetId = item.dataset.target;
                        if (targetId && EXAMS[targetId]) {
                            window.ambience?.playClick();
                            this.setTargetExam(targetId);
                        }
                    });
                });
            }

            // 3. Right Flank Pod (Next to Chrono) & Mobile Flank Badge
            const elPodBadge = document.getElementById("pod-cd-badge");
            const elPodDays = document.getElementById("pod-cd-days");
            const elPodDate = document.getElementById("pod-cd-date");
            const elMobText = document.getElementById("mobile-countdown-text");

            if (elPodBadge) elPodBadge.textContent = heroConfig.badge;
            if (elPodDays) elPodDays.textContent = `J - ${days}`;
            if (elPodDate) elPodDate.textContent = heroConfig.dateText;
            if (elMobText) {
                const shortBadge = heroConfig.badge.split(" ")[0] || "Watani";
                elMobText.textContent = `${shortBadge}: J-${days}`;
            }

            // 4. Mini header badge & floating mobile badge
            const elMini = document.getElementById("header-mini-countdown");
            const elFloating = document.getElementById("floating-mobile-cd-days");
            if (elMini) elMini.textContent = `${heroConfig.badge}: J-${days}`;
            if (elFloating) elFloating.textContent = `J-${days}`;
        };

        // Bind Target Chips in Sidebar
        document.querySelectorAll(".target-exam-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const examKey = btn.dataset.exam;
                if (examKey && EXAMS[examKey]) {
                    window.ambience?.playClick();
                    this.setTargetExam(examKey);
                }
            });
        });

        // Click on Right Flank Pod or Mobile Badge to cycle through exams
        const examKeys = Object.keys(EXAMS);
        const cycleNextExam = () => {
            const currentIdx = examKeys.indexOf(this.targetExamKey);
            const nextKey = examKeys[(currentIdx + 1) % examKeys.length];
            window.ambience?.playClick();
            this.setTargetExam(nextKey);
        };

        const chronoPod = document.getElementById("chrono-right-countdown-pod");
        if (chronoPod?.dataset && !chronoPod.dataset.bound) {
            chronoPod.dataset.bound = "true";
            chronoPod.addEventListener("click", cycleNextExam);
        }

        const mobileBadge = document.getElementById("mobile-countdown-badge");
        if (mobileBadge?.dataset && !mobileBadge.dataset.bound) {
            mobileBadge.dataset.bound = "true";
            mobileBadge.addEventListener("click", cycleNextExam);
        }

        // Header Countdown Click Handler: Click directly opens the Exam Modal
        const headerMiniBtn = document.getElementById("header-mini-countdown");
        if (headerMiniBtn?.dataset && !headerMiniBtn.dataset.bound) {
            headerMiniBtn.dataset.bound = "true";
            headerMiniBtn.title = "Cliquer pour ouvrir le Hub des Concours (ou double-cliquer pour alterner)";
            headerMiniBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                window.ambience?.playClick();
                this.openExamModal();
            });
        }

        // Bind Exam Hub Modal Triggers & Controls
        this.bindExamHubModal();

        updateCountdowns();
        if (this.countdownHubTimer) clearInterval(this.countdownHubTimer);
        this.countdownHubTimer = setInterval(updateCountdowns, 1000);
    }

    bindExamHubModal() {
        const modal = document.getElementById("modal-exam-hub");
        const openBtn = document.getElementById("btn-open-countdowns");
        const closeBtn = document.getElementById("btn-close-exam-modal");
        const toolHubBtn = document.getElementById("tool-hub-open-countdowns");
        const libBtn = document.getElementById("btn-modal-open-library");

        if (openBtn?.dataset && !openBtn.dataset.examBound) {
            openBtn.dataset.examBound = "true";
            openBtn.addEventListener("click", () => {
                window.ambience?.playClick();
                this.openExamModal();
            });
        }

        if (toolHubBtn?.dataset && !toolHubBtn.dataset.examBound) {
            toolHubBtn.dataset.examBound = "true";
            toolHubBtn.addEventListener("click", () => {
                window.ambience?.playClick();
                const toolsModal = document.getElementById("modal-tools-hub");
                if (toolsModal) {
                    toolsModal.classList.add("hidden");
                    toolsModal.classList.remove("flex");
                }
                this.openExamModal();
            });
        }

        if (closeBtn?.dataset && !closeBtn.dataset.examBound) {
            closeBtn.dataset.examBound = "true";
            closeBtn.addEventListener("click", () => {
                this.closeExamModal();
            });
        }

        if (modal?.dataset && !modal.dataset.examBound) {
            modal.dataset.examBound = "true";
            modal.addEventListener("click", (e) => {
                if (e.target === modal) this.closeExamModal();
            });
        }

        if (libBtn?.dataset && !libBtn.dataset.examBound) {
            libBtn.dataset.examBound = "true";
            libBtn.addEventListener("click", () => {
                this.closeExamModal();
                this.switchTab("tab-library");
            });
        }

        // Filter Pills inside Modal
        document.querySelectorAll(".exam-filter-pill").forEach(pill => {
            if (pill?.dataset && !pill.dataset.bound) {
                pill.dataset.bound = "true";
                pill.addEventListener("click", () => {
                    document.querySelectorAll(".exam-filter-pill").forEach(p => {
                        p.className = "exam-filter-pill px-3 py-1 rounded-xl glass-card text-brand-muted hover:text-white border border-brand-borderSubtle transition cursor-pointer";
                    });
                    pill.className = "exam-filter-pill px-3 py-1 rounded-xl bg-brand-cherry text-brand-goldLight border border-brand-gold font-bold shadow transition cursor-pointer";
                    this.renderExamModalGrid(pill.dataset.cat || "all");
                });
            }
        });
    }

    openExamModal() {
        const modal = document.getElementById("modal-exam-hub");
        if (!modal) return;
        this.renderExamModalGrid("all");
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }

    closeExamModal() {
        const modal = document.getElementById("modal-exam-hub");
        if (!modal) return;
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }

    renderExamModalGrid(filterCat = "all") {
        const container = document.getElementById("modal-exams-grid");
        if (!container || !this.EXAMS) return;

        const now = new Date();
        const getNextExamDate = (month, day, hour = 7, min = 0) => {
            const currentUtcYear = now.getUTCFullYear();
            const examUtcThisYear = new Date(Date.UTC(currentUtcYear, month - 1, day, hour, min, 0));
            if (now.getTime() > examUtcThisYear.getTime()) {
                return new Date(Date.UTC(currentUtcYear + 1, month - 1, day, hour, min, 0));
            }
            return examUtcThisYear;
        };

        const examsList = Object.values(this.EXAMS).filter(e => {
            if (filterCat === "all") return true;
            return e.category === filterCat;
        });

        container.innerHTML = examsList.map(ex => {
            const isTarget = (ex.id === this.targetExamKey);
            const exDate = getNextExamDate(ex.month, ex.day, ex.hour, ex.min);
            const totalSecs = Math.max(0, Math.floor((exDate.getTime() - now.getTime()) / 1000));
            const days = Math.floor(totalSecs / 86400);
            const hours = Math.floor((totalSecs % 86400) / 3600);

            return `
                <div class="p-3.5 rounded-2xl glass-card border ${isTarget ? 'border-brand-gold bg-gradient-to-br from-brand-cherryDark/50 via-brand-card to-black shadow-lg ring-1 ring-brand-gold/60' : 'border-brand-borderSubtle hover:border-brand-gold/50 bg-brand-darker/60'} transition flex flex-col justify-between gap-3 relative group">
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-xs px-2 py-0.5 rounded-lg font-mono font-bold ${isTarget ? 'bg-brand-cherry text-brand-goldLight border border-brand-gold/50' : 'bg-black/50 text-brand-goldLight border border-brand-borderSubtle'} flex items-center gap-1.5">
                                <span>${ex.icon}</span>
                                <span>${ex.badge}</span>
                            </span>
                            <span class="text-[11px] font-mono font-black ${isTarget ? 'text-brand-goldLight bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/40' : 'text-brand-muted'}">
                                J-${days} (${hours}h)
                            </span>
                        </div>

                        <div>
                            <h4 class="font-outfit font-black text-white text-sm group-hover:text-brand-goldLight transition">
                                ${ex.name}
                            </h4>
                            <p class="text-[11px] text-brand-muted line-clamp-2 mt-0.5 font-sans leading-tight">
                                ${ex.desc || ex.filieres}
                            </p>
                        </div>

                        <div class="flex items-center gap-2 text-[10px] text-brand-gold font-mono pt-1">
                            <i class="fa-solid fa-calendar-days text-[9px]"></i>
                            <span>Date : ${ex.dateText}</span>
                        </div>
                    </div>

                    <div class="pt-2 border-t border-brand-borderSubtle/50 flex items-center justify-between gap-2">
                        <span class="text-[9px] text-brand-muted truncate max-w-[140px] font-mono">
                            ${ex.filieres}
                        </span>
                        <button data-select-exam="${ex.id}" class="modal-select-exam-btn px-3 py-1.5 rounded-xl text-xs font-outfit font-black transition active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 ${isTarget ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow ring-1 ring-emerald-400' : 'bg-brand-cherry hover:bg-brand-cherryDark text-brand-goldLight border border-brand-gold/40 hover:border-brand-gold'}">
                            <i class="fa-solid ${isTarget ? 'fa-check' : 'fa-bullseye'} text-xs"></i>
                            <span>${isTarget ? 'Cible Active' : 'Choisir comme Cible'}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        container.querySelectorAll(".modal-select-exam-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const examId = btn.dataset.selectExam;
                if (examId && this.EXAMS[examId]) {
                    window.ambience?.playSuccess();
                    this.setTargetExam(examId);
                    this.renderExamModalGrid(filterCat);
                }
            });
        });
    }

    setTargetExam(targetKey) {
        this.targetExamKey = targetKey;
        localStorage.setItem("ss_target_exam", targetKey);

        document.querySelectorAll(".target-exam-btn").forEach(btn => {
            if (btn.dataset.exam === targetKey) {
                btn.className = "target-exam-btn px-2 py-1.5 rounded-xl border transition text-center truncate bg-brand-cherry text-brand-goldLight border-brand-gold font-black shadow-md";
            } else {
                btn.className = "target-exam-btn px-2 py-1.5 rounded-xl border transition text-center truncate glass-card border-brand-borderSubtle text-brand-muted hover:text-white";
            }
        });

        const ex = this.EXAMS?.[targetKey];
        if (ex) {
            window.studyApp?.showToast(`🎯 Objectif fixé : ${ex.name} ! Bon courage !`);
        }

        this.startCountdownHub();
    }

    // --- OFFICIAL MOROCCO REAL-TIME CLOCK ---
    bindLiveMoroccoClock() {
        const clockEl = document.getElementById("morocco-clock-text");
        if (!clockEl) return;
        const updateClock = () => {
            try {
                const now = new Date();
                const timeStr = now.toLocaleTimeString("fr-FR", {
                    timeZone: "Africa/Casablanca",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                });
                clockEl.textContent = timeStr;
            } catch (e) {
                const d = new Date();
                clockEl.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
            }
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    renderSubjectLabels() {
        const badge = document.getElementById("active-subject-badge");
        const badgeMobile = document.getElementById("active-subject-badge-mobile");
        const selector = document.getElementById("select-active-subject");

        let label = this.currentSubject;
        if (selector) {
            const opt = selector.querySelector(`option[value="${this.currentSubject}"]`) || selector.selectedOptions?.[0];
            if (opt) label = opt.text;
        }

        if (badge) badge.textContent = label;
        if (badgeMobile) badgeMobile.textContent = label;
    }

    // --- ACTIVE SUBJECT SELECTOR ---
    bindSubjectSelector() {
        const selector = document.getElementById("select-active-subject");

        if (selector) {
            selector.value = this.currentSubject;
            selector.addEventListener("change", (e) => {
                this.currentSubject = e.target.value;
                localStorage.setItem("ss_active_subject", this.currentSubject);
                this.renderSubjectLabels();
                window.ambience?.playClick();

                const label = selector.selectedOptions?.[0]?.text || this.currentSubject;
                if (this.sync) {
                    this.sync.setUser({
                        activeSubject: this.currentSubject,
                        subject: this.currentSubject
                    });
                }
                this.renderVirtualStudyDesk([]);
                this.showToast(`📚 Tu révises maintenant : ${label}`);
            });
        }
        this.renderSubjectLabels();
    }

    // --- DISCORD SDK INTEGRATION ---
    async initDiscordSDK() {
        const urlParams = new URLSearchParams(window.location.search);
        const hasFrameId = urlParams.has("frame_id") || urlParams.has("instance_id") || window.parent !== window;

        const statusText = document.getElementById("discord-status-text");
        const userAvatar = document.getElementById("user-avatar");
        const userName = document.getElementById("user-name");
        const userFiliere = document.getElementById("user-filiere");

        const storedName = localStorage.getItem("ss_user_name");
        let storedAvatar = localStorage.getItem("ss_user_avatar");
        if (!storedAvatar || storedAvatar.includes("api.dicebear.com")) {
            storedAvatar = "assets/avatars/default.svg";
            localStorage.setItem("ss_user_avatar", storedAvatar);
        }
        const storedFiliere = localStorage.getItem("ss_user_filiere") || "CPGE MP*";
        const storedBio = localStorage.getItem("ss_user_bio") || "Objectif Concours 2026";
        let storedMatricule = localStorage.getItem("ss_matricule");
        if (!storedMatricule) {
            storedMatricule = "SS-2026-" + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem("ss_matricule", storedMatricule);
        }

        this.discordUser = {
            id: (this.sync && this.sync.clientId) ? this.sync.clientId : ("user_" + Math.random().toString(36).substring(2, 9)),
            name: storedName || "Étudiant StudySouk",
            avatar: storedAvatar,
            filiere: storedFiliere,
            bio: storedBio,
            matricule: storedMatricule
        };

        let SdkClass = (window.DiscordSDK && window.DiscordSDK.DiscordSDK) || window.DiscordSDK;
        if (hasFrameId && !SdkClass) {
            for (let i = 0; i < 10; i++) {
                await new Promise(r => setTimeout(r, 100));
                SdkClass = (window.DiscordSDK && window.DiscordSDK.DiscordSDK) || window.DiscordSDK;
                if (SdkClass) break;
            }
        }

        if (hasFrameId && SdkClass) {
            try {
                this.sdk = new SdkClass(CLIENT_ID);
                await this.sdk.ready();
                this.isInDiscord = true;

                if (statusText) {
                    statusText.textContent = `Discord Salon Connecté #${this.sdk.channelId ? this.sdk.channelId.substring(0, 6) : 'StudySouk'}`;
                }

                // Optional Discord OAuth2 Token Exchange
                try {
                    const { code } = await this.sdk.commands.authorize({
                        client_id: CLIENT_ID,
                        response_type: "code",
                        state: "",
                        prompt: "none",
                        scope: ["identify", "guilds.members.read"]
                    });
                    const res = await fetch("/api/token", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.access_token) {
                            const userRes = await fetch("https://discord.com/api/v10/users/@me", {
                                headers: { Authorization: `Bearer ${data.access_token}` }
                            });
                            if (userRes.ok) {
                                const discordUserData = await userRes.json();
                                if (discordUserData.username && !storedName) {
                                    this.discordUser.name = discordUserData.global_name || discordUserData.username;
                                    localStorage.setItem("ss_user_name", this.discordUser.name);
                                }
                                if (discordUserData.avatar && !storedAvatar) {
                                    const remoteAvatar = `https://cdn.discordapp.com/avatars/${discordUserData.id}/${discordUserData.avatar}.png`;
                                    const isProxy = window.location.pathname.startsWith('/.proxy');
                                    this.discordUser.avatar = `${isProxy ? '/.proxy' : ''}/api/proxy/avatar?url=${encodeURIComponent(remoteAvatar)}`;
                                    localStorage.setItem("ss_user_avatar", this.discordUser.avatar);
                                }
                            }
                        }
                    }
                } catch (oauthErr) {
                    console.log("[DiscordAuth] OAuth skipped or unconfigured:", oauthErr?.message || oauthErr);
                }
            } catch (err) {
                console.warn("[DiscordSDK] Running in browser preview:", err?.message || err);
                if (statusText) statusText.textContent = "Mode Navigateur • Multi-Utilisateurs Actif";
            }
        } else {
            if (statusText) statusText.textContent = "Mode Navigateur • Multi-Utilisateurs Actif";
        }

        if (userName) userName.textContent = this.discordUser.name;
        if (userAvatar) userAvatar.src = this.discordUser.avatar;
        if (userFiliere) userFiliere.textContent = this.discordUser.filiere;

        if (this.sync) {
            const levelInfo = this.levelSystem?.getLevelInfo();
            this.sync.setUser({
                id: this.discordUser.id,
                name: this.discordUser.name,
                avatar: this.discordUser.avatar,
                filiere: this.discordUser.filiere,
                bio: this.discordUser.bio,
                matricule: this.discordUser.matricule,
                level: levelInfo?.level || 1,
                rankTitle: levelInfo?.rank?.title || "Apprenti STEM",
                focusMinutes: this.totalFocusMinutes,
                activeSubject: this.currentSubject
            });
        }
    }

    // --- MULTIPLAYER TIMER SYNC ---
    initMultiplayerTimerSync() {
        if (!this.sync) return;

        this.sync.on("pomodoro_sync", (data) => {
            if (!data) return;
            const { action, modeKey, timeLeft, author, subject } = data;

            const syncLabel = document.getElementById("timer-sync-label");
            const syncLabelMobile = document.getElementById("timer-sync-label-mobile");
            if (author && author.name) {
                const short = author.name.split(" ")[0];
                if (syncLabel) syncLabel.textContent = `⏱️ Par ${short}`;
                if (syncLabelMobile) syncLabelMobile.textContent = `${short}`;
                clearTimeout(this.syncLabelTimer);
                this.syncLabelTimer = setTimeout(() => {
                    if (syncLabel) syncLabel.textContent = "Salon Synchronisé";
                    if (syncLabelMobile) syncLabelMobile.textContent = "Synchro";
                }, 4000);
            }

            if (subject && subject !== this.currentSubject) {
                this.currentSubject = subject;
                this.renderSubjectLabels();
            }

            if (modeKey && this.currentModeKey !== modeKey) {
                this.setTimerMode(modeKey, false);
            }

            if (typeof timeLeft === "number") {
                this.timeLeft = timeLeft;
                this.updateTimerDisplay();
            }

            if (action === "start" && !this.isRunning) {
                this.startTimer(false);
            } else if (action === "pause" && this.isRunning) {
                this.pauseTimer(false);
            } else if (action === "reset") {
                this.resetTimer(false);
            }
        });

        this.sync.on("roster_update", (data) => {
            const countEl = document.getElementById("room-users-count");
            if (countEl) countEl.textContent = data.count || 1;
            this.renderRosterModal(data.users || []);
            this.renderVirtualStudyDesk(data.users || []);
        });

        this.sync.on("reaction_received", (data) => {
            if (!data) return;
            const authorName = data.author?.name ? data.author.name.split(" ")[0] : "Ton binôme";
            const emoji = data.emoji || data.emojiKey || "🔥";
            if (this.reactions) {
                this.reactions.spawnReaction(data.emojiKey || "ss_fire", data.author);
            }
            this.showToast(`${emoji} ${authorName} t'envoie du soutien !`);
        });

        this.sync.on("focus_pact", (data) => {
            if (!data || !data.action) return;
            const { action, durationMins, subject, author } = data;
            const authorName = author?.name ? author.name.split(" ")[0] : "Ton binôme";

            if (action === "invite") {
                if (author && (author.id === this.discordUser?.id || author.id === this.sync?.clientId)) return;
                this.pendingPactInvite = data;
                const senderNameEl = document.getElementById("pact-sender-name");
                const durationEl = document.getElementById("pact-modal-duration-text");
                const subjectEl = document.getElementById("pact-sender-subject");
                if (senderNameEl) senderNameEl.textContent = author?.name || "Ton binôme";
                if (durationEl) durationEl.textContent = `${durationMins || 25} minutes`;
                if (subjectEl) subjectEl.innerHTML = `📚 Sujet : ${subject || "Deep Work"}`;

                const modal = document.getElementById("modal-focus-pact-invite");
                modal?.classList.remove("hidden");
                modal?.classList.add("flex");
                window.ambience?.playChime();
            } else if (action === "accept") {
                this.activePact = {
                    partner: author,
                    durationMins: durationMins || 25,
                    totalSeconds: (durationMins || 25) * 60,
                    startedAt: Date.now()
                };
                this.setTimerMode("focus25", false);
                this.startTimer(false);

                const banner = document.getElementById("desk-pact-banner");
                banner?.classList.remove("hidden");
                banner?.classList.add("flex");
                const partnerTxt = document.getElementById("desk-pact-partner-name");
                if (partnerTxt) partnerTxt.textContent = `En symbiose avec ${authorName}`;

                window.ambience?.playSuccess();
                this.triggerConfetti();
                this.showToast(`🤝 Pacte Focus Scellé avec ${authorName} ! Concentration maximale !`);
                this.renderVirtualStudyDesk([]);
            } else if (action === "decline") {
                this.showToast(`ℹ️ ${authorName} ne peut pas sceller de pacte pour le moment.`);
            } else if (action === "pause_warning") {
                this.showToast(`⚠️ ${authorName} a mis son minuteur en pause !`);
            } else if (action === "complete") {
                if (this.activePact) {
                    this.levelSystem?.addXP(50, "Pacte Focus Duo Validé 🤝");
                    this.triggerConfetti();
                    this.showToast("🏆 Pacte Focus Honoré avec brio ! +50 XP bonus débloqué !");
                    this.activePact = null;
                    const banner = document.getElementById("desk-pact-banner");
                    banner?.classList.add("hidden");
                    banner?.classList.remove("flex");
                    this.renderVirtualStudyDesk([]);
                }
            }
        });

        this.sync.on("user_joined", (user) => {
            if (user && user.name) {
                this.showToast(`👋 ${user.name} a rejoint la session d'étude !`);
                this.renderVirtualStudyDesk([]);
            }
        });
    }

    // --- ZEN MODE ---
    bindZenMode() {
        document.getElementById("btn-zen-mode")?.addEventListener("click", () => {
            window.ambience?.playClick();
            document.body.classList.toggle("zen-mode");
            const isZen = document.body.classList.contains("zen-mode");
            if (isZen) {
                localStorage.setItem("ss_used_zen", "true");
            }
            const btn = document.getElementById("btn-zen-mode");
            if (btn) {
                btn.innerHTML = isZen 
                    ? `<i class="fa-solid fa-compress text-brand-gold"></i> <span class="hidden md:inline">Quitter</span>`
                    : `<i class="fa-solid fa-expand text-brand-gold"></i> <span class="hidden md:inline">Zen</span>`;
            }
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && document.body.classList.contains("zen-mode")) {
                document.body.classList.remove("zen-mode");
                const btn = document.getElementById("btn-zen-mode");
                if (btn) {
                    btn.innerHTML = `<i class="fa-solid fa-expand text-brand-gold"></i> <span class="hidden md:inline">Zen</span>`;
                }
            }
        });
    }

    // --- KEYBOARD SHORTCUTS ---
    bindKeyboardShortcuts() {
        const shortcutsModal = document.getElementById("shortcuts-modal");
        document.getElementById("btn-shortcuts")?.addEventListener("click", () => {
            window.ambience?.playClick();
            shortcutsModal?.classList.remove("hidden");
            shortcutsModal?.classList.add("flex");
        });
        document.getElementById("btn-close-shortcuts")?.addEventListener("click", () => {
            shortcutsModal?.classList.add("hidden");
            shortcutsModal?.classList.remove("flex");
        });
        shortcutsModal?.addEventListener("click", (e) => {
            if (e.target === shortcutsModal) {
                shortcutsModal.classList.add("hidden");
                shortcutsModal.classList.remove("flex");
            }
        });

        window.addEventListener("keydown", (e) => {
            if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
                return;
            }

            if (e.code === "Space") {
                e.preventDefault();
                window.ambience?.playClick();
                this.toggleTimer(true);
            } else if (e.key === "r" || e.key === "R") {
                window.ambience?.playClick();
                this.resetTimer(true);
            } else if (e.key === "z" || e.key === "Z") {
                document.getElementById("btn-zen-mode")?.click();
            } else if (e.key === "m" || e.key === "M") {
                document.getElementById("btn-mute-all")?.click();
            } else if (e.key === "t" || e.key === "T") {
                this.toggleTicTac();
            } else if (e.key === "?") {
                shortcutsModal?.classList.toggle("hidden");
                shortcutsModal?.classList.toggle("flex");
            } else if (["1", "2", "3", "4", "5", "6", "7"].includes(e.key)) {
                const tabs = ["tab-timer", "tab-library", "tab-scratchpad", "tab-duel", "tab-flashcards", "tab-tasks", "tab-ambience"];
                const targetTab = tabs[parseInt(e.key, 10) - 1];
                if (targetTab) {
                    window.ambience?.playClick();
                    this.switchTab(targetTab);
                }
            } else if (e.key.toLowerCase() === "b" && !e.target.matches("input, textarea, select")) {
                window.ambience?.playClick();
                this.switchTab("tab-library");
            }
        });
    }

    // --- NAVIGATION & TABS ---
    bindNavigation() {
        const navBtns = document.querySelectorAll(".nav-tab-btn");
        navBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                window.ambience?.playClick();
                const targetId = btn.dataset.tab;
                if (targetId) this.switchTab(targetId);
            });
        });

        // Dedicated More Tools Modal Hub ("tban mzian mashi ltht")
        const toggleMoreBtn = document.getElementById("btn-toggle-more-tools");
        const toolsModal = document.getElementById("modal-tools-hub");
        const closeToolsModalBtn = document.getElementById("btn-close-tools-modal");

        const openToolsModal = () => {
            window.ambience?.playClick();
            toolsModal?.classList.remove("hidden");
            toolsModal?.classList.add("flex");
        };

        const closeToolsModal = () => {
            toolsModal?.classList.add("hidden");
            toolsModal?.classList.remove("flex");
        };

        if (toggleMoreBtn && toolsModal) {
            toggleMoreBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (toolsModal.classList.contains("hidden")) {
                    openToolsModal();
                } else {
                    closeToolsModal();
                }
            });

            closeToolsModalBtn?.addEventListener("click", closeToolsModal);

            // Close when clicking directly on backdrop
            toolsModal.addEventListener("click", (e) => {
                if (e.target === toolsModal) {
                    closeToolsModal();
                }
            });

            // Open countdown drawer from tools modal
            document.getElementById("tool-hub-open-countdowns")?.addEventListener("click", () => {
                closeToolsModal();
                document.getElementById("btn-sidebar-countdown-trigger")?.click();
            });

            // Handle tab buttons inside tools modal
            toolsModal.querySelectorAll("[data-tab]").forEach(card => {
                card.addEventListener("click", () => {
                    const targetTab = card.dataset.tab;
                    if (targetTab) {
                        closeToolsModal();
                        this.switchTab(targetTab);
                    }
                });
            });
        }

        // Dedicated Library toggles
        document.getElementById("btn-open-library")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.switchTab("tab-library");
        });
        document.getElementById("btn-back-to-timer")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.switchTab("tab-timer");
        });
    }

    switchTab(tabId) {
        // Hide tools & exam modals if open
        const toolsModal = document.getElementById("modal-tools-hub");
        toolsModal?.classList.add("hidden");
        toolsModal?.classList.remove("flex");

        const examModal = document.getElementById("modal-exam-hub");
        examModal?.classList.add("hidden");
        examModal?.classList.remove("flex");

        // Scroll workspace to top cleanly
        document.querySelector("main")?.scrollTo({ top: 0, behavior: "instant" });

        const navBtns = document.querySelectorAll(".nav-tab-btn");
        navBtns.forEach(b => {
            if (b.dataset.tab === tabId) {
                b.classList.add("tab-active");
                b.classList.remove("text-brand-muted", "border-transparent");
            } else {
                b.classList.remove("tab-active");
                b.classList.add("text-brand-muted", "border-transparent");
            }
        });

        // Highlight "Outils" trigger if one of the secondary tools is active
        const moreToolsBtn = document.getElementById("btn-toggle-more-tools");
        const secondaryTabs = ["tab-tasks", "tab-ambience"];
        if (moreToolsBtn) {
            if (secondaryTabs.includes(tabId)) {
                moreToolsBtn.classList.add("tab-active");
                moreToolsBtn.classList.remove("text-brand-muted", "border-transparent");
            } else {
                moreToolsBtn.classList.remove("tab-active");
                moreToolsBtn.classList.add("text-brand-muted", "border-transparent");
            }
        }

        document.querySelectorAll(".tab-content").forEach(tc => tc.classList.add("hidden"));
        document.getElementById(tabId)?.classList.remove("hidden");

        // Hide floating widgets if on Nabras AI tab to prevent obstructing chat input
        const floatingNabras = document.getElementById("btn-floating-nabras");
        if (floatingNabras) {
            floatingNabras.style.display = (tabId === "tab-nabras") ? "none" : "";
        }
        const reactionsBar = document.getElementById("reactions-bar");
        if (reactionsBar) {
            reactionsBar.style.display = (tabId === "tab-nabras") ? "none" : "";
        }

        if (tabId === "tab-duel" && this.duel && !this.duel.isPlaying) {
            this.duel.render();
        } else if (tabId === "tab-library" && window.library) {
            window.library.renderCatalog();
        } else if (tabId === "tab-flashcards" && this.flashcards) {
            this.flashcards.render();
        } else if (tabId === "tab-scratchpad" && this.scratchpad) {
            this.scratchpad.onTabVisible();
        } else if (tabId === "tab-tasks") {
            this.renderDashboard();
        } else if (tabId === "tab-ambience") {
            window.focusStudio?.onTabVisible?.();
        } else if (tabId === "tab-nabras" && this.nabrasAI) {
            this.nabrasAI.onTabVisible();
        }
    }

    // --- TIMER ENGINE ---
    bindTimerControls() {
        const modeBtns = document.querySelectorAll(".timer-mode-btn");
        modeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                window.ambience?.playClick();
                const modeKey = btn.dataset.mode;
                this.setTimerMode(modeKey, true);
            });
        });

        document.getElementById("btn-timer-toggle")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.toggleTimer(true);
        });

        document.getElementById("btn-timer-reset")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.resetTimer(true);
        });

        document.getElementById("btn-timer-skip")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.completeSession(true);
        });

        // Quick -5m / +5m Session Time Modifiers
        document.getElementById("btn-timer-sub5")?.addEventListener("click", () => {
            window.ambience?.playClick();
            if (this.timeLeft > 300) {
                this.timeLeft -= 300;
                this.totalDuration = Math.max(this.totalDuration - 300, 300);
                this.updateTimerDisplay();
                if (this.sync) {
                    this.sync.syncPomodoro("adjust", {
                        modeKey: this.currentModeKey,
                        timeLeft: this.timeLeft,
                        isRunning: this.isRunning,
                        subject: this.currentSubject
                    });
                }
                this.showToast("⏱️ -5 minutes");
            }
        });

        document.getElementById("btn-timer-add5")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.timeLeft += 300;
            this.totalDuration += 300;
            this.updateTimerDisplay();
            if (this.sync) {
                this.sync.syncPomodoro("adjust", {
                    modeKey: this.currentModeKey,
                    timeLeft: this.timeLeft,
                    isRunning: this.isRunning,
                    subject: this.currentSubject
                });
            }
            this.showToast("⏱️ +5 minutes ajoutées");
        });

        // Tic-Tac Sound Toggles (Side Pod, Quick Action, Mobile)
        document.getElementById("btn-tictac-toggle-side")?.addEventListener("click", () => this.toggleTicTac());
        document.getElementById("btn-tictac-toggle-quick")?.addEventListener("click", () => this.toggleTicTac());
        document.getElementById("btn-tictac-toggle-mobile")?.addEventListener("click", () => this.toggleTicTac());
    }

    renderCycleDots() {
        const dotsContainer = document.getElementById("cycle-dots");
        const label = document.getElementById("cycle-label");
        if (!dotsContainer) return;
        const currentInCycle = (this.sessionsCompleted % 4); // 0, 1, 2, 3
        const cycleNum = currentInCycle + 1;
        if (label) label.textContent = `${cycleNum}/4`;

        let html = '';
        for (let i = 0; i < 4; i++) {
            if (i < currentInCycle) {
                html += '<span class="cycle-dot completed" title="Bloc validé ✓"></span>';
            } else if (i === currentInCycle) {
                html += '<span class="cycle-dot active" title="Bloc en cours"></span>';
            } else {
                html += '<span class="cycle-dot" title="Bloc restant"></span>';
            }
        }
        dotsContainer.innerHTML = html;
    }

    setTimerMode(modeKey, broadcast = false) {
        if (!this.modes[modeKey]) return;
        this.pauseTimer(false);
        this.currentModeKey = modeKey;
        this.totalDuration = this.modes[modeKey].duration;
        this.timeLeft = this.totalDuration;
        this.updateTimerDisplay();
        this.renderCycleDots();

        // Dynamic visual mood shift based on Focus vs Breaks
        const circle = document.getElementById("timer-progress-circle");
        const halo = document.getElementById("timer-ambient-halo");
        const baseTrack = document.getElementById("timer-base-track");
        const displayEl = document.getElementById("timer-display");

        if (modeKey === 'break5') {
            if (circle) circle.setAttribute('stroke', 'url(#studysoukBreakGradient)');
            if (halo) halo.className = "absolute inset-[-10px] rounded-full bg-gradient-to-tr from-emerald-950/60 via-emerald-500/30 to-teal-400/20 blur-3xl pointer-events-none transition-all duration-700 animate-pulse";
            if (baseTrack) baseTrack.setAttribute('stroke', 'rgba(6, 95, 70, 0.35)');
            if (displayEl) displayEl.style.setProperty('--timer-gradient', 'linear-gradient(180deg, #FFFFFF 0%, #D1FAE5 25%, #34D399 60%, #059669 85%, #064E3B 100%)');
        } else if (modeKey === 'break15') {
            if (circle) circle.setAttribute('stroke', 'url(#studysoukLongBreakGradient)');
            if (halo) halo.className = "absolute inset-[-10px] rounded-full bg-gradient-to-tr from-blue-950/60 via-blue-500/30 to-indigo-400/20 blur-3xl pointer-events-none transition-all duration-700 animate-pulse";
            if (baseTrack) baseTrack.setAttribute('stroke', 'rgba(30, 58, 138, 0.35)');
            if (displayEl) displayEl.style.setProperty('--timer-gradient', 'linear-gradient(180deg, #FFFFFF 0%, #DBEAFE 25%, #60A5FA 60%, #2563EB 85%, #1E3A8A 100%)');
        } else {
            if (circle) circle.setAttribute('stroke', 'url(#studysoukGoldGradient)');
            if (halo) halo.className = "absolute inset-[-10px] rounded-full bg-gradient-to-tr from-brand-cherry/50 via-brand-gold/25 to-brand-cherryVibrant/20 blur-3xl pointer-events-none transition-all duration-700 animate-pulse";
            if (baseTrack) baseTrack.setAttribute('stroke', 'rgba(138, 21, 56, 0.25)');
            if (displayEl) displayEl.style.setProperty('--timer-gradient', 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 25%, #E2E8F0 55%, #CBD5E1 80%, #94A3B8 100%)');
        }

        document.querySelectorAll(".timer-mode-btn").forEach(b => {
            if (b.dataset.mode === modeKey) {
                b.classList.add("timer-btn-active");
                b.classList.remove("text-brand-muted");
            } else {
                b.classList.remove("timer-btn-active");
                b.classList.add("text-brand-muted");
            }
        });

        if (broadcast && this.sync) {
            this.sync.syncPomodoro("mode", {
                modeKey: this.currentModeKey,
                timeLeft: this.timeLeft,
                isRunning: false,
                subject: this.currentSubject
            });
        }
    }

    toggleTimer(broadcast = false) {
        if (this.isRunning) {
            this.pauseTimer(broadcast);
        } else {
            this.startTimer(broadcast);
        }
    }

    startTimer(broadcast = false) {
        if (this.isRunning) return;
        this.isRunning = true;
        document.body.classList.add("timer-running");
        window.ambience?.ensureRunning();

        const btn = document.getElementById("btn-timer-toggle");
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-pause text-xs sm:text-sm text-brand-goldLight ml-0.5 group-hover:scale-110 transition duration-150"></i><span class="gold-text-gradient font-black text-xs sm:text-sm">Pause</span>`;
        }

        const statusEl = document.getElementById("timer-status-indicator");
        if (statusEl) {
            statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span><span class="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider">Session Active</span>`;
        }

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            // Haute Horlogerie Mechanical Tic-Tac ASMR Sound
            if (this.ticTacEnabled && this.timeLeft > 0) {
                window.ambience?.playMechanicalTick(this.timeLeft % 2 === 0);
            }

            // Subtle countdown acoustic cue in the final 5 seconds
            if (this.timeLeft <= 5 && this.timeLeft > 0) {
                window.ambience?.playCountdownTick(500 + (5 - this.timeLeft) * 80);
            }

            if (this.timeLeft % 60 === 0 && this.modes[this.currentModeKey].type === "focus") {
                this.levelSystem?.addXP(10);
            }

            if (this.timeLeft <= 0) {
                this.completeSession();
            }
        }, 1000);

        if (broadcast && this.sync) {
            this.sync.syncPomodoro("start", {
                modeKey: this.currentModeKey,
                timeLeft: this.timeLeft,
                isRunning: true,
                subject: this.currentSubject
            });
        }
        this.renderVirtualStudyDesk([]);
    }

    pauseTimer(broadcast = false) {
        this.isRunning = false;
        document.body.classList.remove("timer-running");
        clearInterval(this.timerInterval);
        const btn = document.getElementById("btn-timer-toggle");
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-play text-xs sm:text-sm text-brand-goldLight ml-0.5 group-hover:scale-110 transition duration-150"></i><span class="gold-text-gradient font-black text-xs sm:text-sm">Reprendre</span>`;
        }

        const statusEl = document.getElementById("timer-status-indicator");
        if (statusEl) {
            statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span class="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">En Pause</span>`;
        }

        if (this.activePact && broadcast && this.sync) {
            this.sync.sendPact("pause_warning", {});
        }

        if (broadcast && this.sync) {
            this.sync.syncPomodoro("pause", {
                modeKey: this.currentModeKey,
                timeLeft: this.timeLeft,
                isRunning: false,
                subject: this.currentSubject
            });
        }
        this.renderVirtualStudyDesk([]);
    }

    resetTimer(broadcast = false) {
        this.pauseTimer(false);
        document.body.classList.remove("timer-running");
        this.timeLeft = this.totalDuration;
        this.updateTimerDisplay();
        const btn = document.getElementById("btn-timer-toggle");
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-play text-xs sm:text-sm text-brand-goldLight ml-0.5 group-hover:scale-110 transition duration-150"></i><span class="gold-text-gradient font-black text-xs sm:text-sm">Commencer</span>`;
        }

        const statusEl = document.getElementById("timer-status-indicator");
        if (statusEl) {
            statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-brand-gold"></span><span class="text-[11px] font-mono font-bold text-brand-goldLight uppercase tracking-wider">Prêt • Focus</span>`;
        }

        if (broadcast && this.sync) {
            this.sync.syncPomodoro("reset", {
                modeKey: this.currentModeKey,
                timeLeft: this.timeLeft,
                isRunning: false,
                subject: this.currentSubject
            });
        }
        this.renderVirtualStudyDesk([]);
    }

    getSubjectCategory(subject) {
        if (!subject) return "Maths";
        const s = subject.toLowerCase();
        if (s.includes("math")) return "Maths";
        if (s.includes("physique")) return "Physique";
        if (s.includes("chimie")) return "Chimie";
        if (s.includes("info") || s.includes("si") || s.includes("ingénieur") || s.includes("algo")) return "Info";
        return "Maths";
    }

    updateStreak() {
        const today = new Date().toISOString().slice(0, 10);
        const streakData = JSON.parse(localStorage.getItem("ss_timer_streak_data") || '{"lastDate":"","streak":0}');
        if (streakData.lastDate === today) {
            return streakData.streak || 1;
        }

        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let newStreak = 1;
        if (streakData.lastDate === yesterday) {
            newStreak = (streakData.streak || 0) + 1;
        }
        streakData.lastDate = today;
        streakData.streak = newStreak;
        localStorage.setItem("ss_timer_streak_data", JSON.stringify(streakData));
        return newStreak;
    }

    completeSession(skipped = false) {
        this.pauseTimer(true);
        window.ambience?.playTibetanGong();

        const mode = this.modes[this.currentModeKey];
        if (!skipped && mode.type === "focus") {
            this.sessionsCompleted++;
            const sessionMins = Math.round(mode.duration / 60);
            this.totalFocusMinutes += sessionMins;
            localStorage.setItem("ss_timer_sessions", this.sessionsCompleted);
            localStorage.setItem("ss_timer_minutes", this.totalFocusMinutes);

            if (this.sync) {
                this.sync.setUser({ focusMinutes: this.totalFocusMinutes });
            }

            // Log STEM subject breakdown
            const cat = this.getSubjectCategory(this.currentSubject);
            this.subjectMinutes[cat] = (this.subjectMinutes[cat] || 0) + sessionMins;
            localStorage.setItem("ss_subject_minutes", JSON.stringify(this.subjectMinutes));

            // Log to Session History
            const histItem = {
                id: Date.now(),
                subject: this.currentSubject,
                category: cat,
                duration: sessionMins,
                time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
                xp: 60
            };
            this.focusHistory.unshift(histItem);
            if (this.focusHistory.length > 30) this.focusHistory.pop();
            localStorage.setItem("ss_focus_history", JSON.stringify(this.focusHistory));

            this.updateStreak();
            this.renderStats();
            this.renderDashboard();

            this.levelSystem?.addXP(60, "Bloc de Deep Work Validé 🎯");
            this.triggerConfetti();

            // Duo Focus Pact Completion Bonus
            if (this.activePact) {
                if (this.sync) {
                    this.sync.sendPact("complete", {});
                }
                this.levelSystem?.addXP(50, "Pacte Focus Duo Honoré 🤝");
                this.triggerConfetti();
                this.showToast("🏆 Pacte Focus Honoré ! Félicitations pour ce lock-in duo (+50 XP) !");
                this.activePact = null;
                const banner = document.getElementById("desk-pact-banner");
                banner?.classList.add("hidden");
                banner?.classList.remove("flex");
                this.renderVirtualStudyDesk([]);
            }
        }

        if (mode.type === "focus") {
            const nextMode = (this.sessionsCompleted % 4 === 0) ? "break15" : "break5";
            this.setTimerMode(nextMode, true);
            this.showToast("🎯 Bloc de révision validé ! Prends ta pause.");
        } else {
            this.setTimerMode("focus25", true);
            this.showToast("⚡ Pause terminée ! Prêt pour le prochain bloc d'excellence ?");
        }
    }

    triggerConfetti() {
        if (window.confetti) {
            window.confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        }
    }

    formatTime(sec) {
        if (typeof sec !== "number" || isNaN(sec) || sec < 0) sec = 0;
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const minStr = String(minutes).padStart(2, '0');
        const secStr = String(seconds).padStart(2, '0');
        const formatted = `${minStr}:${secStr}`;

        const displayEl = document.getElementById("timer-display");
        if (displayEl) {
            displayEl.innerHTML = `<span class="timer-digits">${minStr}</span><span class="timer-colon">:</span><span class="timer-digits">${secStr}</span>`;
        }

        const circle = document.getElementById("timer-progress-circle");
        const progress = this.timeLeft / this.totalDuration;
        if (circle) {
            const radius = circle.r?.baseVal?.value || 126;
            const circumference = 2 * Math.PI * radius;
            circle.style.strokeDasharray = `${circumference}`;
            const offset = circumference * (1 - progress);
            circle.style.strokeDashoffset = offset;
        }

        // Synchronize Active Focus Pact Banner
        if (this.activePact) {
            const pactTimer = document.getElementById("desk-pact-timer-sync");
            const pactBar = document.getElementById("desk-pact-progress-bar");
            if (pactTimer) pactTimer.textContent = formatted;
            if (pactBar && this.activePact.totalSeconds) {
                const pct = Math.max(0, Math.min(100, (this.timeLeft / this.activePact.totalSeconds) * 100));
                pactBar.style.width = `${pct}%`;
            }
        }

        // Keep local user presence fresh for desk peers
        if (this.sync && this.sync.currentUser) {
            this.sync.currentUser.subject = this.currentSubject;
            this.sync.currentUser.timerState = {
                isRunning: this.isRunning,
                timeLeft: this.timeLeft,
                formatted: formatted,
                modeKey: this.currentModeKey,
                isPactActive: !!this.activePact
            };
        }

        document.title = `${formatted} - ${this.modes[this.currentModeKey].label} | StudySouk Academy`;
    }

    // --- TIC-TAC ASMR AUDIO CONTROLS ---
    updateTicTacUI() {
        const sideBtn = document.getElementById("btn-tictac-toggle-side");
        const sideTxt = document.getElementById("tictac-side-text");
        const quickBtn = document.getElementById("btn-tictac-toggle-quick");
        const mobileTxt = document.getElementById("tictac-mobile-text");
        const mobileBtn = document.getElementById("btn-tictac-toggle-mobile");
        const mobileActionTxt = document.getElementById("mobile-action-tictac-label");

        if (sideTxt) sideTxt.textContent = this.ticTacEnabled ? "Tic-Tac ON" : "Tic-Tac OFF";
        if (mobileTxt) mobileTxt.textContent = this.ticTacEnabled ? "Tic-Tac ON" : "Tic-Tac OFF";
        if (mobileActionTxt) mobileActionTxt.textContent = this.ticTacEnabled ? "Tic-Tac ON" : "Tic-Tac OFF";

        if (sideBtn) {
            if (this.ticTacEnabled) {
                sideBtn.classList.remove("opacity-50", "border-brand-borderSubtle");
                sideBtn.classList.add("border-brand-gold/60", "text-brand-goldLight");
            } else {
                sideBtn.classList.remove("border-brand-gold/60", "text-brand-goldLight");
                sideBtn.classList.add("opacity-50", "border-brand-borderSubtle");
            }
        }
        if (quickBtn) {
            if (this.ticTacEnabled) {
                quickBtn.classList.remove("opacity-40");
                quickBtn.classList.add("text-brand-goldLight", "border-brand-gold/50");
            } else {
                quickBtn.classList.add("opacity-40");
                quickBtn.classList.remove("text-brand-goldLight", "border-brand-gold/50");
            }
        }
        if (mobileBtn) {
            if (this.ticTacEnabled) {
                mobileBtn.classList.remove("opacity-50");
                mobileBtn.classList.add("text-brand-goldLight");
            } else {
                mobileBtn.classList.add("opacity-50");
                mobileBtn.classList.remove("text-brand-goldLight");
            }
        }
    }

    toggleTicTac() {
        this.ticTacEnabled = !this.ticTacEnabled;
        localStorage.setItem("ss_tictac_enabled", this.ticTacEnabled);
        this.updateTicTacUI();
        if (this.ticTacEnabled) {
            window.ambience?.playMechanicalTick(false);
            this.showToast("⏱️ Son Tic-Tac mécanique activé");
        } else {
            this.showToast("🔇 Son Tic-Tac désactivé");
        }
    }

    renderStats() {
        const elSessions = document.getElementById("stat-sessions");
        const elMinutes = document.getElementById("stat-minutes");
        if (elSessions) elSessions.textContent = this.sessionsCompleted;
        if (elMinutes) elMinutes.textContent = `${this.totalFocusMinutes} min`;
        this.renderCycleDots();

        // Update Daily Focus Goal Milestones (4 Pomodoro Blocks = 1 Cycle)
        const dailyProgressTxt = document.getElementById("stat-daily-progress-txt");
        const dots = document.querySelectorAll(".daily-block-dot");
        const count = this.sessionsCompleted || 0;
        const currentInCycle = count % 4;
        const cycles = Math.floor(count / 4);

        if (dailyProgressTxt) {
            if (count === 0) {
                dailyProgressTxt.textContent = "0/4 Blocs (0%)";
            } else if (count < 4) {
                dailyProgressTxt.textContent = `${count}/4 Blocs (${count * 25}%)`;
            } else {
                dailyProgressTxt.textContent = `${count}/4 Blocs (🔥 Série x${cycles})`;
            }
        }

        if (dots && dots.length > 0) {
            dots.forEach((dot, idx) => {
                const isFilled = (count >= 4 && currentInCycle === 0) ? true : (idx < currentInCycle || (count >= 4 && idx < 4));
                if (isFilled) {
                    dot.className = "daily-block-dot w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-brand-gold to-amber-300 border border-brand-gold shadow-[0_0_8px_rgba(245,197,66,0.85)] scale-110 transition-all duration-300";
                } else {
                    dot.className = "daily-block-dot w-2.5 h-2.5 rounded-full bg-brand-darker border border-brand-borderSubtle/60 transition-all duration-300";
                }
            });
        }
    }

    rotateQuote() {
        const q = STUDY_QUOTES[Math.floor(Math.random() * STUDY_QUOTES.length)];
        const quoteEl = document.getElementById("study-quote-text");
        const authorEl = document.getElementById("study-quote-author");
        if (quoteEl) quoteEl.textContent = `« ${q.quote} »`;
        if (authorEl) authorEl.textContent = `— ${q.author}`;
    }

    // --- LO-FI RADIO CONTROLS ---
    bindRadioControls() {
        document.getElementById("btn-radio-toggle")?.addEventListener("click", () => {
            window.ambience?.toggleRadio();
        });

        document.getElementById("slider-radio")?.addEventListener("input", (e) => {
            window.ambience?.setRadioVolume(e.target.value);
        });

        const stationBtns = document.querySelectorAll(".radio-station-btn");
        stationBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const stationKey = btn.dataset.station;
                window.ambience?.playRadioStation(stationKey);

                stationBtns.forEach(b => {
                    b.className = "radio-station-btn py-1.5 px-2 rounded-lg bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text text-[11px] font-semibold font-outfit transition flex items-center gap-1.5";
                });
                btn.className = "radio-station-btn py-1.5 px-2 rounded-lg bg-brand-cherry border border-brand-gold text-brand-goldLight text-[11px] font-bold font-outfit transition flex items-center gap-1.5";
            });
        });
    }

    // --- CHRONOMETER DIRECT LO-FI FOCUS CAPSULE ---
    bindChronoLoFiControls() {
        const toggleBtn = document.getElementById("btn-chrono-lofi-toggle");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                if (window.ambience) {
                    window.ambience.toggleRadio();
                    this.syncChronoLoFiUI();
                }
            });
        }

        const quickPills = document.querySelectorAll(".quick-station-pill");
        quickPills.forEach(pill => {
            pill.addEventListener("click", () => {
                const stationKey = pill.dataset.quickStation;
                if (window.ambience && stationKey) {
                    window.ambience.playRadioStation(stationKey);
                    this.syncChronoLoFiUI();
                }
            });
        });

        // Listen for playback events from radioAudio to update live equalizer and play/pause icon
        if (window.ambience && window.ambience.radioAudio) {
            window.ambience.radioAudio.addEventListener("playing", () => this.syncChronoLoFiUI());
            window.ambience.radioAudio.addEventListener("pause", () => this.syncChronoLoFiUI());
            window.ambience.radioAudio.addEventListener("error", () => this.syncChronoLoFiUI());
        }

        // Also wrap/intercept updateRadioUI if ambience exists
        if (window.ambience && typeof window.ambience.updateRadioUI === "function") {
            const origUpdateRadioUI = window.ambience.updateRadioUI.bind(window.ambience);
            window.ambience.updateRadioUI = () => {
                origUpdateRadioUI();
                this.syncChronoLoFiUI();
            };
        }

        this.syncChronoLoFiUI();
    }

    syncChronoLoFiUI() {
        const playIcon = document.getElementById("chrono-lofi-play-icon");
        const eq = document.getElementById("chrono-lofi-equalizer");
        const stationNameEl = document.getElementById("chrono-lofi-station-name");
        const quickPills = document.querySelectorAll(".quick-station-pill");

        const isPlaying = window.ambience ? !!window.ambience.isRadioPlaying : false;
        const currentKey = window.ambience ? (window.ambience.currentStationKey || "chillhop") : "chillhop";

        if (playIcon) {
            playIcon.className = isPlaying
                ? "fa-solid fa-pause text-xs text-brand-gold ml-0"
                : "fa-solid fa-play text-xs text-brand-gold ml-0.5";
        }

        if (eq) {
            if (isPlaying) {
                eq.classList.remove("hidden");
                eq.classList.add("flex");
            } else {
                eq.classList.remove("flex");
                eq.classList.add("hidden");
            }
        }

        const stationObj = (typeof LOFI_STATIONS !== "undefined") ? LOFI_STATIONS[currentKey] : null;
        if (stationNameEl) {
            stationNameEl.textContent = stationObj ? stationObj.name : "Chillhop Study Beats";
        }

        if (quickPills && quickPills.length > 0) {
            quickPills.forEach(pill => {
                const key = pill.dataset.quickStation;
                if (key === currentKey) {
                    pill.className = "quick-station-pill px-2 py-1 rounded-lg bg-brand-cherry border border-brand-gold text-[10px] font-black text-brand-goldLight font-outfit transition cursor-pointer active:scale-95 shadow-sm";
                } else {
                    pill.className = "quick-station-pill px-2 py-1 rounded-lg bg-brand-darker border border-brand-borderSubtle hover:border-brand-gold text-[10px] font-bold text-brand-muted hover:text-white font-outfit transition cursor-pointer active:scale-95";
                }
            });
        }
    }

    // --- AMBIENCE CONTROLS ---
    bindAmbienceControls() {
        const setupSlider = (sliderId, fn) => {
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.addEventListener("input", (e) => fn(e.target.value));
            }
        };

        setupSlider("slider-rain", val => window.ambience?.setRainVolume(val));
        setupSlider("slider-fire", val => window.ambience?.setFireVolume(val));
        setupSlider("slider-cafe", val => window.ambience?.setCafeVolume(val));
        setupSlider("slider-solfeggio", val => window.ambience?.setSolfeggioVolume(val));
        setupSlider("slider-master", val => window.ambience?.setMasterVolume(val));

        // Visual Theme Selector (Canvas Ambient & STEM Formulas)
        const themeBtns = document.querySelectorAll(".canvas-theme-btn");
        themeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                window.ambience?.playClick();
                const theme = btn.dataset.canvasTheme;
                if (this.canvas && this.canvas.setTheme) {
                    this.canvas.setTheme(theme);
                }
                themeBtns.forEach(b => {
                    b.classList.remove("bg-brand-cherry", "border-brand-gold", "text-brand-goldLight", "shadow");
                    b.classList.add("glass-card", "border-brand-borderSubtle", "text-brand-muted");
                });
                btn.classList.add("bg-brand-cherry", "border-brand-gold", "text-brand-goldLight", "shadow");
                btn.classList.remove("glass-card", "border-brand-borderSubtle", "text-brand-muted");
                if (theme === "owl") {
                    document.body.classList.add("theme-owl");
                } else {
                    document.body.classList.remove("theme-owl");
                }
                localStorage.setItem("ss_active_theme", theme);
                this.showToast(`🌌 Atmosphère Visuelle : ${btn.querySelector(".leading-tight")?.textContent || theme}`);
            });
        });

        const updateMuteButtonUI = (isMuted) => {
            const btn = document.getElementById("btn-mute-all");
            if (btn) {
                btn.innerHTML = isMuted 
                    ? `<i class="fa-solid fa-volume-xmark text-rose-400"></i> <span class="hidden sm:inline">Muet</span>`
                    : `<i class="fa-solid fa-volume-high text-brand-gold"></i> <span class="hidden sm:inline">Sons</span>`;
            }
            const mobileMuteTxt = document.getElementById("mobile-action-mute-label");
            if (mobileMuteTxt) mobileMuteTxt.textContent = isMuted ? "Activer le Son" : "Couper le Son";
        };

        document.getElementById("btn-mute-all")?.addEventListener("click", () => {
            const isMuted = window.ambience?.toggleMute();
            updateMuteButtonUI(isMuted);
        });

        // Mobile Quick Actions Menu Toggle & Handlers (<md screens)
        const mobileToggleBtn = document.getElementById("btn-mobile-actions-toggle");
        const mobileActionsMenu = document.getElementById("mobile-actions-menu");
        if (mobileToggleBtn && mobileActionsMenu) {
            mobileToggleBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                window.ambience?.playClick();
                mobileActionsMenu.classList.toggle("hidden");
            });

            document.addEventListener("click", (e) => {
                if (!mobileActionsMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
                    mobileActionsMenu.classList.add("hidden");
                }
            });

            document.getElementById("btn-mobile-tictac-action")?.addEventListener("click", () => {
                mobileActionsMenu.classList.add("hidden");
                this.toggleTicTac();
            });

            document.getElementById("btn-mobile-mute-action")?.addEventListener("click", () => {
                mobileActionsMenu.classList.add("hidden");
                document.getElementById("btn-mute-all")?.click();
            });

            document.getElementById("btn-mobile-zen-action")?.addEventListener("click", () => {
                mobileActionsMenu.classList.add("hidden");
                document.getElementById("btn-zen-mode")?.click();
            });

            document.getElementById("btn-mobile-invite-action")?.addEventListener("click", () => {
                mobileActionsMenu.classList.add("hidden");
                document.getElementById("btn-invite-room")?.click();
            });

            document.getElementById("btn-mobile-shortcuts-action")?.addEventListener("click", () => {
                mobileActionsMenu.classList.add("hidden");
                document.getElementById("btn-shortcuts")?.click();
            });
        }
    }

    // --- MODALS & PROFILE ---
    bindModals() {
        // 1. Roster Modal
        const rosterModal = document.getElementById("roster-modal");
        document.getElementById("btn-room-roster")?.addEventListener("click", () => {
            window.ambience?.playClick();
            if (this.sync) {
                const users = Array.from(this.sync.roster.values()).map(m => ({
                    ...m.user,
                    isSelf: !!m.isSelf
                }));
                this.renderRosterModal(users);
            }
            rosterModal?.classList.remove("hidden");
            rosterModal?.classList.add("flex");
        });
        document.getElementById("btn-close-roster")?.addEventListener("click", () => {
            rosterModal?.classList.add("hidden");
            rosterModal?.classList.remove("flex");
        });
        rosterModal?.addEventListener("click", (e) => {
            if (e.target === rosterModal) {
                rosterModal.classList.add("hidden");
                rosterModal.classList.remove("flex");
            }
        });

        // 2. Profile Modal
        const profileModal = document.getElementById("profile-modal");
        const nameInput = document.getElementById("profile-name-input");
        const filiereSelect = document.getElementById("profile-filiere-select");
        const schoolInput = document.getElementById("profile-school-input");
        const bioInput = document.getElementById("profile-bio-input");
        const customAvatarInput = document.getElementById("profile-custom-avatar-input");
        const matriculeTag = document.getElementById("profile-matricule-tag");
        const avatarsGrid = document.getElementById("avatar-presets-grid");
        const roleEleveBtn = document.getElementById("role-choice-eleve");
        const roleEtudiantBtn = document.getElementById("role-choice-etudiant");

        let currentRoleType = localStorage.getItem("ss_user_role_type") || "Étudiant";
        let selectedAvatarUrl = this.discordUser?.avatar || AVATAR_PRESETS[0].url;

        const setRoleType = (type) => {
            currentRoleType = type;
            if (roleEleveBtn && roleEtudiantBtn) {
                if (type === "Élève") {
                    roleEleveBtn.className = "role-type-btn py-2 px-3 rounded-xl border border-brand-gold bg-brand-cherry text-brand-goldLight text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition shadow";
                    roleEtudiantBtn.className = "role-type-btn py-2 px-3 rounded-xl border border-brand-borderSubtle bg-brand-darker text-brand-muted hover:text-white text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition";
                } else {
                    roleEtudiantBtn.className = "role-type-btn py-2 px-3 rounded-xl border border-brand-gold bg-brand-cherry text-brand-goldLight text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition shadow";
                    roleEleveBtn.className = "role-type-btn py-2 px-3 rounded-xl border border-brand-borderSubtle bg-brand-darker text-brand-muted hover:text-white text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition";
                }
            }
            updateLivePreview();
        };

        if (roleEleveBtn) roleEleveBtn.addEventListener("click", () => setRoleType("Élève"));
        if (roleEtudiantBtn) roleEtudiantBtn.addEventListener("click", () => setRoleType("Étudiant"));

        const updateLivePreview = () => {
            const previewName = document.getElementById("profile-live-name");
            const previewBadge = document.getElementById("profile-live-badge");
            const previewBio = document.getElementById("profile-live-bio");
            const previewAvatar = document.getElementById("profile-live-avatar");

            const selectedFiliere = filiereSelect?.value || "CPGE MP*";
            // Auto-switch role if filiere is obviously high-school vs higher ed
            if (selectedFiliere.includes("1BAC") || selectedFiliere.includes("2BAC") || selectedFiliere.includes("Tronc")) {
                currentRoleType = "Élève";
                if (roleEleveBtn && roleEtudiantBtn) {
                    roleEleveBtn.className = "role-type-btn py-2 px-3 rounded-xl border border-brand-gold bg-brand-cherry text-brand-goldLight text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition shadow";
                    roleEtudiantBtn.className = "role-type-btn py-2 px-3 rounded-xl border border-brand-borderSubtle bg-brand-darker text-brand-muted hover:text-white text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition";
                }
            }

            if (previewName) previewName.textContent = nameInput?.value.trim() || (currentRoleType === "Élève" ? "Élève StudySouk" : "Étudiant StudySouk");
            if (previewBadge) previewBadge.textContent = `${currentRoleType === "Élève" ? "🎒" : "🎓"} ${selectedFiliere}`;
            if (previewBio) previewBio.textContent = bioInput?.value.trim() ? `« ${bioInput.value.trim()} »` : "« La rigueur surclasse l'improvisation »";
            if (previewAvatar) {
                const customUrl = customAvatarInput?.value.trim();
                previewAvatar.src = customUrl || selectedAvatarUrl || "assets/logo.png";
            }
        };

        if (nameInput) nameInput.addEventListener("input", updateLivePreview);
        if (filiereSelect) filiereSelect.addEventListener("change", updateLivePreview);
        if (schoolInput) schoolInput.addEventListener("input", updateLivePreview);
        if (bioInput) bioInput.addEventListener("input", updateLivePreview);

        document.getElementById("user-profile-trigger")?.addEventListener("click", () => {
            window.ambience?.playClick();
            if (nameInput) nameInput.value = this.discordUser.name || "";
            if (filiereSelect) filiereSelect.value = this.discordUser.filiere || "CPGE MP*";
            if (schoolInput) schoolInput.value = localStorage.getItem("ss_user_school") || "";
            if (bioInput) bioInput.value = this.discordUser.bio || "";
            if (matriculeTag) matriculeTag.textContent = this.discordUser.matricule || "SS-2026-0001";
            setRoleType(localStorage.getItem("ss_user_role_type") || (this.discordUser.filiere?.includes("BAC") ? "Élève" : "Étudiant"));
            if (customAvatarInput) {
                const isPreset = AVATAR_PRESETS.some(p => p.url === this.discordUser.avatar);
                customAvatarInput.value = isPreset ? "" : (this.discordUser.avatar || "");
            }
            selectedAvatarUrl = this.discordUser.avatar;

            if (avatarsGrid) {
                avatarsGrid.querySelectorAll(".avatar-pick-btn").forEach(btn => {
                    if (btn.dataset.avatar === selectedAvatarUrl) {
                        btn.classList.add("border-brand-gold", "bg-brand-cherry/80");
                    } else {
                        btn.classList.remove("border-brand-gold", "bg-brand-cherry/80");
                    }
                });
            }

            updateLivePreview();
            profileModal?.classList.remove("hidden");
            profileModal?.classList.add("flex");
        });

        document.getElementById("btn-close-profile")?.addEventListener("click", () => {
            profileModal?.classList.add("hidden");
            profileModal?.classList.remove("flex");
        });
        profileModal?.addEventListener("click", (e) => {
            if (e.target === profileModal) {
                profileModal.classList.add("hidden");
                profileModal.classList.remove("flex");
            }
        });

        if (avatarsGrid) {
            avatarsGrid.innerHTML = AVATAR_PRESETS.map((p) => `
                <button type="button" data-avatar="${p.url}" data-name="${p.name}" class="avatar-pick-btn p-1.5 rounded-xl bg-brand-darker border border-brand-border hover:border-brand-gold transition flex flex-col items-center gap-1">
                    <img src="${p.url}" alt="${p.name}" class="w-8 h-8 rounded-full pointer-events-none object-cover">
                    <span class="text-[10px] font-bold text-brand-goldLight truncate max-w-full pointer-events-none">${p.name}</span>
                </button>
            `).join("");

            avatarsGrid.querySelectorAll(".avatar-pick-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    selectedAvatarUrl = btn.dataset.avatar;
                    if (customAvatarInput) customAvatarInput.value = "";
                    if (nameInput && (!nameInput.value.trim() || nameInput.value.includes("StudySouk"))) {
                        nameInput.value = btn.dataset.name;
                    }
                    avatarsGrid.querySelectorAll(".avatar-pick-btn").forEach(b => b.classList.remove("border-brand-gold", "bg-brand-cherry/80"));
                    btn.classList.add("border-brand-gold", "bg-brand-cherry/80");
                    updateLivePreview();
                });
            });
        }

        if (customAvatarInput) {
            customAvatarInput.addEventListener("input", (e) => {
                const url = e.target.value.trim();
                if (url) {
                    selectedAvatarUrl = url;
                    avatarsGrid?.querySelectorAll(".avatar-pick-btn").forEach(b => b.classList.remove("border-brand-gold", "bg-brand-cherry/80"));
                    updateLivePreview();
                }
            });
        }

        document.getElementById("btn-save-profile")?.addEventListener("click", () => {
            const newName = nameInput ? (nameInput.value.trim() || this.discordUser.name) : this.discordUser.name;
            const newFiliere = filiereSelect ? (filiereSelect.value || "CPGE MP*") : "CPGE MP*";
            const newSchool = schoolInput ? schoolInput.value.trim() : "";
            const newBio = bioInput ? (bioInput.value.trim() || "Objectif Concours 2026") : "Objectif Concours 2026";
            const customUrl = customAvatarInput ? customAvatarInput.value.trim() : "";
            const newAvatar = customUrl || selectedAvatarUrl || this.discordUser.avatar;

            this.discordUser.name = newName;
            this.discordUser.filiere = newFiliere;
            this.discordUser.bio = newBio;
            this.discordUser.avatar = newAvatar;
            this.discordUser.school = newSchool;
            this.discordUser.roleType = currentRoleType;

            localStorage.setItem("ss_user_name", newName);
            localStorage.setItem("ss_user_filiere", newFiliere);
            localStorage.setItem("ss_user_school", newSchool);
            localStorage.setItem("ss_user_role_type", currentRoleType);
            localStorage.setItem("ss_user_bio", newBio);
            localStorage.setItem("ss_user_avatar", newAvatar);

            const userAvatar = document.getElementById("user-avatar");
            const userName = document.getElementById("user-name");
            const userFiliere = document.getElementById("user-filiere");
            if (userAvatar) userAvatar.src = newAvatar;
            if (userName) userName.textContent = newName;
            if (userFiliere) userFiliere.textContent = newFiliere;

            if (this.sync) {
                const levelInfo = this.levelSystem?.getLevelInfo();
                this.sync.setUser({
                    name: newName,
                    avatar: newAvatar,
                    filiere: newFiliere,
                    bio: newBio,
                    matricule: this.discordUser.matricule,
                    level: levelInfo?.level || 1,
                    rankTitle: levelInfo?.rank?.title || "Apprenti STEM",
                    focusMinutes: this.totalFocusMinutes,
                    activeSubject: this.currentSubject
                });
            }

            profileModal?.classList.add("hidden");
            profileModal?.classList.remove("flex");
            window.ambience?.playSuccess();
            this.showToast(`✨ Profil STEM mis à jour : ${newName} (${newFiliere}) !`);
        });

        // 3. Invite & Join Room Modal
        const inviteModal = document.getElementById("invite-modal");
        const currentRoomCodeEl = document.getElementById("current-room-code");

        document.getElementById("btn-invite-room")?.addEventListener("click", () => {
            window.ambience?.playClick();
            if (currentRoomCodeEl && this.sync) {
                currentRoomCodeEl.textContent = this.sync.roomId;
            }
            inviteModal?.classList.remove("hidden");
            inviteModal?.classList.add("flex");
        });

        document.getElementById("btn-close-invite")?.addEventListener("click", () => {
            inviteModal?.classList.add("hidden");
            inviteModal?.classList.remove("flex");
        });
        inviteModal?.addEventListener("click", (e) => {
            if (e.target === inviteModal) {
                inviteModal.classList.add("hidden");
                inviteModal.classList.remove("flex");
            }
        });

        // 4. Countdowns & Concours Right Side Drawer ("f jnb l-imn w tkon hidden fiha gha bouton")
        const sidebar = document.getElementById("panel-countdowns-sidebar");
        const backdrop = document.getElementById("countdown-drawer-backdrop");

        const openSidebarDrawer = () => {
            window.ambience?.playClick();
            sidebar?.classList.add("drawer-open");
            backdrop?.classList.remove("hidden");
            backdrop?.classList.add("drawer-open");
        };

        const closeSidebarDrawer = () => {
            sidebar?.classList.remove("drawer-open");
            backdrop?.classList.add("hidden");
            backdrop?.classList.remove("drawer-open");
        };

        document.getElementById("btn-open-countdowns")?.addEventListener("click", openSidebarDrawer);
        document.getElementById("btn-sidebar-countdown-trigger")?.addEventListener("click", openSidebarDrawer);
        document.getElementById("btn-mobile-sidebar-tab")?.addEventListener("click", openSidebarDrawer);
        document.getElementById("mobile-countdown-badge")?.addEventListener("click", openSidebarDrawer);
        document.getElementById("btn-close-countdown-drawer")?.addEventListener("click", closeSidebarDrawer);
        document.getElementById("btn-close-mobile-drawer")?.addEventListener("click", closeSidebarDrawer);
        backdrop?.addEventListener("click", closeSidebarDrawer);

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                if (sidebar?.classList.contains("drawer-open")) {
                    closeSidebarDrawer();
                }
                const toolsModal = document.getElementById("modal-tools-hub");
                if (toolsModal && !toolsModal.classList.contains("hidden")) {
                    toolsModal.classList.add("hidden");
                    toolsModal.classList.remove("flex");
                }
                const examModal = document.getElementById("modal-exam-hub");
                if (examModal && !examModal.classList.contains("hidden")) {
                    examModal.classList.add("hidden");
                    examModal.classList.remove("flex");
                }
            }
        });

        document.getElementById("btn-copy-room-link")?.addEventListener("click", () => {
            const url = new URL(window.location.href);
            if (this.sync) {
                url.searchParams.set("room", this.sync.roomId);
            }
            navigator.clipboard?.writeText(url.toString());
            window.ambience?.playSuccess();
            this.showToast("📋 Lien de la salle copié dans le presse-papier !");
        });

        document.getElementById("btn-discord-open-invite")?.addEventListener("click", async () => {
            window.ambience?.playClick();
            if (this.isInDiscord && this.sdk && this.sdk.commands && this.sdk.commands.openInviteDialog) {
                try {
                    await this.sdk.commands.openInviteDialog();
                    return;
                } catch (err) {
                    console.warn("[DiscordSDK] openInviteDialog:", err);
                }
            }
            const url = new URL(window.location.href);
            if (this.sync) {
                url.searchParams.set("room", this.sync.roomId);
            }
            navigator.clipboard?.writeText(url.toString());
            window.ambience?.playSuccess();
            this.showToast("📋 Lien de la session copié !");
        });

        document.getElementById("btn-do-join-room")?.addEventListener("click", () => {
            const input = document.getElementById("input-join-room-code");
            const code = input ? input.value.trim() : "";
            if (code && this.sync) {
                window.ambience?.playSuccess();
                this.sync.joinRoom(code);
                if (currentRoomCodeEl) currentRoomCodeEl.textContent = this.sync.roomId;
                input.value = "";
                inviteModal?.classList.add("hidden");
                inviteModal?.classList.remove("flex");
                this.showToast(`🚪 Tu as rejoint la salle : ${this.sync.roomId}`);
            }
        });
    }

    renderRosterModal(users) {
        const list = document.getElementById("roster-users-list");
        if (!list) return;

        if (!users || users.length === 0) {
            list.innerHTML = `
                <div class="text-center text-xs text-brand-muted py-5 font-outfit">
                    <i class="fa-solid fa-user-astronaut text-2xl text-brand-gold/40 mb-2 block"></i>
                    Toi seul es connecté dans cette salle vocale pour le moment.
                </div>`;
            return;
        }

        list.innerHTML = users.map(u => {
            const safeName = (u.name || "Étudiant").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
            const safeId = (u.id || "").replace(/"/g, "&quot;");
            const filiere = u.filiere || "CPGE MP*";
            const subject = u.activeSubject || "STEM Focus";
            const mins = u.focusMinutes || 0;
            const avatar = (u.avatar && !u.avatar.includes("api.dicebear.com")) ? u.avatar : "assets/avatars/default.svg";

            return `
                <div class="flex items-center justify-between p-3 rounded-2xl bg-brand-darker border border-brand-borderSubtle hover:border-brand-gold/60 transition gap-2 group shadow-sm">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div class="relative shrink-0">
                            <img src="${avatar}" onerror="this.onerror=null;this.src='assets/avatars/default.svg'" class="w-10 h-10 rounded-full border-2 border-brand-gold bg-brand-card object-cover group-hover:scale-105 transition shadow">
                            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-brand-darker"></span>
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="text-sm font-extrabold text-white font-outfit truncate max-w-[120px]">${safeName}</span>
                                ${u.isSelf ? '<span class="text-xs bg-brand-cherry text-brand-goldLight px-2 py-0.5 rounded font-outfit font-black border border-brand-gold/40">Moi</span>' : ''}
                                <span class="text-xs font-mono px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-goldLight border border-brand-gold/40 font-bold">${filiere}</span>
                            </div>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-xs text-white font-sans truncate max-w-[130px] flex items-center gap-1.5 font-medium">
                                    <i class="fa-solid fa-book-open text-xs text-brand-gold"></i> ${subject}
                                </span>
                                <span class="text-xs font-mono text-brand-goldLight font-bold">• ${mins}m</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button onclick="window.studyApp.inspectStudentCard('${safeId}')" title="Inspecter la Carte d'Étudiant" class="px-2.5 py-1.5 rounded-xl bg-brand-card hover:bg-brand-gold/20 text-brand-goldLight border border-brand-border text-xs font-outfit font-bold transition active:scale-95 flex items-center gap-1 shadow-sm">
                            <i class="fa-solid fa-id-card"></i>
                            <span class="hidden sm:inline text-xs">Carte</span>
                        </button>
                        ${!u.isSelf ? `
                        <button onclick="window.studyApp.challengeUserToDuel('${safeId}', '${safeName}')" title="Défier en Duel STEM 1v1" class="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border border-amber-400/50 text-xs font-outfit font-black transition active:scale-95 shadow flex items-center gap-1">
                            <i class="fa-solid fa-bolt"></i>
                            <span class="hidden sm:inline text-xs">Duel</span>
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join("");
    }

    inspectStudentCard(userId) {
        window.ambience?.playClick();
        let targetUser = null;
        if (this.sync && this.sync.roster) {
            const member = this.sync.roster.get(userId);
            if (member) {
                targetUser = { ...member.user, isSelf: !!member.isSelf };
            }
        }
        if (!targetUser) {
            if (userId === this.discordUser?.id || userId === this.sync?.clientId) {
                targetUser = { ...this.discordUser, isSelf: true };
            }
        }
        document.getElementById("roster-modal")?.classList.add("hidden");
        document.getElementById("roster-modal")?.classList.remove("flex");

        this.levelSystem?.openStudentCardModal(targetUser);
    }

    challengeUserToDuel(userId, userName) {
        window.ambience?.playClick();
        document.getElementById("roster-modal")?.classList.add("hidden");
        document.getElementById("roster-modal")?.classList.remove("flex");
        document.getElementById("student-card-modal")?.classList.add("hidden");
        document.getElementById("student-card-modal")?.classList.remove("flex");

        this.switchTab("tab-duel");

        if (this.duel) {
            this.duel.mode = "multiplayer";
            this.duel.launchMultiplayerChallenge();
            this.showToast(`⚔️ Défi STEM 1v1 lancé contre ${userName || 'l\'étudiant'} !`);
        }
    }

    // --- TABLE D'ÉTUDE VIRTUELLE & DUO FOCUS PACT ---
    renderVirtualStudyDesk(users = []) {
        const grid = document.getElementById("desk-seats-grid");
        if (!grid) return;

        // If no user list supplied, pull from active RoomSync roster
        if ((!users || users.length === 0) && this.sync && this.sync.roster) {
            users = Array.from(this.sync.roster.values()).map(m => ({
                ...m.user,
                isSelf: !!m.isSelf
            }));
        }

        const selfUser = users.find(u => u.isSelf) || {
            name: this.discordUser?.name || "Toi",
            avatar: this.discordUser?.avatar || "assets/avatars/default.svg",
            filiere: this.discordUser?.filiere || "CPGE",
            school: this.discordUser?.school || "Maroc",
            isSelf: true
        };

        const partnerUsers = users.filter(u => !u.isSelf);

        // Update Desk Status Pill
        const badge = document.getElementById("desk-status-badge");
        if (badge) {
            if (partnerUsers.length === 0) {
                badge.textContent = "1 assis (Toi)";
            } else if (partnerUsers.length === 1) {
                badge.textContent = "2 assis (Duo)";
            } else {
                badge.textContent = `${users.length} assis (Table)`;
            }
        }

        const selfAvatar = (selfUser.avatar && !selfUser.avatar.includes("api.dicebear.com"))
            ? selfUser.avatar
            : (this.discordUser?.avatar || "assets/avatars/default.svg");
        const safeSelfName = (selfUser.name || "Étudiant").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        const selfSubject = this.currentSubject ? this.currentSubject.split(":")[0] || this.currentSubject : "Deep Work";

        // Seat 1: Toi (Self Pod)
        const selfCardHtml = `
            <div class="relative p-2.5 rounded-xl bg-brand-darker/95 border ${this.isRunning ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-brand-gold/40'} flex flex-col justify-between gap-2 shadow-inner group transition-all duration-300">
                <div class="flex items-center gap-2">
                    <div class="relative shrink-0">
                        <img src="${selfAvatar}" onerror="this.onerror=null;this.src='assets/avatars/default.svg'"
                            class="w-9 h-9 rounded-full ${this.isRunning ? 'border-2 border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'border border-brand-gold/70'} object-cover bg-brand-card shadow-sm transition-all duration-300">
                        <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${this.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'} border border-brand-darker"></span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-xs font-black text-white font-outfit truncate max-w-[110px]">${safeSelfName}</span>
                            <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-brand-cherry text-brand-goldLight border border-brand-gold/30">Toi</span>
                            ${this.isRunning ? '<span class="text-[8px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-500/40 animate-pulse flex items-center gap-0.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE</span>' : ''}
                        </div>
                        <div class="text-[10px] text-brand-muted truncate font-outfit">${selfUser.filiere || "CPGE"}</div>
                    </div>
                </div>

                <div class="flex items-center justify-between gap-1 pt-1.5 border-t border-brand-borderSubtle/50 text-[10px]">
                    <span class="font-outfit font-bold text-brand-goldLight truncate max-w-[105px] flex items-center gap-1" title="${this.currentSubject}">
                        <i class="fa-solid fa-graduation-cap text-[9px] text-brand-gold"></i>
                        <span>${selfSubject}</span>
                    </span>
                    <span class="font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${this.isRunning ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-brand-card text-brand-muted border border-brand-borderSubtle'}">
                        ${this.isRunning ? '🟢' : '⏸️'} ${this.formatTime(this.timeLeft)}
                    </span>
                </div>
            </div>
        `;

        // Seat 2: Binôme (Connected Partner or Empty Desk Seat)
        let partnersHtml = "";
        if (partnerUsers.length > 0) {
            partnersHtml = partnerUsers.map(p => {
                const partnerAvatar = (p.avatar && !p.avatar.includes("api.dicebear.com")) ? p.avatar : "assets/avatars/default.svg";
                const safeName = (p.name || "Binôme").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
                const safeId = (p.id || "").replace(/"/g, "&quot;");
                const partnerFiliere = p.filiere || "CPGE";
                const pSubj = p.subject || p.activeSubject || "STEM Focus";
                const pSubjShort = pSubj.split(":")[0] || pSubj;
                const pTimer = p.timerState || {};
                const pIsRunning = !!pTimer.isRunning;
                const pTimeStr = pTimer.formatted || (typeof pTimer.timeLeft === "number" ? this.formatTime(pTimer.timeLeft) : "25:00");

                return `
                    <div class="relative p-2.5 rounded-xl bg-brand-cherryDark/35 border ${pIsRunning ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-brand-gold/60'} flex flex-col justify-between gap-2 shadow-md transition-all duration-300">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2 min-w-0">
                                <div class="relative shrink-0">
                                    <img src="${partnerAvatar}" onerror="this.onerror=null;this.src='assets/avatars/default.svg'"
                                        class="w-9 h-9 rounded-full ${pIsRunning ? 'border-2 border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'border border-brand-gold'} object-cover bg-brand-card shadow-sm transition-all duration-300">
                                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${pIsRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'} border border-brand-darker"></span>
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-1 flex-wrap">
                                        <span class="text-xs font-black text-brand-goldLight font-outfit truncate max-w-[100px]">${safeName}</span>
                                        <span class="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-gold/20 text-brand-goldLight font-bold">Binôme</span>
                                        ${pIsRunning ? '<span class="text-[8px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-500/40 animate-pulse flex items-center gap-0.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE</span>' : ''}
                                    </div>
                                    <div class="text-[10px] text-brand-muted truncate font-outfit">${partnerFiliere}</div>
                                </div>
                            </div>

                            <button onclick="window.studyApp.inspectStudentCard('${safeId}')" title="Inspecter la Carte d'Étudiant"
                                class="w-6 h-6 rounded-lg bg-brand-card hover:bg-brand-gold/20 text-brand-goldLight border border-brand-borderSubtle flex items-center justify-center text-[10px] transition cursor-pointer active:scale-90 shrink-0">
                                <i class="fa-solid fa-id-card"></i>
                            </button>
                        </div>

                        <div class="flex items-center justify-between gap-1 pt-1.5 border-t border-brand-borderSubtle/50 text-[10px]">
                            <span class="font-outfit font-bold text-brand-silver truncate max-w-[105px] flex items-center gap-1" title="${pSubj}">
                                <i class="fa-solid fa-book-open text-[9px] text-brand-gold"></i>
                                <span>${pSubjShort}</span>
                            </span>
                            <span class="font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${pIsRunning ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-brand-card text-brand-muted border border-brand-borderSubtle'}">
                                ${pIsRunning ? '🟢' : '⏸️'} ${pTimeStr}
                            </span>
                        </div>
                    </div>
                `;
            }).join("");
        } else {
            // Empty Seat Placeholder
            partnersHtml = `
                <div onclick="window.studyApp.inviteToDesk()" title="Clique pour copier le lien d'invitation"
                    class="relative p-2.5 rounded-xl border border-dashed border-brand-gold/30 hover:border-brand-gold/80 bg-black/20 hover:bg-brand-cherry/20 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition group shadow-inner">
                    <div class="w-8 h-8 rounded-full bg-brand-darker border border-brand-borderSubtle group-hover:border-brand-gold flex items-center justify-center text-brand-gold/60 group-hover:text-brand-gold transition group-hover:scale-110">
                        <i class="fa-solid fa-user-plus text-xs"></i>
                    </div>
                    <div class="text-xs font-bold text-white font-outfit">Place Binôme Libre</div>
                    <div class="text-[10px] text-brand-muted font-outfit group-hover:text-brand-goldLight transition flex items-center gap-1">
                        <i class="fa-solid fa-link text-[9px]"></i> Inviter un camarade
                    </div>
                </div>
            `;
        }

        grid.innerHTML = selfCardHtml + partnersHtml;
    }

    bindDeskControls() {
        // Invite button
        document.getElementById("btn-desk-invite")?.addEventListener("click", () => {
            this.inviteToDesk();
        });

        // Focus Pact proposal button
        document.getElementById("btn-desk-focus-pact")?.addEventListener("click", () => {
            this.sendPactProposal();
        });

        // Desk micro-reaction buttons
        document.querySelectorAll(".desk-reaction-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const emoji = btn.dataset.emoji || "🔥";
                window.ambience?.playPop();

                let emojiKey = "ss_fire";
                if (emoji === "🔥") emojiKey = "ss_fire";
                else if (emoji === "👏") emojiKey = "ss_crown";
                else if (emoji === "☕") emojiKey = "ss_coffee";
                else if (emoji === "💪") emojiKey = "ss_lightning";
                else if (emoji === "🧠") emojiKey = "ss_brain";

                if (this.sync) {
                    this.sync.sendReaction(emojiKey);
                }
                if (this.reactions) {
                    this.reactions.spawnReaction(emojiKey, this.sync?.currentUser || { name: "Toi" });
                }
                this.showToast(`✨ Tu as envoyé l'encouragement : ${emoji}`);
            });
        });

        // Modal Focus Pact action buttons
        const modal = document.getElementById("modal-focus-pact-invite");
        document.getElementById("btn-pact-accept")?.addEventListener("click", () => {
            if (!this.pendingPactInvite) {
                modal?.classList.add("hidden");
                modal?.classList.remove("flex");
                return;
            }

            const invite = this.pendingPactInvite;
            modal?.classList.add("hidden");
            modal?.classList.remove("flex");

            if (this.sync) {
                this.sync.sendPact("accept", {
                    targetId: invite.author?.id,
                    durationMins: invite.durationMins || 25,
                    subject: invite.subject || this.currentSubject
                });
            }

            this.activePact = {
                partner: invite.author,
                durationMins: invite.durationMins || 25,
                totalSeconds: (invite.durationMins || 25) * 60,
                startedAt: Date.now()
            };
            this.pendingPactInvite = null;

            this.setTimerMode("focus25", false);
            this.startTimer(false);

            const banner = document.getElementById("desk-pact-banner");
            banner?.classList.remove("hidden");
            banner?.classList.add("flex");
            const partnerTxt = document.getElementById("desk-pact-partner-name");
            if (partnerTxt) partnerTxt.textContent = `En symbiose avec ${invite.author?.name || "ton binôme"}`;

            window.ambience?.playSuccess();
            this.triggerConfetti();
            this.showToast("🤝 Pacte Focus Scellé ! 25 minutes de concentration totale !");
            this.renderVirtualStudyDesk([]);
        });

        document.getElementById("btn-pact-decline")?.addEventListener("click", () => {
            if (this.pendingPactInvite && this.sync) {
                this.sync.sendPact("decline", {
                    targetId: this.pendingPactInvite.author?.id
                });
            }
            this.pendingPactInvite = null;
            modal?.classList.add("hidden");
            modal?.classList.remove("flex");
            this.showToast("Pacte décliné.");
        });

        modal?.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
            }
        });
    }

    inviteToDesk() {
        window.ambience?.playSuccess();
        const url = new URL(window.location.href);
        if (this.sync && this.sync.roomId) {
            url.searchParams.set("room", this.sync.roomId);
        }
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url.toString()).then(() => {
                this.showToast("📋 Lien de la table copié ! Partage-le à ton camarade de prépa.");
            }).catch(() => {
                this.showToast(`Salle : ${this.sync?.roomId || "Générale"}`);
            });
        } else {
            this.showToast(`Salle : ${this.sync?.roomId || "Générale"}`);
        }
    }

    sendPactProposal() {
        window.ambience?.playClick();
        const partnerUsers = (this.sync?.roster ? Array.from(this.sync.roster.values()) : [])
            .filter(m => !m.isSelf && m.user);

        if (partnerUsers.length === 0) {
            this.inviteToDesk();
            this.showToast("👥 Invite d'abord un binôme à ta table pour sceller un pacte focus !");
            return;
        }

        const partner = partnerUsers[0].user;
        if (this.sync) {
            this.sync.sendPact("invite", {
                targetId: partner.id,
                durationMins: 25,
                subject: this.currentSubject
            });
            this.showToast(`📨 Proposition de Pacte Focus (25m) envoyée à ${partner.name} !`);
        }
    }

    // --- DRAGGABLE CURSOR WIDGETS ---
    bindDraggableWidgets() {
        // 1. Floating Nabras AI Logo Mascot
        const fab = document.getElementById("btn-floating-nabras");
        if (fab) {
            this.makeDraggable(fab, "ss_nabras_fab_pos");
        }

        // 2. Countdown Sidebar Edge Capsule Trigger
        const cdTrigger = document.getElementById("btn-sidebar-countdown-trigger");
        if (cdTrigger) {
            this.makeDraggableVertical(cdTrigger, "ss_cd_trigger_pos");
        }
    }

    makeDraggable(el, storageKey) {
        if (!el) return;

        let isDragging = false;
        let hasMoved = false;
        let startPointerX = 0;
        let startPointerY = 0;
        let initialLeft = 0;
        let initialTop = 0;

        // Restore saved position if present
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const pos = JSON.parse(saved);
                const elW = el.offsetWidth || 40;
                const elH = el.offsetHeight || 40;
                const maxLeft = Math.max(8, window.innerWidth - elW - 8);
                const maxTop = Math.max(8, window.innerHeight - elH - 8);
                const safeX = Math.min(Math.max(8, pos.x), maxLeft);
                const safeY = Math.min(Math.max(8, pos.y), maxTop);

                el.style.left = `${safeX}px`;
                el.style.top = `${safeY}px`;
                el.style.right = "auto";
                el.style.bottom = "auto";
            } catch (e) {
                // Ignore parse errors
            }
        }

        el.style.touchAction = "none";
        el.classList.add("cursor-grab");

        const onPointerDown = (e) => {
            if (e.button && e.button !== 0) return; // Only main button

            isDragging = true;
            hasMoved = false;
            startPointerX = e.clientX;
            startPointerY = e.clientY;

            const rect = el.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            try {
                el.setPointerCapture(e.pointerId);
            } catch (err) {}

            el.classList.add("cursor-grabbing");
            el.classList.remove("cursor-grab");

            el.addEventListener("pointermove", onPointerMove);
            el.addEventListener("pointerup", onPointerUp);
            el.addEventListener("pointercancel", onPointerUp);
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startPointerX;
            const dy = e.clientY - startPointerY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasMoved = true;
            }

            if (hasMoved) {
                let nextX = initialLeft + dx;
                let nextY = initialTop + dy;

                const elW = el.offsetWidth || 40;
                const elH = el.offsetHeight || 40;
                const maxLeft = Math.max(8, window.innerWidth - elW - 8);
                const maxTop = Math.max(8, window.innerHeight - elH - 8);
                nextX = Math.min(Math.max(8, nextX), maxLeft);
                nextY = Math.min(Math.max(8, nextY), maxTop);

                el.style.left = `${nextX}px`;
                el.style.top = `${nextY}px`;
                el.style.right = "auto";
                el.style.bottom = "auto";
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;

            try {
                el.releasePointerCapture(e.pointerId);
            } catch (err) {}

            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerup", onPointerUp);
            el.removeEventListener("pointercancel", onPointerUp);

            el.classList.remove("cursor-grabbing");
            el.classList.add("cursor-grab");

            if (hasMoved) {
                const rect = el.getBoundingClientRect();
                localStorage.setItem(storageKey, JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }));

                const suppressClick = (clickEvent) => {
                    clickEvent.stopImmediatePropagation();
                    clickEvent.preventDefault();
                    el.removeEventListener("click", suppressClick, true);
                };
                el.addEventListener("click", suppressClick, true);
            }
        };

        el.addEventListener("pointerdown", onPointerDown);
    }

    makeDraggableVertical(el, storageKey) {
        if (!el) return;

        let isDragging = false;
        let hasMoved = false;
        let startPointerY = 0;
        let initialTop = 0;

        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const pos = JSON.parse(saved);
                const elH = el.offsetHeight || 80;
                const maxTop = Math.max(50, window.innerHeight - elH - 50);
                const safeY = Math.min(Math.max(50, pos.y), maxTop);
                el.style.top = `${safeY}px`;
                el.style.transform = "none";
            } catch (e) {}
        }

        el.style.touchAction = "none";

        const onPointerDown = (e) => {
            if (e.button && e.button !== 0) return;
            isDragging = true;
            hasMoved = false;
            startPointerY = e.clientY;
            initialTop = el.getBoundingClientRect().top;

            try {
                el.setPointerCapture(e.pointerId);
            } catch (err) {}

            el.classList.add("cursor-grabbing");
            el.classList.remove("cursor-pointer");

            el.addEventListener("pointermove", onPointerMove);
            el.addEventListener("pointerup", onPointerUp);
            el.addEventListener("pointercancel", onPointerUp);
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            const dy = e.clientY - startPointerY;
            if (Math.abs(dy) > 4) hasMoved = true;
            if (hasMoved) {
                let nextY = initialTop + dy;
                const elH = el.offsetHeight || 80;
                const maxTop = Math.max(50, window.innerHeight - elH - 50);
                nextY = Math.min(Math.max(50, nextY), maxTop);
                el.style.top = `${nextY}px`;
                el.style.transform = "none";
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;

            try {
                el.releasePointerCapture(e.pointerId);
            } catch (err) {}

            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerup", onPointerUp);
            el.removeEventListener("pointercancel", onPointerUp);

            el.classList.remove("cursor-grabbing");
            el.classList.add("cursor-pointer");

            if (hasMoved) {
                const rect = el.getBoundingClientRect();
                localStorage.setItem(storageKey, JSON.stringify({ y: Math.round(rect.top) }));

                const suppressClick = (clickEvent) => {
                    clickEvent.stopImmediatePropagation();
                    clickEvent.preventDefault();
                    el.removeEventListener("click", suppressClick, true);
                };
                el.addEventListener("click", suppressClick, true);
            }
        };

        el.addEventListener("pointerdown", onPointerDown);
    }

    // --- TOAST NOTIFICATIONS ---
    showToast(message, duration = 4000) {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "pointer-events-auto p-3 rounded-xl glass-panel border border-brand-gold/70 text-xs font-semibold text-brand-goldLight shadow-2xl flex items-center gap-2 transition-all duration-300 transform translate-x-12 opacity-0 font-outfit";
        toast.innerHTML = `
            <i class="fa-solid fa-graduation-cap text-brand-gold animate-bounce"></i>
            <span class="flex-1">${message}</span>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove("translate-x-12", "opacity-0");
        });

        setTimeout(() => {
            toast.classList.add("translate-x-12", "opacity-0");
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    showDuelChallengeToast({ host, challengeId, subject, onAccept }) {
        const container = document.getElementById("toast-container");
        if (!container) return;

        window.ambience?.playSuccess();

        const toast = document.createElement("div");
        toast.className = "pointer-events-auto p-3.5 rounded-2xl glass-panel border-2 border-brand-gold text-xs shadow-2xl space-y-2 transition-all duration-300 transform translate-x-12 opacity-0 font-outfit";
        toast.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <img src="${(host.avatar && !host.avatar.includes('api.dicebear.com')) ? host.avatar : 'assets/avatars/default.svg'}" onerror="this.onerror=null;this.src='assets/avatars/default.svg'" class="w-7 h-7 rounded-full border border-brand-gold object-cover">
                    <div>
                        <span class="font-bold text-brand-goldLight block">${host.name}</span>
                        <span class="text-[10px] text-brand-muted">Défi STEM 1v1 (${subject})</span>
                    </div>
                </div>
                <span class="text-base">⚔️</span>
            </div>
            <div class="flex items-center gap-2 pt-1">
                <button id="btn-accept-duel" class="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-brand-cherry to-brand-cherryVibrant text-brand-goldLight font-bold text-xs border border-brand-gold/70 shadow active:scale-95 transition">
                    Accepter le Duel
                </button>
                <button id="btn-decline-duel" class="px-2.5 py-1.5 rounded-lg bg-brand-darker text-brand-muted hover:text-white text-xs border border-brand-border transition">
                    Décliner
                </button>
            </div>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove("translate-x-12", "opacity-0");
        });

        const dismiss = () => {
            toast.classList.add("translate-x-12", "opacity-0");
            setTimeout(() => toast.remove(), 400);
        };

        toast.querySelector("#btn-accept-duel")?.addEventListener("click", () => {
            dismiss();
            if (onAccept) onAccept();
        });

        toast.querySelector("#btn-decline-duel")?.addEventListener("click", () => {
            dismiss();
        });

        setTimeout(dismiss, 12000);
    }

    // --- OBJECTIFS / TASKS & DASHBOARD ---
    bindTaskControls() {
        const form = document.getElementById("task-form");
        const input = document.getElementById("task-input");
        const subjectSelect = document.getElementById("task-subject");

        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            const newTask = {
                id: Date.now(),
                text: text,
                subject: subjectSelect ? subjectSelect.value : "Général",
                completed: false,
                createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            this.tasks.unshift(newTask);
            localStorage.setItem("ss_timer_tasks", JSON.stringify(this.tasks));
            input.value = "";
            window.ambience?.playClick();
            this.renderTasks();
            this.renderDashboard();
            this.levelSystem?.addXP(15, "Objectif Ajouté");
        });
    }

    bindDashboardControls() {
        // Clear history button
        document.getElementById("btn-clear-history")?.addEventListener("click", () => {
            if (this.focusHistory.length === 0) return;
            this.focusHistory = [];
            localStorage.removeItem("ss_focus_history");
            this.renderHistoryList();
            this.showToast("🗑️ Historique des sessions effacé.");
        });

        // Export stats summary button
        document.getElementById("btn-export-stats")?.addEventListener("click", () => {
            const h = Math.floor(this.totalFocusMinutes / 60);
            const m = this.totalFocusMinutes % 60;
            const timeStr = h > 0 ? `${h}h ${m}m` : `${m} min`;
            const mMaths = this.subjectMinutes["Maths"] || 0;
            const mPhys = this.subjectMinutes["Physique"] || 0;
            const mChim = this.subjectMinutes["Chimie"] || 0;
            const mInfo = this.subjectMinutes["Info"] || 0;

            const summary = `🎓 **StudySouk Academy - Rapport d'Étude CPGE & 2BAC**\n` +
                `⏱️ **Focus Total :** ${timeStr} (${this.sessionsCompleted} blocs validés)\n` +
                `📊 **Répartition STEM :** 📐 Maths ${mMaths}m | ⚛️ Physique ${mPhys}m | 🧪 Chimie ${mChim}m | 💻 Info ${mInfo}m\n` +
                `🎯 **Exercices & TD :** ${this.tasks.filter(t => t.completed).length}/${this.tasks.length} validés\n` +
                `🔥 **StudySouk Timer :** https://techniques-school-discount-job.trycloudflare.com`;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(summary);
                window.ambience?.playSuccess();
                this.showToast("📋 Rapport CPGE copié dans le presse-papier !");
            }
        });

        // Clear completed tasks
        document.getElementById("btn-clear-completed-tasks")?.addEventListener("click", () => {
            const prevCount = this.tasks.length;
            this.tasks = this.tasks.filter(t => !t.completed);
            if (this.tasks.length !== prevCount) {
                localStorage.setItem("ss_timer_tasks", JSON.stringify(this.tasks));
                window.ambience?.playClick();
                this.renderDashboard();
                this.showToast("🧹 Tâches terminées archivées.");
            }
        });

        // Filter chips
        const filterBtns = document.querySelectorAll(".task-filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const filter = btn.dataset.filter || "all";
                this.activeTaskFilter = filter;
                filterBtns.forEach(b => {
                    if (b.dataset.filter === filter) {
                        b.classList.remove("bg-brand-card", "text-brand-muted", "border-brand-borderSubtle");
                        b.classList.add("bg-brand-cherry", "text-brand-goldLight", "border-brand-gold");
                    } else {
                        b.classList.remove("bg-brand-cherry", "text-brand-goldLight", "border-brand-gold");
                        b.classList.add("bg-brand-card", "text-brand-muted", "border-brand-borderSubtle");
                    }
                });
                window.ambience?.playClick();
                this.renderTasks();
            });
        });
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem("ss_timer_tasks", JSON.stringify(this.tasks));
            if (task.completed) {
                window.ambience?.playSuccess();
                this.levelSystem?.addXP(30, "Objectif Validé 🎯");
                this.triggerConfetti();
            } else {
                window.ambience?.playClick();
            }
            this.renderTasks();
            this.renderDashboard();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        localStorage.setItem("ss_timer_tasks", JSON.stringify(this.tasks));
        window.ambience?.playClick();
        this.renderTasks();
        this.renderDashboard();
    }

    renderDashboard() {
        // 1. KPI: Total Focus Time
        const elTotalTime = document.getElementById("dash-total-time");
        if (elTotalTime) {
            const h = Math.floor(this.totalFocusMinutes / 60);
            const m = this.totalFocusMinutes % 60;
            elTotalTime.textContent = h > 0 ? `${h}h ${m}m` : `${m} min`;
        }

        // 2. KPI: Sessions
        const elSessions = document.getElementById("dash-sessions-count");
        if (elSessions) elSessions.textContent = this.sessionsCompleted;

        // 3. KPI: Streak
        const streakData = JSON.parse(localStorage.getItem("ss_timer_streak_data") || '{"lastDate":"","streak":1}');
        const streak = Math.max(1, streakData.streak || (this.sessionsCompleted > 0 ? 1 : 0));
        const elStreak = document.getElementById("dash-streak-days");
        if (elStreak) elStreak.textContent = `${streak} ${streak > 1 ? "jours" : "jour"}`;

        // 4. KPI: Tasks rate
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const rate = totalTasks === 0 ? 100 : Math.round((completedTasks / totalTasks) * 100);
        const elTasksRate = document.getElementById("dash-tasks-rate");
        const elTasksCount = document.getElementById("dash-tasks-count");
        if (elTasksRate) elTasksRate.textContent = `${rate}%`;
        if (elTasksCount) elTasksCount.textContent = `${completedTasks}/${totalTasks} terminés`;

        // 5. STEM Subject Distribution
        const mMaths = this.subjectMinutes["Maths"] || 0;
        const mPhys = this.subjectMinutes["Physique"] || 0;
        const mChim = this.subjectMinutes["Chimie"] || 0;
        const mInfo = this.subjectMinutes["Info"] || 0;
        const totalStem = mMaths + mPhys + mChim + mInfo;

        const pMaths = totalStem > 0 ? Math.round((mMaths / totalStem) * 100) : 25;
        const pPhys = totalStem > 0 ? Math.round((mPhys / totalStem) * 100) : 25;
        const pChim = totalStem > 0 ? Math.round((mChim / totalStem) * 100) : 25;
        const pInfo = totalStem > 0 ? Math.max(0, 100 - (pMaths + pPhys + pChim)) : 25;

        // Multi-segment top bar
        const segMaths = document.getElementById("bar-seg-maths");
        const segPhys = document.getElementById("bar-seg-phys");
        const segChim = document.getElementById("bar-seg-chim");
        const segInfo = document.getElementById("bar-seg-info");
        if (segMaths) segMaths.style.width = `${pMaths}%`;
        if (segPhys) segPhys.style.width = `${pPhys}%`;
        if (segChim) segChim.style.width = `${pChim}%`;
        if (segInfo) segInfo.style.width = `${pInfo}%`;

        // Individual cards
        const elDashSubjectCount = document.getElementById("dash-subject-count");
        if (elDashSubjectCount) {
            const h = Math.floor(totalStem / 60);
            const m = totalStem % 60;
            elDashSubjectCount.textContent = `${h}h ${m < 10 ? '0' : ''}${m}m total`;
        }

        const elMathsTime = document.getElementById("dash-maths-time");
        const elMathsBar = document.getElementById("dash-maths-bar");
        if (elMathsTime) elMathsTime.textContent = `${mMaths}m (${pMaths}%)`;
        if (elMathsBar) elMathsBar.style.width = `${pMaths}%`;

        const elPhysTime = document.getElementById("dash-phys-time");
        const elPhysBar = document.getElementById("dash-phys-bar");
        if (elPhysTime) elPhysTime.textContent = `${mPhys}m (${pPhys}%)`;
        if (elPhysBar) elPhysBar.style.width = `${pPhys}%`;

        const elChimTime = document.getElementById("dash-chim-time");
        const elChimBar = document.getElementById("dash-chim-bar");
        if (elChimTime) elChimTime.textContent = `${mChim}m (${pChim}%)`;
        if (elChimBar) elChimBar.style.width = `${pChim}%`;

        const elInfoTime = document.getElementById("dash-info-time");
        const elInfoBar = document.getElementById("dash-info-bar");
        if (elInfoTime) elInfoTime.textContent = `${mInfo}m (${pInfo}%)`;
        if (elInfoBar) elInfoBar.style.width = `${pInfo}%`;

        // 6. History List
        this.renderHistoryList();

        // 7. Tasks list with active filter
        this.renderTasks();
    }

    renderHistoryList() {
        const container = document.getElementById("focus-history-list");
        if (!container) return;

        if (this.focusHistory.length === 0) {
            container.innerHTML = `
                <div class="py-5 text-center text-brand-muted text-xs flex flex-col items-center gap-1.5">
                    <i class="fa-solid fa-clock-rotate-left text-lg text-brand-borderSubtle"></i>
                    <span>Aucun bloc enregistré. Valide une session Pomodoro de 25m ou 50m !</span>
                </div>
            `;
            return;
        }

        const catIcons = {
            "Maths": { icon: "fa-calculator", bg: "bg-blue-900/40 text-blue-300 border-blue-500/40" },
            "Physique": { icon: "fa-atom", bg: "bg-emerald-900/40 text-emerald-300 border-emerald-500/40" },
            "Chimie": { icon: "fa-flask", bg: "bg-teal-900/40 text-teal-300 border-teal-500/40" },
            "Info": { icon: "fa-laptop-code", bg: "bg-purple-900/40 text-purple-300 border-purple-500/40" }
        };

        container.innerHTML = this.focusHistory.map(item => {
            const style = catIcons[item.category] || catIcons["Maths"];
            return `
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-brand-card border border-brand-borderSubtle hover:border-brand-gold/40 transition">
                    <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg ${style.bg} border flex items-center justify-center text-xs">
                            <i class="fa-solid ${style.icon}"></i>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs sm:text-sm font-bold text-white font-outfit truncate max-w-[180px] sm:max-w-xs">
                                ${item.subject}
                            </span>
                            <span class="text-xs text-brand-muted font-mono font-medium">
                                ${item.date || ""} à ${item.time || ""} • ${item.duration} min
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-black text-brand-goldLight bg-brand-cherry px-2.5 py-0.5 rounded-full border border-brand-gold font-mono shadow-sm">
                            +${item.xp || 60} XP
                        </span>
                    </div>
                </div>
            `;
        }).join("");
    }

    renderTasks() {
        const container = document.getElementById("tasks-list");
        const pill = document.getElementById("tasks-count-pill");
        if (!container) return;

        const remaining = this.tasks.filter(t => !t.completed).length;
        if (pill) {
            pill.textContent = `${remaining} ${remaining > 1 ? "restants" : "restant"}`;
        }

        const filteredTasks = this.activeTaskFilter === "all"
            ? this.tasks
            : this.tasks.filter(t => (t.subject || "Général").toLowerCase().includes(this.activeTaskFilter.toLowerCase()));

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="py-6 text-center text-brand-muted text-xs flex flex-col items-center gap-1.5">
                    <i class="fa-solid fa-list-check text-xl text-brand-borderSubtle"></i>
                    <span>${this.activeTaskFilter === "all" ? "Aucun objectif défini. Ajoute tes devoirs et TD !" : "Aucun devoir pour cette matière."}</span>
                </div>
            `;
            return;
        }

        const subjectColors = {
            "Maths": "bg-blue-900/40 text-blue-300 border-blue-500/40",
            "Physique": "bg-emerald-900/40 text-emerald-300 border-emerald-500/40",
            "Chimie": "bg-teal-900/40 text-teal-300 border-teal-500/40",
            "Info": "bg-purple-900/40 text-purple-300 border-purple-500/40",
            "SI": "bg-amber-900/40 text-amber-300 border-amber-500/40",
            "Général": "bg-brand-cherry text-brand-goldLight border-brand-gold/40"
        };

        container.innerHTML = filteredTasks.map(t => `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-brand-card border border-brand-borderSubtle hover:border-brand-gold/40 transition ${t.completed ? 'opacity-50 bg-brand-darker' : ''}">
                <div class="flex items-center gap-2.5 overflow-hidden">
                    <button onclick="window.studyApp.toggleTask(${t.id})" class="w-5 h-5 rounded-md border flex items-center justify-center transition ${t.completed ? 'bg-emerald-600 border-emerald-400 text-white' : 'border-brand-border hover:border-brand-gold text-transparent'}">
                        <i class="fa-solid fa-check text-xs"></i>
                    </button>
                    <div class="flex flex-col truncate">
                        <span class="text-xs sm:text-sm font-bold text-white truncate ${t.completed ? 'line-through text-brand-muted opacity-60' : ''}">
                            ${t.text}
                        </span>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-xs font-mono font-bold px-2 py-0.5 rounded border ${subjectColors[t.subject] || subjectColors['Général']}">
                                ${t.subject}
                            </span>
                            <span class="text-xs text-brand-muted font-medium">${t.createdAt}</span>
                        </div>
                    </div>
                </div>
                <button onclick="window.studyApp.deleteTask(${t.id})" class="text-brand-muted hover:text-rose-400 text-xs p-1.5 transition">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join("");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.studyApp = new StudySoukTimerApp();
    window.app = window.studyApp;
    window.studyApp.init();
});
