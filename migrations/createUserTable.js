import { queryDatabase } from "../utilities/queryDatabase.js";

export async function up() {
    try {
        await queryDatabase(`
            CREATE TABLE IF NOT EXISTS user (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(500) NOT NULL,
                phone VARCHAR(20) NOT NULL UNIQUE,
                dob DATETIME,
                gender ENUM('m','f','o'),
                role ENUM('super_admin','artist_manager','artist'),
                address VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log("User table created");
    } catch (error) {
        console.error('Error creating user table:', error);
    }
}