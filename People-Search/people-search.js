import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

let fetchedData; // Define a global variable to hold the fetched data

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

/////////////////////////////////////////////////

    const {data, error} = await supabase.from("People").select();
    
    if (error) 
    {
        console.error("Error fetching data:", error.message);
        return;
    }

    fetchedData = data;
    
/////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////

    try 
    {
        const { data, error } = await supabase
            .from("People")
            .select();

        if (error) 
        {
            console.error("Error fetching data:", error.message);
            return;
        }

/////////////////////////////////////////////////

        fetchedData = data;

        results.innerHTML = ""; // Clear previous results

        const resultsHeading = document.createElement("h2"); // Create a new heading element for the search results
        resultsHeading.textContent = "Search Results";
        results.appendChild(resultsHeading); // Append the resultsHeading to the .results div

/////////////////////////////////////////////////

        if (name.trim() !== "") 
        {
            const searchTerm = name.toLowerCase(); // Convert the input and the names in the database to lowercase for case-insensitive comparison

            const searchResults = fetchedData.filter(person => 
                person.Name.toLowerCase().includes(searchTerm)
            );

////////////////////////

            if (searchResults.length > 0) 
            {
                searchResults.forEach(person => 
                {
                    const personDiv = document.createElement("div"); // Create a new div for each search result
                    personDiv.classList.add("person-result");

                    const personInfo = document.createElement("p");
                    personInfo.textContent = `Name: ${person.Name}, Address: ${person.Address}, DOB: ${person.DOB}, License Number: ${person.LicenseNumber}, Expiry Date: ${person.ExpiryDate}`;
                    personDiv.appendChild(personInfo);

                    results.appendChild(personDiv); // Append the personDiv to the .results div
                });

                document.getElementById("message").textContent = "Search successful";
            }
            
////////////////////////

            else 
            {
                // No matching records found
                document.getElementById("message").textContent = "No matching records found";
            }
        } 

/////////////////////////////////////////////////

        else if (license.trim() !== "") 
        {
            const searchTerm = license.toLowerCase(); // Convert the input and the license numbers in the database to lowercase for case-insensitive comparison

            const searchResults = fetchedData.filter(person => 
                person.LicenseNumber.toLowerCase().includes(searchTerm)
            );

////////////////////////

            if (searchResults.length > 0) 
            {
                searchResults.forEach(person => 
                {
                    const personDiv = document.createElement("div"); // Create a new div for each search result
                    personDiv.classList.add("person-result");

                    const personInfo = document.createElement("p");
                    personInfo.textContent = `Name: ${person.Name}, Address: ${person.Address}, DOB: ${person.DOB}, License Number: ${person.LicenseNumber}, Expiry Date: ${person.ExpiryDate}`;
                    personDiv.appendChild(personInfo);

                    results.appendChild(personDiv); // Append the personDiv to the .results div
                });

                document.getElementById("message").textContent = "Search successful";
            } 

////////////////////////

            else 
            {
                // No matching records found
                results.innerHTML += "<p>No matching records found</p>";
                document.getElementById("message").textContent = "";
            }
        }
    } 

/////////////////////////////////////////////////

    catch (error) 
    {
        console.error("Error:", error.message);
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////