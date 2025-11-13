import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle, Circle, AlertCircle, Info, Sparkles } from "lucide-react";
import { CycleConfig } from "@/lib/menstrualCycleUtils";
import { toast } from "sonner";

const CycleSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  
  // Dados do formulário
  const [ultimaMenstruacao, setUltimaMenstruacao] = useState<Date>(new Date());
  const [duracaoCiclo, setDuracaoCiclo] = useState(28);
  const [duracaoMenstruacao, setDuracaoMenstruacao] = useState(5);
  const [regularidade, setRegularidade] = useState("");
  const [sintomas, setSintomas] = useState<string[]>([]);
  const [outrosSintomas, setOutrosSintomas] = useState("");
  const [insightsEnabled, setInsightsEnabled] = useState(true);
  const [lembretes, setLembretes] = useState(true);
  const [adaptarTreinos, setAdaptarTreinos] = useState(true);

  const sintomasList = [
    { id: 'colicas', label: 'Cólicas', emoji: '😣' },
    { id: 'dor-cabeca', label: 'Dor de Cabeça', emoji: '🤕' },
    { id: 'inchaco', label: 'Inchaço', emoji: '💧' },
    { id: 'humor', label: 'Mudanças de Humor', emoji: '😢' },
    { id: 'fadiga', label: 'Fadiga', emoji: '😴' },
    { id: 'acne', label: 'Acne', emoji: '😖' },
    { id: 'seios', label: 'Sensibilidade nos Seios', emoji: '💗' },
    { id: 'apetite', label: 'Alterações no Apetite', emoji: '🍫' },
    { id: 'insonia', label: 'Insônia', emoji: '🌙' }
  ];

  const handleSintomaToggle = (sintomaId: string) => {
    if (sintomas.includes(sintomaId)) {
      setSintomas(sintomas.filter(s => s !== sintomaId));
    } else {
      setSintomas([...sintomas, sintomaId]);
    }
  };

  const proximaEtapa = () => {
    if (step === 0 && !ultimaMenstruacao) {
      toast.error("Por favor, selecione a data da sua última menstruação");
      return;
    }
    if (step === 3 && !regularidade) {
      toast.error("Por favor, selecione a regularidade do seu ciclo");
      return;
    }
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const etapaAnterior = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const finalizarSetup = async () => {
    const config: CycleConfig = {
      ultimaMenstruacao: ultimaMenstruacao.toISOString(),
      duracaoCiclo,
      duracaoMenstruacao,
      regularidade,
      sintomas,
      outrosSintomas,
      insightsEnabled,
      lembretes,
      adaptarTreinos,
      configuradoEm: new Date().toISOString()
    };

    localStorage.setItem('menstrual-cycle-config', JSON.stringify(config));
    
    toast.success("Configuração concluída! 🌸");
    navigate('/cycle/dashboard');
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="setup-step space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Quando começou sua última menstruação?</h2>
              <p className="text-muted-foreground">Primeiro dia do fluxo menstrual</p>
            </div>
            
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={ultimaMenstruacao}
                onSelect={(date) => date && setUltimaMenstruacao(date)}
                disabled={(date) => date > new Date() || date < new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)}
                className="rounded-md border shadow-lg"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="setup-step space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Quanto tempo dura seu ciclo normalmente?</h2>
              <p className="text-muted-foreground">Do primeiro dia de uma menstruação até o primeiro dia da próxima</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex items-center justify-center gap-4">
                <span className="text-5xl font-bold text-primary">{duracaoCiclo}</span>
                <span className="text-2xl text-muted-foreground">dias</span>
              </div>
              
              <Slider
                value={[duracaoCiclo]}
                onValueChange={(value) => setDuracaoCiclo(value[0])}
                min={21}
                max={45}
                step={1}
                className="w-full"
              />
              
              <Card className="p-4 bg-primary/10 border-primary/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm">A média é de 28 dias, mas pode variar entre 21 e 45 dias</p>
                </div>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="setup-step space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Quantos dias dura sua menstruação?</h2>
              <p className="text-muted-foreground">Período de fluxo menstrual</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex items-center justify-center gap-4">
                <span className="text-5xl font-bold text-primary">{duracaoMenstruacao}</span>
                <span className="text-2xl text-muted-foreground">dias</span>
              </div>
              
              <Slider
                value={[duracaoMenstruacao]}
                onValueChange={(value) => setDuracaoMenstruacao(value[0])}
                min={2}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="setup-step space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Seu ciclo é regular?</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Card 
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                  regularidade === 'muito-regular' ? 'border-primary border-2 bg-primary/10' : 'border-border'
                }`}
                onClick={() => setRegularidade('muito-regular')}
              >
                <div className="text-center space-y-3">
                  <CheckCircle className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="font-bold text-lg">Muito Regular</h3>
                  <p className="text-sm text-muted-foreground">Sempre no mesmo período</p>
                </div>
              </Card>
              
              <Card 
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                  regularidade === 'regular' ? 'border-primary border-2 bg-primary/10' : 'border-border'
                }`}
                onClick={() => setRegularidade('regular')}
              >
                <div className="text-center space-y-3">
                  <Circle className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="font-bold text-lg">Regular</h3>
                  <p className="text-sm text-muted-foreground">Varia 1-2 dias</p>
                </div>
              </Card>
              
              <Card 
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                  regularidade === 'irregular' ? 'border-primary border-2 bg-primary/10' : 'border-border'
                }`}
                onClick={() => setRegularidade('irregular')}
              >
                <div className="text-center space-y-3">
                  <AlertCircle className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="font-bold text-lg">Irregular</h3>
                  <p className="text-sm text-muted-foreground">Varia bastante</p>
                </div>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="setup-step space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Quais sintomas você costuma sentir?</h2>
              <p className="text-muted-foreground">Selecione todos que se aplicam (opcional)</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {sintomasList.map(sintoma => (
                  <Card 
                    key={sintoma.id}
                    className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                      sintomas.includes(sintoma.id) ? 'border-primary border-2 bg-primary/10' : 'border-border'
                    }`}
                    onClick={() => handleSintomaToggle(sintoma.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={sintomas.includes(sintoma.id)}
                        onCheckedChange={() => handleSintomaToggle(sintoma.id)}
                      />
                      <span className="text-2xl">{sintoma.emoji}</span>
                      <Label className="text-sm cursor-pointer">{sintoma.label}</Label>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Textarea
                placeholder="Outros sintomas que você sente..."
                value={outrosSintomas}
                onChange={(e) => setOutrosSintomas(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="setup-step space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Últimos ajustes</h2>
              <p className="text-muted-foreground">Personalize sua experiência</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Receber insights diários da IA</Label>
                    <p className="text-sm text-muted-foreground">Mensagens personalizadas baseadas na sua fase</p>
                  </div>
                  <Checkbox 
                    checked={insightsEnabled}
                    onCheckedChange={(checked) => setInsightsEnabled(checked as boolean)}
                  />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Lembretes antes da menstruação</Label>
                    <p className="text-sm text-muted-foreground">Notificação 3 dias antes do período</p>
                  </div>
                  <Checkbox 
                    checked={lembretes}
                    onCheckedChange={(checked) => setLembretes(checked as boolean)}
                  />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Adaptar treinos ao ciclo</Label>
                    <p className="text-sm text-muted-foreground">Recomendações de exercícios por fase</p>
                  </div>
                  <Checkbox 
                    checked={adaptarTreinos}
                    onCheckedChange={(checked) => setAdaptarTreinos(checked as boolean)}
                  />
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Configuração do Ciclo Menstrual</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Bem-vinda! 🌸</h1>
            <p className="text-muted-foreground">Vamos configurar seu acompanhamento menstrual personalizado</p>
          </div>

          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              {[0, 1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full mx-1 transition-all ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Etapa {step + 1} de 6
            </p>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={etapaAnterior}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            {step < 5 ? (
              <Button onClick={proximaEtapa}>
                Continuar
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={finalizarSetup} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Começar Acompanhamento
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CycleSetup;
