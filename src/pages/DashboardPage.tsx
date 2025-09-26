import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '@/lib/api-client';
import { DashboardStats } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
const StatCard = ({ title, value, icon, change, changeType }: { title: string; value: string | number; icon: keyof typeof Icons; change?: string; changeType?: 'increase' | 'decrease' }) => {
  const Icon = Icons[icon];
  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {change && (
          <p className={cn("text-xs text-muted-foreground flex items-center", changeType === 'increase' ? 'text-green-500' : 'text-red-500')}>
            {changeType === 'increase' ? <Icons.arrowUp className="h-4 w-4 mr-1" /> : <Icons.arrowDown className="h-4 w-4 mr-1" />}
            {change} from last hour
          </p>
        )}
      </CardContent>
    </Card>
  );
};
const ConnectorStatusCard = ({ status }: { status: DashboardStats['connectorStatus'] }) => {
  return (
    <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle>Connector Status</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <Icons.success className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-2xl font-bold">{status.active}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="flex flex-col items-center">
          <Icons.error className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-2xl font-bold">{status.inactive}</p>
          <p className="text-sm text-muted-foreground">Inactive</p>
        </div>
        <div className="flex flex-col items-center">
          <Icons.pending className="h-8 w-8 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold">{status.pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="flex flex-col items-center">
          <Icons.server className="h-8 w-8 text-gray-500 mb-2" />
          <p className="text-2xl font-bold">{status.total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
      </CardContent>
    </Card>
  );
};
const ThroughputChart = ({ data }: { data: DashboardStats['throughputHistory'] }) => {
  return (
    <Card className="lg:col-span-3 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle>Message Throughput (Last 24 hours)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorMps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(30 64 175)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="rgb(30 64 175)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Area type="monotone" dataKey="mps" stroke="rgb(30 64 175)" fillOpacity={1} fill="url(#colorMps)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
const LoadingSkeleton = () => (
  <>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-[126px]" />
      <Skeleton className="h-[126px]" />
      <Skeleton className="h-[126px]" />
      <Skeleton className="h-[168px] lg:col-span-2" />
      <Skeleton className="h-[168px]" />
    </div>
    <div className="mt-6">
      <Skeleton className="h-[372px]" />
    </div>
  </>
);
export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api<DashboardStats>('/api/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  if (loading || !stats) {
    return <LoadingSkeleton />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total MPS" value={stats.system.totalMps} icon="signal" change="+5.2%" changeType="increase" />
        <StatCard title="SMS-C Queued" value={stats.system.smscQueue} icon="messages" change="-1.2%" changeType="decrease" />
        <StatCard title="Users Queued" value={stats.system.userQueue} icon="users" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <ConnectorStatusCard status={stats.connectorStatus} />
        <StatCard title="Uptime" value={stats.system.uptime} icon="activity" />
      </div>
      <ThroughputChart data={stats.throughputHistory} />
    </motion.div>
  );
}