# T.Ramarozaka Portfolio

Portfolio web de **Tokimahery Ramarozaka** — consultant,doctorant en Informatique, enseignant et développeur basé à Antananarivo, Madagascar.

Projet réalisé dans le cadre de l'examen final du cours **WEB1: Interfaces web** .

**Étudiants :**

- RAFANOMEZANTSOA Ny Fatratra — STD25001
- ANDRIANARIMANANA Isaac Abderman — STD25027

---

## Stack technique

| Couche  | Technologie                                                        |
| ------- | ------------------------------------------------------------------ |
| CSS     | [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/cli` |
|         | + Convention BEM:Block Element Modifier & kebab-case-classes 
| JS      | Vanilla JavaScript (ES Modules)                                    |
| Icônes  | [Font Awesome 6.7.2](https://fontawesome.com/) via CDN             |
| Polices | Playfair Display + DM Sans via Google Fonts                        |

---

## Structure du projet

```
EXAMEN\ WEB1\ FINAL /
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   ├── js/
│   │   │   ├── pages/
│   │   │   ├── navbar.js
│   │   │   ├── cart.js
│   │   │   ├── config.js
│   │   │   └── utils.js
│   │   ├── index.html(entry point)
│   │   ├── courses.html
│   │   ├── blog.html
│   │   ├── testimonials.html
│   │   ├── research.html
│   │   ├── contact.html
│   │   ├── main.js
│   │   ├── style.css
│   │   └── tokimahery.data.js
│   └── src/
│       └── input.css
├── package.json
└── README.md
```

---

## Installation

```bash
git clone https://github.com/fatratra-png/T.Ramarozaka-portfolio.git
cd EXAMEN\ WEB1\ FINAL
npm install
```

### Développement

```bash
npm run build-css
```

Ouvrir `frontend/public/index.html` dans un navigateur ou via Live Server.

---

## Fonctionnalités

- Navbar responsive avec hamburger mobile
- Panier avec popup et toast de confirmation
- Filtres cours (langue, tech, niveau, prix, recherche)
- Blog paginé avec newsletter et notification email simulée
- Easter egg sur la newsletter (je vous laisse chercher)
- Formulaire de contact
- Témoignages
- Liste de publications académiques

---

## Licence

Projet académique — HEI 2025-2026
