var slide = 1;
var allP;

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

async function loadContests() {
    for(i = 1; i<5; i++) {
        let imgWrapper = document.querySelector(`.w${i}`);
        let nameWrapper = document.querySelector(`.anc${i}`)
        let response = await fetchData("./admin/handlerequests.php/", {retrievecontest: true, contest: i});
        console.log(response);
        response = JSON.parse(response);
        count = 0;
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
    slide = 1;
    allP = [...document.querySelectorAll(".artist-name-container p")];
    allP.forEach(e => {
        e.style.filter = "blur(1px)";
        if(e.classList.contains("p0")) {
            e.style.transform = "scale(1.3)";
            e.style.filter = "blur(0)";
        }
    })
}

loadContests();

function animate() {
    console.log(allP);
    allP.forEach(e => {
        e.style.transform = "scale(1)";
        e.style.filter = "blur(1px)";
    });
    let imgs = [...document.querySelectorAll(`.imgscroll`)];
    imgs.forEach(e => {
        e.style.transform = `translateX(-${slide*100}%)`;
    });
    let p = [...document.querySelectorAll(`.p${slide}`)];
    p.forEach(e => {
        e.style.transform = "scale(1.3)";
        e.style.filter = "blur(0)";
    });
    slide += 1;
    if(slide >= 6) {
        slide = 0;
    }
}

setInterval(animate, 14000/3);