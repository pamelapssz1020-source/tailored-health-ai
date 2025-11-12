import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Apple, Drumstick, Droplet, Lightbulb, Download, RefreshCw } from "lucide-react";

interface DietPlan {
  resumo: {
    caloriasTotais: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
    tmb: number;
    gastoTotal: number;
  };
  refeicoes: Array<{
    nome: string;
    horario: string;
    emoji: string;
    alimentos: Array<{
      nome: string;
      quantidade: number;
      unidade: string;
      calorias: number;
      proteinas: number;
      carboidratos: number;
      gorduras: number;
    }>;
    totalCalorias: number;
    totalProteinas: number;
    totalCarboidratos: number;
    totalGorduras: number;
    observacoes?: string;
  }>;
  dicas: string[];
  observacoes: string;
}

interface DietPlanDisplayProps {
  dietPlan: DietPlan;
  onSave: () => void;
  onAdjust: () => void;
  onNewQuestionnaire: () => void;
}

export const DietPlanDisplay = ({
  dietPlan,
  onSave,
  onAdjust,
  onNewQuestionnaire,
}: DietPlanDisplayProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com Resumo Geral */}
      <Card className="shadow-elevated bg-gradient-primary border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-white">
            Seu Plano Alimentar Personalizado 🎯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-background/20 border-primary shadow-glow">
              <CardContent className="p-4 text-center">
                <Flame className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-4xl font-bold text-white">{dietPlan.resumo.caloriasTotais}</p>
                <p className="text-sm text-white/80">Calorias Totais</p>
              </CardContent>
            </Card>

            <Card className="bg-background/20 border-secondary shadow-glow">
              <CardContent className="p-4 text-center">
                <Drumstick className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="text-4xl font-bold text-white">{dietPlan.resumo.proteinas}g</p>
                <p className="text-sm text-white/80">Proteínas</p>
              </CardContent>
            </Card>

            <Card className="bg-background/20 border-accent shadow-glow">
              <CardContent className="p-4 text-center">
                <Apple className="h-8 w-8 mx-auto mb-2 text-accent" />
                <p className="text-4xl font-bold text-white">{dietPlan.resumo.carboidratos}g</p>
                <p className="text-sm text-white/80">Carboidratos</p>
              </CardContent>
            </Card>

            <Card className="bg-background/20 border-purple-400 shadow-glow">
              <CardContent className="p-4 text-center">
                <Droplet className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <p className="text-4xl font-bold text-white">{dietPlan.resumo.gorduras}g</p>
                <p className="text-sm text-white/80">Gorduras</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 text-center">
            <p className="text-white/70 text-sm">
              TMB: {dietPlan.resumo.tmb} kcal | Gasto Total: {dietPlan.resumo.gastoTotal} kcal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Refeições */}
      <div className="space-y-4">
        {dietPlan.refeicoes.map((refeicao, index) => (
          <Card key={index} className="shadow-card border-primary/20 hover-glow">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{refeicao.emoji}</span>
                  <div>
                    <CardTitle className="text-xl">{refeicao.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">{refeicao.horario}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {refeicao.totalCalorias} kcal
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 mb-4">
                {refeicao.alimentos.map((alimento, aIndex) => (
                  <div
                    key={aIndex}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{alimento.nome}</p>
                      <p className="text-sm text-primary">
                        {alimento.quantidade}{alimento.unidade}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        P: {alimento.proteinas}g
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        C: {alimento.carboidratos}g
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        G: {alimento.gorduras}g
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {alimento.calorias} kcal
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Proteínas: <strong>{refeicao.totalProteinas}g</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Carboidratos: <strong>{refeicao.totalCarboidratos}g</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Gorduras: <strong>{refeicao.totalGorduras}g</strong>
                  </span>
                </div>
              </div>

              {refeicao.observacoes && (
                <p className="mt-3 text-sm text-muted-foreground italic">
                  💡 {refeicao.observacoes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dicas Personalizadas */}
      <Card className="shadow-card border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-500">
            <Lightbulb className="h-6 w-6" />
            Dicas Personalizadas da Nutricionista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {dietPlan.dicas.map((dica, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>{dica}</span>
              </li>
            ))}
          </ul>
          {dietPlan.observacoes && (
            <p className="mt-4 text-sm text-muted-foreground italic">
              {dietPlan.observacoes}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onSave} size="lg" className="shadow-glow">
          <Download className="h-4 w-4 mr-2" />
          Salvar Meu Plano
        </Button>
        <Button onClick={onAdjust} variant="secondary" size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Ajustar Plano
        </Button>
        <Button onClick={onNewQuestionnaire} variant="outline" size="lg">
          Fazer Novo Questionário
        </Button>
      </div>
    </div>
  );
};
