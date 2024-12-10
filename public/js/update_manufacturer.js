let updateManufacturerForm = document.getElementById("update-manu-form");

updateManufacturerForm.addEventListener("submit", function (e){
    //console.log("here2")
    e.preventDefault();
    let inputManufacturerId = document.getElementById("u-select-manu");
    let inputManufacturerName = document.getElementById("u-input-manuName");
    let inputManufacturerHeadquarterLocation = document.getElementById("u-input-manu-location");
    let inputManufacturerYearEstablished = document.getElementById("u-input-manu-year-est");

    let manufacturerIdValue = inputManufacturerId.value;
    let manufacturerNewName = inputManufacturerName.value;
    let manufacturerHeadquarterLocationValue = inputManufacturerHeadquarterLocation.value;
    let manufacturerYearEstablishedValue = inputManufacturerYearEstablished.value;

    if (isNaN(manufacturerIdValue)) {
        return;
    }

    let data = {
        manuID: manufacturerIdValue,
        manuName: manufacturerNewName,
        hqlocation: manufacturerHeadquarterLocationValue,
        yearest: manufacturerYearEstablishedValue,
    }
    console.log(data);

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/manufacturers/update-manu-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //updateRow(xhttp.response, manufacturerIdValue);
            window.location.reload(); //NOTE, this line must be commented out if you wish to preserve the result of any console.log
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error")
        }
    }
    xhttp.send(JSON.stringify(data));
})

// function updateRow(data, manuID){
//     console.log("here3")
//     let parsedData = JSON.parse(data);
//     console.log(data);
//     /*
//     Example of what this gets logged as:
//     {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1}
//     I, Seth, am not going to worry about changing this so that this function would work as intended.
//     */
    
//     let table = document.getElementById("manufacturer-table");

//     for (let i = 0, row; row = table.rows[i]; i++) {
//        //iterate through rows
//        //rows would be accessed using the "row" variable assigned in the for loop
//        if (table.rows[i].getAttribute("data-value") == manuID) {

//             // Get the location of the row where we found the matching person ID
//             let updateRowIndex = table.getElementsByTagName("tr")[i];

//             // Get td of homeworld value
//             let td = updateRowIndex.getElementsByTagName("td")[3];

//             // Reassign homeworld to our value we updated to
//             td.innerHTML = parsedData[0].name; 
//        }
//     }
// }

async function updateValues(manuID){
    //first, unhide edit form
    document.getElementById('restOfUpdateForm').style.display = 'block';

    if(parseInt(manuID) == NaN    ||    manuID == 0) return;
    //else
    const url = "/manufacturers/" + manuID ;
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
            "manuID": 8,
            "name": "Ford",
            "headquarter_location": "Dearborn, MI, USA",
            "year_established": 1903
        }
    ]
    */
   console.log(document.getElementById("u-input-manu-year-est").value);
    document.getElementById("u-input-manuName").value = json[0].name;
    document.getElementById("u-input-manu-location").value = json[0].headquarter_location;
    document.getElementById("u-input-manu-year-est").value = json[0].year_established;
   
    } catch (error) {
    console.error(error.message);
    }
}