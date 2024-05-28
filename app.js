const gameboard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const info = document.querySelector("#info-display");

let playerGo = "white";
playerDisplay.textContent = playerGo;

const width = 8;
const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];

function createBoard(){

    for(let row = width; row > 0; row--) {
        let rowArr = [];
        for(let col = 0; col < width; col++) {
            const i = 63 - ((8 - row) * width + (7 - col));

            const startPiece = startPieces[i];
            
            const square = document.createElement("div");
            square.classList.add("square");
            square.innerHTML = startPiece;
            square.firstChild && square.firstChild.setAttribute("draggable", "true");

            square.setAttribute("square-id", i);
            square.setAttribute("square-row", row);
            square.setAttribute("square-col", columns[col]);
            
            if ((row + col) % 2 === 0) {
                square.classList.add("biege");
            } else {
                square.classList.add("brown");
            }

            const piece = square.querySelector('.piece');

            if (row >= 7) {
                if (piece) {
                    piece.classList.add("black");
                }
            } else if (row <= 2) {
                if (piece) {
                    piece.classList.add("white");
                }
            }

            gameboard.append(square);
        }
    }
}

createBoard();

const allPieces = document.querySelectorAll("#gameboard .piece");
const allSquares = document.querySelectorAll("#gameboard .square");

allPieces.forEach(piece => {
    piece.addEventListener("dragstart", dragStartPiece);
    //piece.addEventListener("drop", dragDropPiece);
});

allSquares.forEach(square => {
    square.addEventListener("dragover", dragOver);
    square.addEventListener("drop", dragDrop);
});

let startPosId
let draggedPiece
let startPos

function dragOver(e){
    e.preventDefault();
    const square = e.currentTarget; // Changed from e.target to e.currentTarget
    const row = square.getAttribute("square-row");
    const col = square.getAttribute("square-col");
    const CurrentPos = col + row;
    if(CurrentPos !== 0){
        console.log(`${CurrentPos}`);
    }
}

function dragDrop(e){
    e.preventDefault();
    const square = e.currentTarget;
    const row = square.getAttribute("square-row");
    const col = square.getAttribute("square-col");
    const endPos = col + row;

    // Check if the piece being moved matches the current player's color
    if (draggedPiece.classList.contains(playerGo)) {
        // Check if the square being moved to already contains a piece of the same color
        if (square.firstChild && square.firstChild.classList.contains(playerGo)) {
            return; // Prevent the move
        }

        if ((square !== draggedPiece.parentNode) && checkIfValide(square)) {
            square.innerHTML = '';
            square.appendChild(draggedPiece);
            console.log(`${startPos} ${endPos}`);
            changePlayer();
        }
    }
}

function dragStartPiece(e){
    draggedPiece = e.target;
    const square = draggedPiece.parentNode;
    startPosId = square.getAttribute("square-id");
    const row = square.getAttribute("square-row");
    const col = square.getAttribute("square-col");
    startPos = col + row;
    //console.log(`${startPosId}  ${startPos}`);
}

function changePlayer(){
    playerGo = playerGo === "black" ? "white" : "black";
    playerDisplay.textContent = playerGo;

    //reverse the square-id
    allSquares.forEach(square => {
        const id = square.getAttribute("square-id");
        const reverseId = 63 - id;
        square.setAttribute("square-id", reverseId);
    });
}

function isSquareAttacked(squareId, attackingPlayer) {
    // Iterate over all pieces of the attacking player and check if they can move to squareId
    const allPieces = document.querySelectorAll(`.piece.player${attackingPlayer}-color`);
    for (let piece of allPieces) {
        const pieceSquare = piece.parentElement;
        const pieceId = parseInt(pieceSquare.getAttribute("square-id"), 10);
        const pieceType = piece.getAttribute("id");

        if (canPieceMoveTo(pieceType, pieceId, squareId)) {
            return true; // The square is attacked
        }
    }
    return false; // The square is not attacked
}

function checkIfValide(target){
    
    const targetId = Number(target.getAttribute("square-id"));
    const startId = Number(startPosId);
    const piece = draggedPiece.id;
    console.log(targetId);

    switch(piece){
        case "pawn":
            const starter = [8, 9, 10, 11, 12, 13, 14, 15];
            if(
                ((starter.includes(startId) && (targetId - startId) === 16) && 
                !target.firstChild && !document.querySelector(`[square-id="${startId + width}"]`).firstChild)  ||
                (((targetId - startId) === 8) && !target.firstChild) ||
                (((targetId - startId) === 9) && target.firstChild) ||
                (((targetId - startId) === 7) && target.firstChild)
            ){return true;}
            break;
        case "knight":
            if(
                ((startId + width * 2 + 1) === targetId) ||
                ((startId + width * 2 - 1) === targetId) ||
                ((startId - width * 2 + 1) === targetId) ||
                ((startId - width * 2 - 1) === targetId) ||
                ((startId + width + 2) === targetId) ||
                ((startId + width - 2) === targetId) ||
                ((startId - width + 2) === targetId) ||
                ((startId - width - 2) === targetId)
            ){return true;}
            break;
        case "bishop":
            const diff = targetId - startId;
            if(diff % 7 === 0 || diff % 9 === 0) {
                const step = diff < 0 ? -1 : 1;
                const stepSize = diff % 7 === 0 ? (step * 7) : (step * 9);
                for(let i = startId + stepSize; i !== targetId; i += stepSize) {
                    if(document.querySelector(`[square-id="${i}"]`).firstChild) {
                        return false; // There's a piece in the way
                    }
                }
                return true;
            }
            break;
        case "rook":
            // Check if the rook is moving in a straight line either horizontally or vertically
            if (startId % width === targetId % width || Math.floor(startId / width) === Math.floor(targetId / width)) {
                const step = startId < targetId ? 1 : -1; // Determine the direction of the move
                const stepSize = startId % width === targetId % width ? step * width : step; // Determine the step size based on the direction
        
                // Iterate through each square between startId and targetId
                for (let i = startId + stepSize; i !== targetId; i += stepSize) {
                    if (document.querySelector(`[square-id="${i}"]`).firstChild) {
                        return false; // There's a piece in the way
                    }
                }
                return true; // No pieces in the way, valid move
            }
            break;
        case "queen":
            const diffQueen = targetId - startId;
            if(diffQueen % 7 === 0 || diffQueen % 9 === 0 || diffQueen % 8 === 0 || startId % width === targetId % width || Math.floor(startId / width) === Math.floor(targetId / width)) {
                const stepQueen = diffQueen < 0 ? -1 : 1;
                const stepSizeQueen = diffQueen % 7 === 0 ? (stepQueen * 7) : (diffQueen % 9 === 0 ? (stepQueen * 9) : (diffQueen % 8 === 0 ? (stepQueen * 8) : (startId % width === targetId % width ? stepQueen * width : stepQueen)));
                for(let i = startId + stepSizeQueen; i !== targetId; i += stepSizeQueen) {
                    if(document.querySelector(`[square-id="${i}"]`).firstChild) {
                        return false;
                    }
                }
                return true;
            }
            break;
        case "king":
            const potentialMoves = [
                startId + width + 1,
                startId + width - 1,
                startId - width + 1,
                startId - width - 1,
                startId + width,
                startId - width,
                startId + 1,
                startId - 1
            ];
        
            for (let move of potentialMoves) {
                if (move === targetId && !isSquareAttacked(targetId, 2)) { // Assuming player 1's king is moving and player 2 is the attacker
                    return true;
                }
            }
            break;
    }
    
   //return true;
}
