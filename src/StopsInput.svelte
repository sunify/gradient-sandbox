<script>
  import { createEventDispatcher } from 'svelte/internal';
  import { between } from './utils';

  export let value;
  export let palette;

  const dispatch = createEventDispatcher();

  let container;
  let draggingEl;
  let startX;
  let originalValue;
  let draggingIndex;

  function handleMouseMove(e) {
    if (draggingEl) {
      e.preventDefault();
      const width = container.getBoundingClientRect().width;
      const min = value[draggingIndex - 1] || 0;
      const max = value[draggingIndex + 1] || 1;
      dispatch('input', Object.assign([...value], {
        [draggingIndex]: between(
          min,
          max,
          originalValue + (e.pageX - startX) / width
        )
      }));
    }
  }

  function handleMouseUp() {
    draggingEl = null;
  }

  function handleMouseDown(e, i) {
    e.preventDefault();
    draggingEl = e.target;
    draggingIndex = i;
    startX = e.pageX;
    originalValue = value[i];
  }

  function handleAdd(e) {
    const x = e.pageX - e.target.getBoundingClientRect().left;
    const newValue = x / container.getBoundingClientRect().width;
    for (let i = value.length - 1; i >= 0; i -= 1) {
      if (newValue > value[i]) {
        dispatch('input', [
          ...value.slice(0, i + 1),
          newValue,
          ...value.slice(i + 1)
        ]);
        break;
      }
    }
  }

  function handleClick(e, i) {
    if (e.altKey) {
      e.preventDefault();
      dispatch('input', [
        ...value.slice(0, i),
        ...value.slice(i + 1)
      ]);
    }
  }

  function getCursor(i) {
    if (draggingIndex === i && draggingEl) {
      return 'grabbing';
    }

    return 'grab';
  }
</script>

<style>
  .container {
    padding: 30px 40px;
  }

  .stops {
    position: relative;
    height: 30px;
  }

  .bar {
    position: absolute;
    height: 4px;
    background-color: #ccc;
    position: absolute;
    top: 50%;
    margin-top: -2px;
    left: 0;
    right: 0;
    cursor: crosshair;
  }

  .stop {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: 50%;
    z-index: 1;
    background-color: currentColor;
    border: 3px solid #FFF;
    box-shadow: rgba(0, 0, 0, 0.3) 0 0 2px;
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: grab;
  }
</style>

<svelte:body
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  />

<div class="container">
  <div class="stops" bind:this={container}>
    {#each value as stop, i}
      <div
        on:mousedown={e => handleMouseDown(e, i)}
        on:click={e => handleClick(e, i)}
        style="
          left: {stop * 100}%;
          color: {palette[i]};
          z-index: {draggingIndex === i ? 2 : 1};
          cursor: {draggingIndex === i && draggingEl ? 'grabbing' : 'grab'}
        " class="stop"></div>
    {/each}

    <div class="bar" on:click={handleAdd}></div>
  </div>
</div>