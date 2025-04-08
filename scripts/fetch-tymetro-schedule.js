import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFile } from 'fs/promises';


const url = 'https://www.tymetro.com.tw/tymetro-new/tw/_pages/travel-guide/timetable-search.php';

async function writeToFile(filename, data) {
    // write to JSON file
    const jsonData = JSON.stringify(data, null, 2);
    await writeFile(filename, jsonData, 'utf8');
    console.log('Data saved to file:', filename);
}

async function fetchData(startStation, endStation, date) {
    const result = [];
    try {
        // post form data
        const formData = new URLSearchParams();
        formData.append('type', '0');
        formData.append('type2', '0');
        formData.append('advanced-status', 'visible');
        formData.append('start_station', startStation);
        formData.append('end_station', endStation);
        formData.append('godate', date);
        formData.append('gotime', '04:00');

        const response = await axios.post(url, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://www.tymetro.com.tw',
                'Referer': url,
            },
        });
        const data = response.data;

        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Extract the desired data
        // const title = $('title').text();
        // console.log('Title:', title);
        const carTable = $('#car_time_show');
        const rows = carTable.find('table tr');
        rows.each((index, row) => {
            const cols = $(row).find('td');
            if (cols.length === 0) return;
            const rowData = [];
            cols.each((i, col) => {
                rowData.push($(col).text().trim());
            });
            result.push(rowData);
        });
        // console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    return result;
}

function toTimestamp(dateString) {
    const [hours, minutes] = dateString.split(':').map(Number);
    return hours * 3600 + minutes * 60;
  }

function formatData(data, direction, holiday) {
    const formattedData = [];
    data.forEach((row) => {
        const formattedRow = {
            type: row[0] == '普通車' ? 'normal' : 'express',
            startTimeStr: row[1],
            startTime: toTimestamp(row[1]),
            endTimeStr: row[2],
            endTime: toTimestamp(row[2]),
        };
        formattedData.push(formattedRow);
    });
    return formattedData;
}

function main() {
    const dataSouth = fetchData('8', '18', '2025-03-28');
    const dataSouthOnHoliday = fetchData('8', '18', '2025-03-29');
    const dataNorth = fetchData('8', '1', '2025-03-28');
    const dataNorthOnHoliday = fetchData('8', '1', '2025-03-29');

    Promise.all([dataSouth, dataSouthOnHoliday, dataNorth, dataNorthOnHoliday])
        .then((results) => {
            const combinedData = [];
            combinedData.push({
                dir: 0,
                startStation: 'A08',
                endStation: 'A01',
                holiday: false,
                timeTable: formatData(results[0])
            });
            combinedData.push({
                dir: 0,
                startStation: 'A08',
                endStation: 'A01',
                holiday: true,
                timeTable: formatData(results[1])
            });
            combinedData.push({
                dir: 1,
                startStation: 'A08',
                endStation: 'A01',
                holiday: false,
                timeTable: formatData(results[2])
            });
            combinedData.push({
                dir: 1,
                startStation: 'A08',
                endStation: 'A01',
                holiday: true,
                timeTable: formatData(results[3])
            })
            // Write the combined data to a file
            // console.log('Combined Data:', combinedData);
            writeToFile('../data/tymc-schedule.json', combinedData);
        })
        .catch((error) => {
            console.error('Error in main function:', error);
        });
}

main();