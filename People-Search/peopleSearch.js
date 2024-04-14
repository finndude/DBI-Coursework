import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

async function fetchData() 
{
    const {data, error} = await supabase.from("People").select();
    console.log("Fetched data:", data);
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

    if (driverName.trim() === "" && licenseNumber.trim() === "") 
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element
        resultsHeading.textContent = "Results";

        
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

});

///////////////////////////////////////////////////////////////////////////////////////////////////