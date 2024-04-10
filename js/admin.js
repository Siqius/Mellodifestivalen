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
    let votes = document.querySelector("input[name='votes']").value;
    if(artistname == "" || songname == "" || songurl == "" || artistbackground == "" || contest == "" || votes == "") {
        alert("Var vänlig fyll i alla rutor.");
        return;
    }
    if(contest != "1" && contest != "2" && contest != "3") {
        alert(`Deltävling "${contest}" existerar inte (1-3).`)
    }

    const response = await fetchData("../admin/handleRequests.php/", {artistname: artistname, songname: songname, songurl: songurl, artistbackground: artistbackground, contest: contest, votes: votes, addcontender: true});
    console.log(response);
}

async function retrieveContest(contest) {
    let response = await fetchData("../admin/handleRequests.php/", {retrievecontest: true, contest: contest});
    response = JSON.parse(response);
    console.log(response);
    let body = document.querySelector("#content");
    body.innerHTML = "";
    response.forEach(contest => {
        let wrapper = document.createElement("div");
        let artistname = document.createElement("h1");
        artistname.innerHTML = contest["artistname"];
        let songname = document.createElement("h2");
        songname.innerHTML = contest["songname"];
        let background = document.createElement("h3");
        background.innerHTML = contest["background"];
        let votes = document.createElement("h3");
        votes.innerHTML = contest["votes"];
        let video = document.createElement("iframe");
        video.referrerPolicy = "no-referrer-when-downgrade";
        video.src = 'https://www.youtube.com/watch?v=rZahRB65BfY';
        video.title = contest["songname"];
        wrapper.appendChild(artistname);
        wrapper.appendChild(songname);
        wrapper.appendChild(background);
        wrapper.appendChild(votes);
        wrapper.appendChild(video);
        body.appendChild(wrapper);
        console.log("Done?")
    })
    
}