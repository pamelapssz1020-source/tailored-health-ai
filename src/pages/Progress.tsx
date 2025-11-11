import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Award, Target, Calendar, Zap } from "lucide-react";

const ProgressPage = () => {
  const achievements = [
    { name: "Primeira Semana", desc: "Complete 7 dias consecutivos", unlocked: true, icon: "🔥" },
    { name: "Scanner Master", desc: "Escaneie 50 alimentos", unlocked: true, icon: "📸" },
    { name: "Iron Pumper", desc: "Complete 20 treinos", unlocked: false, icon: "💪", progress: 65 },
    { name: "Consistency King", desc: "30 dias de streak", unlocked: false, icon: "👑", progress: 23 },
  ];

  const bodyMetrics = [
    { label: "Peso", current: "72.5kg", change: "-2.5kg", trend: "down", target: "70kg" },
    { label: "Gordura Corporal", current: "18%", change: "-3%", trend: "down", target: "15%" },
    { label: "Massa Muscular", current: "60kg", change: "+1.5kg", trend: "up", target: "62kg" },
    { label: "IMC", current: "24.1", change: "-0.8", trend: "down", target: "23" },
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-hero bg-clip-text text-transparent">
            Seu Progresso
          </h1>
          <p className="text-muted-foreground">Acompanhe sua evolução e conquistas</p>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-glow border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Dias Consecutivos</p>
                <Zap className="h-4 w-4 text-neon-green" />
              </div>
              <p className="text-3xl font-bold mb-1">7</p>
              <Progress value={70} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">70% da meta semanal</p>
            </CardContent>
          </Card>

          <Card className="shadow-glow-purple border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total de Treinos</p>
                <Target className="h-4 w-4 text-neon-purple" />
              </div>
              <p className="text-3xl font-bold mb-1">13</p>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Meta: 20 treinos/mês</p>
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

        {/* Body Metrics */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Métricas Corporais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bodyMetrics.map((metric, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-2xl font-bold">{metric.current}</p>
                    <Badge 
                      variant={metric.trend === "down" ? "default" : "secondary"}
                      className="gap-1"
                    >
                      {metric.trend === "down" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                      {metric.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Meta: {metric.target}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
