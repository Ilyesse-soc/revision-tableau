# 📖 Quran Revision Tracker

Application web (PWA) pour suivre la révision du Coran par Hizb, sur un
cycle de 2 semaines, avec sauvegarde locale et fonctionnement hors ligne.

## Fonctionnalités

- Tableau de révision par semaine (Hizb en lignes, jours en colonnes)
- Cycle intelligent de 2 semaines : ajoute un nouveau Hizb, il est inséré et
  le planning se rééquilibre automatiquement entre les deux semaines
- Sauvegarde 100% locale (`localStorage`), aucune donnée envoyée nulle part
- Fonctionne hors ligne après le premier chargement (PWA installable)
- Graphique de régularité (2 semaines / 1 mois / global)
- Résumé : révisions de la semaine, % de régularité, streak actuel, meilleur streak
- Bouton "Aujourd'hui" pour revenir directement à la semaine en cours
- Interface mobile-first, utilisable au téléphone (notamment en voyage)

## Stack

- React 18 + Vite 5
- Tailwind CSS
- Recharts (graphiques)
- vite-plugin-pwa (mode hors ligne + installation sur téléphone)
- Déploiement GitHub Pages (via GitHub Actions ou manuellement)

## Installation

```bash
npm install
```

## Lancer en local (développement)

```bash
npm run dev
```

Ouvre ensuite l'URL affichée (généralement `http://localhost:5173`).

## Build de production

```bash
npm run build
```

Le résultat est généré dans le dossier `dist/`.

## Prévisualiser le build

```bash
npm run preview
```

## Déploiement sur GitHub Pages

### Option A — Automatique (recommandé, via GitHub Actions)

1. Crée un dépôt GitHub, par exemple nommé `quran-revision-tracker`.
2. Vérifie que dans `vite.config.js` la constante `REPO_NAME` correspond
   **exactement** au nom de ton dépôt (sinon les fichiers CSS/JS ne se
   chargeront pas sur GitHub Pages).
3. Pousse le code :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<ton-user>/quran-revision-tracker.git
   git push -u origin main
   ```
4. Sur GitHub : **Settings → Pages → Build and deployment → Source**,
   sélectionne **"GitHub Actions"**.
5. Le workflow `.github/workflows/deploy.yml` (déjà inclus) se déclenche
   automatiquement à chaque push sur `main` et déploie le site.
6. Ton app sera disponible à :
   `https://<ton-user>.github.io/quran-revision-tracker/`

### Option B — Manuelle (sans GitHub Actions)

```bash
npm install --save-dev gh-pages
```

Ajoute dans `package.json` (section `scripts`) :

```json
"deploy": "vite build && gh-pages -d dist"
```

Puis :

```bash
npm run deploy
```

Et dans les réglages GitHub Pages du dépôt, choisis la branche `gh-pages`
comme source.

## Installer l'app sur ton téléphone (mode hors ligne)

1. Ouvre l'URL de ton site déployé dans Chrome (Android) ou Safari (iOS).
2. Android/Chrome : menu ⋮ → "Ajouter à l'écran d'accueil" / "Installer l'application".
3. iOS/Safari : bouton Partager → "Sur l'écran d'accueil".
4. Une fois installée, l'app se charge et fonctionne même sans connexion
   internet (utile pendant le voyage au Maroc).

## Structure du projet

```
quran-revision-tracker/
├── public/                  # icônes PWA, favicon
├── src/
│   ├── components/          # Navbar, WeekTable, SummaryCards, RegularityChart, AddHizbModal
│   ├── hooks/                # useLocalStorage
│   ├── utils/                # dateUtils, hizbLogic, storage, stats
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── .github/workflows/deploy.yml
```

## Personnaliser le cycle de départ

Par défaut, la liste des Hizb en rotation est `47` à `60` (14 Hizb),
répartis en deux groupes de 7 :
- Semaine 1 : Hizb 47 à 53
- Semaine 2 : Hizb 54 à 60

Tu peux changer cette liste de départ dans
`src/utils/hizbLogic.js` (`DEFAULT_HIZB_LIST`), ou directement dans
l'application avec le bouton **"+"** pour ajouter un nouveau Hizb — il sera
automatiquement inséré dans l'ordre et le planning se rééquilibrera entre
les deux semaines.

## Notes techniques

- Toutes les données (coches, liste de Hizb, date d'ancrage du cycle) sont
  stockées dans `localStorage`, sous des clés préfixées par `qrt_`.
- Aucun backend, aucune base de données externe : le projet reste 100%
  statique et déployable sur GitHub Pages.
- Pour réinitialiser complètement l'app (par exemple pendant les tests),
  vide le `localStorage` du site dans les outils de développement du
  navigateur.
