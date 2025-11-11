import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { 
  Camera, 
  Dumbbell, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Activity,
  Trophy,
  Flame,
  Brain,
  Heart,
  Calendar,
  Pill,
  Star,
  Sparkles,
  Shield
} from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";
import foodScannerImage from "@/assets/food-scanner.jpg";
import workoutImage from "@/assets/workout-demo.jpg";
import aiAssistantImage from "@/assets/ai-assistant.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Neon Metallic */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Particles Background */}
        <div className="particles-bg">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-6 neon-pulse bg-primary/20 text-primary border-primary/50">
                <Sparkles className="h-4 w-4 mr-2" />
                Sua Jornada Única Começa Aqui
              </Badge>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                SEU PERSONAL TRAINER E{" "}
                <span className="text-primary drop-shadow-[0_0_30px_rgba(0,212,255,0.8)]">
                  NUTRICIONISTA 24H
                </span>
              </h1>
              
              <p className="text-2xl text-muted-foreground mb-4 leading-relaxed">
                Experiência 100% Individual - Seu Corpo, Seu Plano, Seus Resultados
              </p>
              
              <p className="text-lg text-foreground/80 mb-8">
                Tecnologia que Entende Você • Resultados Reais, Acompanhamento Real
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  variant="default" 
                  size="xl" 
                  asChild 
                  className="group neon-pulse shadow-glow-intense hover:shadow-glow-intense"
                >
                  <Link to="/signup">
                    COMEÇAR MINHA TRANSFORMAÇÃO
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/#features">Ver Funcionalidades</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>7 Dias Grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Cancele Quando Quiser</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Tecnologia Patenteada</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="Health AI Coach - Scanner de Alimentos em Ação" 
                className="relative rounded-2xl shadow-elevated border-2 border-primary/30 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features com Demos Visuais */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">
              <Zap className="h-4 w-4 mr-2" />
              Funcionalidades Revolucionárias
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Tecnologia que Transforma</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cada funcionalidade pensada para sua experiência única
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Scanner Inteligente */}
            <Card className="group hover:shadow-glow transition-all duration-500 border-primary/30 hover:border-primary/60 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={foodScannerImage} 
                    alt="Scanner de Alimentos com IA"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground neon-pulse">
                    Tecnologia Patenteada
                  </Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <Camera className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Scanner Inteligente</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Escaneie, Analise, Transforme - IA que identifica 10.000+ alimentos instantaneamente
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>Precisão de 98% em análise nutricional</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treinos Personalizados */}
            <Card className="group hover:shadow-glow transition-all duration-500 border-primary/30 hover:border-primary/60 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={workoutImage} 
                    alt="Treinos Personalizados pela IA"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <Dumbbell className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Treinos Exclusivos</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Cada movimento pensado para SEU corpo, SEUS objetivos
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Brain className="h-4 w-4" />
                    <span>Ajustes em tempo real pela IA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assistente 24/7 */}
            <Card className="group hover:shadow-glow transition-all duration-500 border-primary/30 hover:border-primary/60 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={aiAssistantImage} 
                    alt="Assistente de IA 24/7"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                    Resposta em 3 segundos
                  </Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Assistente Pessoal 24/7</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Suporte genuíno, tecnologia avançada - Sempre que precisar
                  </p>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-sm">
                    <p className="text-primary">💬 "Como posso te ajudar hoje?"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Progresso em Tempo Real */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">
              <TrendingUp className="h-4 w-4 mr-2" />
              Acompanhamento Inteligente
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Meu Progresso em Tempo Real</h2>
            <p className="text-xl text-muted-foreground">
              Sistema de pontuação gamificado para manter você motivado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-primary/30 hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Flame className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-primary">850</span>
                </div>
                <p className="text-sm font-medium mb-2">Score Diário</p>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Faltam 150 pontos para meta diária</p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-accent/20">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-3xl font-bold text-accent">1,850</span>
                </div>
                <p className="text-sm font-medium mb-2">Calorias Hoje</p>
                <Progress value={74} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Meta: 2,500 kcal</p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-secondary/20">
                    <Dumbbell className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-3xl font-bold text-secondary">12</span>
                </div>
                <p className="text-sm font-medium mb-2">Treinos Completos</p>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Meta semanal: 5/5 ✓</p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-primary">28</span>
                </div>
                <p className="text-sm font-medium mb-2">Conquistas</p>
                <Progress value={93} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Próxima em 50 pontos</p>
              </CardContent>
            </Card>
          </div>

          {/* Gamificação */}
          <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Trophy className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Sistema de Conquistas</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <Star className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">Iniciante Dedicação</p>
                    <p className="text-sm text-muted-foreground">100 pontos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <Camera className="h-8 w-8 text-accent" />
                  <div>
                    <p className="font-semibold">Scanner Expert</p>
                    <p className="text-sm text-muted-foreground">250 pontos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                  <Target className="h-8 w-8 text-secondary" />
                  <div>
                    <p className="font-semibold">Meta Semanal Batida</p>
                    <p className="text-sm text-muted-foreground">500 pontos</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-center text-sm">
                  <span className="text-primary font-semibold">Você está 15% melhor que semana passada!</span> 🎉
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Módulo Feminino */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">
              <Heart className="h-4 w-4 mr-2" />
              Saúde Completa
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Acompanhamento Integral</h2>
            <p className="text-xl text-muted-foreground">
              Funcionalidades pensadas para sua saúde completa
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendário Menstrual */}
            <Card className="border-primary/30 hover:shadow-glow transition-all">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Ciclo Menstrual</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Calendário interativo com tracker de sintomas, humor e energia. 
                  Recomendações personalizadas de treino por fase do ciclo.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium">Insights da IA</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      "Sua energia tende a aumentar nos próximos 3 dias"
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Humor</Badge>
                    <Badge variant="secondary">Energia</Badge>
                    <Badge variant="secondary">Sintomas</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medicamentos & Suplementos */}
            <Card className="border-primary/30 hover:shadow-glow transition-all">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-accent/20">
                    <Pill className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold">Medicamentos & Suplementos</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Cadastro completo com horários, alertas inteligentes e análise de interações pela IA.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-accent" />
                      <p className="text-sm font-medium">Alerta de Interação</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      A IA detectou possível interação entre vitamina C e medicamento X
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Adesão Mensal</span>
                    <span className="text-sm font-bold text-primary">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona - Timeline Interativa */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">
              <Sparkles className="h-4 w-4 mr-2" />
              Experiência Imersiva
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">
              3 passos simples para sua transformação
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 transform -translate-x-1/2" />

            {/* Steps */}
            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: "SEU PERFIL ÚNICO",
                  description: "Formulário inteligente que entende suas necessidades, objetivos e preferências.",
                  icon: Target,
                },
                {
                  step: 2,
                  title: "IA ANALISA E CRIA",
                  description: "Nossa IA processa milhares de dados para criar o plano perfeito para você.",
                  icon: Brain,
                },
                {
                  step: 3,
                  title: "EVOLUÇÃO CONSTANTE",
                  description: "Acompanhamento em tempo real com ajustes automáticos baseados nos seus resultados.",
                  icon: TrendingUp,
                },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  <div className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Step Number */}
                    <div className="flex-1 text-right">
                      {index % 2 === 0 && (
                        <Card className="border-primary/30 hover:shadow-glow transition-all">
                          <CardContent className="p-6">
                            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center shadow-glow-intense neon-pulse">
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-left">
                      {index % 2 !== 0 && (
                        <Card className="border-primary/30 hover:shadow-glow transition-all">
                          <CardContent className="p-6">
                            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos Reais */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">
              <Star className="h-4 w-4 mr-2" />
              Resultados Verificados
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Transformações Reais</h2>
            <p className="text-xl text-muted-foreground">
              Pessoas reais, resultados comprovados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                result: "15kg em 4 meses",
                content: "O scanner de alimentos mudou minha relação com a comida. Finalmente entendo o que como!",
                rating: 5,
              },
              {
                name: "João Santos",
                result: "8kg massa muscular",
                content: "Os treinos personalizados são incríveis. Cada exercício faz sentido para meu objetivo.",
                rating: 5,
              },
              {
                name: "Ana Costa",
                result: "Completou primeira maratona",
                content: "O acompanhamento do ciclo menstrual me ajudou a otimizar meus treinos. Revolucionário!",
                rating: 5,
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="border-primary/30 hover:shadow-glow transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <Badge className="mt-1 bg-primary/20 text-primary border-primary/50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {testimonial.result}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - Imersivo */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="particles-bg">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <Card className="border-primary/50 bg-gradient-to-br from-card via-card/80 to-card shadow-glow-intense">
            <CardContent className="p-12 text-center">
              <Badge className="mb-6 bg-primary text-primary-foreground">
                <Zap className="h-4 w-4 mr-2" />
                Oferta Especial
              </Badge>
              
              <h2 className="text-5xl font-bold mb-6">
                Sua Jornada Exclusiva Espera
              </h2>
              
              <p className="text-2xl text-muted-foreground mb-8">
                7 Dias para Experimentar o Futuro da Sua Saúde
              </p>
              
              <Button 
                variant="default" 
                size="xl" 
                asChild 
                className="group neon-pulse shadow-glow-intense text-lg px-12 h-16"
              >
                <Link to="/signup">
                  QUERO MINHA EXPERIÊNCIA ÚNICA
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Tecnologia Patenteada</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Suporte 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Resultados Comprovados</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-primary/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
              <Activity className="h-8 w-8 text-primary group-hover:drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
              <span className="text-xl font-bold neon-pulse">Health AI Coach</span>
            </Link>
            <div className="text-sm text-muted-foreground">
              © 2025 Health AI Coach. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
