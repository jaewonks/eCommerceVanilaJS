import dotenv from 'dotenv';

dotenv.config(); // by calling this function, .env reads config.js and fells process

export default {
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};