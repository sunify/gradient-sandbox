<script>
  import lerpColor from '@sunify/lerp-color';
  import eases from 'eases';
  import { makeGradient } from './make-gradient';

  const coolorsLink = 'https://coolors.co/fb5012-01fdf6-cbbaed-e9df00-03fcba';
  function parseCoolors (link) {
    return link.replace('https://coolors.co/', '').split('-').map(c => `#${c}`)
  }

  const weights = [0.15, 0.2, 0.3, 0.71, 0.9];
  const palette = parseCoolors(coolorsLink);
  const colorMap = weights.map((w, i) => [w, palette[i]]);

  function shuffle(arr) {
    return arr.sort(() => Math.sign(0.5 - Math.random()));
  }

  let stepsCount = 1100;
  let easing = 'linear';
  $: gradient = makeGradient(
    shuffle(palette),
    weights
  );
  let colors, colors2;
  let approxSteps = 10;
  $: {
    colors = Array.from(
      { length: stepsCount + 1 },
      (_, i) => gradient(eases[easing](i / (stepsCount)))
    );
  }

  $: gradient2 = lerpColor(Array.from(
    { length: approxSteps + 1 },
    (_, i) => gradient(eases[easing](i / approxSteps))
  ));

  $: {
    colors2 = Array.from(
      { length: stepsCount + 1 },
      (_, i) => gradient2(i / (stepsCount))
    );
  }

  function handleKeyUp(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      gradient = makeGradient(
        shuffle(palette),
        weights
      );
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
  .gradient {
    display: flex;
    height: 50vh;
  }

  input {
    width: 300px;
  }

  .gradient div {
    flex: 1;
  }

  .circle {
    position: fixed;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: flex-start
    /* left: 50%;
    top: 50%;

    transform: translate(-50%, -50%); */
  }

  @keyframes rot {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .circle div {
    position: relative;
    /* left: 50%;
    top: 50%; */

    /* border: 1px solid currentColor; */
    /* border-radius: 0 50% 0 50%; */

    /* animation: rot 0.2s linear infinite;
    animation-fill-mode: both; */
  }

  .circle div::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    background: currentColor;
    /* opacity: 0.5; */
    /* border-radius: 0 50% 0 50%; */
  }

  .ui {
    padding: 20px;
  }
</style>
<!--
<div class="circle">
  {#each colors as color, i}
    <div
      style="
        color: {color};
        width: 5px;
        height: 100px;
        animation-delay: {i * 0.3}s;
        animation-duration: {(stepsCount - i) * 0.4}s;
      "
    ></div>
  {/each}
</div> -->

<div class="gradient">
  {#each colors as color}
    <div style="background-color: {color}"></div>
  {/each}
</div>
<div class="gradient">
  {#each colors2 as color}
    <div style="background-color: {color}"></div>
  {/each}
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
    value={`['${Array.from({ length: approxSteps + 1 }, (_, i) => gradient2(i / approxSteps)).join("', '")}']`}
    />
</div>