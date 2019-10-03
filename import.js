const fs = require('fs');
const path = require('path');
const axios = require('axios');
const signale = require('signale');

signale.start('Starting import script');

const PAGE_SIZE = 500;

const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
const now = Math.floor(new Date().getTime() / 1000);

function archiveFile(fileName) {
  if (fs.existsSync(path.join(process.cwd(), `${fileName}.json`))) {
    signale.info(`Archiving ${fileName}.json to archive/${fileName}_${now}.json`);
    fs.renameSync(
      path.join(process.cwd(), `${fileName}.json`),
      path.join(process.cwd(), 'archive', `${fileName}_${now}.json`),
    );
  }
}

async function run(client) {
  signale.start('Archiving old data');
  archiveFile('wg');
  archiveFile('cashflow');
  signale.complete('Archiving complete');
  signale.start('Fetching WG data from API');
  try {
    const res = await client.get('wg');
    fs.writeFileSync(path.join(process.cwd(), 'wg.json'), JSON.stringify(res.data));
    signale.success('Loaded WG data, wrote it to wg.json');
  } catch (e) {
    signale.error('There was an error during the request!');
    signale.error(e);
  }
  signale.complete('Fetching of WG data complete');

  signale.start('Fetching cashflow data from API');
  try {
    const res = await client.get(`cashflow?limit=${PAGE_SIZE}`);
    fs.writeFileSync(path.join(process.cwd(), 'cashflow.json'), JSON.stringify(res.data));
    signale.success('Loaded cashflow data, wrote it to cashflow.json');
  } catch (e) {
    signale.error('There was an error with the request!');
    signale.error(e);
  }
  signale.complete('Fetching of cashflow data complete');
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
signale.complete('Import completed');
