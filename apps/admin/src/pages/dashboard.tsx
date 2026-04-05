import { BookOpen, FolderOpen, PenTool, TrendingUp, Users } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsOverview, useQuoteActivity, useUserGrowth } from '@/hooks/use-analytics';

const tooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--card-foreground)',
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="tabular-nums text-2xl font-bold">{value.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: userGrowth, isLoading: growthLoading } = useUserGrowth();
  const { data: quoteActivity, isLoading: activityLoading } = useQuoteActivity();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visao geral da plataforma Echoes</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuarios"
          value={overview?.totalUsers ?? 0}
          description={`+${overview?.newUsersThisMonth ?? 0} este mes`}
          icon={Users}
          loading={overviewLoading}
        />
        <StatCard
          title="Total de Citacoes"
          value={overview?.totalQuotes ?? 0}
          description={`${overview?.quotesViewedToday ?? 0} visualizadas hoje`}
          icon={BookOpen}
          loading={overviewLoading}
        />
        <StatCard
          title="Autores"
          value={overview?.totalAuthors ?? 0}
          description="Cadastrados na plataforma"
          icon={PenTool}
          loading={overviewLoading}
        />
        <StatCard
          title="Pastas"
          value={overview?.totalFolders ?? 0}
          description="Colecoes criadas"
          icon={FolderOpen}
          loading={overviewLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Crescimento de Usuarios
            </CardTitle>
            <CardDescription>Novos usuarios nos ultimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.2}
                    name="Usuarios"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Atividade de Citacoes
            </CardTitle>
            <CardDescription>Visualizacoes, compartilhamentos e favoritos</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quoteActivity}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--muted-foreground)' }} />
                  <Bar dataKey="views" fill="var(--chart-1)" name="Visualizacoes" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shares" fill="var(--chart-2)" name="Compartilhamentos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="favorites" fill="var(--chart-4)" name="Favoritos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
