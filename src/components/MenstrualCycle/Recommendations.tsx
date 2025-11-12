import { Card } from "@/components/ui/card";
import { PhaseInfo, phaseRecommendations } from "@/lib/menstrualCycleUtils";
import { Dumbbell, Apple, Target } from "lucide-react";

interface RecommendationsProps {
  faseAtual: PhaseInfo;
}

export const Recommendations = ({ faseAtual }: RecommendationsProps) => {
  const recomendacoes = phaseRecommendations[faseAtual.fase];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Recomendações para Hoje</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="h-5 w-5" style={{ color: faseAtual.cor }} />
            <h4 className="font-semibold">Treinos Recomendados</h4>
          </div>
          <ul className="space-y-2">
            {recomendacoes.treinos.map((treino, idx) => (
              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: faseAtual.cor }} />
                {treino}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5" style={{ color: faseAtual.cor }} />
            <h4 className="font-semibold">Intensidade</h4>
          </div>
          <p className="text-muted-foreground">{recomendacoes.intensidade}</p>
          <p className="text-sm text-muted-foreground mt-1">Foco: {recomendacoes.foco}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Apple className="h-5 w-5" style={{ color: faseAtual.cor }} />
            <h4 className="font-semibold">Nutrição</h4>
          </div>
          <ul className="space-y-2">
            {recomendacoes.nutricao.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: faseAtual.cor }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
