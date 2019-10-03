const path = require('path');
const WGData = require('./wg');
const Parser = require('./parser');
const WGExport = require('./export');

const wg = new WGData(path.join(process.cwd(), 'wg.json'));
const parser = new Parser(path.join(process.cwd(), 'cashflow.json'));
const exporter = new WGExport(parser.parse(), wg);
const now = new Date();
exporter.export(path.join(process.cwd(), `Export_${Math.floor(now.getTime() / 1000)}.xlsx`));
