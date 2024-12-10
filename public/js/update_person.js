
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-person-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputNetworth = document.getElementById("input-networth-update");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let networthValue = inputNetworth.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for networth

    if (isNaN(networthValue)) 
    {
        return;
    }

    //get checkboxes
    var array = [];
    var checkboxes = document.querySelectorAll('input[tag=updateCheck]');

    for (var i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked)
            array.push(checkboxes[i].value);
        else array.push('0');
    }
    //console.log(array);

    // Put our data we want to send in a javascript object
    let data = {
        personID: fullNameValue,
        networth: networthValue,
        checkboxes: array,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/people/put-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //updateRow(xhttp.response, fullNameValue);
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// function updateRow(data, personID){
//     let parsedData = JSON.parse(data);
//     //console.log(parsedData);
    
//     let table = document.getElementById("people-table");

//     for (let i = 0, row; row = table.rows[i]; i++) {
//        //iterate through rows
//        //rows would be accessed using the "row" variable assigned in the for loop
//        if (table.rows[i].getAttribute("data-value") == personID) {

//             // Get the location of the row where we found the matching person ID
//             let updateRowIndex = table.getElementsByTagName("tr")[i];

//             // Get td of networth value
//             let td = updateRowIndex.getElementsByTagName("td")[2];

//             // Reassign networth to our value we updated to
//             td.innerHTML = parsedData.newNW; 
//        }
//     }
// }

async function updateValues(personID){
    if(parseInt(personID) == NaN    ||    personID == 0)
        return;
    
    //else
    const url = "/people/" + personID ;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    //console.log(json);
    /*
    Example of a response that would come from console.log(json):
    [
        {
            "autoID": 2
        },
        {
            "autoID": 3
        }
    ]
    */
    //clear checkboxes
    var checkboxes = document.querySelectorAll("input [tag = 'updateCheck]");
        checkboxes.forEach(function (checkbox){
            checkbox.checked = false;
        });

   if(json.length != 0){
   for(i = 0; i < json.length; i++){
     // Get the location of the row where we found the matching person ID
     let thingToCheck = document.getElementById("u_vehicle" + [i+1]);
     //console.log("i:" + i + " autoid:"+json[i].autoID);
     //console.log("u_vehicle" + [i+1] + " = " +thingToCheck);
     //console.log(thingToCheck);
     //console.log(json[i].meets_criteria + " comp " + 0);

     if(json[i].meets_criteria !=0){
        thingToCheck.checked = true;
     }
     else {
        thingToCheck.checked = false;
     }
    }
   }
  } catch (error) {
    console.error(error.message);
  }
}