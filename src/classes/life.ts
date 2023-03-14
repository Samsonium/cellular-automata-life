import Cell from "./cell";
import CellState from "./cell-state";

/** Cellular automata Life */
class Life {
        
    /** Canvas element */
    private readonly canvas: HTMLCanvasElement;

    /** Canvas redering context */
    private readonly ctx: CanvasRenderingContext2D;
    
    /** Game map */
    private map: Cell[][];

    /** Game map constraints */
    private mapWidth: number;
    private mapHeight: number;

    /** Cell size */
    private cellSize: number;

    /** Is mouse down on canvas */
    private mouseDown: boolean;

    /** Locked to mouse interaction cells */
    private lockedCells: Cell[];

    /** Simulation clock */
    private clock: any;

    /** Simulation state */
    private isSimulating: boolean;

    /**
     * Instantiate cellular automata game
     * @param canvas Game field canvas
     */
    public constructor(canvas: HTMLCanvasElement) {
        this.mouseDown = false;
        this.lockedCells = [];
        this.canvas = canvas;
        
        this.ctx = canvas.getContext('2d');
        this.ctx.strokeStyle = '#000';

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    /**
     * Setup canvas events
     */
    public setupEvents(): void {
        // Mouse movement event while mouse down
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.mouseDown) return;
            e.preventDefault();
            this.handleClick(e.pageX, e.pageY);
            this.draw();
        });

        // Unlock draw on mousedown
        this.canvas.addEventListener('mousedown', () => {
            this.mouseDown = true;
        });

        // Handling by window cause user can stop 
        // pressing mouse button outside the canvas
        window.addEventListener('mouseup', (e: MouseEvent) => {
            this.handleClick(e.pageX, e.pageY);
            this.draw();
            this.mouseDown = false;
            this.lockedCells = [];
        });

        window['life-stats'] = () => {
            let result = '';
            for (let x = 0; x < this.mapWidth; x++) {
                for (let y = 0; y < this.mapHeight; y++) {
                    result += this.map[x][y].state == CellState.alive ? '. ' : '. ';
                }

                result += '\n'
            }
            console.log(result);
        }
    }

    /**
     * Generate map by specified width, height and cell size
     * @param width Map width
     * @param height Map height
     * @param cellSize Cell width and height
     */
    public createMap(width: number, height: number, cellSize: number): void {
        this.mapWidth = width;
        this.mapHeight = height;
        this.cellSize = cellSize;

        // Generate map
        this.map = [];
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (!this.map[x]) this.map[x] = [];
                this.map[x][y] = new Cell();
            }
        }
        
        this.draw();
    }

    /** Draw map method */
    public draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                this.ctx.fillStyle = this.map[x][y].state;

                // Fill cell by his state
                this.ctx.fillRect(
                    x * this.cellSize, 
                    y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
                
                // Draw grid
                this.ctx.strokeRect(
                    x * this.cellSize,
                    y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            }
        }
    }

    /**
     * Handle mouse click on canvas
     * @param mx Mouse x position
     * @param my Mouse y position
     */
    public handleClick(mx: number, my: number): void {
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if (
                    mx >= x * this.cellSize &&
                    mx <= x * this.cellSize + this.cellSize &&
                    my >= y * this.cellSize &&
                    my <= y * this.cellSize + this.cellSize
                ) {
                    const cell = this.map[x][y];
                    if (this.lockedCells.includes(cell))
                        return;

                    if (cell.state == CellState.alive)
                        cell.state = CellState.dead;
                    else cell.state = CellState.alive;

                    this.lockedCells.push(cell);
                }
            }
        }
    }

    /**
     * Get cell neighborhoods
     * @param x X position
     * @param y Y position
     */
    private getAliveNeighborhoodsCount(x: number, y: number): number {
        // Formatted cells array like:
        // xxx
        // x x
        // xxx
        const cells: Cell[] = [
            this.map[x - 1]?.[y - 1], this.map[x]?.[y - 1], this.map[x + 1]?.[y - 1],
            this.map[x - 1]?.[y],                           this.map[x + 1]?.[y],
            this.map[x - 1]?.[y + 1], this.map[x]?.[y + 1], this.map[x + 1]?.[y + 1]
        ];

        return cells.filter((c) => c?.state == CellState.alive).length;
    }

    /**
     * Simulate one step of cellular automata
     */
    private simulationStep(): void {
        const snapshop = Array.from(this.map);
        let aliveCount = 0;

        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                const cell = snapshop[x][y];
                const near = this.getAliveNeighborhoodsCount(x, y);

                // Calculate results
                const born = cell.shouldBorn(near);
                const live = cell.shouldLive(near);

                // Change cell state
                if (cell.state == CellState.dead  && born || cell.state == CellState.alive && live) 
                    cell.state = CellState.alive;
                else cell.state = CellState.dead;

                // Possibly increment alive counter
                if (cell.state == CellState.alive)
                    aliveCount++;
            }
        }

        // this.map = snapshop;
        this.draw();

        if (aliveCount == 0) this.stopSimulation();
    }

    /**
     * Begin simulation process
     * @param interval Pause between steps in ms
     */
    public startSimulation(interval: number): void {
        this.draw();
        this.clock = setInterval(this.simulationStep.bind(this), interval);
        this.isSimulating = true;
    }

    /**
     * Stop simulation
     */
    public stopSimulation(): void {
        clearInterval(this.clock);
        this.isSimulating = false;
    }

    /**
     * Get simulation state
     */
    public get simulating(): boolean {
        return this.isSimulating;
    }
}

export default Life;
