const express = require('express');
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
require("./db/mongoose");
const app = express();

app.use(express.json()); //automatically parse incomming json

app.use(userRouter);
app.use(taskRouter);

module.exports = app;
