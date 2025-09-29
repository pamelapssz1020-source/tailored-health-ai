import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Edit, 
  ChevronDown, 
  ChevronUp, 
  Coffee,
  Sun,
  Moon,
  Apple as AppleIcon,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface FoodResultsProps {
  imageData: string;
  foodData: {
    name: string;
    confidence: number;
    emoji: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
    alternatives?: string[];
    pairings?: string[];
  };
  onCorrect: () => void;
  onSave: (meal: string, portion: number, notes: string) => void;
}

const FoodResults = ({ imageData, foodData, onCorrect, onSave }: FoodResultsProps) => {
  const [portion, setPortion] = useState(100);
  const [expandedNutrition, setExpandedNutrition] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<string>("lunch");
  const [notes, setNotes] = useState("");

  const calculateValue = (baseValue: number) => {
    return Math.round((baseValue * portion) / 100);
  };

  const meals = [
    { id: "breakfast", label: "Café", icon: Coffee },
    { id: "lunch", label: "Almoço", icon: Sun },
    { id: "dinner", label: "Jantar", icon: Moon },
    { id: "snack", label: "Lanche", icon: AppleIcon },
  ];

  return (
    <div className="space-y-4 p-4 max-h-[80vh] overflow-y-auto">
      {/* Captured Image Preview */}
      <div className="relative rounded-xl overflow-hidden border-2 border-primary/20">
        <img src={imageData} alt="Captured food" className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="glass-effect">
            <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
            Analisado
          </Badge>
        </div>
      </div>

      {/* Food Identification Card */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{foodData.emoji}</span>
              <div>
                <h3 className="text-lg font-semibold">{foodData.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{foodData.confidence}% de confiança</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onCorrect}>
              <Edit className="h-3 w-3 mr-1" />
              Corrigir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Card */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <button
            onClick={() => setExpandedNutrition(!expandedNutrition)}
            className="flex items-center justify-between w-full"
          >
            <CardTitle className="text-base">Valores Nutricionais</CardTitle>
            {expandedNutrition ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedNutrition && (
          <CardContent className="space-y-4">
            {/* Calories Highlight */}
            <div className="text-center p-4 rounded-lg gradient-primary">
              <p className="text-sm text-white/80 mb-1">Calorias (por {portion}g)</p>
              <p className="text-4xl font-bold text-white">
                {calculateValue(foodData.calories)}
                <span className="text-lg ml-1">kcal</span>
              </p>
            </div>

            <Separator />

            {/* Macronutrients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Carboidratos</span>
                <span className="font-semibold">{calculateValue(foodData.carbs)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(foodData.carbs / 50) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Proteínas</span>
                <span className="font-semibold">{calculateValue(foodData.protein)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: `${(foodData.protein / 30) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gorduras</span>
                <span className="font-semibold">{calculateValue(foodData.fat)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-destructive" style={{ width: `${(foodData.fat / 20) * 100}%` }} />
              </div>
            </div>

            <Separator />

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Fibras</p>
                <p className="font-semibold">{calculateValue(foodData.fiber)}g</p>
              </div>
              <div>
                <p className="text-muted-foreground">Açúcares</p>
                <p className="font-semibold">{calculateValue(foodData.sugar)}g</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Portion Adjuster */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ajustar Quantidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Porção</span>
              <span className="font-semibold text-primary">{portion}g</span>
            </div>
            <Slider
              value={[portion]}
              onValueChange={(value) => setPortion(value[0])}
              min={25}
              max={400}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>25g</span>
              <span>400g</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      {(foodData.pairings || foodData.alternatives) && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Sugestões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {foodData.pairings && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Combina bem com:</p>
                <div className="flex flex-wrap gap-2">
                  {foodData.pairings.map((item, i) => (
                    <Badge key={i} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            )}
            {foodData.alternatives && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Alternativas:</p>
                <div className="flex flex-wrap gap-2">
                  {foodData.alternatives.map((item, i) => (
                    <Badge key={i} variant="outline">{item}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save to Diary */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Adicionar ao Diário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {meals.map((meal) => (
              <Button
                key={meal.id}
                variant={selectedMeal === meal.id ? "default" : "outline"}
                size="sm"
                className="flex flex-col h-auto py-3"
                onClick={() => setSelectedMeal(meal.id)}
              >
                <meal.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{meal.label}</span>
              </Button>
            ))}
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Observações (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem sal, grelhado..."
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            />
          </div>

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={() => onSave(selectedMeal, portion, notes)}
          >
            Adicionar ao Meu Dia
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Total do dia: {calculateValue(foodData.calories)} kcal adicionadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodResults;
