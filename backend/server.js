// DotEnv Configuration Setting
require("dotenv").config();

// Intilizaing the Express
const express = require("express");

// Mongoose Connection
const Connect = require("./src/connection");
const PORT = process.env.PORT;

Connect();

// Instance of Express
const app = express();

const { UserRouter } = require("./src/routes/User");
const errorHandle = require("./src/middleWare/userErrorHandles")

app.use(express.json());

//Routes
app.use("/api/user/", UserRouter);

app.use(errorHandle);

// Server Listen Port Activated
app.listen(PORT, () => console.log(`Server is listening on the ${PORT}`));
