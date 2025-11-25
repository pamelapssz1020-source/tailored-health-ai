import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Award, Target, Calendar, Zap, Loader2 } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { CheckInDialog } from "@/components/Progress/CheckInDialog";
import { WeightChart } from "@/components/Progress/WeightChart";
import { MeasurementsComparison } from "@/components/Progress/MeasurementsComparison";

const ProgressPage = () => {
  const { 
    progress, 
    loading, 
    getWeightHistory, 
    getLatestMeasurements, 
    getFirstMeasurements,
    fetchProgress 
  } = useUserProgress();

  const achievements = [
    { name: "Primeira Semana", desc: "Complete 7 dias consecutivos", unlocked: true, icon: "🔥" },
    { name: "Scanner Master", desc: "Escaneie 50 alimentos", unlocked: true, icon: "📸" },
    { name: "Iron Pumper", desc: "Complete 20 treinos", unlocked: false, icon: "💪", progress: 65 },
    { name: "Consistency King", desc: "30 dias de streak", unlocked: false, icon: "👑", progress: 23 },
  ];

  const weeklyProgress = [
    { day: "Seg", calories: 2100, workouts: 1, completed: true },
    { day: "Ter", calories: 2050, workouts: 0, completed: true },
    { day: "Qua", calories: 2200, workouts: 1, completed: true },
    { day: "Qui", calories: 2150, workouts: 0, completed: true },
    { day: "Sex", calories: 2300, workouts: 1, completed: true },
    { day: "Sáb", calories: 2400, workouts: 0, completed: false },
    { day: "Dom", calories: 0, workouts: 0, completed: false },
  ];

  // Get data for charts
  const weightHistory = getWeightHistory(90);
  const latestMeasurements = getLatestMeasurements();
  const firstMeasurements = getFirstMeasurements();

  // Calculate stats from progress
  const latestWeight = progress.find(p => p.weight_kg)?.weight_kg;
  const firstWeight = [...progress]
    .filter(p => p.weight_kg)
    .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())[0]?.weight_kg;
  const weightChange = latestWeight && firstWeight ? latestWeight - firstWeight : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-hero bg-clip-text text-transparent">
              Seu Progresso
            </h1>
            <p className="text-muted-foreground">Acompanhe sua evolução e conquistas</p>
          </div>
          <CheckInDialog onSuccess={fetchProgress} />
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Check-ins Realizados</p>
                <Zap className="h-4 w-4 text-neon-cyan" />
              </div>
              <p className="text-3xl font-bold mb-1">{progress.length}</p>
              <Progress value={Math.min(progress.length * 10, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {progress.length >= 10 ? 'Ótimo progresso!' : `Faltam ${10 - progress.length} para a primeira meta`}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-glow-purple border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Peso Atual</p>
                <Target className="h-4 w-4 text-neon-cyan" />
              </div>
              <p className="text-3xl font-bold mb-1">
                {latestWeight ? `${latestWeight} kg` : '-'}
              </p>
              {weightChange !== null && (
                <Badge 
                  variant={weightChange <= 0 ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  {weightChange <= 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </Badge>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {weightChange !== null ? 'Desde o primeiro registro' : 'Registre seu peso'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-glow-cyan border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Calorias Médias</p>
                <TrendingUp className="h-4 w-4 text-neon-cyan" />
              </div>
              <p className="text-3xl font-bold mb-1">2,150</p>
              <Progress value={98} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">98% da meta diária</p>
            </CardContent>
          </Card>
        </div>

        {/* Weight Chart */}
        <div className="mb-8">
          <WeightChart data={weightHistory} />
        </div>

        {/* Measurements Comparison */}
        <div className="mb-8">
          <MeasurementsComparison 
            latest={latestMeasurements} 
            first={firstMeasurements} 
          />
        </div>

        {/* Weekly Progress */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Progresso Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weeklyProgress.map((day, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-lg text-center transition-all ${
                    day.completed 
                      ? 'bg-primary/20 border border-primary/50 shadow-glow' 
                      : 'bg-muted/50'
                  }`}
                >
                  <p className="text-xs font-medium mb-2">{day.day}</p>
                  {day.completed ? (
                    <>
                      <p className="text-sm font-bold">{day.calories}</p>
                      <p className="text-xs text-muted-foreground">cal</p>
                      {day.workouts > 0 && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {day.workouts} treino
                        </Badge>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">Pendente</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-secondary" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.unlocked 
                      ? 'bg-secondary/10 border-secondary/50 shadow-glow-purple' 
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.desc}</p>
                      {!achievement.unlocked && achievement.progress && (
                        <>
                          <Progress value={achievement.progress} className="h-2 mb-1" />
                          <p className="text-xs text-muted-foreground">{achievement.progress}% completo</p>
                        </>
                      )}
                      {achievement.unlocked && (
                        <Badge variant="secondary">Desbloqueada! ✓</Badge>
                      )}
                    </div>
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

export default ProgressPage;
