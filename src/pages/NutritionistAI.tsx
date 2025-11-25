import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Heart, Brain, Utensils, Loader2, Settings, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DietPlanDisplay } from "@/components/Nutrition/DietPlanDisplay";

interface UserProfile {
  idade: string;
  pesoAtual: string;
  altura: string;
  biotipo: string;
  genero: string;
  condicoesMedicas: string[];
  cicloMenstrual: string;
  historicoFamiliar: string;
  sintomasFrequentes: string[];
  qualidadeSono: string;
  funcionamentoIntestinal: string;
  relacaoComida: string;
  viciosPreferencias: string[];
  objetivo: string;
  nivelAtividade: string;
  nivelEstresse: string;
  consumoAgua: string;
  numRefeicoes: string;
  horarioAcordar: string;
  horarioDormir: string;
  tempoPreparacao: string;
  restricoesAlimentares: string[];
  alimentosAmados: string;
  alimentosOdiados: string;
  motivacao: string;
  suplementos: string;
  restricoes?: string[];
  restricoesOutras?: string;
  pesoObjetivo?: string;
  condicoesSaude?: string;
  preferenciasHorarios?: string;
}

const initialFormData: UserProfile = {
  idade: "",
  pesoAtual: "",
  altura: "",
  biotipo: "",
  genero: "",
  condicoesMedicas: [],
  cicloMenstrual: "",
  historicoFamiliar: "",
  sintomasFrequentes: [],
  qualidadeSono: "",
  funcionamentoIntestinal: "",
  relacaoComida: "",
  viciosPreferencias: [],
  objetivo: "",
  nivelAtividade: "",
  nivelEstresse: "",
  consumoAgua: "",
  numRefeicoes: "",
  horarioAcordar: "07:00",
  horarioDormir: "22:00",
  tempoPreparacao: "",
  restricoesAlimentares: [],
  alimentosAmados: "",
  alimentosOdiados: "",
  motivacao: "",
  suplementos: "",
  restricoes: [],
};

const NutritionistAI = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfile>(initialFormData);

  // Carregar plano existente do Supabase
  useEffect(() => {
    const loadExistingPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        setUserId(user.id);

        // Buscar plano mais recente usando query genérica
        const { data: plans, error } = await supabase
          .from('diet_plans' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Erro ao buscar plano:', error);
        } else if (plans && plans.length > 0) {
          const latestPlan = plans[0] as any;
          setDietPlan(latestPlan.plan_data);
          setSavedPlanId(latestPlan.id);
          
          // Restaurar dados do formulário se disponíveis
          if (latestPlan.profile_data && typeof latestPlan.profile_data === 'object') {
            setFormData(prev => ({ ...prev, ...(latestPlan.profile_data as UserProfile) }));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar plano:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPlan();
  }, []);

  const handleCheckboxChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneratePlan = async () => {
    // Validar campos obrigatórios
    const requiredFields = [
      { field: 'objetivo', label: 'Objetivo' },
      { field: 'idade', label: 'Idade' },
      { field: 'pesoAtual', label: 'Peso Atual' },
      { field: 'altura', label: 'Altura' },
      { field: 'nivelAtividade', label: 'Nível de Atividade' },
      { field: 'numRefeicoes', label: 'Número de Refeições' },
      { field: 'genero', label: 'Gênero' },
    ];

    const missingFields = requiredFields.filter(
      ({ field }) => !formData[field as keyof UserProfile]
    );

    if (missingFields.length > 0) {
      toast({
        title: "Campos Obrigatórios Faltando",
        description: `Preencha: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Erro de Autenticação",
        description: "Faça login para gerar seu plano alimentar.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Preparar dados com mapeamento de campos
      const payload = {
        ...formData,
        restricoes: formData.restricoesAlimentares,
      };

      const { data, error } = await supabase.functions.invoke("generate-diet-plan", {
        body: { userProfile: payload },
      });

      if (error) throw error;

      if (data.success) {
        // Salvar no Supabase
        const { data: savedPlan, error: saveError } = await supabase
          .from('diet_plans' as any)
          .insert({
            user_id: userId,
            plan_data: data.dietPlan,
            profile_data: formData,
          } as any)
          .select()
          .single();

        if (saveError) {
          console.error('Erro ao salvar plano:', saveError);
          toast({
            title: "Plano Gerado",
            description: "Plano criado mas houve erro ao salvar. Faça login novamente.",
            variant: "destructive",
          });
        } else {
          setSavedPlanId((savedPlan as any).id);
          toast({
            title: "Plano Criado e Salvo! 🎉",
            description: "Seu plano alimentar personalizado está pronto e salvo na sua conta!",
          });
        }

        setDietPlan(data.dietPlan);
      }
    } catch (error: any) {
      console.error("Error generating diet plan:", error);
      
      const errorMessage = error?.message || 
                         error?.error || 
                         "Tente novamente em alguns instantes.";
      
      toast({
        title: "Erro ao Gerar Plano",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = () => {
    toast({
      title: "Plano Salvo!",
      description: "Seu plano alimentar já está salvo automaticamente na sua conta.",
    });
  };

  const handleAdjustPlan = () => {
    setDietPlan(null);
    setSavedPlanId(null);
    toast({
      title: "Ajustando Plano",
      description: "Você pode refazer o formulário para ajustar seu plano.",
    });
  };

  const handleNewQuestionnaire = async () => {
    // Deletar plano antigo se existir
    if (savedPlanId && userId) {
      await supabase
        .from('diet_plans' as any)
        .delete()
        .eq('id', savedPlanId);
    }

    setDietPlan(null);
    setSavedPlanId(null);
    setFormData(initialFormData);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando seu plano...</p>
        </div>
      </div>
    );
  }

  if (dietPlan) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="bg-card border-b border-border/50 px-4 py-6">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Seu Plano Alimentar</h1>
              <p className="text-muted-foreground">
                Criado especialmente para você pela IA Nutricionista
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleNewQuestionnaire}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Gerar Novo Plano
            </Button>
          </div>
        </div>

        <div className="container mx-auto p-4 max-w-6xl">
          <DietPlanDisplay
            dietPlan={dietPlan}
            onSave={handleSavePlan}
            onAdjust={handleAdjustPlan}
            onNewQuestionnaire={handleNewQuestionnaire}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Consulta Nutricional & Endocrinológica</h1>
              <p className="text-muted-foreground text-sm">
                Análise completa de metabolismo, hormônios e comportamento alimentar
              </p>
            </div>
          </div>
          <Settings className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl p-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary mb-3">Anamnese Completa de Saúde</h2>
          <p className="text-muted-foreground">
            Preencha este formulário detalhado para uma análise digna de uma junta médica
          </p>
          <p className="text-muted-foreground">(Nutricionista + Endocrinologista).</p>
        </div>

        <div className="space-y-6">
          {/* Seção 1: Dados Pessoais & Biotipo */}
          <Card className="border-2 border-primary/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-primary">1. Dados Pessoais & Biotipo</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="idade" className="text-foreground">
                    Idade <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="idade"
                    placeholder="Ex: 30"
                    value={formData.idade}
                    onChange={(e) => handleInputChange("idade", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="peso" className="text-foreground">
                    Peso Atual (kg) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="peso"
                    placeholder="Ex: 70.5"
                    value={formData.pesoAtual}
                    onChange={(e) => handleInputChange("pesoAtual", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="altura" className="text-foreground">
                    Altura (cm) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="altura"
                    placeholder="Ex: 170"
                    value={formData.altura}
                    onChange={(e) => handleInputChange("altura", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="genero" className="text-foreground">
                    Gênero <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.genero} onValueChange={(value) => handleInputChange("genero", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="biotipo" className="text-foreground">Qual seu Biotipo Corporal?</Label>
                <Select value={formData.biotipo} onValueChange={(value) => handleInputChange("biotipo", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione seu tipo de corpo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ectomorfo">Ectomorfo (Magro, dificuldade para ganhar peso)</SelectItem>
                    <SelectItem value="mesomorfo">Mesomorfo (Atlético, ganha músculo facilmente)</SelectItem>
                    <SelectItem value="endomorfo">Endomorfo (Estrutura maior, ganha peso facilmente)</SelectItem>
                    <SelectItem value="misto">Misto (Combinação de tipos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2: Saúde Metabólica & Hormonal */}
          <Card className="border-2 border-primary/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-primary">2. Saúde Metabólica & Hormonal</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-foreground mb-3 block">Condições Médicas Diagnosticadas ou Suspeitas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Diabetes / Pré-Diabetes",
                      "Resistência Insulínica",
                      "Hipotireoidismo",
                      "Hipertireoidismo",
                      "SOP (Ovários Policísticos)",
                      "Colesterol Alto",
                      "Gastrite / Refluxo",
                      "Esteatose Hepática"
                    ].map((condicao) => (
                      <div key={condicao} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condicao-${condicao}`}
                          checked={formData.condicoesMedicas.includes(condicao)}
                          onCheckedChange={() => handleCheckboxChange("condicoesMedicas", condicao)}
                        />
                        <Label htmlFor={`condicao-${condicao}`} className="text-sm cursor-pointer">
                          {condicao}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ciclo" className="text-foreground">Ciclo Menstrual (Mulheres)</Label>
                    <Select value={formData.cicloMenstrual} onValueChange={(value) => handleInputChange("cicloMenstrual", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Não se aplica (Homem)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao-aplica">Não se aplica (Homem)</SelectItem>
                        <SelectItem value="regular">Regular (ciclos de 28-32 dias)</SelectItem>
                        <SelectItem value="irregular">Irregular (varia muito)</SelectItem>
                        <SelectItem value="ausente">Ausente (amenorreia)</SelectItem>
                        <SelectItem value="menopausa">Menopausa / Pós-menopausa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="historico" className="text-foreground">Histórico Familiar</Label>
                    <Input
                      id="historico"
                      placeholder="Ex: Pai diabético, mãe hipertensa..."
                      value={formData.historicoFamiliar}
                      onChange={(e) => handleInputChange("historicoFamiliar", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 3: Sinais, Sintomas & Comportamento */}
          <Card className="border-2 border-primary/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-primary">3. Sinais, Sintomas & Comportamento</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-foreground mb-3 block">Sintomas Frequentes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Cansaço excessivo",
                      "Queda de cabelo",
                      "Unhas fracas",
                      "Inchaço / Retenção",
                      "Intestino preso",
                      "Gases / Estufamento",
                      "Ansiedade",
                      "Insônia",
                      "Baixa libido",
                      "Tontura / Fraqueza"
                    ].map((sintoma) => (
                      <div key={sintoma} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sintoma-${sintoma}`}
                          checked={formData.sintomasFrequentes.includes(sintoma)}
                          onCheckedChange={() => handleCheckboxChange("sintomasFrequentes", sintoma)}
                        />
                        <Label htmlFor={`sintoma-${sintoma}`} className="text-sm cursor-pointer">
                          {sintoma}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sono" className="text-foreground">Qualidade do Sono</Label>
                    <Select value={formData.qualidadeSono} onValueChange={(value) => handleInputChange("qualidadeSono", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Como você dorme?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="otimo">Ótimo</SelectItem>
                        <SelectItem value="bom">Bom</SelectItem>
                        <SelectItem value="ruim">Ruim</SelectItem>
                        <SelectItem value="pessimo">Péssimo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="intestino" className="text-foreground">Funcionamento Intestinal</Label>
                    <Select value={formData.funcionamentoIntestinal} onValueChange={(value) => handleInputChange("funcionamentoIntestinal", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Como é seu intestino?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="preso">Preso</SelectItem>
                        <SelectItem value="solto">Solto</SelectItem>
                        <SelectItem value="irregular">Irregular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="relacao" className="text-foreground">Relação com a Comida</Label>
                    <Select value={formData.relacaoComida} onValueChange={(value) => handleInputChange("relacaoComida", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Como você se relaciona?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tranquila">Tranquila</SelectItem>
                        <SelectItem value="compulsiva">Compulsiva</SelectItem>
                        <SelectItem value="restritiva">Restritiva</SelectItem>
                        <SelectItem value="emocional">Emocional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 4: Objetivo, Rotina & Dieta */}
          <Card className="border-2 border-primary/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Utensils className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-primary">4. Objetivo, Rotina & Dieta</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="objetivo" className="text-foreground">
                      Objetivo Principal <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.objetivo} onValueChange={(value) => handleInputChange("objetivo", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="O que você quer alcançar?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emagrecer e definir">Emagrecer e definir</SelectItem>
                        <SelectItem value="Ganhar massa muscular">Ganhar massa muscular</SelectItem>
                        <SelectItem value="Melhorar saúde geral">Melhorar saúde geral</SelectItem>
                        <SelectItem value="Controlar doença metabólica">Controlar doença</SelectItem>
                        <SelectItem value="Manter peso atual">Manter peso atual</SelectItem>
                        <SelectItem value="Performance esportiva">Performance esportiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="atividade" className="text-foreground">
                      Nível de Atividade Física <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.nivelAtividade} onValueChange={(value) => handleInputChange("nivelAtividade", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Quão ativo você é?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedentário (trabalho sentado, pouco movimento)">Sedentário</SelectItem>
                        <SelectItem value="Levemente Ativo (exercícios leves 1-2x/semana)">Levemente Ativo</SelectItem>
                        <SelectItem value="Moderadamente Ativo (exercícios 3-4x/semana)">Moderadamente Ativo</SelectItem>
                        <SelectItem value="Muito Ativo (exercícios intensos 5-6x/semana)">Muito Ativo</SelectItem>
                        <SelectItem value="Extremamente Ativo (atleta, treina 2x/dia)">Atleta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="estresse" className="text-foreground">Nível de Estresse</Label>
                    <Select value={formData.nivelEstresse} onValueChange={(value) => handleInputChange("nivelEstresse", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Como está seu estresse?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixo">Baixo</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="alto">Alto</SelectItem>
                        <SelectItem value="muito-alto">Muito Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="agua" className="text-foreground">Consumo de Água</Label>
                    <Select value={formData.consumoAgua} onValueChange={(value) => handleInputChange("consumoAgua", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Quanto bebe por dia?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menos-1L">Menos de 1 litro</SelectItem>
                        <SelectItem value="1-2L">1 a 2 litros</SelectItem>
                        <SelectItem value="2-3L">2 a 3 litros</SelectItem>
                        <SelectItem value="mais-3L">Mais de 3 litros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="refeicoes" className="text-foreground">
                      Refeições por Dia <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.numRefeicoes} onValueChange={(value) => handleInputChange("numRefeicoes", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Quantas refeições?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 refeições</SelectItem>
                        <SelectItem value="4">4 refeições</SelectItem>
                        <SelectItem value="5">5 refeições</SelectItem>
                        <SelectItem value="6">6 refeições</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="acordar" className="text-foreground">Horário de Acordar</Label>
                    <Input
                      id="acordar"
                      type="time"
                      value={formData.horarioAcordar}
                      onChange={(e) => handleInputChange("horarioAcordar", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dormir" className="text-foreground">Horário de Dormir</Label>
                    <Input
                      id="dormir"
                      type="time"
                      value={formData.horarioDormir}
                      onChange={(e) => handleInputChange("horarioDormir", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tempo" className="text-foreground">Tempo para Cozinhar</Label>
                    <Select value={formData.tempoPreparacao} onValueChange={(value) => handleInputChange("tempoPreparacao", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Quanto tempo tem?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pouco">Pouco (menos de 30 min)</SelectItem>
                        <SelectItem value="medio">Médio (30-60 min)</SelectItem>
                        <SelectItem value="bastante">Bastante (mais de 1h)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-foreground mb-3 block">Restrições Alimentares</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Vegetariano",
                      "Vegano",
                      "Sem Glúten",
                      "Sem Lactose",
                      "Low Carb",
                      "Sem Frutos do Mar",
                      "Sem Porco",
                      "Alergia a Amendoim"
                    ].map((restricao) => (
                      <div key={restricao} className="flex items-center space-x-2">
                        <Checkbox
                          id={`restricao-${restricao}`}
                          checked={formData.restricoesAlimentares.includes(restricao)}
                          onCheckedChange={() => handleCheckboxChange("restricoesAlimentares", restricao)}
                        />
                        <Label htmlFor={`restricao-${restricao}`} className="text-sm cursor-pointer">
                          {restricao}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ama" className="text-foreground">Alimentos que Você AMA</Label>
                    <Textarea
                      id="ama"
                      placeholder="Ex: frango, arroz, banana, ovos..."
                      value={formData.alimentosAmados}
                      onChange={(e) => handleInputChange("alimentosAmados", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="odeia" className="text-foreground">Alimentos que Você ODEIA</Label>
                    <Textarea
                      id="odeia"
                      placeholder="Ex: fígado, jiló, quiabo..."
                      value={formData.alimentosOdiados}
                      onChange={(e) => handleInputChange("alimentosOdiados", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="motivacao" className="text-foreground">Qual sua maior motivação?</Label>
                    <Textarea
                      id="motivacao"
                      placeholder="Ex: melhorar autoestima, saúde..."
                      value={formData.motivacao}
                      onChange={(e) => handleInputChange("motivacao", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="suplementos" className="text-foreground">Usa algum suplemento?</Label>
                    <Textarea
                      id="suplementos"
                      placeholder="Ex: whey, creatina..."
                      value={formData.suplementos}
                      onChange={(e) => handleInputChange("suplementos", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Gerar Plano */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="px-12 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:shadow-glow-intense transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando seu Plano Personalizado...
                </>
              ) : (
                <>
                  <Utensils className="mr-2 h-5 w-5" />
                  Gerar Meu Plano Alimentar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionistAI;