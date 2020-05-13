import { normalizeStops, normalizePalette } from './make-gradient';

describe('normalizeStops', () => {
  it('ok', () => {
    expect(
      normalizeStops([1, 2, 3], [0, 0.5, 1])
    ).toEqual([0, 0.5, 1]);
  });

  it('one missing', () => {
    expect(
      normalizeStops([1, 2, 3], [0, 0.5])
    ).toEqual([0, 0.5, 1]);
  });

  it('more missing', () => {
    expect(
      normalizeStops([1, 2, 3], [0])
    ).toEqual([0, 0.5, 1]);

    expect(
      normalizeStops([1, 2, 3, 4, 5], [0])
    ).toEqual([0, 0.25, 0.5, 0.75, 1]);

    expect(
      normalizeStops([1, 2, 3, 4, 5], [0, 0.7])
    ).toEqual([0, 0.7, 0.7999999999999999, 0.9, 1]);
  });

  it('no stops', () => {
    expect(() => {
      normalizeStops([1, 2, 3]);
    }).toThrow('No stops');
  });
});

describe('normalizePalette', () => {
  it('should finish stops and palette', () => {
    expect(
      normalizePalette(
        ['#fc0', '#0cf', '#ff0'],
        [0, 0.3, 0.8]
      )
    ).toEqual([
      ['#fc0', '#0cf', '#ff0', '#ff0'],
      [0, 0.3, 0.8, 1]
    ]);

    expect(
      normalizePalette(
        ['#fc0', '#0cf', '#ff0'],
        [0.3, 0.8, 1]
      )
    ).toEqual([
      ['#fc0', '#fc0', '#0cf', '#ff0'],
      [0, 0.3, 0.8, 1]
    ]);

    expect(
      normalizePalette(
        ['#fc0', '#0cf', '#ff0'],
        [0.3, 0.8, 0.9]
      )
    ).toEqual([
      ['#fc0', '#fc0', '#0cf', '#ff0', '#ff0'],
      [0, 0.3, 0.8, 0.9, 1]
    ]);
  });
})
