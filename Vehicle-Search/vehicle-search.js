import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

let fetchedData; // Define a global variable to hold the fetched data
let fetchedPeople; // Define a global variable to hold the fetched data

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("vehicleSearchForm").addEventListener("submit", async (event) => 
{
    event.preventDefault();

/////////////////////////////////////////////////
    
    const {data, error} = await supabase.from("Vehicles").select();
    console.log("Fetched Vehicles:", data);

    fetchedData = data;

////////////////////////

    const {dataPeople, errorPeople} = await supabase.from("People").select();
    console.log("Fetched People:", data);

    fetchedPeople = dataPeople;

/////////////////////////////////////////////////

    const rego = document.getElementById("rego").value;
    const results = document.querySelector("#results");

/////////////////////////////////////////////////

    if (rego.trim() === "")
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element
        resultsHeading.textContent = "Search Results";

        //TO DISPLAY MESSAGE IN RESULTS BOX
        //const enterValuesText = document.createElement("p"); // Create a new paragraph element for the "Enter values" text
        //enterValuesText.textContent = "Please enter the data you would like to search for";
        
        results.appendChild(resultsHeading); // Append the resultsHeading and enterValuesText to the .results div
        //results.appendChild(enterValuesText);
        
        document.getElementById("message").textContent = "Error";

        //CODE TO CLEAR TEXT AFTER 2.5S
        //setTimeout(() => 
        //{
        //    document.getElementById("message").textContent = "";
        //}, 2500);
        
        return;
    }

/////////////////////////////////////////////////

    else if (rego.trim() !== "") 
    {
        const searchTerm = rego.toLowerCase(); // Convert the input to lowercase for case-insensitive comparison

        
        const searchResults = fetchedData.filter(vehicle => // Filter the fetched data based on the search term
        {
            const numPlate = `${vehicle.VehicleID}`.toLowerCase(); // Convert each vehicle's number plate to lowercase for comparison
            
            return numPlate.includes(searchTerm); // Check if the search term is included in the vehicle's number plate
        });

        
        results.innerHTML = ""; // Clear any existing content inside the .results div

        
        const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
        resultsHeading.textContent = "Search Results";
        results.appendChild(resultsHeading);

////////////////////////
        
        if (searchResults.length === 0) // Check if any results were found
        {
            //CODE TO MAKE THE MESSAGE APPEAR IN THE RESULTS ELEMENT
            //const noResultsText = document.createElement("p");
            //noResultsText.textContent = "No matching records found.";
            //results.appendChild(noResultsText);

            document.getElementById("message").textContent = "No result found";
        } 
        else 
        {
            searchResults.forEach(vehicle => // Loop through each search result and display it
            {
                const vehicleDiv = document.createElement("div"); // Create a new div for each vehicle
                vehicleDiv.classList.add("vehicle-info"); // Add a CSS class for styling if needed

                vehicleDiv.innerHTML = `<strong>Number Plate: </strong>${vehicle.VehicleID}, <strong>Make: </strong>${vehicle.Make}, <strong>Model: </strong>${vehicle.Model}, <strong>Colour: </strong>${vehicle.Colour}`;

                if (fetchedPeople && fetchedPeople.length > 0) 
                {
                    const owner = fetchedPeople.find(person => person.PersonID === vehicle.OwnerID);
                    if (owner) 
                    {
                        vehicleDiv.innerHTML += `
                            <strong>, Owner's Name: </strong>${owner.Name}, 
                            <strong>License Number: </strong>${owner.LicenseNumber}`;
                    } 
                    else 
                    {
                        vehicleDiv.innerHTML += ``;
                    }
                } 
                else 
                {
                    // Handle case where fetchedPeople is undefined or empty
                   // vehicleDiv.innerHTML += `<strong>Owner's Name: </strong>Unknown, <strong>License Number: </strong>Unknown`;
                }
            
                results.appendChild(vehicleDiv);
            });
            document.getElementById("message").textContent = "Search successful";
        }
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////