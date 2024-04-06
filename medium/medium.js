var board = [];
var rows =  12;
var columns = 12;
var mines = 20;
var flagEnabled = false
var gameOver = false
var tilesClicked = 0;
var minesLocation = []
var notminesLocation = []
var time = 0;
var count = 0;
let intervalStarted = false;

window.onload = function () {
    divfill();
}

function divfill() {
    document.getElementById("minesc").innerText = mines;
    putmines();
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clicktile);
            tile.addEventListener("click", clicktime);
            tile.addEventListener("contextmenu", rightclicktile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function runtime() {
    if (time < 999) {
        time += 1;
    }
    document.getElementById("time").innerText = time;
}

function clicktime() {
    count += 1;
    console.log(count);
    if (count === 1 && !intervalStarted) {
        intervalStarted = true;
        setInterval(runtime, 1000);
    }
}

function putmines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let position = r + "-" + c;
            notminesLocation.push(position);
        }
    }

    for (let i = 0; i < mines; i++) {
        let id = Math.floor(Math.random() * notminesLocation.length);
        let minePosition = notminesLocation.splice(id, 1)[0];
        minesLocation.push(minePosition);
    }
}

function putflag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("btn-flag").style.backgroundColor = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("btn-flag").style.backgroundColor = "darkgray";
    }
}

function clicktile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }
    let tile = this;
    if (tile.innerText == "🚩") {
        return;
    } else {
        if (minesLocation.includes(tile.id)) {
            gameOver = true;
            revealMines();
            return;
        }
    }
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function rightclicktile(event) {
    event.preventDefault();
    let tile = this;
    if (tile.innerText === "") {
        tile.innerText = "🚩";
        mines -= 1;
        document.getElementById("minesc").innerText = mines;
    } else if (tile.innerText === "🚩") {
        tile.innerText = "";
        mines += 1;
        document.getElementById("minesc").innerText = mines;
    }
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;
    let minesFound = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
                minesFound += checkTile(r + i, c + j);
            }
        }
    }
    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i !== 0 || j !== 0) {
                    checkMine(r + i, c + j);
                }
            }
        }
    }
    if (tilesClicked == rows * columns - mines) {
        document.getElementById("minesc").innerText = "Cleared";
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}