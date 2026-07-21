const XLSX = require('xlsx');

const filePath = '/Users/abhishek/development/RFID-Admin-App/super-admin/src/super-admin-landing-page/assets/cropped_new updated sheet by sakshi.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // sheet_to_json without header specified skips empty rows by default
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log('--- KEYS ---');
    if (data.length > 0) {
        console.log(Object.keys(data[0]));
        console.log('--- FIRST ITEM ---');
        console.log(JSON.stringify(data[0], null, 2));
    }
} catch (error) {
    console.error('Error reading excel:', error.message);
}
