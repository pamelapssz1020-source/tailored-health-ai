import { useState, useEffect } from "react";
import { OnboardingModal } from "@/components/MenstrualCycle/OnboardingModal";
import { DailyMessage } from "@/components/MenstrualCycle/DailyMessage";
import { CurrentPhase } from "@/components/MenstrualCycle/CurrentPhase";
import { CycleCalendar } from "@/components/MenstrualCycle/CycleCalendar";
import { Recommendations } from "@/components/MenstrualCycle/Recommendations";
import { CycleConfig, calcularFaseAtual, calcularProximaMenstruacao } from "@/lib/menstrualCycleUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const MenstrualCycle = () => {
  const [config, setConfig] = useState<CycleConfig | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    const configSalva = localStorage.getItem('menstrual-cycle-config');
    const profileSalvo = localStorage.getItem('user-profile');
    
    if (configSalva) {
      setConfig(JSON.parse(configSalva));
    } else {
      setShowOnboarding(true);
    }

    if (profileSalvo) {
      setUserProfile(JSON.parse(profileSalvo));
    }
  };

  const handleOnboardingComplete = (novoConfig: CycleConfig) => {
    localStorage.setItem('menstrual-cycle-config', JSON.stringify(novoConfig));
    setConfig(novoConfig);
    setShowOnboarding(false);
    toast.success("Configuração concluída! 🎉");
  };

  const handleReconfigurar = () => {
    setShowOnboarding(true);
  };

  if (!config) {
    return (
      <>
        <Navbar />
        <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
      </>
    );
  }

  const faseAtual = calcularFaseAtual(config);
  const proximaMenstruacao = calcularProximaMenstruacao(config);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meu Ciclo 🌸</h1>
            <p className="text-muted-foreground">
              Dia {Math.floor((new Date().getTime() - new Date(config.ultimaMenstruacao).getTime()) / (1000 * 60 * 60 * 24)) % config.duracaoCiclo + 1} do ciclo
            </p>
          </div>
          <Button variant="outline" onClick={handleReconfigurar}>
            <Settings className="h-4 w-4 mr-2" />
            Reconfigurar
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-2 space-y-6">
            <DailyMessage 
              faseAtual={faseAtual} 
              config={config} 
              userProfile={userProfile} 
            />
            
            <CurrentPhase faseAtual={faseAtual} />
            
            <CycleCalendar config={config} />
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Próxima Menstruação</h3>
              </div>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-primary mb-2">
                  {proximaMenstruacao.diasRestantes}
                </div>
                <div className="text-muted-foreground">dias restantes</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {proximaMenstruacao.data.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>
              </div>
            </Card>

            <Recommendations faseAtual={faseAtual} />
          </div>
        </div>
      </div>

      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default MenstrualCycle;
