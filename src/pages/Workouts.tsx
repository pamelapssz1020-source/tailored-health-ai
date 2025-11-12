import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Play, Zap, Clock, TrendingUp, Target, Search, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const muscleGroups = [
  "Chest", "Biceps", "Triceps", "Abs", "Glutes", "Shoulders",
  "Quads", "Lats", "Traps", "Lower Back", "Forearms", "Obliques",
  "Hamstrings", "Calves", "Abductors"
];

const equipmentList = [
  { name: "Flat Bench", selected: true },
  { name: "Adjustable Bench", selected: true },
  { name: "Dumbbells", selected: true },
  { name: "Olympic Barbell", selected: false },
  { name: "Leg Press", selected: true },
  { name: "Lat Pulldown Cable", selected: true },
  { name: "Squat Rack", selected: false },
  { name: "Smith Machine", selected: false },
  { name: "Resistance Bands", selected: true },
  { name: "Pull-up Bar", selected: true },
  { name: "Kettlebells", selected: false },
  { name: "Medicine Ball", selected: false },
];

const Workouts = () => {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(["Chest", "Abs", "Biceps"]);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  const [duration, setDuration] = useState("45-60min");

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles(prev =>
      prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

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
        <Card className="mb-8 shadow-glow border-secondary/20">
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
            <Button 
              variant="default" 
              className="w-full shadow-neon"
              onClick={() => navigate("/fitness-profile")}
            >
              <Zap className="mr-2 h-4 w-4" />
              Criar Perfil e Gerar Treino
            </Button>
          </CardContent>
        </Card>

        {/* Muscle Focus Section */}
        <Card className="mb-8 shadow-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                PICK YOUR TARGET AREAS
              </span>
              <Badge variant="secondary">{selectedMuscles.length} selecionados</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {muscleGroups.map((muscle) => (
                <Card
                  key={muscle}
                  className={`cursor-pointer transition-all hover:shadow-glow ${
                    selectedMuscles.includes(muscle) ? "border-primary shadow-glow" : "border-border"
                  }`}
                  onClick={() => toggleMuscle(muscle)}
                >
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium">{muscle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frequency & Duration */}
        <Card className="mb-8 shadow-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              SET YOUR WORKOUT FREQUENCY & DURATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="font-medium mb-3">Dias da Semana</p>
              <div className="flex justify-between gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <Button
                    key={day}
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium mb-3">Duração do Treino</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["10-20min", "20-30min", "30-45min", "45-60min", "60-75min", "75-90min"].map((dur) => (
                  <Button
                    key={dur}
                    variant={duration === dur ? "default" : "outline"}
                    onClick={() => setDuration(dur)}
                  >
                    {dur}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Selection */}
        <Card className="mb-8 shadow-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-accent" />
                SELECT YOUR PREFERRED EQUIPMENT
              </span>
              <Badge variant="secondary">
                {equipmentList.filter(e => e.selected).length} selecionados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for equipment"
                className="w-full pl-10 pr-4 py-2 rounded-md bg-muted border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {equipmentList.map((equipment) => (
                <div
                  key={equipment.name}
                  className={`p-4 rounded-lg border transition-all ${
                    equipment.selected
                      ? "border-primary shadow-glow bg-primary/5"
                      : "border-border hover:border-secondary"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox checked={equipment.selected} />
                    <p className="text-sm font-medium">{equipment.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weight & Rep Suggestions */}
        <Card className="mb-8 shadow-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              GET WEIGHT & REP SUGGESTIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="font-bold mb-2">Overhand Grip Lat Pulldown</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Max Weight Lifted: <span className="text-primary">50 lb</span> - 10 reps - 02/10/2025
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sugestão da IA:</p>
                    <p className="text-lg font-bold text-secondary">55 lb - 8-10 reps</p>
                  </div>
                  <Button variant="outline" size="sm">Next Exercise</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card className="mb-8 shadow-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              GET MOTIVATED BY SEEING RESULTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-dashed border-secondary text-center">
                  <p className="text-sm text-muted-foreground mb-2">BEFORE</p>
                  <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                    <p className="text-sm">Upload Photo</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-dashed border-secondary text-center">
                  <p className="text-sm text-muted-foreground mb-2">AFTER</p>
                  <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                    <p className="text-sm">Upload Photo</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "ABS", previous: "33in", current: "30in", date: "Mar 4, 2025" },
                  { label: "THIGH", previous: "24in", current: "22in", date: "Mar 4, 2025" },
                  { label: "CHEST", previous: "40in", current: "42in", date: "Mar 4, 2025" },
                ].map((measurement) => (
                  <div key={measurement.label} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-center">
                      <p className="font-bold">{measurement.label}</p>
                      <Button variant="ghost" size="sm">Add Measurement</Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Previous: {measurement.previous} → Most Recent: <span className="text-primary font-bold">{measurement.current}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
