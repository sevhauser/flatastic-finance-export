const fs = require('fs');
const path = require('path');
const axios = require('axios');

const PAGE_SIZE = 500;

const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
const now = Math.floor(new Date().getTime() / 1000);

function archiveFile(fileName) {
  if (fs.existsSync(path.join(process.cwd(), `${fileName}.json`))) {
    console.log(`----> Archiving ${fileName}.json to archive/${fileName}_${now}.json`);
    fs.renameSync(
      path.join(process.cwd(), `${fileName}.json`),
      path.join(process.cwd(), 'archive', `${fileName}_${now}.json`),
    );
  }
}

async function run(client) {
  console.log('==== Archiving Old Data ====');
  archiveFile('wg');
  archiveFile('cashflow');
  console.log('==== Loading WG Data ====');
  try {
    const res = await client.get('wg');
    fs.writeFileSync(path.join(process.cwd(), 'wg.json'), JSON.stringify(res.data));
    console.log('----> Successfully loaded WG Data, wrote to wg.json');
  } catch (e) {
    console.error('!---> There was an error with the request!');
    console.error(e);
  }

  console.log('==== Loading Cashflow Data ====');
  try {
    const res = await client.get(`cashflow?limit=${PAGE_SIZE}`);
    fs.writeFileSync(path.join(process.cwd(), 'cashflow.json'), JSON.stringify(res.data));
    console.log('----> Successfully loaded Cashflow Data, wrote to cashflow.json');
  } catch (e) {
    console.error('!---> There was an error with the request!');
    console.error(e);
  }
}

const instance = axios.create({
  baseURL: 'https://api.flatastic-app.com/index.php/api/',
  headers: {
    'x-api-key': config.apiKey,
    'x-api-version': '2.0.0',
    'x-client-version': '2.3.20',
  }
});

run(instance);