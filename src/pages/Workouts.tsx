import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Play, Zap, Clock, TrendingUp, Target } from "lucide-react";

const Workouts = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);

  const workouts = [
    {
      id: "1",
      name: "Treino de Peito e Tríceps",
      duration: "45 min",
      exercises: 6,
      difficulty: "Intermediário",
      calories: 320,
      exercises_list: [
        { name: "Supino Reto", sets: "4x12", muscle: "Peitoral" },
        { name: "Supino Inclinado", sets: "3x12", muscle: "Peitoral Superior" },
        { name: "Crucifixo", sets: "3x15", muscle: "Peitoral" },
        { name: "Tríceps Testa", sets: "3x12", muscle: "Tríceps" },
        { name: "Tríceps Corda", sets: "3x15", muscle: "Tríceps" },
        { name: "Mergulho", sets: "3x10", muscle: "Tríceps" },
      ],
    },
    {
      id: "2",
      name: "Treino de Costas e Bíceps",
      duration: "50 min",
      exercises: 7,
      difficulty: "Avançado",
      calories: 380,
      exercises_list: [
        { name: "Barra Fixa", sets: "4x8", muscle: "Costas" },
        { name: "Remada Curvada", sets: "4x10", muscle: "Costas" },
        { name: "Puxada Frontal", sets: "3x12", muscle: "Dorsais" },
        { name: "Remada Unilateral", sets: "3x12", muscle: "Costas" },
        { name: "Rosca Direta", sets: "4x12", muscle: "Bíceps" },
        { name: "Rosca Martelo", sets: "3x12", muscle: "Bíceps" },
        { name: "Rosca Concentrada", sets: "3x10", muscle: "Bíceps" },
      ],
    },
    {
      id: "3",
      name: "Treino de Pernas",
      duration: "60 min",
      exercises: 6,
      difficulty: "Avançado",
      calories: 450,
      exercises_list: [
        { name: "Agachamento Livre", sets: "5x10", muscle: "Quadríceps" },
        { name: "Leg Press", sets: "4x12", muscle: "Quadríceps" },
        { name: "Cadeira Extensora", sets: "3x15", muscle: "Quadríceps" },
        { name: "Mesa Flexora", sets: "4x12", muscle: "Posterior" },
        { name: "Stiff", sets: "3x12", muscle: "Posterior" },
        { name: "Panturrilha em Pé", sets: "4x20", muscle: "Panturrilha" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-hero bg-clip-text text-transparent">
            Treinos Personalizados
          </h1>
          <p className="text-muted-foreground">Planos gerados por IA baseados no seu objetivo</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Treinos Esta Semana", value: "3", icon: Dumbbell, color: "neon-green" },
            { label: "Minutos Totais", value: "145", icon: Clock, color: "neon-purple" },
            { label: "Calorias Queimadas", value: "1,050", icon: Zap, color: "neon-cyan" },
            { label: "Streak", value: "7 dias", icon: TrendingUp, color: "neon-green" },
          ].map((stat, i) => (
            <Card key={i} className="shadow-card hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className={`h-4 w-4 text-${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate New Workout */}
        <Card className="mb-8 shadow-glow-purple border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-secondary" />
              Gerar Novo Treino com IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Nossa IA pode criar um treino personalizado baseado nos seus objetivos, equipamentos disponíveis e nível de condicionamento.
            </p>
            <Button variant="default" className="w-full shadow-neon">
              <Zap className="mr-2 h-4 w-4" />
              Gerar Treino Personalizado
            </Button>
          </CardContent>
        </Card>

        {/* Workout Plans */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Seus Treinos</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {workouts.map((workout) => (
              <Card key={workout.id} className="shadow-card hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{workout.name}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">{workout.difficulty}</Badge>
                        <Badge variant="outline">{workout.duration}</Badge>
                        <Badge variant="outline">{workout.exercises} exercícios</Badge>
                      </div>
                    </div>
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Zap className="h-4 w-4 text-neon-cyan" />
                    <span className="text-sm text-muted-foreground">~{workout.calories} calorias</span>
                  </div>

                  {selectedWorkout === workout.id ? (
                    <div className="space-y-3">
                      {workout.exercises_list.map((exercise, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{exercise.name}</p>
                              <p className="text-xs text-muted-foreground">{exercise.muscle}</p>
                            </div>
                            <Badge variant="outline">{exercise.sets}</Badge>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="default" 
                        className="w-full shadow-glow"
                        onClick={() => setSelectedWorkout(null)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Iniciar Treino
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedWorkout(workout.id)}
                    >
                      Ver Exercícios
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
