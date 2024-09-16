import pool from "../config/db.js";

export async function queryDatabase(sql, params) {
    try {
        const [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
}
