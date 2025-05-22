var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const loggerFile = require('./middlewares/logger');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

var moviesRouter = require('./routes/movies');
const connectToMongoDB = require('./db');

dotenv.config();
var app = express();
connectToMongoDB();

//MIDLEWARES DE APLICACIÓN:
app.use(cors(
    {
        origin:"*",
        credentials:true,
    }
))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggerFile);
app.use(morgan('dev'))


app.use('/api/movies', moviesRouter);


module.exports = app;
