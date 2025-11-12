import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CycleConfig } from "@/lib/menstrualCycleUtils";
import { toast } from "sonner";

interface OnboardingModalProps {
  open: boolean;
  onComplete: (config: CycleConfig) => void;
}

export const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const [ultimaMenstruacao, setUltimaMenstruacao] = useState<Date>();
  const [duracaoCiclo, setDuracaoCiclo] = useState(28);
  const [duracaoMenstruacao, setDuracaoMenstruacao] = useState(5);
  const [regularidade, setRegularidade] = useState("");
  const [sintomas, setSintomas] = useState<string[]>([]);
  const [outrosSintomas, setOutrosSintomas] = useState("");
  const [insightsEnabled, setInsightsEnabled] = useState(true);

  const sintomasOpcoes = [
    "Cólicas",
    "Dor de cabeça",
    "Inchaço",
    "Mudanças de humor",
    "Fadiga",
    "Acne",
    "Sensibilidade nos seios",
    "Alterações no apetite",
    "Insônia"
  ];

  const handleNext = () => {
    if (step === 1 && !ultimaMenstruacao) {
      toast.error("Por favor, selecione a data da última menstruação");
      return;
    }
    if (step === 3 && !regularidade) {
      toast.error("Por favor, selecione a regularidade do seu ciclo");
      return;
    }
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!ultimaMenstruacao) return;

    const config: CycleConfig = {
      ultimaMenstruacao: ultimaMenstruacao.toISOString(),
      duracaoCiclo,
      duracaoMenstruacao,
      regularidade,
      sintomas,
      outrosSintomas,
      insightsEnabled,
      configuradoEm: new Date().toISOString()
    };

    onComplete(config);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Vamos Cuidar da Sua Saúde Feminina 🌸
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Configure seu acompanhamento menstrual personalizado
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-secondary'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Data da última menstruação */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Quando foi o primeiro dia da sua última menstruação?
              </h3>
              <Calendar
                mode="single"
                selected={ultimaMenstruacao}
                onSelect={setUltimaMenstruacao}
                disabled={(date) => date > new Date() || date < new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)}
                className="mx-auto pointer-events-auto"
              />
            </div>
          )}

          {/* Step 2: Duração do ciclo e menstruação */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Quanto tempo dura seu ciclo normalmente?
                </h3>
                <div className="text-center text-3xl font-bold text-primary mb-4">
                  {duracaoCiclo} dias
                </div>
                <Slider
                  value={[duracaoCiclo]}
                  onValueChange={(v) => setDuracaoCiclo(v[0])}
                  min={21}
                  max={45}
                  step={1}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Quantos dias dura sua menstruação?
                </h3>
                <div className="text-center text-3xl font-bold text-primary mb-4">
                  {duracaoMenstruacao} dias
                </div>
                <Slider
                  value={[duracaoMenstruacao]}
                  onValueChange={(v) => setDuracaoMenstruacao(v[0])}
                  min={2}
                  max={10}
                  step={1}
                />
              </div>
            </div>
          )}

          {/* Step 3: Regularidade */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seu ciclo é regular?</h3>
              <div className="grid grid-cols-2 gap-3">
                {["Muito regular", "Regular", "Irregular", "Não sei"].map((option) => (
                  <Button
                    key={option}
                    variant={regularidade === option ? "default" : "outline"}
                    onClick={() => setRegularidade(option)}
                    className="h-auto py-4"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Sintomas */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Quais sintomas você costuma sentir?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {sintomasOpcoes.map((sintoma) => (
                  <div key={sintoma} className="flex items-center space-x-2">
                    <Checkbox
                      id={sintoma}
                      checked={sintomas.includes(sintoma)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSintomas([...sintomas, sintoma]);
                        } else {
                          setSintomas(sintomas.filter((s) => s !== sintoma));
                        }
                      }}
                    />
                    <label htmlFor={sintoma} className="text-sm cursor-pointer">
                      {sintoma}
                    </label>
                  </div>
                ))}
              </div>
              <Textarea
                placeholder="Outros sintomas..."
                value={outrosSintomas}
                onChange={(e) => setOutrosSintomas(e.target.value)}
              />
            </div>
          )}

          {/* Step 5: Insights */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Deseja receber insights e recomendações personalizadas?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={insightsEnabled ? "default" : "outline"}
                  onClick={() => setInsightsEnabled(true)}
                  className="h-20"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">✨</div>
                    <div>Sim, quero!</div>
                  </div>
                </Button>
                <Button
                  variant={!insightsEnabled ? "default" : "outline"}
                  onClick={() => setInsightsEnabled(false)}
                  className="h-20"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚫</div>
                    <div>Não, obrigada</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Confirmação */}
          {step === 6 && (
            <div className="space-y-4 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold">Tudo pronto!</h3>
              <p className="text-muted-foreground">
                Seu acompanhamento menstrual está configurado. Vamos começar a
                cuidar da sua saúde juntas!
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Voltar
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {step === 6 ? "Começar Acompanhamento" : "Continuar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
