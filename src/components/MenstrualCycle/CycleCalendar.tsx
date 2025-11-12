import { Card } from "@/components/ui/card";
import { CycleConfig } from "@/lib/menstrualCycleUtils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CycleCalendarProps {
  config: CycleConfig;
}

export const CycleCalendar = ({ config }: CycleCalendarProps) => {
  const hoje = new Date();
  const primeiroDia = startOfMonth(hoje);
  const ultimoDia = endOfMonth(hoje);
  const diasDoMes = eachDayOfInterval({ start: primeiroDia, end: ultimoDia });

  const ultimaMenstruacao = new Date(config.ultimaMenstruacao);
  const proximaMenstruacao = addDays(ultimaMenstruacao, config.duracaoCiclo);
  
  const getDayType = (day: Date) => {
    const diasDesdeMenstruacao = Math.floor((day.getTime() - ultimaMenstruacao.getTime()) / (1000 * 60 * 60 * 24));
    const diaAtualDoCiclo = diasDesdeMenstruacao % config.duracaoCiclo;

    if (diaAtualDoCiclo >= 0 && diaAtualDoCiclo < config.duracaoMenstruacao) {
      return 'menstruacao';
    }
    if (diaAtualDoCiclo >= 13 && diaAtualDoCiclo < 16) {
      return 'ovulacao';
    }
    return 'normal';
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">
        {format(hoje, "MMMM yyyy", { locale: ptBR })}
      </h3>
      
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
          <div key={dia} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {dia}
          </div>
        ))}
        
        {diasDoMes.map((dia) => {
          const tipo = getDayType(dia);
          const isToday = isSameDay(dia, hoje);
          
          return (
            <div
              key={dia.toISOString()}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm
                ${isToday ? 'ring-2 ring-primary font-bold' : ''}
                ${tipo === 'menstruacao' ? 'bg-red-500/20 text-red-400' : ''}
                ${tipo === 'ovulacao' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                ${tipo === 'normal' ? 'bg-muted/50' : ''}
              `}
            >
              <div className="relative">
                {format(dia, 'd')}
                {tipo === 'menstruacao' && (
                  <span className="absolute -top-1 -right-3 text-xs">🩸</span>
                )}
                {tipo === 'ovulacao' && (
                  <span className="absolute -top-1 -right-3 text-xs">✨</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/20" />
          <span>Menstruação</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/20" />
          <span>Ovulação</span>
        </div>
      </div>
    </Card>
  );
};
