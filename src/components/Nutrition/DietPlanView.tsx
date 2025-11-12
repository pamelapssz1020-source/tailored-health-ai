import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  Lightbulb,
  Info,
  Download,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DietPlanViewProps {
  plan: any;
  profile: any;
  createdAt: string;
}

const getAlimentoEmoji = (nomeAlimento: string): string => {
  const emojis: Record<string, string> = {
    pao: "🍞",
    ovo: "🥚",
    frango: "🍗",
    arroz: "🍚",
    batata: "🥔",
    banana: "🍌",
    maca: "🍎",
    abacate: "🥑",
    leite: "🥛",
    queijo: "🧀",
    carne: "🥩",
    peixe: "🐟",
    salada: "🥗",
    feijao: "🫘",
    cafe: "☕",
    whey: "🥤",
    aveia: "🥣",
    default: "🍽️",
  };

  const nome = nomeAlimento.toLowerCase();
  for (const [key, emoji] of Object.entries(emojis)) {
    if (nome.includes(key)) return emoji;
  }
  return emojis.default;
};

export const DietPlanView = ({ plan, profile, createdAt }: DietPlanViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completedMeals, setCompletedMeals] = useState<string[]>([]);
  const [dailyProgress, setDailyProgress] = useState({
    caloriasTotais: 0,
    macrosTotais: { proteinas: 0, carboidratos: 0, gorduras: 0 },
  });

  useEffect(() => {
    loadDailyProgress();
  }, []);

  const loadDailyProgress = () => {
    const hoje = new Date().toISOString().split("T")[0];
    const progressoSalvo = localStorage.getItem(`progress:${hoje}`);

    if (progressoSalvo) {
      const progresso = JSON.parse(progressoSalvo);
      setCompletedMeals(progresso.refeicoesConcluidas.map((r: any) => r.nome));
      setDailyProgress({
        caloriasTotais: progresso.caloriasTotais,
        macrosTotais: progresso.macrosTotais,
      });
    }
  };

  const marcarComoConcluida = async (refeicao: any) => {
    if (completedMeals.includes(refeicao.nome)) {
      toast({
        title: "Já Concluída",
        description: "Esta refeição já foi marcada como concluída hoje.",
      });
      return;
    }

    const hoje = new Date().toISOString().split("T")[0];
    const progressoSalvo = localStorage.getItem(`progress:${hoje}`);
    const progresso = progressoSalvo
      ? JSON.parse(progressoSalvo)
      : {
          refeicoesConcluidas: [],
          caloriasTotais: 0,
          macrosTotais: { proteinas: 0, carboidratos: 0, gorduras: 0 },
        };

    progresso.refeicoesConcluidas.push({
      nome: refeicao.nome,
      horario: new Date().toLocaleTimeString("pt-BR"),
      calorias: refeicao.totalCalorias,
      macros: {
        proteinas: refeicao.totalProteinas,
        carboidratos: refeicao.totalCarboidratos,
        gorduras: refeicao.totalGorduras,
      },
    });

    progresso.caloriasTotais += refeicao.totalCalorias;
    progresso.macrosTotais.proteinas += refeicao.totalProteinas;
    progresso.macrosTotais.carboidratos += refeicao.totalCarboidratos;
    progresso.macrosTotais.gorduras += refeicao.totalGorduras;

    localStorage.setItem(`progress:${hoje}`, JSON.stringify(progresso));

    setCompletedMeals([...completedMeals, refeicao.nome]);
    setDailyProgress({
      caloriasTotais: progresso.caloriasTotais,
      macrosTotais: progresso.macrosTotais,
    });

    toast({
      title: "Refeição Concluída! 🎉",
      description: `${refeicao.nome} marcada como concluída.`,
    });
  };

  const abrirScanner = (nomeRefeicao: string) => {
    sessionStorage.setItem(
      "scannerContext",
      JSON.stringify({
        refeicao: nomeRefeicao,
        voltarPara: "/nutrition",
      })
    );
    // In a real app, would navigate to scanner page
    toast({
      title: "Scanner",
      description: "Funcionalidade de scanner em desenvolvimento.",
    });
  };

  const progressPercentage =
    (completedMeals.length / plan.refeicoes.length) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="shadow-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Meu Plano Alimentar</h2>
              <p className="text-muted-foreground">
                Criado em {new Date(createdAt).toLocaleDateString("pt-BR")} •{" "}
                {plan.resumo.caloriasTotais} kcal/dia
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/nutritionist-ai")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ver Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("user-diet-plan");
                  window.location.reload();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Progress */}
      <Card className="shadow-card border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Progresso de Hoje</h3>
              <span className="text-sm text-muted-foreground">
                {completedMeals.length}/{plan.refeicoes.length} refeições
              </span>
            </div>

            <Progress value={progressPercentage} className="h-3" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Calorias</p>
                <p className="text-2xl font-bold text-primary">
                  {dailyProgress.caloriasTotais}
                  <span className="text-sm text-muted-foreground">
                    /{plan.resumo.caloriasTotais}
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Proteínas</p>
                <p className="text-2xl font-bold">
                  {dailyProgress.macrosTotais.proteinas}g
                  <span className="text-sm text-muted-foreground">
                    /{plan.resumo.proteinas}g
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Carboidratos</p>
                <p className="text-2xl font-bold">
                  {dailyProgress.macrosTotais.carboidratos}g
                  <span className="text-sm text-muted-foreground">
                    /{plan.resumo.carboidratos}g
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gorduras</p>
                <p className="text-2xl font-bold">
                  {dailyProgress.macrosTotais.gorduras}g
                  <span className="text-sm text-muted-foreground">
                    /{plan.resumo.gorduras}g
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals List */}
      <div className="space-y-4">
        {plan.refeicoes.map((refeicao: any, index: number) => (
          <Card
            key={index}
            className={`shadow-card border-primary/20 hover-glow transition-all ${
              completedMeals.includes(refeicao.nome)
                ? "opacity-70 border-green-500/50"
                : ""
            }`}
          >
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{refeicao.emoji}</span>
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {refeicao.nome}
                      {completedMeals.includes(refeicao.nome) && (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluída
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4" />
                      {refeicao.horario}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => abrirScanner(refeicao.nome)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Registrar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => marcarComoConcluida(refeicao)}
                    disabled={completedMeals.includes(refeicao.nome)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar Feita
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Foods */}
              {refeicao.alimentos.map((alimento: any, aIndex: number) => (
                <div
                  key={aIndex}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                    {getAlimentoEmoji(alimento.nome)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {alimento.nome}
                        </h4>
                        <p className="text-sm text-primary">
                          {alimento.quantidade}
                          {alimento.unidade}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-background/50 rounded-md p-2 text-center border border-border/50">
                        <p className="text-xs text-muted-foreground">
                          Calorias
                        </p>
                        <p className="text-sm font-bold">
                          {alimento.calorias}
                        </p>
                      </div>
                      <div className="bg-background/50 rounded-md p-2 text-center border border-border/50">
                        <p className="text-xs text-muted-foreground">Prot</p>
                        <p className="text-sm font-bold">
                          {alimento.proteinas}g
                        </p>
                      </div>
                      <div className="bg-background/50 rounded-md p-2 text-center border border-border/50">
                        <p className="text-xs text-muted-foreground">Carb</p>
                        <p className="text-sm font-bold">
                          {alimento.carboidratos}g
                        </p>
                      </div>
                      <div className="bg-background/50 rounded-md p-2 text-center border border-border/50">
                        <p className="text-xs text-muted-foreground">Gord</p>
                        <p className="text-sm font-bold">
                          {alimento.gorduras}g
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Meal Totals */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex gap-6 text-sm">
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">
                      {refeicao.totalCalorias} kcal
                    </strong>
                  </span>
                  <span className="text-muted-foreground">
                    Prot: <strong>{refeicao.totalProteinas}g</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Carb: <strong>{refeicao.totalCarboidratos}g</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Gord: <strong>{refeicao.totalGorduras}g</strong>
                  </span>
                </div>
              </div>

              {refeicao.observacoes && (
                <p className="text-sm text-muted-foreground italic bg-muted/30 p-3 rounded-lg border border-border/50">
                  💡 {refeicao.observacoes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="shadow-card border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-500">
            <Lightbulb className="h-6 w-6" />
            Dicas Personalizadas da Nutricionista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {plan.dicas.map((dica: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-sm">
                  {index + 1}
                </span>
                <span>{dica}</span>
              </li>
            ))}
          </ul>
          {plan.observacoes && (
            <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground italic bg-muted/30 p-3 rounded-lg border border-border/50">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>{plan.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
