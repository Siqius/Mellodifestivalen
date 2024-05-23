var slide = 1;
var allP;
var contests = document.querySelectorAll(".contest");
var allContests = [];

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
        console.log(resultFromPHP);
        return resultFromPHP;
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

//retrieve contests from database
async function loadContests() {
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
                imgWrapper.appendChild(img);
                
                let p = document.createElement("p");
                p.innerHTML = contest.artistname;
                p.classList.add(`p${count}`);
                nameWrapper.appendChild(p);
                count++;
            })
        } catch(error) {}
        for(count; count < 6; count++) {
            let img = document.createElement("img");
            img.src = "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9mbHVmZnlfY2h1YmJ5X3Bhc3RlbF9jYXRzX2thd2FpaV9hZXN0aGV0aWNfM182YTJkZjRmNS03NTZiLTQyODgtOWQ4Mi1lZmRlMmE1MTA2OWRfMS5qcGc.jpg";
            img.classList.add("imgscroll");
            imgWrapper.appendChild(img);
            
            let p = document.createElement("p");
            p.innerHTML = `artist ${count}`;
            p.classList.add(`p${count}`);
            nameWrapper.appendChild(p);
        }
    }
    var finals = [{"votes":0},{"votes":0},{"votes":0},{"votes":0},{"votes":0},{"votes":0}];
    console.log(allContests);
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
                console.log(contender);
                console.log(i);
            }
        });
        i += 2;
    });
    console.log(finals);

    count = 0;
    let imgWrapper = document.querySelector(`.w4`);
    let nameWrapper = document.querySelector(`.anc4`);
    finals.forEach(finalist => {
        if(finalist.votes == 0) {return;}
        let img = document.createElement("img");
        img.src = finalist.image;
        img.classList.add("imgscroll");
        imgWrapper.appendChild(img);
        
        let button = document.createElement("button");
        button.onclick = () => {
            vote(``)
        }

        let p = document.createElement("p");
        p.innerHTML = finalist.artistname;
        p.classList.add(`p${count}`);
        nameWrapper.appendChild(p);
        count++;
    });
    for(count; count < 6; count++) {
        let img = document.createElement("img");
        img.src = "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9mbHVmZnlfY2h1YmJ5X3Bhc3RlbF9jYXRzX2thd2FpaV9hZXN0aGV0aWNfM182YTJkZjRmNS03NTZiLTQyODgtOWQ4Mi1lZmRlMmE1MTA2OWRfMS5qcGc.jpg";
        img.classList.add("imgscroll");
        imgWrapper.appendChild(img);
        
        let p = document.createElement("p");
        p.innerHTML = `artist ${count}`;
        p.classList.add(`p${count}`);
        nameWrapper.appendChild(p);
    }
    
    slide = 1;
    allP = [...document.querySelectorAll(".artist-name-container p")];
    allP.forEach(e => {
        e.style.filter = "blur(1px)";
        if(e.classList.contains("p0")) {
            e.style.transform = "scale(1.2)";
            e.style.filter = "blur(0)";
        }
    })
}

loadContests();

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

document.addEventListener("click", e => {
    console.log(allContests);
    /*
    contests.forEach(e => {
        e.style.transform = "scale(1)";
    })
    div = e.target.closest(".contest");
    div.style.transform = "scale(1.2)";
    div.style.zIndex = "100";
    div.style.position = "sticky";
    */

})

setInterval(animate, 14000/3);