/**
 * StudySouk Timer - Floating Room Reactions Engine
 * Styled with StudySouk Royal Cherry & Imperial Gold Glassmorphism.
 * Realtime synchronization across all members in the Discord Voice Channel.
 */

class ReactionsEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.floatingLayer = null;
        this.init();
        this.initSyncListener();
    }

    init() {
        this.floatingLayer = document.createElement("div");
        this.floatingLayer.className = "fixed inset-0 pointer-events-none z-50 overflow-hidden";
        document.body.appendChild(this.floatingLayer);

        if (this.container) {
            this.renderBar();
        }
    }

    initSyncListener() {
        if (window.roomSync) {
            window.roomSync.on("reaction_received", (data) => {
                if (data && data.emoji) {
                    this.spawnReaction(data.emoji, data.author);
                }
            });
        }
    }

    renderBar() {
        const emojis = ["🔥", "☕", "🍅", "🧠", "⚡", "👏", "🏆"];
        this.container.innerHTML = `
            <div class="flex items-center gap-1 p-1 rounded-full glass-panel border border-brand-gold/40 shadow-2xl bg-brand-darker/95 backdrop-blur-xl">
                <span class="text-[9px] uppercase tracking-wider text-brand-goldLight font-extrabold pl-2 pr-0.5 hidden sm:inline font-outfit">
                    ✨
                </span>
                ${emojis.map(e => `
                    <button data-emoji="${e}" class="reaction-btn w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-card hover:bg-brand-cherry hover:border-brand-gold active:scale-125 transition-all text-xs sm:text-sm flex items-center justify-center border border-brand-borderSubtle shadow-sm">
                        ${e}
                    </button>
                `).join('')}
            </div>
        `;

        this.container.querySelectorAll(".reaction-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const emoji = e.currentTarget.dataset.emoji;
                // 1. Local animation
                const selfUser = window.roomSync?.currentUser || { name: "Moi" };
                this.spawnReaction(emoji, selfUser);

                // 2. Broadcast to room
                if (window.roomSync) {
                    window.roomSync.sendReaction(emoji);
                }
            });
        });
    }

    spawnReaction(emoji, author = null) {
        window.ambience?.playPop();

        const el = document.createElement("div");
        el.className = "absolute flex items-center gap-1.5 select-none pointer-events-none transition-all drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)]";

        let authorBadge = "";
        if (author && author.name) {
            const shortName = author.name.split(" ")[0];
            authorBadge = `
                <span class="text-[9px] font-bold text-brand-goldLight bg-brand-darker/90 px-1.5 py-0.5 rounded-full border border-brand-borderLight font-outfit shadow-sm whitespace-nowrap">
                    ${shortName}
                </span>
            `;
        }

        el.innerHTML = `
            <span class="text-2xl sm:text-3xl">${emoji}</span>
            ${authorBadge}
        `;

        const startX = Math.random() * (window.innerWidth - 120) + 40;
        const startY = window.innerHeight - 90;

        el.style.left = `${startX}px`;
        el.style.top = `${startY}px`;
        el.style.opacity = "1";
        el.style.transform = `scale(0.6) rotate(${(Math.random() - 0.5) * 20}deg)`;

        this.floatingLayer.appendChild(el);

        const duration = 2400 + Math.random() * 800;
        const targetX = startX + (Math.random() - 0.5) * 120;
        const targetY = startY - (320 + Math.random() * 220);

        const startTime = performance.now();

        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(1.0, elapsed / duration);

            const curX = startX + (targetX - startX) * progress;
            const curY = startY + (targetY - startY) * progress;
            const curScale = 0.6 + Math.sin(progress * Math.PI) * 0.7;
            const curOpacity = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

            el.style.left = `${curX}px`;
            el.style.top = `${curY}px`;
            el.style.transform = `scale(${curScale}) rotate(${progress * 25}deg)`;
            el.style.opacity = `${curOpacity}`;

            if (progress < 1.0) {
                requestAnimationFrame(animate);
            } else {
                el.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}

window.ReactionsEngine = ReactionsEngine;
