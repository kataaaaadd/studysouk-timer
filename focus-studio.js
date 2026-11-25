/**
 * StudySouk Timer - Master Focus Studio & Lo-Fi Streaming Station
 * 100% Native HTML5 Canvas 60 FPS Visualizer + 24/7 Live Lo-Fi Webradio
 * Completely immune to browser CSP, iframe restrictions, and Error 153!
 */

const STUDIO_THEMES = {
    room: {
        id: "room",
        name: "Chambre Lo-Fi",
        motto: "Concentration Profonde & Beats Doux",
        icon: "fa-mug-hot",
        station: "chillhop",
        color: "rgba(110, 20, 40, 0.45)"
    },
    rain: {
        id: "rain",
        name: "Pluie Nocturne",
        motto: "Gouttes de Pluie & Ambiance de Nuit",
        icon: "fa-cloud-rain",
        station: "lofigirl",
        color: "rgba(20, 45, 90, 0.45)"
    },
    fire: {
        id: "fire",
        name: "Feu de Bois",
        motto: "Chaleur de Cheminée & Calme Absolu",
        icon: "fa-fire",
        station: "chillhop",
        color: "rgba(140, 35, 10, 0.45)"
    },
    piano: {
        id: "piano",
        name: "Chopin & Piano CPGE",
        motto: "Clarté Mentale & Classique Intemporel",
        icon: "fa-feather",
        station: "piano",
        color: "rgba(120, 85, 20, 0.40)"
    },
    quran: {
        id: "quran",
        name: "Sanctuaire Coran",
        motto: "Récitation Apaisante • Mishary Alafasy",
        icon: "fa-moon",
        station: "quran",
        color: "rgba(20, 80, 60, 0.40)"
    }
};

class FocusStudioEngine {
    constructor() {
        this.currentThemeKey = localStorage.getItem("ss_studio_theme") || "room";
        this.isFloating = false;
        this.studioAnimationId = null;
        this.particles = [];
        this.equalizerBars = Array.from({ length: 28 }, () => Math.random() * 0.4 + 0.1);
    }

    init() {
        this.bindEvents();
        this.renderStudioScreen();
        console.log("[FocusStudio] 100% Native Focus Engine initialized with theme:", this.currentThemeKey);
    }

    getContainer() {
        return document.getElementById("studio-screen-container") || document.getElementById("yt-screen-container");
    }

    setTheme(themeKey) {
        if (!STUDIO_THEMES[themeKey]) return;
        this.currentThemeKey = themeKey;
        localStorage.setItem("ss_studio_theme", themeKey);
        window.ambience?.playClick?.();

        const theme = STUDIO_THEMES[themeKey];
        if (theme.station && window.ambience) {
            window.ambience.playRadioStation(theme.station);
        }

        this.renderStudioScreen();
    }

    renderStudioScreen() {
        this.stopAnimation();
        const container = this.getContainer();
        if (!container) return;

        container.style.backgroundImage = "none";
        container.style.backgroundColor = "#07070c";

        const isRadioPlaying = window.ambience?.isRadioPlaying;
        const currentStationKey = window.ambience?.currentStationKey || "chillhop";
        const station = (window.LOFI_STATIONS && window.LOFI_STATIONS[currentStationKey])
            ? window.LOFI_STATIONS[currentStationKey]
            : { name: "Chillhop Study Beats", icon: "fa-mug-hot" };

        const currentTheme = STUDIO_THEMES[this.currentThemeKey] || STUDIO_THEMES.room;

        container.innerHTML = `
            <div class="relative w-full h-full flex flex-col justify-between p-3.5 sm:p-4 overflow-hidden select-none">
                <!-- 60 FPS Interactive Canvas -->
                <canvas id="lofi-studio-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas>

                <!-- Top Bar: Active Station Tag & Visual Theme Pills -->
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-1.5">
                    <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-darker/85 backdrop-blur-md border border-brand-gold/30 shadow-md">
                        <span class="w-2 h-2 rounded-full ${isRadioPlaying ? 'bg-emerald-400 animate-ping' : 'bg-brand-gold'}"></span>
                        <span class="text-[10px] font-bold text-white font-outfit truncate max-w-[170px]" id="studio-station-tag">
                            ${station.name}
                        </span>
                    </div>

                    <!-- Theme Switcher Pills -->
                    <div class="flex items-center gap-1 p-0.5 rounded-lg bg-brand-darker/90 backdrop-blur-md border border-brand-borderSubtle">
                        <button onclick="window.focusStudio?.setTheme('room')" title="Chambre Lo-Fi" class="px-2 py-0.5 rounded text-[9px] font-bold font-outfit transition cursor-pointer ${this.currentThemeKey === 'room' ? 'bg-brand-cherry text-brand-gold shadow' : 'text-brand-muted hover:text-white'}">
                            <i class="fa-solid fa-mug-hot"></i> <span class="hidden sm:inline">Lo-Fi</span>
                        </button>
                        <button onclick="window.focusStudio?.setTheme('rain')" title="Pluie Nocturne" class="px-2 py-0.5 rounded text-[9px] font-bold font-outfit transition cursor-pointer ${this.currentThemeKey === 'rain' ? 'bg-brand-cherry text-brand-gold shadow' : 'text-brand-muted hover:text-white'}">
                            <i class="fa-solid fa-cloud-rain"></i> <span class="hidden sm:inline">Pluie</span>
                        </button>
                        <button onclick="window.focusStudio?.setTheme('fire')" title="Feu de Bois" class="px-2 py-0.5 rounded text-[9px] font-bold font-outfit transition cursor-pointer ${this.currentThemeKey === 'fire' ? 'bg-brand-cherry text-brand-gold shadow' : 'text-brand-muted hover:text-white'}">
                            <i class="fa-solid fa-fire"></i> <span class="hidden sm:inline">Feu</span>
                        </button>
                        <button onclick="window.focusStudio?.setTheme('piano')" title="Chopin & Piano" class="px-2 py-0.5 rounded text-[9px] font-bold font-outfit transition cursor-pointer ${this.currentThemeKey === 'piano' ? 'bg-brand-cherry text-brand-gold shadow' : 'text-brand-muted hover:text-white'}">
                            <i class="fa-solid fa-feather"></i> <span class="hidden sm:inline">Piano</span>
                        </button>
                        <button onclick="window.focusStudio?.setTheme('quran')" title="Coran Karim" class="px-2 py-0.5 rounded text-[9px] font-bold font-outfit transition cursor-pointer ${this.currentThemeKey === 'quran' ? 'bg-brand-cherry text-brand-gold shadow' : 'text-brand-muted hover:text-white'}">
                            <i class="fa-solid fa-moon"></i> <span class="hidden sm:inline">Coran</span>
                        </button>
                    </div>
                </div>

                <!-- Center Display: Clock, Theme Motto & Master Play Button -->
                <div class="relative z-10 flex flex-col items-center justify-center text-center my-auto">
                    <div class="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-brand-gold to-amber-100 font-mono tracking-wider drop-shadow-xl" id="studio-digital-clock">
                        ${this.getFormattedTime()}
                    </div>
                    
                    <p class="text-[11px] text-brand-goldLight font-outfit font-semibold mt-1 tracking-wide flex items-center gap-1.5 drop-shadow">
                        <i class="fa-solid ${currentTheme.icon} text-brand-gold"></i>
                        <span>${currentTheme.name} • ${currentTheme.motto}</span>
                    </p>

                    <!-- Big Play / Pause Audio Control -->
                    <div class="mt-3.5 flex items-center gap-2">
                        <button onclick="window.focusStudio?.toggleAudio()" class="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-cherry to-brand-cherryVibrant hover:brightness-110 text-brand-gold text-xs font-bold font-outfit border border-brand-gold/60 shadow-[0_0_20px_rgba(234,179,8,0.25)] transition active:scale-95 flex items-center gap-2 cursor-pointer backdrop-blur-md">
                            <i class="fa-solid ${isRadioPlaying ? 'fa-pause' : 'fa-play'} text-sm"></i>
                            <span>${isRadioPlaying ? 'Mettre en Pause' : 'Lancer la Musique 24/7'}</span>
                        </button>
                    </div>
                </div>

                <!-- Bottom Status & Equalizer Legend -->
                <div class="relative z-10 flex items-center justify-between gap-1 pt-2 border-t border-white/10 bg-brand-darker/70 backdrop-blur-md -mx-4 -mb-4 px-4 py-2">
                    <div class="flex items-center gap-2 text-[10px] text-brand-muted font-outfit">
                        <i class="fa-solid fa-wand-magic-sparkles text-brand-gold text-[9px]"></i>
                        <span>Ambiance Immersive Nabras</span>
                    </div>

                    <div class="text-[9px] font-mono text-emerald-400 flex items-center gap-1 shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>100% Natif Web Audio</span>
                    </div>
                </div>
            </div>
        `;

        this.startAnimation();
        this.updateHeaderUI();
    }

    getFormattedTime() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }

    startAnimation() {
        const canvas = document.getElementById("lofi-studio-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 640;
            canvas.height = canvas.parentElement?.clientHeight || 340;
        };
        resize();

        this.particles = Array.from({ length: 48 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 2.5 + 1.2,
            size: Math.random() * 3 + 1,
            length: Math.random() * 14 + 6,
            alpha: Math.random() * 0.5 + 0.1
        }));

        const clockEl = document.getElementById("studio-digital-clock");
        let lastClockUpdate = 0;

        const animate = (time) => {
            if (!document.getElementById("lofi-studio-canvas")) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Theme-specific Radial Gradient
            const grad = ctx.createRadialGradient(
                canvas.width / 2, canvas.height * 0.45, 15,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.75
            );

            if (this.currentThemeKey === "fire") {
                grad.addColorStop(0, "rgba(140, 35, 10, 0.45)");
                grad.addColorStop(0.6, "rgba(45, 12, 10, 0.75)");
                grad.addColorStop(1, "rgba(10, 5, 5, 0.98)");
            } else if (this.currentThemeKey === "rain") {
                grad.addColorStop(0, "rgba(20, 45, 90, 0.45)");
                grad.addColorStop(0.6, "rgba(10, 20, 45, 0.75)");
                grad.addColorStop(1, "rgba(5, 7, 15, 0.98)");
            } else if (this.currentThemeKey === "piano") {
                grad.addColorStop(0, "rgba(120, 85, 20, 0.40)");
                grad.addColorStop(0.6, "rgba(35, 25, 10, 0.75)");
                grad.addColorStop(1, "rgba(8, 7, 6, 0.98)");
            } else if (this.currentThemeKey === "quran") {
                grad.addColorStop(0, "rgba(20, 80, 60, 0.40)");
                grad.addColorStop(0.6, "rgba(10, 35, 28, 0.75)");
                grad.addColorStop(1, "rgba(5, 12, 10, 0.98)");
            } else {
                grad.addColorStop(0, "rgba(110, 20, 40, 0.45)");
                grad.addColorStop(0.6, "rgba(30, 10, 25, 0.75)");
                grad.addColorStop(1, "rgba(8, 7, 12, 0.98)");
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Animated Particles
            if (this.currentThemeKey === "fire") {
                for (let p of this.particles) {
                    ctx.fillStyle = `rgba(255, ${Math.floor(140 + Math.random() * 60)}, 40, ${p.alpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();

                    p.y -= p.speed * 0.9;
                    p.x += (Math.random() - 0.5) * 1.2;
                    if (p.y < 0) {
                        p.y = canvas.height;
                        p.x = Math.random() * canvas.width;
                    }
                }
            } else if (this.currentThemeKey === "quran" || this.currentThemeKey === "piano") {
                for (let p of this.particles) {
                    ctx.fillStyle = `rgba(240, 215, 130, ${p.alpha * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();

                    p.y -= p.speed * 0.3;
                    p.x += Math.sin(p.y * 0.02) * 0.5;
                    if (p.y < 0) {
                        p.y = canvas.height;
                        p.x = Math.random() * canvas.width;
                    }
                }
            } else {
                ctx.strokeStyle = "rgba(190, 220, 255, 0.28)";
                ctx.lineWidth = 1.2;
                for (let p of this.particles) {
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
            }

            // 3. Audio Equalizer Frequency Bars
            const isPlaying = window.ambience?.isRadioPlaying;
            const barCount = 28;
            const barWidth = canvas.width / (barCount * 1.5);
            const startX = (canvas.width - (barCount * barWidth * 1.3)) / 2;

            for (let i = 0; i < barCount; i++) {
                if (isPlaying) {
                    this.equalizerBars[i] += (Math.random() - 0.48) * 0.22;
                    this.equalizerBars[i] = Math.max(0.1, Math.min(0.9, this.equalizerBars[i]));
                } else {
                    this.equalizerBars[i] = Math.max(0.04, this.equalizerBars[i] * 0.95);
                }

                const height = this.equalizerBars[i] * 55;
                const x = startX + i * barWidth * 1.3;
                const y = canvas.height - height - 44;

                const barGrad = ctx.createLinearGradient(0, y, 0, y + height);
                barGrad.addColorStop(0, "rgba(234, 179, 8, 0.85)"); // Imperial Gold
                barGrad.addColorStop(1, "rgba(180, 25, 45, 0.25)");  // Royal Cherry

                ctx.fillStyle = barGrad;
                ctx.fillRect(x, y, barWidth, height);
            }

            if (time - lastClockUpdate > 1000) {
                if (clockEl) clockEl.textContent = this.getFormattedTime();
                lastClockUpdate = time;
            }

            this.studioAnimationId = requestAnimationFrame(animate);
        };

        this.studioAnimationId = requestAnimationFrame(animate);
    }

    stopAnimation() {
        if (this.studioAnimationId) {
            cancelAnimationFrame(this.studioAnimationId);
            this.studioAnimationId = null;
        }
    }

    toggleAudio() {
        window.ambience?.playClick?.();
        if (window.ambience) {
            window.ambience.toggleRadio();
            setTimeout(() => {
                this.renderStudioScreen();
                this.updateHeaderUI();
            }, 100);
        }
    }

    updateHeaderUI() {
        const isPlaying = window.ambience?.isRadioPlaying;
        const currentStationKey = window.ambience?.currentStationKey || "chillhop";
        const station = (window.LOFI_STATIONS && window.LOFI_STATIONS[currentStationKey])
            ? window.LOFI_STATIONS[currentStationKey]
            : { name: "Chillhop Study Beats" };

        const statusText = document.getElementById("radio-status-text");
        if (statusText) {
            statusText.textContent = isPlaying ? `● En Direct : ${station.name}` : "Radio en Pause";
            statusText.className = isPlaying ? "text-[10px] text-emerald-400 font-bold" : "text-[10px] text-brand-muted";
        }

        const btnText = document.getElementById("radio-btn-text");
        if (btnText) {
            btnText.textContent = isPlaying ? "Mettre en Pause" : "Écouter le Live";
        }

        const toggleBtn = document.getElementById("btn-radio-toggle");
        if (toggleBtn) {
            toggleBtn.innerHTML = isPlaying
                ? `<i class="fa-solid fa-pause text-[10px]"></i> <span id="radio-btn-text">Pause Radio</span>`
                : `<i class="fa-solid fa-play text-[10px]"></i> <span id="radio-btn-text">Écouter le Live</span>`;
        }
    }

    toggleFloating(forceState) {
        this.isFloating = typeof forceState === "boolean" ? forceState : !this.isFloating;
        const floatingCard = document.getElementById("lofi-floating-mini-player") || document.getElementById("yt-floating-mini-player");
        const floatBtn = document.getElementById("btn-studio-float-toggle") || document.getElementById("btn-yt-float-toggle");

        if (this.isFloating) {
            floatingCard?.classList.remove("hidden");
            floatingCard?.classList.add("flex");
            floatBtn?.classList.add("bg-brand-cherry", "text-brand-gold");
            this.renderFloatingMini();
        } else {
            floatingCard?.classList.add("hidden");
            floatingCard?.classList.remove("flex");
            floatBtn?.classList.remove("bg-brand-cherry", "text-brand-gold");
        }
    }

    renderFloatingMini() {
        const miniContainer = document.getElementById("lofi-floating-screen-container") || document.getElementById("yt-floating-screen-container");
        if (!miniContainer) return;

        const isPlaying = window.ambience?.isRadioPlaying;
        const stationKey = window.ambience?.currentStationKey || "chillhop";
        const station = (window.LOFI_STATIONS && window.LOFI_STATIONS[stationKey])
            ? window.LOFI_STATIONS[stationKey]
            : { name: "Chillhop Beats" };

        miniContainer.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-brand-darker via-brand-card to-brand-darker">
                <button onclick="window.focusStudio?.toggleAudio()" class="w-12 h-12 rounded-full bg-gradient-to-r from-brand-cherry to-brand-cherryVibrant hover:brightness-110 text-brand-gold flex items-center justify-center text-lg shadow-xl border border-brand-gold/50 mb-2 transition active:scale-95 cursor-pointer">
                    <i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                </button>
                <span class="text-xs font-bold text-white font-outfit truncate max-w-[220px]">
                    ${station.name}
                </span>
                <span class="text-[9px] font-mono text-emerald-400 mt-0.5">
                    ${isPlaying ? '● En Direct 24/7' : 'En Pause'}
                </span>
            </div>
        `;
    }

    bindEvents() {
        document.getElementById("btn-close-floating-lofi")?.addEventListener("click", () => {
            this.toggleFloating(false);
        });
        document.getElementById("btn-close-floating-yt")?.addEventListener("click", () => {
            this.toggleFloating(false);
        });
    }

    onTabVisible() {
        this.renderStudioScreen();
    }
}

// Global initialization
function initFocusStudio() {
    if (!window.focusStudio) {
        window.focusStudio = new FocusStudioEngine();
        window.focusStudio.init();
    }
    // Backward compatibility aliases so no legacy code fails
    window.youtubeSimulator = window.focusStudio;
    window.youtubeSimulator.renderPresets = () => {};
    window.youtubeSimulator.renderCurrentScreen = () => window.focusStudio.renderStudioScreen();
    window.youtubeSimulator.play = () => window.focusStudio.toggleAudio();
    window.youtubeSimulator.stop = () => {
        if (window.ambience?.isRadioPlaying) window.ambience.radioAudio.pause();
        window.focusStudio.renderStudioScreen();
    };
}

window.FocusStudioEngine = FocusStudioEngine;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFocusStudio);
} else {
    initFocusStudio();
}
