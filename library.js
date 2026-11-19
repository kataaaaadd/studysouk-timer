/**
 * StudySouk Discord Activity - Maktaba & STEM Library Module
 * 149 Curated Volumes: CPGE, 2BAC SM, 1BAC SM, Recueil Y. Alaoui, Concours & Agrégation.
 */

class StudySoukLibrary {
    constructor() {
        this.books = [];
        this.filteredBooks = [];
        this.currentFilter = 'all';
        this.currentSubject = 'all';
        this.searchQuery = '';
        this.activeBook = null;

        // PDF.js Engine State
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.scale = 1.25;

        if (window.pdfjsLib) {
            if (window.pdfjsWorker && window.pdfjsWorker.WorkerMessageHandler) {
                window.pdfjsLib.PDFWorker._mainThreadWorkerMessageHandler = window.pdfjsWorker.WorkerMessageHandler;
            }
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.min.js';
        }

        this.init();
    }

    async init() {
        await this.loadBooks();
        this.bindEvents();
        this.renderCatalog();
    }

    async loadBooks() {
        try {
            // First try live server API
            const res = await fetch('/api/library/books');
            if (res.ok) {
                this.books = await res.json();
            } else {
                throw new Error('API non disponible');
            }
        } catch (e) {
            console.warn('[Library] API fallback to local assets/data/library.json');
            try {
                const res = await fetch('assets/data/library.json');
                this.books = await res.json();
            } catch (err) {
                console.error('[Library] Failed to load catalog:', err);
                this.books = [];
            }
        }
        this.filteredBooks = [...this.books];
    }

    bindEvents() {
        // Search Input with Debounce
        const searchInput = document.getElementById('library-search-input');
        if (searchInput) {
            let timeout = null;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.searchQuery = e.target.value.trim().toLowerCase();
                    this.applyFilters();
                }, 150);
            });
        }

        // Category Filter Pills
        document.querySelectorAll('.library-filter-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.library-filter-pill').forEach(b => {
                    b.classList.remove('bg-brand-cherry', 'border-brand-gold', 'text-brand-goldLight');
                    b.classList.add('glass-card', 'text-brand-muted', 'border-brand-borderSubtle');
                });
                btn.classList.add('bg-brand-cherry', 'border-brand-gold', 'text-brand-goldLight');
                btn.classList.remove('glass-card', 'text-brand-muted', 'border-brand-borderSubtle');

                this.currentFilter = btn.dataset.filter || 'all';
                this.applyFilters();
            });
        });

        // Subject Filter Pills
        document.querySelectorAll('.library-subject-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.library-subject-pill').forEach(b => {
                    b.classList.remove('bg-brand-gold/20', 'border-brand-gold', 'text-white');
                    b.classList.add('text-brand-muted', 'border-transparent');
                });
                btn.classList.add('bg-brand-gold/20', 'border-brand-gold', 'text-white');
                btn.classList.remove('text-brand-muted', 'border-transparent');

                this.currentSubject = btn.dataset.subject || 'all';
                this.applyFilters();
            });
        });

        // Close Reader Modal
        const closeBtn = document.getElementById('btn-close-reader-modal');
        const modalBackdrop = document.getElementById('library-reader-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeReader());
        }
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) this.closeReader();
            });
        }

        // PDF Navigator & Zoom Buttons
        document.getElementById('pdf-prev')?.addEventListener('click', () => this.onPrevPage());
        document.getElementById('pdf-next')?.addEventListener('click', () => this.onNextPage());
        document.getElementById('pdf-zoom-in')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('pdf-zoom-out')?.addEventListener('click', () => this.zoomOut());
        document.getElementById('pdf-zoom-reset')?.addEventListener('click', () => this.zoomReset());

        // Page number direct input
        const pageInput = document.getElementById('pdf-page-num');
        if (pageInput) {
            pageInput.addEventListener('change', (e) => {
                const targetPage = parseInt(e.target.value, 10);
                if (this.pdfDoc && targetPage >= 1 && targetPage <= this.pdfDoc.numPages) {
                    this.pageNum = targetPage;
                    this.queueRenderPage(this.pageNum);
                } else {
                    e.target.value = this.pageNum;
                }
            });
        }

        // Keyboard navigation for PDF reader
        window.addEventListener('keydown', (e) => {
            const modal = document.getElementById('library-reader-modal');
            const isModalOpen = modal && !modal.classList.contains('hidden');
            if (!isModalOpen) return;

            if (e.key === 'Escape') {
                this.closeReader();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                this.onPrevPage();
            } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                e.preventDefault();
                this.onNextPage();
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.zoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                this.zoomOut();
            }
        });
    }

    applyFilters() {
        this.filteredBooks = this.books.filter(book => {
            // Text Search
            const matchesQuery = !this.searchQuery || 
                book.title.toLowerCase().includes(this.searchQuery) ||
                book.category.toLowerCase().includes(this.searchQuery) ||
                book.level.toLowerCase().includes(this.searchQuery) ||
                book.subject.toLowerCase().includes(this.searchQuery) ||
                (book.filename && book.filename.toLowerCase().includes(this.searchQuery));

            // Level / Category Filter
            let matchesCategory = true;
            if (this.currentFilter === 'cpge') {
                matchesCategory = /cpge|mpsi|pcsi|concours|mines|centrale|cnc|sup/i.test(book.level) || 
                                  /concours|cpge/i.test(book.category);
            } else if (this.currentFilter === '2bac') {
                matchesCategory = /2bac|2\s*bac/i.test(book.level);
            } else if (this.currentFilter === '1bac') {
                matchesCategory = /1bac|1\s*bac|tronc/i.test(book.level);
            } else if (this.currentFilter === 'alaoui') {
                matchesCategory = /alaoui/i.test(book.category) || /alaoui/i.test(book.title) || (book.filepath && book.filepath.includes('Alaoui'));
            } else if (this.currentFilter === 'agreg') {
                matchesCategory = /agrégation|agregation|master/i.test(book.level) || /agrégation|agregation/i.test(book.category);
            } else if (this.currentFilter === 'univ') {
                matchesCategory = /fs|fst|université|deug|licence/i.test(book.level);
            }

            // Subject Filter
            let matchesSubject = true;
            if (this.currentSubject === 'maths') {
                matchesSubject = /math/i.test(book.subject);
            } else if (this.currentSubject === 'physique') {
                matchesSubject = /physique|chimie/i.test(book.subject);
            }

            return matchesQuery && matchesCategory && matchesSubject;
        });

        this.renderCatalog();
    }

    getBookEmoji(title, category, subject) {
        const t = (title || '').toLowerCase();
        const c = (category || '').toLowerCase();
        const s = (subject || '').toLowerCase();

        if (t.includes('concours') || t.includes('bible') || t.includes('1400p') || t.includes('600p')) return '🏆';
        if (t.includes('wattaniyat') || t.includes('watani') || t.includes('2008')) return '🇲🇦';
        if (s.includes('physique') || t.includes('nucléaire') || t.includes('fluides')) return '⚛️';
        if (t.includes('dima') || t.includes('analyse') || t.includes('intégral')) return '📐';
        if (t.includes('ensa') || t.includes('ensam') || t.includes('ingénieurs')) return '🎯';
        if (t.includes('agrégation') || t.includes('agregation') || t.includes('encyclopédie')) return '👑';
        if (c.includes('alaoui')) return '📜';
        if (t.includes('1bac') || c.includes('1bac')) return '🎒';
        if (t.includes('2bac') || c.includes('2bac')) return '🎓';
        return '📚';
    }

    renderCatalog() {
        const container = document.getElementById('library-books-grid');
        const countBadge = document.getElementById('library-total-count');
        const emptyState = document.getElementById('library-empty-state');

        if (countBadge) {
            countBadge.textContent = `${this.filteredBooks.length} volume${this.filteredBooks.length > 1 ? 's' : ''}`;
        }

        if (!container) return;

        if (this.filteredBooks.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        container.innerHTML = this.filteredBooks.map(book => {
            const emoji = this.getBookEmoji(book.title, book.category, book.subject);
            const isPhysique = (book.subject || '').toLowerCase().includes('physique');
            const subjectBadgeClass = isPhysique 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                : 'bg-brand-darker text-brand-goldLight border-brand-gold/40';

            return `
                <div class="glass-card rounded-2xl p-4 border border-brand-borderSubtle hover:border-brand-gold/60 transition-all duration-300 flex flex-col justify-between group shadow-md hover:shadow-xl relative overflow-hidden">
                    <!-- Subtle Ambient Aura on Hover -->
                    <div class="absolute -right-12 -top-12 w-28 h-28 bg-brand-gold/5 rounded-full blur-2xl group-hover:bg-brand-gold/15 transition duration-500 pointer-events-none"></div>

                    <div>
                        <!-- Header with Emoji and Page/Size Pills -->
                        <div class="flex items-start justify-between gap-2 mb-2.5">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cherry to-brand-cherryDark border border-brand-gold/50 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition">
                                ${emoji}
                            </div>
                            <div class="flex flex-col items-end gap-1">
                                <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-brand-darker border border-brand-borderSubtle text-brand-goldLight shadow-inner">
                                    📄 ${book.pages} pages
                                </span>
                                ${book.size_mb > 0 ? `
                                    <span class="text-[10px] font-mono font-semibold text-brand-muted">
                                        ${book.size_mb} MB
                                    </span>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Book Title -->
                        <h4 class="text-xs sm:text-sm font-extrabold text-white group-hover:text-brand-goldLight transition leading-snug line-clamp-2 mb-2 font-outfit" title="${book.title}">
                            ${book.title}
                        </h4>

                        <!-- Metadata Badges -->
                        <div class="flex flex-wrap items-center gap-1.5 mb-3">
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${subjectBadgeClass} font-outfit truncate max-w-[140px]">
                                ${book.subject}
                            </span>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-card text-brand-muted border border-brand-borderSubtle font-outfit truncate max-w-[130px]">
                                🎓 ${book.level}
                            </span>
                        </div>

                        <!-- Category Tag -->
                        <p class="text-[11px] text-brand-muted font-medium line-clamp-1 mb-3">
                            <i class="fa-solid fa-folder-open text-brand-gold text-[10px] mr-1"></i> ${book.category}
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="pt-2.5 border-t border-brand-borderSubtle flex items-center gap-1.5">
                        <button onclick="window.library.openReader(${book.id})" class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-cherry to-brand-cherryVibrant hover:from-brand-cherryLight hover:to-brand-cherry border border-brand-gold/60 text-white font-black text-xs font-outfit flex items-center justify-center gap-1.5 active:scale-95 transition shadow">
                            <i class="fa-solid fa-book-open text-brand-goldLight text-xs"></i>
                            <span class="gold-text-gradient">Consulter 📖</span>
                        </button>
                        <button onclick="window.library.studyWithTimer(${book.id})" title="Lancer une session de Deep Work sur cet ouvrage" class="w-8 h-8 rounded-xl glass-card border border-brand-borderSubtle hover:border-brand-gold text-brand-goldLight hover:text-white flex items-center justify-center active:scale-95 transition shadow">
                            <i class="fa-solid fa-stopwatch text-xs"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async openReader(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        this.activeBook = book;
        const modal = document.getElementById('library-reader-modal');
        const titleEl = document.getElementById('reader-modal-title');
        const badgeEl = document.getElementById('reader-modal-badge');
        const openTabBtn = document.getElementById('btn-open-pdf-external');
        const studyBtn = document.getElementById('btn-study-this-book');

        if (titleEl) titleEl.textContent = book.title;
        if (badgeEl) badgeEl.textContent = `${book.pages} pages • ${book.subject} • ${book.level}`;

        const isProxied = window.location.pathname.includes('/.proxy');
        const basePath = isProxied ? window.location.pathname.replace(/\/+$/, '') : '';
        const pdfUrl = `${basePath}/api/library/pdf/${book.id}`.replace(/^\/\//, '/');

        if (openTabBtn) {
            openTabBtn.onclick = () => window.open(pdfUrl, '_blank');
        }

        const downloadBtn = document.getElementById('btn-download-pdf');
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = book.filename || `${book.title}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        }

        if (studyBtn) {
            studyBtn.onclick = () => {
                this.closeReader();
                this.studyWithTimer(book.id);
            };
        }

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.classList.add('overflow-hidden');
        }

        // Load and render PDF using PDF.js
        await this.loadPdfDocument(pdfUrl);
    }

    async loadPdfDocument(url) {
        this.showPdfLoading(true);
        this.hidePdfError();

        try {
            if (!window.pdfjsLib) {
                throw new Error("Moteur PDF.js non chargé.");
            }

            if (window.pdfjsWorker && window.pdfjsWorker.WorkerMessageHandler) {
                window.pdfjsLib.PDFWorker._mainThreadWorkerMessageHandler = window.pdfjsWorker.WorkerMessageHandler;
            }

            // Fetch PDF binary directly for absolute reliability in Discord's proxy sandbox
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Erreur réseau HTTP ${res.status}: ${res.statusText || 'Document non disponible'}`);
            }
            const data = await res.arrayBuffer();

            const loadingTask = window.pdfjsLib.getDocument({
                data: data,
                cMapPacked: true
            });

            this.pdfDoc = await loadingTask.promise;

            const countEl = document.getElementById('pdf-page-count');
            if (countEl) countEl.textContent = this.pdfDoc.numPages;

            const pageNumInput = document.getElementById('pdf-page-num');
            if (pageNumInput) {
                pageNumInput.max = this.pdfDoc.numPages;
                pageNumInput.value = 1;
            }

            this.pageNum = 1;
            this.renderPdfPage(this.pageNum);
            this.showPdfLoading(false);
        } catch (err) {
            console.error("[PDF.js] Erreur:", err);
            this.showPdfLoading(false);
            this.showPdfError(`Impossible de lire le document : ${err.message || 'Erreur réseau'}`);
        }
    }

    renderPdfPage(num) {
        if (!this.pdfDoc) return;
        if (this.pageRendering) {
            this.pageNumPending = num;
            return;
        }
        this.pageRendering = true;

        this.pdfDoc.getPage(num).then((page) => {
            const canvas = document.getElementById('pdf-render-canvas');
            if (!canvas) {
                this.pageRendering = false;
                return;
            }
            const ctx = canvas.getContext('2d');

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const viewport = page.getViewport({ scale: this.scale * dpr });

            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
            canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
                this.pageRendering = false;
                if (this.pageNumPending !== null) {
                    const nextNum = this.pageNumPending;
                    this.pageNumPending = null;
                    this.renderPdfPage(nextNum);
                }
            }).catch((err) => {
                if (err && err.name === 'RenderingCancelledException') {
                    return;
                }
                console.warn("[PDF.js] Render error:", err);
                this.pageRendering = false;
            });
        }).catch(err => {
            console.error("[PDF.js] GetPage error:", err);
            this.pageRendering = false;
        });

        const pageNumInput = document.getElementById('pdf-page-num');
        if (pageNumInput) pageNumInput.value = num;

        const zoomLevelEl = document.getElementById('pdf-zoom-level');
        if (zoomLevelEl) zoomLevelEl.textContent = `${Math.round(this.scale * 100)}%`;
    }

    queueRenderPage(num) {
        if (this.pageRendering) {
            this.pageNumPending = num;
        } else {
            this.renderPdfPage(num);
        }
    }

    onPrevPage() {
        if (this.pageNum <= 1) return;
        this.pageNum--;
        this.queueRenderPage(this.pageNum);
    }

    onNextPage() {
        if (!this.pdfDoc || this.pageNum >= this.pdfDoc.numPages) return;
        this.pageNum++;
        this.queueRenderPage(this.pageNum);
    }

    zoomIn() {
        if (this.scale >= 3.0) return;
        this.scale += 0.2;
        this.renderPdfPage(this.pageNum);
    }

    zoomOut() {
        if (this.scale <= 0.6) return;
        this.scale -= 0.2;
        this.renderPdfPage(this.pageNum);
    }

    zoomReset() {
        this.scale = 1.25;
        this.renderPdfPage(this.pageNum);
    }

    showPdfLoading(show) {
        const el = document.getElementById('pdf-loading-spinner');
        if (el) el.classList.toggle('hidden', !show);
    }

    showPdfError(msg) {
        const el = document.getElementById('pdf-error-container');
        const textEl = document.getElementById('pdf-error-text');
        const dlBtn = document.getElementById('pdf-fallback-download-btn');
        if (textEl) textEl.textContent = msg;
        if (dlBtn && this.activeBook) dlBtn.href = `/api/library/pdf/${this.activeBook.id}`;
        if (el) el.classList.remove('hidden');
    }

    hidePdfError() {
        const el = document.getElementById('pdf-error-container');
        if (el) el.classList.add('hidden');
    }

    closeReader() {
        const modal = document.getElementById('library-reader-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
        }

        // Clean up PDF resources
        if (this.pdfDoc) {
            try {
                this.pdfDoc.destroy();
            } catch (e) {}
            this.pdfDoc = null;
        }

        const canvas = document.getElementById('pdf-render-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.activeBook = null;
    }

    studyWithTimer(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        // Switch to Timer Tab
        if (window.timerApp) {
            window.timerApp.switchTab("tab-timer");
        } else {
            const timerTabBtn = document.querySelector('[data-tab="tab-timer"]');
            if (timerTabBtn) timerTabBtn.click();
        }

        // Update active subject badge
        const badge = document.getElementById('active-subject-badge');
        if (badge) {
            const shortTitle = book.title.length > 25 ? book.title.substring(0, 23) + '...' : book.title;
            badge.textContent = `📖 ${shortTitle}`;
        }

        // Show toast
        if (window.timerApp) {
            window.timerApp.showToast(`📚 Session configurée sur : ${book.title}`);
        }
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.library = new StudySoukLibrary();
});
