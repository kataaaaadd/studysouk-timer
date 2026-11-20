/**
 * StudySouk Timer - Ambient Canvas Visuals (60 FPS, Hi-DPI, GPU Optimized)
 * Signature StudySouk Royal Cherry & Imperial Gold Atmosphere with Ethereal STEM Mathematical Glyphs.
 */

class AmbientCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.theme = 'cherry'; // 'cherry', 'cosmic', 'rain', 'fire'
        this.particles = [];
        this.mathGlyphs = [];
        this.maxParticles = 65;
        this.maxGlyphs = 14;
        this.animationFrame = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Smooth Cursor Ambient Glow Tracking
        this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

        // Authentic Moroccan CPGE & 2BAC STEM Mathematical Glyphs
        this.glyphPool = [
            '∫ f(t) dt',
            '∑ aₙ zⁿ',
            '∇ × B = μ₀J',
            'e^{iπ} + 1 = 0',
            'lim x→0',
            'det(A - λI) = 0',
            'ker(u) ⊕ Im(u)',
            'ℝ[X] / (P)',
            '∮ E · dl',
            'λ ∈ Sp(M)',
            '∂²ψ/∂x²',
            'dim(E) = n',
            'P(A | B)',
            'HΨ = EΨ',
            'f * g(t)',
            '⟨x, y⟩ = 0'
        ];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize(), { passive: true });
        
        // Track mouse for ambient lighting
        window.addEventListener('mousemove', (e) => {
            this.mouse.targetX = e.clientX;
            this.mouse.targetY = e.clientY;
            this.mouse.active = true;
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });

        // Pause animation when tab is hidden to save energy
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
            } else {
                this.animate();
            }
        });

        this.setTheme(this.theme);
        this.animate = this.animate.bind(this);
        this.animationFrame = requestAnimationFrame(this.animate);
    }

    resize() {
        if (!this.canvas) return;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.canvas.width = Math.floor(this.width * this.dpr);
        this.canvas.height = Math.floor(this.height * this.dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        if (this.ctx) {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(this.dpr, this.dpr);
        }
    }

    setTheme(newTheme) {
        this.theme = newTheme;
        this.particles = [];
        this.mathGlyphs = [];

        // 1. Initialize Particles based on Theme
        if (this.theme === 'owl') {
            // Owl Nocturnal Wisdom Theme (Golden Amber Fireflies, Ethereal Embers & Velvet Glow)
            this.maxParticles = 75;
            for (let i = 0; i < this.maxParticles; i++) {
                const isAmberGold = Math.random() > 0.3;
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * 3.2 + 1.0,
                    speedY: Math.random() * 0.7 + 0.25, // Gentle hovering float
                    speedX: (Math.random() - 0.5) * 0.6,
                    opacity: Math.random() * 0.75 + 0.25,
                    decay: Math.random() * 0.002 + 0.0008,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.035 + 0.015,
                    color: isAmberGold ? (Math.random() > 0.5 ? '#F5C542' : '#FFD700') : '#B8234B'
                });
            }
        } else if (this.theme === 'cherry' || this.theme === 'fire') {
            this.maxParticles = 60;
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * 2.8 + 0.8,
                    speedY: Math.random() * 1.2 + 0.4,
                    speedX: (Math.random() - 0.5) * 0.8,
                    opacity: Math.random() * 0.7 + 0.2,
                    decay: Math.random() * 0.003 + 0.001,
                    pulse: Math.random() * Math.PI * 2,
                    color: Math.random() > 0.35 ? '#E2E8F0' : '#7A0E27'
                });
            }
        } else if (this.theme === 'cosmic') {
            this.maxParticles = 80;
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * 2.2 + 0.6,
                    speedY: (Math.random() - 0.5) * 0.2,
                    speedX: (Math.random() - 0.5) * 0.2,
                    opacity: Math.random() * 0.6 + 0.2,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.03 + 0.01,
                    color: Math.random() > 0.4 ? '#FFFFFF' : '#9E1838'
                });
            }
        } else if (this.theme === 'rain') {
            this.maxParticles = 75;
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    length: Math.random() * 24 + 14,
                    speed: Math.random() * 10 + 8,
                    opacity: Math.random() * 0.3 + 0.1,
                    thickness: Math.random() * 1.0 + 0.5
                });
            }
        }

        // 2. Initialize Floating Ethereal Mathematical Glyphs (CPGE Prestige)
        for (let i = 0; i < this.maxGlyphs; i++) {
            const isOwl = (this.theme === 'owl');
            this.mathGlyphs.push({
                text: this.glyphPool[i % this.glyphPool.length],
                x: Math.random() * (this.width - 120) + 40,
                y: Math.random() * this.height,
                speedY: Math.random() * 0.35 + 0.15, // Ultra slow, elegant upward drift
                speedX: (Math.random() - 0.5) * 0.15,
                opacity: isOwl ? 0.12 : (Math.random() * 0.08 + 0.04),
                baseOpacity: isOwl ? 0.12 : (Math.random() * 0.08 + 0.04),
                phase: Math.random() * Math.PI * 2,
                fontSize: Math.floor(Math.random() * 4 + 12),
                color: isOwl ? (Math.random() > 0.35 ? '#F5C542' : '#E2E8F0') : (Math.random() > 0.4 ? '#CBD5E1' : '#9E1838')
            });
        }
    }

    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Smooth mouse lerp (soft following glow)
        if (this.mouse.active) {
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

            // Draw Subtle Golden Cursor Ambient Lighting
            const radGlow = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, 220
            );
            if (this.theme === 'owl') {
                radGlow.addColorStop(0, 'rgba(245, 197, 66, 0.08)');
                radGlow.addColorStop(0.5, 'rgba(138, 21, 56, 0.05)');
                radGlow.addColorStop(1, 'transparent');
            } else {
                radGlow.addColorStop(0, 'rgba(226, 232, 240, 0.045)');
                radGlow.addColorStop(0.5, 'rgba(122, 14, 39, 0.035)');
                radGlow.addColorStop(1, 'transparent');
            }
            
            this.ctx.fillStyle = radGlow;
            this.ctx.fillRect(this.mouse.x - 220, this.mouse.y - 220, 440, 440);
        }

        // --- LAYER 1: FLOATING MATHEMATICAL GLYPHS ---
        this.ctx.save();
        for (const g of this.mathGlyphs) {
            g.phase += 0.015;
            const currentAlpha = g.baseOpacity + Math.sin(g.phase) * 0.025;
            
            this.ctx.font = `italic 600 ${g.fontSize}px 'Outfit', 'Times New Roman', serif`;
            this.ctx.fillStyle = g.color;
            this.ctx.globalAlpha = Math.max(0.02, Math.min(0.14, currentAlpha));
            this.ctx.fillText(g.text, g.x, g.y);

            g.y -= g.speedY;
            g.x += g.speedX;

            if (g.y < -30) {
                g.y = this.height + 30;
                g.x = Math.random() * (this.width - 120) + 40;
                g.text = this.glyphPool[Math.floor(Math.random() * this.glyphPool.length)];
            }
        }
        this.ctx.restore();

        // --- LAYER 2: AMBIENT PARTICLES ---
        if (this.theme === 'owl') {
            for (const p of this.particles) {
                p.pulse += p.pulseSpeed;
                const dynamicSize = p.size + Math.sin(p.pulse) * 0.6;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, Math.max(0.6, dynamicSize), 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = Math.max(0.1, Math.min(0.9, p.opacity + Math.sin(p.pulse) * 0.25));
                this.ctx.shadowBlur = 12;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();

                p.y -= p.speedY;
                p.x += p.speedX;
                p.opacity -= p.decay;

                if (p.opacity <= 0.05 || p.y < -20) {
                    p.y = this.height + 20;
                    p.x = Math.random() * this.width;
                    p.opacity = Math.random() * 0.75 + 0.25;
                }
            }
            this.ctx.globalAlpha = 1.0;
            this.ctx.shadowBlur = 0;
        } else if (this.theme === 'cherry' || this.theme === 'fire') {
            for (const p of this.particles) {
                p.pulse += 0.03;
                const dynamicSize = p.size + Math.sin(p.pulse) * 0.4;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, Math.max(0.4, dynamicSize), 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();

                p.y -= p.speedY;
                p.x += p.speedX;
                p.opacity -= p.decay;

                if (p.opacity <= 0.05 || p.y < -20) {
                    p.y = this.height + 20;
                    p.x = Math.random() * this.width;
                    p.opacity = Math.random() * 0.7 + 0.3;
                }
            }
            this.ctx.globalAlpha = 1.0;
            this.ctx.shadowBlur = 0;
        } else if (this.theme === 'cosmic') {
            for (const p of this.particles) {
                p.pulse += p.pulseSpeed;
                const alpha = Math.max(0.1, Math.min(0.8, p.opacity + Math.sin(p.pulse) * 0.3));

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = alpha;
                this.ctx.shadowBlur = 6;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();

                p.y += p.speedY;
                p.x += p.speedX;

                if (p.x < 0) p.x = this.width;
                if (p.x > this.width) p.x = 0;
                if (p.y < 0) p.y = this.height;
                if (p.y > this.height) p.y = 0;
            }
            this.ctx.globalAlpha = 1.0;
            this.ctx.shadowBlur = 0;
        } else if (this.theme === 'rain') {
            this.ctx.lineCap = 'round';
            for (const p of this.particles) {
                this.ctx.lineWidth = p.thickness;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x - 1, p.y + p.length);
                this.ctx.strokeStyle = `rgba(226, 232, 240, ${p.opacity * 0.75})`;
                this.ctx.stroke();

                p.y += p.speed;
                p.x -= 1;

                if (p.y > this.height) {
                    p.y = -p.length;
                    p.x = Math.random() * (this.width + 50);
                }
            }
        }

        this.animationFrame = requestAnimationFrame(this.animate);
    }
}

window.AmbientCanvas = AmbientCanvas;
