var express = require('express');   // We are using the express library for the web server
//express is instantiated in app.js
var db = require('../database/db-connector') // Database

//assume engine variables are set

//Set up express router
const router = express.Router();
module.exports =  router; //export it so that app.js can import it

//import hbs
const manuPage = "../views/manu.hbs";

console.log("manuRoute.js loaded");

//note: any res.redirect('/'); will need to be changed to '/manufacturers/'

router.get('/', function(req, res) {

    let query1 = "SELECT * FROM manufacturers;";
    db.pool.query(query1, function(error, rows, fields){
        res.render(manuPage, {data: rows});
    })
})

router.post('/add-manu-form', function(req,res){
    let data = req.body;

    query1 = `INSERT INTO manufacturers (name, headquarter_location, year_established) VALUES ('${data['input-manu-name']}', '${data['input-manu-location']}', '${data['input-manu-year-est']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if(error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.redirect('/manufacturers/');
        }
    })
})

router.delete('/delete-manu-form', function(req, res){

    let data = req.body;
    //console.log(data);
    let manuID = parseInt(data.manuID);
    query1 = `DELETE FROM manufacturers WHERE manuID = ?;`
    db.pool.query(query1, [manuID], function(error, rows, fields){
        if(error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})

router.put('/update-manu-form', function(req,res,next){
    let data = req.body;
    //console.log(data);

    let manufacturer = data['manuID'];
    let hqloc = data['hqlocation'];
    let yearest = data['yearest'];

    let queryUpdate = `UPDATE manufacturers SET manufacturers.headquarter_location = '${hqloc}', manufacturers.year_established = '${yearest}' WHERE manufacturers.manuID = '${manufacturer}';`;

    //console.log(queryUpdate);
    db.pool.query(queryUpdate, function(error, rows, fields) {
        if(error){
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }
    })
})

router.get('/:id', function(req, res){ 
    if(req.params.id == "favicon.ico")
        return; //return nothing. my browser trips a request for this all the time for some reason. so this is how to ignore it

    //console.log(req.params.id + " ee");

    let carQuery = "SELECT * FROM manufacturers WHERE manuID = " + req.params.id + ";"

    db.pool.query(carQuery, function(error, rows, fields){    // Execute the query
        if (error && (error.sqlMessage != "Unknown column 'undefined' in 'on clause'")) { //the undefined error is acceptable
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
        else{
            //console.log(rows);
            res.send(rows);
        }
    })
});