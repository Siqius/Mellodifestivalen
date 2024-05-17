var songsOnContest;

async function fetchData(fetchUrl, objectToSend) {
    try {
        let formData = new FormData();
        for (let key in objectToSend) {
            formData.append(key, objectToSend[key]);
        }

        let response = await fetch(fetchUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        var resultFromPHP = await response.text();
        return resultFromPHP;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function addContender() {
    let artistname = document.querySelector("input[name='artistname']").value;
    let songname = document.querySelector("input[name='songname']").value;
    let artistimage = document.querySelector("input[name='artistimage']").value;
    let songurl = document.querySelector("input[name='songurl']").value;
    let artistbackground = document.querySelector("input[name='artistbackground']").value;
    let contest = document.querySelector("input[name='contest']").value;
    let votes = document.querySelector("input[name='votes']").value;
    if(artistname == "" || songname == "" || artistimage == "" || songurl == "" || artistbackground == "" || contest == "" || votes == "") {
        alert("Var vänlig fyll i alla rutor.");
        return;
    }
    try {
        let url = songurl.split("=")[1];
        if(url.indexOf("&") != -1) {
            url = url.split("&")[0];
        }
    } catch(error) {
        alert("Invalid länk, kopiera youtube url vid adressfält");
        return;
    }
    if(contest != "1" && contest != "2" && contest != "3") {
        alert(`Deltävling "${contest}" existerar inte (1-3).`);
    }
    var full = await fetchData("../admin/handlerequests.php/", {retrievecontest: true, contest: contest});
    var full = JSON.parse(full);
    if(full.length >= 6) {
        alert(`maximalt nummer med bidrag på deltävling ${contest} (6 bidrag)`);
        return;
    }
    
    var response = await fetchData("../admin/handlerequests.php/", {artistname: artistname, songname: songname, artistimage:artistimage, songurl: songurl, artistbackground: artistbackground, contest: contest, votes: votes, addcontender: true});
    retrieveContest(parseInt(contest));
}

async function deleteContender(ID, contest) {
    var response = await fetchData("../admin/handlerequests.php/", {deletecontender: true, ID:ID});
    if(response == "SUCCESS") retrieveContest(contest);
}

async function retrieveContest(contest) {
    let response = await fetchData("../admin/handlerequests.php/", {retrievecontest: true, contest: contest});
    response = JSON.parse(response);
    let body = document.querySelector("#content");
    body.innerHTML = "";
    let loadingdiv = document.createElement("div");
    loadingdiv.classList.add("loading");
    for(let i = 0; i < 6; i++) {
        let loadingspan = document.createElement("span");
        loadingdiv.appendChild(loadingspan);
    }
    body.appendChild(loadingdiv);
    body.style.gridTemplateColumns = "1fr";
    document.querySelector(".loading").style.display = "flex";
    setTimeout(() => {
        let wrappers = [...document.querySelectorAll(".whileloading")];
        document.querySelector(".loading").style.display = "none";
        body.style.gridTemplateColumns = "repeat(2, 1fr)";
        wrappers.forEach((div) => {
            div.classList.remove("whileloading")
        })
    },5000)
    songsOnContest = response.length;
    response.forEach(contest => {
        let wrapper = document.createElement("div");
        let artistname = document.createElement("h1");
        artistname.innerHTML = contest["artistname"];
        let songname = document.createElement("h2");
        songname.innerHTML = contest["songname"];
        let background = document.createElement("h3");
        background.innerHTML = contest["background"];
        let votes = document.createElement("h3");
        votes.innerHTML = `${contest["votes"]} röster`;
        let video = document.createElement("iframe");
        video.type = "video/mp4";
        video.src = "https://youtube.com/embed/" + contest["url"].split("=")[1].split("&")[0];
        video.title = contest["songname"];
        video.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; web-share";
        video.referrerPolicy = "strict-origin-when-cross-origin";
        video.allowFullscreen = true;
        let button = document.createElement("button");
        button.onclick = function() {
            deleteContender(contest["ID"], contest["contest"]);
        }
        button.innerHTML = "Ta bort bidrag";
        let image = document.createElement("img");
        image.src = contest["image"];
        wrapper.appendChild(artistname);
        wrapper.appendChild(songname);
        wrapper.appendChild(background);
        wrapper.appendChild(votes);
        wrapper.appendChild(video);
        wrapper.appendChild(image)
        wrapper.appendChild(button);
        wrapper.classList.add("whileloading");
        body.appendChild(wrapper);
    })
}