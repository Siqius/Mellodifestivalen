var slide = 1;
var allP;
var contests = document.querySelectorAll(".contest");
var allContests = [];
var voteTimeout = false;
var voted = false;
var acceptedcookies = localStorage.getItem("acceptedcookies");
var active;
var timers = document.querySelectorAll(".timertext")

var container = document.createElement("div");
container.classList.add("contestvideocontainer");
let iframe = document.createElement("iframe");
iframe.type = "video/mp4";
iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; web-share";
iframe.referrerPolicy = "strict-origin-when-cross-origin";
iframe.allowFullscreen = true;
iframe.classList.add("contestvideo");
container.appendChild(iframe);
let button = document.createElement("button");
button.onclick = () => {
    closeVideo();
}
button.innerHTML = "Close video";
button.classList.add("contestvideoclose");
container.appendChild(button);

//display accept cookies option if user hasnt accepted cookies yet
if(acceptedcookies) {
    let acccookiesdiv = document.querySelector("#acceptcookiesdiv");
    acccookiesdiv.classList.add("hideacceptcookies");
    voted = localStorage.getItem("voted") ? true : false;
}

//function to send post requests to the server
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

//function to generate the finalists regularly
async function generateFinalists() {
    //find the 2 contestants with most votes from the first 3 contests
    var finals = [{"votes":0},{"votes":0},{"votes":0},{"votes":0},{"votes":0},{"votes":0}];
    allContests = []
    for(let i = 1; i < 4; i++) {
        let response = await fetchData("./admin/handlerequests.php/", {retrievecontest: true, contest: i});
        try{
            response = JSON.parse(response);
            allContests.push(response);
        } catch(error) {}
    }
    let i = 0;
    allContests.forEach(e => {
        e.forEach(contender => {
            if(contender.votes > finals[i].votes) {
                finals[i] = contender;
            }
        });
        i += 2;
    });
    i = 1;
    allContests.forEach(e => {
        e.forEach(contender => {
            if(contender.votes > finals[i].votes && contender != finals[i-1]) {
                finals[i] = contender;
            }
        });
        i += 2;
    });

    // generate the finals using the previous block to find the most voted contestants
    count = 0;
    let imgWrapper = document.querySelector(`.w4`);
    let nameWrapper = document.querySelector(`.anc4`);
    imgWrapper.innerHTML = "";
    nameWrapper.innerHTML = "";
    finals.forEach(finalist => {
        if(finalist.votes == 0) {return;}
        let img = document.createElement("img");
        img.src = finalist.image;
        img.classList.add("imgscroll");
        img.classList.add(`${finalist["ID"]}`)
        imgWrapper.appendChild(img);
        let div = document.createElement("div");

        let button = document.createElement("button");
        button.onclick = () => {
            vote(finalist["ID"], 4);
        }
        button.innerHTML = "Rösta";
        div.appendChild(button);

        let p = document.createElement("p");
        p.innerHTML = finalist.artistname;
        p.classList.add(`p${count}`);
        p.classList.add("animationtext");
        div.appendChild(p);

        nameWrapper.appendChild(div);
        count++;
    });
    // if finals arent filled with contestants, generate temporary ones
    for(count; count < 6; count++) {
        let img = document.createElement("img");
        img.src = "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9mbHVmZnlfY2h1YmJ5X3Bhc3RlbF9jYXRzX2thd2FpaV9hZXN0aGV0aWNfM182YTJkZjRmNS03NTZiLTQyODgtOWQ4Mi1lZmRlMmE1MTA2OWRfMS5qcGc.jpg";
        img.classList.add("imgscroll");
        imgWrapper.appendChild(img);
        
        let div = document.createElement("div");
        let p = document.createElement("p");
        p.innerHTML = `artist ${count+1}`;
        p.classList.add(`p${count}`);
        p.classList.add("animationtext");
        div.appendChild(p)
        nameWrapper.appendChild(div);
    }
}

//retrieve contests from database through server
async function loadContests() {
    //generate the website content using the contests from the database
    for(let i = 1; i<4; i++) {
        let imgWrapper = document.querySelector(`.w${i}`);
        let nameWrapper = document.querySelector(`.anc${i}`);
        let response = await fetchData("./admin/handlerequests.php/", {retrievecontest: true, contest: i});
        count = 0;
        try {
            response = JSON.parse(response);
            allContests.push(response);
            response.forEach(contest => {
                let img = document.createElement("img");
                img.src = contest.image;
                img.classList.add("imgscroll");
                img.classList.add(`${contest["ID"]}`)
                imgWrapper.appendChild(img);
                
                let div = document.createElement("div");

                let button = document.createElement("button");
                button.onclick = () => {
                    vote(contest["ID"], i);
                }
                button.innerHTML = "Rösta";
                div.appendChild(button);

                let p = document.createElement("p");
                p.innerHTML = contest.artistname;
                p.classList.add(`p${count}`);
                p.classList.add("animationtext");
                div.appendChild(p);

                nameWrapper.appendChild(div);
                count++;
            })
        } catch(error) {}
        // if all contests arent filled with contestants, generate temporary ones
        for(count; count < 6; count++) {
            let img = document.createElement("img");
            img.src = "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9mbHVmZnlfY2h1YmJ5X3Bhc3RlbF9jYXRzX2thd2FpaV9hZXN0aGV0aWNfM182YTJkZjRmNS03NTZiLTQyODgtOWQ4Mi1lZmRlMmE1MTA2OWRfMS5qcGc.jpg";
            img.classList.add("imgscroll");
            imgWrapper.appendChild(img);
            
            let div = document.createElement("div");

            let p = document.createElement("p");
            p.innerHTML = `artist ${count+1}`;
            p.classList.add(`p${count}`);
            p.classList.add("animationtext");
            div.appendChild(p);
            nameWrapper.appendChild(div);
        }
    }
    await generateFinalists();
    // initiate the animation
    slide = 1;
    allP = [...document.querySelectorAll(".animationtext")];
    allP.forEach(e => {
        e.style.filter = "blur(1px)";
        if(e.classList.contains("p0")) {
            e.style.transform = "scale(1.2)";
            e.style.filter = "blur(0)";
        }
    })
}

loadContests();

//check a bunch of conditions whether or not user is eligible for voting, if all pass then vote
async function vote(ID, contest) {
    if(voteTimeout) return;
    if(!localStorage.getItem("acceptedcookies")) {
        alert("Accept cookise before voting");
        return;
    }
    let voted = localStorage.getItem("voted");
    if(voted == "true") return;
    if(active != contest) return;
    voteTimeout = true;
    let response = await fetchData("./admin/handlerequests.php/", {"addvote":true, "ID":parseInt(ID)});
    if(response == "SUCCESS") {
        localStorage.setItem("voted", true);
        voteTimeout = false;
        alert("Du har röstat!");
    }
}

//function called when user accepts cookies
function acceptcookies() {
    let acccookiesdiv = document.querySelector("#acceptcookiesdiv");
    acccookiesdiv.classList.add("hideacceptcookies");
    localStorage.setItem("acceptedcookies", true);
    voted = localStorage.getItem("voted") ? true : false;
}

//function called when user denies cookies
function denycookies() {
    let acccookiesdiv = document.querySelector("#acceptcookiesdiv");
    acccookiesdiv.classList.add("hideacceptcookies");
}


async function time() {
    // get local time
    let time = new Date().toLocaleTimeString().split(":");
    let minute = time[1][1];
    let seconds = time[2];

    //contest 1
    if(minute <= 1) {
        // reset vote on new contest
        if(minute == 0 && seconds == 0 && localStorage.getItem("acceptedcookies")) {
            localStorage.setItem("voted", false);
            let response = await fetchData("./admin/handlerequests.php/", {"resetvotes":true});
            generateFinalists();
        }
        
        //set timers for each contest and store the active contest
        timers[0].innerHTML = "";
        timers[1].innerHTML = seconds <= 49 ? `${1 - parseInt(minute)}:${59-parseInt(seconds)}` : `${1 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[2].innerHTML = seconds <= 49 ? `${3 - parseInt(minute)}:${59-parseInt(seconds)}` : `${3 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[3].innerHTML = seconds <= 49 ? `${5 - parseInt(minute)}:${59-parseInt(seconds)}` : `${5 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        for(let i = 1; i < 4; i++) {
            timers[i].closest(".contest").style.filter = "blur(5px)";
        }
        timers[0].closest(".contest").style.filter = "";
        active = 1;
    }

    //contest 2
    else if(minute <= 3) {
        // reset vote on new contest
        if(minute == 2 && seconds == 0 && localStorage.getItem("acceptedcookies")) {
            localStorage.setItem("voted", false);
            generateFinalists();
        }

        //set timers for each contest and store the active contest
        timers[0].innerHTML = seconds <= 49 ? `${9 - parseInt(minute)}:${59-parseInt(seconds)}` : `${9 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[1].innerHTML = "";
        timers[1].closest(".contest").style.filter = "blur(5px)";
        timers[2].innerHTML = seconds <= 49 ? `${3 - parseInt(minute)}:${59-parseInt(seconds)}` : `${3 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[3].innerHTML = seconds <= 49 ? `${5 - parseInt(minute)}:${59-parseInt(seconds)}` : `${5 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        for(let i = 0; i < 4; i++) {
            if(i != 1) {
                timers[i].closest(".contest").style.filter = "blur(5px)";
            }
        }
        timers[1].closest(".contest").style.filter = "";
        active = 2;
    }

    //contest 3
    else if(minute <= 5) {
        // reset vote on new contest
        if(minute == 4 && seconds == 0 && localStorage.getItem("acceptedcookies")) {
            localStorage.setItem("voted", false);
            generateFinalists();
        }
        
        //set timers for each contest and store the active contest
        timers[0].innerHTML = seconds <= 49 ? `${9 - parseInt(minute)}:${59-parseInt(seconds)}` : `${9 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[1].innerHTML = seconds <= 49 ? `${11 - parseInt(minute)}:${59-parseInt(seconds)}` : `${11 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[2].innerHTML = "";
        timers[2].closest(".contest").style.filter = "blur(5px)";
        timers[3].innerHTML = seconds <= 49 ? `${5 - parseInt(minute)}:${59-parseInt(seconds)}` : `${5 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        for(let i = 0; i < 4; i++) {
            if(i != 2) {
                timers[i].closest(".contest").style.filter = "blur(5px)";
            }
        }
        timers[2].closest(".contest").style.filter = "";
        active = 3;
    }

    //contest 4 (finals)
    else {
        // reset vote on new contest
        if(minute == 6 && seconds == 0 && localStorage.getItem("acceptedcookies")) {
            localStorage.setItem("voted", false);
            generateFinalists();
        }
        
        //set timers for each contest and store the active contest
        timers[0].innerHTML = seconds <= 49 ? `${9 - parseInt(minute)}:${59-parseInt(seconds)}` : `${9 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[1].innerHTML = seconds <= 49 ? `${11 - parseInt(minute)}:${59-parseInt(seconds)}` : `${11 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[2].innerHTML = seconds <= 49 ? `${13 - parseInt(minute)}:${59-parseInt(seconds)}` : `${13 - parseInt(minute)}:0${59-parseInt(seconds)}`;
        timers[3].innerHTML = "";
        for(let i = 0; i < 3; i++) {
            timers[i].closest(".contest").style.filter = "blur(5px)";
        }
        timers[3].closest(".contest").style.filter = "";
        active = 4;
    }
}

document.addEventListener("click", (e) => {
    if(e.target.tagName != "IMG") return;
    let ID = e.target.classList[1];
    let url;
    let title;
    allContests.forEach(e => {
        e.forEach(contest => {
            if(contest["ID"] == ID) {
                url = "https://youtube.com/embed/" + contest["url"].split("=")[1].split("&")[0];
                title = contest["songname"];
            }
        })
    })
    container.firstChild.src = url
    container.firstChild.title = title;
    let containerinDOM = document.querySelector(".contestvideocontainer");
    if(containerinDOM == null) {
        document.querySelector("body").appendChild(container);
    }else {
        document.querySelector("body").removeChild(containerinDOM);
        document.querySelector("body").appendChild(container);
    }
})

function closeVideo() {
    let containertoclose = document.querySelector(".contestvideocontainer");
    if(containertoclose != null) {
        document.querySelector("body").removeChild(containertoclose);
    }
}

//animate the artist text and artist images
function animate() {
    allP.forEach(e => {
        e.style.transform = "scale(0.8)";
        e.style.filter = "blur(1px)";
    });
    let imgs = [...document.querySelectorAll(`.imgscroll`)];
    imgs.forEach(e => {
        e.style.transform = `translateX(-${slide*100}%)`;
    });
    let p = [...document.querySelectorAll(`.p${slide}`)];
    p.forEach(e => {
        e.style.transform = "scale(1.2)";
        e.style.filter = "blur(0)";
    });
    slide = slide >= 5 ? 0 : slide + 1;
}

//auto call functions
setInterval(animate, 14000/3);
setInterval(time, 1000);