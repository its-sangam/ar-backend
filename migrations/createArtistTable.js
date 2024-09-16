import { queryDatabase } from "../utilities/queryDatabase.js";

export async function up() {
    try {
        await queryDatabase(`
            CREATE TABLE IF NOT EXISTS artist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                dob DATETIME,
                gender ENUM('m','f','o'),
                address VARCHAR(255),
                first_release_year YEAR,
                no_of_albums_released INT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log("Artist table created");
    } catch (error) {
        console.error('Error creating artist table:', error);
    }
}