const loop = document.getElementById("loop");
const template = document.getElementById("my_template");

let words = [];
const parts = ["動", "名", "形", "副", "前", "接"];
let means = [];

let tog = false;

function widthAdjust(text, max=40, min=10){
    let size = max;
    let parent = text.parentElement;

    text.style.fontSize = size + "px";
    while(text.scrollWidth > parent.clientWidth-10 && size > min){
        size--;
        text.style.fontSize = size + "px";
    }
}

function toggle(){
    tog = !tog;
    tog ? mean.style.display="block" : mean.style.display="none";
}

function createSection(){
    let i, j;
    
    for(i=0; i<words.length; i++){
        const clone = template.content.cloneNode(true);
        
        clone.querySelector(".numtext").textContent = i+1;

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
            _mean.classList.add("meantext");
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
        });

        loop.appendChild(clone); 

        widthAdjust(word);
        widthAdjust(mean);
    }
}

function inputData(){
    fetch("Words.txt")
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

        createSection();
    })
}

inputData();
