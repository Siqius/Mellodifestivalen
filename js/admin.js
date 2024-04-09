async function fetchData(fetchUrl, objectToSend) {
    try {
        let response = await fetch(fetchUrl, {
            method: "POST",
            body: JSON.stringify(objectToSend)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const resultFromPHP = await response.text();
        // Process or use the resultFromPHP as needed
        return resultFromPHP;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function addContender() {
    let artistname = document.querySelector("input[name='artistname']").value;
    let songname = document.querySelector("input[name='songname']").value;
    let songurl = document.querySelector("input[name='songurl']").value;
    let artistbackground = document.querySelector("input[name='artistbackground']").value;
    let contest = document.querySelector("input[name='contest']").value;
    if(artistname == "" || songname == "" || songurl == "" || artistbackground == "" || contest == "") {
        alert("Var vänlig fyll i alla rutor.");
        return;
    }
    if(contest != "1" && contest != "2" && contest != "3") {
        alert(`Deltävling "${contest}" existerar inte (1-3).`)
    }

    const response = await fetchData("../admin/handleRequests.php/", {artistname: artistname, songname: songname, songurl: songurl, artistbackground: artistbackground, contest: contest});
    console.log(response);
}