import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://adbhzvvfknicxaxnowok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw")

let fetchedVehicles; // Define a global variable to hold the fetched data
let fetchedPeople; // Define a global variable to hold the fetched data
let maxPersonID = 0;

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("addVehicleForm").addEventListener("submit", async (event) => 
{
    event.preventDefault();

/////////////////////////////////////////////////

    const {dataPeople, errorPeople} = await supabase.from("People").select();
    
    if (errorPeople) 
    {
        console.error("Error fetching data:", error.message);
        return;
    }

    fetchedPeople = dataPeople;

/////////////////////////////////////////////////

    const {dataVehicles, errorVehicles} = await supabase.from("Vehicles").select();
    
    if (errorVehicles) 
    {
        console.error("Error fetching data:", error.message);
        return;
    }

    fetchedVehicles = dataVehicles;
 
/////////////////////////////////////////////////

    document.getElementById("message").textContent = "";
    
    const rego = document.getElementById("rego").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const colour = document.getElementById("colour").value;
    const owner = document.getElementById("owner").value;
    const results = document.querySelector("#results");

/////////////////////////////////////////////////

    if (rego.trim() === "" || make.trim() === "" || model.trim() === "" || colour.trim() === "" || owner.trim() === "") 
    {
        results.innerHTML = ""; // Clear any existing content inside the .results div

        const resultsHeading = document.createElement("h2"); // Create a new heading element
        resultsHeading.textContent = "Result";

        //CODE TO SHOW OUTPUT IN RESULTS BOX
        //const enterValuesText = document.createElement("p"); // Create a new paragraph element for the "Enter values" text
        //enterValuesText.textContent = "Please enter the data you would like to add";

        results.appendChild(resultsHeading); // Append the resultsHeading and enterValuesText to the .results div
        //results.appendChild(enterValuesText);
        
        //setTimeout(() => // Reset the text content after 5 seconds
        //{
        //    results.removeChild(enterValuesText); // Remove the enterValuesText
        //}, 2500);
        
        document.getElementById("message").textContent = "Error";

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

                document.getElementById("message").textContent = "Error";

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
                const personForm = document.createElement("div");
                personForm.classList.add("personForm");

/////////

                const idLabel = document.createElement("label");
                idLabel.textContent = "Enter the persons ID: ";

                const idInput = document.createElement("input");
                idInput.type = "text";
                idInput.id = "personid";

/////////          

                const nameLabel = document.createElement("label");
                nameLabel.textContent = "Enter the persons name: ";

                const nameInput = document.createElement("input");
                nameInput.type = "text";
                nameInput.id = "name";

/////////

                const addressLabel = document.createElement("label");
                addressLabel.textContent = "Enter the persons address: ";

                const addressInput = document.createElement("input");
                addressInput.type = "text";
                addressInput.id = "address";

/////////

                const dobLabel = document.createElement("label");
                dobLabel.textContent = "Enter the persons date of birth: ";

                const dobInput = document.createElement("input");
                dobInput.type = "text";
                dobInput.id = "dob";

/////////    

                const licenseLabel = document.createElement("label");
                licenseLabel.textContent = "Enter the persons license number: ";

                const licenseInput = document.createElement("input");
                licenseInput.type = "text";
                licenseInput.id = "license";

///////// 

                const expireLabel = document.createElement("label");
                expireLabel.textContent = "Enter the persons license expiry date: ";

                const expireInput = document.createElement("input");
                expireInput.type = "text";
                expireInput.id = "expire";

///////// 

                const submitPersonDetails = document.createElement("button");
                submitPersonDetails.textContent = "Add owner";
                submitPersonDetails.addEventListener("click", async () => 
                {
                    const personid = document.getElementById("personid").value;
                    const name = document.getElementById("name").value;
                    const address = document.getElementById("address").value;
                    const dob = document.getElementById("dob").value;
                    const license = document.getElementById("license").value;
                    const expire = document.getElementById("expire").value;

                    if (personid.trim() !== "" && name.trim() !== "" || address.trim() !== "" || dob.trim() !== "" || license.trim() !== "" || expire.trim() !== "") 
                    {
                        try 
                        {

                            // CODE TO AUTOINCREMENT ID - IF NEEDED
                            //fetchedPeople.forEach(person => // Loop through fetchedPeople to find the maximum PersonID
                            //{
                            //    if (person.PersonID > maxPersonID) 
                            //    {
                            //        maxPersonID = person.PersonID;
                            //    }
                            //});

                            //const newPersonID = maxPersonID + 1; // Increment maxPersonID by 1 to get the newPersonID

                            // Insert the new person with the provided details
                            const { data: newOwner, error: insertError } = await supabase 
                                .from("People")
                                .insert([{PersonID: personid, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire}]);

                            if (insertError) 
                            {
                                throw insertError;
                            }

                            //ownerId = newPersonID; // RELATED TO AUTOINCREMENT

                            // Insert the new vehicle with the owner's PersonID
                            const { error } = await supabase.from("Vehicles").insert(
                            {
                                VehicleID: rego,
                                Make: make,
                                Model: model,
                                Colour: colour,
                                OwnerID: personid
                            });

                            if (error) 
                            {
                                throw error;
                            }

                            //CODE TO PUT OUTPUT IN RESULTS BOX
                            //const resultText = document.createElement("p");
                            //resultText.textContent = `Successfully added vehicle registration number ${rego}`;
                            //results.appendChild(resultText);

                            document.getElementById("message").textContent = "Vehicle added successfully";
                            personForm.remove();


                            //setTimeout(() => 
                            //{
                            //    results.removeChild(resultText);
                            //    personForm.remove(); // Remove the entry boxes, text, buttons etc
                            //}, 2500);
                        } 
                        
                        catch (error) 
                        {
                            const errorMessage = `Error adding vehicle registration number: ${error.message}`;
                            console.error(errorMessage);
                        }

                        //maxPersonID = maxPersonID + 1; //RELATED TO AUTOINCREMENT
                    }
                });

                personForm.appendChild(idLabel);
                personForm.appendChild(idInput);
                personForm.appendChild(document.createElement("br"));
                personForm.appendChild(document.createElement("br"));

                personForm.appendChild(nameLabel);
                personForm.appendChild(nameInput);
                personForm.appendChild(document.createElement("br"));
                personForm.appendChild(document.createElement("br"));

                personForm.appendChild(addressLabel);
                personForm.appendChild(addressInput);
                personForm.appendChild(document.createElement("br"));
                personForm.appendChild(document.createElement("br"));

                personForm.appendChild(dobLabel);
                personForm.appendChild(dobInput);
                personForm.appendChild(document.createElement("br"));
                personForm.appendChild(document.createElement("br"));

                personForm.appendChild(licenseLabel);
                personForm.appendChild(licenseInput);
                personForm.appendChild(document.createElement("br"));
                personForm.appendChild(document.createElement("br"));

                personForm.appendChild(expireLabel);
                personForm.appendChild(expireInput);
                personForm.appendChild(document.createElement("br"));
                personForm.appendChild(document.createElement("br"));

                personForm.appendChild(submitPersonDetails);
                results.appendChild(personForm);

                return;
            }

////////////////////////

            const { error } = await supabase.from("Vehicles").insert({ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: ownerId }); // Insert the new vehicle with the owner's PersonID

            if (error) 
            {
                throw error;
            }

////////////////////////

            //CODE TO PUT OUTPUT IN RESULTS BOX
            //const resultText = document.createElement("p"); // Create a new paragraph element for the result
            //resultText.textContent = `Successfully added vehicle with registration number: ${rego}`;;

            //results.appendChild(resultText); // Append the result below the existing results heading

            //setTimeout(() => // Set a timeout to remove the result after 2.5 seconds
            //{
            //    results.removeChild(resultText);
            //}, 2500);

            document.getElementById("message").textContent = "Vehicle added successfully";
        } 
        
////////////////////////

        catch (error) 
        {
            const errorMessage = `Error adding vehicle registration number: ${error.message}`; // Display error message if insertion fails
            console.error(errorMessage);
        }
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////