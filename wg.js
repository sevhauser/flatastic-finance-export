const fs = require('fs');

class WGData {
  constructor(dataPath) {
    const content = fs.readFileSync(dataPath);
    this.data = JSON.parse(content);
  }
  
  get currency() {
    return this.data.currency;
  }

  get users() {
    return this.data.flatmates.map((user) => ({
      id: parseInt(user.id, 10),
      name: user.firstName,
    }));
  }
}

module.exports = WGData;
