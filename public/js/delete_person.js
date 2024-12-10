function deletePerson(id) {
    
    // Put our data we want to send in a javascript object
    let data = {
        personID: id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/people/delete-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            
            // Add the new data to the table
            //deleteRow(id);
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(personID){

    let table = document.getElementById("people-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //console.log("its happening");
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       //console.log(table.rows[i].getAttribute("data-value"));
       //console.log(personID + "equal id");
       if (table.rows[i].getAttribute("data-value") == personID) {
            //console.log("its really happening");
            table.deleteRow(i);
            break;
       }
    }
}