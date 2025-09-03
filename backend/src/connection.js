require("dotenv").config();
const mongoose = require("mongoose");

const URL = process.env.CONNECTION_URL;

async function Connect() {
  try {
    const conn = await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = Connect;

/**{
    "accountNumber": "65439812098765432",
    "ifscCode": "SBIJ0004456",
    "accountType": "Savings",
    "balance": 25000.00,
    "currency": "INR",
    "userId": "68b6bfd08293fdf5c3b4bb19",
    "branch": "Kolkata Park Street Branch",
    "accountStatus": "active",
    "lastTransactionDate": "2025-08-30"
} */