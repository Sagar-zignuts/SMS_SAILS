
//Required modules in project
const validator = require('validatorjs');
const redis = require('redis')
const path = require('path')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {v4} = require('uuid');
require('dotenv').config()

//Redis configuration part
const redisClient = redis.createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis client connected successfully'));

(async () => {
  await redisClient.connect(); // Explicit connection for v4.x
})();

module.exports.constant = {
validator,
redisClient,
path,
bcrypt,
jwt,
DEFAULT_TTL : 3600,
nodemailer,
v4
}