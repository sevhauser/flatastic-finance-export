const XLSX = require('xlsx');
const format = require('date-fns/format');

class WGExport {
  constructor(data, wg) {
    this.data = data;
    this.wg = wg;
    this.users = wg.users;
    this.currency = wg.currency;
    this.createSharerMapping();
  }

  createSharerMapping() {
    const result = [];
    this.users.forEach(payer => {
      this.users.forEach(recipient => {
        result.push({
          from: payer.id,
          fromName: payer.name,
          to: recipient.id,
          toName: recipient.name,
        });
      });
    });
    this.sharerMapping = result;
  }

  getUserName(id) {
    const user = this.users.find(u => u.id === id);
    return user ? user.name : 'NOT FOUND';
  }

  export(filename) {
    const book = this.generateWorkbook();
    XLSX.writeFile(book, filename);
  }

  generateWorkbook() {
    const result = XLSX.utils.book_new();
    const rows = [
      this.generateHeader(),
      ...this.generateRows(),
    ];
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(result, sheet, 'Data');

    return result;
  }

  generateHeader() {
    return [
      'Date',
      'Name',
      'Buyer',
      'Total',
      'Product',
      'Price',
      ...this.sharerMapping.map(entry => `${entry.fromName} -> ${entry.toName}`),
    ];
  }

  generateRows() {
    return this.data.map((entry) => [
      {v: new Date(entry.date * 1000), t: 'd'},
      entry.purchaseName,
      this.getUserName(entry.userId),
      {v: entry.total, t: 'n', z: `#,##0.00 [$${this.currency}];[RED]-#,##0.00 [$${this.currency}]`},
      entry.productName,
      {v: entry.price, t: 'n', z: `#,##0.00 [$${this.currency}];[RED]-#,##0.00 [$${this.currency}]`},
      ...this.generateSharerData(entry.userId, entry.share, entry.sharers),
    ]);
  }

  generateSharerData(buyer, share, sharers) {
    return this.sharerMapping.map(entry => {
      let value = 0;
      if (sharers.includes(entry.from) && buyer === entry.to) {
        value = share;
      }
      return {v: value, t: 'n', z: `#,##0.00;[RED]-#,##0.00`};
    });
  }
}

module.exports = WGExport;
