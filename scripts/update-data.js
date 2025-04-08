import { readFile, writeFile } from 'fs/promises';
import _ from 'lodash';

async function main() {

    const new_file = '../data/tymc-schedule.json';
    const old_file = '../public/tymc-schedule.json';
    const new_data = await readFile(new_file, 'utf8');
    const old_data = await readFile(old_file, 'utf8');

    const new_json = JSON.parse(new_data);
    const old_json = JSON.parse(old_data);

    // compare the two JSON objects
    if (_.isEqual(new_json, old_json)) {
        console.log('Done: No changes detected.');
    } else {
        console.log('Changes detected.');
        // write the new JSON object to the old file
        await writeFile(old_file, new_data, 'utf8');
        console.log("Run `npm run deploy` to deploy new data.");
    }
}

main();