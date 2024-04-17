import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

async function fetchData() 
{
    const {data, error} = await supabase.from("Vehicles").select();
    console.log("Fetched data:", data);
}

fetchData();

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("addVehicleForm").addEventListener("submit", async (event) => 
{
    event.preventDefault();
    
    const regNum = document.getElementById("regNum").value;
    const vehicleMake = document.getElementById("vehicleMake").value;
    const vehicleModel = document.getElementById("vehicleModel").value;
    const vehicleColour = document.getElementById("vehicleColour").value;
    const vehicleOwner = document.getElementById("vehicleOwner").value;
    const results = document.querySelector(".results");

    if (regNum.trim() === "" || vehicleMake.trim() === "" || vehicleModel.trim() === "" || vehicleColour.trim() === "" || vehicleOwner.trim() === "") 
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element
        resultsHeading.textContent = "Result";

        
        const enterValuesText = document.createElement("p"); // Create a new paragraph element for the "Enter values" text
        enterValuesText.textContent = "Please enter the data you would like to add";

        // Append the resultsHeading and enterValuesText to the .results div
        results.appendChild(resultsHeading);
        results.appendChild(enterValuesText);
        
        setTimeout(() => // Reset the text content after 5 seconds
        {
            results.removeChild(enterValuesText); // Remove the enterValuesText
        }, 2500);
        
        return;
    }

    else if (regNum.trim() !== "" && vehicleMake.trim() !== "" && vehicleModel.trim() !== "" && vehicleColour.trim() !== "" && vehicleOwner.trim() !== "")
    {
        try
        {
            const { error } = await supabase.from("Vehicles")
                .insert({ VehicleID: regNum });
        
            if (error) 
            {
                throw error;
            }
        
            results.textContent = `Successfully added vehicle registration number ${regNum}.`;
        } 
        catch (error) 
        {
            results.textContent = `Error adding vehicle registration number: ${error.message}`;
        }
        
    }
        
});
///////////////////////////////////////////////////////////////////////////////////////////////////