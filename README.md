# TUM Master Credit Tracker

Ein Webtool zur Verwaltung und Planung von Master-Modulen an der TUM (Technische Universität München).

## Features

- ✅ Module hinzufügen und verwalten
- ✅ Semester organisieren
- ✅ Fortschrittsübersicht mit Kreditpunkten
- ✅ Automatische Spezialisierungserkennung
- ✅ **Automatisches Speichern im Browser (LocalStorage)**
- ✅ Export/Import von Daten als JSON

## Installation

```bash
npm install
```

## Verwendung

### Starten der Anwendung

```bash
npm run dev
```

Dann öffnen Sie: http://localhost:5173

## Datenspeicherung

Die Anwendung speichert Daten automatisch im Browser-LocalStorage:

- **Automatisches Speichern**: Alle Änderungen werden sofort lokal gespeichert
- **Export/Import**: Über die Buttons im Header können Sie Ihre Daten als JSON-Datei exportieren oder importieren

### Export-Datenstruktur

Wenn Sie Ihre Daten exportieren, wird folgende JSON-Struktur erstellt:

```json
{
  "modules": [
    {
      "id": "...",
      "name": "Modulname",
      "credits": 5,
      "area": "Bereich",
      "semester": "WS 2024/25",
      "isTheoretical": false,
      "customCategory": "Informatik Wahlmodule",
      "customInformaticsArea": "Machine Learning and Analytics"
    }
  ],
  "semesters": ["WS 2024/25", "SS 2025"],
  "exportDate": "2025-10-09T..."
}
```

## Build

```bash
npm run build
```

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

The project is configured with GitHub Actions for automatic deployment. Every push to the `main` branch will automatically build and deploy to GitHub Pages.

**Setup Steps:**

1. Go to your GitHub repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
4. Push to the `main` branch - the site will deploy automatically!

The site will be available at: `https://laxerhd.github.io/master-planer/`

### Manual Deployment

Alternatively, you can deploy manually:

```bash
npm install gh-pages --save-dev
npm run deploy
```

This will build and deploy to the `gh-pages` branch.

## Technologie-Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Datenspeicherung**: Browser LocalStorage
- **Deployment**: GitHub Pages + GitHub Actions
