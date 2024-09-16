import { queryDatabase } from "../utilities/queryDatabase.js";

export async function up() {
    try {
        await queryDatabase(`
            CREATE TABLE IF NOT EXISTS music (
                artist_id INT,
                title VARCHAR(255) NOT NULL,
                album_name VARCHAR(255) NOT NULL,
                genre ENUM('rnb','country','classic','rock','jazz'),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (artist_id) REFERENCES artist(id)
            );
        `);
        console.log("Music table created");
    } catch (error) {
        console.error('Error creating music table:', error);
    }
}