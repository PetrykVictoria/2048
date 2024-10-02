const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const SIZE = 4;
const TILE_SIZE = 100;
const PADDING = 10;

let board = [];
let nextTile = 2;
let animationFrameId;
let gameOver = false;

function init() {
    board = createEmptyBoard();
    nextTile = 2; 
    gameOver = false;
    cancelAnimationFrame(animationFrameId); /
    drawBoard();
    drawNextTile();
    console.log(board);
    document.getElementById('gameOverModal').style.display = 'none'; 
}



function createEmptyBoard() {
    let board = [];
    for (let i = 0; i < SIZE; i++) {
        let row = [];
        for (let j = 0; j < SIZE; j++) {
            row.push(0);
        }
        board.push(row);
    }
    return board;
}

function addTileToTop(column) {
    if (gameOver) return false; 
    if (board[SIZE - 1][column] !== 0) { 
        if (board[SIZE - 1][column] === nextTile) {
            board[SIZE - 1][column] *= 2; 
        } else {
            handleGameOver(); 
            return false;
        }
    }
    for (let i = 0; i < SIZE; i++) {
        if (board[i][column] === 0) {
            board[i][column] = nextTile;
            
            if (i > 0 && board[i][column] === board[i - 1][column]) {
                board[i - 1][column] *= 2;
                board[i][column] = 0;
            }
            nextTile = Math.random() < 0.5 ? 2 : 4;
            break;
        }
    }
    return true;
}

function handleGameOver() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'flex'; 
}

function moveTilesUp() {
    for (let j = 0; j < SIZE; j++) {
        let merged = false;
        for (let i = 1; i < SIZE; i++) {
            if (board[i][j] !== 0) {
                let k = i;
                while (k > 0 && board[k - 1][j] === 0) {
                    board[k - 1][j] = board[k][j];
                    board[k][j] = 0;
                    k--;
                }
                if (k > 0 && board[k - 1][j] === board[k][j] && !merged) {
                    board[k - 1][j] *= 2;
                    board[k][j] = 0;
                    merged = true;
                } else {
                    merged = false;
                }
            }
        }
    }
}

function moveTilesLeft() {
    for (let i = 0; i < SIZE; i++) {
        let merged = false;
        for (let j = 1; j < SIZE; j++) {
            if (board[i][j] !== 0) {
                let k = j;
                while (k > 0 && board[i][k - 1] === 0) {
                    board[i][k - 1] = board[i][k];
                    board[i][k] = 0;
                    k--;
                }
                if (k > 0 && board[i][k - 1] === board[i][k] && !merged) {
                    board[i][k - 1] *= 2;
                    board[i][k] = 0;
                    merged = true;
                } else {
                    merged = false;
                }
            }
        }
    }
}

function moveTilesRight() {
    for (let i = 0; i < SIZE; i++) {
        let merged = false;
        for (let j = SIZE - 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
                let k = j;
                while (k < SIZE - 1 && board[i][k + 1] === 0) {
                    board[i][k + 1] = board[i][k];
                    board[i][k] = 0;
                    k++;
                }
                if (k < SIZE - 1 && board[i][k + 1] === board[i][k] && !merged) {
                    board[i][k + 1] *= 2;
                    board[i][k] = 0;
                    merged = true;
                } else {
                    merged = false;
                }
            }
        }
    }
}

function moveTilesDown() {
    for (let j = 0; j < SIZE; j++) {
        let merged = false;
        for (let i = SIZE - 2; i >= 0; i--) {
            if (board[i][j] !== 0) {
                let k = i;
                while (k < SIZE - 1 && board[k + 1][j] === 0) {
                    board[k + 1][j] = board[k][j];
                    board[k][j] = 0;
                    k++;
                }
                if (k < SIZE - 1 && board[k + 1][j] === board[k][j] && !merged) {
                    board[k + 1][j] *= 2;
                    board[k][j] = 0;
                    merged = true;
                } else {
                    merged = false;
                }
            }
        }
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            drawTile(i, j, board[i][j]);
        }
    }
}

function drawTile(x, y, value) {
    ctx.fillStyle = getTileColor(value);
    ctx.fillRect(y * TILE_SIZE + PADDING, x * TILE_SIZE + PADDING, TILE_SIZE - PADDING * 2, TILE_SIZE - PADDING * 2);

    if (value !== 0) {
        ctx.fillStyle = '#776e65';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, y * TILE_SIZE + TILE_SIZE / 2, x * TILE_SIZE + TILE_SIZE / 2);
    }
}



function getTileColor(value) {
    switch (value) {
        case 0: return '#cdc1b4';
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#3c3a32';
    }
}

function drawNextTile() {
    ctx.clearRect(0, canvas.height - TILE_SIZE, canvas.width, TILE_SIZE);


    const centerX = (canvas.width - TILE_SIZE) / 2; 
    const centerY = canvas.height - TILE_SIZE - 10; 

    drawTile(centerY / TILE_SIZE, centerX / TILE_SIZE, nextTile); 
}



function animateTile(column) {
    if (gameOver) return;
    let y = canvas.height - TILE_SIZE;
    let targetRow = SIZE - 1;

   
    for (let i = 0; i < SIZE; i++) {
        if (board[i][column] === 0) {
            targetRow = i;
            break;
        }
    }

    const targetY = targetRow * TILE_SIZE + PADDING; 
    const duration = 500; 
    const startTime = performance.now();

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function step(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuad(progress);
        y = canvas.height - TILE_SIZE - (canvas.height - TILE_SIZE - targetY) * easedProgress;

        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        drawBoard(); 
        drawTile(y / TILE_SIZE, column, nextTile); 

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(step);
        } else {
            if (!addTileToTop(column)) {
                cancelAnimationFrame(animationFrameId);
                return;
            }
            moveTilesUp();
            drawBoard();
            drawNextTile();
            cancelAnimationFrame(animationFrameId);
        }
    }

    animationFrameId = requestAnimationFrame(step);
}

document.addEventListener('keydown', function (event) {
    if (gameOver) return;
    if (event.key === 'ArrowLeft') {
        moveTilesLeft();
        drawBoard();
        drawNextTile();
    } else if (event.key === 'ArrowRight') {
        moveTilesRight();
        drawBoard();
        drawNextTile();
    } else if (event.key === 'ArrowUp') {
        moveTilesUp();
        drawBoard();
        drawNextTile();
    } else if (event.key >= '1' && event.key <= '4') {
        const column = parseInt(event.key) - 1;
        animateTile(column);
    }
});


document.getElementById('modalRestartButton').addEventListener('click', function () {
    cancelAnimationFrame(animationFrameId);
    init();
});

//для кнопки перезапуску на головному екрані
document.getElementById('restartButton').addEventListener('click', function () {
    cancelAnimationFrame(animationFrameId);
    init();
});

init();