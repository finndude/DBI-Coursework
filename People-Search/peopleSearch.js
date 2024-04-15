import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

let fetchedData; // Define a global variable to hold the fetched data

async function fetchData() 
{
    const {data, error} = await supabase.from("People").select();
    console.log("Fetched data:", data);

    fetchedData = data;
}

fetchData();

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("driverName").addEventListener("input", () => 
{
    const driverNameInput = document.getElementById("driverName");
    const licenseNumberInput = document.getElementById("licenseNumber");
    
    if (driverNameInput.value.trim() !== '') // Check if the driver name input field is not empty
    {
        licenseNumberInput.disabled = true; // Disable the license number input field
    } 
    else 
    {
        licenseNumberInput.disabled = false; // Enable the license number input field
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("licenseNumber").addEventListener("input", () => 
{
    const driverNameInput = document.getElementById("driverName");
    const licenseNumberInput = document.getElementById("licenseNumber");
    
    if (licenseNumberInput.value.trim() !== "") // Check if the license number input field is not empty
    {
        driverNameInput.disabled = true; // Disable the driver name input field
    } 
    else 
    {
        driverNameInput.disabled = false; // Enable the driver name input field
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("peopleSearchForm").addEventListener("submit", async (event) => 
{
    event.preventDefault();
    
    const driverName = document.getElementById("driverName").value;
    const licenseNumber = document.getElementById("licenseNumber").value;
    const results = document.querySelector(".results");

/////////////////////////////////////////////////

    if (driverName.trim() === "" && licenseNumber.trim() === "") 
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element
        resultsHeading.textContent = "Search Results";

        
        const enterValuesText = document.createElement("p"); // Create a new paragraph element for the "Enter values" text
        enterValuesText.textContent = "Please enter the data you would like to search for";

        // Append the resultsHeading and enterValuesText to the .results div
        results.appendChild(resultsHeading);
        results.appendChild(enterValuesText);
        
        setTimeout(() => // Reset the text content after 5 seconds
        {
            results.removeChild(enterValuesText); // Remove the enterValuesText
        }, 2500);
        
        return;
    }

/////////////////////////////////////////////////

    else if (driverName.trim() !== "")
    {
        const searchTerm = driverName.toLowerCase(); // Convert the input and the names in the database to lowercase for case-insensitive comparison


        const searchResults = fetchedData.filter(person => // Filter the fetched data based on the search term
        {
            const fullName = `${person.Name}`.toLowerCase(); // Convert each person's name to lowercase for comparison
            
            return fullName.includes(searchTerm); // Check if the search term is included in the person's name
        });


        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
        resultsHeading.textContent = "Search Results";

        results.appendChild(resultsHeading); // Append the resultsHeading to the .results div


        if (searchResults.length === 0) // Check if any results were found
        {
            const noResultsText = document.createElement("p");
            noResultsText.textContent = "No matching records found.";
            results.appendChild(noResultsText);
        } 
        else 
        {
            searchResults.forEach(person => // Loop through each search result and display it
            {
                const personInfo = document.createElement("p");
                personInfo.textContent = `Name: ${person.Name}, Address: ${person.Address}, DOB: ${person.DOB}, License Number: ${person.LicenseNumber}, Expiry Date: ${person.ExpiryDate}`;
                personInfo.innerHTML = `<strong>Name: </strong>${person.Name}, <strong>Address: </strong>${person.Address}, <strong>DOB: </strong>${person.DOB}, <strong>License Number: </strong>${person.LicenseNumber}, <strong>Expiry Date: </strong>${person.ExpiryDate}`;
                results.appendChild(personInfo);
            });
        }
    }
    
/////////////////////////////////////////////////

    else if (licenseNumber.trim() !== "")
    {
        const searchTerm = licenseNumber.toLowerCase(); // Convert the input and the license numbers in the database to lowercase for case-insensitive comparison


        const searchResults = fetchedData.filter(person => // Filter the fetched data based on the search term
        {
            const personLicenseNumber = `${person.LicenseNumber}`.toLowerCase(); // Convert each person's license number to lowercase for comparison
            
            return personLicenseNumber.includes(searchTerm); // Check if the search term is included in the person's license number
        });

        
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
        resultsHeading.textContent = "Search Results";

        results.appendChild(resultsHeading); // Append the resultsHeading to the .results div

        
        if (searchResults.length === 0) // Check if any results were found
        {
            const noResultsText = document.createElement("p");
            noResultsText.textContent = "No matching records found.";
            results.appendChild(noResultsText);
        } 
        else 
        {
            searchResults.forEach(person => // Loop through each search result and display it
            {
                const personInfo = document.createElement("p");
                personInfo.textContent = `Name: ${person.Name}, Address: ${person.Address}, DOB: ${person.DOB}, License Number: ${person.LicenseNumber}, Expiry Date: ${person.ExpiryDate}`;
                personInfo.innerHTML = `<strong>Name: </strong>${person.Name}, <strong>Address: </strong>${person.Address}, <strong>DOB: </strong>${person.DOB}, <strong>License Number: </strong>${person.LicenseNumber}, <strong>Expiry Date: </strong>${person.ExpiryDate}`;
                results.appendChild(personInfo);
            });
        }
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////