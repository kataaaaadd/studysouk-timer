/**
 * StudySouk Timer - Master Audio & Lo-Fi Streaming Engine
 * Procedural Web Audio Generation + 24/7 Live Lo-Fi Webradio + ASMR Mechanical Switches
 */

const LOFI_STATIONS = {
    chillhop: {
        name: "Chillhop Study Beats",
        icon: "fa-mug-hot",
        url: "https://streams.ilovemusic.de/iloveradio17.mp3"
    },
    lofigirl: {
        name: "Nightwave Plaza Focus",
        icon: "fa-headphones",
        url: "https://radio.plaza.one/mp3"
    },
    synthwave: {
        name: "ChillSynth Nightride",
        icon: "fa-bolt",
        url: "https://stream.nightride.fm/chillsynth.mp3"
    },
    piano: {
        name: "Classique & Piano CPGE",
        icon: "fa-feather-pointed",
        url: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128"
    }
};

class AmbienceEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.rainGain = null;
        this.fireGain = null;
        this.cafeGain = null;
        this.lofiGain = null;
        this.solfeggioGain = null;

        this.nodes = {
            rain: null,
            fire: null,
            cafe: null,
            lofi: [],
            solfeggio: []
        };

        this.volumes = {
            master: 0.8,
            radio: 0.7,
            rain: 0.0,
            fire: 0.0,
            cafe: 0.0,
            lofi: 0.0,
            solfeggio: 0.0
        };

        this.lofiInterval = null;
        this.isMuted = false;
        this.keyboardAsmrEnabled = true;

        // Lo-Fi Live Radio streaming element
        this.radioAudio = new Audio();
        this.radioAudio.crossOrigin = "anonymous";
        this.radioAudio.preload = "none";
        this.currentStationKey = "chillhop";
        this.isRadioPlaying = false;
        this.radioError = false;

        this.setupRadioListeners();
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Master output
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volumes.master, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Sub-gains
        this.rainGain = this.ctx.createGain();
        this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.rainGain.connect(this.masterGain);

        this.fireGain = this.ctx.createGain();
        this.fireGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.fireGain.connect(this.masterGain);

        this.cafeGain = this.ctx.createGain();
        this.cafeGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.cafeGain.connect(this.masterGain);

        this.lofiGain = this.ctx.createGain();
        this.lofiGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.lofiGain.connect(this.masterGain);

        this.solfeggioGain = this.ctx.createGain();
        this.solfeggioGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.solfeggioGain.connect(this.masterGain);

        this.startRainGenerator();
        this.startFireGenerator();
        this.startCafeGenerator();
        this.startLofiGenerator();
        this.startSolfeggioGenerator();
    }

    async ensureRunning() {
        if (!this.ctx) {
            this.init();
        }
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    // --- PROCEDURAL GENERATORS ---

    startRainGenerator() {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
            b6 = white * 0.115926;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(this.rainGain);
        noise.start();
        this.nodes.rain = noise;
    }

    startFireGenerator() {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const isCrackle = Math.random() < 0.0006;
            data[i] = isCrackle ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 2 - 1) * 0.02;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(this.fireGain);
        source.start();
        this.nodes.fire = source;
    }

    startCafeGenerator() {
        const bufferSize = this.ctx.sampleRate * 3;
        const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            left[i] = (Math.random() * 2 - 1) * 0.04;
            right[i] = (Math.random() * 2 - 1) * 0.04;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(450, this.ctx.currentTime);

        source.connect(lowpass);
        lowpass.connect(this.cafeGain);
        source.start();
        this.nodes.cafe = source;
    }

    startLofiGenerator() {
        const chordProgressions = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [220.00, 261.63, 329.63, 392.00], // Am7
            [174.61, 220.00, 261.63, 329.63], // Fmaj7
            [196.00, 246.94, 293.66, 349.23]  // G7
        ];
        let currentChordIndex = 0;

        const playChord = () => {
            if (this.volumes.lofi <= 0.01 || this.isMuted) return;
            const chord = chordProgressions[currentChordIndex];
            currentChordIndex = (currentChordIndex + 1) % chordProgressions.length;
            const now = this.ctx.currentTime;
            const duration = 5.8;

            chord.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq + (Math.random() * 0.6 - 0.3), now);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(600, now);
                filter.frequency.exponentialRampToValueAtTime(1100, now + 1.5);
                filter.frequency.exponentialRampToValueAtTime(450, now + duration);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.04, now + 1.2);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.lofiGain);

                osc.start(now);
                osc.stop(now + duration + 0.1);
            });
        };

        this.lofiInterval = setInterval(playChord, 5200);
    }

    startSolfeggioGenerator() {
        // Binaural 528 Hz (Theta focus beat)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(528, this.ctx.currentTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(532, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(this.solfeggioGain);

        osc1.start();
        osc2.start();
        this.nodes.solfeggio = [osc1, osc2];
    }

    // --- MECHANICAL KEYBOARD ASMR ---
    playKeyClick() {
        if (!this.keyboardAsmrEnabled || this.isMuted) return;
        this.ensureRunning();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const basePitch = 1200 + (Math.random() * 300 - 150);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(basePitch, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.025);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(basePitch, now);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // --- SOUND EFFECTS / BELLS / GONG ---

    playZenChime() {
        this.ensureRunning();
        const now = this.ctx.currentTime;
        const freqs = [528, 1056, 1584, 2112];

        freqs.forEach((f, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);

            const initialVolume = 0.25 / (index + 1);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(initialVolume, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 4.0);
        });
    }

    playTibetanGong() {
        this.ensureRunning();
        const now = this.ctx.currentTime;
        const fundamentals = [144, 288, 432, 576, 720];

        fundamentals.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.3 / (idx + 1), now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 6.0);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 6.2);
        });
    }

    playClick() {
        this.ensureRunning();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    playSuccess() {
        this.ensureRunning();
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.65);
        });
    }

    playPop() {
        this.ensureRunning();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const pitch = 600 + Math.random() * 400;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.06);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.07);
    }

    playCountdownTick(freq = 660) {
        if (this.isMuted) return;
        this.ensureRunning();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.04);

            gain.gain.setValueAtTime(0.045, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

            osc.connect(gain);
            gain.connect(this.masterGain || this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.045);
        } catch (e) {}
    }

    // --- LO-FI LIVE RADIO STREAMING ---
    setupRadioListeners() {
        this.radioAudio.volume = this.volumes.radio * this.volumes.master;

        this.radioAudio.addEventListener("playing", () => {
            this.isRadioPlaying = true;
            this.radioError = false;
            this.updateRadioUI();
        });

        this.radioAudio.addEventListener("pause", () => {
            this.isRadioPlaying = false;
            this.updateRadioUI();
        });

        this.radioAudio.addEventListener("error", (e) => {
            console.warn("[AmbienceRadio] Stream error, fallback active:", e);
            this.isRadioPlaying = false;
            this.radioError = true;
            this.updateRadioUI();
        });
    }

    playRadioStation(stationKey) {
        if (!LOFE_STATIONS && !LOFI_STATIONS) return;
        const station = LOFI_STATIONS[stationKey] || LOFI_STATIONS.chillhop;
        this.currentStationKey = stationKey;
        this.radioAudio.src = station.url;
        this.radioAudio.volume = this.isMuted ? 0 : this.volumes.radio * this.volumes.master;

        this.radioAudio.play().then(() => {
            this.isRadioPlaying = true;
            this.updateRadioUI();
        }).catch(err => {
            console.warn("[AmbienceRadio] Autoplay policy prevented playback:", err);
            this.isRadioPlaying = false;
            this.updateRadioUI();
        });
    }

    toggleRadio() {
        if (this.isRadioPlaying) {
            this.radioAudio.pause();
        } else {
            this.playRadioStation(this.currentStationKey);
        }
    }

    setRadioVolume(val) {
        this.volumes.radio = parseFloat(val);
        this.radioAudio.volume = this.isMuted ? 0 : this.volumes.radio * this.volumes.master;
    }

    updateRadioUI() {
        const toggleBtn = document.getElementById("btn-radio-toggle");
        const statusSpan = document.getElementById("radio-status-text");
        const vinylRecord = document.getElementById("vinyl-record");

        if (toggleBtn) {
            toggleBtn.innerHTML = this.isRadioPlaying 
                ? `<i class="fa-solid fa-pause text-brand-gold"></i> Pause Radio`
                : `<i class="fa-solid fa-play text-brand-gold"></i> Écouter le Live`;
        }

        if (statusSpan) {
            const station = LOFI_STATIONS[this.currentStationKey];
            statusSpan.textContent = this.isRadioPlaying 
                ? `● En Direct : ${station.name}`
                : `Radio en Pause`;
            statusSpan.className = this.isRadioPlaying 
                ? "text-[11px] text-emerald-400 font-bold" 
                : "text-[11px] text-brand-muted";
        }

        if (vinylRecord) {
            if (this.isRadioPlaying) {
                vinylRecord.classList.add("animate-spin");
            } else if (!window.studyApp?.isRunning) {
                vinylRecord.classList.remove("animate-spin");
            }
        }
    }

    // --- VOLUME CONTROLS ---

    setRainVolume(val) {
        this.ensureRunning();
        this.volumes.rain = parseFloat(val);
        if (this.rainGain) {
            this.rainGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volumes.rain * 0.7, this.ctx.currentTime, 0.1);
        }
    }

    setFireVolume(val) {
        this.ensureRunning();
        this.volumes.fire = parseFloat(val);
        if (this.fireGain) {
            this.fireGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volumes.fire * 0.8, this.ctx.currentTime, 0.1);
        }
    }

    setCafeVolume(val) {
        this.ensureRunning();
        this.volumes.cafe = parseFloat(val);
        if (this.cafeGain) {
            this.cafeGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volumes.cafe * 0.6, this.ctx.currentTime, 0.1);
        }
    }

    setLofiVolume(val) {
        this.ensureRunning();
        this.volumes.lofi = parseFloat(val);
        if (this.lofiGain) {
            this.lofiGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volumes.lofi * 0.7, this.ctx.currentTime, 0.1);
        }
    }

    setSolfeggioVolume(val) {
        this.ensureRunning();
        this.volumes.solfeggio = parseFloat(val);
        if (this.solfeggioGain) {
            this.solfeggioGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volumes.solfeggio * 0.45, this.ctx.currentTime, 0.1);
        }
    }

    setMasterVolume(val) {
        this.ensureRunning();
        this.volumes.master = parseFloat(val);
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volumes.master, this.ctx.currentTime, 0.1);
        }
        if (this.radioAudio) {
            this.radioAudio.volume = this.isMuted ? 0 : this.volumes.radio * this.volumes.master;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const target = this.isMuted ? 0 : this.volumes.master;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
        }
        if (this.radioAudio) {
            this.radioAudio.volume = this.isMuted ? 0 : this.volumes.radio * this.volumes.master;
        }
        return this.isMuted;
    }
}

window.AmbienceEngine = AmbienceEngine;
window.ambience = new AmbienceEngine();
window.LOFI_STATIONS = LOFI_STATIONS;
