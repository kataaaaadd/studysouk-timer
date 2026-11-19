# StudySouk Timer — Discord Embedded Activity ⏱️✨

> **Discord Application ID :** `1572928085362479104`  
> **Concept :** Espace d'étude d'élite en salon vocal Discord combinant Pomodoro partagé en temps réel, duels STEM 1v1, ardoise collaborative et radio Lo-Fi 24/7.

---

## 🌟 Fonctionnalités Complètes & Architecture

### 1. 🔄 Moteur Temps Réel Multijoueur (`sync-engine.js`)
* **Zero-backend setup :** Fonctionne directement via MQTT over WebSockets sécurisés (`wss://broker.emqx.io:8084/mqtt`) + `BroadcastChannel` local.
* **Synchronisation du Pomodoro :** Play, Pause, Reset et changement de durée se répercutent instantanément chez tous les participants du salon vocal.
* **Présence & Roster Live :** Compteur dynamique de membres connectés (`👥 3 en ligne`) avec liste interactive des participants, avatars et temps d'étude.
* **Réactions Flottantes Partagées :** Emojis (🔥, ☕, 🍅, 🧠, ⚡, 👏, 🏆) qui s'envolent sur les écrans de tous les camarades avec le badge du prénom de l'expéditeur.

### 2. ⚔️ Arène de Duel STEM 1v1 (`duel.js`)
* **Mode 1v1 Salon Vocal :** Lance un défi STEM direct aux membres du vocal. Une notification interactive s'affiche pour leur permettre de rejoindre en 1 clic.
* **Synchronisation des questions :** Les deux adversaires répondent aux mêmes questions simultanément avec compte à rebours de 15s et jauge de progression en direct.
* **Mode Solo vs Major IA :** Entraînement solo contre l'intelligence artificielle pour s'échauffer.
* **Banque de questions de haut niveau :** 2BAC SM, PC et CPGE (Maths, Physique-Chimie, Algorithmique).

### 3. 🎨 Ardoise & Formules Collaboratives (`scratchpad.js`)
* **Tableau Blanc Dessin Partagé :** Dessine des graphes, schémas de mécanique ou circuits électriques. Les traits sont dessinés en direct chez tous les étudiants connectés.
* **Palette Complète :** Or StudySouk `#D4AF37`, Cerise Impériale `#E63946`, Cyan `#4CC9F0`, Émeraude `#2EC4B6`, Craie Blanche, Gomme et Surligneur.
* **Formulaire & Éditeur LaTeX HD :** Rendu KaTeX instantané avec bouton « Partager sur le Vocal » pour afficher immédiatement une formule à toute l'équipe.

### 4. 🎧 Radio Lo-Fi 24/7 & Mixeur Ambiance HD (`audio.js`)
* **Flux Webradio En Direct :**
  * ☕ *Chillhop Study Beats*
  * 🎧 *Lofi Girl Relax & Focus*
  * ⚡ *Nightwave Synthwave / Cyber Focus*
  * 🪶 *Piano & Classique Zen*
* **Générateurs Procéduraux Web Audio :** Pluie douce, crépitement de feu de bois, murmures de café, ondes cérébrales binaurales 528 Hz.
* **Gong Tibétain & ASMR :** Clavier mécanique réaliste à la frappe et cloche tibétaine profonde à la fin du Pomodoro.

### 5. 🌳 Compagnon Bonsaï & Niveaux RPG (`bonsai.js`, `levels.js`)
* Arbre bonsaï vectoriel qui grandit au fil des minutes de travail.
* Système d'XP et 7 rangs déblocables d'*Apprenti Chercheur* à *Légende du Focus*.

### 6. 🎮 Mini-Jeux de Pause (`games.js`)
* **Mot Mystère (Wordle)** (5 ou 6 lettres, vocabulaire scientifique).
* **Speed Math Rush ⚡** (calcul mental rapide avec multiplicateurs combo).
* **Anagrammes Scientifiques**.

---

## 🚀 Guide de Test en Local & Déploiement

### Option A : Tester en local dans votre navigateur
1. Lance un serveur HTTP local dans le dossier :
   ```bash
   python -m http.server 8080
   ```
2. Ouvre deux onglets sur `http://localhost:8080` pour tester la synchronisation multijoueur (Pomodoro, Ardoise, Réactions, Duels) en direct !

### Option B : Déploiement sur GitHub Pages (ou Vercel)
1. Créer un dépôt GitHub et pousser les fichiers :
   ```bash
   git init
   git add .
   git commit -m "feat: StudySouk Timer Discord Activity Master"
   git branch -M main
   git remote add origin <URL_REPO_GITHUB>
   git push -u origin main
   ```
2. Dans GitHub, aller dans **Settings > Pages** et sélectionner la branche `main` (dossier `/root`).
3. Noter l'URL fournie (ex: `https://ton-pseudo.github.io/studysouk-timer/`).

### Option C : Configuration Discord Developer Portal
1. Ouvrir le portail développeur Discord sur l'application **`1572928085362479104`**.
2. Dans le menu de gauche, aller dans **Activities** / **Embedded App SDK**.
3. Dans **URL Mappings** :
   * **Prefix :** `/`
   * **Target :** `ton-pseudo.github.io/studysouk-timer` (ou l'URL de votre déploiement).
4. Renseigner les champs :
   * **Terms of Service URL :** `https://ton-pseudo.github.io/studysouk-timer/terms.html`
   * **Privacy Policy URL :** `https://ton-pseudo.github.io/studysouk-timer/privacy.html`

### Option D : Lancer le Bot Discord (`bot_l3alawi.py`)
1. Installer discord.py :
   ```bash
   pip install discord.py
   ```
2. Lancer le bot :
   ```bash
   python bot_l3alawi.py
   ```
3. Dans un salon vocal sur Discord, taper :
   ```
   /activity
   ```
   Et cliquer sur **🚀 Rejoindre StudySouk Timer** !
