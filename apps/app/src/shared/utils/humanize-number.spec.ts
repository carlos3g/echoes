import { humanizeNumber } from './index';

describe('humanizeNumber', () => {
  it('should return small numbers as-is', () => {
    expect(humanizeNumber(0)).toBe('0');
    expect(humanizeNumber(1)).toBe('1');
    expect(humanizeNumber(10)).toBe('10');
    expect(humanizeNumber(100)).toBe('100');
    expect(humanizeNumber(999)).toBe('999');
  });

  it('should abbreviate thousands with "k"', () => {
    expect(humanizeNumber(1000)).toBe('1k');
    expect(humanizeNumber(1500)).toBe('2k');
    expect(humanizeNumber(5000)).toBe('5k');
    expect(humanizeNumber(10000)).toBe('10k');
    expect(humanizeNumber(99999)).toBe('100k');
  });

  it('should abbreviate millions with "m"', () => {
    expect(humanizeNumber(1000000)).toBe('1m');
    expect(humanizeNumber(2500000)).toBe('3m');
    expect(humanizeNumber(10000000)).toBe('10m');
  });

  it('should abbreviate billions with "b"', () => {
    expect(humanizeNumber(1000000000)).toBe('1b');
    expect(humanizeNumber(5000000000)).toBe('5b');
  });

  it('should handle decimal numbers', () => {
    expect(humanizeNumber(1.5)).toBe('1.5');
    expect(humanizeNumber(1500.5)).toBe('1.5k');
    expect(humanizeNumber(1500000.5)).toBe('1.5m');
  });

  it('should handle negative numbers', () => {
    expect(humanizeNumber(-100)).toBe('-100');
    expect(humanizeNumber(-1000)).toBe('-1k');
    expect(humanizeNumber(-1000000)).toBe('-1m');
  });
});
