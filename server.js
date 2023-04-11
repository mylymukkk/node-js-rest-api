const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

const { PORT } = process.env || 3000;
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST, { dbName: "db-contacts" })
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
