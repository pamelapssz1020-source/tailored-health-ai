import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhaseInfo } from "@/lib/menstrualCycleUtils";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DailyMessageProps {
  faseAtual: PhaseInfo;
  config: any;
  userProfile: any;
}

export const DailyMessage = ({ faseAtual, config, userProfile }: DailyMessageProps) => {
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gerarMensagem();
  }, [faseAtual.fase]);

  const gerarMensagem = async () => {
    setLoading(true);
    
    // Verificar se já tem mensagem do dia
    const hoje = new Date().toISOString().split('T')[0];
    const cacheDiario = localStorage.getItem(`cycle-message:${hoje}`);
    
    if (cacheDiario) {
      setMensagem(cacheDiario);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-cycle-message', {
        body: { faseAtual, config, userProfile }
      });

      if (error) throw error;

      setMensagem(data.mensagem);
      localStorage.setItem(`cycle-message:${hoje}`, data.mensagem);
    } catch (error) {
      console.error('Erro ao gerar mensagem:', error);
      setMensagem(getFallbackMessage(faseAtual.fase));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackMessage = (fase: string) => {
    const mensagens = {
      menstruacao: "Oi! 🌸 Sei que hoje pode estar mais difícil. Vai com calma e se cuida, tá?",
      folicular: "Bom dia! ✨ Você está cheia de energia essa semana. Aproveita!",
      ovulatoria: "Hey! 💫 Momento perfeito para treinar forte. Você está no seu auge!",
      lutea: "Oi querida! 🌙 Seja gentil com você mesma essa semana. Você merece!"
    };
    return mensagens[fase] || "Olá! 💕 Lembre-se de se cuidar hoje!";
  };

  return (
    <Card 
      className="p-6 relative overflow-hidden"
      style={{
        borderColor: faseAtual.cor,
        boxShadow: `0 0 20px ${faseAtual.cor}33`
      }}
    >
      <div className="absolute top-0 right-0 text-8xl opacity-10">
        {faseAtual.emoji}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5" style={{ color: faseAtual.cor }} />
          <h3 className="text-lg font-semibold">Mensagem do Dia</h3>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Preparando mensagem personalizada...</span>
          </div>
        ) : (
          <p className="text-lg leading-relaxed">{mensagem}</p>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={gerarMensagem}
        >
          Gerar Nova Mensagem
        </Button>
      </div>
    </Card>
  );
};
