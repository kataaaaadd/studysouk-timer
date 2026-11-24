/**
 * StudySouk Discord Activity - Maktaba & STEM Library Module
 * 149 Curated Volumes: CPGE, 2BAC SM, 1BAC SM, Recueil Y. Alaoui, Concours & Agrégation.
 */

class StudySoukLibrary {
    constructor() {
        window.library = this;
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
        this.scale = 1.0;
        this.fitMode = 'width'; // 'width', 'page', or 'custom'
        this.currentPdfUrl = null;
        this.isIframeView = false;
        this.resizeTimer = null;
        this.touchStartX = 0;
        this.touchStartY = 0;

        if (window.pdfjsLib) {
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
        let apiPrefix = '';
        if (window.location.pathname.includes('/.proxy')) {
            apiPrefix = window.location.pathname.replace(/\/index\.html.*$/, '').replace(/\/+$/, '');
            if (!apiPrefix.startsWith('/.proxy')) apiPrefix = '/.proxy';
        }

        try {
            // First try live server API (with proxy prefix if in Discord)
            const apiUrl = `${apiPrefix}/api/library/books`.replace(/^\/\//, '/');
            const res = await fetch(apiUrl);
            if (res.ok) {
                this.books = await res.json();
            } else {
                throw new Error('API non disponible');
            }
        } catch (e) {
            console.warn('[Library] API fallback to direct or local assets/data/library.json');
            try {
                const res = await fetch('/api/library/books');
                if (res.ok) {
                    this.books = await res.json();
                } else {
                    throw new Error('Fallback failed');
                }
            } catch (err2) {
                try {
                    const res = await fetch('assets/data/library.json');
                    this.books = await res.json();
                } catch (err) {
                    console.error('[Library] Failed to load catalog:', err);
                    this.books = [];
                }
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

        // View Mode Toggle (Canvas HD vs iFrame)
        const toggleViewBtn = document.getElementById('btn-toggle-pdf-view');
        if (toggleViewBtn) {
            toggleViewBtn.addEventListener('click', () => this.toggleView());
        }
        const errIframeBtn = document.getElementById('pdf-error-iframe-btn');
        if (errIframeBtn) {
            errIframeBtn.addEventListener('click', () => this.showIframeView(true));
        }

        // Fullscreen Toggle
        const fsBtn = document.getElementById('btn-fullscreen-pdf');
        if (fsBtn) {
            fsBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Event Delegation for Library Books Grid
        const booksGrid = document.getElementById('library-books-grid');
        if (booksGrid && !booksGrid._delegated) {
            booksGrid._delegated = true;
            booksGrid.addEventListener('click', (e) => {
                const readBtn = e.target.closest('[data-action="open-reader"]');
                if (readBtn) {
                    e.preventDefault();
                    this.openReader(readBtn.dataset.bookId);
                    return;
                }
                const studyBtn = e.target.closest('[data-action="study-book"]');
                if (studyBtn) {
                    e.preventDefault();
                    this.studyWithTimer(studyBtn.dataset.bookId);
                    return;
                }
            });
        }

        // PDF Navigator & Zoom Buttons
        document.getElementById('pdf-first')?.addEventListener('click', () => {
            if (this.pdfDoc && this.pageNum !== 1) {
                this.pageNum = 1;
                this.queueRenderPage(1);
            }
        });
        document.getElementById('pdf-last')?.addEventListener('click', () => {
            if (this.pdfDoc && this.pageNum !== this.pdfDoc.numPages) {
                this.pageNum = this.pdfDoc.numPages;
                this.queueRenderPage(this.pageNum);
            }
        });
        document.getElementById('pdf-prev')?.addEventListener('click', () => this.onPrevPage());
        document.getElementById('pdf-next')?.addEventListener('click', () => this.onNextPage());
        document.getElementById('pdf-fit-width')?.addEventListener('click', () => this.fitToWidth());
        document.getElementById('pdf-fit-page')?.addEventListener('click', () => this.fitToPage());
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
            pageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.target.blur();
                }
            });
        }

        // Window resize handler for dynamic auto-fit
        window.addEventListener('resize', () => {
            const modal = document.getElementById('library-reader-modal');
            if (!modal || modal.classList.contains('hidden') || !this.pdfDoc) return;
            if (this.fitMode === 'width' || this.fitMode === 'page') {
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(async () => {
                    this.scale = await this.calculateFitScale(this.pageNum, this.fitMode);
                    this.renderPdfPage(this.pageNum);
                }, 150);
            }
        });

        // Touch Swipe Navigation for Mobile
        const viewerContainer = document.getElementById('pdf-viewer-container');
        if (viewerContainer) {
            viewerContainer.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    this.touchStartX = e.touches[0].clientX;
                    this.touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            viewerContainer.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 1) {
                    const dx = e.changedTouches[0].clientX - this.touchStartX;
                    const dy = e.changedTouches[0].clientY - this.touchStartY;
                    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                        if (dx < 0) {
                            this.onNextPage();
                        } else {
                            this.onPrevPage();
                        }
                    }
                }
            }, { passive: true });
        }

        // Keyboard navigation for PDF reader
        window.addEventListener('keydown', (e) => {
            const modal = document.getElementById('library-reader-modal');
            const isModalOpen = modal && !modal.classList.contains('hidden');
            if (!isModalOpen) return;

            // Ignore if active element is an input
            if (document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.id !== 'pdf-page-num') {
                return;
            }

            if (e.key === 'Escape') {
                this.closeReader();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'k') {
                e.preventDefault();
                this.onPrevPage();
            } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'j') {
                e.preventDefault();
                this.onNextPage();
            } else if (e.key === 'Home') {
                e.preventDefault();
                if (this.pdfDoc && this.pageNum !== 1) {
                    this.pageNum = 1;
                    this.queueRenderPage(1);
                }
            } else if (e.key === 'End') {
                e.preventDefault();
                if (this.pdfDoc && this.pageNum !== this.pdfDoc.numPages) {
                    this.pageNum = this.pdfDoc.numPages;
                    this.queueRenderPage(this.pageNum);
                }
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.zoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                this.zoomOut();
            } else if (e.key.toLowerCase() === 'w') {
                e.preventDefault();
                this.fitToWidth();
            } else if (e.key.toLowerCase() === 'p') {
                e.preventDefault();
                this.fitToPage();
            } else if (e.key === '0') {
                e.preventDefault();
                this.fitMode = 'custom';
                this.scale = 1.0;
                this.renderPdfPage(this.pageNum);
            } else if (e.key.toLowerCase() === 'f') {
                e.preventDefault();
                this.toggleFullscreen();
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
                        <button data-action="open-reader" data-book-id="${book.id}" class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-cherry to-brand-cherryVibrant hover:from-brand-cherryLight hover:to-brand-cherry border border-brand-gold/60 text-white font-black text-xs font-outfit flex items-center justify-center gap-1.5 active:scale-95 transition shadow">
                            <i class="fa-solid fa-book-open text-brand-goldLight text-xs pointer-events-none"></i>
                            <span class="gold-text-gradient pointer-events-none">Consulter 📖</span>
                        </button>
                        <button data-action="study-book" data-book-id="${book.id}" title="Lancer une session de Deep Work sur cet ouvrage" class="w-8 h-8 rounded-xl glass-card border border-brand-borderSubtle hover:border-brand-gold text-brand-goldLight hover:text-white flex items-center justify-center active:scale-95 transition shadow">
                            <i class="fa-solid fa-stopwatch text-xs pointer-events-none"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async openReader(bookId) {
        console.log('[Library] openReader called with bookId:', bookId);
        const idNum = Number(bookId);
        let book = this.books.find(b => b.id === idNum || Number(b.id) === idNum || b.id == bookId);

        if (!book && this.books.length === 0) {
            console.log('[Library] Catalog empty, reloading books...');
            await this.loadBooks();
            book = this.books.find(b => b.id === idNum || Number(b.id) === idNum || b.id == bookId);
        }

        if (!book) {
            console.error('[Library] Livre introuvable pour ID:', bookId);
            if (window.timerApp && window.timerApp.showToast) {
                window.timerApp.showToast("⚠️ Ouvrage introuvable dans le catalogue");
            }
            return;
        }

        this.activeBook = book;
        const modal = document.getElementById('library-reader-modal');
        const titleEl = document.getElementById('reader-modal-title');
        const badgeEl = document.getElementById('reader-modal-badge');
        const openTabBtn = document.getElementById('btn-open-pdf-external');
        const studyBtn = document.getElementById('btn-study-this-book');

        if (titleEl) titleEl.textContent = book.title;
        if (badgeEl) badgeEl.textContent = `${book.pages} pages • ${book.subject} • ${book.level}`;

        let basePath = '';
        if (window.location.pathname.includes('/.proxy')) {
            basePath = window.location.pathname.replace(/\/index\.html.*$/, '').replace(/\/+$/, '');
            if (!basePath.startsWith('/.proxy')) basePath = '/.proxy';
        }
        
        let pdfUrl = '';
        if (book.pdf_url) {
            pdfUrl = book.pdf_url;
        } else if (book.filename) {
            pdfUrl = `assets/docs/${book.filename}`;
        } else {
            pdfUrl = `${basePath}/api/library/pdf/${book.id}`.replace(/^\/\//, '/');
        }

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
            modal.style.display = 'flex';
            document.body.classList.add('overflow-hidden');
        }

        this.currentPdfUrl = pdfUrl;
        this.showIframeView(false);

        // Load and render PDF using PDF.js
        await this.loadPdfDocument(pdfUrl);
    }

    async calculateFitScale(pageNum, mode = 'width') {
        if (!this.pdfDoc) return 1.0;
        try {
            const page = await this.pdfDoc.getPage(pageNum || this.pageNum);
            const container = document.getElementById('pdf-viewer-container');
            if (!container) return 1.0;

            const isMobile = window.innerWidth < 640;
            const padX = isMobile ? 16 : 36;
            const padY = isMobile ? 16 : 36;

            const availableW = Math.max(260, container.clientWidth - padX);
            const availableH = Math.max(300, container.clientHeight - padY);

            const unscaledViewport = page.getViewport({ scale: 1.0 });

            if (mode === 'page') {
                const scaleW = availableW / unscaledViewport.width;
                const scaleH = availableH / unscaledViewport.height;
                return Math.max(0.35, Math.min(scaleW, scaleH, 2.5));
            }

            // mode === 'width' (Fit neatly to width)
            const scaleW = availableW / unscaledViewport.width;
            return Math.max(0.35, Math.min(scaleW, 3.2));
        } catch (e) {
            console.warn('[PDF.js] calculateFitScale fallback:', e);
            return 1.0;
        }
    }

    async fitToWidth() {
        this.fitMode = 'width';
        this.scale = await this.calculateFitScale(this.pageNum, 'width');
        this.renderPdfPage(this.pageNum);
    }

    async fitToPage() {
        this.fitMode = 'page';
        this.scale = await this.calculateFitScale(this.pageNum, 'page');
        this.renderPdfPage(this.pageNum);
    }

    async loadPdfDocument(url) {
        this.showPdfLoading(true);
        this.hidePdfError();

        try {
            if (!window.pdfjsLib) {
                throw new Error("Moteur PDF.js non chargé.");
            }

            console.log('[Library] Loading PDF binary from:', url);
            let res = await fetch(url);
            
            // If failed with proxy prefix, retry with direct /api/ path
            if (!res.ok && url.includes('/.proxy/')) {
                const fallbackUrl = url.replace(/^\/\.proxy/, '');
                console.warn('[Library] Retrying fetch directly without .proxy:', fallbackUrl);
                res = await fetch(fallbackUrl);
            }

            // Secondary fallback: retry directly from assets/docs/ or API
            if (!res.ok && this.activeBook) {
                if (this.activeBook.filename && !url.includes('assets/docs/')) {
                    const docUrl = `assets/docs/${this.activeBook.filename}`;
                    console.warn('[Library] Retrying from assets/docs:', docUrl);
                    res = await fetch(docUrl);
                } else if (!url.includes('/api/library/pdf/')) {
                    const apiUrl = `/api/library/pdf/${this.activeBook.id}`;
                    console.warn('[Library] Retrying from API fallback:', apiUrl);
                    res = await fetch(apiUrl);
                }
            }

            if (!res.ok) {
                throw new Error(`Erreur réseau HTTP ${res.status}: ${res.statusText || 'Document non disponible'}`);
            }

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('text/html')) {
                throw new Error("Format PDF invalide (reçu HTML au lieu du fichier binaire PDF).");
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
            this.fitMode = 'width'; // Start in auto-fit to width!
            this.scale = await this.calculateFitScale(1, 'width');
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
            const wrapper = document.getElementById('pdf-canvas-wrapper');
            if (!canvas) {
                this.pageRendering = false;
                return;
            }
            const ctx = canvas.getContext('2d');

            const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
            const viewport = page.getViewport({ scale: this.scale * dpr });

            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const cssW = Math.floor(viewport.width / dpr);
            const cssH = Math.floor(viewport.height / dpr);
            canvas.style.height = `${cssH}px`;
            canvas.style.width = `${cssW}px`;

            if (wrapper) {
                wrapper.style.width = `${cssW}px`;
                wrapper.style.height = `${cssH}px`;
            }

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
        if (zoomLevelEl) {
            let label = `${Math.round(this.scale * 100)}%`;
            if (this.fitMode === 'width') label += ' ↔';
            else if (this.fitMode === 'page') label += ' ↕';
            zoomLevelEl.textContent = label;
        }

        // Highlight active fit buttons
        const btnWidth = document.getElementById('pdf-fit-width');
        const btnPage = document.getElementById('pdf-fit-page');
        if (btnWidth) {
            btnWidth.classList.toggle('border-brand-gold', this.fitMode === 'width');
            btnWidth.classList.toggle('bg-brand-gold/15', this.fitMode === 'width');
        }
        if (btnPage) {
            btnPage.classList.toggle('border-brand-gold', this.fitMode === 'page');
            btnPage.classList.toggle('bg-brand-gold/15', this.fitMode === 'page');
        }
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
        if (this.scale >= 3.5) return;
        this.fitMode = 'custom';
        this.scale = Math.min(3.5, +(this.scale + 0.15).toFixed(2));
        this.renderPdfPage(this.pageNum);
    }

    zoomOut() {
        if (this.scale <= 0.35) return;
        this.fitMode = 'custom';
        this.scale = Math.max(0.35, +(this.scale - 0.15).toFixed(2));
        this.renderPdfPage(this.pageNum);
    }

    zoomReset() {
        if (this.fitMode === 'width') {
            this.fitToPage();
        } else if (this.fitMode === 'page') {
            this.fitMode = 'custom';
            this.scale = 1.0;
            this.renderPdfPage(this.pageNum);
        } else {
            this.fitToWidth();
        }
    }

    toggleFullscreen() {
        const modal = document.getElementById('library-reader-modal');
        const fsBtn = document.getElementById('btn-fullscreen-pdf');
        if (!document.fullscreenElement) {
            if (modal?.requestFullscreen) {
                modal.requestFullscreen().catch(err => console.warn('[Library] Fullscreen blocked:', err));
            } else if (modal?.webkitRequestFullscreen) {
                modal.webkitRequestFullscreen();
            }
            if (fsBtn) fsBtn.innerHTML = '<i class="fa-solid fa-compress text-xs"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(err => console.warn('[Library] Exit fullscreen error:', err));
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            if (fsBtn) fsBtn.innerHTML = '<i class="fa-solid fa-expand text-xs"></i>';
        }
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
        if (dlBtn && this.activeBook) {
            let basePath = '';
            if (window.location.pathname.includes('/.proxy')) {
                basePath = window.location.pathname.replace(/\/index\.html.*$/, '').replace(/\/+$/, '');
                if (!basePath.startsWith('/.proxy')) basePath = '/.proxy';
            }
            dlBtn.href = `${basePath}/api/library/pdf/${this.activeBook.id}`.replace(/^\/\//, '/');
        }
        if (el) el.classList.remove('hidden');
    }

    hidePdfError() {
        const el = document.getElementById('pdf-error-container');
        if (el) el.classList.add('hidden');
    }

    toggleView() {
        this.showIframeView(!this.isIframeView);
    }

    showIframeView(show) {
        this.isIframeView = show;
        const canvasWrap = document.getElementById('pdf-canvas-wrapper');
        const iframeEl = document.getElementById('pdf-fallback-iframe');
        const toggleBtn = document.getElementById('btn-toggle-pdf-view');
        const navToolbar = document.querySelector('#library-reader-modal .font-mono.border-b');

        if (show) {
            if (canvasWrap) canvasWrap.classList.add('hidden');
            if (iframeEl) {
                iframeEl.classList.remove('hidden');
                if (this.currentPdfUrl && iframeEl.src !== this.currentPdfUrl) {
                    iframeEl.src = this.currentPdfUrl;
                }
            }
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-file-pdf text-xs"></i> <span class="hidden sm:inline text-[10px]">Canvas HD</span>';
            if (navToolbar) navToolbar.classList.add('opacity-30', 'pointer-events-none');
            this.hidePdfError();
            this.showPdfLoading(false);
        } else {
            if (iframeEl) {
                iframeEl.classList.add('hidden');
            }
            if (canvasWrap) canvasWrap.classList.remove('hidden');
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-window-maximize text-xs"></i> <span class="hidden sm:inline text-[10px]">iFrame</span>';
            if (navToolbar) navToolbar.classList.remove('opacity-30', 'pointer-events-none');
        }
    }

    closeReader() {
        const modal = document.getElementById('library-reader-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modal.style.display = 'none';
            document.body.classList.remove('overflow-hidden');
        }

        this.showIframeView(false);
        const iframeEl = document.getElementById('pdf-fallback-iframe');
        if (iframeEl) iframeEl.src = 'about:blank';

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
        const idNum = Number(bookId);
        const book = this.books.find(b => b.id === idNum || Number(b.id) === idNum || b.id == bookId);
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

// Global initialization - robust against timing of DOMContentLoaded
function initStudySoukLibrary() {
    if (!window.library) {
        window.library = new StudySoukLibrary();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudySoukLibrary);
} else {
    initStudySoukLibrary();
}
