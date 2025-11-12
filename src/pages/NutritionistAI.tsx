import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[];
  inputType?: "text" | "textarea" | "buttons";
}

interface ConversationState {
  phase: number;
  userData: {
    name?: string;
    goal?: string;
    meals?: string;
    schedule?: string;
    cooking?: string;
    time?: string;
    lovesFoods?: string;
    hatesFoods?: string;
    allergies?: string;
    diet?: string;
    snacks?: string;
    alcohol?: string;
    cheatDays?: string;
    water?: string;
    currentWeight?: string;
    targetWeight?: string;
    deadline?: string;
    dailyMeals?: string;
  };
}

const NutritionistAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou sua nutricionista IA. Como posso te chamar?",
      inputType: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<ConversationState>({
    phase: 1,
    userData: {},
  });

  const conversationFlow = [
    // Phase 1 - Nome
    {
      question: "Prazer, {name}! Qual seu principal objetivo nutricional?",
      options: [
        "Emagrecer e perder gordura",
        "Ganhar massa muscular",
        "Manter peso e definir",
        "Melhorar performance esportiva",
        "Saúde e bem-estar geral",
      ],
      field: "goal",
    },
    // Phase 2 - Rotina
    {
      question: "Me conte sobre sua rotina atual. Quantas refeições faz por dia?",
      options: ["1-2 refeições", "3-4 refeições", "5+ refeições"],
      field: "meals",
    },
    {
      question: "Tem algum horário fixo para se alimentar?",
      inputType: "text",
      field: "schedule",
    },
    {
      question: "Cozinha em casa ou come mais fora?",
      options: ["Sempre cozinho em casa", "Metade casa, metade fora", "Sempre como fora"],
      field: "cooking",
    },
    {
      question: "Tem tempo para preparar refeições?",
      options: ["Sim, tenho bastante tempo", "Tenho tempo limitado", "Não tenho tempo"],
      field: "time",
    },
    // Phase 3 - Preferências
    {
      question: "Vamos falar sobre seus gostos. Quais alimentos você AMA e não abre mão?",
      inputType: "textarea",
      field: "lovesFoods",
    },
    {
      question: "Quais alimentos NÃO GOSTA ou evita?",
      inputType: "textarea",
      field: "hatesFoods",
    },
    {
      question: "Tem alergias ou intolerâncias?",
      options: ["Lactose", "Glúten", "Ambos", "Outras", "Nenhuma"],
      field: "allergies",
    },
    {
      question: "Segue alguma dieta específica?",
      options: ["Vegetariana", "Vegana", "Low carb", "Cetogênica", "Nenhuma"],
      field: "diet",
    },
    // Phase 4 - Hábitos
    {
      question: "Para personalizar melhor, me conte: Costuma beliscar entre refeições?",
      options: ["Sim, frequentemente", "Às vezes", "Raramente", "Nunca"],
      field: "snacks",
    },
    {
      question: "Consome bebidas alcóolicas? Quantas vezes por semana?",
      options: ["Não bebo", "1-2 vezes/semana", "3-4 vezes/semana", "5+ vezes/semana"],
      field: "alcohol",
    },
    {
      question: "Tem 'dias do lixo' ou come doces com frequência?",
      options: ["Sim, toda semana", "De vez em quando", "Raramente", "Nunca"],
      field: "cheatDays",
    },
    {
      question: "Bebe quantos litros de água por dia?",
      options: ["Menos de 1L", "1-2L", "2-3L", "Mais de 3L"],
      field: "water",
    },
    // Phase 5 - Metas
    {
      question: "Últimas perguntas para fechar seu plano. Qual seu peso atual em kg?",
      inputType: "text",
      field: "currentWeight",
    },
    {
      question: "Qual seu peso desejado em kg?",
      inputType: "text",
      field: "targetWeight",
    },
    {
      question: "Em quantas semanas deseja atingir esse objetivo?",
      inputType: "text",
      field: "deadline",
    },
    {
      question: "Está disposto(a) a fazer quantas refeições diárias?",
      options: ["3 refeições", "4 refeições", "5 refeições", "6 refeições"],
      field: "dailyMeals",
    },
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: messageText },
    ];

    // Update conversation state
    const currentPhase = conversation.phase;
    const currentFlow = conversationFlow[currentPhase - 1];
    
    const updatedUserData = {
      ...conversation.userData,
    };

    if (currentPhase === 1) {
      updatedUserData.name = messageText;
    } else if (currentFlow) {
      updatedUserData[currentFlow.field as keyof typeof updatedUserData] = messageText;
    }

    // Add AI response
    if (currentPhase <= conversationFlow.length) {
      const nextFlow = conversationFlow[currentPhase];
      if (nextFlow) {
        let aiMessage = nextFlow.question;
        if (aiMessage.includes("{name}")) {
          aiMessage = aiMessage.replace("{name}", updatedUserData.name || "");
        }

        newMessages.push({
          role: "assistant",
          content: aiMessage,
          options: nextFlow.options,
          inputType: (nextFlow.inputType || (nextFlow.options ? "buttons" : "text")) as "text" | "textarea" | "buttons",
        });
      } else {
        // Fim do questionário
        newMessages.push({
          role: "assistant",
          content: `Perfeito, ${updatedUserData.name}! 🎉\n\nVou gerar seu plano alimentar personalizado baseado em todas as informações que me passou. Isso levará alguns segundos...\n\nVocê será redirecionado para seu cronograma nutricional em breve!`,
        });
      }
    }

    setMessages(newMessages);
    setConversation({
      phase: currentPhase + 1,
      userData: updatedUserData,
    });
    setInput("");
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const progressPercentage = (conversation.phase / (conversationFlow.length + 1)) * 100;

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
                      {message.options && message.role === "assistant" && (
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
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border/50 p-4">
              {messages[messages.length - 1]?.inputType === "textarea" ? (
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
