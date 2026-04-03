import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { InsightsResponse } from '@/features/insights/contracts/insights-service.contract';

function toCsv(headers: string[], rows: string[][]): string {
  const headerLine = headers.join(',');
  const dataLines = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','));
  return [headerLine, ...dataLines].join('\n');
}

export async function exportResumoCsv(data: InsightsResponse, month: string) {
  const headers = ['Date', 'Reads', 'Favorites', 'Shares'];
  const rows = data.dailyActivity.map((d) => [d.date, String(d.reads), String(d.favorites), String(d.shares)]);
  const csv = toCsv(headers, rows);
  const file = new File(Paths.cache, `resumo-${month}.csv`);
  await file.create({ overwrite: true });
  await file.write(csv);
  await Sharing.shareAsync(file.uri, { mimeType: 'text/csv' });
}

export async function exportProfundidadeCsv(data: InsightsResponse, month: string) {
  const headers = ['DayOfWeek', 'Hour', 'Count'];
  const rows = data.hourlyHeatmap.map((h) => [String(h.dayOfWeek), String(h.hour), String(h.count)]);
  const csv = toCsv(headers, rows);
  const file = new File(Paths.cache, `profundidade-${month}.csv`);
  await file.create({ overwrite: true });
  await file.write(csv);
  await Sharing.shareAsync(file.uri, { mimeType: 'text/csv' });
}
