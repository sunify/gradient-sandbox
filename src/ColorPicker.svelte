<script>
  import { createEventDispatcher } from 'svelte/internal';

  export let availableColors = [];

  const dispatch = createEventDispatcher();

  function handleColorClick(color) {
    dispatch('pick', color);
  }

  let selectedColor;
</script>

<style>
  .colorPicker {
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

<div class="colorPicker">
  {#each availableColors as color}
    <div style="color: {color}" on:click={e => handleColorClick(color)} />
  {/each}
  <div style="color: {selectedColor}" on:click={e => handleColorClick(selectedColor)} />

  <div>
    <input type="color" bind:value={selectedColor} />
  </div>
</div>