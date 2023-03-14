import CellState from "./cell-state";

/** Cell data for cellular automata Life */
class Cell {

    /** Cell state */
    private currentState: CellState;

    public constructor() {
        this.currentState = CellState.dead;
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
