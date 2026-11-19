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
    { name: "Al-Khwarizmi", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Khwarizmi" },
    { name: "Ibn Sina", url: "https://api.dicebear.com/7.x/bottts/svg?seed=IbnSina" },
    { name: "Euler", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Euler" },
    { name: "Poincaré", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Poincare" },
    { name: "Marie Curie", url: "https://api.dicebear.com/7.x/bottts/svg?seed=MarieCurie" },
    { name: "Ada Lovelace", url: "https://api.dicebear.com/7.x/bottts/svg?seed=AdaLovelace" },
    { name: "Khwanss", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Khwanss" },
    { name: "Major STEM", url: "https://api.dicebear.com/7.x/bottts/svg?seed=MajorSTEM" }
];

class StudySoukTimerApp {
    constructor() {
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

        // Academic Modules
        this.canvas = null;
        this.reactions = null;
        this.levelSystem = null;
        this.duel = null;
        this.flashcards = null;
        this.scratchpad = null;

        // Tasks & Objectives
        this.tasks = JSON.parse(localStorage.getItem("ss_timer_tasks") || "[]");
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

        // 4. Init Flashcards, Scratchpad & STEM Duel
        if (window.FlashcardViewer) {
            this.flashcards = new window.FlashcardViewer("flashcards-container");
            this.flashcards.render();
        }
        if (window.FormulaScratchpad) {
            this.scratchpad = new window.FormulaScratchpad("scratchpad-container");
            this.scratchpad.render();
        }
        if (window.DuelArena) {
            this.duel = new window.DuelArena("duel-container");
            this.duel.render();
        }

        // 5. Connect Discord SDK & Identity
        await this.initDiscordSDK();

        // 6. Bind Listeners & Controls
        this.bindNavigation();
        this.bindZenMode();
        this.bindKeyboardShortcuts();
        this.bindSubjectSelector();
        this.bindTimerControls();
        this.bindAmbienceControls();
        this.bindRadioControls();
        this.bindTaskControls();
        this.bindModals();
        this.initMultiplayerTimerSync();

        this.startCountdownHub();
        this.updateTimerDisplay();
        this.renderCycleDots();
        this.renderTasks();
        this.renderStats();
        this.rotateQuote();

        console.log("%c[StudySouk Academy] Official Academic Activity Ready! 🎓", "color: #D4AF37; font-weight: bold; font-size: 13px;");
    }

    // --- CONCOURS COUNTDOWN HUB ---
    startCountdownHub() {
        const updateCountdowns = () => {
            const now = new Date();
            const currentYear = now.getFullYear();

            // Next exam dates
            const getNextDate = (month, day) => {
                let target = new Date(currentYear, month - 1, day, 8, 0, 0);
                if (now > target) {
                    target = new Date(currentYear + 1, month - 1, day, 8, 0, 0);
                }
                return target;
            };

            const cncDate = getNextDate(5, 12); // May 12
            const frDate = getNextDate(4, 22);  // April 22 (Mines/Centrale)
            const bacDate = getNextDate(6, 10); // June 10

            const formatDiff = (target) => {
                const diffMs = target - now;
                if (diffMs <= 0) return "En cours !";
                const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                return `${days}j ${hours}h`;
            };

            const elCnc = document.getElementById("countdown-cnc");
            const elFr = document.getElementById("countdown-fr");
            const elBac = document.getElementById("countdown-bac");

            if (elCnc) elCnc.textContent = formatDiff(cncDate);
            if (elFr) elFr.textContent = formatDiff(frDate);
            if (elBac) elBac.textContent = formatDiff(bacDate);
        };

        updateCountdowns();
        setInterval(updateCountdowns, 60000);
    }

    // --- ACTIVE SUBJECT SELECTOR ---
    bindSubjectSelector() {
        const selector = document.getElementById("select-active-subject");
        const badge = document.getElementById("active-subject-badge");

        if (selector) {
            selector.value = this.currentSubject;
            selector.addEventListener("change", (e) => {
                this.currentSubject = e.target.value;
                localStorage.setItem("ss_active_subject", this.currentSubject);
                if (badge) badge.textContent = this.currentSubject;
                window.ambience?.playClick();

                if (this.sync) {
                    this.sync.setUser({
                        activeSubject: this.currentSubject
                    });
                    this.showToast(`📚 Tu révises maintenant : ${this.currentSubject}`);
                }
            });
        }
        if (badge) badge.textContent = this.currentSubject;
    }

    // --- DISCORD SDK INTEGRATION ---
    async initDiscordSDK() {
        const urlParams = new URLSearchParams(window.location.search);
        const hasFrameId = urlParams.has("frame_id") || urlParams.has("instance_id") || window.parent !== window;

        const statusText = document.getElementById("discord-status-text");
        const userAvatar = document.getElementById("user-avatar");
        const userName = document.getElementById("user-name");

        const storedName = localStorage.getItem("ss_user_name");
        const storedAvatar = localStorage.getItem("ss_user_avatar");

        this.discordUser = {
            name: storedName || "Étudiant StudySouk",
            avatar: storedAvatar || ("https://api.dicebear.com/7.x/bottts/svg?seed=" + Math.floor(Math.random() * 10000))
        };

        if (hasFrameId && window.DiscordSDK) {
            try {
                this.sdk = new window.DiscordSDK(CLIENT_ID);
                await this.sdk.ready();
                this.isInDiscord = true;

                if (statusText) {
                    statusText.textContent = `Discord Salon Connecté #${this.sdk.channelId ? this.sdk.channelId.substring(0, 6) : 'StudySouk'}`;
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

        if (this.sync) {
            this.sync.setUser({
                name: this.discordUser.name,
                avatar: this.discordUser.avatar,
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
            if (syncLabel && author && author.name) {
                const short = author.name.split(" ")[0];
                syncLabel.textContent = `⏱️ Synchro par ${short}`;
                clearTimeout(this.syncLabelTimer);
                this.syncLabelTimer = setTimeout(() => {
                    syncLabel.textContent = "Session Salon Vocal";
                }, 4000);
            }

            if (subject && subject !== this.currentSubject) {
                const badge = document.getElementById("active-subject-badge");
                if (badge) badge.textContent = subject;
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
        });

        this.sync.on("user_joined", (user) => {
            if (user && user.name) {
                this.showToast(`👋 ${user.name} a rejoint la session d'étude !`);
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
            } else if (e.key === "?") {
                shortcutsModal?.classList.toggle("hidden");
                shortcutsModal?.classList.toggle("flex");
            } else if (["1", "2", "3", "4", "5", "6"].includes(e.key)) {
                const tabs = ["tab-timer", "tab-flashcards", "tab-scratchpad", "tab-duel", "tab-tasks", "tab-ambience"];
                const targetTab = tabs[parseInt(e.key, 10) - 1];
                if (targetTab) {
                    window.ambience?.playClick();
                    this.switchTab(targetTab);
                }
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
                this.switchTab(targetId);
            });
        });
    }

    switchTab(tabId) {
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

        document.querySelectorAll(".tab-content").forEach(tc => tc.classList.add("hidden"));
        document.getElementById(tabId)?.classList.remove("hidden");

        if (tabId === "tab-duel" && this.duel && !this.duel.isPlaying) {
            this.duel.render();
        } else if (tabId === "tab-flashcards" && this.flashcards) {
            this.flashcards.render();
        } else if (tabId === "tab-scratchpad" && this.scratchpad) {
            this.scratchpad.render();
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

        if (modeKey === 'break5') {
            if (circle) circle.setAttribute('stroke', 'url(#studysoukBreakGradient)');
            if (halo) halo.className = "absolute inset-2 rounded-full bg-gradient-to-tr from-emerald-950/50 via-emerald-500/25 to-transparent blur-3xl pointer-events-none transition-all duration-700";
            if (baseTrack) baseTrack.setAttribute('stroke', 'rgba(6, 95, 70, 0.35)');
        } else if (modeKey === 'break15') {
            if (circle) circle.setAttribute('stroke', 'url(#studysoukLongBreakGradient)');
            if (halo) halo.className = "absolute inset-2 rounded-full bg-gradient-to-tr from-blue-950/50 via-blue-500/25 to-transparent blur-3xl pointer-events-none transition-all duration-700";
            if (baseTrack) baseTrack.setAttribute('stroke', 'rgba(30, 58, 138, 0.35)');
        } else {
            if (circle) circle.setAttribute('stroke', 'url(#studysoukGoldGradient)');
            if (halo) halo.className = "absolute inset-2 rounded-full bg-gradient-to-tr from-brand-cherry/40 via-brand-gold/20 to-transparent blur-3xl pointer-events-none transition-all duration-700";
            if (baseTrack) baseTrack.setAttribute('stroke', 'rgba(138, 21, 56, 0.25)');
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
            btn.innerHTML = `<i class="fa-solid fa-pause text-xl text-brand-goldLight ml-0.5 group-hover:scale-110 transition duration-150"></i><span class="gold-text-gradient font-black text-lg">Pause</span>`;
        }

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

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
    }

    pauseTimer(broadcast = false) {
        this.isRunning = false;
        document.body.classList.remove("timer-running");
        clearInterval(this.timerInterval);
        const btn = document.getElementById("btn-timer-toggle");
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-play text-xl text-brand-goldLight ml-0.5 group-hover:scale-110 transition duration-150"></i><span class="gold-text-gradient font-black text-lg">Reprendre</span>`;
        }

        if (broadcast && this.sync) {
            this.sync.syncPomodoro("pause", {
                modeKey: this.currentModeKey,
                timeLeft: this.timeLeft,
                isRunning: false,
                subject: this.currentSubject
            });
        }
    }

    resetTimer(broadcast = false) {
        this.pauseTimer(false);
        document.body.classList.remove("timer-running");
        this.timeLeft = this.totalDuration;
        this.updateTimerDisplay();
        const btn = document.getElementById("btn-timer-toggle");
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-play text-xl text-brand-goldLight ml-0.5 group-hover:scale-110 transition duration-150"></i><span class="gold-text-gradient font-black text-lg">Commencer</span>`;
        }

        if (broadcast && this.sync) {
            this.sync.syncPomodoro("reset", {
                modeKey: this.currentModeKey,
                timeLeft: this.timeLeft,
                isRunning: false,
                subject: this.currentSubject
            });
        }
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
            this.renderStats();

            this.levelSystem?.addXP(60, "Bloc de Deep Work Validé 🎯");
            this.triggerConfetti();
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

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const displayEl = document.getElementById("timer-display");
        if (displayEl) displayEl.textContent = formatted;

        const circle = document.getElementById("timer-progress-circle");
        const progress = this.timeLeft / this.totalDuration;
        if (circle) {
            const radius = circle.r?.baseVal?.value || 126;
            const circumference = 2 * Math.PI * radius;
            circle.style.strokeDasharray = `${circumference}`;
            const offset = circumference * (1 - progress);
            circle.style.strokeDashoffset = offset;
        }

        document.title = `${formatted} - ${this.modes[this.currentModeKey].label} | StudySouk Academy`;
    }

    renderStats() {
        const elSessions = document.getElementById("stat-sessions");
        const elMinutes = document.getElementById("stat-minutes");
        if (elSessions) elSessions.textContent = this.sessionsCompleted;
        if (elMinutes) elMinutes.textContent = `${this.totalFocusMinutes} min`;
        this.renderCycleDots();
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
                this.showToast(`🌌 Atmosphère Visuelle : ${btn.querySelector(".leading-tight")?.textContent || theme}`);
            });
        });

        document.getElementById("btn-mute-all")?.addEventListener("click", () => {
            const isMuted = window.ambience?.toggleMute();
            const btn = document.getElementById("btn-mute-all");
            if (btn) {
                btn.innerHTML = isMuted 
                    ? `<i class="fa-solid fa-volume-xmark text-rose-400"></i> <span class="hidden sm:inline">Muet</span>`
                    : `<i class="fa-solid fa-volume-high text-brand-gold"></i> <span class="hidden sm:inline">Sons</span>`;
            }
        });
    }

    // --- MODALS & PROFILE ---
    bindModals() {
        // 1. Roster Modal
        const rosterModal = document.getElementById("roster-modal");
        document.getElementById("btn-room-roster")?.addEventListener("click", () => {
            window.ambience?.playClick();
            rosterModal?.classList.remove("hidden");
            rosterModal?.classList.add("flex");
        });
        document.getElementById("btn-close-roster")?.addEventListener("click", () => {
            rosterModal?.classList.add("hidden");
            rosterModal?.classList.remove("flex");
        });

        // 2. Profile Modal
        const profileModal = document.getElementById("profile-modal");
        const nameInput = document.getElementById("profile-name-input");
        const avatarsGrid = document.getElementById("avatar-presets-grid");

        document.getElementById("user-profile-trigger")?.addEventListener("click", () => {
            window.ambience?.playClick();
            if (nameInput) nameInput.value = this.discordUser.name;
            profileModal?.classList.remove("hidden");
            profileModal?.classList.add("flex");
        });

        document.getElementById("btn-close-profile")?.addEventListener("click", () => {
            profileModal?.classList.add("hidden");
            profileModal?.classList.remove("flex");
        });

        if (avatarsGrid) {
            avatarsGrid.innerHTML = AVATAR_PRESETS.map((p, idx) => `
                <button data-avatar="${p.url}" data-name="${p.name}" class="avatar-pick-btn p-1.5 rounded-xl bg-brand-darker border border-brand-border hover:border-brand-gold transition flex flex-col items-center gap-1">
                    <img src="${p.url}" alt="${p.name}" class="w-10 h-10 rounded-full">
                    <span class="text-[9px] font-outfit text-brand-goldLight truncate max-w-full">${p.name}</span>
                </button>
            `).join("");

            avatarsGrid.querySelectorAll(".avatar-pick-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    this.discordUser.avatar = btn.dataset.avatar;
                    if (nameInput && !nameInput.value.trim()) {
                        nameInput.value = btn.dataset.name;
                    }
                    avatarsGrid.querySelectorAll(".avatar-pick-btn").forEach(b => b.classList.remove("border-brand-gold", "bg-brand-cherry"));
                    btn.classList.add("border-brand-gold", "bg-brand-cherry");
                });
            });
        }

        document.getElementById("btn-save-profile")?.addEventListener("click", () => {
            const newName = nameInput.value.trim() || this.discordUser.name;
            this.discordUser.name = newName;
            localStorage.setItem("ss_user_name", newName);
            localStorage.setItem("ss_user_avatar", this.discordUser.avatar);

            const userAvatar = document.getElementById("user-avatar");
            const userName = document.getElementById("user-name");
            if (userAvatar) userAvatar.src = this.discordUser.avatar;
            if (userName) userName.textContent = newName;

            if (this.sync) {
                this.sync.setUser({
                    name: newName,
                    avatar: this.discordUser.avatar,
                    focusMinutes: this.totalFocusMinutes,
                    activeSubject: this.currentSubject
                });
            }

            profileModal?.classList.add("hidden");
            profileModal?.classList.remove("flex");
            window.ambience?.playSuccess();
            this.showToast("✨ Profil académique mis à jour !");
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

        if (users.length === 0) {
            list.innerHTML = `<div class="text-center text-xs text-brand-muted py-3">Toi seul es connecté dans ce salon.</div>`;
            return;
        }

        list.innerHTML = users.map(u => `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-brand-darker border border-brand-border">
                <div class="flex items-center gap-2.5">
                    <img src="${u.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Study'}" class="w-8 h-8 rounded-full border border-brand-gold/50 bg-brand-card">
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs font-bold text-brand-text font-outfit truncate max-w-[120px]">${u.name || 'Étudiant'}</span>
                            ${u.isSelf ? '<span class="text-[9px] bg-brand-cherry text-brand-goldLight px-1 rounded font-outfit">Toi</span>' : ''}
                        </div>
                        <span class="text-[10px] text-brand-gold font-sans flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ${u.activeSubject || 'STEM Focus'}
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] font-mono text-brand-gold font-bold block">${u.focusMinutes || 0} min</span>
                    <span class="text-[9px] text-brand-muted uppercase font-outfit">Focus</span>
                </div>
            </div>
        `).join("");
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
                    <img src="${host.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Study'}" class="w-7 h-7 rounded-full border border-brand-gold">
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

    // --- OBJECTIFS / TASKS ---
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
            this.levelSystem?.addXP(15, "Objectif Ajouté");
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
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        localStorage.setItem("ss_timer_tasks", JSON.stringify(this.tasks));
        window.ambience?.playClick();
        this.renderTasks();
    }

    renderTasks() {
        const container = document.getElementById("tasks-list");
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = `
                <div class="py-8 text-center text-brand-muted text-xs flex flex-col items-center gap-2">
                    <i class="fa-solid fa-list-check text-2xl text-brand-borderSubtle"></i>
                    <span>Aucun objectif défini. Ajoute tes exercices, TD et devoirs de concours !</span>
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

        container.innerHTML = this.tasks.map(t => `
            <div class="flex items-center justify-between p-3 rounded-lg bg-brand-card border border-brand-border hover:border-brand-gold/50 transition ${t.completed ? 'opacity-50 bg-brand-darker' : ''}">
                <div class="flex items-center gap-3 overflow-hidden">
                    <button onclick="window.studyApp.toggleTask(${t.id})" class="w-5 h-5 rounded-md border flex items-center justify-center transition ${t.completed ? 'bg-emerald-600 border-emerald-400 text-white' : 'border-brand-border hover:border-brand-gold text-transparent'}">
                        <i class="fa-solid fa-check text-xs"></i>
                    </button>
                    <div class="flex flex-col truncate">
                        <span class="text-xs font-medium text-brand-text truncate ${t.completed ? 'line-through text-brand-muted' : ''}">
                            ${t.text}
                        </span>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-[10px] font-mono px-1.5 py-0.2 rounded border ${subjectColors[t.subject] || subjectColors['Général']}">
                                ${t.subject}
                            </span>
                            <span class="text-[10px] text-brand-muted">${t.createdAt}</span>
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
