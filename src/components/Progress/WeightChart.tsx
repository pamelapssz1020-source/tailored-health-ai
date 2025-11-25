import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingDown, TrendingUp, Scale } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeightData {
  date: string;
  weight: number;
}

interface WeightChartProps {
  data: WeightData[];
}

export const WeightChart = ({ data }: WeightChartProps) => {
  const [timeRange, setTimeRange] = useState<30 | 90>(30);
  
  const filteredData = data.slice(-timeRange);
  
  const chartData = filteredData.map(item => ({
    date: format(parseISO(item.date), 'dd/MM', { locale: ptBR }),
    fullDate: format(parseISO(item.date), "dd 'de' MMMM", { locale: ptBR }),
    weight: item.weight,
  }));

  // Calculate trend
  const firstWeight = filteredData[0]?.weight;
  const lastWeight = filteredData[filteredData.length - 1]?.weight;
  const weightChange = firstWeight && lastWeight ? lastWeight - firstWeight : 0;
  const isLosing = weightChange < 0;

  if (data.length === 0) {
    return (
      <Card className="shadow-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Evolução do Peso
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Scale className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhum registro de peso ainda.
          </p>
          <p className="text-sm text-muted-foreground">
            Faça seu primeiro check-in para acompanhar a evolução!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Evolução do Peso
          {weightChange !== 0 && (
            <span className={`text-sm font-normal flex items-center gap-1 ${isLosing ? 'text-neon-cyan' : 'text-destructive'}`}>
              {isLosing ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}kg
            </span>
          )}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 30 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(30)}
          >
            30 dias
          </Button>
          <Button
            variant={timeRange === 90 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(90)}
          >
            90 dias
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(193, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(193, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(0, 0%, 20%)" 
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                stroke="hsl(0, 0%, 63%)"
                tick={{ fill: 'hsl(0, 0%, 63%)', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(0, 0%, 20%)' }}
              />
              <YAxis 
                stroke="hsl(0, 0%, 63%)"
                tick={{ fill: 'hsl(0, 0%, 63%)', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(0, 0%, 20%)' }}
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 7%)',
                  border: '1px solid hsl(193, 100%, 50%, 0.3)',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px hsl(193, 100%, 50%, 0.2)',
                }}
                labelStyle={{ color: 'hsl(0, 0%, 100%)', fontWeight: 'bold' }}
                itemStyle={{ color: 'hsl(193, 100%, 50%)' }}
                formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Peso']}
                labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="hsl(193, 100%, 50%)"
                strokeWidth={3}
                fill="url(#weightGradient)"
                dot={{ fill: 'hsl(193, 100%, 50%)', strokeWidth: 2, r: 4 }}
                activeDot={{ 
                  r: 6, 
                  fill: 'hsl(180, 100%, 50%)',
                  stroke: 'hsl(180, 100%, 50%)',
                  strokeWidth: 2,
                  style: { filter: 'drop-shadow(0 0 8px hsl(180, 100%, 50%))' }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
