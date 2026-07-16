import { Low, JSONFile } from 'lowdb';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', process.env.DB_PATH || 'db.json');

const defaultData = { tasks: [] };
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, defaultData);

export async function initializeDatabase() {
  try {
    await db.read();
    // Ensure data structure exists
    if (!db.data || typeof db.data !== 'object') {
      db.data = defaultData;
    }
    if (!db.data.tasks) {
      db.data.tasks = [];
    }
    await db.write();
  } catch (error) {
    throw new Error(`Failed to initialize database: ${error.message}`);
  }
}

export function getDatabase() {
  return db;
}
