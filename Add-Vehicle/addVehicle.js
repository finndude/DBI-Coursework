import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

let fetchedVehicles; // Define a global variable to hold the fetched data
let fetchedPeople; // Define a global variable to hold the fetched data
let maxPersonID = 0;

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
    
    const rego = document.getElementById("rego").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const colour = document.getElementById("colour").value;
    const owner = document.getElementById("owner").value;
    const results = document.querySelector(".results");

    if (rego.trim() === "" || make.trim() === "" || model.trim() === "" || colour.trim() === "" || owner.trim() === "") 
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element
        resultsHeading.textContent = "Result";

        
        const enterValuesText = document.createElement("p"); // Create a new paragraph element for the "Enter values" text
        enterValuesText.textContent = "Please enter the data you would like to add";

        results.appendChild(resultsHeading); // Append the resultsHeading and enterValuesText to the .results div
        results.appendChild(enterValuesText);
        
        setTimeout(() => // Reset the text content after 5 seconds
        {
            results.removeChild(enterValuesText); // Remove the enterValuesText
        }, 2500);
        
        return;
    }

/////////////////////////////////////////////////

    else if (rego.trim() !== "" && make.trim() !== "" && model.trim() !== "" && colour.trim() !== "" && owner.trim() !== "") 
    {
        try 
        {
            const { data: existingVehicles, error: fetchError } = await supabase // Check if the regNum already exists in the database
                .from("Vehicles")
                .select("VehicleID")
                .eq("VehicleID", rego);

////////////////////////

            if (fetchError) 
            {
                throw fetchError;
            }

////////////////////////

            if (existingVehicles && existingVehicles.length > 0) // If the regNum exists, display an error message
            {
                const resultText = document.createElement("p"); // Create a new paragraph element for the result
                resultText.textContent = `Registration: ${rego} is already in the database!`;

                results.appendChild(resultText); // Append the result below the existing results heading

                setTimeout(() => // Set a timeout to remove the result after 2.5 seconds
                {
                    results.removeChild(resultText);
                }, 2500);

                return;
            }

////////////////////////
        
            const { data: existingOwner, error: ownerError } = await supabase // Check if the owner already exists
                .from("People")
                .select("PersonID")
                .eq("Name", owner);

////////////////////////

            if (ownerError) 
            {
                throw ownerError;
            }

////////////////////////

            let ownerId;

            if (existingOwner && existingOwner.length > 0) // If the owner exists, use their PersonID
            {
                ownerId = existingOwner[0].PersonID;
            } 
           
////////////////////////

            else 
            {
                // If the owner doesn't exist, prompt for details
                const licenseDiv = document.createElement("div");
                licenseDiv.classList.add("licenseDiv");

                const licenseLabel = document.createElement("label");
                licenseLabel.textContent = "Enter the license number: ";

                const licenseInput = document.createElement("input");
                licenseInput.type = "text";
                licenseInput.id = "licenseNum";

                const submitLicenseBtn = document.createElement("button");
                submitLicenseBtn.textContent = "Submit";
                submitLicenseBtn.addEventListener("click", async () => 
                {
                    const licenseNum = document.getElementById("licenseNum").value;

                    if (licenseNum.trim() !== "") 
                    {
                        try 
                        {
                            fetchedPeople.forEach(person => // Loop through fetchedPeople to find the maximum PersonID
                            {
                                if (person.PersonID > maxPersonID) 
                                {
                                    maxPersonID = person.PersonID;
                                }
                            });

                            const newPersonID = maxPersonID + 1; // Increment maxPersonID by 1 to get the newPersonID

                            // Insert the new person with the provided license number
                            const { data: newOwner, error: insertError } = await supabase 
                                .from("People")
                                .insert([{ PersonID: newPersonID, Name: owner, LicenseNumber: licenseNum }]);

                            if (insertError) 
                            {
                                throw insertError;
                            }

                            ownerId = newPersonID;

                            // Insert the new vehicle with the owner's PersonID
                            const { error } = await supabase.from("Vehicles").insert(
                            {
                                VehicleID: rego,
                                Make: make,
                                Model: model,
                                Colour: colour,
                                OwnerID: ownerId
                            });

                            if (error) 
                            {
                                throw error;
                            }

                            const resultText = document.createElement("p");
                            resultText.textContent = `Successfully added vehicle registration number ${rego}`;
                            results.appendChild(resultText);
                            
                            setTimeout(() => 
                            {
                                results.removeChild(resultText);
                                licenseDiv.remove(); // Remove the license entry box, text, and button
                            }, 2500);
                        } 
                        
                        catch (error) 
                        {
                            const errorMessage = `Error adding vehicle registration number: ${error.message}`;
                            console.error(errorMessage);
                            alert(errorMessage);
                        }

                        maxPersonID = maxPersonID + 1;
                    }
                });

                licenseDiv.appendChild(licenseLabel);
                licenseDiv.appendChild(licenseInput);

                
                licenseDiv.appendChild(document.createTextNode(" ")); //Add space between the input box and the submit button

                licenseDiv.appendChild(submitLicenseBtn);
                results.appendChild(licenseDiv);
                
                return;
            }

////////////////////////

            const { error } = await supabase.from("Vehicles").insert({ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: ownerId }); // Insert the new vehicle with the owner's PersonID

            if (error) 
            {
                throw error;
            }

////////////////////////

            const resultText = document.createElement("p"); // Create a new paragraph element for the result
            resultText.textContent = `Successfully added vehicle with registration number: ${rego}`;;

            results.appendChild(resultText); // Append the result below the existing results heading

            setTimeout(() => // Set a timeout to remove the result after 2.5 seconds
            {
                results.removeChild(resultText);
            }, 2500);

        } 
        
////////////////////////

        catch (error) 
        {
            const errorMessage = `Error adding vehicle registration number: ${error.message}`; // Display error message if insertion fails
            console.error(errorMessage);
            alert(errorMessage); // Optionally display error message in an alert
        }
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////