# Playwright Test Automation

Ce projet jel-tests-auto contient les tests end-to-end automatisés à l'aide de [Playwright](https://playwright.dev/) pour valider le bon fonctionnement de l'application web.
Le design pattern utilisé est le Page Object Model 👉 [POM Doc](https://playwright.dev/docs/pom)

## Prérequis

- Node.js

## Installation

```
npm install
npx playwright install
```

## 🚀 Exécution des tests

### Tous les tests

```
npx playwright test
```

### Un projet spécifique (navigateur, device, etc.)

```
ENV=develop npx playwright test --project=chromium-poker
ENV=develop npx playwright test --project=chrome-mobile
```

### Un test en particulier

```
ENV=PRE-PROD npx playwright test ./tests/manage-profil/limit.spec.ts --project=chromium

```

### Filtrer les tests (par nom)

```
ENV=PRE-PROD npx playwright test --grep "@smoke" --project=chromium

```

### Mode non-headless (navigateur visible)

```
ENV=PRE-PROD npx playwright test --headed --project=chromium

```

## 📊 Rapport HTML

### Générer le rapport

```
npx playwright test --reporter=html

```

### Ouvrir le rapport dans le navigateur

```
npx playwright show-report

```

## Structure du projet

```
.
├── tests/                     # Dossier contenant les tests .spec.ts
├── playwright.config.ts       # Configuration Playwright
├── data/                      # Les jeux données statics
├── pages/                     # Le découpage en class des pages (design pattern POM)
├── utils/                     # Les fonctions communes sur l'ensemble des domaines fonctionnels
├── node_modules/
├── package.json
└── README.md
```

