const express = require("express");
const http = require("http");
const path = require("path");
require("dotenv").config();

const {routesInit} = require("./routes/configRoutes")
require("./db/mongoConnect");

const app = express();
// מאפשר לשלוח באדי דרך הצד לקוח
app.use(express.json());

// להגדיר תיקייה סטטית שתיהיה התיקייה בשם פאבליק
app.use(express.static(path.join(__dirname,"public")));

routesInit(app);


const server = http.createServer(app);
// בודק אם אנחנו על שרת אמיתי ואם כן דואג שנקבל את הפורט שהענן צריך
// אם לא הברירת מחדל תיהיה 3003
const port = process.env.PORT;
server.listen(port);