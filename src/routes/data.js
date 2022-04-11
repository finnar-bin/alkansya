import * as fs from 'fs';
import * as path from 'path';

export async function post({ request }) {
    console.log(request);

    const file = path.resolve('src/data', '2022.json');

    fs.writeFile(file, 'test', err => {
        if (err) throw err;
        console.log('File written!');
    });

    return {
        status: 200
    }
}