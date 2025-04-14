
// config/bodyParser.js
const path = require('path')
const sails = require('sails')
module.exports.bodyParser = (function _configure() {
    return {
      _custom: {
        jsonLimit: '10mb',
        formLimit: '10mb',
      },
      json: true,
      urlencoded: true,
      multipart: {
        maxFieldsSize: '10mb',
        keepExtensions: true,
        uploadDir: path.resolve(sails.config.appPath, 'Uploads/profiles'), // Default upload dir
      },
    };
  })();