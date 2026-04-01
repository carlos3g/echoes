import { formatDelta } from '@/features/insights/utils/format-delta';

describe('formatDelta', () => {
  it('returns "—" when both current and previous are 0', () => {
    const result = formatDelta(0, 0);
    expect(result.text).toBe('—');
    expect(result.isPositive).toBe(true);
  });

  it('returns "+N" when previous is 0 and current is greater than 0', () => {
    const result = formatDelta(5, 0);
    expect(result.text).toBe('+5');
    expect(result.isPositive).toBe(true);
  });

  it('returns "↑ N%" for a positive change', () => {
    const result = formatDelta(15, 10);
    expect(result.text).toBe('↑ 50%');
    expect(result.isPositive).toBe(true);
  });

  it('returns "↓ N%" for a negative change', () => {
    const result = formatDelta(5, 10);
    expect(result.text).toBe('↓ 50%');
    expect(result.isPositive).toBe(false);
  });

  it('returns "—" when current equals previous (no change)', () => {
    const result = formatDelta(10, 10);
    expect(result.text).toBe('—');
    expect(result.isPositive).toBe(true);
  });

  it('isPositive is true for positive changes', () => {
    expect(formatDelta(20, 10).isPositive).toBe(true);
  });

  it('isPositive is false for negative changes', () => {
    expect(formatDelta(1, 10).isPositive).toBe(false);
  });

  it('handles large percentage changes correctly', () => {
    const result = formatDelta(100, 1);
    expect(result.text).toBe('↑ 9900%');
    expect(result.isPositive).toBe(true);
  });

  it('rounds percentages to the nearest integer', () => {
    // (10 - 3) / 3 * 100 = 233.333... → rounds to 233
    const result = formatDelta(10, 3);
    expect(result.text).toBe('↑ 233%');
    expect(result.isPositive).toBe(true);
  });
});
