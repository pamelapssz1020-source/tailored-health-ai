import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FoodScanner from "@/components/FoodScanner/FoodScanner";
import { 
  Camera, 
  Calendar,
  TrendingUp,
  Apple,
  Flame
} from "lucide-react";

const Nutrition = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border/50 px-4 py-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Nutrição</h1>
          <p className="text-muted-foreground">
            Acompanhe sua alimentação com inteligência artificial
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Today's Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Calorias Hoje</p>
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-xs text-muted-foreground">de 2,200 kcal</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "57%" }} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Carboidratos</p>
                <span className="text-2xl">🍞</span>
              </div>
              <p className="text-2xl font-bold">158g</p>
              <p className="text-xs text-muted-foreground">de 275g</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "57%" }} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Proteínas</p>
                <span className="text-2xl">🥩</span>
              </div>
              <p className="text-2xl font-bold">68g</p>
              <p className="text-xs text-muted-foreground">de 120g</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: "57%" }} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Gorduras</p>
                <span className="text-2xl">🥑</span>
              </div>
              <p className="text-2xl font-bold">42g</p>
              <p className="text-xs text-muted-foreground">de 75g</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-destructive" style={{ width: "56%" }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Scanner Area */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Escanear Alimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FoodScanner />
          </CardContent>
        </Card>

        {/* Recent Meals */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Refeições de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { meal: "Café da Manhã", time: "08:30", items: ["Pão integral", "Ovo mexido"], cals: 320 },
                { meal: "Almoço", time: "12:45", items: ["Arroz", "Feijão", "Frango"], cals: 650 },
                { meal: "Lanche", time: "16:00", items: ["Maçã", "Castanhas"], cals: 180 },
              ].map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{entry.meal}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.items.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{entry.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{entry.cals}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Nutrition;
