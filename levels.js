/**
 * StudySouk Academy - Prestige Academic Progression System
 * Grounded in the Moroccan STEM & CPGE/2BAC Academic Excellence.
 */

const RANKS = [
    { level: 1, title: "Adhérent Académie", icon: "📚", color: "#9CA3AF", desc: "Début de l'ascension académique." },
    { level: 3, title: "Khwanss Rigoureux", icon: "📐", color: "#60A5FA", desc: "La rigueur mathématique s'installe." },
    { level: 5, title: "Taupin Assidu", icon: "⚡", color: "#34D399", desc: "Rythme de travail soutenu et discipliné." },
    { level: 8, title: "Admissible Concours", icon: "🏛️", color: "#F59E0B", desc: "Prêt pour les épreuves écrites du CNC & Mines." },
    { level: 10, title: "Major de Promotion", icon: "🥇", color: "#D4AF37", desc: "Excellence absolue dans toutes les disciplines STEM." },
    { level: 15, title: "Lauréat Grande École", icon: "🎓", color: "#B8234B", desc: "Intégration réussie dans le top des écoles d'ingénieurs." },
    { level: 20, title: "Légende StudySouk Prestige", icon: "👑", color: "#F5C542", desc: "Immortalité académique au panthéon StudySouk." }
];

const TROPHIES = [
    { id: "first_block", title: "Premier Bloc", icon: "🎯", desc: "Valider une 1ère session de 25 min", check: (stats) => stats.sessions >= 1 },
    { id: "focus_100", title: "Centurion Focus", icon: "⚡", desc: "Cumuler 100 minutes de Deep Work", check: (stats) => stats.minutes >= 100 },
    { id: "level_5", title: "Taupin Confirmé", icon: "📐", desc: "Atteindre le Niveau 5", check: (stats) => stats.level >= 5 },
    { id: "fc_10", title: "Mémoire d'Euler", icon: "🧠", desc: "Maîtriser 10 flashcards STEM", check: (stats) => stats.masteredCount >= 10 },
    { id: "duel_won", title: "Gladiateur STEM", icon: "⚔️", desc: "Remporter un duel mathématique 1v1", check: (stats) => stats.duelsWon >= 1 },
    { id: "zen_master", title: "Maître Zen", icon: "🧘", desc: "Utiliser le mode Zen pour étudier", check: (stats) => stats.usedZen }
];

class LevelSystem {
    constructor(badgeContainerId) {
        this.container = document.getElementById(badgeContainerId);
        this.xp = parseInt(localStorage.getItem("ss_timer_xp") || "0", 10);
        this.renderBadge();
        this.bindEvents();
    }

    getLevelInfo() {
        const level = Math.floor(Math.sqrt(this.xp / 45)) + 1;
        const currentRank = [...RANKS].reverse().find(r => level >= r.level) || RANKS[0];
        const nextRank = RANKS.find(r => r.level > level) || currentRank;

        const prevLevelXp = (level - 1) * (level - 1) * 45;
        const nextLevelXp = level * level * 45;
        const progressInLevel = Math.min(1.0, Math.max(0.0, (this.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)));

        return { level, rank: currentRank, nextRank, progress: progressInLevel, xp: this.xp, prevLevelXp, nextLevelXp };
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
                window.confetti({ particleCount: 100, spread: 85, origin: { y: 0.5 } });
            }
            window.studyApp?.showToast(`👑 RANG SUPÉRIEUR ! Niveau ${newLevelInfo.level} — ${newLevelInfo.rank.title} !`);
        } else if (reason) {
            window.studyApp?.showToast(`✨ +${amount} XP (${reason})`);
        }
    }

    renderBadge() {
        if (!this.container) return;
        const info = this.getLevelInfo();
        this.container.innerHTML = `
            <div id="btn-open-student-card" class="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl glass-card border border-brand-borderSubtle hover:border-brand-gold transition cursor-pointer shadow-sm active:scale-95 group" title="Voir ma Carte d'Étudiant & Trophées">
                <span class="text-xs sm:text-sm group-hover:scale-110 transition">${info.rank.icon}</span>
                <div class="flex flex-col">
                    <span class="text-[10px] sm:text-[11px] font-bold text-brand-text leading-tight flex items-center gap-1 font-outfit">
                        Niv. ${info.level} <span class="text-brand-goldLight text-[10px] font-semibold hidden sm:inline">• ${info.rank.title}</span>
                    </span>
                    <div class="w-16 sm:w-20 h-1.5 bg-brand-darker rounded-full overflow-hidden mt-0.5 border border-brand-border">
                        <div class="h-full bg-gradient-to-r from-brand-cherry via-brand-gold to-brand-goldLight rounded-full transition-all duration-500" style="width: ${Math.round(info.progress * 100)}%"></div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("btn-open-student-card")?.addEventListener("click", () => {
            window.ambience?.playClick();
            this.openStudentCardModal();
        });
    }

    bindEvents() {
        document.getElementById("btn-close-student-card")?.addEventListener("click", () => {
            this.closeStudentCardModal();
        });
    }

    openStudentCardModal() {
        const modal = document.getElementById("student-card-modal");
        if (!modal) return;

        const info = this.getLevelInfo();
        const userName = localStorage.getItem("ss_user_name") || "Étudiant StudySouk";
        const userAvatar = localStorage.getItem("ss_user_avatar") || "https://api.dicebear.com/7.x/bottts/svg?seed=StudySouk";
        const sessions = parseInt(localStorage.getItem("ss_timer_sessions") || "0", 10);
        const minutes = parseInt(localStorage.getItem("ss_timer_minutes") || "0", 10);
        const masteredCount = JSON.parse(localStorage.getItem("ss_mastered_cards") || "[]").length;
        const duelsWon = parseInt(localStorage.getItem("ss_duels_won") || "0", 10);
        const usedZen = localStorage.getItem("ss_used_zen") === "true";

        let matricule = localStorage.getItem("ss_matricule");
        if (!matricule) {
            matricule = "SS-" + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem("ss_matricule", matricule);
        }

        // Set card values
        const elName = document.getElementById("sc-name");
        const elAvatar = document.getElementById("sc-avatar");
        const elMatricule = document.getElementById("sc-matricule");
        const elRankTitle = document.getElementById("sc-rank-title");
        const elRankDesc = document.getElementById("sc-rank-desc");
        const elLevel = document.getElementById("sc-level");
        const elXpText = document.getElementById("sc-xp-text");
        const elXpBar = document.getElementById("sc-xp-bar");
        const elStatMins = document.getElementById("sc-stat-mins");
        const elStatSessions = document.getElementById("sc-stat-sessions");
        const elStatCards = document.getElementById("sc-stat-cards");
        const elTrophiesGrid = document.getElementById("sc-trophies-grid");

        if (elName) elName.textContent = userName;
        if (elAvatar) elAvatar.src = userAvatar;
        if (elMatricule) elMatricule.textContent = matricule;
        if (elRankTitle) elRankTitle.innerHTML = `${info.rank.icon} ${info.rank.title}`;
        if (elRankDesc) elRankDesc.textContent = info.rank.desc;
        if (elLevel) elLevel.textContent = `Niveau ${info.level}`;
        if (elXpText) elXpText.textContent = `${info.xp} / ${info.nextLevelXp} XP (${Math.round(info.progress * 100)}%)`;
        if (elXpBar) elXpBar.style.width = `${Math.round(info.progress * 100)}%`;
        if (elStatMins) elStatMins.textContent = `${minutes} min`;
        if (elStatSessions) elStatSessions.textContent = `${sessions}`;
        if (elStatCards) elStatCards.textContent = `${masteredCount}`;

        // Render Trophies
        if (elTrophiesGrid) {
            const stats = { sessions, minutes, level: info.level, masteredCount, duelsWon, usedZen };
            elTrophiesGrid.innerHTML = TROPHIES.map(t => {
                const isUnlocked = t.check(stats);
                return `
                    <div class="p-2 rounded-xl ${isUnlocked ? 'bg-brand-darker border border-brand-gold/60 shadow-md' : 'bg-brand-darker/50 border border-brand-borderSubtle opacity-40'} flex items-center gap-2">
                        <span class="text-xl ${isUnlocked ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'grayscale'}">${t.icon}</span>
                        <div class="overflow-hidden">
                            <div class="text-[11px] font-black ${isUnlocked ? 'text-brand-goldLight' : 'text-brand-muted'} font-outfit truncate">${t.title}</div>
                            <div class="text-[9px] text-brand-dim leading-tight truncate">${t.desc}</div>
                        </div>
                    </div>
                `;
            }).join("");
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }

    closeStudentCardModal() {
        const modal = document.getElementById("student-card-modal");
        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    }
}

window.LevelSystem = LevelSystem;
