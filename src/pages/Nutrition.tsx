import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FoodScanner from "@/components/FoodScanner/FoodScanner";
import NutritionDiary from "@/components/Nutrition/NutritionDiary";
import { DietPlanView } from "@/components/Nutrition/DietPlanView";
import { NoPlanCTA } from "@/components/Nutrition/NoPlanCTA";
import { 
  Camera, 
  Calendar,
  TrendingUp,
  Apple,
  Flame,
  Award,
  Target
} from "lucide-react";

const Nutrition = () => {
  const [hasPlan, setHasPlan] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkForSavedPlan();
  }, []);

  const checkForSavedPlan = () => {
    try {
      const savedPlan = localStorage.getItem("user-diet-plan");
      
      if (savedPlan) {
        const parsedPlan = JSON.parse(savedPlan);
        setHasPlan(true);
        setPlanData(parsedPlan);
      } else {
        setHasPlan(false);
      }
    } catch (error) {
      console.error("Error loading plan:", error);
      setHasPlan(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data - in production, this would come from database
  const [dailyGoals] = useState({
    calories: 2200,
    protein: 120,
    carbs: 275,
    fat: 75
  });

  const [currentIntake] = useState({
    calories: 1247,
    protein: 68,
    carbs: 158,
    fat: 42
  });

  const [diaryEntries] = useState([
    {
      id: "1",
      meal: "breakfast" as const,
      time: "08:30",
      foodName: "Pão Integral com Ovo Mexido",
      emoji: "🍳",
      weight: 150,
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 12,
      imageUrl: "/placeholder.svg",
      notes: "Com azeite de oliva"
    },
    {
      id: "2",
      meal: "lunch" as const,
      time: "12:45",
      foodName: "Arroz, Feijão e Frango Grelhado",
      emoji: "🍗",
      weight: 400,
      calories: 650,
      protein: 42,
      carbs: 85,
      fat: 15,
      imageUrl: "/placeholder.svg"
    },
    {
      id: "3",
      meal: "snack" as const,
      time: "16:00",
      foodName: "Maçã com Castanhas",
      emoji: "🍎",
      weight: 120,
      calories: 180,
      protein: 5,
      carbs: 28,
      fat: 8,
      imageUrl: "/placeholder.svg"
    }
  ]);

  const calculatePercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const handleDeleteEntry = (id: string) => {
    console.log("Delete entry:", id);
    // In production: delete from database
  };

  const handleEditEntry = (id: string) => {
    console.log("Edit entry:", id);
    // In production: open edit modal
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border/50 px-4 py-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Nutrição</h1>
          <p className="text-muted-foreground">
            {hasPlan 
              ? "Acompanhe seu plano alimentar personalizado"
              : "Acompanhe sua alimentação com inteligência artificial"
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Show Plan View or CTA */}
        {hasPlan && planData ? (
          <DietPlanView 
            plan={planData.plan} 
            profile={planData.profile}
            createdAt={planData.createdAt}
          />
        ) : (
          <>
            <NoPlanCTA />
        {/* Today's Summary - Enhanced */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="shadow-card border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Calorias Hoje</p>
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">{currentIntake.calories}</p>
              <p className="text-xs text-muted-foreground mb-2">de {dailyGoals.calories} kcal</p>
              <Progress value={calculatePercentage(currentIntake.calories, dailyGoals.calories)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {calculatePercentage(currentIntake.calories, dailyGoals.calories)}% da meta
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Carboidratos</p>
                <span className="text-2xl">🍞</span>
              </div>
              <p className="text-3xl font-bold">{currentIntake.carbs}g</p>
              <p className="text-xs text-muted-foreground mb-2">de {dailyGoals.carbs}g</p>
              <Progress value={calculatePercentage(currentIntake.carbs, dailyGoals.carbs)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {calculatePercentage(currentIntake.carbs, dailyGoals.carbs)}% da meta
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Proteínas</p>
                <span className="text-2xl">🥩</span>
              </div>
              <p className="text-3xl font-bold">{currentIntake.protein}g</p>
              <p className="text-xs text-muted-foreground mb-2">de {dailyGoals.protein}g</p>
              <Progress value={calculatePercentage(currentIntake.protein, dailyGoals.protein)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {calculatePercentage(currentIntake.protein, dailyGoals.protein)}% da meta
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Gorduras</p>
                <span className="text-2xl">🥑</span>
              </div>
              <p className="text-3xl font-bold">{currentIntake.fat}g</p>
              <p className="text-xs text-muted-foreground mb-2">de {dailyGoals.fat}g</p>
              <Progress value={calculatePercentage(currentIntake.fat, dailyGoals.fat)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {calculatePercentage(currentIntake.fat, dailyGoals.fat)}% da meta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adesão ao Plano</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média Semanal</p>
                <p className="text-2xl font-bold">1,980 kcal</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sequência de Dias</p>
                <p className="text-2xl font-bold">12 dias 🔥</p>
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

            {/* Diary with Detailed Entries */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Diário Alimentar de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NutritionDiary 
                  entries={diaryEntries}
                  onDelete={handleDeleteEntry}
                  onEdit={handleEditEntry}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
