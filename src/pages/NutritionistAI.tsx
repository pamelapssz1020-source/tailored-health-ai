import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Send, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DietPlanDisplay } from "@/components/Nutrition/DietPlanDisplay";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[];
  inputType?: "text" | "textarea" | "buttons" | "checkboxes";
}

interface UserProfile {
  objetivo: string;
  idade: number;
  pesoAtual: number;
  altura: number;
  pesoObjetivo?: number;
  nivelAtividade: string;
  restricoes: string[];
  restricoesOutras?: string;
  alimentosAmados: string;
  alimentosOdiados: string;
  numRefeicoes: number;
  horarioAcordar: string;
  horarioDormir: string;
  preferenciasHorarios?: string;
  condicoesSaude?: string;
  tempoPreparacao: string;
  suplementos?: string;
}

interface ConversationState {
  phase: number;
  currentQuestion: string;
  userData: Partial<UserProfile>;
}

const NutritionistAI = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! 👋 Sou a Dra. Ana, sua nutricionista pessoal com IA. Vou criar um plano alimentar 100% personalizado para você. Qual é o seu principal objetivo?",
      options: [
        "Emagrecer e Perder Peso",
        "Ganhar Massa Muscular",
        "Manter Peso Atual",
        "Definir e Tonificar",
        "Melhorar Saúde Geral",
      ],
      inputType: "buttons",
    },
  ]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<ConversationState>({
    phase: 0,
    currentQuestion: "objetivo",
    userData: {},
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  const conversationFlow = [
    // Etapa 1 - Objetivo (já mostrado inicialmente)
    {
      field: "objetivo",
      nextQuestion: "Perfeito! Para criar seu plano ideal, preciso conhecer você melhor. Qual sua idade?",
      inputType: "text" as const,
      nextField: "idade",
    },
    {
      field: "idade",
      nextQuestion: "Qual seu peso atual? (em kg)",
      inputType: "text" as const,
      nextField: "pesoAtual",
    },
    {
      field: "pesoAtual",
      nextQuestion: "E sua altura? (em cm)",
      inputType: "text" as const,
      nextField: "altura",
    },
    {
      field: "altura",
      nextQuestion: "Qual seu peso objetivo? (em kg)",
      inputType: "text" as const,
      nextField: "pesoObjetivo",
      condition: (userData: any) => 
        userData.objetivo?.includes("Emagrecer") || userData.objetivo?.includes("Ganhar"),
    },
    {
      field: "pesoObjetivo",
      nextQuestion: "Como você descreveria seu nível de atividade física no dia a dia?",
      options: [
        "Sedentário (trabalho sentado, pouco movimento)",
        "Levemente Ativo (exercícios leves 1-2x/semana)",
        "Moderadamente Ativo (exercícios 3-4x/semana)",
        "Muito Ativo (exercícios intensos 5-6x/semana)",
        "Extremamente Ativo (atleta, treina 2x/dia)",
      ],
      inputType: "buttons" as const,
      nextField: "nivelAtividade",
    },
    {
      field: "nivelAtividade",
      nextQuestion: "Você tem alguma restrição alimentar, alergia ou condição especial? (Marque todas que se aplicam)",
      options: [
        "Intolerância à Lactose",
        "Intolerância ao Glúten/Celíaco",
        "Vegetariano",
        "Vegano",
        "Diabetes",
        "Hipertensão",
        "Sem restrições",
      ],
      inputType: "checkboxes" as const,
      nextField: "restricoes",
    },
    {
      field: "restricoes",
      nextQuestion: "Quais alimentos você AMA e não abre mão? (me conte seus favoritos!)",
      inputType: "textarea" as const,
      nextField: "alimentosAmados",
    },
    {
      field: "alimentosAmados",
      nextQuestion: "E quais alimentos você ODEIA ou prefere evitar?",
      inputType: "textarea" as const,
      nextField: "alimentosOdiados",
    },
    {
      field: "alimentosOdiados",
      nextQuestion: "Quantas refeições por dia você prefere fazer?",
      options: ["3 refeições", "4 refeições", "5 refeições", "6 refeições"],
      inputType: "buttons" as const,
      nextField: "numRefeicoes",
    },
    {
      field: "numRefeicoes",
      nextQuestion: "A que horas você geralmente acorda?",
      inputType: "text" as const,
      nextField: "horarioAcordar",
    },
    {
      field: "horarioAcordar",
      nextQuestion: "E a que horas costuma ir dormir?",
      inputType: "text" as const,
      nextField: "horarioDormir",
    },
    {
      field: "horarioDormir",
      nextQuestion: "Tem algum horário preferido para refeições principais? (opcional)",
      inputType: "textarea" as const,
      nextField: "preferenciasHorarios",
    },
    {
      field: "preferenciasHorarios",
      nextQuestion: "Você tem alguma condição de saúde que eu deva considerar? (opcional)",
      inputType: "textarea" as const,
      nextField: "condicoesSaude",
    },
    {
      field: "condicoesSaude",
      nextQuestion: "Quanto tempo você tem disponível para preparar refeições?",
      options: [
        "Muito pouco (refeições rápidas)",
        "Cerca de 30 minutos por dia",
        "1 hora ou mais por dia",
        "Adoro cozinhar, tenho tempo!",
      ],
      inputType: "buttons" as const,
      nextField: "tempoPreparacao",
    },
    {
      field: "tempoPreparacao",
      nextQuestion: "Você toma algum suplemento ou medicamento regularmente? (opcional)",
      inputType: "textarea" as const,
      nextField: "suplementos",
    },
  ];

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() && conversation.currentQuestion !== "restricoes") return;

    // Add user message
    const newMessages: Message[] = [...messages, { role: "user", content: messageText }];

    // Update user data
    const updatedUserData = { ...conversation.userData };
    
    if (conversation.currentQuestion === "restricoes") {
      updatedUserData.restricoes = selectedRestrictions;
    } else if (conversation.currentQuestion === "numRefeicoes") {
      updatedUserData.numRefeicoes = parseInt(messageText.split(" ")[0]);
    } else if (["idade", "pesoAtual", "altura", "pesoObjetivo"].includes(conversation.currentQuestion)) {
      (updatedUserData as any)[conversation.currentQuestion] = parseFloat(messageText);
    } else {
      (updatedUserData as any)[conversation.currentQuestion] = messageText;
    }

    // Find next step
    let nextStepIndex = conversationFlow.findIndex(
      (step) => step.field === conversation.currentQuestion
    );

    // Skip conditional steps
    do {
      nextStepIndex++;
    } while (
      nextStepIndex < conversationFlow.length &&
      conversationFlow[nextStepIndex].condition &&
      !conversationFlow[nextStepIndex].condition!(updatedUserData)
    );

    if (nextStepIndex < conversationFlow.length) {
      const nextStep = conversationFlow[nextStepIndex];
      newMessages.push({
        role: "assistant",
        content: nextStep.nextQuestion || "",
        options: nextStep.options,
        inputType: nextStep.inputType,
      });

      setMessages(newMessages);
      setConversation({
        phase: conversation.phase + 1,
        currentQuestion: nextStep.nextField || "",
        userData: updatedUserData,
      });
      setInput("");
      setSelectedRestrictions([]);
    } else {
      // Fim do questionário - gerar plano
      newMessages.push({
        role: "assistant",
        content:
          "Perfeito! 🎉\n\nTenho todas as informações que preciso. Vou analisar seu perfil e criar um plano alimentar exclusivo para você. Isso levará cerca de 15 segundos...",
      });
      setMessages(newMessages);
      setIsGenerating(true);

      try {
        // Ensure all required fields have values
        const completeUserData = {
          ...updatedUserData,
          idade: updatedUserData.idade || 30,
          pesoAtual: updatedUserData.pesoAtual || 70,
          altura: updatedUserData.altura || 170,
          nivelAtividade: updatedUserData.nivelAtividade || "Moderadamente Ativo (exercícios 3-4x/semana)",
          restricoes: updatedUserData.restricoes || ["Sem restrições"],
          alimentosAmados: updatedUserData.alimentosAmados || "",
          alimentosOdiados: updatedUserData.alimentosOdiados || "",
          numRefeicoes: updatedUserData.numRefeicoes || 5,
          horarioAcordar: updatedUserData.horarioAcordar || "07:00",
          horarioDormir: updatedUserData.horarioDormir || "22:00",
          tempoPreparacao: updatedUserData.tempoPreparacao || "Cerca de 30 minutos por dia",
        };

        const { data, error } = await supabase.functions.invoke("generate-diet-plan", {
          body: { userProfile: completeUserData },
        });

        if (error) throw error;

        if (data.success) {
          setDietPlan(data.dietPlan);
          
          // Salvar no localStorage
          localStorage.setItem(
            "user-diet-plan",
            JSON.stringify({
              profile: updatedUserData,
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
        
        newMessages.push({
          role: "assistant",
          content: `Desculpe, ocorreu um erro ao gerar seu plano: ${errorMessage}\n\nPode tentar novamente?`,
        });
        setMessages(newMessages);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const handleRestrictionToggle = (restriction: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
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
      description: "Você pode refazer o questionário para ajustar seu plano.",
    });
  };

  const handleNewQuestionnaire = () => {
    setDietPlan(null);
    setMessages([
      {
        role: "assistant",
        content: "Olá! 👋 Vou criar um novo plano alimentar para você. Qual é o seu principal objetivo?",
        options: [
          "Emagrecer e Perder Peso",
          "Ganhar Massa Muscular",
          "Manter Peso Atual",
          "Definir e Tonificar",
          "Melhorar Saúde Geral",
        ],
        inputType: "buttons",
      },
    ]);
    setConversation({
      phase: 0,
      currentQuestion: "objetivo",
      userData: {},
    });
  };

  const progressPercentage = (conversation.phase / conversationFlow.length) * 100;

  if (dietPlan) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="bg-card border-b border-border/50 px-4 py-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">Seu Plano Alimentar</h1>
            <p className="text-muted-foreground">
              Criado especialmente para você pela Dra. Ana
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border/50 px-4 py-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary shadow-glow">
              <AvatarImage src="/placeholder.svg" alt="Dra. Ana" />
              <AvatarFallback className="bg-primary/20">
                <User className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Consulta com Sua Nutricionista IA</h1>
              <p className="text-muted-foreground">
                Vamos criar juntos seu plano alimentar perfeito
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso da Consulta</span>
              <span className="text-primary font-semibold">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="shadow-elevated border-primary/20">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border border-primary/50">
                <AvatarImage src="/placeholder.svg" alt="Dra. Ana" />
                <AvatarFallback className="bg-primary/20">DA</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg">Dra. Ana</p>
                <p className="text-xs text-muted-foreground font-normal">Nutricionista IA</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "bg-card border border-border/50"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      
                      {/* Options Buttons */}
                      {message.options && message.role === "assistant" && message.inputType === "buttons" && (
                        <div className="mt-4 space-y-2">
                          {message.options.map((option, optIndex) => (
                            <Button
                              key={optIndex}
                              variant="outline"
                              className="w-full justify-start hover-glow"
                              onClick={() => handleOptionClick(option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      {/* Checkboxes for restrictions */}
                      {message.options && message.role === "assistant" && message.inputType === "checkboxes" && (
                        <div className="mt-4 space-y-3">
                          {message.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <Checkbox
                                id={`restriction-${optIndex}`}
                                checked={selectedRestrictions.includes(option)}
                                onCheckedChange={() => handleRestrictionToggle(option)}
                              />
                              <Label
                                htmlFor={`restriction-${optIndex}`}
                                className="text-sm cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                          <Button
                            onClick={() => handleSendMessage(selectedRestrictions.join(", "))}
                            className="w-full mt-4"
                            disabled={selectedRestrictions.length === 0}
                          >
                            Continuar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border/50 p-4">
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2 p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">Gerando seu plano personalizado...</span>
                </div>
              ) : messages[messages.length - 1]?.inputType === "checkboxes" ? null : messages[messages.length - 1]?.inputType === "textarea" ? (
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="flex-1"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    className="self-end"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionistAI;
