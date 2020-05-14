<script>
  import { createEventDispatcher } from 'svelte/internal';
  import { between } from './utils';

  export let value;
  export let palette;
  export let availableColors;

  const dispatch = createEventDispatcher();

  let container;
  let draggingEl;
  let startX;
  let originalValue;
  let draggingIndex;
  let selectedColor;

  let colorPickerPos = null;

  function swap(arr, i1, i2) {
    return Object.assign([...arr], {
      [i1]: arr[i2],
      [i2]: arr[i1]
    });
  }

  function handleMouseMove(e) {
    if (draggingEl) {
      e.preventDefault();
      const width = container.getBoundingClientRect().width;
      const min = value[draggingIndex - 1] || 0;
      const max = value[draggingIndex + 1] || 1;
      let newValue = between(
        0,
        1,
        originalValue + (e.pageX - startX) / width
      );

      if (newValue === min && newValue > 0) {
        newValue -= 0.01;
      }

      if (newValue === max && newValue < 1) {
        newValue += 0.01;
      }

      const stops = Object.assign([...value], {
        [draggingIndex]: newValue
      }).sort((a, b) => a - b);

      let newIndex = draggingIndex;
      if (newValue < min) {
        newIndex -= 1;
      } else if (newValue > max) {
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
    colorPickerPos = newValue;
  }

  function handleColorClick(e, color) {
    for (let i = value.length - 1; i >= 0; i -= 1) {
      if (colorPickerPos > value[i]) {
        dispatch('input', {
          stops: [
            ...value.slice(0, i + 1),
            colorPickerPos,
            ...value.slice(i + 1)
          ],
          palette: [
            ...palette.slice(0, i + 1),
            color,
            ...palette.slice(i + 1)
          ]
        });
        colorPickerPos = null;
        break;
      }
    }
  }

  function handleClick(e, i) {
    if (e.altKey) {
      e.preventDefault();
      dispatch('input', {
        stops: [
          ...value.slice(0, i),
          ...value.slice(i + 1)
        ],
        palette: [
          ...palette.slice(0, i),
          ...palette.slice(i + 1)
        ]
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
      colorPickerPos = null;
    }
  }

  $: getCursor = (i) => {
    if (altPressed) {
      return 'not-allowed';
    }
    if (draggingIndex === i && draggingEl) {
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
    height: 4px;
    background-color: #ccc;
    position: absolute;
    top: 50%;
    margin-top: -2px;
    left: 0;
    right: 0;
    cursor: cell;
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

  .colorPicker {
    position: absolute;
    top: 50%;
    width: 60px;
    transform: translate(-50%, 0);
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.3) 0 0 2px;
  }

  .colorPicker div {
    margin: 5px;
    height: 20px;
    cursor: pointer;
    background-color: currentColor;
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
        on:mousedown={e => handleMouseDown(e, i)}
        on:click={e => handleClick(e, i)}
        style="
          left: {stop * 100}%;
          color: {palette[i]};
          z-index: {draggingIndex === i ? 2 : 1};
          cursor: {getCursor(i)};
        "
        class="stop" />
    {/each}

    {#if colorPickerPos !== null}
      <div class="colorPicker" style="left: {colorPickerPos * 100}%;">
        {#each availableColors as color}
          <div style="color: {color}" on:click={e => handleColorClick(e, color)} />
        {/each}
        <div style="color: {selectedColor}" on:click={e => handleColorClick(e, selectedColor)} />

        <div>
          <input type="color" bind:value={selectedColor} />
        </div>
      </div>
    {/if}

    <div class="bar" on:click={handleAdd} />
  </div>
</div>