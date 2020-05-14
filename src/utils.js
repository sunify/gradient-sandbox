export function between(min, max, n) {
  return Math.max(min, Math.min(max, n));
}

export function swap(arr, i1, i2) {
  return Object.assign([...arr], {
    [i1]: arr[i2],
    [i2]: arr[i1]
  });
}