const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Розміри гри
const SIZE = 4;
const TILE_SIZE = 100;
const PADDING = 10;

// Масив для плиток
let board = [];
let nextTile = 2; // Наступна плитка для запуску
let animationFrameId;

// Ініціалізація гри
function init() {
    board = createEmptyBoard();   // Створюємо порожню дошку
    drawBoard();                  // Малюємо дошку
    drawNextTile();               // Малюємо наступну плитку
    console.log(board);           // Вивести поточну дошку для перевірки
}

// Створює порожню дошку
function createEmptyBoard() {
    let board = [];
    for (let i = 0; i < SIZE; i++) {
        let row = [];
        for (let j = 0; j < SIZE; j++) {
            row.push(0);  // 0 означає порожню плитку
        }
        board.push(row);
    }
    return board;
}

// Додає плитку на верхню позицію в заданому стовпці
function addTileToTop(column) {
    for (let i = 0; i < SIZE; i++) {
        if (board[i][column] === 0) {
            board[i][column] = nextTile;
            nextTile = nextTile === 2 ? 4 : 2; // Змінюємо наступну плитку між 2 і 4
            break;
        }
    }
}

// Переміщує плитки знизу вгору і об'єднує їх
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

// Переміщує плитки вліво і об'єднує їх
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

// Переміщує плитки вправо і об'єднує їх
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

// Переміщує плитки вниз і об'єднує їх
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



// Малює ігрову дошку
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Очищуємо canvas

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            drawTile(i, j, board[i][j]);  // Малюємо кожну плитку
        }
    }
}

// Малює одну плитку на заданій позиції
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

// Вибирає колір для кожної плитки залежно від її значення
function getTileColor(value) {
    switch (value) {
        case 0: return '#cdc1b4';      // Порожня плитка
        case 2: return '#eee4da';      // Плитка 2
        case 4: return '#ede0c8';      // Плитка 4
        case 8: return '#f2b179';      // Плитка 8
        case 16: return '#f59563';     // Плитка 16
        case 32: return '#f67c5f';     // Плитка 32
        case 64: return '#f65e3b';     // Плитка 64
        case 128: return '#edcf72';    // Плитка 128
        case 256: return '#edcc61';    // Плитка 256
        case 512: return '#edc850';    // Плитка 512
        case 1024: return '#edc53f';   // Плитка 1024
        case 2048: return '#edc22e';   // Плитка 2048
        default: return '#3c3a32';     // Інші значення
    }
}

// Малює наступну плитку внизу
function drawNextTile() {
    ctx.clearRect(0, canvas.height - TILE_SIZE, canvas.width, TILE_SIZE);  // Очищуємо нижню частину canvas
    drawTile(SIZE, 1, nextTile);  // Малюємо наступну плитку внизу
}

// Анімація запуску плитки
function animateTile(column) {
    let y = canvas.height - TILE_SIZE;
    const targetY = 0;

    function step() {
        ctx.clearRect(column * TILE_SIZE + PADDING, y, TILE_SIZE - PADDING * 2, TILE_SIZE - PADDING * 2);
        y -= 10;  // Швидкість анімації
        if (y <= targetY) {
            y = targetY;
            addTileToTop(column);
            moveTilesUp();
            drawBoard();
            drawNextTile();
            cancelAnimationFrame(animationFrameId);
        } else {
            drawTile(y / TILE_SIZE, column, nextTile);
            animationFrameId = requestAnimationFrame(step);
        }
    }

    step();
}

// Обробка натискання клавіш
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {  // Ліва стрілка для переміщення вліво
        moveTilesLeft();
        drawBoard();
        drawNextTile();
    } else if (event.key === 'ArrowRight') {  // Права стрілка для переміщення вправо
        moveTilesRight();
        drawBoard();
        drawNextTile();
    } else if (event.key >= '1' && event.key <= '4') {  // Клавіші 1-4 для запуску плитки в відповідний стовпець
        const column = parseInt(event.key) - 1;
        animateTile(column);
    }
});


// Ініціалізація гри
init();
