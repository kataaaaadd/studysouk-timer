import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || process.env.VITE_DISCORD_CLIENT_ID || '1572928085362479104';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';

const BOT_ROOT_DIR = '/root/studysouk-bot';
const LIBRARY_CATALOG_FILE = path.join(__dirname, 'assets/data/library.json');

app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, _res, next) => {
  console.log(`[Timer Server] ${req.method} ${req.url}`);
  next();
});

// Forgive Discord URL mapping prefix mistakes and strip /.proxy
app.use((req, _res, next) => {
  if (req.url.startsWith('/.proxy/index.html')) {
    req.url = req.url.replace(/^\/\.proxy\/index\.html/, '') || '/';
  } else if (req.url.startsWith('/.proxy')) {
    req.url = req.url.replace(/^\/\.proxy/, '') || '/';
  }

  if (req.url.startsWith('/%3F')) {
    const slash = req.url.indexOf('/', 1);
    req.url = slash === -1 ? '/' : req.url.slice(slash);
  }
  next();
});

// Discord OAuth token exchange endpoint
app.post('/api/token', async (req, res) => {
  try {
    const { code } = req.body ?? {};
    if (!code) return res.status(400).json({ error: 'missing code' });
    const r = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    res.json({ access_token: data.access_token });
  } catch (err) {
    console.error('[OAuth] Token exchange failed:', err);
    res.status(500).json({ error: 'token exchange failed' });
  }
});

// ===========================================================================
// Nabras AI Chatbot API (نبراس - المساعد الأكاديمي الذكي)
// ===========================================================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const NABRAS_SYSTEM_PROMPTS = {
  darija: `Nta smitek "Nabras" (نبراس)، l-Assistant d l-AI l-official w l-Boma l-3alima d StudySouk Academy (l-plateforme éducative marocaine d'élite).
Khedmtek hya:
1. Tchre7 les cours d l-qraya f l-Maghrib (Maths, Physique-Chimie, SVT, Informatique, Philo, etc.) l ga3 les niveaux (Collège, Tronc Commun, 1BAC, 2BAC SM/PC/SVT/STE/STM, CPGE, Médecine FMP/FMD, Universités).
2. Tjawb 3la les exercices w tfhem l-points li ma mafhouminch b tariqa sahla w pédagogique b astuces d l-imti7an l-watani w les concours.
3. Tmotivi l-étudiants, t-7areb l-taswif (procrastination), w tchejja3hom y-focusséw f deep work b pomodoro.

REGLES OBLIGATOIRES:
- Hder b DARIJA MGHRIBIYA nqiya, wadiha, dkiya w mchejja3a bezzaf!
- Khellat Darija m3a les termes scientifiques b l-Français kima kayhder l-étudiant l-mghribi f l-classe (ex: la limite, dérivée, intégrale, vecteur, dosage acido-basique, dipôle RC/RLC, onde mécanique, mitose, etc.).
- Ila kano des formules mathématiques, ktebhom b LaTeX ($...$ wla $$...$$).
- Khlli les réponses dyalk mnadmine b les puces w les étapes w l-exemples l-waqiyiin.
- Dima khellik positif, mentor, w 3ti tchi7at (motivation) f l-kher!`,

  fr: `Tu es "Nabras" (نبراس), l'intelligence artificielle d'élite et le tuteur officiel de StudySouk Academy (la plateforme éducative marocaine d'excellence).
Tes missions fondamentales :
1. Expliquer les cours et concepts scientifiques du cursus marocain (Mathématiques, Physique-Chimie, SVT, Sciences de l'Ingénieur, Informatique...) pour tous les niveaux (Collège, Tronc Commun, 1BAC, 2BAC SM/PC/SVT/STE/STM, CPGE MPSI/PCSI/TSI, Concours CNC, FMP, ENSA, Universités).
2. Répondre avec rigueur et clarté aux interrogations des élèves, débloquer les exercices et dévoiler les méthodes clés des examens nationaux et concours marocains.
3. Motiver les élèves, vaincre la procrastination, promouvoir la discipline et le focus en sessions Pomodoro.

RÈGLES D'OR :
- Rédige dans un FRANÇAIS ACADÉMIQUE irréprochable, structuré, précis et bienveillant.
- Utilise la notation mathématique LaTeX ($...$ pour le texte en ligne, $$...$$ pour les blocs centrés).
- Sois très pédagogique : commence par l'idée intuitive avant la formalisation mathématique, puis donne un exemple ou un piège classique d'examen.
- Encourage toujours l'étudiant avec dynamisme et professionnalisme.`,

  ar: `أنت "نبراس" (Nabras)، المساعد الأكاديمي الذكي والمعلم المرشد الرسمي لمنصة StudySouk Academy (المنصة التعليمية المغربية الرائدة).
مهامك الأساسية:
1. شرح الدروس والمفاهيم العلمية والأدبية في المنهاج المغربي (الرياضيات، الفيزياء والكيمياء، علوم الحياة والأرض، الفلسفة، العربية، الإنجليزية...) لجميع المستويات (الإعدادي، الجذع المشترك، الأولى والثانية باكالوريا بجميع المسالك، الأقسام التحضيرية CPGE، ومباريات الطب والهندسة).
2. الإجابة بدقة عن أسئلة الطلاب وحل التمارين وتوضيح النقاط الغامضة بأسلوب تربوي خطوة بخطوة.
3. تحفيز الطلاب وشحذ هممهم للتركيز في جلسات العمل العميق (Pomodoro)، ومحاربة التسويف وبث الثقة والتفوق في نفوسهم.

قواعد الإجابة:
- اكتب بلغة عربية فصيحة، بليغة، واضحة ومبسطة، مع الحفاظ على المصطلحات العلمية الدقيقة.
- استخدم صيغ LaTeX الرياضية ($...$ أو $$...$$) للمعادلات والرموز.
- نظم الإجابة في نقاط واضحة وعناوين فرعية وأمثلة تطبيقية مع التنبيه للأخطاء الشائعة في الامتحانات.
- اختم دائماً بعبارات تحفيزية تشجع على الاستمرار والنجاح والتفوق!`
};

const MODE_PROMPTS = {
  explain: {
    darija: `\n[Mode actuel: شرح الدروس] Chre7 l-concept wla d-dars b tariqa mafhouma b bzzaf, b l-mital w l-astuce li kat-7ett f l-watani wla l-concours.`,
    fr: `\n[Mode actuel : Explication de Cours] Mets l'accent sur la pédagogie, les définitions claires, les démonstrations intuitives, et les pièges classiques d'examen.`,
    ar: `\n[النمط الحالي: شرح الدروس] ركّز على التبسيط التربوي للمفهوم، الشرح المتدرج، ذكر القواعد الذهبية والنصائح المنهجية لاجتياز الامتحانات بنجاح.`
  },
  qa: {
    darija: `\n[Mode actuel: حل وفهم التمارين] Jawb 3la l-su2al d l-exercice wla l-point li ma-mfhoumch b étapes claires, 3awnou yfhem kifach yfeqqar f l-hal bla ma t-3tih jawb 7afi.`,
    fr: `\n[Mode actuel : Résolution & Doutes] Réponds à la question ou à l'exercice avec rigueur méthodique, étape par étape, en explicitant le raisonnement scientifique.`,
    ar: `\n[النمط الحالي: حل وفهم التمارين] أجب عن السؤال أو التمرين خطوة بخطوة، مع توضيح المنطق الرياضي/العلمي وراء كل خطوة لتمكين الطالب من الفهم العميق.`
  },
  motivate: {
    darija: `\n[Mode actuel: تحفيز وتركيز] 3tih énergie ijabiya qwiya! Fekrou f les objectifs dyalo (Bac b mention, CPGE, Médecine), 3awnou y-ghleb l-3gez w y-kmmel had l-séance d deep work b kol 7amass!`,
    fr: `\n[Mode actuel : Motivation & Focus] Transmets une énergie positive et bienveillante ! Rappelle-lui ses ambitions (Mention Très Bien, Concours, Écoles), donne des conseils de gestion du stress et incite-le à réussir son bloc Pomodoro.`,
    ar: `\n[النمط الحالي: تحفيز وتركيز] بث في الطالب طاقة إيجابية وهمة عالية! ذكّره بأهدافه العظيمة، وشجعه على الانضباط والتركيز في جلسة العمل العميق هذه والتغلب على الكسل والتسويف.`
  }
};

app.post(['/api/ai/chat', '/.proxy/api/ai/chat'], async (req, res) => {
  try {
    const { message, language = 'darija', mode = 'explain', history = [] } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message requis' });
    }

    const langKey = ['darija', 'fr', 'ar'].includes(language) ? language : 'darija';
    const modeKey = ['explain', 'qa', 'motivate'].includes(mode) ? mode : 'explain';

    const baseSysPrompt = NABRAS_SYSTEM_PROMPTS[langKey] || NABRAS_SYSTEM_PROMPTS.darija;
    const modeDirective = MODE_PROMPTS[modeKey]?.[langKey] || '';
    const fullSystemInstruction = baseSysPrompt + modeDirective;

    const apiKey = GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return res.status(500).json({ error: 'Clé API Gemini non configurée sur le serveur.' });
    }

    // Format history for Gemini API (max last 8 messages)
    const contents = [];
    if (Array.isArray(history)) {
      const recent = history.slice(-8);
      for (const item of recent) {
        if (item && item.text) {
          const role = item.role === 'user' ? 'user' : 'model';
          contents.push({ role, parts: [{ text: String(item.text) }] });
        }
      }
    }
    // Add current user message
    contents.push({ role: 'user', parts: [{ text: message.trim() }] });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
    const payload = {
      system_instruction: { parts: [{ text: fullSystemInstruction }] },
      contents,
      generationConfig: {
        temperature: modeKey === 'motivate' ? 0.7 : 0.25,
        maxOutputTokens: 4096
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Nabras AI] Gemini API error:', response.status, data);
      return res.status(response.status).json({
        error: data.error?.message || 'Erreur lors de la génération de réponse'
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.json({
      ok: true,
      reply,
      language: langKey,
      mode: modeKey
    });
  } catch (err) {
    console.error('[Nabras AI] Chat endpoint error:', err);
    return res.status(500).json({ error: String(err) });
  }
});

// ===========================================================================
// StudySouk Maktaba & STEM Library API (149 Volumes)
// ===========================================================================
app.get(['/api/library/books', '/.proxy/api/library/books'], (_req, res) => {
  try {
    if (fs.existsSync(LIBRARY_CATALOG_FILE)) {
      const data = JSON.parse(fs.readFileSync(LIBRARY_CATALOG_FILE, 'utf8'));
      return res.json(data);
    }
    return res.status(404).json({ error: 'Library catalog not found' });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

const resolvedBookPaths = new Map();

function findBookPdfOnDisk(book) {
  if (resolvedBookPaths.has(book.id)) {
    const cached = resolvedBookPaths.get(book.id);
    if (fs.existsSync(cached)) return cached;
  }

  // 1. Direct path in BOT_ROOT_DIR
  if (book.filepath) {
    const directPath = path.resolve(BOT_ROOT_DIR, book.filepath);
    if (fs.existsSync(directPath)) {
      resolvedBookPaths.set(book.id, directPath);
      return directPath;
    }
    // 2. Direct inside /root/studysouk-bot/library/
    const baseName = path.basename(book.filepath);
    const inLibRoot = path.resolve(BOT_ROOT_DIR, 'library', baseName);
    if (fs.existsSync(inLibRoot)) {
      resolvedBookPaths.set(book.id, inLibRoot);
      return inLibRoot;
    }
  }

  // 3. Search by filename recursively
  const targetName = book.filename || (book.filepath ? path.basename(book.filepath) : null);
  if (targetName) {
    const libRoot = path.resolve(BOT_ROOT_DIR, 'library');
    try {
      function searchDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            const found = searchDir(full);
            if (found) return found;
          } else if (entry.isFile() && (entry.name === targetName || entry.name.toLowerCase() === targetName.toLowerCase())) {
            return full;
          }
        }
        return null;
      }
      const found = searchDir(libRoot);
      if (found) {
        resolvedBookPaths.set(book.id, found);
        return found;
      }
    } catch (e) {
      console.warn(`[Library] Search error: ${e}`);
    }
  }

  return null;
}

app.get(['/api/library/pdf/:id', '/.proxy/api/library/pdf/:id'], (req, res) => {
  try {
    const bookId = Number(req.params.id);
    if (!fs.existsSync(LIBRARY_CATALOG_FILE)) {
      return res.status(404).send('Catalog not found');
    }

    const catalog = JSON.parse(fs.readFileSync(LIBRARY_CATALOG_FILE, 'utf8'));
    const book = catalog.find((b) => Number(b.id) === bookId);
    if (!book) {
      return res.status(404).send('Document introuvable dans le catalogue');
    }

    const pdfPath = findBookPdfOnDisk(book);
    if (!pdfPath) {
      return res.status(404).send('Fichier PDF introuvable sur le serveur');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(book.filename || path.basename(pdfPath))}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    return res.sendFile(pdfPath);
  } catch (err) {
    return res.status(500).send(`Erreur serveur: ${err}`);
  }
});

// Cache control: HTML is never cached so Discord iframe always gets freshest version
const HTML_NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

app.use(
  express.static(__dirname, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=300');
      }
      res.setHeader('X-Frame-Options', 'ALLOWALL');
    },
  })
);

app.get('/terms', (_req, res) => res.sendFile(path.join(__dirname, 'terms.html'), HTML_NO_STORE));
app.get('/privacy', (_req, res) => res.sendFile(path.join(__dirname, 'privacy.html'), HTML_NO_STORE));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html'), HTML_NO_STORE));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`⏱️ StudySouk Timer Activity Server running independently on port ${PORT}`);
});
