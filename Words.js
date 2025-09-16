function widthAdjust(text, max=1.0, min=0.1){
    let size = max;
    let parent = text.parentElement;

    text.style.transform = "scaleX(" + size + ")";
    const textWidth = text.getBoundingClientRect().width;
    
    while(textWidth*size > parent.clientWidth-10 && size > min) size -= 0.01;
    
    text.style.transform = "scaleX(" + size + ")";
}

function createLevel(scoreLevel){
    const levelTemplate = document.getElementById("level_template");

    const clone = levelTemplate.content.cloneNode(true);

    const level = clone.querySelector(".leveltext");
    level.textContent = "Score " + scoreLevel + " Level";

    const rail = document.getElementById("rail");
    const whiteBox = document.querySelector(".white-box");

    for(let i=0; i<10; i++){
        rail.appendChild(whiteBox);
    }

    list.appendChild(clone);
}

function createSection(start, stop){
    const sectionTemplate = document.getElementById("section_template");
    
    let i, j;
    
    for(i=start; i<stop; i++){
        const clone = sectionTemplate.content.cloneNode(true);

        const num = clone.querySelector(".numtext");
        num.textContent = i+1;

        const word = clone.querySelector(".wordtext");
        word.textContent = words[i];

        const mean = clone.querySelector(".meantext");
        mean.innerHTML = "";

        const dict = means[i];
        const keys = Object.keys(dict);
        for(j=0; j<keys.length; j++){
            const partNum = dict[keys[j]];

            const _part = document.createElement("span");
            _part.classList.add("parttext");
            _part.textContent = parts[partNum];

            const _mean = document.createElement("span");
            _mean.classList.add("_mean");
            _mean.textContent = keys[j];
            _mean.style.display = "none";

            mean.appendChild(_part);
            mean.appendChild(_mean);
            mean.appendChild(document.createTextNode(" "));
        }

        const meanButton = clone.querySelector(".mean");
        meanButton.addEventListener("click", () => {
            mean.querySelectorAll("._mean").forEach(m => {
                m.style.display = (m.style.display === "none") ? "inline" : "none";
            });

            requestAnimationFrame( () => {
                widthAdjust(mean);
            });
        });

        list.appendChild(clone); 

        widthAdjust(word);
        widthAdjust(mean);
    }
}

function inputData(){
    return fetch("Words.txt")
    .then(res => res.text())
    .then(data => {
        const lines = data.trim().split("\n");
        words = [];
        means = [];

        lines.forEach(line => {
            // 空白で区切る（タブやスペース両対応）
            const tokens = line.trim().split(/\s+/);
            if (tokens.length < 3) return; // 最低でも word + 数字 + 意味 が必要

            const word = tokens[0];
            words.push(word);

            const meanObj = {};
            for(let i=1; i<tokens.length; i+=2){
                const partIndex = parseInt(tokens[i]);
                const meanText = tokens[i+1];
                meanObj[meanText] = partIndex;
            }
            means.push(meanObj);
        });
    })
}

let words = [];
const parts = ["動", "名", "形", "副", "前", "接"];
let means = [];

const list = document.getElementById("list");

inputData().then(() => {
    createLevel(600);
    createSection(0, 5);

    list.appendChild(document.createElement("br"));
    
    createLevel(730);
    createSection(5, 10);

    list.appendChild(document.createElement("br"));

    createLevel(850);
    createSection(10, 15);

    list.appendChild(document.createElement("br"));
    
    createLevel(990);
    createSection(15, 20);
});
