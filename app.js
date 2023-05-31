const express = require("express");
const http = require("http");
const path = require("path");
require("dotenv").config();

const {routesInit} = require("./routes/configRoutes");
const { config } = require("./config/secret");
require("./db/mongoConnect");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

routesInit(app);


const server = http.createServer(app);
const port = config.PORT;
server.listen(port);