const path = require('path');
const signale = require('signale');

const WGData = require('./wg');
const Parser = require('./parser');
const WGExport = require('./export');

signale.start('Starting export of finance data');

const wg = new WGData(path.join(process.cwd(), 'wg.json'));
signale.success('WG data parsed');

const parser = new Parser(path.join(process.cwd(), 'cashflow.json'));
signale.success('cashflow data parsed');

const exporter = new WGExport(parser.parse(), wg);
const now = new Date();
const filename = `Export_${Math.floor(now.getTime() / 1000)}.xlsx`;

signale.start('Exporting to file');
exporter.export(path.join(process.cwd(), filename));
signale.success(`Exported to ${filename}`);

signale.complete('Export script completed');
