"use strict";

class Sudoku {
    grid = [];
    border = ['─────', '─────', '─────', '─────', '─────', '─────', '─────', '─────', '─────'];

    constructor(board_string, animation_time, indexBoard) {
        this.data = board_string;
        this.animation_time = animation_time;
        this.indexBoard = indexBoard
    }

    solve() {
        this.board(this.data);
        this.printSolution(this.grid);
        this.solveSudoku(this.grid, 0, 0);
    }

    // Returns a string representing the current state of the board
    board(data) {
        for (let i = 0; i < 9; i++) {
            this.grid.push(data.slice((i * 9), (i * 9) + 9).split(""))
        }
        this.transformZero(this.grid);
    }

    transformZero(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === "0") {
                    grid[row][col] = " "
                }
            }
        }
    };

    printSolution(grid) {
        console.clear();
        console.log("Board : " + this.indexBoard);
        console.log("\x1b[34m%s\x1b[0m", " ┌" + this.border.join("┬") + "┐");
        for (let row = 0; row < grid.length; row++) {
            console.log("\x1b[34m │  \x1b[0m" +
                grid[row].join("\x1b[34m  │  \x1b[0m") +
                "\x1b[34m  │ \x1b[0m");
            if (row < grid.length - 1) {
                console.log("\x1b[34m%s\x1b[0m", " ├" + this.border.join("┼") + "┤")
            }
        }
        console.log("\x1b[34m%s\x1b[0m", " └" + this.border.join("┴") + "┘");
    };

    // recursive algo
    solveSudoku(grid, row, col) {
        let cell = this.findUnassignedLocation(grid, row, col);
        row = cell[0];
        col = cell[1];

        this.sleep(this.animation_time);
        this.printSolution(grid);

        // base case: if no empty cell
        if (row === -1) {
            console.log(" SOLVED !!!");
            return true;
        }

        for (let num = 1; num <= 9; num++) {

            if (this.noConflicts(grid, row, col, num.toString())) {
                grid[row][col] = "\x1b[31m" + num.toString() + "\x1b[0m";

                if (this.solveSudoku(grid, row, col)) {
                    return true;
                }
                // mark cell " " if empty
                grid[row][col] = " ";
            }
        }
        // trigger backtracking action
        return false;
    }

    findUnassignedLocation(grid, row, col) {
        let done = false;
        let res = [-1, -1];

        while (!done) {
            if (row === 9) {
                done = true;
            } else {
                if (grid[row][col] === " ") {
                    res[0] = row;
                    res[1] = col;
                    done = true;
                } else {
                    if (col < 8) {
                        col++;
                    } else {
                        row++;
                        col = 0;
                    }
                }
            }
        }

        return res;
    };

    noConflicts(grid, row, col, num) {
        return this.isRowOk(grid, row, num) && this.isColOk(grid, col, num) && this.isBoxOk(grid, row, col, num);
    };

    isRowOk = (grid, row, num) => {
        for (let col = 0; col < 9; col++)
            if (grid[row][col] === num || grid[row][col] === "\x1b[31m" + num + "\x1b[0m")
                return false;

        return true;
    };

    isColOk = (grid, col, num) => {
        for (let row = 0; row < 9; row++)
            if (grid[row][col] === num || grid[row][col] === "\x1b[31m" + num + "\x1b[0m")
                return false;

        return true;
    };

    isBoxOk = (grid, row, col, num) => {
        row = Math.floor(row / 3) * 3;
        col = Math.floor(col / 3) * 3;

        for (let r = 0; r < 3; r++)
            for (let c = 0; c < 3; c++)
                if (grid[row + r][col + c] === num || grid[row][col] === "\x1b[31m" + num + "\x1b[0m")
                    return false;

        return true;
    };

    sleep = (milliseconds) => {
        let start = new Date().getTime();
        for (let i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    };

}


const board_string = [
    '105802000090076405200400819019007306762083090000061050007600030430020501600308900',
    '005030081902850060600004050007402830349760005008300490150087002090000600026049503',
    '105802000090076405200400819019007306762083090000061050007600030430020501600308900',
    '005030081902850060600004050007402830349760005008300490150087002090000600026049503',
    '290500007700000400004738012902003064800050070500067200309004005000080700087005109'
];

let animation_time = 100;
if (process.argv[2]) animation_time = process.argv[2];

for (let i = 0; i < board_string.length; i++) {
    const game = new Sudoku(board_string[i], animation_time, i + 1);
    game.sleep(1000);
    game.solve();
}
