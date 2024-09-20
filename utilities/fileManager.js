import { Parser } from 'json2csv';
import csv from 'csv-parser';
import { createReadStream, unlink } from 'fs';

export async function exportToCSV(data, fields) {
    try {
        const csvFields = fields.map(field => field.label);
        
        const csvData = data.map(item => {
            return fields.reduce((acc, field) => {
                acc[field.label] = item[field.value];
                return acc;
            }, {});
        });

        const json2csvParser = new Parser({ fields: csvFields });
        const csv = json2csvParser.parse(csvData);
        console.log(csv);
        return csv;
    } catch (error) {
        console.error('Error generating CSV:', error);
        throw new Error('Error generating CSV');
    }
}



export async function importFromCSV(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => data.push(row))
            .on('end', () => resolve(data))
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                reject(new Error('Error reading CSV file'));
            });
    });
}

export function deleteFile(filePath) {
    unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        }
    });
}