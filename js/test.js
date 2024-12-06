// Example data to be sent to the backend
const data = {
    name: 'John Doe',
    email: 'john.doe@example.com'
};

// Function to send data to the backend
async function saveData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Data saved successfully:', responseData);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// URL of the backend endpoint
const url = 'https://example.com/api/saveData';

// Call the function to save data
saveData(url, data);