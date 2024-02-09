import { Board } from './minesweeper.js'

const CELL_SIZE = 30;

export function drawBoard(board: Board, cursorRow: number, cursorCol: number, canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = board.cols * CELL_SIZE;
    canvas.height = board.rows * CELL_SIZE;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < board.rows; i++) {
        for (let j = 0; j < board.cols; j++) {
            let color = '#d3d3d3';
            if (i == cursorRow && j == cursorCol) color = '#ff7f7f';
            else if (board.grid[i][j].state == 'hidden') color = 'white';
            else if (board.grid[i][j].state == 'flag') color = '#949494';
            else if (board.grid[i][j].containsMine) color = '#777777';
            colorCell(context, i, j, color);

            if (board.grid[i][j].state == 'flag') writeInCell(context, i, j, 'F');
            else if (board.grid[i][j].state == 'open') {
                if (board.grid[i][j].containsMine) writeInCell(context, i, j, 'X');
                else if (board.grid[i][j].minesSurrounding == 0) writeInCell(context, i, j, '');
                else writeInCell(context, i, j, board.grid[i][j].minesSurrounding.toString());
                    
            }
        }
    }

    drawGridLines(board, canvas, context);
}

function drawGridLines(board: Board, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    for (let i = 1; i < board.rows; i++) {
        context.beginPath();
        context.moveTo(0, i * CELL_SIZE);
        context.lineTo(canvas.width, i * CELL_SIZE);
        context.stroke();
    }

    for (let i = 1; i < board.cols; i++) {
        context.beginPath();
        context.moveTo(i * CELL_SIZE, 0);
        context.lineTo(i * CELL_SIZE, canvas.height);
        context.stroke();
    }
}

function colorCell(context: CanvasRenderingContext2D, i: number, j: number, color: string) {
    context.fillStyle = color;
    context.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function writeInCell(context: CanvasRenderingContext2D, i: number, j: number, content: string) {
    context.font = Math.floor(CELL_SIZE * 0.75) + "px sans-serif";
    context.fillStyle = 'black'
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(content, (j + 0.5) * CELL_SIZE, (i + 0.5) * CELL_SIZE);
}
