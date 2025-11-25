import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Ruler, Minus } from 'lucide-react';
import { ProgressRecord } from '@/hooks/useUserProgress';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MeasurementsComparisonProps {
  latest: ProgressRecord | undefined;
  first: ProgressRecord | undefined;
}

interface MeasurementItem {
  label: string;
  key: keyof Pick<ProgressRecord, 'chest_cm' | 'waist_cm' | 'hips_cm' | 'arm_cm' | 'thigh_cm'>;
  icon: string;
}

const measurements: MeasurementItem[] = [
  { label: 'Peito', key: 'chest_cm', icon: '💪' },
  { label: 'Cintura', key: 'waist_cm', icon: '📏' },
  { label: 'Quadril', key: 'hips_cm', icon: '🏃' },
  { label: 'Braço', key: 'arm_cm', icon: '💪' },
  { label: 'Coxa', key: 'thigh_cm', icon: '🦵' },
];

export const MeasurementsComparison = ({ latest, first }: MeasurementsComparisonProps) => {
  if (!latest && !first) {
    return (
      <Card className="shadow-card border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-secondary" />
            Medidas Corporais
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Ruler className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhuma medida registrada ainda.
          </p>
          <p className="text-sm text-muted-foreground">
            Registre suas medidas para acompanhar a evolução!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getChange = (key: keyof Pick<ProgressRecord, 'chest_cm' | 'waist_cm' | 'hips_cm' | 'arm_cm' | 'thigh_cm'>) => {
    const latestVal = latest?.[key] as number | null;
    const firstVal = first?.[key] as number | null;
    
    if (!latestVal || !firstVal || latest?.id === first?.id) return null;
    return latestVal - firstVal;
  };

  return (
    <Card className="shadow-card border-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5 text-secondary" />
          Medidas Corporais
          {first && latest && first.id !== latest.id && (
            <span className="text-xs font-normal text-muted-foreground ml-2">
              Comparando com {format(parseISO(first.record_date), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {measurements.map((m) => {
            const currentValue = latest?.[m.key] as number | null;
            const change = getChange(m.key);
            
            if (!currentValue) return null;

            return (
              <div 
                key={m.key} 
                className="p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-secondary/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{m.icon}</span>
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                </div>
                <p className="text-2xl font-bold mb-1">{currentValue} cm</p>
                {change !== null && (
                  <Badge 
                    variant={change <= 0 ? 'default' : 'secondary'}
                    className="gap-1 text-xs"
                  >
                    {change === 0 ? (
                      <Minus className="h-3 w-3" />
                    ) : change < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {change > 0 ? '+' : ''}{change.toFixed(1)} cm
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
        
        {latest && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Última atualização: {format(parseISO(latest.record_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
