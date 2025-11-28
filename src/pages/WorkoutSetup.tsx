import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dumbbell, Flame, Sparkles, Zap, Target, Heart, Check, 
  HelpCircle, ArrowRight, ArrowLeft, Loader2, CheckSquare,
  Salad, User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Utilidades
const calcularIMC = (peso: number, altura: number): string => {
  if (!peso || !altura) return '-';
  const imc = peso / ((altura / 100) ** 2);
  return imc.toFixed(1);
};

const getIMCStatus = (imc: string): string => {
  const valor = parseFloat(imc);
  if (isNaN(valor)) return '';
  if (valor < 18.5) return 'abaixo';
  if (valor < 25) return 'normal';
  if (valor < 30) return 'sobrepeso';
  return 'obeso';
};

const getIMCStatusText = (imc: string): string => {
  const status = getIMCStatus(imc);
  const labels: Record<string, string> = {
    'abaixo': 'Abaixo do peso',
    'normal': 'Peso normal',
    'sobrepeso': 'Sobrepeso',
    'obeso': 'Obesidade'
  };
  return labels[status] || '';
};

const getIntensityDescription = (level: number): string => {
  const descriptions = [
    '',
    'Treinos leves e confortáveis',
    'Treinos moderados, com desafio controlado',
    'Treinos intensos e desafiadores',
    'Treinos muito intensos, próximo ao limite',
    'Treinos extremamente intensos, máximo esforço'
  ];
  return descriptions[level] || '';
};

const getEquipmentsByLocation = (location: string) => {
  const allEquipments = [
    { id: 'barra', name: 'Barra Livre', emoji: '🏋️', locations: ['academia', 'misto'] },
    { id: 'halteres', name: 'Halteres', emoji: '💪', locations: ['academia', 'casa', 'misto'] },
    { id: 'maquinas', name: 'Máquinas', emoji: '⚙️', locations: ['academia', 'misto'] },
    { id: 'peso-corporal', name: 'Peso Corporal', emoji: '🤸', locations: ['casa', 'parque', 'misto', 'academia'] },
    { id: 'elasticos', name: 'Elásticos', emoji: '🔴', locations: ['casa', 'parque', 'misto', 'academia'] },
    { id: 'kettlebell', name: 'Kettlebell', emoji: '⚫', locations: ['academia', 'casa', 'misto'] },
    { id: 'smith', name: 'Smith Machine', emoji: '🔧', locations: ['academia', 'misto'] },
    { id: 'cabo', name: 'Polias/Cabos', emoji: '🎣', locations: ['academia', 'misto'] },
    { id: 'barra-fixa', name: 'Barra Fixa', emoji: '🎯', locations: ['academia', 'parque', 'casa', 'misto'] },
    { id: 'paralelas', name: 'Paralelas', emoji: '🚧', locations: ['academia', 'parque', 'misto'] },
    { id: 'corda', name: 'Corda Naval', emoji: '🪢', locations: ['academia', 'parque', 'misto'] },
    { id: 'medicine-ball', name: 'Medicine Ball', emoji: '🏀', locations: ['academia', 'casa', 'misto'] }
  ];

  return allEquipments.filter(eq => eq.locations.includes(location));
};

export default function WorkoutSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Etapa 1 - Objetivo
  const [objetivo, setObjetivo] = useState('');
  
  // Etapa 2 - Biotipo
  const [biotipo, setBiotipo] = useState('');
  
  // Etapa 3 - Dados Físicos
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState('');
  const [pesoAtual, setPesoAtual] = useState('');
  const [altura, setAltura] = useState('');
  const [pesoObjetivo, setPesoObjetivo] = useState('');
  
  // Etapa 4 - Experiência
  const [experiencia, setExperiencia] = useState('');
  const [esportePraticado, setEsportePraticado] = useState('');
  const [condicionamento, setCondicionamento] = useState(3);
  
  // Etapa 5 - Disponibilidade
  const [diasTreino, setDiasTreino] = useState(4);
  const [tempoTreino, setTempoTreino] = useState(60);
  const [horarioPreferido, setHorarioPreferido] = useState('');
  
  // Etapa 6 - Local e Equipamentos
  const [localTreino, setLocalTreino] = useState('');
  const [equipamentos, setEquipamentos] = useState<string[]>([]);
  
  // Etapa 7 - Limitações e Saúde
  const [limitacoes, setLimitacoes] = useState<string[]>([]);
  const [detalhesLimitacoes, setDetalhesLimitacoes] = useState('');
  const [condicoesSaude, setCondicoesSaude] = useState<string[]>([]);
  const [liberacaoMedica, setLiberacaoMedica] = useState('');
  
  // Etapa 8 - Preferências
  const [tipoTreino, setTipoTreino] = useState('');
  const [exerciciosFavoritos, setExerciciosFavoritos] = useState('');
  const [exerciciosEvitar, setExerciciosEvitar] = useState('');
  const [intensidade, setIntensidade] = useState(3);
  
  // Etapa 9 - Motivação e Estilo de Vida
  const [motivacao, setMotivacao] = useState('');
  const [rotinaTrabalho, setRotinaTrabalho] = useState('');
  const [qualidadeSono, setQualidadeSono] = useState(3);
  const [nivelEstresse, setNivelEstresse] = useState(3);
  
  // Etapa 10 - Confirmação
  const [confirmacao, setConfirmacao] = useState(false);

  const toggleEquipment = (id: string) => {
    setEquipamentos(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleLimitacao = (id: string) => {
    setLimitacoes(prev => {
      if (id === 'nenhuma') {
        return prev.includes(id) ? [] : [id];
      }
      const newLimitacoes = prev.includes(id) 
        ? prev.filter(e => e !== id) 
        : [...prev.filter(e => e !== 'nenhuma'), id];
      return newLimitacoes;
    });
  };

  const toggleCondicao = (condition: string) => {
    setCondicoesSaude(prev => {
      if (condition === 'Nenhuma') {
        return prev.includes(condition) ? [] : [condition];
      }
      const newCondicoes = prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev.filter(c => c !== 'Nenhuma'), condition];
      return newCondicoes;
    });
  };

  const selecionarTodosEquipamentos = () => {
    const allIds = getEquipmentsByLocation(localTreino).map(eq => eq.id);
    setEquipamentos(allIds);
  };

  const handleNext = () => {
    // Validações por etapa
    if (currentStep === 1 && !objetivo) {
      toast.error("Selecione seu objetivo");
      return;
    }
    if (currentStep === 2 && !biotipo) {
      toast.error("Selecione seu biotipo");
      return;
    }
    if (currentStep === 3 && (!idade || !genero || !pesoAtual || !altura)) {
      toast.error("Preencha todos os dados físicos");
      return;
    }
    if (currentStep === 5 && !horarioPreferido) {
      toast.error("Selecione seu horário preferido");
      return;
    }
    if (currentStep === 6 && (!localTreino || equipamentos.length === 0)) {
      toast.error("Selecione o local e ao menos um equipamento");
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 10));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleGeneratePlan = async () => {
    if (!confirmacao) {
      toast.error("Confirme as informações para continuar");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Faça login para gerar seu plano de treino");
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      const dadosCompletos = {
        objetivo,
        biotipo,
        idade: parseInt(idade),
        genero,
        pesoAtual: parseFloat(pesoAtual),
        altura: parseFloat(altura),
        pesoObjetivo: pesoObjetivo ? parseFloat(pesoObjetivo) : null,
        imc: calcularIMC(parseFloat(pesoAtual), parseFloat(altura)),
        experiencia,
        esportePraticado,
        condicionamento,
        diasTreino,
        tempoTreino,
        horarioPreferido,
        localTreino,
        equipamentos,
        limitacoes,
        detalhesLimitacoes,
        condicoesSaude,
        liberacaoMedica,
        tipoTreino,
        exerciciosFavoritos,
        exerciciosEvitar,
        intensidade,
        motivacao,
        rotinaTrabalho,
        qualidadeSono,
        nivelEstresse
      };

      const { data, error } = await supabase.functions.invoke('generate-workout-plan', {
        body: dadosCompletos
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      // Salvar no Supabase
      const { error: saveError } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          plan_data: data.plano,
          biotipo,
          objetivo,
        });

      if (saveError) {
        console.error('Erro ao salvar plano:', saveError);
        toast.error("Plano gerado mas houve erro ao salvar.");
      } else {
        toast.success("🎉 Plano de treino criado com sucesso!");
      }

      navigate('/workouts');

    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      toast.error("Erro ao gerar plano de treino. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Dumbbell className="text-primary" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Criar Plano Personalizado
            </h1>
          </div>
          <p className="text-muted-foreground">Responda algumas perguntas para um treino perfeito para você</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Chat Container */}
        <Card className="p-6 md:p-8 shadow-lg border-border/50">
          {/* ETAPA 1 - OBJETIVO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground mb-2">
                  Olá! 👋 Sou seu personal trainer virtual.
                </p>
                <p className="text-foreground">
                  Vamos criar um treino perfeito para você! Antes de começar, me conta: <strong className="text-primary">qual é o seu principal objetivo?</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'emagrecer', icon: '🔥', title: 'Emagrecer', desc: 'Perder gordura e peso' },
                  { id: 'hipertrofia', icon: '💪', title: 'Ganhar Massa', desc: 'Aumentar músculos' },
                  { id: 'definicao', icon: '✨', title: 'Definir', desc: 'Tonificar o corpo' },
                  { id: 'condicionamento', icon: '⚡', title: 'Condicionamento', desc: 'Melhorar resistência' },
                  { id: 'forca', icon: '🏋️', title: 'Força', desc: 'Aumentar potência' },
                  { id: 'saude', icon: '❤️', title: 'Saúde Geral', desc: 'Qualidade de vida' }
                ].map(obj => (
                  <button
                    key={obj.id}
                    className={`objective-card p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      objetivo === obj.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border/50 hover:border-border'
                    }`}
                    onClick={() => setObjetivo(obj.id)}
                  >
                    <span className="text-4xl block mb-2">{obj.icon}</span>
                    <h4 className="font-semibold text-foreground mb-1">{obj.title}</h4>
                    <p className="text-xs text-muted-foreground">{obj.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ETAPA 2 - BIOTIPO */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground mb-2">Perfeito! Agora me ajuda a entender seu corpo.</p>
                <p className="text-foreground">
                  <strong className="text-primary">Qual desses tipos corporais mais se parece com você?</strong>
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'ectomorfo',
                    nome: 'Ectomorfo',
                    emoji: '🏃',
                    chars: ['Corpo magro', 'Dificuldade ganhar peso', 'Metabolismo acelerado', 'Ombros estreitos']
                  },
                  {
                    id: 'mesomorfo',
                    nome: 'Mesomorfo',
                    emoji: '🦸',
                    chars: ['Corpo atlético', 'Ganha músculo fácil', 'Perde gordura fácil', 'Ombros largos']
                  },
                  {
                    id: 'endomorfo',
                    nome: 'Endomorfo',
                    emoji: '🤾',
                    chars: ['Ganha peso fácil', 'Dificuldade perder gordura', 'Metabolismo lento', 'Estrutura larga']
                  }
                ].map(bio => (
                  <button
                    key={bio.id}
                    className={`p-5 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                      biotipo === bio.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border/50 hover:border-border'
                    }`}
                    onClick={() => setBiotipo(bio.id)}
                  >
                    <div className="text-5xl mb-3 text-center">{bio.emoji}</div>
                    <h3 className="text-lg font-bold mb-3 text-center text-foreground">{bio.nome}</h3>
                    <div className="space-y-1">
                      {bio.chars.map((char, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check size={14} className="text-primary" />
                          <span>{char}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-2 text-sm text-primary hover:underline mx-auto">
                <HelpCircle size={16} />
                Não tenho certeza do meu tipo
              </button>
            </div>
          )}

          {/* ETAPA 3 - DADOS FÍSICOS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground">
                  Agora preciso conhecer alguns dados seus para calcular tudo certinho! 📊
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Idade</label>
                  <input
                    type="number"
                    min="16"
                    max="80"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="Ex: 28"
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Gênero</label>
                  <div className="flex gap-2">
                    {['masculino', 'feminino', 'outro'].map(g => (
                      <button
                        key={g}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          genero === g
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                        onClick={() => setGenero(g)}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Peso Atual (kg)</label>
                  <input
                    type="number"
                    value={pesoAtual}
                    onChange={(e) => setPesoAtual(e.target.value)}
                    placeholder="Ex: 75"
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Altura (cm)</label>
                  <input
                    type="number"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    placeholder="Ex: 175"
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                {(objetivo === 'emagrecer' || objetivo === 'hipertrofia') && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-foreground">Peso Objetivo (kg)</label>
                    <input
                      type="number"
                      value={pesoObjetivo}
                      onChange={(e) => setPesoObjetivo(e.target.value)}
                      placeholder="Ex: 70"
                      className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    {pesoObjetivo && pesoAtual && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {objetivo === 'emagrecer' ? '↓' : '↑'} {Math.abs(parseFloat(pesoObjetivo) - parseFloat(pesoAtual)).toFixed(1)} kg
                      </p>
                    )}
                  </div>
                )}

                {pesoAtual && altura && (
                  <div className="md:col-span-2 p-4 bg-secondary/20 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Seu IMC:</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">
                          {calcularIMC(parseFloat(pesoAtual), parseFloat(altura))}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {getIMCStatusText(calcularIMC(parseFloat(pesoAtual), parseFloat(altura)))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ETAPA 4 - EXPERIÊNCIA */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground">Me conta sobre sua experiência com exercícios! 💪</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Há quanto tempo você treina?</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'nunca', label: 'Nunca treinei', icon: '🆕' },
                    { id: 'iniciante', label: '0-6 meses', icon: '🌱' },
                    { id: 'intermediario', label: '6 meses - 2 anos', icon: '💪' },
                    { id: 'avancado', label: '2-5 anos', icon: '🏆' },
                    { id: 'expert', label: 'Mais de 5 anos', icon: '👑' }
                  ].map(exp => (
                    <button
                      key={exp.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        experiencia === exp.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setExperiencia(exp.id)}
                    >
                      <span className="block text-2xl mb-1">{exp.icon}</span>
                      <span className="text-xs text-foreground">{exp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Você pratica ou praticou algum esporte?</label>
                <Textarea
                  value={esportePraticado}
                  onChange={(e) => setEsportePraticado(e.target.value)}
                  placeholder="Ex: Futebol por 10 anos, natação..."
                  rows={3}
                  className="border-border focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Como você avalia seu condicionamento físico atual?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        condicionamento === level
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setCondicionamento(level)}
                    >
                      <span className="block text-xl font-bold text-primary">{level}</span>
                      <span className="block text-xs text-muted-foreground">
                        {level === 1 ? 'Muito Baixo' : level === 2 ? 'Baixo' : level === 3 ? 'Médio' : level === 4 ? 'Bom' : 'Excelente'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 5 - DISPONIBILIDADE */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground">Vamos organizar sua rotina de treinos! 📅</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Quantos dias por semana você pode treinar?</label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map(days => (
                    <button
                      key={days}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        diasTreino === days
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setDiasTreino(days)}
                    >
                      <span className="block text-2xl font-bold text-primary">{days}</span>
                      <span className="block text-xs text-muted-foreground">dia{days > 1 ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Quanto tempo você tem por treino?</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { value: 30, label: '30 min', desc: 'Express' },
                    { value: 45, label: '45 min', desc: 'Moderado' },
                    { value: 60, label: '60 min', desc: 'Completo' },
                    { value: 75, label: '75 min', desc: 'Estendido' },
                    { value: 90, label: '90 min', desc: 'Longo' }
                  ].map(time => (
                    <button
                      key={time.value}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        tempoTreino === time.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setTempoTreino(time.value)}
                    >
                      <span className="block font-bold text-primary">{time.label}</span>
                      <span className="block text-xs text-muted-foreground">{time.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Qual seu horário preferido para treinar?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'manha', label: 'Manhã', icon: '🌅', time: '6h-12h' },
                    { id: 'tarde', label: 'Tarde', icon: '☀️', time: '12h-18h' },
                    { id: 'noite', label: 'Noite', icon: '🌙', time: '18h-22h' },
                    { id: 'flexivel', label: 'Flexível', icon: '🔄', time: 'Varia' }
                  ].map(period => (
                    <button
                      key={period.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        horarioPreferido === period.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setHorarioPreferido(period.id)}
                    >
                      <span className="block text-3xl mb-2">{period.icon}</span>
                      <span className="block font-semibold text-foreground">{period.label}</span>
                      <span className="block text-xs text-muted-foreground">{period.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 6 - LOCAL E EQUIPAMENTOS */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground">Onde você vai treinar e quais equipamentos tem acesso? 🏋️</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Onde você vai treinar?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'academia', label: 'Academia', icon: '🏋️', desc: 'Acesso completo' },
                    { id: 'casa', label: 'Em Casa', icon: '🏠', desc: 'Treino domiciliar' },
                    { id: 'parque', label: 'Ar Livre', icon: '🌳', desc: 'Parques e ruas' },
                    { id: 'misto', label: 'Misto', icon: '🔄', desc: 'Academia + casa' }
                  ].map(loc => (
                    <button
                      key={loc.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        localTreino === loc.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setLocalTreino(loc.id)}
                    >
                      <span className="block text-3xl mb-2">{loc.icon}</span>
                      <span className="block font-semibold text-foreground">{loc.label}</span>
                      <span className="block text-xs text-muted-foreground">{loc.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {localTreino && (
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Selecione os equipamentos disponíveis:</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {getEquipmentsByLocation(localTreino).map(eq => (
                      <button
                        key={eq.id}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          equipamentos.includes(eq.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => toggleEquipment(eq.id)}
                      >
                        <span className="block text-2xl mb-1">{eq.emoji}</span>
                        <span className="block text-xs text-foreground">{eq.name}</span>
                      </button>
                    ))}
                  </div>

                  {localTreino === 'academia' && (
                    <button
                      onClick={selecionarTodosEquipamentos}
                      className="flex items-center gap-2 text-sm text-primary hover:underline mt-3"
                    >
                      <CheckSquare size={16} />
                      Selecionar todos (academia completa)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ETAPA 7 - LIMITAÇÕES E SAÚDE */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground">Sua saúde é prioridade! Me conta se há algo que eu deva saber. 🏥</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Você tem alguma lesão ou limitação física?</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { id: 'joelho', label: 'Joelho', icon: '🦵' },
                    { id: 'ombro', label: 'Ombro', icon: '💪' },
                    { id: 'coluna', label: 'Coluna', icon: '🦴' },
                    { id: 'punho', label: 'Punho', icon: '🤚' },
                    { id: 'tornozelo', label: 'Tornozelo', icon: '👣' },
                    { id: 'nenhuma', label: 'Sem limitações', icon: '✅' }
                  ].map(issue => (
                    <button
                      key={issue.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        limitacoes.includes(issue.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleLimitacao(issue.id)}
                    >
                      <span className="block text-2xl mb-1">{issue.icon}</span>
                      <span className="block text-xs text-foreground">{issue.label}</span>
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="Descreva com mais detalhes suas limitações (opcional)..."
                  value={detalhesLimitacoes}
                  onChange={(e) => setDetalhesLimitacoes(e.target.value)}
                  rows={3}
                  className="mt-3 border-border focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Você tem alguma condição de saúde que devo saber?</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Hipertensão', 'Diabetes', 'Problemas cardíacos', 'Asma', 'Obesidade', 'Nenhuma'].map(condition => (
                    <button
                      key={condition}
                      className={`p-3 rounded-lg border-2 text-sm transition-all ${
                        condicoesSaude.includes(condition)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 text-foreground'
                      }`}
                      onClick={() => toggleCondicao(condition)}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Liberação médica para exercícios?</label>
                <div className="flex gap-3">
                  {[
                    { value: 'sim', label: 'Sim, tenho liberação' },
                    { value: 'nao', label: 'Não tenho/Não preciso' }
                  ].map(option => (
                    <button
                      key={option.value}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        liberacaoMedica === option.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 text-foreground'
                      }`}
                      onClick={() => setLiberacaoMedica(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 8 - PREFERÊNCIAS */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground">Quase lá! Me conta suas preferências para deixar o treino ainda melhor! ⭐</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Que tipo de treino você prefere?</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'forca', label: 'Musculação', desc: 'Tradicional', icon: '🏋️' },
                    { id: 'funcional', label: 'Funcional', desc: 'Movimentos naturais', icon: '🤸' },
                    { id: 'hiit', label: 'HIIT', desc: 'Alta intensidade', icon: '🔥' },
                    { id: 'crossfit', label: 'CrossFit', desc: 'Variado', icon: '💪' },
                    { id: 'calistenia', label: 'Calistenia', desc: 'Peso corporal', icon: '🤾' },
                    { id: 'misto', label: 'Misturado', desc: 'De tudo', icon: '🎯' }
                  ].map(type => (
                    <button
                      key={type.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        tipoTreino === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setTipoTreino(type.id)}
                    >
                      <span className="block text-3xl mb-1">{type.icon}</span>
                      <span className="block font-semibold text-sm text-foreground">{type.label}</span>
                      <span className="block text-xs text-muted-foreground">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Exercícios que você AMA fazer:</label>
                <Textarea
                  placeholder="Ex: agachamento, supino, corrida..."
                  value={exerciciosFavoritos}
                  onChange={(e) => setExerciciosFavoritos(e.target.value)}
                  rows={2}
                  className="border-border focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Exercícios que você ODEIA ou quer evitar:</label>
                <Textarea
                  placeholder="Ex: burpees, corrida, agachamento..."
                  value={exerciciosEvitar}
                  onChange={(e) => setExerciciosEvitar(e.target.value)}
                  rows={2}
                  className="border-border focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Intensidade preferida:</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensidade}
                  onChange={(e) => setIntensidade(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Leve</span>
                  <span>Moderado</span>
                  <span>Intenso</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {getIntensityDescription(intensidade)}
                </p>
              </div>
            </div>
          )}

          {/* ETAPA 9 - MOTIVAÇÃO E ESTILO DE VIDA */}
          {currentStep === 9 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground">Para finalizar, me ajuda a entender seu estilo de vida! 🎯</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Qual sua principal motivação para treinar?</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'saude', label: 'Saúde', icon: '❤️' },
                    { id: 'estetica', label: 'Estética', icon: '✨' },
                    { id: 'performance', label: 'Performance', icon: '🏆' },
                    { id: 'bemestar', label: 'Bem-estar', icon: '😊' },
                    { id: 'social', label: 'Social', icon: '👥' },
                    { id: 'desafio', label: 'Desafio', icon: '🎯' }
                  ].map(mot => (
                    <button
                      key={mot.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        motivacao === mot.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setMotivacao(mot.id)}
                    >
                      <span className="block text-3xl mb-1">{mot.icon}</span>
                      <span className="block text-sm font-semibold text-foreground">{mot.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Como é sua rotina de trabalho?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'sedentario', label: 'Sedentário', desc: 'Sentado o dia todo' },
                    { id: 'leve', label: 'Leve', desc: 'Algum movimento' },
                    { id: 'moderado', label: 'Moderado', desc: 'Fico em pé bastante' },
                    { id: 'ativo', label: 'Ativo', desc: 'Trabalho físico' }
                  ].map(work => (
                    <button
                      key={work.id}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        rotinaTrabalho === work.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setRotinaTrabalho(work.id)}
                    >
                      <strong className="block text-foreground">{work.label}</strong>
                      <span className="block text-xs text-muted-foreground">{work.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Qualidade do sono:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        qualidadeSono === level
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setQualidadeSono(level)}
                    >
                      <span className="block text-xl">
                        {level === 1 && '😴'}
                        {level === 2 && '😪'}
                        {level === 3 && '😐'}
                        {level === 4 && '😊'}
                        {level === 5 && '😄'}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-1">
                        {level === 1 ? 'Péssimo' : level === 2 ? 'Ruim' : level === 3 ? 'Regular' : level === 4 ? 'Bom' : 'Excelente'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">Nível de estresse no dia a dia:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        nivelEstresse === level
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setNivelEstresse(level)}
                    >
                      <span className="text-xl font-bold text-primary">{level}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Muito baixo</span>
                  <span>Muito alto</span>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 10 - RESUMO E CONFIRMAÇÃO */}
          {currentStep === 10 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="chat-bubble bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl rounded-tl-sm p-5 border border-primary/20">
                <p className="text-foreground">
                  Perfeito! Aqui está o resumo do seu perfil. Vou criar um treino especialmente para você! 🎉
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Seu Objetivo</h4>
                  <div className="text-lg font-bold text-primary capitalize">{objetivo}</div>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Biotipo</h4>
                  <div className="text-lg font-bold text-primary capitalize">{biotipo}</div>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Dados Físicos</h4>
                  <div className="text-sm text-foreground space-y-1">
                    <div>{idade} anos • {genero}</div>
                    <div>{pesoAtual}kg {pesoObjetivo && `→ ${pesoObjetivo}kg`}</div>
                    <div>{altura}cm</div>
                  </div>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Frequência</h4>
                  <div className="text-lg font-bold text-primary">{diasTreino}x/semana • {tempoTreino}min</div>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Experiência</h4>
                  <div className="text-lg font-bold text-primary capitalize">{experiencia}</div>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Local</h4>
                  <div className="text-lg font-bold text-primary capitalize">{localTreino}</div>
                </div>
              </div>

              <div className="p-5 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-3">O que você pode esperar:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5" />
                    <span>Treino 100% personalizado para seu biotipo e objetivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5" />
                    <span>{diasTreino} treinos por semana de {tempoTreino} minutos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5" />
                    <span>Exercícios adaptados aos seus equipamentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5" />
                    <span>Progressão inteligente de carga e intensidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5" />
                    <span>Vídeos demonstrativos de cada exercício</span>
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg border border-border cursor-pointer hover:bg-secondary/30 transition-all">
                <input
                  type="checkbox"
                  checked={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <span className="text-sm text-foreground">
                  Confirmo que todas as informações estão corretas e estou pronto para começar!
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 10 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                Próximo
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleGeneratePlan}
                disabled={!confirmacao || isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Gerando Plano...
                  </>
                ) : (
                  <>
                    Gerar Plano de Treino 💪
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
