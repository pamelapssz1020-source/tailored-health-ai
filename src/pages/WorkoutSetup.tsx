import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info, Dumbbell, Flame, Sparkles, Zap, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const biotipos = [
  {
    id: 'ectomorfo',
    nome: 'Ectomorfo',
    descricao: 'Corpo naturalmente magro, dificuldade em ganhar peso e massa muscular, metabolismo acelerado',
    caracteristicas: [
      '✓ Magro naturalmente',
      '✓ Dificuldade em ganhar peso',
      '✓ Metabolismo rápido',
      '✓ Membros longos e finos'
    ],
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 'mesomorfo',
    nome: 'Mesomorfo',
    descricao: 'Corpo atlético natural, facilidade em ganhar músculo e perder gordura, ombros largos, cintura fina',
    caracteristicas: [
      '✓ Corpo atlético natural',
      '✓ Ganha músculo facilmente',
      '✓ Perde gordura facilmente',
      '✓ Estrutura óssea média'
    ],
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'endomorfo',
    nome: 'Endomorfo',
    descricao: 'Corpo com tendência a acumular gordura, ganha massa facilmente, metabolismo mais lento, estrutura óssea robusta',
    caracteristicas: [
      '✓ Ganha peso facilmente',
      '✓ Dificuldade em perder gordura',
      '✓ Metabolismo lento',
      '✓ Estrutura óssea larga'
    ],
    gradient: 'from-orange-600 to-red-600'
  }
];

const objetivos = [
  { id: 'hipertrofia', nome: 'Hipertrofia', descricao: 'Ganhar massa muscular e aumentar volume', icon: Dumbbell, badge: 'Músculo' },
  { id: 'emagrecimento', nome: 'Emagrecimento', descricao: 'Perder gordura e definir o corpo', icon: Flame, badge: 'Queima' },
  { id: 'definicao', nome: 'Definição Muscular', descricao: 'Reduzir gordura mantendo massa magra', icon: Sparkles, badge: 'Definição' },
  { id: 'condicionamento', nome: 'Condicionamento', descricao: 'Melhorar resistência e performance', icon: Zap, badge: 'Resistência' },
  { id: 'forca', nome: 'Força', descricao: 'Aumentar força máxima e potência', icon: Dumbbell, badge: 'Força' },
  { id: 'manutencao', nome: 'Manutenção', descricao: 'Manter forma física atual', icon: Target, badge: 'Equilíbrio' }
];

const equipamentosDisponiveis = [
  { id: 'barra', nome: 'Barra Livre', icon: '🏋️' },
  { id: 'halteres', nome: 'Halteres', icon: '💪' },
  { id: 'maquinas', nome: 'Máquinas', icon: '⚙️' },
  { id: 'peso-corporal', nome: 'Peso Corporal', icon: '🤸' },
  { id: 'elásticos', nome: 'Elásticos', icon: '🔴' },
  { id: 'kettlebell', nome: 'Kettlebell', icon: '⚫' }
];

export default function WorkoutSetup() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [biotipo, setBiotipo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [nivel, setNivel] = useState('');
  const [diasTreino, setDiasTreino] = useState(4);
  const [tempo, setTempo] = useState('60');
  const [equipamentos, setEquipamentos] = useState<string[]>(['barra', 'halteres', 'maquinas']);
  const [limitacoes, setLimitacoes] = useState('');

  const toggleEquipamento = (id: string) => {
    setEquipamentos(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleGerarPlano = async () => {
    // Validação
    if (!biotipo || !objetivo || !nivel) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-workout-plan', {
        body: {
          biotipo,
          objetivo,
          nivel,
          diasTreino,
          tempo: parseInt(tempo),
          equipamentos,
          limitacoes
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      // Salvar no localStorage
      localStorage.setItem('workout-plan', JSON.stringify({
        plano: data.plano,
        criadoEm: new Date().toISOString(),
        biotipo,
        objetivo
      }));

      toast.success("Plano de treino gerado com sucesso! 💪");
      navigate('/workouts');

    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      toast.error("Erro ao gerar plano de treino. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Criar Plano de Treino Personalizado
          </h1>
          <p className="text-muted-foreground">Baseado no seu biotipo e objetivos</p>
        </div>

        {/* Indicador de Etapas */}
        <div className="flex justify-center mb-8 gap-2">
          {[1, 2, 3].map(num => (
            <div
              key={num}
              className={`w-12 h-2 rounded-full transition-all ${
                etapa >= num ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* ETAPA 1 - BIOTIPO */}
        {etapa === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Qual seu tipo corporal (biotipo)?</h2>
              <p className="text-muted-foreground">Isso nos ajuda a criar o treino ideal para você</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {biotipos.map(bio => (
                <Card
                  key={bio.id}
                  className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                    biotipo === bio.id
                      ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]'
                      : 'border-border/50'
                  }`}
                  onClick={() => setBiotipo(bio.id)}
                >
                  <div className={`w-full h-32 mb-4 rounded-lg bg-gradient-to-br ${bio.gradient} flex items-center justify-center text-6xl`}>
                    {bio.id === 'ectomorfo' ? '🏃' : bio.id === 'mesomorfo' ? '🦸' : '🤾'}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{bio.nome}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{bio.descricao}</p>
                  <ul className="space-y-1 text-sm">
                    {bio.caracteristicas.map((car, idx) => (
                      <li key={idx} className="text-muted-foreground">{car}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
              <Info size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                Não tem certeza? A maioria das pessoas é uma combinação de dois tipos. Escolha o que mais se aproxima.
              </span>
            </div>

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={() => setEtapa(2)}
                disabled={!biotipo}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 2 - OBJETIVO */}
        {etapa === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Qual seu principal objetivo?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {objetivos.map(obj => {
                const Icon = obj.icon;
                return (
                  <Card
                    key={obj.id}
                    className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                      objetivo === obj.id
                        ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]'
                        : 'border-border/50'
                    }`}
                    onClick={() => setObjetivo(obj.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Icon size={48} className="mb-4 text-primary" />
                      <h3 className="text-lg font-bold mb-2">{obj.nome}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{obj.descricao}</p>
                      <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                        Foco: {obj.badge}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setEtapa(1)}>
                Voltar
              </Button>
              <Button
                size="lg"
                onClick={() => setEtapa(3)}
                disabled={!objetivo}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 3 - DADOS COMPLEMENTARES */}
        {etapa === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Informações Adicionais</h2>
            </div>

            <Card className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nível de Experiência *</label>
                <Select value={nivel} onValueChange={setNivel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante (0-6 meses)</SelectItem>
                    <SelectItem value="intermediario">Intermediário (6 meses - 2 anos)</SelectItem>
                    <SelectItem value="avancado">Avançado (2+ anos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantos dias pode treinar por semana? *</label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map(day => (
                    <Button
                      key={day}
                      variant={diasTreino === day ? "default" : "outline"}
                      onClick={() => setDiasTreino(day)}
                      className="flex-1"
                    >
                      {day} dias
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tempo disponível por treino *</label>
                <Select value={tempo} onValueChange={setTempo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="75">75 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-4">Equipamentos disponíveis</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {equipamentosDisponiveis.map(eq => (
                    <label
                      key={eq.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        equipamentos.includes(eq.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-border'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={equipamentos.includes(eq.id)}
                        onChange={() => toggleEquipamento(eq.id)}
                        className="hidden"
                      />
                      <span className="text-2xl">{eq.icon}</span>
                      <span className="text-sm">{eq.nome}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lesões ou limitações? (opcional)</label>
                <Textarea
                  value={limitacoes}
                  onChange={(e) => setLimitacoes(e.target.value)}
                  placeholder="Ex: dor no joelho direito, tendinite no ombro..."
                  rows={3}
                />
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setEtapa(2)}>
                Voltar
              </Button>
              <Button
                size="lg"
                onClick={handleGerarPlano}
                disabled={!nivel || isLoading}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                {isLoading ? "Gerando Plano..." : "Gerar Plano de Treino 💪"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}