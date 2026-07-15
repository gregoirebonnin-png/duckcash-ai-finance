# DuckCash — P&L Tool

Application desktop de suivi financier de projets (P&L), construite avec Electron + React + TypeScript.

![DuckCash Logo](src/renderer/public/duckcash-logo.png)

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
