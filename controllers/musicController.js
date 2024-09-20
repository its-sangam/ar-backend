import { queryDatabase } from '../utilities/queryDatabase.js';

export async function listMusic(req, res) {
    let { artist_id } = req.query;
    if(!artist_id){
        const {id} = req.user;
        artist_id = id;
    }
    try {
        const result = await queryDatabase(
            'SELECT id, title, album_name, genre FROM music where artist_id = ?' , [artist_id]
        );
        res.status(200).json({ message: 'Music listed successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function getMusicDetails(req, res) {
    const { id } = req.params;

    try {
        const result = await queryDatabase(
            'SELECT id, title, album_name, genre FROM music WHERE id = ?',
            [parseInt(id, 10)]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Music Not Found' });
        }

        const music = result[0];
        res.status(200).json({
            message: 'Music details fetched successfully!',
            data: music
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function store(req, res) {
    const { title, album_name, genre } = req.body;
    const { id: userId } = req.user;
    
    try {
        // Fetch user details and match artist by name and dob
        const userQuery = await queryDatabase(
            'SELECT u.first_name, u.last_name, u.dob, a.id as artist_id FROM user u LEFT JOIN artist a ON a.name = CONCAT(u.first_name, " ", u.last_name) AND a.dob = u.dob WHERE u.id = ?',
            [userId]
        );
        
        const userDetails = userQuery[0];
        
        // Check if artist exists
        if (!userDetails || !userDetails.artist_id) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        
        // Insert music data
        await queryDatabase(
            'INSERT INTO music (artist_id, title, album_name, genre) VALUES (?, ?, ?, ?)',
            [userDetails.artist_id, title, album_name, genre]
        );

        return res.status(201).json({ message: 'Music created successfully' });
    } catch (error) {
        console.error('Error occurred while creating music:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function update(req, res) {
    const { title, album_name, genre } = req.body;
    const { id } = req.params;
    const { id: userId } = req.user;

    try {
        // Fetch user details and artist ID
        const userQuery = await queryDatabase(
            'SELECT u.first_name, u.last_name, u.dob, a.id as artist_id FROM user u LEFT JOIN artist a ON a.name = CONCAT(u.first_name, " ", u.last_name) AND a.dob = u.dob WHERE u.id = ?',
            [userId]
        );
        
        const userDetails = userQuery[0];

        if (!userDetails || !userDetails.artist_id) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        await queryDatabase(
            'UPDATE music SET title = ?, album_name = ?, genre = ? WHERE id = ? AND artist_id = ?',
            [title, album_name, genre, parseInt(id, 10), userDetails.artist_id]
        );

        return res.status(200).json({ message: 'Music updated successfully' });
    } catch (error) {
        console.error('Error updating music:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}


export async function deleteMusic(req, res) {
    const { id } = req.params;
    try {
        const result = await queryDatabase('DELETE FROM music WHERE id = ?', [parseInt(id, 10)]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Music Not Found' });
        }

        res.status(200).json({
            message: 'Music deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
