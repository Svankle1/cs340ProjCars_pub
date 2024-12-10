let updateEngineForm = document.getElementById("update-eng-form");

updateEngineForm.addEventListener("submit", function (e){
    //console.log("here2")
    e.preventDefault();
    let inputEngineID = document.getElementById("u-select-eng");
    let inputEngineDisplacement = document.getElementById("u-input-eng-displacement");
    let inputEngineYearReleased = document.getElementById("u-input-eng-year-released");
    let inputEngineCylinder = document.getElementById("u-input-eng-cylinder");
    let inputManu = document.getElementById("u-input-eng-fk-id");

    let engineIDValue = inputEngineID.value;
    let engineDisplacementValue = inputEngineDisplacement.value;
    let engineYearReleasedValue = inputEngineYearReleased.value;
    let engineCylinderValue = inputEngineCylinder.value;
    let manuId = inputManu.value;

    if (isNaN(engineIDValue)) {
        return;
    }

    let data = {
        engineID: engineIDValue,
        engineDisplacement: engineDisplacementValue,
        engineYearReleased: engineYearReleasedValue,
        engineCylinder: engineCylinderValue,
        fk_manuID: manuId,
    }
    console.log(data);

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/engines/update-engines-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //updateRow(xhttp.response, engineIDValue);
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

async function updateValues(engineID){
    //first, unhide edit form
    document.getElementById('restOfUpdateForm').style.display = 'block';

    if(parseInt(engineID) == NaN    ||    engineID == 0) return;
    //else
    const url = "/engines/" + engineID ;
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
            "engineID": 3,
            "displacement": 5.7,
            "cylinder": 8,
            "year_released": 2003,
            "fk_manuID": 3
        }
    ]
    */
   //console.log(document.getElementById("u-input-eng-year-released").value);
    document.getElementById("u-input-eng-cylinder").value = json[0].cylinder;
    document.getElementById("u-input-eng-displacement").value = json[0].displacement;
    document.getElementById("u-input-eng-year-released").value = json[0].year_released;
    document.getElementById("u-m"+json[0].fk_manuID).selected = true;
   
    } catch (error) {
    console.error(error.message);
    }
}