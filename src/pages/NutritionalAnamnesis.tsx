import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Heart, Brain, UtensilsCrossed, Settings, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DietPlanDisplay } from "@/components/Nutrition/DietPlanDisplay";

interface FormData {
  // Seção 1: Dados Pessoais & Biotipo
  idade: string;
  pesoAtual: string;
  altura: string;
  biotipoCorporal: string;
  
  // Seção 2: Saúde Metabólica & Hormonal
  condicoesMedicas: string[];
  cicloMenstrual: string;
  historicoFamiliar: string;
  
  // Seção 3: Sinais, Sintomas & Comportamento
  sintomasFrequentes: string[];
  qualidadeSono: string;
  funcionamentoIntestinal: string;
  relacaoComida: string;
  viciosPreferencias: string[];
  
  // Seção 4: Objetivo, Rotina & Dieta
  objetivo: string;
  nivelAtividade: string;
  nivelEstresse: string;
  consumoAgua: string;
  refeicoesdia: string;
  horarioAcordar: string;
  horarioDormir: string;
  tempoCozinhar: string;
  restricoesAlimentares: string[];
  alimentosAma: string;
  alimentosOdeia: string;
  motivacao: string;
  suplementos: string;
}

const NutritionalAnamnesis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<any>(null);
  
  const [formData, setFormData] = useState<FormData>({
    idade: "",
    pesoAtual: "",
    altura: "",
    biotipoCorporal: "",
    condicoesMedicas: [],
    cicloMenstrual: "não-se-aplica",
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
    refeicoesdia: "5",
    horarioAcordar: "07:00",
    horarioDormir: "22:00",
    tempoCozinhar: "",
    restricoesAlimentares: [],
    alimentosAma: "",
    alimentosOdeia: "",
    motivacao: "",
    suplementos: "",
  });

  const toggleArrayField = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      setFormData({
        ...formData,
        [field]: currentArray.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentArray, value],
      });
    }
  };

  const handleGeneratePlan = async () => {
    // Validações básicas
    if (!formData.idade || !formData.pesoAtual || !formData.altura) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha idade, peso e altura.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const userProfile = {
        objetivo: formData.objetivo || "Melhorar Saúde Geral",
        idade: parseFloat(formData.idade),
        pesoAtual: parseFloat(formData.pesoAtual),
        altura: parseFloat(formData.altura),
        biotipoCorporal: formData.biotipoCorporal || "Mesomorfo",
        nivelAtividade: formData.nivelAtividade || "Moderadamente Ativo (exercícios 3-4x/semana)",
        restricoes: formData.restricoesAlimentares.length > 0 ? formData.restricoesAlimentares : ["Sem restrições"],
        alimentosAmados: formData.alimentosAma || "",
        alimentosOdiados: formData.alimentosOdeia || "",
        numRefeicoes: parseInt(formData.refeicoesdia),
        horarioAcordar: formData.horarioAcordar,
        horarioDormir: formData.horarioDormir,
        tempoPreparacao: formData.tempoCozinhar || "Cerca de 30 minutos por dia",
        condicoesSaude: formData.condicoesMedicas.join(", ") || "Nenhuma",
        sintomasFrequentes: formData.sintomasFrequentes.join(", ") || "Nenhum",
        qualidadeSono: formData.qualidadeSono || "Normal",
        funcionamentoIntestinal: formData.funcionamentoIntestinal || "Normal",
        relacaoComida: formData.relacaoComida || "Normal",
        consumoAgua: formData.consumoAgua || "2 litros/dia",
        nivelEstresse: formData.nivelEstresse || "Médio",
        motivacao: formData.motivacao || "",
        suplementos: formData.suplementos || "Nenhum",
        historicoFamiliar: formData.historicoFamiliar || "Nenhum",
      };

      const { data, error } = await supabase.functions.invoke("generate-diet-plan", {
        body: { userProfile },
      });

      if (error) throw error;

      if (data.success) {
        setDietPlan(data.dietPlan);
        
        localStorage.setItem(
          "user-diet-plan",
          JSON.stringify({
            profile: userProfile,
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
      
      toast({
        title: "Erro ao gerar plano",
        description: error?.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (dietPlan) {
    return (
      <DietPlanDisplay
        dietPlan={dietPlan}
        onSave={() => {
          toast({ title: "Plano salvo com sucesso!" });
          navigate("/nutrition");
        }}
        onAdjust={() => setDietPlan(null)}
        onNewQuestionnaire={() => {
          setDietPlan(null);
          setFormData({
            idade: "",
            pesoAtual: "",
            altura: "",
            biotipoCorporal: "",
            condicoesMedicas: [],
            cicloMenstrual: "não-se-aplica",
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
            refeicoesdia: "5",
            horarioAcordar: "07:00",
            horarioDormir: "22:00",
            tempoCozinhar: "",
            restricoesAlimentares: [],
            alimentosAma: "",
            alimentosOdeia: "",
            motivacao: "",
            suplementos: "",
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Consulta Nutricional & Endocrinológica</h1>
            <p className="text-sm text-muted-foreground">
              Análise completa de metabolismo, hormônios e comportamento alimentar
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => navigate("/nutrition")}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Anamnese Completa de Saúde</h2>
          <p className="text-muted-foreground">
            Preencha este formulário detalhado para uma análise digna de uma junta médica
            <br />
            (Nutricionista + Endocrinologista).
          </p>
        </div>

        {/* Seção 1: Dados Pessoais & Biotipo */}
        <Card className="mb-6 border-primary/30 shadow-lg">
          <CardHeader className="bg-card/50">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Activity className="w-5 h-5" />
              1. Dados Pessoais & Biotipo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  placeholder="Ex: 30"
                  value={formData.idade}
                  onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="peso">Peso Atual (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  value={formData.pesoAtual}
                  onChange={(e) => setFormData({ ...formData, pesoAtual: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  placeholder="Ex: 170"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="biotipo">Qual seu Biotipo Corporal?</Label>
              <Select value={formData.biotipoCorporal} onValueChange={(value) => setFormData({ ...formData, biotipoCorporal: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu tipo de corpo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ectomorfo">Ectomorfo (magro, dificuldade em ganhar peso)</SelectItem>
                  <SelectItem value="Mesomorfo">Mesomorfo (atlético, ganha músculo facilmente)</SelectItem>
                  <SelectItem value="Endomorfo">Endomorfo (tendência a acumular gordura)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Seção 2: Saúde Metabólica & Hormonal */}
        <Card className="mb-6 border-primary/30 shadow-lg">
          <CardHeader className="bg-card/50">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Heart className="w-5 h-5" />
              2. Saúde Metabólica & Hormonal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className="mb-3 block">Condições Médicas Diagnosticadas ou Suspeitas</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  "Diabetes / Pré-Diabetes",
                  "Resistência Insulínica",
                  "Hipotireoidismo",
                  "Hipertireoidismo",
                  "SOP (Ovários Policísticos)",
                  "Colesterol Alto",
                  "Gastrite / Refluxo",
                  "Esteatose Hepática",
                ].map((condicao) => (
                  <div key={condicao} className="flex items-center space-x-2">
                    <Checkbox
                      id={condicao}
                      checked={formData.condicoesMedicas.includes(condicao)}
                      onCheckedChange={() => toggleArrayField("condicoesMedicas", condicao)}
                    />
                    <Label htmlFor={condicao} className="text-sm cursor-pointer">
                      {condicao}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ciclo">Ciclo Menstrual (Mulheres)</Label>
                <Select value={formData.cicloMenstrual} onValueChange={(value) => setFormData({ ...formData, cicloMenstrual: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="não-se-aplica">Não se aplica (Homem)</SelectItem>
                    <SelectItem value="regular">Regular (28-35 dias)</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                    <SelectItem value="ausente">Ausente (Amenorreia)</SelectItem>
                    <SelectItem value="menopausa">Menopausa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="historico">Histórico Familiar (Diabetes, Cardíaco, Obesidade...)</Label>
                <Input
                  id="historico"
                  placeholder="Ex: Pai diabético, mãe hipertensa..."
                  value={formData.historicoFamiliar}
                  onChange={(e) => setFormData({ ...formData, historicoFamiliar: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 3: Sinais, Sintomas & Comportamento */}
        <Card className="mb-6 border-primary/30 shadow-lg">
          <CardHeader className="bg-card/50">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Brain className="w-5 h-5" />
              3. Sinais, Sintomas & Comportamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className="mb-3 block">Sintomas Frequentes</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  "Tontura / Fraqueza",
                ].map((sintoma) => (
                  <div key={sintoma} className="flex items-center space-x-2">
                    <Checkbox
                      id={sintoma}
                      checked={formData.sintomasFrequentes.includes(sintoma)}
                      onCheckedChange={() => toggleArrayField("sintomasFrequentes", sintoma)}
                    />
                    <Label htmlFor={sintoma} className="text-sm cursor-pointer">
                      {sintoma}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sono">Qualidade do Sono</Label>
                <Select value={formData.qualidadeSono} onValueChange={(value) => setFormData({ ...formData, qualidadeSono: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como você dorme?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente (7-9h contínuas)</SelectItem>
                    <SelectItem value="bom">Bom (acordo 1-2x)</SelectItem>
                    <SelectItem value="ruim">Ruim (insônia frequente)</SelectItem>
                    <SelectItem value="muito-ruim">Muito Ruim (menos de 5h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="intestino">Funcionamento Intestinal</Label>
                <Select value={formData.funcionamentoIntestinal} onValueChange={(value) => setFormData({ ...formData, funcionamentoIntestinal: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como é seu intestino?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular (1x por dia)</SelectItem>
                    <SelectItem value="preso">Preso (menos de 3x/semana)</SelectItem>
                    <SelectItem value="solto">Solto (mais de 3x/dia)</SelectItem>
                    <SelectItem value="irregular">Irregular (varia muito)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="relacao-comida">Relação com a Comida</Label>
                <Select value={formData.relacaoComida} onValueChange={(value) => setFormData({ ...formData, relacaoComida: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tranquila">Tranquila</SelectItem>
                    <SelectItem value="compulsiva">Compulsiva (ataque de comida)</SelectItem>
                    <SelectItem value="restritiva">Restritiva (evito comer)</SelectItem>
                    <SelectItem value="emocional">Emocional (como quando triste)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Vícios ou Preferências Fortes</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  "Doces / Açúcar",
                  "Salgados / Frituras",
                  "Refrigerante",
                  "Café em excesso",
                  "Fast Food",
                  "Massas / Pães",
                ].map((vicio) => (
                  <div key={vicio} className="flex items-center space-x-2">
                    <Checkbox
                      id={vicio}
                      checked={formData.viciosPreferencias.includes(vicio)}
                      onCheckedChange={() => toggleArrayField("viciosPreferencias", vicio)}
                    />
                    <Label htmlFor={vicio} className="text-sm cursor-pointer">
                      {vicio}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 4: Objetivo, Rotina & Dieta */}
        <Card className="mb-6 border-primary/30 shadow-lg">
          <CardHeader className="bg-card/50">
            <CardTitle className="flex items-center gap-2 text-primary">
              <UtensilsCrossed className="w-5 h-5" />
              4. Objetivo, Rotina & Dieta
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="objetivo">Qual seu principal objetivo?</Label>
                <Select value={formData.objetivo} onValueChange={(value) => setFormData({ ...formData, objetivo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emagrecer e Perder Peso">Emagrecer e Perder Peso</SelectItem>
                    <SelectItem value="Ganhar Massa Muscular">Ganhar Massa Muscular</SelectItem>
                    <SelectItem value="Definir e Tonificar">Definir e Tonificar</SelectItem>
                    <SelectItem value="Melhorar Saúde Geral">Melhorar Saúde Geral</SelectItem>
                    <SelectItem value="Controle Hormonal">Controle Hormonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="atividade">Nível de Atividade Física</Label>
                <Select value={formData.nivelAtividade} onValueChange={(value) => setFormData({ ...formData, nivelAtividade: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedentário (sem exercícios)">Sedentário (sem exercícios)</SelectItem>
                    <SelectItem value="Levemente Ativo (exercícios 1-2x/semana)">Levemente Ativo (1-2x/semana)</SelectItem>
                    <SelectItem value="Moderadamente Ativo (exercícios 3-4x/semana)">Moderadamente Ativo (3-4x/semana)</SelectItem>
                    <SelectItem value="Muito Ativo (exercícios 5-6x/semana)">Muito Ativo (5-6x/semana)</SelectItem>
                    <SelectItem value="Atleta (treinamento intenso diário)">Atleta (treinamento intenso diário)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estresse">Nível de Estresse Diário</Label>
                <Select value={formData.nivelEstresse} onValueChange={(value) => setFormData({ ...formData, nivelEstresse: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como é seu estresse?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixo">Baixo (tranquilo)</SelectItem>
                    <SelectItem value="Médio">Médio (moderado)</SelectItem>
                    <SelectItem value="Alto">Alto (muito estressado)</SelectItem>
                    <SelectItem value="Muito Alto">Muito Alto (esgotado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agua">Consumo de Água (Litros/dia)</Label>
                <Select value={formData.consumoAgua} onValueChange={(value) => setFormData({ ...formData, consumoAgua: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Quanto você bebe?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Menos de 1L">Menos de 1L</SelectItem>
                    <SelectItem value="1-2L">1-2L</SelectItem>
                    <SelectItem value="2-3L">2-3L</SelectItem>
                    <SelectItem value="Mais de 3L">Mais de 3L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="refeicoes">Refeições por dia</Label>
                <Select value={formData.refeicoesdia} onValueChange={(value) => setFormData({ ...formData, refeicoesdia: value })}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="acordar">Horário de Acordar</Label>
                <Input
                  id="acordar"
                  type="time"
                  value={formData.horarioAcordar}
                  onChange={(e) => setFormData({ ...formData, horarioAcordar: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dormir">Horário de Dormir</Label>
                <Input
                  id="dormir"
                  type="time"
                  value={formData.horarioDormir}
                  onChange={(e) => setFormData({ ...formData, horarioDormir: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tempo-cozinha">Tempo para Cozinhar</Label>
              <Select value={formData.tempoCozinhar} onValueChange={(value) => setFormData({ ...formData, tempoCozinhar: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Quanto tempo você tem?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Menos de 15 minutos">Menos de 15 minutos</SelectItem>
                  <SelectItem value="15-30 minutos">15-30 minutos</SelectItem>
                  <SelectItem value="30-60 minutos">30-60 minutos</SelectItem>
                  <SelectItem value="Mais de 1 hora">Mais de 1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block">Restrições Alimentares</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  "Intolerância à Lactose",
                  "Glúten/Celíaco",
                  "Vegetariano",
                  "Vegano",
                  "Diabetes",
                  "Hipertensão",
                ].map((restricao) => (
                  <div key={restricao} className="flex items-center space-x-2">
                    <Checkbox
                      id={restricao}
                      checked={formData.restricoesAlimentares.includes(restricao)}
                      onCheckedChange={() => toggleArrayField("restricoesAlimentares", restricao)}
                    />
                    <Label htmlFor={restricao} className="text-sm cursor-pointer">
                      {restricao}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ama">Alimentos que você AMA 😍</Label>
                <Textarea
                  id="ama"
                  placeholder="Ex: Chocolate, Frango, Arroz, Maçã..."
                  value={formData.alimentosAma}
                  onChange={(e) => setFormData({ ...formData, alimentosAma: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="odeia">Alimentos que você ODEIA 🤢</Label>
                <Textarea
                  id="odeia"
                  placeholder="Ex: Fígado, Quiabo, Peixe cru..."
                  value={formData.alimentosOdeia}
                  onChange={(e) => setFormData({ ...formData, alimentosOdeia: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="motivacao">Qual sua principal motivação hoje?</Label>
              <Textarea
                id="motivacao"
                placeholder="Ex: Tenho um casamento em 3 meses, quero melhorar minha energia, recomendação médica..."
                value={formData.motivacao}
                onChange={(e) => setFormData({ ...formData, motivacao: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="suplementos">Suplementos ou Medicamentos (Opcional)</Label>
              <Textarea
                id="suplementos"
                placeholder="Ex: Whey Protein, Creatina, Vitamina C..."
                value={formData.suplementos}
                onChange={(e) => setFormData({ ...formData, suplementos: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Gerar */}
        <Button
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Gerando Plano Completo...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Gerar Plano Completo (Nutri + Endo)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NutritionalAnamnesis;
