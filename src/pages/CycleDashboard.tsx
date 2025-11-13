import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { 
  Calendar, 
  Sparkles, 
  RefreshCw, 
  Dumbbell, 
  Apple, 
  Activity,
  TrendingUp,
  Settings
} from "lucide-react";
import { 
  CycleConfig, 
  calcularFaseAtual, 
  calcularProximaMenstruacao, 
  PhaseInfo 
} from "@/lib/menstrualCycleUtils";
import { CycleCalendar } from "@/components/MenstrualCycle/CycleCalendar";
import { DailyMessage } from "@/components/MenstrualCycle/DailyMessage";
import { CurrentPhase } from "@/components/MenstrualCycle/CurrentPhase";
import { Recommendations } from "@/components/MenstrualCycle/Recommendations";
import { toast } from "sonner";

const CycleDashboard = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<CycleConfig | null>(null);
  const [faseAtual, setFaseAtual] = useState<PhaseInfo | null>(null);
  const [proximaMenstruacao, setProximaMenstruacao] = useState<{ data: Date; diasRestantes: number } | null>(null);
  const [diarioHoje, setDiarioHoje] = useState("");
  const [sintomasHoje, setSintomasHoje] = useState<string[]>([]);
  const [historicoRegistros, setHistoricoRegistros] = useState<any[]>([]);

  const sintomasList = [
    { id: 'colicas', label: 'Cólicas', emoji: '😣' },
    { id: 'dor-cabeca', label: 'Dor de Cabeça', emoji: '🤕' },
    { id: 'inchaco', label: 'Inchaço', emoji: '💧' },
    { id: 'humor', label: 'Mudanças de Humor', emoji: '😢' },
    { id: 'fadiga', label: 'Fadiga', emoji: '😴' },
    { id: 'acne', label: 'Acne', emoji: '😖' },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    const configString = localStorage.getItem('menstrual-cycle-config');
    
    if (!configString) {
      navigate('/cycle/setup');
      return;
    }

    const configData = JSON.parse(configString);
    setConfig(configData);

    const fase = calcularFaseAtual(configData);
    setFaseAtual(fase);

    const proxima = calcularProximaMenstruacao(configData);
    setProximaMenstruacao(proxima);

    // Carregar histórico
    const historicoString = localStorage.getItem('cycle-diary-history');
    if (historicoString) {
      setHistoricoRegistros(JSON.parse(historicoString));
    }

    // Carregar registro do dia
    const hoje = new Date().toISOString().split('T')[0];
    const registroHoje = localStorage.getItem(`cycle-daily-log:${hoje}`);
    if (registroHoje) {
      const registro = JSON.parse(registroHoje);
      setDiarioHoje(registro.diario || "");
      setSintomasHoje(registro.sintomas || []);
    }
  };

  const registrarSintoma = (sintomaId: string, checked: boolean) => {
    const novos = checked 
      ? [...sintomasHoje, sintomaId]
      : sintomasHoje.filter(s => s !== sintomaId);
    setSintomasHoje(novos);
    
    salvarRegistroDiario(novos, diarioHoje);
  };

  const salvarDiario = () => {
    salvarRegistroDiario(sintomasHoje, diarioHoje);
    toast.success("Registro salvo! 📝");
  };

  const salvarRegistroDiario = (sintomas: string[], texto: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    const registro = {
      fase: faseAtual?.fase,
      faseNome: faseAtual?.nomeFase,
      faseEmoji: faseAtual?.emoji,
      sintomas,
      diario: texto,
      data: hoje
    };

    localStorage.setItem(`cycle-daily-log:${hoje}`, JSON.stringify(registro));

    // Atualizar histórico
    const historicoAtual = [...historicoRegistros];
    const index = historicoAtual.findIndex(r => r.data === hoje);
    if (index >= 0) {
      historicoAtual[index] = registro;
    } else {
      historicoAtual.unshift(registro);
    }
    const historicoLimitado = historicoAtual.slice(0, 30); // Últimos 30 registros
    setHistoricoRegistros(historicoLimitado);
    localStorage.setItem('cycle-diary-history', JSON.stringify(historicoLimitado));
  };

  if (!config || !faseAtual || !proximaMenstruacao) {
    return <div>Carregando...</div>;
  }

  const diaAtualDoCiclo = Math.floor(
    (new Date().getTime() - new Date(config.ultimaMenstruacao).getTime()) / (1000 * 60 * 60 * 24)
  ) % config.duracaoCiclo;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header com fase atual */}
        <div 
          className="relative mb-8 p-8 rounded-2xl border-2 overflow-hidden"
          style={{
            borderColor: faseAtual.cor,
            background: `linear-gradient(135deg, ${faseAtual.cor}22, transparent)`,
            boxShadow: `0 0 30px ${faseAtual.cor}33`
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-7xl">{faseAtual.emoji}</span>
              <div>
                <h1 className="text-4xl font-bold mb-1">{faseAtual.nomeFase}</h1>
                <p className="text-lg text-muted-foreground">
                  Dia {faseAtual.diaFase} de {faseAtual.totalDiasFase} desta fase
                </p>
              </div>
            </div>
            <div className="text-center">
              <span className="text-sm text-muted-foreground block mb-2">Dia do Ciclo</span>
              <span className="text-5xl font-bold text-primary">{diaAtualDoCiclo + 1}</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => navigate('/cycle/setup')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Reconfigurar
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna esquerda - Mensagem e Fase */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mensagem diária */}
            <DailyMessage 
              faseAtual={faseAtual} 
              config={config} 
              userProfile={{}} 
            />

            {/* Fase atual detalhada */}
            <CurrentPhase faseAtual={faseAtual} />

            {/* Calendário */}
            <CycleCalendar config={config} />

            {/* Rastreador de sintomas */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Como você está hoje?
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {sintomasList.map(sintoma => (
                  <Card 
                    key={sintoma.id}
                    className={`p-4 cursor-pointer transition-all ${
                      sintomasHoje.includes(sintoma.id) ? 'border-primary border-2 bg-primary/10' : 'border-border'
                    }`}
                    onClick={() => registrarSintoma(sintoma.id, !sintomasHoje.includes(sintoma.id))}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={sintomasHoje.includes(sintoma.id)}
                        onCheckedChange={(checked) => registrarSintoma(sintoma.id, checked as boolean)}
                      />
                      <span className="text-2xl">{sintoma.emoji}</span>
                      <Label className="text-sm cursor-pointer">{sintoma.label}</Label>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Diário pessoal */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">📝 Diário Pessoal</h2>
              <Textarea
                placeholder="Como você está se sentindo hoje? Registre seus pensamentos, emoções ou qualquer coisa que queira lembrar..."
                value={diarioHoje}
                onChange={(e) => setDiarioHoje(e.target.value)}
                className="min-h-32 mb-4"
              />
              <Button onClick={salvarDiario}>
                Salvar Registro
              </Button>
            </Card>

            {/* Histórico de registros */}
            {historicoRegistros.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Registros Anteriores</h3>
                <div className="space-y-4">
                  {historicoRegistros.slice(0, 5).map(registro => (
                    <div key={registro.data} className="border-b border-border pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">
                          {new Date(registro.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20">
                          {registro.faseEmoji} {registro.faseNome}
                        </span>
                      </div>
                      {registro.diario && (
                        <p className="text-sm text-muted-foreground">{registro.diario}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Coluna direita - Previsões e Recomendações */}
          <div className="space-y-6">
            {/* Próxima menstruação */}
            <Card className="p-6 border-2" style={{ borderColor: '#FF4B6E' }}>
              <div className="flex items-start gap-4">
                <Calendar className="h-8 w-8 text-[#FF4B6E]" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Próxima Menstruação</h3>
                  <div className="text-center my-6">
                    <p className="text-5xl font-bold text-[#FF4B6E] mb-2">
                      {proximaMenstruacao.diasRestantes}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {proximaMenstruacao.diasRestantes === 1 ? 'dia' : 'dias'}
                    </p>
                  </div>
                  <p className="text-center text-sm">
                    {proximaMenstruacao.data.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Card>

            {/* Recomendações */}
            <Recommendations faseAtual={faseAtual} />

            {/* Insights e estatísticas */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Seus Insights
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Ciclo Médio</p>
                  <p className="text-2xl font-bold">{config.duracaoCiclo} dias</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Regularidade</p>
                  <p className="text-lg font-semibold capitalize">{config.regularidade}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Melhor Fase p/ Treinar</p>
                  <p className="text-lg font-semibold">🌱 Folicular</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleDashboard;
