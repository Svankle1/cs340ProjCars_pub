var express = require('express');   // We are using the express library for the web server
//express is instantiated in app.js
var db = require('../database/db-connector') // Database

//assume engine variables are set

//Set up express router
const router = express.Router();
module.exports =  router; //export it so that app.js can import it

//import hbs
const manuPage = "../views/engines.hbs";

console.log("engineRoute.js loaded");

//note: any res.redirect('/'); will need to be changed to '/manufacturers/'

router.get('/', function(req, res) {

    let query1 = "SELECT engineID, displacement, cylinder, year_released, manufacturers.name AS manufacturer_name FROM engines JOIN manufacturers on engines.fk_manuID = manufacturers.manuID;";
    let query2 = "SELECT name, manuID From manufacturers;";
    db.pool.query(query1, function(error, rows, fields){
        if(error) {
            console.log(error);
            res.sendStatus(400);
        }else{
            let list = rows;
            db.pool.query(query2, function(error, rows, fields){
                if(error) {
                    console.log(error);
                    res.sendStatus(400);
                }else{
                    res.render(manuPage, {data: list, manuList: rows});
                }
            })
        }
    })
})

router.post('/add-engine-form', function(req,res){
    let data = req.body;

    query1 = `INSERT INTO engines (displacement, cylinder, year_released, fk_manuID) VALUES ('${data['input-eng-displacement']}', '${data['input-eng-cylinder']}', '${data['input-eng-year-released']}', '${data['input-eng-fk-id']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if(error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.redirect('/engines/');
        }
    })
})

router.delete('/delete-engines-form', function(req, res){

    let data = req.body;
    console.log(data);
    let engineID = parseInt(data.engineID);
    query1 = `DELETE FROM engines WHERE engineID = ?;`
    db.pool.query(query1, [engineID], function(error, rows, fields){
        if(error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})

router.put('/update-engines-form', function(req,res,next){
    let data = req.body;
    console.log(data);

    let engine = data['engineID'];
    let displacement = data['engineDisplacement'];
    let year_released = data['engineYearReleased'];
    let cylinders = data['engineCylinder'];
    let fk_manuID = data['fk_manuID'];

    let queryUpdate = `UPDATE engines SET engines.displacement = '${displacement}', engines.year_released = '${year_released}', engines.cylinder = '${cylinders}', engines.fk_manuID = '${fk_manuID}' WHERE engines.engineID = '${engine}';`;

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

    let carQuery = "SELECT * FROM engines WHERE engineID = " + req.params.id + ";"

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