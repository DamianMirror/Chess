const gameboard = document.querySelector("#gameboard")
const player = document.querySelector("#player")
const info = document.querySelector("#info-display")

const width = 8

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard(){
    startPieces.forEach((startPiece, i) =>{
        const square = document.createElement("div")
        square.classList.add("square")
        square.innerHTML = startPiece
        square.firstChild && square.firstChild.setAttribute("draggable", "true")
        square.setAttribute("square-id", i)
        
        const row = Math.floor((63 - i) / 8) + 1
        if(row % 2 === 0){
            square.classList.add(i % 2 === 0 ? "biege" : "brown")
        }
        else{
            square.classList.add(i % 2 === 0 ? "brown" : "biege")
        }

        if(i <= 15){
            square.classList.add("player1-color")
        }
        else if(i >= 48){
            square.classList.add("player2-color")
        }

        gameboard.append(square)
    })
}

createBoard()

const allSquares = document.querySelectorAll("#gameboard .piece")

allSquares.forEach(square => {
    square.addEventListener("dragstart", dragStart)
}
