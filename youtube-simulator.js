/**
 * StudySouk Timer - YouTube Study Simulator & Lo-Fi Music Station
 * High-fidelity study video player & background music simulator for students.
 */

const YOUTUBE_STUDY_PRESETS = [
    {
        id: "jfKfPfyJRdk",
        title: "Lofi Girl 24/7",
        desc: "Beats to relax/study to (Live)",
        icon: "fa-headphones",
        tag: "Lo-Fi Beats"
    },
    {
        id: "lTRiuFIWV54",
        title: "Tokyo Rain Cafe",
        desc: "Ambiance Pluie & Jazz Café 4K",
        icon: "fa-cloud-rain",
        tag: "Pluie & Café"
    },
    {
        id: "wygy721nzRc",
        title: "Chopin Piano Focus",
        desc: "Nocturnes & Classique CPGE",
        icon: "fa-feather",
        tag: "Piano"
    },
    {
        id: "mPZkdNFkNps",
        title: "Cabin Fireplace & Rain",
        desc: "Cheminée crépitante & Orage doux",
        icon: "fa-fire",
        tag: "Cozy ASMR"
    },
    {
        id: "5qap5aO4i9A",
        title: "Study With Me (Pomodoro)",
        desc: "Deep Focus 50/10 Session",
        icon: "fa-stopwatch",
        tag: "Pomodoro"
    },
    {
        id: "0U_Z7Gk597E",
        title: "Coran Karim - Tilawat",
        desc: "Récitation apaisante pour concentration",
        icon: "fa-moon",
        tag: "Coran"
    }
];

class YouTubeStudySimulator {
    constructor() {
        this.currentVideoId = localStorage.getItem("ss_yt_video_id") || "jfKfPfyJRdk";
        this.isPlaying = false;
        this.isFloating = false;
        this.presets = YOUTUBE_STUDY_PRESETS;
    }

    init() {
        this.renderPresets();
        this.bindEvents();
        console.log("[YouTubeSimulator] Engine initialized with video:", this.currentVideoId);
    }

    extractVideoId(input) {
        if (!input) return null;
        const trimmed = input.trim();
        // Raw 11-char ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
            return trimmed;
        }
        // Full YouTube URL
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = trimmed.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    renderPresets() {
        const container = document.getElementById("yt-presets-container");
        if (!container) return;

        container.innerHTML = this.presets.map(p => {
            const isSelected = this.currentVideoId === p.id;
            return `
                <button data-video-id="${p.id}" class="yt-preset-btn text-left p-2.5 rounded-xl glass-card border ${isSelected ? 'border-brand-gold bg-brand-cherry/30 shadow-md ring-1 ring-brand-gold/50' : 'border-brand-borderSubtle bg-brand-darker hover:border-brand-gold/50'} transition-all group flex flex-col justify-between active:scale-95">
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

        container.querySelectorAll(".yt-preset-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const vid = btn.dataset.videoId;
                if (!vid) return;
                window.ambience?.playClick?.();
                this.loadVideo(vid, true);
            });
        });
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
            const val = customInput?.value;
            const vid = this.extractVideoId(val);
            if (vid) {
                window.ambience?.playClick?.();
                this.loadVideo(vid, true);
                if (customInput) customInput.value = "";
            } else {
                alert("Veuillez coller un lien ou identifiant YouTube valide (ex: https://youtube.com/watch?v=...)");
            }
        });

        customInput?.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                customBtn?.click();
            }
        });

        // Close Floating Player Button
        document.getElementById("btn-close-floating-yt")?.addEventListener("click", () => {
            this.toggleFloating(false);
        });
    }

    loadVideo(videoId, autoPlay = true) {
        this.currentVideoId = videoId;
        localStorage.setItem("ss_yt_video_id", videoId);
        this.renderPresets();

        // Update video title display
        const activePreset = this.presets.find(p => p.id === videoId);
        const titleEl = document.getElementById("yt-current-stream-title");
        if (titleEl) {
            titleEl.textContent = activePreset ? activePreset.title : `Vidéo YouTube (${videoId})`;
        }

        if (autoPlay) {
            this.play();
        }
    }

    play() {
        if (!this.currentVideoId) return;
        this.isPlaying = true;

        // Auto lower or pause webradio if playing to avoid audio clash
        if (window.ambience?.isPlayingRadio) {
            window.ambience.stopRadio();
        }

        const screenContainer = document.getElementById("yt-screen-container");
        const floatingScreen = document.getElementById("yt-floating-screen-container");
        const playBtn = document.getElementById("btn-yt-play");
        const stopBtn = document.getElementById("btn-yt-stop");
        const statusBadge = document.getElementById("yt-status-badge");

        const embedUrl = `https://www.youtube-nocookie.com/embed/${this.currentVideoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3`;

        const iframeHtml = `
            <iframe id="yt-player-iframe" src="${embedUrl}" 
                class="w-full h-full rounded-xl border-0 shadow-2xl" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        `;

        if (screenContainer) {
            screenContainer.innerHTML = iframeHtml;
        }
        if (floatingScreen) {
            floatingScreen.innerHTML = iframeHtml;
        }

        if (playBtn) playBtn.classList.add("hidden");
        if (stopBtn) stopBtn.classList.remove("hidden");
        if (statusBadge) {
            statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> <span class="text-emerald-400 font-bold">En Lecture</span>';
        }
    }

    stop() {
        this.isPlaying = false;
        const screenContainer = document.getElementById("yt-screen-container");
        const floatingScreen = document.getElementById("yt-floating-screen-container");
        const playBtn = document.getElementById("btn-yt-play");
        const stopBtn = document.getElementById("btn-yt-stop");
        const statusBadge = document.getElementById("yt-status-badge");

        const placeholderHtml = `
            <div class="w-full h-full min-h-[190px] flex flex-col items-center justify-center bg-brand-darker/90 rounded-xl border border-dashed border-brand-borderSubtle text-center p-4">
                <div class="w-12 h-12 rounded-full bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center text-xl mb-2 shadow-lg">
                    <i class="fa-brands fa-youtube"></i>
                </div>
                <h4 class="text-xs font-bold text-white font-outfit mb-0.5">Lecteur YouTube Prêt</h4>
                <p class="text-[10px] text-brand-muted mb-2.5">Choisissez une ambiance d'étude ou collez un lien personnalisé</p>
                <button onclick="window.youtubeSimulator?.play()" class="px-3 py-1 rounded-lg bg-brand-cherry hover:bg-brand-cherryVibrant text-brand-gold text-xs font-bold font-outfit border border-brand-gold/40 shadow transition active:scale-95 flex items-center gap-1.5">
                    <i class="fa-solid fa-play text-[10px]"></i> Lancer la Session
                </button>
            </div>
        `;

        if (screenContainer) screenContainer.innerHTML = placeholderHtml;
        if (floatingScreen) floatingScreen.innerHTML = "";

        if (playBtn) playBtn.classList.remove("hidden");
        if (stopBtn) stopBtn.classList.add("hidden");
        if (statusBadge) {
            statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span> <span class="text-brand-muted">En Pause</span>';
        }
    }

    toggleFloating(forceState) {
        this.isFloating = typeof forceState === "boolean" ? forceState : !this.isFloating;
        const floatingCard = document.getElementById("yt-floating-mini-player");
        const floatBtn = document.getElementById("btn-yt-float-toggle");

        if (this.isFloating) {
            floatingCard?.classList.remove("hidden");
            floatingCard?.classList.add("flex");
            if (floatBtn) {
                floatBtn.classList.add("bg-brand-cherry", "text-brand-gold");
            }
            // Move stream into floating or mirror
            if (this.isPlaying) {
                this.play();
            }
        } else {
            floatingCard?.classList.add("hidden");
            floatingCard?.classList.remove("flex");
            if (floatBtn) {
                floatBtn.classList.remove("bg-brand-cherry", "text-brand-gold");
            }
        }
    }
}

// Global initialization
window.YouTubeStudySimulator = YouTubeStudySimulator;
document.addEventListener("DOMContentLoaded", () => {
    window.youtubeSimulator = new YouTubeStudySimulator();
    window.youtubeSimulator.init();
});
