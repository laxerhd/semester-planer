import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialisiere die Datendatei, falls sie nicht existiert
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        // Datei existiert nicht, erstelle sie mit Standardwerten
        const initialData = {
            modules: [],
            semesters: [],
            lastUpdated: new Date().toISOString()
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('Neue data.json erstellt');
    }
}

// GET: Daten abrufen
app.get('/api/data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Fehler beim Lesen der Daten:', error);
        res.status(500).json({ error: 'Fehler beim Lesen der Daten' });
    }
});

// POST: Daten speichern
app.post('/api/data', async (req, res) => {
    try {
        const data = {
            ...req.body,
            lastUpdated: new Date().toISOString()
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('Daten gespeichert:', new Date().toLocaleString('de-DE'));
        res.json({ success: true, message: 'Daten erfolgreich gespeichert' });
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
        res.status(500).json({ error: 'Fehler beim Speichern der Daten' });
    }
});

// Server starten
async function startServer() {
    await initializeDataFile();
    app.listen(PORT, () => {
        console.log(`Server läuft auf http://localhost:${PORT}`);
        console.log(`Daten werden in ${DATA_FILE} gespeichert`);
    });
}

startServer();
