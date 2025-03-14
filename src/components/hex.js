
export const CELL = {
    EMPTY: 2,
    PLAYER: 0,
    IA: 1
};

export class Hex {
    grid;
    size;
    turn = CELL.PLAYER;
    patternDepart;
    patternArrivee;
    constructor(size) {
        this.grid = [];
        this.size = size;
        let size2 = size * size;
        for (let i = 0; i < size2; i++) {
            this.grid[i] = CELL.EMPTY;
        }
        this.computePatterns();
    }

    getCell(x, y) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) throw new Error("Invalid cell coordinates");
        return this.grid[x + y * this.size];
    }

    play(x, y) {
        this.setCell(x, y, CELL.PLAYER);
        //if (!this.isWon()) {
            this.computeAIMove();
        //}
    }

    setCell(x, y, player) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) throw new Error("Invalid cell coordinates");
        if (player !== CELL.PLAYER && player !== CELL.IA) throw new Error("Invalid player");
        if (this.grid[x + y * this.size] !== CELL.EMPTY) throw new Error("Cell already occupied");
        if (player !== this.turn) throw new Error("Not your turn");
        this.turn = player === CELL.PLAYER ? CELL.IA : CELL.PLAYER;
        this.grid[x + y * this.size] = player;
    }

    computePatterns() {
        this.patternDepart = [[], []];
        this.patternArrivee = [[], []];
        let size2 = this.size * this.size - this.size;
        for (let i = 0; i < this.size; i++) {
            this.patternDepart[0].push(i);
            this.patternArrivee[0].push(size2 + i);
        }

        for (let i = 0; i < this.size; i++) {
            this.patternDepart[1].push(i * this.size);
            this.patternArrivee[1].push(i * this.size + this.size - 1);
        }
    }

    getAdjacentCells(x, y, player) {
        let cells = [];
        if (x > 0 && this.getCell(x - 1, y) === player) cells.push({ x: x - 1, y: y }); // left
        if (x < this.size - 1 && this.getCell(x + 1, y) === player) cells.push({ x: x + 1, y: y }); // right
        if (y > 0 && this.getCell(x, y - 1) === player) cells.push({ x: x, y: y - 1 }); // top left
        if (y < this.size - 1 && this.getCell(x, y + 1) === player) cells.push({ x: x, y: y + 1 }); // bottom right
        if (x < this.size - 1 && y > 0 && this.getCell(x + 1, y - 1) === player) cells.push({ x: x + 1, y: y - 1 }); // top right
        if (x > 0 && y < this.size - 1 && this.getCell(x - 1, y + 1) === player) cells.push({ x: x - 1, y: y + 1 }); // bottom left
        return cells;
    }

    isWon() {
        if (this.isWon(CELL.PLAYER)) return CELL.PLAYER;
        if (this.isWon(CELL.IA)) return CELL.IA;
        return false;
    }

    isWon(player) {
        let casesDepart = this.patternDepart[player];
        let casesArrivee = this.patternArrivee[player];

        for (let i = 0; i < casesDepart.length; i++) {
            var casesAVisiter = [];
            var casesVisitees = [];
            casesAVisiter.push(casesDepart[i]);
            while(casesAVisiter.length > 0) {
                var caseActuelle = casesAVisiter.pop();
                if (casesArrivee.includes(caseActuelle)) {
                    return true;
                }
                casesVisitees.push(caseActuelle);
                var casesAdjacentes = this.getAdjacentCells(caseActuelle % this.size, Math.floor(caseActuelle / this.size), player);
                for (let j = 0; j < casesAdjacentes.length; j++) {
                    var caseAdjacente = casesAdjacentes[j].x + casesAdjacentes[j].y * this.size;
                    if (!casesVisitees.includes(caseAdjacente)) {
                        casesAVisiter.push(caseAdjacente);
                    }
                }
            }
        }
        return false;
    }

    computeAIMove() {
        // play randomly for now
        let emptyCells = [];
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i] === CELL.EMPTY) {
                emptyCells.push(i);
            }
        }
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.setCell(randomCell % this.size, Math.floor(randomCell / this.size), CELL.IA);
    }
}