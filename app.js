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
        square.setAttribute("square-id", i)
        square.classList.add("biege")
        gameboard.append(square)
    })
}

createBoard()
