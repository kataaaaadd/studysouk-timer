/**
 * StudySouk Timer - Floating Room Reactions Engine
 * Styled with StudySouk Royal Cherry & Imperial Gold Glassmorphism.
 * Realtime synchronization across all members in the Discord Voice Channel.
 * Features 100% self-hosted vector & HD emojis.
 */

const HOSTED_REACTIONS = [
    { key: "ss_fire", emoji: "🔥", img: "assets/emojis/ss_fire.png", label: "Flamme Focus" },
    { key: "ss_coffee", emoji: "☕", img: "assets/emojis/ss_coffee.png", label: "Pause Café" },
    { key: "ss_pomodoro", emoji: "🍅", img: "assets/emojis/ss_pomodoro.png", label: "Pomodoro" },
    { key: "ss_brain", emoji: "🧠", img: "assets/emojis/ss_brain.png", label: "Génie STEM" },
    { key: "ss_lightning", emoji: "⚡", img: "assets/emojis/ss_lightning.png", label: "Énergie" },
    { key: "ss_crown", emoji: "👑", img: "assets/emojis/ss_crown.png", label: "Royal StudySouk" },
    { key: "ss_trophy", emoji: "🏆", img: "assets/emojis/ss_trophy.png", label: "Excellence" }
];

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
                if (data && data.emojiKey) {
                    this.spawnReaction(data.emojiKey, data.author);
                } else if (data && data.emoji) {
                    // Fallback to emoji match
                    const found = HOSTED_REACTIONS.find(r => r.emoji === data.emoji);
                    this.spawnReaction(found ? found.key : "ss_fire", data.author);
                }
            });
        }
    }

    renderBar() {
        this.container.innerHTML = `
            <div class="flex items-center gap-1 p-1 rounded-full glass-panel border border-brand-gold/40 shadow-2xl bg-brand-darker/95 backdrop-blur-xl">
                <span class="text-[9px] uppercase tracking-wider text-brand-goldLight font-extrabold pl-2 pr-0.5 hidden sm:inline font-outfit">
                    ✨
                </span>
                ${HOSTED_REACTIONS.map(r => `
                    <button data-key="${r.key}" title="${r.label}" class="reaction-btn w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-card hover:bg-brand-cherry hover:border-brand-gold active:scale-125 transition-all flex items-center justify-center border border-brand-borderSubtle shadow-sm p-1">
                        <img src="${r.img}" alt="${r.label}" class="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm">
                    </button>
                `).join('')}
            </div>
        `;

        this.container.querySelectorAll(".reaction-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const key = e.currentTarget.dataset.key;
                const selfUser = window.roomSync?.currentUser || { name: "Moi" };
                this.spawnReaction(key, selfUser);

                if (window.roomSync) {
                    window.roomSync.sendReaction(key);
                }
            });
        });
    }

    spawnReaction(emojiKey, author = null) {
        window.ambience?.playPop();

        const reaction = HOSTED_REACTIONS.find(r => r.key === emojiKey) || HOSTED_REACTIONS[0];
        const el = document.createElement("div");
        el.className = "absolute flex items-center gap-2 select-none pointer-events-none transition-all drop-shadow-[0_4px_16px_rgba(212,175,55,0.6)]";

        let authorBadge = "";
        if (author && author.name) {
            const shortName = author.name.split(" ")[0];
            authorBadge = `
                <span class="text-[9px] font-bold text-brand-goldLight bg-brand-darker/95 px-2 py-0.5 rounded-full border border-brand-gold/40 font-outfit shadow-md whitespace-nowrap">
                    ${shortName}
                </span>
            `;
        }

        el.innerHTML = `
            <img src="${reaction.img}" class="w-9 h-9 sm:w-11 sm:h-11 object-contain">
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

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            const curX = startX + (targetX - startX) * ease;
            const curY = startY + (targetY - startY) * ease;
            const curScale = 0.6 + 0.5 * Math.sin(progress * Math.PI);
            const curOpacity = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

            el.style.left = `${curX}px`;
            el.style.top = `${curY}px`;
            el.style.opacity = `${curOpacity}`;
            el.style.transform = `scale(${curScale})`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                el.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}

window.ReactionsEngine = ReactionsEngine;
