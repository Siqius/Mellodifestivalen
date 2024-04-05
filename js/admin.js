async function fetchData(fetchUrl, objectToSend) {
    try {
        let response = await fetch(fetchUrl, {
            method: "POST",
            body: JSON.stringify(objectToSend)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const resultFromPHP = await response.json();
        // Process or use the resultFromPHP as needed
        return resultFromPHP;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function checklogin() {
    let username = document.querySelector("input[name='user']").value;
    let password = document.querySelector("input[name='pass']").value;
    const response = await fetchData("../admin/admin.php/", {user: username, pass: password});
    console.log(response);
}