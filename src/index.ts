import { Board } from './minesweeper.js'
import { drawBoard } from './draw.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const ROWS = 20;
const COLS = 40;

let board = new Board(ROWS, COLS, 0.25);
let cursorRow = 0;
let cursorCol = 0;

function animate() {
    drawBoard(board, cursorRow, cursorCol, canvas);
    requestAnimationFrame(animate);
}
animate();

document.addEventListener('keydown', event => {
    if (event.key == 'h') cursorCol = Math.max(0, cursorCol - 1);
    else if (event.key == 'l') cursorCol = Math.min(COLS - 1, cursorCol + 1);
    else if (event.key == 'k') cursorRow = Math.max(0, cursorRow - 1);
    else if (event.key == 'j') cursorRow = Math.min(ROWS - 1, cursorRow + 1);
    else if (event.key == 'f') board.placeFlag(cursorRow, cursorCol);
    else if (event.key == ' ') board.open(cursorRow, cursorCol);
});
