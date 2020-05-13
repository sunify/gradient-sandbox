<script>
  import { makeGradient } from './make-gradient';

  export let stepsCount = 10;
  export let palette;
  export let stops = [];
  export let easing = t => t;

  $: gradient = makeGradient(
    palette,
    stops
  );
  $: colors = Array.from(
    { length: stepsCount },
    (_, i) => gradient(easing(i / (stepsCount - 1)))
  );
</script>

<style>
.gradient {
  display: flex;
  height: 100%;
}

.gradient div {
  flex: 1;
}
</style>

<div class="gradient">
  {#each colors as color}
    <div style="background-color: {color}"></div>
  {/each}
</div>