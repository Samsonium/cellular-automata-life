import CellState from "./cell-state";

/** Cell data for cellular automata Life */
class Cell {

    /** Cell state */
    private currentState: CellState;

    public constructor(currentState?: CellState) {
        this.currentState = currentState ?? CellState.dead;
    }

    /**
     * Copy current instance of cell
     */
    public copy(): Cell {
        return new Cell(this.currentState);
    }

    /** 
     * Should cell continue his life
     * @param c Near alive cells count
     */
    public shouldLive(c: number): boolean {
        return [2, 3].includes(c);
    }

    /**
     * Should cell born
     * @param c Near alive cells count
     */
    public shouldBorn(c: number): boolean {
        return c == 3;
    }

    /**
     * Is cell alive currently
     */
    public get state(): CellState {
        return this.currentState;
    }

    /**
     * Set cell state
     */
    public set state(value: CellState) {
        this.currentState = value;
    }
}

export default Cell;
