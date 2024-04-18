import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

let fetchedVehicles; // Define a global variable to hold the fetched data
let fetchedPeople; // Define a global variable to hold the fetched data

/////////////////////////////////////////////////

async function fetchVehicles() 
{
    const {data, error} = await supabase.from("Vehicles").select();
    console.log("Fetched Vehicles:", data);

    fetchedVehicles = data;
}

fetchVehicles();

/////////////////////////////////////////////////

async function fetchPeople() 
{
    const {data, error} = await supabase.from("People").select();
    console.log("Fetched People:", data);

    fetchedPeople = data;
}

fetchPeople();


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

/////////////////////////////////////////////////

    else if (regNum.trim() !== "" && vehicleMake.trim() !== "" && vehicleModel.trim() !== "" && vehicleColour.trim() !== "" && vehicleOwner.trim() !== "") 
    {
        try 
        {
            // Check if the regNum already exists in the database
            const { data: existingVehicles, error: fetchError } = await supabase
                .from("Vehicles")
                .select("VehicleID")
                .eq("VehicleID", regNum);

            if (fetchError) 
            {
                throw fetchError;
            }

            // If the regNum exists, display an error message
            if (existingVehicles && existingVehicles.length > 0) 
            {
                // Create a new paragraph element for the result
                const resultText = document.createElement("p");
                resultText.textContent = `Registration: ${regNum} is already in the database!`;

                // Append the result below the existing results heading
                results.appendChild(resultText);

                // Set a timeout to remove the result after 2.5 seconds
                setTimeout(() => 
                {
                    results.removeChild(resultText);
                }, 2500);

                return;
            }

            let ownerId;

            // Check if the owner already exists
            const { data: existingOwner, error: ownerError } = await supabase
                .from("People")
                .select("PersonID")
                .eq("Name", vehicleOwner);

            if (ownerError) 
            {
                throw ownerError;
            }

            // If the owner exists, use their PersonID
            if (existingOwner && existingOwner.length > 0) 
            {
                ownerId = existingOwner[0].PersonID;
            } 
            
            else 
            {
                // If the owner doesn't exist, prompt for license number
                const licenseDiv = document.createElement("div");
                licenseDiv.classList.add("licenseDiv");
                const licenseLabel = document.createElement("label");
                licenseLabel.textContent = "Enter the license number: ";
                const licenseInput = document.createElement("input");
                licenseInput.type = "text";
                licenseInput.id = "licenseNum";
                const submitLicenseBtn = document.createElement("button");
                submitLicenseBtn.textContent = "Submit";
                submitLicenseBtn.addEventListener("click", async () => {
                    const licenseNum = document.getElementById("licenseNum").value;
                    if (licenseNum.trim() !== "") {
                        try {
                            // Generate a random PersonID
                            const personID = Math.floor(Math.random() * 1000000);
                            const { data: newOwner, error: insertError } = await supabase
                                .from("People")
                                .insert([{ PersonID: personID, Name: vehicleOwner, LicenseNumber: licenseNum }]);
                            if (insertError) {
                                throw insertError;
                            }
                            ownerId = personID;
                            // Insert the new vehicle with the owner's PersonID
                            const { error } = await supabase.from("Vehicles").insert({
                                VehicleID: regNum,
                                Make: vehicleMake,
                                Model: vehicleModel,
                                Colour: vehicleColour,
                                OwnerID: ownerId
                            });
                            if (error) {
                                throw error;
                            }
                            const resultText = document.createElement("p");
                            resultText.textContent = `Successfully added vehicle with registration number: ${regNum}`;
                            results.appendChild(resultText);
                            setTimeout(() => {
                                results.removeChild(resultText);
                            }, 2500);
                        } catch (error) {
                            const errorMessage = `Error adding vehicle registration number: ${error.message}`;
                            console.error(errorMessage);
                            alert(errorMessage);
                        }
                    }
                });
                licenseDiv.appendChild(licenseLabel);
                licenseDiv.appendChild(licenseInput);

                // Add space between the input box and the submit button
                licenseDiv.appendChild(document.createTextNode(" ")); // Add a space

                licenseDiv.appendChild(submitLicenseBtn);
                results.appendChild(licenseDiv);
                return;
            }


            // Insert the new vehicle with the owner's PersonID
            const { error } = await supabase.from("Vehicles").insert({ VehicleID: regNum, Make: vehicleMake, Model: vehicleModel, Colour: vehicleColour, OwnerID: ownerId });

            if (error) 
            {
                throw error;
            }

            // Create a new paragraph element for the result
            const resultText = document.createElement("p");
            resultText.textContent = `Successfully added vehicle with registration number: ${regNum}`;;

            // Append the result below the existing results heading
            results.appendChild(resultText);

            // Set a timeout to remove the result after 2.5 seconds
            setTimeout(() => 
            {
                results.removeChild(resultText);
            }, 2500);

        } 
        catch (error) 
        {
            // Display error message if insertion fails
            const errorMessage = `Error adding vehicle registration number: ${error.message}`;
            console.error(errorMessage);
            alert(errorMessage); // Optionally display error message in an alert
        }
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////