import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Play, Timer } from "lucide-react";
import { useState } from "react";

interface Exercise {
  id: string;
  name: string;
  sets: string;
  weight?: string;
  completed: boolean;
}

const TodayWorkout = () => {
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", name: "Supino Reto", sets: "4x12", weight: "40kg", completed: true },
    { id: "2", name: "Crucifixo", sets: "3x15", weight: "12kg", completed: true },
    { id: "3", name: "Tríceps Corda", sets: "3x12", weight: "20kg", completed: false },
    { id: "4", name: "Supino Inclinado", sets: "4x10", weight: "35kg", completed: false },
    { id: "5", name: "Francês", sets: "3x12", weight: "15kg", completed: false },
  ]);

  const completedCount = exercises.filter(e => e.completed).length;
  const progress = (completedCount / exercises.length) * 100;

  const toggleExercise = (id: string) => {
    setExercises(exercises.map(e => 
      e.id === id ? { ...e, completed: !e.completed } : e
    ));
  };

  return (
    <Card className="border-primary/30 bg-card/95 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Treino de Hoje</h3>
            <p className="text-muted-foreground">Peito & Tríceps • 45min • Intermediário</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/50">
            {completedCount}/{exercises.length}
          </Badge>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso do Treino</span>
            <span className="font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3 mb-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${
                exercise.completed ? 'bg-primary/5 border-primary/30' : 'border-border/50'
              }`}
              onClick={() => toggleExercise(exercise.id)}
            >
              {exercise.completed ? (
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {exercise.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} {exercise.weight && `• ${exercise.weight}`}
                </p>
              </div>
              <Progress 
                value={exercise.completed ? 100 : 0} 
                className="w-16 h-1.5"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 neon-pulse shadow-glow">
            <Play className="h-4 w-4 mr-2" />
            Continuar Treino
          </Button>
          <Button variant="outline" size="icon">
            <Timer className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayWorkout;
