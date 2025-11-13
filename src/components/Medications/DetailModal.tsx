import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Clock, Target, Info, TrendingUp, AlertCircle } from "lucide-react";
import { Medication } from "@/pages/Medications";

interface DetailModalProps {
  medication: Medication;
  onClose: () => void;
}

const DetailModal = ({ medication, onClose }: DetailModalProps) => {
  const getDetailedInfo = (name: string, type: string) => {
    const lowerName = name.toLowerCase();
    
    // Suplementos Comuns
    if (lowerName.includes("whey")) {
      return {
        what: "Proteína do soro do leite concentrada",
        benefits: ["Recuperação muscular acelerada", "Síntese proteica otimizada", "Saciedade prolongada"],
        bestTime: "Pós-treino (até 30 minutos após exercício)",
        dosage: "20-30g por dose",
        interactions: "Potencializa efeitos da creatina quando usados juntos",
        tips: ["Misture com água ou leite", "Não substitui refeições", "Verifique selo ANVISA"]
      };
    }
    
    if (lowerName.includes("creatina")) {
      return {
        what: "Composto natural que fornece energia rápida aos músculos",
        benefits: ["Aumento de força e potência", "Ganho de volume muscular", "Melhora da performance em exercícios intensos"],
        bestTime: "Pré ou pós-treino (ambos são eficazes)",
        dosage: "3-5g/dia (manutenção) | 20g/dia por 5-7 dias (saturação)",
        interactions: "Funciona bem com whey protein e carboidratos",
        tips: ["Beba 3-4L de água por dia", "Pode causar pequeno ganho de peso (retenção)", "Escolha creatina monohidratada pura"]
      };
    }

    if (lowerName.includes("pré-treino") || lowerName.includes("pre treino")) {
      return {
        what: "Mix de ingredientes para energia e foco (cafeína, beta-alanina, citrulina)",
        benefits: ["Aumento de energia e foco", "Vasodilatação muscular", "Redução da fadiga"],
        bestTime: "20-30 minutos antes do treino",
        dosage: "Siga recomendação do fabricante (geralmente 1 scoop)",
        interactions: "⚠️ Não combine com outros estimulantes",
        tips: ["Evite após 16h", "Cicle o uso (1 mês on, 1 semana off)", "Comece com meia dose"]
      };
    }

    if (lowerName.includes("bcaa")) {
      return {
        what: "Aminoácidos de cadeia ramificada (Leucina, Isoleucina, Valina)",
        benefits: ["Reduz catabolismo muscular", "Acelera recuperação", "Diminui fadiga central"],
        bestTime: "Intra-treino ou pós-treino",
        dosage: "5-10g por dose",
        interactions: "Complementa whey protein",
        tips: ["Mais importante em jejum/dieta", "Ratio ideal: 2:1:1", "Pode ser substituído por whey"]
      };
    }

    if (lowerName.includes("vitamina d")) {
      return {
        what: "Vitamina lipossolúvel essencial para ossos e imunidade",
        benefits: ["Fortalece ossos e dentes", "Melhora imunidade", "Regula humor"],
        bestTime: "Pela manhã, com refeição que contenha gordura",
        dosage: "1000-4000 UI/dia (conforme exame)",
        interactions: "Combina com cálcio e magnésio",
        tips: ["Tome sol 15-20 min/dia", "Faça exame anual", "Tome com alimentos gordurosos"]
      };
    }

    // Genérico
    return {
      what: type === "medication" ? "Medicamento prescrito" : "Suplemento alimentar",
      benefits: ["Consulte seu médico ou nutricionista para informações específicas"],
      bestTime: "Conforme orientação profissional",
      dosage: medication.dosage,
      interactions: "Mantenha seu médico informado sobre todos os suplementos",
      tips: ["Siga as orientações do rótulo", "Não exceda a dose recomendada"]
    };
  };

  const info = getDetailedInfo(medication.name, medication.type);
  const typeEmoji = medication.type === "medication" ? "💊" : medication.type === "supplement" ? "🏋️" : "🌿";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{typeEmoji}</span>
            Análise Detalhada - {medication.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* O que é */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Info className="h-5 w-5" />
              <h3 className="font-bold">O que é?</h3>
            </div>
            <p className="text-muted-foreground">{info.what}</p>
          </div>

          {/* Benefícios */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <TrendingUp className="h-5 w-5" />
              <h3 className="font-bold">Benefícios</h3>
            </div>
            <ul className="space-y-2">
              {info.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Melhor Horário */}
          <Alert className="bg-primary/10 border-primary/30">
            <Clock className="h-4 w-4 text-primary" />
            <AlertDescription>
              <span className="font-medium">Melhor horário:</span> {info.bestTime}
            </AlertDescription>
          </Alert>

          {/* Dosagem */}
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <Target className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              <span className="font-medium">Dosagem recomendada:</span> {info.dosage}
            </AlertDescription>
          </Alert>

          {/* Interações */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-bold">Interações</h3>
            </div>
            <p className="text-sm text-muted-foreground">{info.interactions}</p>
          </div>

          {/* Dicas Importantes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-bold">Dicas Importantes</h3>
            </div>
            <ul className="space-y-2">
              {info.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-500 mt-1">•</span>
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Seus Dados */}
          <div className="pt-4 border-t border-border">
            <h3 className="font-bold mb-3">Seus Dados de Uso</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Dosagem atual:</span>
                <p className="font-medium">{medication.dosage}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Frequência:</span>
                <p className="font-medium">{medication.frequency === 'daily' ? 'Diário' : medication.frequency}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Objetivo:</span>
                <p className="font-medium">{medication.objective}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Horários:</span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {medication.times.map((time, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
