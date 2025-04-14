const redis = require('redis');
require('dotenv').config();

module.exports = {
  redis: {
    client: redis
      .createClient({
        url: 'redis://127.0.0.1:6379',
      })
      .connect()
      .catch(console.error),
  },
};
