import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, CheckCircle, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { Medication } from "@/pages/Medications";

interface AIAnalysisProps {
  medications: Medication[];
}

const AIAnalysis = ({ medications }: AIAnalysisProps) => {
  const supplements = medications.filter(m => m.type === "supplement");
  const hasCaffeine = medications.some(m => 
    m.name.toLowerCase().includes("cafeína") || 
    m.name.toLowerCase().includes("pré-treino") ||
    m.name.toLowerCase().includes("termogênico")
  );

  const hasWhey = medications.some(m => m.name.toLowerCase().includes("whey"));
  const hasCreatine = medications.some(m => m.name.toLowerCase().includes("creatina"));

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Análise Inteligente da Sua Rotina</h2>
          <p className="text-muted-foreground">Insights personalizados pela IA</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Interações Positivas */}
        <Card className="border-emerald-500/30 bg-card/50 backdrop-blur shadow-[0_0_15px_rgba(0,200,150,0.2)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              <h3 className="text-xl font-bold">Interações Positivas</h3>
            </div>
            
            <div className="space-y-3">
              {hasWhey && hasCreatine && (
                <Alert className="bg-emerald-500/10 border-emerald-500/30">
                  <AlertDescription className="text-sm">
                    <span className="font-medium">Whey + Creatina:</span> Sinergia perfeita para ganho muscular e recuperação
                  </AlertDescription>
                </Alert>
              )}
              
              {medications.some(m => m.name.toLowerCase().includes("vitamina d")) && (
                <Alert className="bg-emerald-500/10 border-emerald-500/30">
                  <AlertDescription className="text-sm">
                    <span className="font-medium">Vitamina D:</span> Melhor absorção com exposição solar matinal (15-20 min)
                  </AlertDescription>
                </Alert>
              )}

              {supplements.length >= 2 && (
                <Alert className="bg-emerald-500/10 border-emerald-500/30">
                  <AlertDescription className="text-sm">
                    <span className="font-medium">Protocolo Completo:</span> Você está com uma suplementação bem estruturada
                  </AlertDescription>
                </Alert>
              )}

              {medications.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Adicione medicamentos/suplementos para receber análises
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertas Importantes */}
        <Card className="border-amber-500/30 bg-card/50 backdrop-blur shadow-[0_0_15px_rgba(251,191,36,0.2)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <h3 className="text-xl font-bold">Alertas Importantes</h3>
            </div>
            
            <div className="space-y-3">
              {hasCaffeine && (
                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertDescription className="text-sm">
                    <span className="font-medium">Cafeína Detectada:</span> Evite uso após 16h para não prejudicar o sono
                  </AlertDescription>
                </Alert>
              )}

              {hasCreatine && (
                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertDescription className="text-sm">
                    <span className="font-medium">Creatina:</span> Aumente hidratação para 3-4L de água por dia
                  </AlertDescription>
                </Alert>
              )}

              {medications.some(m => m.times.some(t => parseInt(t.split(':')[0]) >= 20)) && (
                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertDescription className="text-sm">
                    <span className="font-medium">Horário Noturno:</span> Alguns horários podem interferir no sono
                  </AlertDescription>
                </Alert>
              )}

              {medications.length > 0 && !hasCaffeine && !hasCreatine && (
                <p className="text-sm text-muted-foreground">
                  Nenhum alerta identificado. Continue assim! 👍
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações da IA */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-7 w-7 text-primary" />
            <h3 className="text-2xl font-bold">Recomendações Personalizadas</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {!hasWhey && (
              <div className="space-y-2">
                <Badge className="bg-primary/20 text-primary border-primary/50">
                  🥛 Sugerido
                </Badge>
                <h4 className="font-bold">Whey Protein</h4>
                <p className="text-sm text-muted-foreground">
                  Essencial para atingir metas proteicas e recuperação muscular
                </p>
              </div>
            )}

            {!hasCreatine && supplements.length > 0 && (
              <div className="space-y-2">
                <Badge className="bg-primary/20 text-primary border-primary/50">
                  💪 Recomendado
                </Badge>
                <h4 className="font-bold">Creatina Monohidratada</h4>
                <p className="text-sm text-muted-foreground">
                  Comprovado para ganho de força e volume muscular
                </p>
              </div>
            )}

            {medications.length > 0 && (
              <div className="space-y-2">
                <Badge className="bg-primary/20 text-primary border-primary/50">
                  📊 Dica
                </Badge>
                <h4 className="font-bold">Monitore seus Resultados</h4>
                <p className="text-sm text-muted-foreground">
                  Registre sensações e resultados para ajustes precisos
                </p>
              </div>
            )}
          </div>

          {medications.length === 0 && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Adicione seus primeiros itens para receber recomendações personalizadas
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default AIAnalysis;
