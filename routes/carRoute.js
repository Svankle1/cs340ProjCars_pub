var express = require('express');   // We are using the express library for the web server
//express is instantiated in app.js
var db = require('../database/db-connector') // Database

//assume engine variables are set

//Set up express router
const router = express.Router();
module.exports =  router; //export it so that app.js can import it

//import hbs
const peoplePage = "../views/cars.hbs";

console.log("carRoute.js loaded");

router.get('/', function(req, res){  
    let query1 = "SELECT autoID, model AS Model, year_released AS YearReleased,manufacturers.name AS Manufacturer, fk_engineID AS EngineID FROM cars JOIN manufacturers on cars.fk_manuID = manufacturers.manuID ORDER BY cars.model;"; // Define our query

    let query2 = "SELECT name, manuID From manufacturers;";
    let query3 = "SELECT engineID, displacement, cylinder, year_released ,name from engines JOIN manufacturers on engines.fk_manuID = manufacturers.manuID;";


    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        //Save cars;
        let cars = rows;
        db.pool.query(query2, function(error, rows, fields){    // Execute the query
            let manuList = rows;
            db.pool.query(query3, function(error, rows, fields){    // Execute the query
                return res.render(peoplePage, {data: cars, manuList: manuList, engineList: rows});
            })
        })
    })
});

router.post('/add-car-form', function(req, res){
    let data = req.body;
    /*
    Sample req.body

    {
        'input-model': 'q23142',
        'input-year': '1901',
        manufacturer: '8',
        engineSelect: '4'
    }
    */

    if (data['input-model'] === '' || data['input-year'] === '')
    {
        res.sendStatus(406); //Send 406 Not Acceptable if there is no model or year specified
        return;
    }
    //else
    query1 = `INSERT INTO cars (model, year_released, fk_manuID, fk_engineID) VALUES ('${data['input-model']}', '${data['input-year']}', '${data['input-manuID']}', '${data['input-engineSelect']}');`;

    db.pool.query(query1, (error, rows, fields) => {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically presents the new info
        else
        {
            res.redirect('/cars/');
        }
    })  
});

router.delete('/delete-car-ajax', function(req,res,next){
    let data = req.body;
    let autoID = parseInt(data.autoID);
    let delCarQ = `DELETE FROM cars WHERE autoID = ?`;
    db.pool.query(delCarQ, [autoID], function(error, rows, fields){
        if (error) {
        console.log(error);
        res.sendStatus(400);
        }
        else
        {
          res.sendStatus(204);
        }
    })
});

router.put('/update-car', function(req,res,next){
    let data = req.body;
    //console.log(data);

    /* Example output
    {
        autoID: '8',
        modelName: 'True',
        year_released: '2006',
        manuID: '8',
        engineID: '6'
    }
    */

    let nModel = data['modelName'];
    //console.log(nModel);
    let nYear = parseInt(data['year_released']);
    if (nModel === '' || nYear === '')
        {
            res.sendStatus(406); //Send 406 Not Acceptable if there is no model or year specified
            return;
        }
    //else, pull rest of variables
    let autoID= parseInt(data['autoID']);
    let nManuID= parseInt(data['manuID']);
    let nEngineID=parseInt(data['engineID']);
  
    let queryUpdateWorth = `UPDATE cars SET cars.model = ?, cars.year_released = ?, cars.fk_manuID = ?, cars.fk_engineID = ? WHERE cars.autoID = ?;`;

    //console.log(queryUpdateWorth, [nModel, nYear, nManuID, nEngineID, autoID]);
          // Run the 1st query
          db.pool.query(queryUpdateWorth, [nModel, nYear, nManuID, nEngineID, autoID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                //res.send({'newNW':networth});
                //res.redirect('/');
                res.sendStatus(200);
              }
        })
});

router.get('/:id', function(req, res){ 
    if(req.params.id == "favicon.ico")
        return; //return nothing. my browser trips a request for this all the time for some reason. so this is how to ignore it

    let getQuery = "SELECT * FROM cars WHERE autoID = " + req.params.id; //query modified with help from microsoft copilot

    db.pool.query(getQuery, function(error, rows, fields){    // Execute the query
        if (error && (error.sqlMessage != "Unknown column 'undefined' in 'on clause'")) { //the undefined error is acceptable
            console.log(error);
            res.sendStatus(400);
            }
        else{
            res.send(rows);
        }
    })
});