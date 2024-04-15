import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

async function fetchData() 
{
    const {data, error} = await supabase.from("Vehicles").select();
    console.log("Fetched data:", data);
}

fetchData();

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("vehicleSearchForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const numberPlate = document.getElementById("numberPlate").value;
    const results = document.querySelector(".results");

    if (numberPlate.trim() === "") {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element
        resultsHeading.textContent = "Results";

        const enterValuesText = document.createElement("p"); // Create a new paragraph element for the "Enter values" text
        enterValuesText.textContent = "Please enter the data you would like to search for";

        // Append the resultsHeading and enterValuesText to the .results div
        results.appendChild(resultsHeading);
        results.appendChild(enterValuesText);

        return; // Exit the function
    }

    // Add code here to search for the number plate in the fetched data and display the results
});


///////////////////////////////////////////////////////////////////////////////////////////////////