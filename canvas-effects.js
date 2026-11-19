/**
 * StudySouk Timer - Ambient Canvas Visuals (60 FPS)
 * Signature StudySouk Royal Cherry & Imperial Gold Atmosphere.
 */

class AmbientCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.theme = 'cherry'; // 'cherry', 'rain', 'fire', 'cosmic'
        this.particles = [];
        this.maxParticles = 75;
        this.animationFrame = null;
        this.width = 0;
        this.height = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setTheme(this.theme);
        this.animate = this.animate.bind(this);
        this.animationFrame = requestAnimationFrame(this.animate);
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    setTheme(newTheme) {
        this.theme = newTheme;
        this.particles = [];

        if (this.theme === 'cherry' || this.theme === 'fire') {
            // StudySouk Signature Golden Embers & Cherry Stardust
            this.maxParticles = 70;
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: this.height + Math.random() * 40,
                    size: Math.random() * 3.2 + 1.0,
                    speedY: Math.random() * 1.8 + 0.8,
                    speedX: (Math.random() - 0.5) * 1.2,
                    opacity: Math.random() * 0.8 + 0.2,
                    decay: Math.random() * 0.005 + 0.002,
                    color: Math.random() > 0.4 ? '#D4AF37' : '#8A1538'
                });
            }
        } else if (this.theme === 'rain') {
            this.maxParticles = 80;
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    length: Math.random() * 22 + 12,
                    speed: Math.random() * 11 + 9,
                    opacity: Math.random() * 0.35 + 0.1,
                    thickness: Math.random() * 1.1 + 0.5
                });
            }
        } else if (this.theme === 'cosmic') {
            this.maxParticles = 90;
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    radius: Math.random() * 1.8 + 0.5,
                    baseAlpha: Math.random() * 0.7 + 0.2,
                    alpha: Math.random() * 0.7 + 0.2,
                    twinkleSpeed: Math.random() * 0.04 + 0.01,
                    color: Math.random() > 0.4 ? '#F5D77F' : '#D4AF37'
                });
            }
        }
    }

    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.theme === 'cherry' || this.theme === 'fire') {
            for (const p of this.particles) {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();

                p.y -= p.speedY;
                p.x += p.speedX;
                p.opacity -= p.decay;

                if (p.opacity <= 0 || p.y < -20) {
                    p.y = this.height + 20;
                    p.x = Math.random() * this.width;
                    p.opacity = Math.random() * 0.8 + 0.3;
                }
            }
            this.ctx.globalAlpha = 1.0;
            this.ctx.shadowBlur = 0;
        } else if (this.theme === 'rain') {
            this.ctx.strokeStyle = '#D4AF37';
            this.ctx.lineCap = 'round';
            for (const p of this.particles) {
                this.ctx.lineWidth = p.thickness;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x - 1, p.y + p.length);
                this.ctx.strokeStyle = `rgba(212, 175, 55, ${p.opacity * 0.6})`;
                this.ctx.stroke();

                p.y += p.speed;
                p.x -= 1;

                if (p.y > this.height) {
                    p.y = -p.length;
                    p.x = Math.random() * (this.width + 50);
                }
            }
        } else if (this.theme === 'cosmic') {
            for (const p of this.particles) {
                p.alpha += p.twinkleSpeed;
                const dynamicAlpha = p.baseAlpha + Math.sin(p.alpha) * 0.3;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = Math.max(0.1, Math.min(1.0, dynamicAlpha));
                this.ctx.shadowBlur = 6;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();
            }
            this.ctx.globalAlpha = 1.0;
            this.ctx.shadowBlur = 0;
        }

        this.animationFrame = requestAnimationFrame(this.animate);
    }
}

window.AmbientCanvas = AmbientCanvas;
