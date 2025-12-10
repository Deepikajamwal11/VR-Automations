require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const cors = require("cors");
const crmSyncJob = require("./controller/cron/crmsync"); 

const indexRouter = require('./routes/index');
const app = express();
const PORT = process.env.PORT || 8888;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    crmSyncJob(); // start cron job
  })
  .catch((e) => console.log("❌ DB Error:", e));

app.use('/', indexRouter);

app.use((req, res, next) => next(createError(404)));

app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
module.exports = app;
