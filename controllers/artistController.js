import { deleteFile, exportToCSV, importFromCSV } from '../utilities/fileManager.js';
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

export async function exportArtists(req, res) {
    try {
        const artists = await queryDatabase('SELECT name, dob, gender, address, first_release_year, no_of_albums_released FROM artist');

        const fields = [
            { label: 'Name', value: 'name' },
            { label: 'Date of Birth', value: 'dob' },
            { label: 'Gender', value: 'gender' },
            { label: 'Address', value: 'address' },
            { label: 'First Release Year', value: 'first_release_year' },
            { label: 'No of Albums Released', value: 'no_of_albums_released' }
        ];

        const formattedArtists = artists.map((item) => ({
            name: item.name,
            address: item.address || '-',
            dob: item.dob ? new Date(item.dob).toISOString().split("T")[0] : '-',
            gender: item.gender === 'm' ? 'Male' : item.gender === 'f' ? 'Female' : 'Other',
            first_release_year: item.first_release_year || '-',
            no_of_albums_released: item.no_of_albums_released || 0,
        }));

        const csv = await exportToCSV(formattedArtists, fields);

        res.status(200).send({
            records:csv
        });
    } catch (error) {
        console.error('Error exporting artists:', error);
        res.status(500).json({ message: 'Error exporting artists' });
    }
}

export const importArtists = async (req, res) => {
    const filePath = req.file.path;

    try {
        const artists = await importFromCSV(filePath);

        for (const artist of artists) {
            const name = artist['Name'];
            const dob = artist['Date of Birth'];
            const gender = artist['Gender'] === 'Male' ? 'm' : artist['Gender'] === 'Female' ? 'f' : 'o' ;
            const address = artist['Address'];
            const firstReleaseYear = artist['First Release Year'];
            const noOfAlbumsReleased = artist['No of Albums Released'];

            await queryDatabase('INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released) VALUES (?, ?, ?, ?, ?, ?)', 
                [name, dob, gender, address, firstReleaseYear, noOfAlbumsReleased]
            );
        }
        deleteFile(filePath);
        return res.status(200).json({ message: 'Artists imported successfully!' });
    } catch (error) {
        console.error('Error importing artists:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};