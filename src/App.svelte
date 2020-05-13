<script>
  import Gradient from './Gradient.svelte';
  import lerpColor from '@sunify/lerp-color';
  import eases from 'eases';
  import { makeGradient } from './make-gradient';

  function shuffle(arr) {
    return arr.sort(() => Math.sign(0.5 - Math.random()));
  }

  const coolorsLink = 'https://coolors.co/fb5012-01fdf6-cbbaed-e9df00-03fcba';
  function parseCoolors(link) {
    return link.replace('https://coolors.co/', '').split('-').map(c => `#${c}`)
  }


  let stops = [0.15, 0.2, 0.3, 0.71, 1];
  let palette = shuffle(parseCoolors(coolorsLink));
  let stepsCount = 1100;
  let easing = 'linear';
  let approxSteps = 10;
  let palette2;

  $: {
    const grad = makeGradient(palette, stops);
    palette2 = Array.from(
      { length: approxSteps + 1 },
      (_, i) => grad(eases[easing](i / approxSteps))
    );
  };

  function handleKeyUp(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      palette = shuffle(palette);
    }
  }

  document.addEventListener('keydown', handleKeyUp);
</script>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .gradient-wrapper {
    height: 50vh;
  }

  input {
    width: 300px;
  }

  .ui {
    padding: 20px;
  }
</style>

<div class="gradient-wrapper">
  <Gradient
    palette={palette}
    stops={stops}
    stepsCount={stepsCount}
    easing={eases[easing]}
    />
</div>

<div class="gradient-wrapper">
  <Gradient
    palette={palette2}
    stepsCount={stepsCount}
    />
</div>

<div class="ui">
  <input type="range" min="2" max="1000" step="1" bind:value={approxSteps} />
  <br />
  Approximation steps: {approxSteps}
  <hr />
  <input type="range" min="5" max="10000" step="1" bind:value={stepsCount} />
  <br />
  Gradient steps: {stepsCount}
  <hr />
  <select bind:value={easing}>
  {#each Object.keys(eases) as easing}
    <option value={easing}>{easing}</option>
  {/each}
  </select>

  <hr />
  <input
    style="width: 100%;"
    type="text"
    readonly
    value={`['${palette2.join("', '")}']`}
    />
</div>