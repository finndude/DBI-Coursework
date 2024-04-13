import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://adbhzvvfknicxaxnowok.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw')

async function fetchData() 
{
    const {data, error} = await supabase.from('People').select();
    console.log('Fetched data:', data);
}

fetchData();

///////////////////////////////////////////////////////////////////////////////////////////////////

// Wait for the DOM to be fully loaded before executing any code
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    var form = document.getElementById('peopleSearchForm');

    // Add an event listener for the form submission
    form.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the values from the input fields
        var driverName = document.getElementById('driverName').value;
        var licenseNumber = document.getElementById('licenseNumber').value;

        // Log the values to the console for demonstration purposes
        console.log('Driver Name:', driverName);
        console.log('License Number:', licenseNumber);

        // You can perform further actions here, such as sending the data to a server or querying a database
    });
});