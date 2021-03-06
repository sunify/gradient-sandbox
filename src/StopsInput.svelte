<script>
  import ColorPicker from './ColorPicker.svelte';

  import { createEventDispatcher } from 'svelte';
  import { between, swap, insert, remove, set } from './utils';

  export let value;
  export let palette;
  export let availableColors;

  const dispatch = createEventDispatcher();

  let container;
  let dragging = false;
  let draggingIndex;
  let colorPickerPos = null;

  function handleMouseMove(e) {
    if (dragging) {
      e.preventDefault();

      const newPos = between(0, 1, posFromPageX(e.pageX));
      const stops = set(value, newPos, draggingIndex).sort((a, b) => a - b);

      let newIndex = draggingIndex;
      if (newPos < value[draggingIndex - 1]) {
        newIndex -= 1;
      } else if (newPos > value[draggingIndex + 1]) {
        newIndex += 1;
      }

      if (newIndex !== draggingIndex) {
        dispatch('input', {
          stops,
          palette: swap(palette, newIndex, draggingIndex)
        });
        draggingIndex = newIndex;
      } else {
        dispatch('input', { stops });
      }
    }
  }

  function handleMouseUp() {
    dragging = false;
  }

  let mousedownTime;
  function handleStopMouseDown(e, i) {
    e.preventDefault();
    dragging = true;
    draggingIndex = i;
    mousedownTime = Date.now();
  }

  function handleStopMouseUp(e, i) {
    if (Date.now() - mousedownTime < 300 && !e.altKey) {
      colorPickerPos = value[i];
    }
  }

  function openColorPickerAt(value) {
    colorPickerPos = value;
  }

  function closeColorPicker() {
    colorPickerPos = null;
  }

  function posFromPageX(pageX) {
    const { width, left } = container.getBoundingClientRect();
    return (pageX - left) / width;
  }

  function handlePickerOpen(e) {
    openColorPickerAt(posFromPageX(e.pageX));
  }

  function handleColorPick({ detail: color }) {
    if (colorPickerPos !== null) {
      for (let i = value.length - 1; i >= 0; i -= 1) {
        if (colorPickerPos === value[i]) {
          dispatch('input', {
            palette: set(palette, color, i),
          });
          break;
        }

        if (colorPickerPos > value[i]) {
          dispatch('input', {
            stops: insert(value, colorPickerPos, i + 1),
            palette: insert(palette, color, i + 1),
          });
          break;
        }
      }
      closeColorPicker();
    }
  }

  function handleColorClick(e, i) {
    if (e.altKey) {
      e.preventDefault();
      dispatch('input', {
        stops: remove(value, i),
        palette: remove(palette, i)
      });
    }
  }

  let altPressed = false;
  function handleAltPressed(e) {
    altPressed = e.keyCode === 18;
  }

  function handleColorPickerEsc(e) {
    altPressed = false;
    if (e.keyCode === 27) {
      closeColorPicker();
    }
  }

  $: getCursor = (i) => {
    if (altPressed) {
      return 'not-allowed';
    }
    if (draggingIndex === i && dragging) {
      return 'grabbing';
    }

    return 'grab';
  };
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
    height: 6px;
    background-color: #EEE;
    position: absolute;
    top: 50%;
    margin-top: -3px;
    left: 0;
    right: 0;
    cursor: cell;
  }

  .stop {
    width: 10px;
    height: 10px;
    top: 50%;
    z-index: 1;
    background-color: currentColor;
    border: 3px solid #FFF;
    box-shadow: rgba(0, 0, 0, 0.2) 0 0 1px 1px, rgba(0, 0, 0, 1) 0 0 1px inset;
    position: absolute;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .colorPickerDropdown {
    position: absolute;
    z-index: 1;
    top: 50%;
    margin-top: 20px;
    transform: translate(-50%, 0);
  }

  .colorPickerDropdown::before {
    content: '';
    position: absolute;
    left: 50%;
    height: 30px;
    bottom: 100%;
    margin-bottom: -10px;
    width: 1px;
    transform: translateX(-50%);
    background-color: #000000;
  }
</style>

<svelte:body
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:keyup={handleColorPickerEsc}
  on:keydown={handleAltPressed}
  />

<div class="container">
  <div class="stops" bind:this={container}>
    {#each value as stop, i}
      <div
        on:mousedown={e => handleStopMouseDown(e, i)}
        on:mouseup={e => handleStopMouseUp(e, i)}
        on:click={e => handleColorClick(e, i)}
        style="
          left: {stop * 100}%;
          color: {palette[i]};
          z-index: {draggingIndex === i ? 2 : 1};
          cursor: {getCursor(i)};
        "
        class="stop" />
    {/each}

    {#if colorPickerPos !== null}
      <div class="colorPickerDropdown" style="left: {colorPickerPos * 100}%;">
        <ColorPicker
          availableColors={availableColors}
          on:pick={handleColorPick}
          />
      </div>
    {/if}

    <div class="bar" on:click={handlePickerOpen} />
  </div>
</div>