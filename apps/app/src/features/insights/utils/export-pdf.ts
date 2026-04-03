import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { InsightsResponse } from '@/features/insights/contracts/insights-service.contract';

export async function exportPdf(data: InsightsResponse, month: string) {
  const { summary } = data;
  const html = `
    <html>
      <head>
        <style>
          body { font-family: system-ui; padding: 24px; color: #333; }
          h1 { font-size: 20px; color: #5a6b4f; }
          h2 { font-size: 16px; color: #7c8c6e; margin-top: 20px; }
          .kpis { display: flex; flex-wrap: wrap; gap: 12px; margin: 12px 0; }
          .kpi { background: #f5f0eb; padding: 12px; border-radius: 8px; min-width: 120px; text-align: center; }
          .kpi-value { font-size: 24px; font-weight: bold; color: #5a6b4f; }
          .kpi-label { font-size: 11px; color: #999; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin: 8px 0; }
          th, td { padding: 6px 8px; text-align: left; border-bottom: 1px solid #eee; font-size: 12px; }
          th { color: #999; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>Echoes — Insights ${month}</h1>
        <div class="kpis">
          <div class="kpi"><div class="kpi-value">${summary.quotesRead.current}</div><div class="kpi-label">Lidas</div></div>
          <div class="kpi"><div class="kpi-value">${summary.quotesFavorited.current}</div><div class="kpi-label">Favoritas</div></div>
          <div class="kpi"><div class="kpi-value">${summary.quotesShared.current}</div><div class="kpi-label">Compartilhadas</div></div>
          <div class="kpi"><div class="kpi-value">${summary.uniqueAuthors.current}</div><div class="kpi-label">Autores lidos</div></div>
        </div>
        <h2>Streak</h2>
        <p><strong>${data.streak.current}</strong> dias seguidos (recorde: ${data.streak.record})</p>
        <h2>Sessões</h2>
        <div class="kpis">
          <div class="kpi"><div class="kpi-value">${Math.floor(data.sessions.avgDuration / 60)}m</div><div class="kpi-label">Tempo médio</div></div>
          <div class="kpi"><div class="kpi-value">${data.sessions.avgQuotes}</div><div class="kpi-label">Frases/sessão</div></div>
          <div class="kpi"><div class="kpi-value">${data.sessions.total}</div><div class="kpi-label">Total sessões</div></div>
        </div>
        <h2>Top Autores</h2>
        <table>
          <tr><th>#</th><th>Autor</th><th>Frases lidas</th></tr>
          ${data.topAuthors.map((a, i) => `<tr><td>${i + 1}</td><td>${a.name}</td><td>${a.quotesRead}</td></tr>`).join('')}
        </table>
        <h2>Releitura: ${data.rereadRate.percentage}%</h2>
        <table>
          <tr><th>Frase</th><th>Autor</th><th>Vezes</th></tr>
          ${data.rereadRate.topRereads.map((r) => `<tr><td>"${r.content.substring(0, 60)}..."</td><td>${r.author}</td><td>${r.count}x</td></tr>`).join('')}
        </table>
        <p style="color:#ccc;font-size:10px;margin-top:24px">Gerado por Echoes</p>
      </body>
    </html>
  `;
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
}
