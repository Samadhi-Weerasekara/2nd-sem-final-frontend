function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://your-backend-endpoint.com/api/data", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            // Process the response data here
        }
    };
    xhr.send();
}

fetchData();