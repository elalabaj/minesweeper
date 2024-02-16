export interface Cell {
    containsMine: boolean;
    minesSurrounding: number;  
    state: 'hidden' | 'open' | 'flag';
}

export class Board {
    rows: number;
    cols: number;
    grid: Cell[][];
    numberOfMines: number;
    gameStarted: boolean = false;

    constructor(rows: number, cols: number, density: number) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array(rows).fill([]).map(() => Array(cols));
        this.numberOfMines = Math.floor(rows * cols * density);
        this.resetBoard();
    }

    resetBoard() {
        for (let i = 0; i < this.rows; i++) 
            for (let j = 0; j < this.cols; j++) 
                this.grid[i][j] = {containsMine: false, minesSurrounding: 0, state: 'hidden'};
        this.gameStarted = false;
    }

    revealWholeBoard() {
        for (let i = 0; i < this.rows; i++) 
            for (let j = 0; j < this.cols; j++) 
                this.grid[i][j].state = 'open';
    }

    getNeighbours(row: number, col: number): {row: number, col: number}[] {
        let neighbours: {row: number, col: number}[] = [];
        for (let i = Math.max(0, row-1); i <= Math.min(this.rows-1, row+1); i++) {
            for (let j = Math.max(0, col-1); j <= Math.min(this.cols-1, col+1); j++) {
                if (i != row || j != col) neighbours.push({row: i, col: j});
            }
        }
        return neighbours;
    }

    placeFlag(row: number, col: number) {
        if (this.grid[row][col].state == 'hidden') this.grid[row][col].state = 'flag';
        else if (this.grid[row][col].state == 'flag') this.grid[row][col].state = 'hidden';
    }

    open(row: number, col: number) {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.fillRandomly({row, col});
        }
        if (this.grid[row][col].state != 'hidden') return;
        if (this.grid[row][col].containsMine) this.revealWholeBoard();
        else {
            this.grid[row][col].state = 'open';
            if (this.grid[row][col].minesSurrounding == 0) {
                this.getNeighbours(row, col).forEach(p => this.open(p.row, p.col));
            }
        }
    }

    fillRandomly(emptyCell: {row: number, col: number}) {
        //create an array with all the cell positions except those surrounding
        //emptyCell
        const withoutBomb = this.getNeighbours(emptyCell.row, emptyCell.col);
        withoutBomb.push(emptyCell);
        const positions: {i: number, j: number}[] = [];
        for (let i = 0; i < this.rows; i++) for (let j = 0; j < this.cols; j++) {
            if (!withoutBomb.some(p => p.row == i && p.col == j)) positions.push({i, j});
        }
        //shuffle the array
        for (let i = positions.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        //place mines in first numberOfMines cells
        for (let i = 0; i < this.numberOfMines; i++) {
            this.grid[positions[i].i][positions[i].j].containsMine = true;
        }
        //calculate number of mines surrounding for every cell
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.getNeighbours(row, col).forEach(p => {
                    if (this.grid[p.row][p.col].containsMine) this.grid[row][col].minesSurrounding++;
                });
            }
        }
    }
}
