import * as fs from 'fs';

export async function get() {
    const dir = 'src/database';
    let data = {};

    try {
        const years = fs.readdirSync(dir);

        // Remove the templates folder
        years.splice(years.indexOf('templates'));

        years.forEach(year => {
            data[year] = [];

            // Get all the months in saved in that year
            try {
                let months = fs.readdirSync(`${dir}/${year}`);

                // Remove .json
                months = months.map(month => month.replace('.json', ''));

                data[year].push(...months);
            } catch (error) {
                console.error(error)
            }
        });

        return {
            status: 200,
            body: JSON.stringify({
                success: true,
                data,
            }),
        }

    } catch (error) {
        return {
            status: 500,
            body: JSON.stringify({
                success: false,
                error: 'Directory does not exist',
            }),
        }
    }
}