import { queryDatabase } from "../utilities/queryDatabase.js";

export async function up() {
    try {
        await queryDatabase(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                migration VARCHAR(255) NOT NULL UNIQUE,
                created_at DATETIME DEFAULT NOW()
            );
        `);
        console.log("Migrations table created");
    } catch (error) {
        console.error('Error creating migrations table:', error);
    }
}