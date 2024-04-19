import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

let fetchedData; // Define a global variable to hold the fetched data
let fetchedPeople; // Define a global variable to hold the fetched data

/////////////////////////////////////////////////

async function fetchData() 
{
    const {data, error} = await supabase.from("Vehicles").select();
    console.log("Fetched Vehicles:", data);

    fetchedData = data;
}

fetchData();

/////////////////////////////////////////////////

async function fetchPeople() 
{
    const {data, error} = await supabase.from("People").select();
    console.log("Fetched People:", data);

    fetchedPeople = data;
}

fetchPeople();

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("vehicleSearchForm").addEventListener("submit", async (event) => 
{
    event.preventDefault();
    
    const rego = document.getElementById("rego").value;
    const results = document.querySelector(".results");

/////////////////////////////////////////////////

    if (rego.trim() === "")
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element
        resultsHeading.textContent = "Search Results";

        
        const enterValuesText = document.createElement("p"); // Create a new paragraph element for the "Enter values" text
        enterValuesText.textContent = "Please enter the data you would like to search for";

        
        results.appendChild(resultsHeading); // Append the resultsHeading and enterValuesText to the .results div
        results.appendChild(enterValuesText);
        
        setTimeout(() => // Reset the text content after 5 seconds
        {
            results.removeChild(enterValuesText); // Remove the enterValuesText
        }, 2500);
        
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
            const noResultsText = document.createElement("p");
            noResultsText.textContent = "No matching records found.";
            results.appendChild(noResultsText);
        } 
        else 
        {
            searchResults.forEach(vehicle => // Loop through each search result and display it
            {
                const vehicleInfo = document.createElement("p");
                vehicleInfo.innerHTML = `<strong>Number Plate: </strong>${vehicle.VehicleID}, <strong>Make: </strong>${vehicle.Make}, <strong>Model: </strong>${vehicle.Model}, <strong>Colour: </strong>${vehicle.Colour}`;

                
                const owner = fetchedPeople.find(person => person.PersonID === vehicle.OwnerID); // Fetch owner details from the People table using OwnerID
                if (owner) 
                {
                    vehicleInfo.innerHTML += `, <strong>Owner's Name: </strong>${owner.Name}, <strong>License Number: </strong>${owner.LicenseNumber}`; // If owner is found, display their name and license number
                } 
                else 
                {
                    vehicleInfo.textContent += `, <strong>Owner's Name: </strong>Unknown, <strong>License Number: </strong>Unknown`; // If owner is not found, indicate that the owner is unknown
                }

                results.appendChild(vehicleInfo);
            });
        }
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////