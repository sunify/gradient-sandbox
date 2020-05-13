import lerpColor from '@sunify/lerp-color';
  import lerp from 'lerp';

function between(min, max, n) {
  return Math.max(min, Math.min(max, n));
}

function getWeightT(weights, t) {
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

  return lerp(
    t1,
    t2,
    between(
      0,
      1,
      (t - w1) / (w2 - w1)
    )
  );
}

export function normalizeStops(palette, stops = []) {
  if (palette.length === stops.length) {
    return stops;
  }

  if (stops.length === 0) {
    throw new Error('No stops')
  }

  const missingStopsCount = palette.length - stops.length;
  if (missingStopsCount === 1) {
    return [...stops, 1];
  }

  const result = [...stops];
  const lastStop = last(stops) || 0;
  const step = (1 - lastStop) / (missingStopsCount);

  for (let i = 1; i <= missingStopsCount; i += 1) {
    result.push(lastStop + i * step);
  }

  return result;
}

function last(arr) {
  return arr[arr.length - 1];
}

function first(arr) {
  return arr[0];
}

export function normalizePalette(palette, stops) {
  if (first(stops) === 0 && last(stops) === 1) {
    return [palette, stops];
  }

  palette = [...palette];
  stops = [...stops];

  if (last(stops) < 1) {
    palette.push(last(palette));
    stops.push(1);
  }

  if (first(stops) > 0) {
    palette = [first(palette), ...palette];
    stops = [0, ...stops];
  }

  return [palette, stops];
}

export function makeGradient(palette, stops = []) {
  if (stops.length === 0) {
    return lerpColor(palette);
  }

  [palette, stops] = normalizePalette(
    palette,
    normalizeStops(palette, stops)
  );

  const colors = lerpColor(palette);
  return (t) => {
    const wT = getWeightT(stops, t);
    return colors(Math.min(1, wT));
  };
}