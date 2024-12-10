// This was largely adapted from the CS340 NodeJS Starter Code

/*
    SETUP
*/
//const path = require('path'); might be usefull if we serve static html ever

var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 1267;                 // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector') // Database

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

//EXSPRESS SETUP
const router = express.Router();
module.exports =  router; 

/*
    ROUTES
*/
app.get('/', function(req, res){  
    //Note: Automatically goes to index.html
    res.sendStatus(200);
});

var peopleRouter = require("./routes/peopleRoute.js");
app.use("/people", peopleRouter);

var carRouter = require("./routes/carRoute.js");
app.use("/cars", carRouter);

var manuRouter = require("./routes/manuRoute.js");
app.use("/manufacturers", manuRouter);

var engineRouter = require("./routes/engineRoute.js");
app.use("/engines", engineRouter);

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});