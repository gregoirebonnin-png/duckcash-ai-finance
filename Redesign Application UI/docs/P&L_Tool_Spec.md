# P&L Tool — Spécification complète de l'interface

> Document de référence pour Claude Code. Décrit l'intégralité des pages, données, typographie, couleurs, images et comportements interactifs de l'application.

---

## 1. Stack & architecture

| Élément | Valeur |
|---|---|
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS v4 + variables CSS custom |
| Charts | Recharts (`BarChart`, `PieChart`) |
| Icônes | Lucide React |
| Animations | Transitions CSS natives (pas de Framer Motion) |
| Font principale | **Plus Jakarta Sans** (400, 500, 600, 700, 800) — Google Fonts |
| Font monospace | **JetBrains Mono** (400, 500, 600) — Google Fonts — utilisée pour les montants financiers |

L'application est une **Single Page App** avec navigation par état React (`useState<Page>`). Pas de router. Les 4 pages sont : `dashboard`, `projets`, `categories`, `ressources`.

---

## 2. Palette de couleurs

### Tokens CSS (définis dans `src/styles/theme.css`)

```
--background:       #070a0d   (fond global, noir très sombre teinté bleu-gris froid)
--foreground:       #edf2f7   (texte principal)
--card:             #0c1014   (fond des cartes et panneaux)
--card-foreground:  #edf2f7
--primary:          #00d9ff   (cyan électrique — couleur interactive principale)
--primary-foreground: #040d10 (texte foncé sur fond cyan)
--muted:            #111820   (surfaces atténuées)
--muted-foreground: #546070   (labels, captions, textes secondaires)
--border:           rgba(255,255,255,0.07)
--destructive:      #ff4757
```

### Couleurs d'accent utilisées en dur (non tokenisées)

| Rôle | Valeur hex |
|---|---|
| Cyan électrique (primary) | `#00d9ff` |
| Teal (variante primary) | `#00b4d8` |
| Coral/rouge (coûts, négatif) | `#ff4757` |
| Vert néon (résultat positif) | `#00e676` |
| Vert menthe | `#26de81` |
| Ambre chaud | `#ff9500` |
| Orange | `#fd9644` |
| Jaune électrique | `#ffd600` |
| Rose saumon | `#ff6b81` |

### Palette du graphique Donut (Répartition des coûts)

| Catégorie | Couleur |
|---|---|
| Conseil & Expertise | `#00d9ff` |
| Développement | `#ff9500` |
| Lieu | `#ffd600` |
| Technique | `#00e676` |
| Catering | `#ff4757` |
| Formation | `#26de81` |
| Speakers | `#fd9644` |
| Production | `#00b4d8` |
| Communication | `#ff6b81` |

---

## 3. Navigation globale — `TopNav`

Barre fixe en haut de l'écran (`position: fixed`, `z-index: 50`), divisée en 3 zones :

### Zone gauche — Logo
- Icône `TrendingUp` (Lucide) dans un carré `32×32px`, `border-radius: 12px`, fond `#00d9ff`, box-shadow `0 0 16px rgba(0,217,255,0.45)`
- Texte **"P&L Tool"** — `font-weight: 700`, `font-size: 14px`
- Badge **"DEMO"** — `9px`, `font-weight: 700`, `letter-spacing: wider`, fond `rgba(0,217,255,0.12)`, bordure `rgba(0,217,255,0.2)`, texte `#00d9ff`, `border-radius: full`

### Zone centrale — Pill nav (verre fumé)
Conteneur pill avec :
- `background: rgba(12,16,20,0.70)`
- `backdrop-filter: blur(20px)`
- `border: 1px solid rgba(255,255,255,0.08)`
- `box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`
- `border-radius: 16px`
- `padding: 8px`

4 boutons de navigation : **Dashboard** (`LayoutDashboard`), **Projets** (`FolderOpen`), **Catégories** (`Tag`), **Ressources** (`Users`)

**État actif :**
- `background: rgba(0,217,255,0.15)`
- `color: #00d9ff`
- `box-shadow: inset 0 0 0 1px rgba(0,217,255,0.25)`
- icône `strokeWidth: 2.5`

**État inactif :** `color: muted-foreground`, `strokeWidth: 2`

### Zone droite — Utilisateur
- Avatar rond `32×32px`, gradient `linear-gradient(135deg, #00d9ff, #00b4d8)`, texte foncé `#040d10`, `box-shadow: 0 0 16px rgba(0,217,255,0.3)`
- Initiale : **"G"**
- Nom : **Grégoire Bonnin** (`font-size: 14px`, `font-weight: 600`)
- Sous-titre : **Mode démo** (`font-size: 12px`, `color: muted-foreground`)

### Comportement scroll
- **Au repos (scrollTop ≤ 10px)** : header totalement transparent, aucun fond
- **Scrollé (scrollTop > 10px)** : transition `300ms` vers :
  - `background: rgba(7,10,13,0.80)`
  - `backdrop-filter: blur(24px)`
  - `border-bottom: 1px solid rgba(255,255,255,0.06)`
  - `box-shadow: 0 4px 32px rgba(0,0,0,0.5)`

Le scroll est écouté sur l'élément `<main>` (ref React), pas sur `window`.

---

## 4. Fonction `glow` — effet halo hover (partagé)

```ts
function glow(color: string) {
  return {
    onMouseEnter: (e) => {
      e.currentTarget.style.boxShadow =
        `0 0 0 1px ${color}30, 0 8px 32px ${color}25, 0 0 60px ${color}12`;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.boxShadow = "";
    },
  };
}
```

Spread sur chaque carte via `{...glow(couleur)}`. La couleur varie par carte (voir chaque section). Transition via `transition-all duration-300` sur le conteneur.

---

## 5. Page — Dashboard

**Route/état :** `page === "dashboard"`  
**Layout :** colonne unique, `padding: 32px`, `gap: 28px`

### 5.1 En-tête de page
- `<h1>` **Dashboard** — `font-size: 24px`, `font-weight: 800`, `letter-spacing: tight`
- `<p>` **Mode démo — données fictives** — `font-size: 14px`, `color: muted-foreground`

### 5.2 KPI Cards (grille 4 colonnes, gap 16px)

Composant `KpiCard` avec props : `label`, `value`, `sub`, `glowColor`, `up`, `trend`

Structure de la carte :
- `border-radius: 16px`, `border: 1px solid border`, `background: card`, `padding: 20px`
- Blob décoratif absolu : cercle `160×160px` en haut à droite, `blur: 40px`, `opacity: 0.25`, couleur = `glowColor`
- Label : `11px`, `font-weight: 600`, `uppercase`, `letter-spacing: 0.12em`, `color: muted-foreground`
- Valeur : `24px`, `font-weight: 800`, `letter-spacing: tight`
- Sous-valeur : `12px`, `color: muted-foreground`
- Badge tendance : `12px`, `font-weight: 600`, `border-radius: full`, `padding: 2px 10px`
  - Positif (`up: true`) : `background: rgba(0,230,118,0.12)`, `color: #00e676`, préfixe `▲`
  - Négatif (`up: false`) : `background: rgba(255,71,87,0.12)`, `color: #ff4757`, préfixe `▼`

**Données et couleurs :**

| Label | Valeur | Sous-valeur | glowColor | up | trend |
|---|---|---|---|---|---|
| Revenus | 271,9k € | 271 900 € | `#00d9ff` | true | 12% |
| Coûts | 211,9k € | 211 950 € | `#ff4757` | false | 8% |
| Résultat net | 60,0k € | 59 950 € | `#00e676` | true | 15% |
| Marge | +22.0% | sur les revenus | `#ffd600` | true | 3% |

**Hover :** `glow(glowColor)` — halo coloré correspondant à chaque carte + `border: rgba(255,255,255,0.15)`

### 5.3 Graphique Barres — "Revenus vs Coûts par projet"

Carte : `border-radius: 16px`, `background: card`, `border`, `padding: 24px`  
**Hover :** `glow("#00d9ff")`

Librairie : `recharts` — `BarChart` avec `ResponsiveContainer` (100% × 210px)

Configuration :
- `barGap: 8`, `barCategoryGap: "35%"`
- `XAxis` / `YAxis` : `fill: #546070`, `fontSize: 11`, pas de ligne d'axe ni tick
- `YAxis tickFormatter` : valeur en `k` (ex: `115k`)
- Barre **Revenus** : `fill: #00d9ff`, `radius: [6,6,0,0]`
- Barre **Coûts** : `fill: #ff4757`, `radius: [6,6,0,0]`
- Tooltip custom (`ChartTooltip`) : fond `card`, bordure `border`, `border-radius: 12px`
- Légende manuelle sous le graphique (points colorés + labels)

**Données :**
```
LPC Paris 2026         : revenus 158 500 €, coûts 115 000 €
Mission Transform.     : revenus 113 400 €, coûts 96 950 €
```

### 5.4 Graphique Donut — "Répartition des coûts"

Carte : `border-radius: 16px`, `background: card`, `border`, `padding: 24px`  
**Hover :** `glow("#ff9500")`

`PieChart` 140×140px, `cx/cy: 70`, `innerRadius: 42`, `outerRadius: 66`, `stroke: none`

Légende à droite : liste `11px` avec point coloré, nom tronqué (muted) + pourcentage (foreground, `font-weight: 600`)

Voir palette section 2 pour les 9 couleurs.

### 5.5 Projets récents

Carte : `border-radius: 16px`, `background: card`, `border`, `padding: 24px`  
**Hover carte :** `glow("#00e676")`

En-tête : titre **Projets récents** + lien **Voir tout** (`color: #00d9ff`, `ArrowRight 12px`)

Chaque ligne de projet :
- `padding: 14px`, `border-radius: 12px`
- **Hover ligne :** `background: rgba(255,255,255,0.04)` + `ChevronRight` passe de `muted-foreground` à `foreground`
- Vignette `48×48px`, `border-radius: 12px`, image Unsplash recadrée
- Nom (`14px`, `font-weight: 600`) + description (`12px`, `muted-foreground`)
- Revenus (`14px`, `font-weight: 700`) + résultat (`12px`, `color: #00e676`)
- Badge type (voir couleurs ci-dessous)
- `ChevronRight` 15px

**Badges type projet :**
- Événement : fond `rgba(0,217,255,0.12)`, texte `#00d9ff`, bordure `rgba(0,217,255,0.2)`
- Projet : fond `rgba(255,149,0,0.12)`, texte `#ff9500`, bordure `rgba(255,149,0,0.2)`

---

## 6. Page — Projets

**Route/état :** `page === "projets"`  
**Layout :** colonne, `padding: 32px`, `gap: 32px`

### 6.1 En-tête
- `<h1>` **Projets** + `<p>` **2 projets actifs**
- Bouton **"+ Nouveau projet"** : `border-radius: full`, fond `#00d9ff`, texte `#040d10`, `font-weight: 700`, `box-shadow: 0 0 20px rgba(0,217,255,0.3)`, `active:scale-[0.98]`

### 6.2 Bannière hero (illustration)

Hauteur `192px`, `border-radius: 16px`, `overflow: hidden`  
Image Unsplash : `https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1400&h=400&fit=crop&auto=format`  
Overlay : `gradient-to-r from-background via-background/70 to-transparent`  
Texte superposé gauche :
- **"Gérez vos projets"** — `24px`, `font-weight: 800`
- **"Suivez revenus, coûts et résultats pour chaque projet en temps réel."** — `14px`, `muted-foreground`, max-width 320px

### 6.3 Grille de cartes projet (2 colonnes, gap 24px)

**Hover carte :** `glow("#00d9ff")`

Chaque carte :
- `border-radius: 16px`, `overflow: hidden`, `background: card`, `border`
- **Image cover** `192px` de haut :
  - `object-fit: cover`
  - **Hover image** : `scale(1.04)`, `transition: 500ms`
  - Overlay gradient : `from-card/90 via-card/20 to-transparent` (bas vers haut)
  - Overlay haut : badge type + boutons Éditer/Supprimer
    - Badge : `backdrop-blur-sm`, fond semi-transparent (cyan pour Événement, ambre pour Projet)
    - Boutons icônes : `28×28px`, ronds, fond `rgba(0,0,0,0.3)`, `backdrop-blur-sm`, `Pencil`/`Trash2` 11px blancs
- **Contenu** (`padding: 20px`) :
  - Titre `16px`, `font-weight: 700`
  - Description `14px`, `muted-foreground`
  - Pied de carte :
    - Label **EUR** (`10px`, uppercase, muted) + montant (`16px`, `font-weight: 800`) + résultat (`14px`, `color: #00e676`)
    - Bouton **"Voir →"** : texte `#00d9ff`, `font-weight: 700`, `gap` s'agrandit au hover (`hover:gap-3`, `transition: 200ms`)

**Données projets :**

| Champ | Projet 1 | Projet 2 |
|---|---|---|
| Nom | LPC Paris 2026 | Mission Transformation Digitale |
| Description | Conférence technologique annuelle — 1300 participants | Accompagnement transformation digitale — Groupe Leclerc |
| Type | Événement | Projet |
| Revenus | 158,5k € | 113,4k € |
| Résultat | +43,5k € | +16,4k € |
| Image | `photo-1540575467063-178a50c2df87` (Unsplash) | `photo-1451187580459-43490279c0fa` (Unsplash) |

---

## 7. Page — Catégories

**Route/état :** `page === "categories"`  
**Layout :** colonne, `padding: 32px`, `gap: 32px`

### 7.1 En-tête
- `<h1>` **Catégories** + `<p>` **Vue globale des catégories de tous vos projets**
- Bouton **"+ Nouvelle catégorie"** : même style que les autres pages (cyan, pill, glow)

### 7.2 Bannière illustration

Hauteur `144px`, `border-radius: 16px`  
Image Unsplash : `https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&h=300&fit=crop&auto=format`, `opacity: 0.40`  
Overlay : `linear-gradient(135deg, rgba(7,10,13,0.95) 0%, rgba(7,10,13,0.6) 60%, rgba(0,217,255,0.1) 100%)`

Contenu superposé :
- Texte : **"9 coûts · 5 revenus"** — `9` en `#ff4757`, `5` en `#00e676`, `18px`, `font-weight: 700`
- Sous-texte : **"Organisez vos flux financiers par catégorie"** — `12px`, `muted-foreground`
- Mini donut (droite, `opacity: 0.70`) : `PieChart` 80×80px, `innerRadius: 22`, `outerRadius: 36`, 5 premières catégories du donut

### 7.3 Section Coûts (9 éléments)

Bullet indicateur rouge (`#ff4757`) + label **"COÛTS (9)"** en `11px`, uppercase, `letter-spacing: 0.15em`  
Grille 3 colonnes, gap 12px

**Hover carte :** `glow(color)` — chaque carte glows avec sa propre couleur

Composant `CatCard` :
- `border-radius: 16px`, `border`, `background: card`, `padding: 16px`
- Icône `44×44px`, `border-radius: 12px`, fond `${color}20`, `box-shadow: 0 0 18px ${color}25`
- Nom `14px`, `font-weight: 600`
- Projet `12px`, `muted-foreground`
- Boutons éditer/supprimer : `opacity: 0` → `opacity: 1` au hover du groupe (transition)

**Données — Coûts :**

| Nom | Projet | Couleur | Icône |
|---|---|---|---|
| Production | LPC Paris 2026 | `#ff4757` | ⚙️ |
| Technique | LPC Paris 2026 | `#00d9ff` | 🔧 |
| Lieu | LPC Paris 2026 | `#ffd600` | 📍 |
| Catering | LPC Paris 2026 | `#ff9500` | 🍽️ |
| Speakers | LPC Paris 2026 | `#00e676` | 🎤 |
| Communication | LPC Paris 2026 | `#fd9644` | 📢 |
| Formation | Mission Transformation Digitale | `#26de81` | 📚 |
| Conseil & Expertise | Mission Transformation Digitale | `#00b4d8` | 💼 |
| Développement | Mission Transformation Digitale | `#ff6b81` | 💻 |

### 7.4 Section Revenus (5 éléments)

Bullet indicateur vert (`#00e676`) + label **"REVENUS (5)"**  
Même grille 3 colonnes

**Données — Revenus :**

| Nom | Projet | Couleur | Icône |
|---|---|---|---|
| Billets | LPC Paris 2026 | `#00d9ff` | 🎫 |
| Sponsoring | LPC Paris 2026 | `#ffd600` | 🤝 |
| Partenariats | LPC Paris 2026 | `#00e676` | 🌟 |
| Honoraires | Mission Transformation Digitale | `#ff9500` | 💰 |
| Licences & Outils | Mission Transformation Digitale | `#fd9644` | 🔑 |

---

## 8. Page — Ressources

**Route/état :** `page === "ressources"`  
**Layout :** colonne, `padding: 32px`, `gap: 32px`

### 8.1 En-tête
- `<h1>` **Ressources** + `<p>` **Vue globale de toutes les ressources**
- Bouton **"+ Ajouter une ressource"** : style cyan pill standard

### 8.2 Tableau des ressources

Conteneur : `border-radius: 16px`, `overflow: hidden`, `background: card`, `border`

**En-tête tableau :**
- Grille `grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr]`, `padding: 14px 24px`
- Fond `muted/30`, séparateur bas
- Labels : **Nom, Projet, TJM, Jours, Coût total** — `10px`, `font-weight: 700`, uppercase, `letter-spacing: 0.15em`, `color: muted-foreground`

**Lignes :**
- Même grille, `padding: 16px 24px`
- Séparateur `border-b border-border` entre chaque ligne (sauf la dernière)
- **Hover ligne :** `background: rgba(255,255,255,0.03)` + `glow(couleur avatar)` + apparition boutons éditer/supprimer (`opacity: 0 → 1`)
- Avatar rond `36×36px` avec initiales (prénom[0]+nom[0]) et gradient par index :
  - Index 0 (Sophie M.) : `linear-gradient(135deg, #00d9ff, #00b4d8)`, texte `#040d10`
  - Index 1 (Antoine L.) : `linear-gradient(135deg, #ff9500, #ff6b35)`, texte `#040d10`
  - Index 2 (Camille R.) : `linear-gradient(135deg, #00e676, #26de81)`, texte `#040d10`
- Nom `14px`, `font-weight: 600` + rôle `12px`, `muted-foreground`
- TJM et Jours : `font-family: JetBrains Mono`, `14px`
- Coût total : `font-family: JetBrains Mono`, `14px`, `font-weight: 700`, `color: #ff4757`
- Boutons éditer/supprimer : ronds `28×28px`, `opacity: 0` → `opacity: 1` au hover du groupe

**Données ressources :**

| Nom | Rôle | Projet | TJM | Jours | Total |
|---|---|---|---|---|---|
| Sophie Marchand | Directrice de production | LPC Paris 2026 | 750 € | 15j | 11 250 € |
| Antoine Leroux | Chef de projet événementiel | LPC Paris 2026 | 650 € | 20j | 13 000 € |
| Camille Rousseau | Communication & Marketing | LPC Paris 2026 | 550 € | 10j | 5 500 € |

**Pied de tableau (total) :**
- Fond `muted/30`, séparateur haut
- Label **"Coût total toutes ressources"** (muted) + montant **29 750 €** (`16px`, `font-weight: 800`, `color: #ff4757`, `font-family: JetBrains Mono`)

### 8.3 Bannière illustration équipe

Hauteur `176px`, `border-radius: 16px`  
Image Unsplash : `https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=360&fit=crop&auto=format`  
Overlay : `gradient-to-r from-background/95 via-background/70 to-transparent`  
Contenu gauche :
- **"Votre équipe, au complet"** — `20px`, `font-weight: 800`
- **"Suivez les TJM, jours alloués et coûts de chaque ressource en temps réel."** — `14px`, `muted-foreground`, max-width 320px

Bouton droite **"Voir le rapport ↗"** : pill, `border: border`, `font-weight: 600`, `hover:bg-white/5`

---

## 9. Récapitulatif des interactions hover par élément

| Élément | Interaction hover |
|---|---|
| **KPI cards** | `glow(glowColor)` — halo coloré unique par carte + bordure `white/15` |
| **Graphique barres** | `glow("#00d9ff")` — halo cyan |
| **Graphique donut** | `glow("#ff9500")` — halo ambre |
| **Carte Projets récents** | `glow("#00e676")` — halo vert |
| **Ligne projet récent** | fond `rgba(255,255,255,0.04)` + `ChevronRight` devient `foreground` |
| **Cartes projet (page Projets)** | `glow("#00d9ff")` + image `scale(1.04)` |
| **Bouton "Voir →"** | gap s'agrandit de `6px` à `12px` (`transition: 200ms`) |
| **Boutons éditer/supprimer overlay image** | fond `rgba(0,0,0,0.3)` → `rgba(0,0,0,0.5)` |
| **Cartes catégorie** | `glow(color)` — halo couleur propre à chaque catégorie |
| **Boutons éditer/supprimer catégorie** | `opacity: 0 → 1` (groupe parent hover) |
| **Lignes tableau ressources** | fond `rgba(255,255,255,0.03)` + `glow(couleurAvatar)` + boutons `opacity: 0 → 1` |
| **Bouton "Voir le rapport"** | fond `rgba(255,255,255,0.05)` |
| **Boutons pill CTA** | `active:scale-[0.98]` |

---

## 10. Comportements de scroll

| Comportement | Déclencheur | Effet |
|---|---|---|
| **Header transparent → verre fumé** | `main.scrollTop > 10px` | `background: rgba(7,10,13,0.80)`, `backdrop-filter: blur(24px)`, `border-bottom`, `box-shadow` — `transition: 300ms` |
| **Scrollbar cachée** | Toujours | `scrollbarWidth: none` sur `<main>` |
| **Scrolling zone** | `<main>` (pas `window`) | `height: 100vh`, `overflow-y: auto`, `ref` React |

---

## 11. Images Unsplash utilisées

| Page | Description | URL |
|---|---|---|
| Dashboard — Projets récents (vignette 1) | Conférence tech / événement | `photo-1540575467063-178a50c2df87?w=800&h=320&fit=crop` |
| Dashboard — Projets récents (vignette 2) | Transformation digitale / planète tech | `photo-1451187580459-43490279c0fa?w=800&h=320&fit=crop` |
| Projets — Bannière hero | Équipe en réunion créative | `photo-1559136555-9303baea8ebd?w=1400&h=400&fit=crop` |
| Projets — Card 1 | Conférence / événement grande salle | `photo-1540575467063-178a50c2df87?w=800&h=320&fit=crop` |
| Projets — Card 2 | Planète / data / digital | `photo-1451187580459-43490279c0fa?w=800&h=320&fit=crop` |
| Catégories — Bannière | Abstrait / finance | `photo-1611532736597-de2d4265fba3?w=1400&h=300&fit=crop` |
| Ressources — Bannière | Équipe au travail | `photo-1552664730-d307ca884978?w=1400&h=360&fit=crop` |

Toutes les images utilisent `?auto=format` et `fit=crop` pour l'optimisation Unsplash.

---

## 12. Structure des fichiers modifiés

```
src/
├── app/
│   └── App.tsx          ← composant unique, toutes les pages
├── styles/
│   ├── fonts.css        ← @import Google Fonts (Plus Jakarta Sans + JetBrains Mono)
│   ├── theme.css        ← tokens CSS + .dark + @theme inline Tailwind
│   └── index.css        ← imports fonts.css + theme.css + @tailwind
```

Pas de composants séparés, pas de router, pas de state management externe.
