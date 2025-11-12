import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PhaseInfo } from "@/lib/menstrualCycleUtils";

interface CurrentPhaseProps {
  faseAtual: PhaseInfo;
}

export const CurrentPhase = ({ faseAtual }: CurrentPhaseProps) => {
  const progresso = (faseAtual.diaFase / faseAtual.totalDiasFase) * 100;

  return (
    <Card 
      className="p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${faseAtual.cor}22, transparent)`,
        borderColor: faseAtual.cor
      }}
    >
      <div className="text-center">
        <div className="text-7xl mb-4">{faseAtual.emoji}</div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: faseAtual.cor }}>
          {faseAtual.nomeFase}
        </h2>
        <p className="text-muted-foreground mb-6">
          Dia {faseAtual.diaFase} de {faseAtual.totalDiasFase}
        </p>
        
        <Progress value={progresso} className="mb-4" />
        
        <div className="text-sm text-muted-foreground">
          Próxima fase: <span className="font-semibold">{faseAtual.proximaFase}</span>
        </div>
      </div>
    </Card>
  );
};
