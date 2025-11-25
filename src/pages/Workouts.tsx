import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Plus, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import WorkoutPlanView from "@/components/Workouts/WorkoutPlanView";

export default function Workouts() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkoutPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Buscar plano mais recente do Supabase
        const { data: plans, error } = await supabase
          .from('workout_plans' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Erro ao buscar plano:', error);
        } else if (plans && plans.length > 0) {
          const latestPlan = plans[0] as any;
          setWorkoutPlan(latestPlan.plan_data);
          setSavedPlanId(latestPlan.id);
        }
      } catch (error) {
        console.error('Erro ao carregar plano:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkoutPlan();
  }, []);

  const handleNewPlan = async () => {
    // Deletar plano antigo se existir
    if (savedPlanId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('workout_plans' as any)
          .delete()
          .eq('id', savedPlanId);
      }
    }
    
    setWorkoutPlan(null);
    setSavedPlanId(null);
    navigate('/workouts/setup');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando seu plano de treino...</p>
        </div>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
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
                <Sparkles size={20} className="mr-2" />
                Criar Meu Plano Personalizado
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Meus Treinos</h1>
            <p className="text-muted-foreground">Seu plano personalizado de exercícios</p>
          </div>
          <Button
            variant="outline"
            onClick={handleNewPlan}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Gerar Novo Plano
          </Button>
        </div>

        <WorkoutPlanView plano={workoutPlan} />
      </div>
    </div>
  );
}