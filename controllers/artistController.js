import { queryDatabase } from '../utilities/queryDatabase.js';

export async function listArtists(req, res) {
    try {
        const result = await queryDatabase(
            'SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released FROM artist'
        );
        res.status(200).json({ message: 'Artists listed successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function getArtistDetails(req, res) {
    const { id } = req.params;

    try {
        const artistResult = await queryDatabase(
            'SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released FROM artist WHERE id = ?',
            [parseInt(id, 10)]
        );

        if (artistResult.length === 0) {
            return res.status(404).json({ message: 'Artist Not Found' });
        }

        const artist = artistResult[0];

        const musicResult = await queryDatabase(
            'SELECT title, album_name, genre FROM music WHERE artist_id = ?',
            [parseInt(id, 10)]
        );

        res.status(200).json({
            message: 'Artist details fetched successfully!',
            data: {
                ...artist,
                musics: musicResult
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}


export async function store(req, res) {
    const { name, dob, gender, address, first_release_year, no_of_albums_released, musics } = req.body;

    try {
        const artistInsertResult = await queryDatabase(
            'INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released) VALUES (?, ?, ?, ?, ?, ?)',
            [name, dob, gender, address, first_release_year, no_of_albums_released]
        );

        const artistId = artistInsertResult.insertId;

        if (musics && musics.length > 0) {
            const musicInsertPromises = musics.map(music => {
                return queryDatabase(
                    'INSERT INTO music (artist_id, title, album_name, genre) VALUES (?, ?, ?, ?)',
                    [artistId, music.title, music.album_name, music.genre]
                );
            });

            await Promise.all(musicInsertPromises);
        }

        res.status(201).json({ message: 'Artist and associated music created successfully' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function update(req, res) {
    const { name, dob, gender, address, first_release_year, no_of_albums_released, musics } = req.body;
    const { id } = req.params;

    try {
        await queryDatabase(
            'UPDATE artist SET name = ?, dob = ?, gender = ?, address = ?, first_release_year = ?, no_of_albums_released = ? WHERE id = ?',
            [name, dob, gender, address, first_release_year, no_of_albums_released, parseInt(id, 10)]
        );

        if (musics && musics.length > 0) {
            await queryDatabase('DELETE FROM music WHERE artist_id = ?', [parseInt(id, 10)]);

            const musicInsertPromises = musics.map(music => {
                return queryDatabase(
                    'INSERT INTO music (artist_id, title, album_name, genre) VALUES (?, ?, ?, ?)',
                    [parseInt(id, 10), music.title, music.album_name, music.genre]
                );
            });

            await Promise.all(musicInsertPromises);
        }

        return res.status(200).json({ message: 'Artist and associated music updated successfully' });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}


export async function deleteArtist(req, res) {
    const { id } = req.params;
    try {
        const result = await queryDatabase('DELETE FROM artist WHERE id = ?', [parseInt(id, 10)]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Artist Not Found' });
        }

        res.status(200).json({
            message: 'Artist deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
