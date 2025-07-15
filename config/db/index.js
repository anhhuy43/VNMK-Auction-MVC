const mongoose = require("mongoose");
require("dotenv").config();

console.log("💡 MONGO_URI from env:", process.env.MONGO_URI);

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect succesfully!!!");
  } catch (error) {
    console.log("Connect failure!!!");
    console.error(error.message);
  }
}

module.exports = { connect };
