import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

let fetchedVehicles; // Define a global variable to hold the fetched data
let fetchedPeople; // Define a global variable to hold the fetched data

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("vehicleSearchForm").addEventListener("submit", async (event) => 
{
    event.preventDefault();

/////////////////////////////////////////////////
    
    const {data: vehicleData, error: vehicleError} = await supabase.from("Vehicles").select();

    if (vehicleError) 
    {
        console.error("Error fetching data:", error.message);
        return;
    }

    fetchedVehicles = vehicleData;

////////////////////

    const {data: peopleData, error: peopleError} = await supabase.from("People").select();

    if (peopleError) 
    {
        console.error("Error fetching data:", error.message);
        return;
    }

    fetchedPeople = peopleData;      

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

    try 
    {
        const { data: vehiclesData, error: vehiclesError } = await supabase
            .from("Vehicles")
            .select()
            .textSearch("VehicleID", rego);

        if (vehiclesError) 
        {
            console.error("Error fetching vehicles data:", vehiclesError.message);
            return;
        }

        fetchedVehicles = vehiclesData;

        const { data: peopleData, error: peopleError } = await supabase
            .from("People")
            .select();

        if (peopleError)
        {
            console.error("Error fetching people data:", peopleError.message);
            return;
        }

        fetchedPeople = peopleData;

        results.innerHTML = ""; // Clear previous results

        const searchResults = fetchedVehicles.filter(vehicle => 
            vehicle.VehicleID.toLowerCase().includes(rego.toLowerCase())
        );

        if (searchResults.length > 0) 
        {
            searchResults.forEach(vehicle => 
            {
                results.innerHTML = ""; // Clear any existing content inside the .results div

                const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
                resultsHeading.textContent = "Search Results";

                results.appendChild(resultsHeading); // Append the resultsHeading to the .results div

                const vehicleDiv = document.createElement("div");
                vehicleDiv.classList.add("vehicle-result");

                vehicleDiv.innerHTML = `<strong>Number Plate: </strong>${vehicle.VehicleID}, <strong>Make: </strong>${vehicle.Make}, <strong>Model: </strong>${vehicle.Model}, <strong>Colour: </strong>${vehicle.Colour}`;

                const owner = fetchedPeople.find(person => person.PersonID === vehicle.OwnerID);
                
                if (owner) 
                {
                    vehicleDiv.innerHTML += `, <strong>Owner's Name: </strong>${owner.Name}, <strong>License Number: </strong>${owner.LicenseNumber}`;
                } 
                else 
                {
                    vehicleDiv.innerHTML += ``;
                }

                results.appendChild(vehicleDiv);
            });

            document.getElementById("message").textContent = "Search successful";
        } 
        else 
        {
            // No matching records found
            document.getElementById("message").textContent = "No matching records found";
        }
    } 
    
    catch (error) 
    {
        console.error("Error:", error.message);
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////