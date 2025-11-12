import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  Coffee,
  Sun,
  Moon,
  Apple,
  Trash2,
  Edit,
  Clock
} from "lucide-react";

interface MealEntry {
  id: string;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
  foodName: string;
  emoji: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string;
  notes?: string;
}

interface NutritionDiaryProps {
  entries: MealEntry[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const mealIcons = {
  breakfast: { icon: Coffee, label: "Café da Manhã", color: "text-orange-500" },
  lunch: { icon: Sun, label: "Almoço", color: "text-yellow-500" },
  dinner: { icon: Moon, label: "Jantar", color: "text-blue-500" },
  snack: { icon: Apple, label: "Lanche", color: "text-green-500" },
};

const NutritionDiary = ({ entries, onDelete, onEdit }: NutritionDiaryProps) => {
  const groupedEntries = entries.reduce((acc, entry) => {
    const meal = entry.meal;
    if (!acc[meal]) acc[meal] = [];
    acc[meal].push(entry);
    return acc;
  }, {} as Record<string, MealEntry[]>);

  const getTotalByMeal = (mealEntries: MealEntry[]) => {
    return mealEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  return (
    <div className="space-y-4">
      {(Object.keys(mealIcons) as Array<keyof typeof mealIcons>).map((mealType) => {
        const mealEntries = groupedEntries[mealType] || [];
        if (mealEntries.length === 0) return null;

        const MealIcon = mealIcons[mealType].icon;
        const totals = getTotalByMeal(mealEntries);

        return (
          <Card key={mealType} className="shadow-card overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MealIcon className={`h-5 w-5 ${mealIcons[mealType].color}`} />
                  {mealIcons[mealType].label}
                  <Badge variant="secondary" className="ml-2">
                    {mealEntries.length} {mealEntries.length === 1 ? "item" : "itens"}
                  </Badge>
                </CardTitle>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{totals.calories} kcal</p>
                  <p className="text-xs text-muted-foreground">
                    P: {totals.protein}g · C: {totals.carbs}g · G: {totals.fat}g
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {mealEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Food Image */}
                      <div className="relative">
                        <img
                          src={entry.imageUrl}
                          alt={entry.foodName}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-border/50"
                        />
                        <div className="absolute -top-2 -right-2 bg-background rounded-full p-1 border border-border">
                          <span className="text-xl">{entry.emoji}</span>
                        </div>
                      </div>

                      {/* Food Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                              {entry.foodName}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3" />
                              <span>{entry.time}</span>
                              <Separator orientation="vertical" className="h-3" />
                              <span className="font-medium">{entry.weight}g</span>
                            </div>
                            {entry.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                {entry.notes}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-1">
                            {onEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEdit(entry.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => onDelete(entry.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Nutrition Grid */}
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          <div className="text-center p-2 rounded bg-primary/5 border border-primary/20">
                            <p className="text-xs font-semibold text-primary">{entry.calories}</p>
                            <p className="text-[10px] text-muted-foreground">kcal</p>
                          </div>
                          <div className="text-center p-2 rounded bg-secondary/5 border border-secondary/20">
                            <p className="text-xs font-semibold text-secondary">{entry.protein}g</p>
                            <p className="text-[10px] text-muted-foreground">Prot</p>
                          </div>
                          <div className="text-center p-2 rounded bg-accent/5 border border-accent/20">
                            <p className="text-xs font-semibold text-accent">{entry.carbs}g</p>
                            <p className="text-[10px] text-muted-foreground">Carb</p>
                          </div>
                          <div className="text-center p-2 rounded bg-destructive/5 border border-destructive/20">
                            <p className="text-xs font-semibold text-destructive">{entry.fat}g</p>
                            <p className="text-[10px] text-muted-foreground">Gord</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {entries.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">Nenhum alimento registrado hoje</p>
            <p className="text-xs text-muted-foreground">
              Use o scanner acima para adicionar suas refeições
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutritionDiary;
