# DuckCash — P&L Tool

🇫🇷 [Français](#français) · 🇬🇧 [English](#english)

---

<a name="français"></a>
## 🇫🇷 Français

Application desktop de suivi financier de projets (P&L), construite avec Electron + React + TypeScript.

![DuckCash Logo](https://raw.githubusercontent.com/gregoirebonnin-png/duckcash-ai-finance/main/src/renderer/public/duckcash-logo.svg)

## Fonctionnalités

- Gestion de projets avec suivi des revenus, coûts et marges
- Affectation et suivi des ressources par projet
- Tableau de bord avec indicateurs financiers
- Synchronisation avec Supabase (base de données cloud)
- Fonctionne hors ligne avec cache local

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) (inclus avec Node.js)

---

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/gregoirebonnin-png/duckcash-ai-finance.git
cd duckcash-ai-finance

# 2. Installer les dépendances
npm install
```

---

## Configuration

Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` :

```bash
cp .env.example .env
```

Renseignez vos clés Supabase dans le fichier `.env` :

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon
```

> Sans ces clés, l'application fonctionne quand même en mode local (données stockées uniquement sur votre machine).

---

## Lancer l'application en développement

```bash
npm run dev
```

L'application Electron s'ouvre automatiquement.

---

## Compiler l'application

Pour générer un fichier `.dmg` installable sur macOS :

```bash
npm run build:mac
```

Le fichier compilé se trouve dans le dossier `dist/`.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| [Electron](https://www.electronjs.org/) | Application desktop |
| [React 18](https://react.dev/) | Interface utilisateur |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique |
| [Vite](https://vitejs.dev/) | Bundler |
| [Tailwind CSS](https://tailwindcss.com/) | Styles |
| [Zustand](https://zustand-demo.pmnd.rs/) | Gestion d'état |
| [Supabase](https://supabase.com/) | Base de données cloud |
| [Recharts](https://recharts.org/) | Graphiques |

---

<a name="english"></a>
## 🇬🇧 English

A desktop application for project P&L tracking, built with Electron + React + TypeScript.

![DuckCash Logo](https://raw.githubusercontent.com/gregoirebonnin-png/duckcash-ai-finance/main/src/renderer/public/duckcash-logo.svg)

### Features

- Project management with revenue, cost and margin tracking
- Resource assignment and tracking per project
- Financial dashboard with key indicators
- Supabase synchronization (cloud database)
- Works offline with local cache

---

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) (bundled with Node.js)

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gregoirebonnin-png/duckcash-ai-finance.git
cd duckcash-ai-finance

# 2. Install dependencies
npm install
```

---

### Configuration

Create a `.env` file at the root of the project based on `.env.example`:

```bash
cp .env.example .env
```

Fill in your Supabase keys in the `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> Without these keys, the app still works in local mode (data stored only on your machine).

---

### Run in development

```bash
npm run dev
```

The Electron app opens automatically.

---

### Build the app

To generate an installable `.dmg` file on macOS:

```bash
npm run build:mac
```

The compiled file is located in the `dist/` folder.

---

### Tech stack

| Technology | Role |
|---|---|
| [Electron](https://www.electronjs.org/) | Desktop application |
| [React 18](https://react.dev/) | User interface |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Vite](https://vitejs.dev/) | Bundler |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management |
| [Supabase](https://supabase.com/) | Cloud database |
| [Recharts](https://recharts.org/) | Charts |
