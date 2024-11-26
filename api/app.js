const express = require("express");
const cors = require('cors');
// const NodeCache = require("node-cache");
require("./config/dbConnect")()
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(require("./utils/responseHandler"))
// app.use(express.static(path.join(__dirname, 'storage')))

global.config=require('./config/config')
// global.validateRequest=require("./utils/validateRequest");
global.loggedInUserId=''
// global.cache = new NodeCache({ stdTTL: 500, checkperiod: 180 });

app.get("/", (_, response) => { response.json({ message: "Welcome to NodeJS app" }); });
app.use('/api/v1/', require('./routes/api'));
// app.use('/cron/', require('./routes/cron'));

module.exports = app;