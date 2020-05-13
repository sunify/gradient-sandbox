<script>
  import lerpColor from '@sunify/lerp-color';
  import lerp from 'lerp';
  import eases from 'eases';

  const weights = [0, 0.1, 0.3, 0.7, 1];
  const palette = 'c200fb-ec0868-fc2f00-ec7d10-ffbc0a'.split('-').map(c => `#${c}`);
  const colorMap = weights.map((w, i) => [w, palette[i]]);

  const getWeightT = (weights, t, easing = t => t) => {
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

  function makeGradient(colorMap) {
    const colors = lerpColor(colorMap.map(([, c]) => c).sort(() => Math.sign(0.5 - Math.random())));
    const weights = colorMap.map(([w]) => w)
    return (t) => {
      const wT = getWeightT(weights, t, eases.bounceInOut);
      return colors(Math.min(1, wT));
    };
  }

  let stepsCount = 1100;

  let gradient = makeGradient(colorMap);
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
      gradient = makeGradient(colorMap);
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
    overflow: hidden;
    position: relative;
  }
  .gradient {
    display: flex;
    height: 30vh;
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

<input type="range" min="2" max="1000" step="1" bind:value={approxSteps} />
<br />
Approximation steps: {approxSteps}