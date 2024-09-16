import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir).sort();
const pool = (await import('./config/db.js')).default;

async function migrationsTableExists() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            "SHOW TABLES LIKE 'migrations'"
        );
        return rows.length > 0;
    } finally {
        connection.release();
    }
}

async function migrationExists(migration) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT 1 FROM migrations WHERE migration = ?', [migration]);
        return rows.length > 0;
    } finally {
        connection.release();
    }
}

async function recordMigration(migration) {
    const connection = await pool.getConnection();
    try {
        await connection.query('INSERT INTO migrations (migration) VALUES (?)', [migration]);
    } finally {
        connection.release();
    }
}

async function runMigration(file) {
    const { up } = await import(path.join(migrationsDir, file));
    await up();
    await recordMigration(file);
}

async function migrate() {
    console.log('Running migrations...');

    const tableExists = await migrationsTableExists();

    if (!tableExists) {
        console.log('Migrations table does not exist. Creating it...');
        const createTableMigration = 'createMigrationsTable.js';
        await runMigration(createTableMigration);
    }

    for (const file of migrationFiles) {
        if (file === 'createMigrationsTable.js') {
            continue;
        }
        if (await migrationExists(file)) {
            console.log(`Skipping ${file} as it has already been run`);
        } else {
            await runMigration(file);
            console.log(`Applied ${file}`);
        }
    }

    console.log('Migrations completed.');
    process.exit(0);
}

migrate().catch((err) => {
    console.error('Error running migrations:', err);
    process.exit(1);
});