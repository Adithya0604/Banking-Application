// DotEnv Configuration Setting
require("dotenv").config();
const cors = require("cors");

// Intilizaing the Express
const express = require("express");
const cookieParser = require("cookie-parser");

// Mongoose Connection
const Connect = require("./src/connection");
const PORT = process.env.PORT;

Connect();

// Instance of Express
const app = express();

const { UserRouter } = require("./src/routes/User");
const { UserAccountRouter } = require("./src/routes/Account");
const { AccountTranactionRouter } = require("./src/routes/Transaction");
const errorHandle = require("./src/middleWare/userErrorHandles");

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    credentials: true, // if you want to allow cookies/auth headers
  })
);

app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/user/", UserRouter);
app.use("/api/user/", UserAccountRouter);
app.use("/api/user/", AccountTranactionRouter);

app.use(errorHandle);

// Server Listen Port Activated
app.listen(PORT, () => console.log(`Server is listening on the ${PORT}`));
