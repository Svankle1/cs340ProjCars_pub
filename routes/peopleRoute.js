var express = require('express');   // We are using the express library for the web server
//express is instantiated in app.js
var db = require('../database/db-connector') // Database

//assume engine variables are set

//Set up express router
const router = express.Router();
module.exports =  router; //export it so that app.js can import it

//import hbs
const peoplePage = "../views/people.hbs";

console.log("peopleRoute.js loaded");

router.get('/', function(req, res){  
    let query1 = "SELECT people.name, people.personID, people.networth, COUNT(people_have_cars.fk_personID) AS total_cars        FROM people        LEFT JOIN people_have_cars on people.personID = people_have_cars.fk_personID AND people_have_cars.fk_personID        GROUP BY people.name        ORDER BY people.networth ASC;"; // Define our query

    let query2 = "SELECT autoID, concat(model,' ', year_released) as name FROM cars;";

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        // Save the people
        let people = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the cars
            let cars = rows;
            return res.render(peoplePage, {data: people, cars: cars});
        })  
    })
});

router.post('/add-person-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);
    //console.log(req.body);
    // Capture NULL values
    let networth = data['input-networth'];
    if (networth === '')
    {
        networth = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO people(name, networth) VALUES ('${data['input-name']}', '${data['input-networth']}' )`;
    //query1 = `INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES ('${data['input-name']}', '${data['input-networth']}', ${homeworld}, ${age})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically presents the new info
        else
        {
            //BUT FIRST
            //if any cars are checked, we create people_have_cars intersection entities
            //capture car values
            //first, query to get number of car entities
            var carCount;
            db.pool.query("SELECT COUNT(cars.autoID) as total_cars         FROM cars", function(error, rows, fields){
                carCount = rows[0].total_cars;
                
                //then do operations
                for(i = 1; i <= carCount; i++){
                    //check if a box is checked
                    //console.log(`${data['vehicle' + i]}`);
                    if (data['vehicle' + i] != undefined)
                        {
                            db.pool.query(`INSERT INTO people_have_cars (fk_personID, fk_autoID) VALUES ( (SELECT people.personID FROM people WHERE people.name = '${data['input-name']}') ,` + i + `)`, function(error, rows, fields){

                                // Check to see if there was an error
                                if (error) {
                        
                                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                                    console.log(error)
                                    res.sendStatus(400);
                                }
                                else{
                                    //move on to next part of loop
                                }
                            })
                    }
                }
            })
            //NOW we we redirect back to our root route, which automatically runs the SELECT * FROM people and presents it on the screen
            res.redirect('/people/');
        }
    })
})

  router.delete('/delete-person-ajax', function(req,res,next){
    let data = req.body;
    let personID = parseInt(data.personID);
    let delPersonQuery = `DELETE FROM people WHERE personID = ?`;
  
  
          // Run the 1st query
          db.pool.query(delPersonQuery, [personID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                //console.log(rows);
                res.sendStatus(204);
              }
  })});

  router.put('/put-person-ajax', function(req,res,next){
    let data = req.body;
    
    let networth = parseInt(data.networth);
    if (data.networth ==='') networth = 0;
    let person = parseInt(data.personID);
  
    let queryUpdateWorth = `UPDATE people SET networth = ? WHERE people.personID = ?`;
    //let selectWorld = `SELECT * FROM bsg_planets WHERE id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateWorth, [networth, person], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {

                //NOW we handle updating the intersection entities
                //Start by querying all intersections for the relevant person
                queryCarCheck = `SELECT people_have_cars.intersectionID, people.personID, cars.autoID FROM people_have_cars JOIN people on people_have_cars.fk_personID = people.personID JOIN cars on people_have_cars.fk_autoID = cars.autoID WHERE people.personID = ? ORDER BY cars.autoID;`
                db.pool.query(queryCarCheck, [person], function(error, rows, fields){
                    if (error) {
                    console.log(error);
                    res.sendStatus(400);
                    }
                    else
                    {
                        //now we have an array of all the intersections that exist for the relevant person
                        /* example of rows
                            [
                            RowDataPacket { intersectionID: 1, personID: 2, autoID: 2 },
                            RowDataPacket { intersectionID: 4, personID: 2, autoID: 3 }
                            ]
                        */
                        //convert to array
                        var rowArray = [];
                        for(i = 0; i < rows.length; i++){
                            rowArray.push(rows[i].autoID);
                        }
                        //console.log(rowArray);
                        let person = rows[0].personID;
                        //for each checkbox / car
                        db.pool.query("SELECT COUNT(cars.autoID) as total_cars FROM cars", function(error, quickRows, fields){
                            let carCount = quickRows[0].total_cars;
                            //console.log(data);
                            for(i = 0; i < carCount; i++){  //note that element 0 has an autoID of 1
                                //console.log(data.checkboxes[i]);
                                //if it is checked
                                if(data.checkboxes[i] != '0'){
                                    //console.log(parseInt(i+1) + " is checked");
                                    //check if it exists in the previous rows array
                                    //console.log(rowArray.includes(parseInt(i+1)));
                                    if(rowArray.includes(parseInt(i+1))){
                                        //Do nothing. This means that the entity alrealdy exists
                                        //console.log("doing nothing");
                                    }
                                    else {
                                        //create the entity
                                        let createIntersectQuery = `INSERT INTO people_have_cars (fk_personID, fk_autoID) VALUES ( ? , ?)`;
                                        db.pool.query(createIntersectQuery, [person, parseInt(i+1)], function(error, rows, fields){    // Execute the query
                                            if (error) {
                                                console.log(error);
                                                res.sendStatus(400);
                                                }
                                            else{
                                                //sucsess. let the loop move on
                                            }
                                        })
                                    }

                                }
                                else{
                                //if it is unchecked
                                    //console.log(parseInt(i+1) + " is un checked");
                                    //check to see if it existed before
                                    if(rowArray.includes(parseInt(i+1))){
                                        //The checkbox is unchecked, but an intersection exists
                                        //That means that we need to delete it to honor the users update
                                        let deleteIntersectQuery = `DELETE FROM people_have_cars WHERE fk_personID = ? AND fk_autoID = ?;`;

                                        db.pool.query(deleteIntersectQuery, [person, parseInt(i+1)], function(error, rows, fields){    // Execute the query
                                            if (error) {
                                                console.log(error);
                                                res.sendStatus(400);
                                                }
                                            else{
                                                //sucsess. let the loop move on
                                            }
                                        })
                                    }
                                    //else, do nothing. let the loop move along
                                }
                            }
                        })
                    }
                });


                res.send({'newNW':networth});
                //res.redirect('/');
              }
  })});

router.get('/:id', function(req, res){ 
    if(req.params.id == "favicon.ico")
        return; //return nothing. my browser trips a request for this all the time for some reason. so this is how to ignore it

    //console.log(req.params.id + " ee");

    //let carQuery = "SELECT autoID " /* + " , concat(model,' ', cars.year_released) as name"*/ + "FROM cars JOIN people_have_cars on cars.autoID = people_have_cars.fk_autoID JOIN people on people_have_cars.fk_personID = people.personID AND people.personID = " + req.params.id + " JOIN engines on cars.fk_engineID = engines.engineID JOIN manufacturers on cars.fk_manuID = manufacturers.manuID;"; // Define our query
    let carQuery = "SELECT autoID, CASE WHEN EXISTS ( SELECT 1 FROM people_have_cars phc JOIN people p ON phc.fk_personID = p.personID WHERE phc.fk_autoID = cars.autoID AND p.personID =" + req.params.id + " ) THEN TRUE ELSE FALSE END AS meets_criteria FROM cars LEFT JOIN people_have_cars phc ON cars.autoID = phc.fk_autoID LEFT JOIN people p ON phc.fk_personID = p.personID GROUP BY autoID;" //query modified with help from microsoft copilot

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