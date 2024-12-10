
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-car-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCarId = document.getElementById("autoSelect")
    let inputModel = document.getElementById("u-input-model");
    let inputYear = document.getElementById("u-input-year");
    let inputManu = document.getElementById("u-input-manuID");
    let inputEngine = document.getElementById("u-input-engineSelect");

    // Get the values from the form fields
    let autoIDToChange = inputCarId.value;
    let newName = inputModel.value;
    let newYear = inputYear.value;
    let newManu = inputManu.value;
    let newEngine = inputEngine.value;

    if (inputCarId < 0) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        autoID: autoIDToChange,
        modelName: newName,
        year_released: newYear,
        manuID: newManu,
        engineID: newEngine,
    }
    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/cars/update-car", true);
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

async function updateValues(autoID){
    //first, unhide edit form
    document.getElementById('restOfUpdateForm').style.display = 'block';

    if(parseInt(autoID) == NaN    ||    autoID == 0) return;
    //else
    const url = "/cars/" + autoID ;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    /*
    Example of a response that would come from console.log(json):
    [
        {
            "autoID": 2,
            "fk_engineID": 2,
            "model": "F150",
            "year_released": 2017,
            "fk_manuID": 2
        }
    ]
    */
    document.getElementById("u-input-model").value = json[0].model;
    document.getElementById("u-input-year").value = json[0].year_released;
    document.getElementById("u-m"+json[0].fk_manuID).selected = true;
    document.getElementById("u-e"+json[0].fk_engineID).selected = true;
   
    } catch (error) {
    console.error(error.message);
    }
}