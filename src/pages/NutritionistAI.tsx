import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Heart, Brain, Utensils, Loader2, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DietPlanDisplay } from "@/components/Nutrition/DietPlanDisplay";

interface UserProfile {
  // Dados Pessoais & Biotipo
  idade: string;
  pesoAtual: string;
  altura: string;
  biotipo: string;
  
  // Saúde Metabólica & Hormonal
  condicoesMedicas: string[];
  cicloMenstrual: string;
  historicoFamiliar: string;
  
  // Sinais, Sintomas & Comportamento
  sintomasFrequentes: string[];
  qualidadeSono: string;
  funcionamentoIntestinal: string;
  relacaoComida: string;
  viciosPreferencias: string[];
  
  // Objetivo, Rotina & Dieta
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

const NutritionistAI = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<any>(null);
  
  const [formData, setFormData] = useState<UserProfile>({
    idade: "",
    pesoAtual: "",
    altura: "",
    biotipo: "",
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
  });

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
        setDietPlan(data.dietPlan);
        
        localStorage.setItem(
          "user-diet-plan",
          JSON.stringify({
            profile: formData,
            plan: data.dietPlan,
            createdAt: new Date().toISOString(),
          })
        );

        toast({
          title: "Plano Criado! 🎉",
          description: "Seu plano alimentar personalizado está pronto!",
        });
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
      description: "Seu plano alimentar foi salvo com sucesso.",
    });
  };

  const handleAdjustPlan = () => {
    setDietPlan(null);
    toast({
      title: "Ajustando Plano",
      description: "Você pode refazer o formulário para ajustar seu plano.",
    });
  };

  const handleNewQuestionnaire = () => {
    setDietPlan(null);
    setFormData({
      idade: "",
      pesoAtual: "",
      altura: "",
      biotipo: "",
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
    });
  };

  if (dietPlan) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="bg-card border-b border-border/50 px-4 py-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">Seu Plano Alimentar</h1>
            <p className="text-muted-foreground">
              Criado especialmente para você pela IA Nutricionista
            </p>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="idade" className="text-foreground">Idade</Label>
                  <Input
                    id="idade"
                    placeholder="Ex: 30"
                    value={formData.idade}
                    onChange={(e) => handleInputChange("idade", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="peso" className="text-foreground">Peso Atual (kg)</Label>
                  <Input
                    id="peso"
                    placeholder="Ex: 70.5"
                    value={formData.pesoAtual}
                    onChange={(e) => handleInputChange("pesoAtual", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="altura" className="text-foreground">Altura (cm)</Label>
                  <Input
                    id="altura"
                    placeholder="Ex: 170"
                    value={formData.altura}
                    onChange={(e) => handleInputChange("altura", e.target.value)}
                    className="mt-1"
                  />
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
                    <Label htmlFor="historico" className="text-foreground">Histórico Familiar (Diabetes, Cardíaco, Obesidade...)</Label>
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
                        <SelectItem value="otimo">Ótimo (durmo bem, acordo disposto)</SelectItem>
                        <SelectItem value="bom">Bom (durmo razoável)</SelectItem>
                        <SelectItem value="ruim">Ruim (acordo cansado)</SelectItem>
                        <SelectItem value="pessimo">Péssimo (insônia frequente)</SelectItem>
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
                        <SelectItem value="regular">Regular (todos os dias)</SelectItem>
                        <SelectItem value="constipado">Constipado (preso)</SelectItem>
                        <SelectItem value="irregular">Irregular (varia)</SelectItem>
                        <SelectItem value="diarreia">Diarreia frequente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="relacao" className="text-foreground">Relação com a Comida</Label>
                    <Select value={formData.relacaoComida} onValueChange={(value) => handleInputChange("relacaoComida", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione..." />
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

                <div>
                  <Label className="text-foreground mb-3 block">Vícios ou Preferências Fortes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {[
                      "Doces / Açúcar",
                      "Salgados / Frituras",
                      "Refrigerante",
                      "Café em excesso",
                      "Fast Food",
                      "Massas / Pães"
                    ].map((vicio) => (
                      <div key={vicio} className="flex items-center space-x-2">
                        <Checkbox
                          id={`vicio-${vicio}`}
                          checked={formData.viciosPreferencias.includes(vicio)}
                          onCheckedChange={() => handleCheckboxChange("viciosPreferencias", vicio)}
                        />
                        <Label htmlFor={`vicio-${vicio}`} className="text-sm cursor-pointer">
                          {vicio}
                        </Label>
                      </div>
                    ))}
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
                    <Label htmlFor="objetivo" className="text-foreground">Qual seu principal objetivo?</Label>
                    <Select value={formData.objetivo} onValueChange={(value) => handleInputChange("objetivo", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione um objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emagrecer">Emagrecer e Perder Peso</SelectItem>
                        <SelectItem value="ganhar">Ganhar Massa Muscular</SelectItem>
                        <SelectItem value="manter">Manter Peso Atual</SelectItem>
                        <SelectItem value="definir">Definir e Tonificar</SelectItem>
                        <SelectItem value="saude">Melhorar Saúde Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="atividade" className="text-foreground">Nível de Atividade Física</Label>
                    <Select value={formData.nivelAtividade} onValueChange={(value) => handleInputChange("nivelAtividade", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione seu nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentario">Sedentário (sem exercícios)</SelectItem>
                        <SelectItem value="leve">Levemente Ativo (1-2x/semana)</SelectItem>
                        <SelectItem value="moderado">Moderadamente Ativo (3-4x/semana)</SelectItem>
                        <SelectItem value="muito">Muito Ativo (5-6x/semana)</SelectItem>
                        <SelectItem value="extremo">Extremamente Ativo (atleta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estresse" className="text-foreground">Nível de Estresse Diário</Label>
                    <Select value={formData.nivelEstresse} onValueChange={(value) => handleInputChange("nivelEstresse", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Como é seu estresse?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixo">Baixo (tranquilo)</SelectItem>
                        <SelectItem value="moderado">Moderado (às vezes estressado)</SelectItem>
                        <SelectItem value="alto">Alto (estressado frequentemente)</SelectItem>
                        <SelectItem value="muito-alto">Muito Alto (burnout)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="agua" className="text-foreground">Consumo de Água (Litros/dia)</Label>
                    <Select value={formData.consumoAgua} onValueChange={(value) => handleInputChange("consumoAgua", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Quanto você bebe?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pouco">Menos de 1L</SelectItem>
                        <SelectItem value="1-2">1-2 Litros</SelectItem>
                        <SelectItem value="2-3">2-3 Litros</SelectItem>
                        <SelectItem value="muito">Mais de 3 Litros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="refeicoes" className="text-foreground">Refeições por dia</Label>
                    <Select value={formData.numRefeicoes} onValueChange={(value) => handleInputChange("numRefeicoes", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="5 Refeições" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Refeições</SelectItem>
                        <SelectItem value="4">4 Refeições</SelectItem>
                        <SelectItem value="5">5 Refeições</SelectItem>
                        <SelectItem value="6">6 Refeições</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                </div>

                <div>
                  <Label htmlFor="tempo" className="text-foreground">Tempo para Cozinhar</Label>
                  <Select value={formData.tempoPreparacao} onValueChange={(value) => handleInputChange("tempoPreparacao", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Quanto tempo você tem?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pouco">Muito pouco (refeições rápidas)</SelectItem>
                      <SelectItem value="30min">Cerca de 30 minutos</SelectItem>
                      <SelectItem value="1h">1 hora ou mais</SelectItem>
                      <SelectItem value="muito">Adoro cozinhar, tenho tempo!</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground mb-3 block">Restrições Alimentares</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      "Intolerância à Lactose",
                      "Glúten/Celíaco",
                      "Vegetariano",
                      "Vegano",
                      "Diabetes",
                      "Hipertensão"
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
                    <Label htmlFor="ama" className="text-foreground">Alimentos que você AMA 😍</Label>
                    <Textarea
                      id="ama"
                      placeholder="Ex: Chocolate, Frango, Arroz, Maçã..."
                      value={formData.alimentosAmados}
                      onChange={(e) => handleInputChange("alimentosAmados", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="odeia" className="text-foreground">Alimentos que você ODEIA 🤢</Label>
                    <Textarea
                      id="odeia"
                      placeholder="Ex: Fígado, Quiabo, Peixe cru..."
                      value={formData.alimentosOdiados}
                      onChange={(e) => handleInputChange("alimentosOdiados", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="motivacao" className="text-foreground">Qual sua principal motivação hoje?</Label>
                  <Textarea
                    id="motivacao"
                    placeholder="Ex: Tenho um casamento em 3 meses, quero melhorar minha energia, recomendação médica..."
                    value={formData.motivacao}
                    onChange={(e) => handleInputChange("motivacao", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="suplementos" className="text-foreground">Suplementos ou Medicamentos (Opcional)</Label>
                  <Textarea
                    id="suplementos"
                    placeholder="Ex: Whey Protein, Creatina, Vitamina C..."
                    value={formData.suplementos}
                    onChange={(e) => handleInputChange("suplementos", e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Gerar */}
          <Button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="w-full py-8 text-xl font-bold shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-primary to-primary/80"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Analisando e Gerando Plano...
              </>
            ) : (
              <>
                <Heart className="mr-3 h-6 w-6" />
                Gerar Plano Completo (Nutri + Endo)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NutritionistAI;
