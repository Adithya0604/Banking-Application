require('dotenv').config();
const mongoose = require("mongoose");

const URL = process.env.CONNECTION_URL;

async function Connect() {
  try {
    await mongoose.connect(URL);
    console.log('Mongoose Connected')
  } catch (error) {
    console.error(`Connection Error:  ${error}`);
    process.exit(1);
  }
}

module.exports = Connect;