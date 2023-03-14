<script lang="ts">
  import { onMount } from "svelte";
  import Life from "./utils/life";

  let simActive = false;

  let game: Life;
  onMount(() => {
    game = new Life(
      document.querySelector<HTMLCanvasElement>("#game-canvas")
    );
    
    game.createMap(16, 16, 16);
    game.setupEvents();
  });

  /** Switch simulation */
  function switchSimulationState(): void {
    if (game.simulating) game.stopSimulation();
    else game.startSimulation(500);
    
    simActive = game.simulating;
  }
</script>

<!-- DOM -->
<canvas id="game-canvas" />
<button on:click={switchSimulationState}>{ !simActive ? 'Start' : 'Stop' }</button>


<!-- Styles -->
<style>
  canvas#game-canvas {
    width: 100%;
    height: 100%;
  }

  button {
    position: fixed;
    z-index: 2;
    top: 16px;
    right: 16px;
    height: 32px;
    padding: 0 1rem;
    background: #ffa500;
    color: black;
    font: bold 1rem sans-serif;
    border: 2px solid rgba(0, 0, 0, .15);
    border-radius: .5rem;
    cursor: pointer;
  }

  button:hover {
    filter: brightness(90%);
  }

  button:active {
    transform: scale(.99);
  }
</style>
