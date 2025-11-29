import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SofiaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const SofiaAssistant = ({ isOpen, onClose }: SofiaAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou a Sofia, sua gerente de sucesso 😊 Estou aqui para ajudar com qualquer dúvida sobre o app, planos, treinos, dietas ou suporte técnico. Como posso te ajudar hoje?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Knowledge Base Responses - Sofia's expertise
    setTimeout(() => {
      const query = input.toLowerCase();
      let response = "";

      // Pricing & Plans
      if (query.includes("preço") || query.includes("plano") || query.includes("pagar") || query.includes("custo")) {
        response = "Nossos planos são super acessíveis! 💳\n\n✨ Teste Grátis de 7 dias\n💪 Plano Mensal: R$ 49,90\n🔥 Plano Anual: R$ 399 (economize 33%)\n\nTodos incluem: Scanner de alimentos, treinos personalizados, dieta com IA, e suporte 24/7. Quer que eu te ajude a começar o teste grátis?";
      }
      // Scanner
      else if (query.includes("scanner") || query.includes("escanear") || query.includes("foto") || query.includes("alimento")) {
        response = "O Scanner Inteligente é incrível! 📸✨\n\nBasta tirar uma foto do seu prato e a IA identifica tudo automaticamente:\n• Calorias\n• Macros (proteínas, carboidratos, gorduras)\n• Micronutrientes\n• Peso estimado\n\nPrecisão de 98%! Funciona com mais de 10.000 alimentos. Quer testar agora?";
      }
      // Workouts
      else if (query.includes("treino") || query.includes("exercício") || query.includes("personal") || query.includes("musculação")) {
        response = "Nossos treinos são 100% personalizados! 💪🎯\n\nA IA cria seu plano baseado em:\n• Seu biotipo (ectomorfo, mesomorfo, endomorfo)\n• Objetivos (hipertrofia, emagrecimento, definição)\n• Nível de experiência\n• Tempo disponível\n• Lesões ou limitações\n\nCada exercício vem com vídeo demonstrativo! Posso te guiar para criar seu primeiro treino?";
      }
      // Diet/Nutrition
      else if (query.includes("dieta") || query.includes("nutrição") || query.includes("comida") || query.includes("alimentação")) {
        response = "A IA de Nutrição é seu nutricionista pessoal! 🥗🤖\n\nEla cria um plano alimentar completo considerando:\n• Suas restrições alimentares\n• Objetivos (perda de peso, ganho de massa, etc.)\n• Preferências e aversões\n• Rotina e horários\n• Calorias e macros ideais\n\nTudo ajustado em tempo real! Quer gerar sua dieta agora?";
      }
      // Cancel
      else if (query.includes("cancelar") || query.includes("parar") || query.includes("desistir")) {
        response = "Entendo que às vezes as coisas mudam... 😔\n\nVocê pode cancelar a qualquer momento em:\nConfigurações > Minha Conta > Cancelar Assinatura\n\nSem pegadinhas, sem taxas! Mas antes de ir, posso saber o que não funcionou? Talvez eu possa ajudar a resolver! 💙";
      }
      // Technical Issues
      else if (query.includes("erro") || query.includes("bug") || query.includes("não funciona") || query.includes("problema")) {
        response = "Sinto muito pelo problema técnico! 😟\n\nPara resolver isso rapidamente:\n1. Tente recarregar a página (F5)\n2. Limpe o cache do navegador\n3. Se persistir, tire um print e me envie\n\nSe precisar de ajuda urgente, vou chamar um especialista técnico para você! Posso abrir um ticket de suporte?";
      }
      // Change Plan/Workout
      else if (query.includes("mudar") || query.includes("trocar") || query.includes("alterar")) {
        response = "Você pode atualizar seus planos quando quiser! 🔄\n\n✅ Para mudar o treino: Dashboard > Treinos > 'Gerar Novo Plano'\n✅ Para mudar a dieta: Nutrição > 'Refazer Anamnese'\n✅ Para mudar o plano: Configurações > Plano\n\nSuas preferências sempre podem ser ajustadas! O que você gostaria de mudar?";
      }
      // Default - Empathetic fallback
      else {
        response = "Hmm, não tenho certeza sobre isso ainda... 🤔\n\nMas não se preocupe! Vou chamar um especialista humano da nossa equipe para te ajudar melhor. Você pode descrever sua dúvida com mais detalhes? Assim consigo encaminhar para a pessoa certa! 💙";
      }

      const aiMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col p-0 gap-0 glass-card border-primary/50">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/50">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                <Bot className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Sofia</span>
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground font-normal">
                Gerente de Sucesso • Online agora
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8 border border-border/50">
                  <AvatarFallback className={message.role === "user" ? "bg-primary/20" : "bg-gradient-to-br from-primary/20 to-secondary/20"}>
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-primary" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted/80 backdrop-blur-sm rounded-tl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 border border-border/50">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted/80 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              placeholder="Pergunte sobre planos, treinos, dieta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isTyping && handleSend()}
              disabled={isTyping}
              className="flex-1 bg-background/80"
            />
            <Button 
              onClick={handleSend} 
              size="icon" 
              className="shadow-glow hover:scale-105 transition-transform"
              disabled={isTyping || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 Pergunte sobre preços, funcionalidades, ou como usar o app
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SofiaAssistant;
