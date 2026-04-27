export function formatDelta(current: number, previous: number): { text: string; isPositive: boolean } {
  if (previous === 0) {
    if (current === 0) return { text: '—', isPositive: true };
    return { text: `+${current}`, isPositive: true };
  }
  const percentage = Math.round(((current - previous) / previous) * 100);
  if (percentage === 0) return { text: '—', isPositive: true };
  if (percentage > 0) return { text: `↑ ${percentage}%`, isPositive: true };
  return { text: `↓ ${Math.abs(percentage)}%`, isPositive: false };
}
