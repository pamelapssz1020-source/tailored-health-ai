import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import WorkoutPlanView from "@/components/Workouts/WorkoutPlanView";

export default function Workouts() {
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);

  useEffect(() => {
    // Recuperar plano salvo
    const savedPlan = localStorage.getItem('workout-plan');
    if (savedPlan) {
      setWorkoutPlan(JSON.parse(savedPlan));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {!workoutPlan ? (
          // Sem plano - Mostrar CTA
          <div className="text-center py-20">
            <Card className="p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">💪</div>
              <h1 className="text-3xl font-bold mb-4">
                Treinos Personalizados por Biotipo
              </h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Crie um plano de treino completo baseado no seu tipo corporal, 
                objetivos e disponibilidade. Com 4 treinos semanais e vídeos demonstrativos.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center gap-2 text-left">
                  <span className="text-2xl">🎯</span>
                  <span>Adaptado ao seu biotipo (ectomorfo, mesomorfo, endomorfo)</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <span className="text-2xl">📹</span>
                  <span>Vídeos demonstrativos para cada exercício</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <span className="text-2xl">📊</span>
                  <span>Cargas sugeridas por nível de experiência</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <span className="text-2xl">🔥</span>
                  <span>4 treinos (2 superiores + 2 inferiores)</span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => navigate('/workouts/setup')}
                className="bg-gradient-to-r from-primary to-secondary text-lg h-14 px-8"
              >
                <Sparkles size={20} />
                Criar Meu Plano Personalizado
              </Button>
            </Card>
          </div>
        ) : (
          // Com plano - Mostrar visualização
          <WorkoutPlanView plano={workoutPlan.plano} />
        )}
      </div>
    </div>
  );
}