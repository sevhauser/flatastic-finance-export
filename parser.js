const fs = require('fs');

class Parser {
  constructor(dataPath) {
    const content = fs.readFileSync(dataPath);
    this.data = JSON.parse(content);
  }

  parse() {
    const rows = [];
    this.data.forEach((purchase) => {
      const {
        date,
        creatorId,
        totalSum,
        insertData,
        items,
      } = purchase;
      const purchaseName = purchase.name;

      items.forEach((item) => {
        const {
          name,
          price,
          sharers,
        } = item;
        const share = sharers.length > 0 ? price / sharers.length : 0;
        rows.push(({
          date,
          purchaseName,
          userId: creatorId,
          total: totalSum,
          productName: name,
          price,
          share,
          sharers,
        }));
      });
    });

    return rows;
  }
}

module.exports = Parser;
