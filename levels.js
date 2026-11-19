/**
 * StudySouk Academy - Prestige Academic Progression System
 * Grounded in the Moroccan STEM & CPGE/2BAC Academic Excellence.
 */

const RANKS = [
    { level: 1, title: "Adhérent Académie", icon: "📚", color: "#9CA3AF" },
    { level: 3, title: "Khwanss Rigoureux", icon: "📐", color: "#60A5FA" },
    { level: 5, title: "Taupin Assidu", icon: "⚡", color: "#34D399" },
    { level: 8, title: "Admissible Concours", icon: "🏛️", color: "#F59E0B" },
    { level: 10, title: "Major de Promotion", icon: "🥇", color: "#D4AF37" },
    { level: 15, title: "Lauréat Grande École", icon: "🎓", color: "#B8234B" },
    { level: 20, title: "Légende StudySouk Prestige", icon: "👑", color: "#F5C542" }
];

class LevelSystem {
    constructor(badgeContainerId) {
        this.container = document.getElementById(badgeContainerId);
        this.xp = parseInt(localStorage.getItem("ss_timer_xp") || "0", 10);
        this.renderBadge();
    }

    getLevelInfo() {
        const level = Math.floor(Math.sqrt(this.xp / 45)) + 1;
        const currentRank = [...RANKS].reverse().find(r => level >= r.level) || RANKS[0];

        const prevLevelXp = (level - 1) * (level - 1) * 45;
        const nextLevelXp = level * level * 45;
        const progressInLevel = Math.min(1.0, Math.max(0.0, (this.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)));

        return { level, rank: currentRank, progress: progressInLevel, xp: this.xp, nextLevelXp };
    }

    addXP(amount, reason = "") {
        const oldLevel = this.getLevelInfo().level;
        this.xp += amount;
        localStorage.setItem("ss_timer_xp", this.xp);

        const newLevelInfo = this.getLevelInfo();
        this.renderBadge();

        if (newLevelInfo.level > oldLevel) {
            window.ambience?.playSuccess();
            if (window.confetti) {
                window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
            }
            window.studyApp?.showToast(`👑 RANG ACADÉMIQUE SUPÉRIEUR ! Tu es maintenant Niveau ${newLevelInfo.level} — ${newLevelInfo.rank.title} !`);
        } else if (reason) {
            window.studyApp?.showToast(`✨ +${amount} XP (${reason})`);
        }
    }

    renderBadge() {
        if (!this.container) return;
        const info = this.getLevelInfo();
        this.container.innerHTML = `
            <div class="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-brand-card border border-brand-borderLight hover:border-brand-gold transition cursor-pointer shadow-sm" title="${info.xp} XP StudySouk">
                <span class="text-xs sm:text-sm">${info.rank.icon}</span>
                <div class="flex flex-col">
                    <span class="text-[10px] sm:text-[11px] font-bold text-brand-text leading-tight flex items-center gap-1 font-outfit">
                        Niv. ${info.level} <span class="text-brand-goldLight text-[10px] font-semibold hidden sm:inline">• ${info.rank.title}</span>
                    </span>
                    <div class="w-16 sm:w-20 h-1.5 bg-brand-darker rounded-full overflow-hidden mt-0.5 border border-brand-border">
                        <div class="h-full bg-gradient-to-r from-brand-accent via-brand-gold to-brand-goldLight rounded-full transition-all duration-500" style="width: ${Math.round(info.progress * 100)}%"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

window.LevelSystem = LevelSystem;
