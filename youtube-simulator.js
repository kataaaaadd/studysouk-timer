/**
 * StudySouk Timer - Master Focus Studio & YouTube Simulator Engine
 * Dual-Mode Engine:
 * 1. Studio Lo-Fi Visuel HD (100% Native Canvas & Discord-Proof Audio)
 * 2. YouTube Video Player (Embed with HQ Thumbnail Backdrop & Strict-Origin Referrer)
 */

const YOUTUBE_STUDY_PRESETS = [
    {
        id: "5qap5aO4i9A",
        title: "Lofi Girl 24/7 (Live)",
        desc: "Beats to relax/study to",
        icon: "fa-headphones",
        tag: "Lo-Fi Beats",
        radioStation: "chillhop"
    },
    {
        id: "lTRiuFIWV54",
        title: "1 A.M Study Session",
        desc: "Lo-Fi Hip Hop Chill Beats",
        icon: "fa-cloud-moon",
        tag: "Lo-Fi Study",
        radioStation: "lofigirl"
    },
    {
        id: "wygy721nzRc",
        title: "Chopin Piano Focus",
        desc: "Nocturnes & Classique CPGE",
        icon: "fa-feather",
        tag: "Piano",
        radioStation: "piano"
    },
    {
        id: "mPZkdNFkNps",
        title: "Cabin Fireplace & Rain",
        desc: "Cheminée crépitante & Pluie douce",
        icon: "fa-fire",
        tag: "Cozy ASMR",
        radioStation: "chillhop"
    },
    {
        id: "7NOSDKb0HlU",
        title: "Lofi Beats to Study/Relax",
        desc: "Deep Focus Flow State 4K",
        icon: "fa-laptop-code",
        tag: "Deep Focus",
        radioStation: "synthwave"
    },
    {
        id: "DIT6haWEbXA",
        title: "Coran Karim - Tilawat",
        desc: "Récitation apaisante (Mishary Alafasy)",
        icon: "fa-moon",
        tag: "Coran",
        radioStation: "piano"
    }
];

class YouTubeStudySimulator {
    constructor() {
        let savedId = localStorage.getItem("ss_yt_video_id");
        if (!savedId || savedId === "jfKfPfyJRdk" || savedId === "0U_Z7Gk597E" || savedId === "2riD7XfC7t4") {
            savedId = "5qap5aO4i9A";
            localStorage.setItem("ss_yt_video_id", savedId);
        }
        this.currentVideoId = savedId;
        this.currentMode = localStorage.getItem("ss_player_mode") || "studio"; // "studio" | "youtube"
        this.isPlaying = false;
        this.isFloating = false;
        this.presets = YOUTUBE_STUDY_PRESETS;
        this.studioAnimationId = null;
        this.studioParticles = [];
        this.studioEqualizer = Array.from({ length: 24 }, () => Math.random() * 0.4 + 0.1);
    }

    init() {
        this.renderPresets();
        this.bindEvents();
        this.updateModeUI();
        this.renderCurrentScreen();
        this.detectDiscordEnvironment();
        console.log("[FocusStudio] Initialized in mode:", this.currentMode, "video:", this.currentVideoId);
    }

    detectDiscordEnvironment() {
        const isDiscord = window.location.hostname.includes("discordsays.com") ||
                          window.location.hostname.includes("discord.com") ||
                          (window.parent !== window && new URLSearchParams(window.location.search).has("frame_id"));
        if (isDiscord) {
            console.log("[FocusStudio] Discord Activity environment detected");
            const hint = document.getElementById("yt-discord-hint");
            if (hint) {
                hint.classList.add("bg-indigo-950/40", "border-indigo-500/30", "p-2", "rounded-xl");
            }
        }
    }

    setMode(mode) {
        if (mode !== "studio" && mode !== "youtube") return;
        this.currentMode = mode;
        localStorage.setItem("ss_player_mode", mode);
        window.ambience?.playClick?.();
        this.updateModeUI();
        this.renderCurrentScreen();
    }

    updateModeUI() {
        const btnStudio = document.getElementById("btn-mode-studio");
        const btnYoutube = document.getElementById("btn-mode-youtube");

        if (this.currentMode === "studio") {
            btnStudio?.classList.add("bg-brand-cherry", "text-brand-gold", "shadow");
            btnStudio?.classList.remove("text-brand-muted");
            btnYoutube?.classList.remove("bg-brand-cherry", "text-brand-gold", "shadow");
            btnYoutube?.classList.add("text-brand-muted");
        } else {
            btnYoutube?.classList.add("bg-brand-cherry", "text-brand-gold", "shadow");
            btnYoutube?.classList.remove("text-brand-muted");
            btnStudio?.classList.remove("bg-brand-cherry", "text-brand-gold", "shadow");
            btnStudio?.classList.add("text-brand-muted");
        }
    }

    renderCurrentScreen() {
        if (this.currentMode === "studio") {
            this.renderStudioMode();
        } else {
            this.renderYouTubeMode();
        }
    }

    // ==========================================
    // 🌸 1. STUDIO VISUEL LO-FI (100% DISCORD PROOF)
    // ==========================================
    renderStudioMode() {
        this.stopStudioAnimation();
        const screenContainer = document.getElementById("yt-screen-container");
        if (!screenContainer) return;

        // Clean background for Studio Canvas
        screenContainer.style.backgroundImage = "none";
        screenContainer.style.backgroundColor = "#09090f";

        const isRadioPlaying = window.ambience?.isRadioPlaying;
        const currentStation = window.ambience?.currentStationKey || "chillhop";
        const stationName = (window.LOFI_STATIONS && window.LOFI_STATIONS[currentStation]) 
            ? window.LOFI_STATIONS[currentStation].name 
            : "Chillhop Study Beats";

        screenContainer.innerHTML = `
            <div class="relative w-full h-full flex flex-col justify-between p-4 overflow-hidden select-none">
                <!-- Studio Animated Canvas -->
                <canvas id="lofi-studio-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas>

                <!-- Top Status Overlay Bar -->
                <div class="relative z-10 flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-darker/80 backdrop-blur-md border border-brand-gold/30 shadow-md">
                        <span class="w-2 h-2 rounded-full ${isRadioPlaying ? 'bg-emerald-400 animate-ping' : 'bg-brand-gold'}"></span>
                        <span class="text-[10px] font-bold text-white font-outfit truncate max-w-[170px]" id="studio-station-tag">
                            ${stationName}
                        </span>
                    </div>

                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <i class="fa-solid fa-shield-halved text-[8px]"></i> 100% Discord Proof
                        </span>
                    </div>
                </div>

                <!-- Center Cozy Aesthetic Focus Display -->
                <div class="relative z-10 flex flex-col items-center justify-center text-center my-auto">
                    <!-- Real-time Aesthetic Digital Clock -->
                    <div class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-brand-gold to-amber-100 font-mono tracking-wider drop-shadow-md" id="studio-digital-clock">
                        ${this.getFormattedTime()}
                    </div>
                    
                    <p class="text-[10px] text-brand-goldLight/80 font-outfit font-medium mt-1 tracking-wide flex items-center gap-1.5">
                        <i class="fa-solid fa-sparkles text-brand-gold text-[9px]"></i>
                        Session d'Immersion & Focus Nabras
                    </p>

                    <!-- Studio Audio Play/Pause Big Button -->
                    <div class="mt-3 flex items-center gap-2">
                        <button onclick="window.youtubeSimulator?.toggleStudioAudio()" class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-brand-cherry to-brand-cherryVibrant hover:brightness-110 text-brand-gold text-xs font-bold font-outfit border border-brand-gold/50 shadow-xl transition active:scale-95 flex items-center gap-2 cursor-pointer backdrop-blur-md">
                            <i class="fa-solid ${isRadioPlaying ? 'fa-pause' : 'fa-play'} text-[11px]"></i>
                            <span>${isRadioPlaying ? 'Pause Musique' : 'Lancer Lo-Fi 24/7'}</span>
                        </button>
                    </div>
                </div>

                <!-- Bottom Equalizer & Quick Stations -->
                <div class="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-white/5 bg-brand-darker/60 backdrop-blur-sm -mx-4 -mb-4 px-4 py-2">
                    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        <button onclick="window.youtubeSimulator?.switchStudioStation('chillhop')" class="px-2 py-0.5 rounded-lg text-[9px] font-bold font-outfit transition ${currentStation === 'chillhop' ? 'bg-brand-cherry text-brand-gold border border-brand-gold/40' : 'text-brand-muted hover:text-white bg-white/5'}">
                            Chillhop
                        </button>
                        <button onclick="window.youtubeSimulator?.switchStudioStation('lofigirl')" class="px-2 py-0.5 rounded-lg text-[9px] font-bold font-outfit transition ${currentStation === 'lofigirl' ? 'bg-brand-cherry text-brand-gold border border-brand-gold/40' : 'text-brand-muted hover:text-white bg-white/5'}">
                            Nightwave
                        </button>
                        <button onclick="window.youtubeSimulator?.switchStudioStation('synthwave')" class="px-2 py-0.5 rounded-lg text-[9px] font-bold font-outfit transition ${currentStation === 'synthwave' ? 'bg-brand-cherry text-brand-gold border border-brand-gold/40' : 'text-brand-muted hover:text-white bg-white/5'}">
                            Synthwave
                        </button>
                        <button onclick="window.youtubeSimulator?.switchStudioStation('piano')" class="px-2 py-0.5 rounded-lg text-[9px] font-bold font-outfit transition ${currentStation === 'piano' ? 'bg-brand-cherry text-brand-gold border border-brand-gold/40' : 'text-brand-muted hover:text-white bg-white/5'}">
                            Piano CPGE
                        </button>
                    </div>

                    <div class="text-[9px] font-mono text-brand-muted flex items-center gap-1">
                        <i class="fa-solid fa-volume-high text-brand-gold text-[8px]"></i>
                        <span>Web Audio 2.0</span>
                    </div>
                </div>
            </div>
        `;

        this.startStudioAnimation();
        this.updateHeaderControls();
    }

    getFormattedTime() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }

    startStudioAnimation() {
        const canvas = document.getElementById("lofi-studio-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 640;
            canvas.height = canvas.parentElement?.clientHeight || 340;
        };
        resize();

        // Initialize rain particles
        this.studioParticles = Array.from({ length: 45 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 3 + 2,
            length: Math.random() * 15 + 8,
            alpha: Math.random() * 0.4 + 0.1
        }));

        const clockEl = document.getElementById("studio-digital-clock");
        let lastClockUpdate = 0;

        const animate = (time) => {
            if (!document.getElementById("lofi-studio-canvas")) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Cozy atmospheric ambient background glow
            const grad = ctx.createRadialGradient(
                canvas.width / 2, canvas.height * 0.4, 10,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.7
            );
            grad.addColorStop(0, "rgba(90, 20, 35, 0.45)"); // Warm cherry glow
            grad.addColorStop(0.5, "rgba(22, 10, 28, 0.7)");
            grad.addColorStop(1, "rgba(7, 7, 12, 0.98)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Window Raindrop streaks
            ctx.strokeStyle = "rgba(180, 210, 255, 0.25)";
            ctx.lineWidth = 1.2;
            for (let p of this.studioParticles) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - 1, p.y + p.length);
                ctx.stroke();

                p.y += p.speed;
                p.x -= 0.3;
                if (p.y > canvas.height) {
                    p.y = -p.length;
                    p.x = Math.random() * canvas.width;
                }
            }

            // 3. Audio Equalizer Frequency Bars (Beat-synced)
            const isPlaying = window.ambience?.isRadioPlaying;
            const barCount = 28;
            const barWidth = canvas.width / (barCount * 1.5);
            const startX = (canvas.width - (barCount * barWidth * 1.3)) / 2;

            for (let i = 0; i < barCount; i++) {
                if (isPlaying) {
                    this.studioEqualizer[i] += (Math.random() - 0.48) * 0.18;
                    this.studioEqualizer[i] = Math.max(0.08, Math.min(0.85, this.studioEqualizer[i]));
                } else {
                    this.studioEqualizer[i] = Math.max(0.04, this.studioEqualizer[i] * 0.95);
                }

                const height = this.studioEqualizer[i] * 50;
                const x = startX + i * barWidth * 1.3;
                const y = canvas.height - height - 42;

                const barGrad = ctx.createLinearGradient(0, y, 0, y + height);
                barGrad.addColorStop(0, "rgba(234, 179, 8, 0.7)"); // Imperial Gold
                barGrad.addColorStop(1, "rgba(180, 25, 45, 0.2)");  // Royal Cherry

                ctx.fillStyle = barGrad;
                ctx.fillRect(x, y, barWidth, height);
            }

            // Update clock every second
            if (time - lastClockUpdate > 1000) {
                if (clockEl) clockEl.textContent = this.getFormattedTime();
                lastClockUpdate = time;
            }

            this.studioAnimationId = requestAnimationFrame(animate);
        };

        this.studioAnimationId = requestAnimationFrame(animate);
    }

    stopStudioAnimation() {
        if (this.studioAnimationId) {
            cancelAnimationFrame(this.studioAnimationId);
            this.studioAnimationId = null;
        }
    }

    toggleStudioAudio() {
        window.ambience?.playClick?.();
        if (window.ambience) {
            window.ambience.toggleRadio();
            // Re-render studio mode controls smoothly
            setTimeout(() => {
                this.renderStudioMode();
            }, 100);
        }
    }

    switchStudioStation(stationKey) {
        window.ambience?.playClick?.();
        if (window.ambience) {
            window.ambience.playRadioStation(stationKey);
            setTimeout(() => {
                this.renderStudioMode();
            }, 100);
        }
    }

    // ==========================================
    // 🎬 2. YOUTUBE VIDEO PLAYER MODE (ROBUST)
    // ==========================================
    renderYouTubeMode() {
        this.stopStudioAnimation();
        const screenContainer = document.getElementById("yt-screen-container");
        if (!screenContainer) return;

        const activePreset = this.presets.find(p => p.id === this.currentVideoId);
        const videoTitle = activePreset ? activePreset.title : `Vidéo YouTube (${this.currentVideoId})`;
        const videoTag = activePreset ? activePreset.tag : "Focus YouTube";
        const thumbUrl = `https://img.youtube.com/vi/${this.currentVideoId}/hqdefault.jpg`;

        if (this.isPlaying) {
            // Embed Active YouTube iframe with Origin & Cross-Origin Referrer
            const embedUrl = `https://www.youtube.com/embed/${this.currentVideoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`;
            
            screenContainer.style.backgroundImage = "none";
            screenContainer.style.backgroundColor = "#000000";

            screenContainer.innerHTML = `
                <div class="relative w-full h-full">
                    <iframe id="yt-player-iframe" src="${embedUrl}" 
                        class="absolute inset-0 w-full h-full rounded-xl border-0 shadow-2xl z-10" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen>
                    </iframe>
                    <!-- Fallback / External link overlay in top corner -->
                    <div class="absolute top-2 right-2 z-20 flex items-center gap-1 pointer-events-auto">
                        <a href="https://www.youtube.com/watch?v=${this.currentVideoId}" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] font-bold font-outfit border border-white/20 backdrop-blur-md shadow flex items-center gap-1 transition">
                            <i class="fa-brands fa-youtube text-red-500"></i> Ouvrir ↗
                        </a>
                    </div>
                </div>
            `;
        } else {
            // Idle State: High-Res Backdrop Thumbnail + Glass Trigger
            screenContainer.style.backgroundImage = `linear-gradient(180deg, rgba(7, 7, 10, 0.35) 0%, rgba(7, 7, 10, 0.88) 100%), url('${thumbUrl}')`;
            screenContainer.style.backgroundSize = "cover";
            screenContainer.style.backgroundPosition = "center";

            screenContainer.innerHTML = `
                <div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center p-4 bg-brand-darker/40 backdrop-blur-[2px] rounded-xl">
                    <!-- Glowing Play Trigger -->
                    <button onclick="window.youtubeSimulator?.play()" class="group relative w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center text-2xl shadow-2xl border-2 border-white/30 transition-all hover:scale-110 active:scale-95 cursor-pointer mb-3">
                        <span class="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></span>
                        <i class="fa-solid fa-play ml-1 group-hover:scale-110 transition-transform"></i>
                    </button>

                    <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/30 font-bold mb-1">
                        ${videoTag}
                    </span>
                    <h4 class="text-sm font-extrabold text-white font-outfit mb-0.5 drop-shadow-md truncate max-w-xs sm:max-w-md">
                        ${videoTitle}
                    </h4>
                    <p class="text-[11px] text-gray-300 drop-shadow mb-3 max-w-xs">
                        Cliquez pour lancer le lecteur vidéo ou ouvrez sur YouTube
                    </p>

                    <div class="flex items-center gap-2">
                        <button onclick="window.youtubeSimulator?.play()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white text-xs font-bold font-outfit border border-red-400/40 shadow-lg transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-play text-[10px]"></i> Lancer la Vidéo
                        </button>
                        <a href="https://www.youtube.com/watch?v=${this.currentVideoId}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl glass-card hover:bg-white/10 text-brand-gold text-xs font-bold font-outfit border border-brand-gold/30 transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-brands fa-youtube text-red-500"></i> YouTube ↗
                        </a>
                    </div>
                </div>
            `;
        }

        this.updateHeaderControls();
    }

    updateHeaderControls() {
        const playBtn = document.getElementById("btn-yt-play");
        const stopBtn = document.getElementById("btn-yt-stop");
        const statusBadge = document.getElementById("yt-status-badge");
        const titleEl = document.getElementById("yt-current-stream-title");
        const extLink = document.getElementById("btn-yt-external-link");

        if (extLink) {
            extLink.href = `https://www.youtube.com/watch?v=${this.currentVideoId}`;
        }

        const activePreset = this.presets.find(p => p.id === this.currentVideoId);
        if (titleEl) {
            titleEl.textContent = activePreset ? activePreset.title : `Vidéo YouTube (${this.currentVideoId})`;
        }

        if (this.currentMode === "studio") {
            const isRadio = window.ambience?.isRadioPlaying;
            if (playBtn) playBtn.classList.toggle("hidden", isRadio);
            if (stopBtn) stopBtn.classList.toggle("hidden", !isRadio);
            if (statusBadge) {
                statusBadge.innerHTML = isRadio 
                    ? '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> <span class="text-emerald-400 font-bold">Studio En Direct</span>'
                    : '<span class="w-2 h-2 rounded-full bg-brand-gold"></span> <span class="text-brand-muted">Studio Prêt</span>';
            }
        } else {
            if (playBtn) playBtn.classList.toggle("hidden", this.isPlaying);
            if (stopBtn) stopBtn.classList.toggle("hidden", !this.isPlaying);
            if (statusBadge) {
                statusBadge.innerHTML = this.isPlaying
                    ? '<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> <span class="text-red-400 font-bold">Vidéo Active</span>'
                    : '<span class="w-2 h-2 rounded-full bg-amber-400"></span> <span class="text-brand-muted">Vidéo en Pause</span>';
            }
        }
    }

    renderPresets() {
        const container = document.getElementById("yt-presets-container");
        if (!container) return;

        container.innerHTML = this.presets.map(p => {
            const isSelected = this.currentVideoId === p.id;
            return `
                <button data-video-id="${p.id}" onclick="window.youtubeSimulator?.loadVideo('${p.id}', true)" class="yt-preset-btn text-left p-2.5 rounded-xl glass-card border ${isSelected ? 'border-brand-gold bg-brand-cherry/30 shadow-md ring-1 ring-brand-gold/50' : 'border-brand-borderSubtle bg-brand-darker hover:border-brand-gold/50'} transition-all group flex flex-col justify-between active:scale-95 cursor-pointer">
                    <div class="flex items-center justify-between gap-1 w-full mb-1">
                        <span class="text-[9px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-brand-gold text-brand-darker font-bold' : 'bg-white/5 text-brand-goldLight'}">
                            ${p.tag}
                        </span>
                        <i class="fa-solid ${p.icon} text-xs ${isSelected ? 'text-brand-gold' : 'text-brand-muted group-hover:text-brand-gold'} transition"></i>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-white font-outfit truncate">${p.title}</h4>
                        <p class="text-[10px] text-brand-muted truncate">${p.desc}</p>
                    </div>
                </button>
            `;
        }).join("");
    }

    bindEvents() {
        const playBtn = document.getElementById("btn-yt-play");
        const stopBtn = document.getElementById("btn-yt-stop");
        const floatBtn = document.getElementById("btn-yt-float-toggle");
        const customBtn = document.getElementById("btn-yt-load-custom");
        const customInput = document.getElementById("yt-custom-url-input");

        playBtn?.addEventListener("click", () => {
            window.ambience?.playClick?.();
            this.play();
        });

        stopBtn?.addEventListener("click", () => {
            window.ambience?.playClick?.();
            this.stop();
        });

        floatBtn?.addEventListener("click", () => {
            window.ambience?.playClick?.();
            this.toggleFloating();
        });

        customBtn?.addEventListener("click", () => {
            this.loadCustomFromInput();
        });

        customInput?.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.loadCustomFromInput();
            }
        });

        document.getElementById("btn-close-floating-yt")?.addEventListener("click", () => {
            this.toggleFloating(false);
        });
    }

    loadCustomFromInput() {
        const customInput = document.getElementById("yt-custom-url-input");
        const val = customInput?.value;
        const vid = this.extractVideoId(val);
        if (vid) {
            window.ambience?.playClick?.();
            this.setMode("youtube");
            this.loadVideo(vid, true);
            if (customInput) customInput.value = "";
        } else {
            alert("Veuillez coller un lien ou identifiant YouTube valide (ex: https://youtube.com/watch?v=...)");
        }
    }

    extractVideoId(input) {
        if (!input) return null;
        const trimmed = input.trim();
        if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
            return trimmed;
        }
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = trimmed.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    loadVideo(videoId, autoPlay = true) {
        this.currentVideoId = videoId;
        localStorage.setItem("ss_yt_video_id", videoId);
        this.renderPresets();

        const activePreset = this.presets.find(p => p.id === videoId);

        if (this.currentMode === "studio") {
            // When in studio mode, sync the associated radio station if available
            if (activePreset && activePreset.radioStation && window.ambience) {
                window.ambience.playRadioStation(activePreset.radioStation);
            }
            this.renderStudioMode();
        } else {
            // In YouTube mode: if autoPlay, start playing
            if (autoPlay) {
                this.play();
            } else {
                this.renderYouTubeMode();
            }
        }
    }

    play() {
        if (this.currentMode === "studio") {
            if (window.ambience) {
                window.ambience.playRadioStation(window.ambience.currentStationKey || "chillhop");
            }
            this.renderStudioMode();
            return;
        }

        // YouTube Mode
        this.isPlaying = true;
        // Pause background radio if playing to avoid cacophony
        if (window.ambience?.isRadioPlaying) {
            window.ambience.radioAudio.pause();
        }
        this.renderYouTubeMode();

        if (this.isFloating) {
            this.renderFloatingScreen();
        }
    }

    stop() {
        if (this.currentMode === "studio") {
            if (window.ambience?.isRadioPlaying) {
                window.ambience.radioAudio.pause();
            }
            this.renderStudioMode();
            return;
        }

        // YouTube Mode
        this.isPlaying = false;
        this.renderYouTubeMode();

        if (this.isFloating) {
            this.renderFloatingScreen();
        }
    }

    toggleFloating(forceState) {
        this.isFloating = typeof forceState === "boolean" ? forceState : !this.isFloating;
        const floatingCard = document.getElementById("yt-floating-mini-player");
        const floatBtn = document.getElementById("btn-yt-float-toggle");

        if (this.isFloating) {
            floatingCard?.classList.remove("hidden");
            floatingCard?.classList.add("flex");
            floatBtn?.classList.add("bg-brand-cherry", "text-brand-gold");
            this.renderFloatingScreen();
        } else {
            floatingCard?.classList.add("hidden");
            floatingCard?.classList.remove("flex");
            floatBtn?.classList.remove("bg-brand-cherry", "text-brand-gold");
            this.renderCurrentScreen();
        }
    }

    renderFloatingScreen() {
        const floatingScreen = document.getElementById("yt-floating-screen-container");
        if (!floatingScreen) return;

        if (this.currentMode === "youtube" && this.isPlaying) {
            const embedUrl = `https://www.youtube.com/embed/${this.currentVideoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`;
            floatingScreen.innerHTML = `
                <iframe src="${embedUrl}" 
                    class="w-full h-full border-0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>
            `;
        } else {
            const thumbUrl = `https://img.youtube.com/vi/${this.currentVideoId}/hqdefault.jpg`;
            floatingScreen.innerHTML = `
                <div class="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-cover bg-center" style="background-image: linear-gradient(rgba(7,7,10,0.6), rgba(7,7,10,0.9)), url('${thumbUrl}')">
                    <button onclick="window.youtubeSimulator?.play()" class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm shadow mb-1">
                        <i class="fa-solid fa-play ml-0.5"></i>
                    </button>
                    <span class="text-[10px] font-bold text-white font-outfit truncate max-w-[200px]">
                        ${this.currentMode === 'studio' ? 'Studio Lo-Fi Actif' : 'Session Vidéo YouTube'}
                    </span>
                </div>
            `;
        }
    }
}

// Global initialization
function initYouTubeStudySimulator() {
    if (!window.youtubeSimulator) {
        window.youtubeSimulator = new YouTubeStudySimulator();
        window.youtubeSimulator.init();
    }
}

window.YouTubeStudySimulator = YouTubeStudySimulator;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initYouTubeStudySimulator);
} else {
    initYouTubeStudySimulator();
}
