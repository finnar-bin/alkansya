import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
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
    
    // Add an id to the new entry
    newEntry.id = uuidv4();

    // Update the data object with the new entry
    data.expenses.push(newEntry);
    data.totalExpenses += newEntry.amount;

    fs.writeFileSync(`${dir}/${month}.json`, JSON.stringify(data));
    
    return {
        status: 200,
        body: JSON.stringify({
            success: true
        })
    }
}

export async function get({ url }) {
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');
    const dir = path.normalize(`src/database/${year}/${month}.json`);

    if (year === null || month === null || !fs.existsSync(dir)) {
        return {
            status: 404,
            body: JSON.stringify({
                data: {},
                error: 'Not found',
            })
        }
    }

    const fileData = fs.readFileSync(dir);

    return {
        status: 200,
        body: JSON.stringify({
            data: JSON.parse(fileData.toString()),
        })
    }
}