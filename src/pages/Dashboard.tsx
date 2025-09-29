import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Apple, 
  Dumbbell, 
  User, 
  TrendingUp,
  Calendar,
  Target,
  MessageSquare
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border/50 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-white font-bold text-lg">HA</span>
          </div>
          <span className="font-bold">Health AI Coach</span>
        </div>
        
        <nav className="space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Apple, label: "Nutrição", active: false },
            { icon: Dumbbell, label: "Treinos", active: false },
            { icon: TrendingUp, label: "Progresso", active: false },
            { icon: User, label: "Perfil", active: false },
          ].map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está seu resumo diário.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Calorias Hoje", value: "1,847", target: "2,200", icon: Target },
            { label: "Treinos Semana", value: "3", target: "5", icon: Dumbbell },
            { label: "Peso Atual", value: "72.5kg", target: "70kg", icon: TrendingUp },
            { label: "Streak", value: "7 dias", target: "Contínuo", icon: Calendar },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">Meta: {stat.target}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Treino de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Agachamento Livre", "Supino Reto", "Desenvolvimento"].map((exercise, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">{exercise}</span>
                    <span className="text-sm text-muted-foreground">3x12</span>
                  </div>
                ))}
              </div>
              <Button variant="default" className="w-full mt-4">
                Iniciar Treino
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-primary" />
                Plano Alimentar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { meal: "Café da Manhã", cals: "450 kcal", done: true },
                  { meal: "Almoço", cals: "680 kcal", done: true },
                  { meal: "Lanche", cals: "220 kcal", done: false },
                  { meal: "Jantar", cals: "540 kcal", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className={item.done ? "line-through text-muted-foreground" : "font-medium"}>
                      {item.meal}
                    </span>
                    <span className="text-sm text-muted-foreground">{item.cals}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver Cardápio Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <Button
        variant="hero"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
