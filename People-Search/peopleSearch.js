import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://adbhzvvfknicxaxnowok.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh6dnZma25pY3hheG5vd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjYyMTgsImV4cCI6MjAyODM0MjIxOH0.spZ9Df831dq8DIglVvdsbnn6ygk2YL1q7ecG8MvH_zw')

async function fetchData() 
{
    const {data, error} = await supabase.from('People').select();
    console.log('Fetched data:', data);
}

fetchData();

///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById('peopleSearchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const driverName = document.getElementById('driverName').value;
    const licenseNumber = document.getElementById('licenseNumber').value;
    const results = document.querySelector('.results');

    if (driverName.trim() === '' && licenseNumber.trim() === '') {
        results.textContent = 'Please enter values';
        return;
    }

    // Add code here to handle the case where one or both fields are not empty
});