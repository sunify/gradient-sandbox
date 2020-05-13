<script>
  import lerpColor from '@sunify/lerp-color';
  import lerp from 'lerp';
  import eases from 'eases';

  const coolorsLink = 'https://coolors.co/faa6ff-01fdf6-cbbaed-e9df00-03fcba';
  const parseCoolors = (link) => {
    return link.replace('https://coolors.co/', '').split('-').map(c => `#${c}`)
  }

  const weights = [0, 0.1, 0.6, 0.7, 1];
  const palette = parseCoolors(coolorsLink);
  const colorMap = weights.map((w, i) => [w, palette[i]]);

  const getWeightT = (weights, t, easing) => {
    let step = 0;
    for (let i = 0; i < weights.length - 1; i += 1) {
      const w1 = weights[i];
      const w2 = weights[i + 1];
      if (t >= w1 && t <= w2) {
        step = i;
        break;
      }
    }

    const stepSize = 1 / (weights.length - 1);
    const t1 = (step) * stepSize;
    const t2 = (step + 1) * stepSize;

    const w1 = weights[step];
    const w2 = weights[step + 1];

    return lerp(t1, t2, Math.max(0, Math.min(1, easing((t - w1) / (w2 - w1)))));
  };

  function makeGradient(colorMap, easing = t => t) {
    const colors = lerpColor(colorMap.map(([, c]) => c).sort(() => Math.sign(0.5 - Math.random())));
    const weights = colorMap.map(([w]) => w)
    return (t) => {
      const wT = getWeightT(weights, t, easing);
      return colors(Math.min(1, wT));
    };
  }

  let stepsCount = 1100;
  let easing = 'bounceInOut';
  $: gradient = makeGradient(colorMap, eases[easing]);
  let colors, colors2;
  let approxSteps = 10;
  $: {
    colors = Array.from(
      { length: stepsCount + 1 },
      (_, i) => gradient(i / (stepsCount))
    );
  }

  $: {
    const p2 = lerpColor(Array.from(
      { length: approxSteps + 1 },
      (_, i) => gradient(i / approxSteps)
    ));
    colors2 = Array.from(
      { length: stepsCount + 1 },
      (_, i) => p2(i / (stepsCount))
    );
  }

  function handleKeyUp(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      gradient = makeGradient(colorMap, eases[easing]);
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
</div>