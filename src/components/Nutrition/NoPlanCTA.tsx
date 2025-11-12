import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NoPlanCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-2xl w-full shadow-elevated bg-gradient-to-br from-card via-card to-primary/5 border-primary/30">
        <CardContent className="p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="p-6 rounded-full bg-primary/10 border-2 border-primary/30">
                <span className="text-6xl">🥗</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Você Ainda Não Tem Um Plano Alimentar
              </h2>
              <p className="text-lg text-muted-foreground">
                Converse com nossa nutricionista IA e crie um plano 100% personalizado para você
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 text-left max-w-md mx-auto">
              {[
                "Plano baseado no seu objetivo",
                "5-6 refeições balanceadas por dia",
                "Quantidades precisas em gramas",
                "Adaptado às suas preferências",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="w-full md:w-auto px-8 py-6 text-lg shadow-glow hover-glow"
              onClick={() => navigate("/nutritionist-ai")}
            >
              Criar Meu Plano Agora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
