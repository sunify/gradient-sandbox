<script>
  import { createEventDispatcher } from 'svelte';

  export let availableColors = [];

  const dispatch = createEventDispatcher();

  function handleColorClick(color) {
    dispatch('pick', color);
  }

  let selectedColor;
</script>

<style>
  .colorPicker {
    position: relative;
    width: 60px;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.3) 0 0 2px;
    padding: 10px;
  }

  .color {
    height: 20px;
    cursor: pointer;
    background-color: currentColor;
    margin-bottom: 10px;
  }
</style>

<div class="colorPicker">
  {#each [...availableColors, selectedColor] as color}
    <div class="color" style="color: {color}" on:click={e => handleColorClick(color)} />
  {/each}

  <input type="color" bind:value={selectedColor} />
</div>