import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Meal {
  id: string;
  name: string;
  time: string;
  icon: string;
  completed: boolean;
}

const NutritionToday = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([
    { id: "1", name: "Café da Manhã", time: "07:00", icon: "☀️", completed: true },
    { id: "2", name: "Lanche", time: "10:00", icon: "🥗", completed: true },
    { id: "3", name: "Almoço", time: "13:00", icon: "🍲", completed: false },
    { id: "4", name: "Lanche", time: "16:00", icon: "☕", completed: false },
    { id: "5", name: "Jantar", time: "19:00", icon: "🌙", completed: false },
    { id: "6", name: "Ceia", time: "21:00", icon: "🌜", completed: false },
  ]);

  const completedCount = meals.filter(m => m.completed).length;
  const progress = (completedCount / meals.length) * 100;

  const toggleMeal = (id: string) => {
    setMeals(meals.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };

  return (
    <Card className="border-emerald-500/30 bg-card/95 backdrop-blur shadow-[0_0_15px_rgba(0,200,150,0.2)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Plano Alimentar</h3>
            <p className="text-muted-foreground">Dieta Emagrecimento • 1850 kcal</p>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/50">
            {completedCount}/6
          </Badge>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Refeições Hoje</span>
            <span className="font-bold text-emerald-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer hover:border-emerald-500/50 ${
                meal.completed ? 'bg-emerald-500/5 border-emerald-500/30' : 'border-border/50'
              }`}
              onClick={() => toggleMeal(meal.id)}
            >
              <span className="text-xl flex-shrink-0">{meal.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${meal.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {meal.name}
                </p>
                <p className="text-xs text-muted-foreground">{meal.time}</p>
              </div>
              {meal.completed ? (
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <Button 
          onClick={() => navigate('/nutritionist-ai')}
          className="w-full bg-emerald-500 hover:bg-emerald-600"
          style={{ boxShadow: '0 0 20px rgba(0,200,150,0.4)' }}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Conversar com Nutricionista IA
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-3">
          Plano gerado em 12/11/2025 • Próxima revisão: 19/11/2025
        </p>
      </CardContent>
    </Card>
  );
};

export default NutritionToday;
