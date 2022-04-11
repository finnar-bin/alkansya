import * as fs from 'fs';
import * as path from 'path';
import monthTemplate from '../../database/templates/month.json';

export async function post({ request }) {
    const newEntry = await request.json();
    const date = new Date(newEntry.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const dir = path.normalize(`src/database/${year}`);
    let data = {};

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = `${dir}/${month}.json`;

    // Open the file to edit if it already exists        
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(`${dir}/${month}.json`);
        data = JSON.parse(fileData.toString());
    } else {
        // Template setup for initial file creation
        data = monthTemplate;
    }
    
    data.expenses.push(newEntry);
    data.totalExpenses += newEntry.amount;

    fs.writeFileSync(`${dir}/${month}.json`, JSON.stringify(data));
    
    return {
        status: 200,
        body: {
            success: true
        }
    }
}