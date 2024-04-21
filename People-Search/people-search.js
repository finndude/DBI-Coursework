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

//CODE TO MAKE IT SO ONLY ONE INPUT BOX CAN BE USED AT A TIME - COMMENTED OUT TO MEET REQUIREMENTS
//document.getElementById("name").addEventListener("input", () => 
//{
//    const nameInput = document.getElementById("name");
//    const licenseInput = document.getElementById("license");
//    
//    if (nameInput.value.trim() !== '') // Check if the driver name input field is not empty
//    {
//        licenseInput.disabled = true; // Disable the license number input field
//    } 
//    else 
//    {
//        licenseInput.disabled = false; // Enable the license number input field
//    }
//});

///////////////////////////////////////////////////////////////////////////////////////////////////


//CODE TO MAKE IT SO ONLY ONE INPUT BOX CAN BE USED AT A TIME - COMMENTED OUT TO MEET REQUIREMENTS
//document.getElementById("license").addEventListener("input", () => 
//{
//    const nameInput = document.getElementById("name");
//    const licenseInput = document.getElementById("license");
//    
//    if (licenseInput.value.trim() !== "") // Check if the license number input field is not empty
//    {
//        nameInput.disabled = true; // Disable the driver name input field
//    } 
//    else 
//    {
//        nameInput.disabled = false; // Enable the driver name input field
//    }
//});

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("peopleSearchForm").addEventListener("submit", async (event) => 
{
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const license = document.getElementById("license").value;
    const results = document.querySelector(".results");

/////////////////////////////////////////////////

    if (name.trim() === "" && license.trim() === "") //If both boxes empty
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
        resultsHeading.textContent = "Search Results";

        results.appendChild(resultsHeading); // Append the resultsHeading to the .results div
        
        document.getElementById("message").textContent = "Error";
        
        //CODE TO CLEAR TEXT AFTER 2.5S
        //setTimeout(() => 
        //{
        //    document.getElementById("message").textContent = "";
        //}, 2500);
        
        return;
    } 

    else if (name.trim() !== "" && license.trim() !== "") //If both boxes have text
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
        resultsHeading.textContent = "Search Results";

        results.appendChild(resultsHeading); // Append the resultsHeading to the .results div
        
        document.getElementById("message").textContent = "Error";
  
        //CODE TO CLEAR TEXT AFTER 2.5S
        //setTimeout(() => 
        //{
        //    document.getElementById("message").textContent = "";
        //}, 2500);

        return;
    }

/////////////////////////////////////////////////

    else if (name.trim() !== "")
    {
        const searchTerm = name.toLowerCase(); // Convert the input and the names in the database to lowercase for case-insensitive comparison


        const searchResults = fetchedData.filter(person => // Filter the fetched data based on the search term
        {
            const fullName = `${person.Name}`.toLowerCase(); // Convert each person's name to lowercase for comparison
            
            return fullName.includes(searchTerm); // Check if the search term is included in the person's name
        });


        results.innerHTML = ""; // Clear any existing content inside the .results div

        //const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
        //resultsHeading.textContent = "Search Results";

        //results.appendChild(resultsHeading); // Append the resultsHeading to the .results div

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
            searchResults.forEach(person => // Loop through each search result and display it
            {
                const personInfo = document.createElement("p");
                personInfo.innerHTML = `<p>Name: ${person.Name}, Address: ${person.Address}, DOB: ${person.DOB}, License Number: ${person.LicenseNumber}, Expiry Date: ${person.ExpiryDate}</p>`;
                results.appendChild(personInfo);
            });

            document.getElementById("message").textContent = "Search successful";
        }
    }
    
/////////////////////////////////////////////////

    else if (license.trim() !== "")
    {
        const searchTerm = license.toLowerCase(); // Convert the input and the license numbers in the database to lowercase for case-insensitive comparison


        const searchResults = fetchedData.filter(person => // Filter the fetched data based on the search term
        {
            const personLicenseNumber = `${person.LicenseNumber}`.toLowerCase(); // Convert each person's license number to lowercase for comparison
            
            return personLicenseNumber.includes(searchTerm); // Check if the search term is included in the person's license number
        });

        
        results.innerHTML = ""; // Clear any existing content inside the .results div

        //const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
        //resultsHeading.textContent = "Search Results";

        //results.appendChild(resultsHeading); // Append the resultsHeading to the .results div

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
            searchResults.forEach(person => // Loop through each search result and display it
            {
                const personInfo = document.createElement("p");
                personInfo.innerHTML = `<p>Name: ${person.Name}, Address: ${person.Address}, DOB: ${person.DOB}, License Number: ${person.LicenseNumber}, Expiry Date: ${person.ExpiryDate}</p>`;
                results.appendChild(personInfo);
            });

            document.getElementById("message").textContent = "Search successful";
        }
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////