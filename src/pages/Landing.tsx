import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SofiaAssistant from "@/components/SofiaAssistant";
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
  Shield,
  Salad,
  Mic,
  Search
} from "lucide-react";
import heroImage from "@/assets/hero-fitness-happy.jpg";
import foodScannerImage from "@/assets/food-scanner.jpg";
import workoutImage from "@/assets/workout-demo.jpg";
import aiAssistantImage from "@/assets/ai-assistant.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const [sofiaOpen, setSofiaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleCycleClick = () => {
    const config = localStorage.getItem('menstrual-cycle-config');
    if (config) {
      navigate('/cycle/dashboard');
    } else {
      navigate('/cycle/setup');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Futuristic */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 particles-bg grid-bg overflow-hidden">
        {/* Animated particles overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-secondary rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          {/* Main Title with Animated Gradient */}
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight font-display">
            SEU PERSONAL TRAINER E{" "}
            <span className="block mt-2 text-gradient-animated animate-gradient-shift">
              NUTRICIONISTA 24H
            </span>
          </h1>

          {/* FLOATING SEARCH BAR - Sofia Assistant (Minimalist) */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div 
              className="glass-card group cursor-pointer relative overflow-hidden rounded-full p-1 hover:scale-[1.02] transition-all duration-300"
              onClick={() => setSofiaOpen(true)}
            >
              {/* Animated border glow - Cyan */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-50 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative bg-background/80 backdrop-blur-xl rounded-full px-6 py-3 flex items-center gap-3">
                {/* Icon Left */}
                <MessageSquare className="h-5 w-5 text-primary drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] flex-shrink-0" />
                
                {/* Search Input */}
                <div className="flex-1">
                  <Input 
                    placeholder="Pergunte para sua IA..."
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 px-0 placeholder:text-muted-foreground/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSofiaOpen(true)}
                  />
                </div>
                
                {/* Mic Button Right */}
                <Button 
                  size="icon"
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSofiaOpen(true);
                  }}
                >
                  <Mic className="h-4 w-4 animate-pulse" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Cards - Holographic AI Panels */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Personal Trainer Card - Cyan Theme */}
            <div className="glass-card group cursor-pointer relative overflow-hidden rounded-2xl">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              <CardContent className="p-8 relative z-10">
                {/* Holographic Icon Orb */}
                <div className="mb-6 relative">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center relative">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-300" />
                    {/* Icon container */}
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <Dumbbell className="h-10 w-10 text-primary drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-cyan">
                  Fale com seu Personal
                </h3>
                <p className="text-foreground-secondary mb-6 text-sm">
                  Treinos personalizados com IA avançada
                </p>
                
                {/* Laser Button */}
                <Button 
                  className="w-full group btn-gradient-cyan font-semibold text-black hover:scale-105 transition-all duration-300"
                  size="lg"
                  onClick={() => navigate('/workouts/setup')}
                >
                  <span className="relative z-10">Começar Treino</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </Button>
              </CardContent>
            </div>

            {/* Nutrition AI Card - Green Theme */}
            <div className="glass-card-green group cursor-pointer relative overflow-hidden rounded-2xl">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              <CardContent className="p-8 relative z-10">
                {/* Holographic Icon Orb */}
                <div className="mb-6 relative">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center relative">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-full bg-secondary/20 blur-xl group-hover:bg-secondary/40 transition-all duration-300" />
                    {/* Icon container */}
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 border border-secondary/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <Salad className="h-10 w-10 text-secondary drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-green">
                  Fale com a IA de Nutrição
                </h3>
                <p className="text-foreground-secondary mb-6 text-sm">
                  Plano alimentar 100% personalizado
                </p>
                
                {/* Laser Button */}
                <Button 
                  className="w-full group btn-gradient-green font-semibold text-black hover:scale-105 transition-all duration-300"
                  size="lg"
                  onClick={() => navigate('/nutritional-anamnesis')}
                >
                  <span className="relative z-10">Criar Dieta</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </Button>
              </CardContent>
            </div>
          </div>
        </div>
      </section>

      {/* Features com Demos Visuais */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">Tudo Que Você Precisa em Um Só Lugar</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              IA Avançada + Acompanhamento Real = Resultados Reais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CARD 1: Scanner Inteligente - VISUAL MELHORADO */}
            <Card className="group hover:shadow-glow transition-all duration-500 border-primary/30 hover:border-primary/60 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative overflow-hidden h-72 bg-black">
                  {/* Holographic overlay effect */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                  </div>
                  
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    poster={foodScannerImage}
                  >
                    <source src="https://cdn.coverr.co/videos/coverr-person-scanning-food-with-phone-9348/1080p.mp4" type="video/mp4" />
                  </video>
                  
                  {/* Floating hologram elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-20 left-8 text-xs font-mono text-primary bg-black/50 px-2 py-1 rounded backdrop-blur-sm animate-pulse">
                      250 kcal
                    </div>
                    <div className="absolute bottom-32 right-12 text-xs font-mono text-secondary bg-black/50 px-2 py-1 rounded backdrop-blur-sm animate-pulse" style={{ animationDelay: '500ms' }}>
                      28g Carbs
                    </div>
                    <div className="absolute top-24 left-12 text-xs font-mono text-accent bg-black/50 px-2 py-1 rounded backdrop-blur-sm animate-pulse" style={{ animationDelay: '1s' }}>
                      15g Protein
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-b from-background via-background to-primary/5">
                  <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                    🔬 Visão IA Avançada
                  </Badge>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/50">
                      <Camera className="h-7 w-7 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gradient-cyan">Visão Nutricional IA</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Scanner Hiper-Preciso • Análise forense de alimentos com hologramas de nutrientes flutuando
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="font-semibold">Gemini Vision Pro • 98% de precisão</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: Assistente 24/7 - NEON BRILHO INTENSO */}
            <Card className="group hover:shadow-glow transition-all duration-500 border-secondary/30 hover:border-secondary/60 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={aiAssistantImage} 
                    alt="Assistente de IA 24/7"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Assistente Pessoal 24/7</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Suporte genuíno quando você precisar - Tecnologia que entende você
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

          {/* Evolução Semanal - Gráficos */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              📊 Evolução Semanal
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Gráfico Treinos */}
            <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">💪</span>
                  <h3 className="text-xl font-bold">Treinos</h3>
                </div>
                
                <div className="flex items-end justify-between gap-2 h-48 mb-6">
                  {[
                    { dia: "Seg", valor: 18, label: "18 min" },
                    { dia: "Ter", valor: 12, label: "12 min" },
                    { dia: "Qua", valor: 0, label: "Descanso" },
                    { dia: "Qui", valor: 20, label: "20 min" },
                    { dia: "Sex", valor: 15, label: "15 min" },
                    { dia: "Sáb", valor: 10, label: "10 min" },
                    { dia: "Dom", valor: 0, label: "Descanso" }
                  ].map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-muted/30 rounded-t-lg relative flex items-end h-full">
                        <div 
                          className="w-full rounded-t-lg transition-all duration-300 group-hover:scale-105 relative"
                          style={{
                            height: `${(item.valor / 21) * 100}%`,
                            background: 'hsl(220 100% 50%)',
                            boxShadow: '0 0 15px hsl(220 100% 50% / 0.6)',
                            minHeight: item.valor > 0 ? '20%' : '0'
                          }}
                        >
                          {item.valor > 0 && (
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">
                              {item.valor}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{item.dia}</span>
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-xs px-2 py-1 rounded border border-primary/30 pointer-events-none -translate-y-full mt-2">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-sm text-muted-foreground">
                  Meta: 5 treinos/semana
                </p>
              </CardContent>
            </Card>

            {/* Gráfico Nutrição */}
            <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🥗</span>
                  <h3 className="text-xl font-bold">Nutrição</h3>
                </div>
                
                <div className="flex items-end justify-between gap-2 h-48 mb-6">
                  {[
                    { dia: "Seg", valor: 18, label: "1,850 kcal" },
                    { dia: "Ter", valor: 15, label: "1,650 kcal" },
                    { dia: "Qua", valor: 11, label: "1,200 kcal" },
                    { dia: "Qui", valor: 20, label: "2,100 kcal" },
                    { dia: "Sex", valor: 9, label: "980 kcal" },
                    { dia: "Sáb", valor: 11, label: "1,150 kcal" },
                    { dia: "Dom", valor: 8, label: "850 kcal" }
                  ].map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-muted/30 rounded-t-lg relative flex items-end h-full">
                        <div 
                          className="w-full rounded-t-lg transition-all duration-300 group-hover:scale-105 relative"
                          style={{
                            height: `${(item.valor / 21) * 100}%`,
                            background: 'hsl(122 39% 49%)',
                            boxShadow: '0 0 15px hsl(122 39% 49% / 0.6)',
                            minHeight: '20%'
                          }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold" style={{ color: 'hsl(122 39% 49%)' }}>
                            {item.valor}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{item.dia}</span>
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-xs px-2 py-1 rounded border border-primary/30 pointer-events-none -translate-y-full mt-2">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-sm text-muted-foreground">
                  Meta: 2,000 kcal/dia
                </p>
              </CardContent>
            </Card>

            {/* Gráfico Experiência */}
            <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📱</span>
                  <h3 className="text-xl font-bold">Uso da Plataforma</h3>
                </div>
                
                <div className="flex items-end justify-between gap-2 h-48 mb-6">
                  {[
                    { dia: "Seg", valor: 12, label: "Scans: 4" },
                    { dia: "Ter", valor: 11, label: "Scans: 3" },
                    { dia: "Qua", valor: 8, label: "Scans: 2" },
                    { dia: "Qui", valor: 15, label: "Scans: 5" },
                    { dia: "Sex", valor: 10, label: "Scans: 3" },
                    { dia: "Sáb", valor: 11, label: "Scans: 4" },
                    { dia: "Dom", valor: 7, label: "Scans: 2" }
                  ].map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-muted/30 rounded-t-lg relative flex items-end h-full">
                        <div 
                          className="w-full rounded-t-lg transition-all duration-300 group-hover:scale-105 relative"
                          style={{
                            height: `${(item.valor / 21) * 100}%`,
                            background: 'hsl(193 100% 50%)',
                            boxShadow: '0 0 15px hsl(193 100% 50% / 0.6)',
                            minHeight: '20%'
                          }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-secondary">
                            {item.valor}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{item.dia}</span>
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-xs px-2 py-1 rounded border border-primary/30 pointer-events-none -translate-y-full mt-2">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-sm">
                  <span className="text-secondary font-semibold">Você está 15% mais ativo que semana passada!</span> 🎉
                </p>
              </CardContent>
            </Card>
          </div>
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
            <Card 
              className="border-primary/30 hover:shadow-glow transition-all cursor-pointer hover:scale-105"
              onClick={handleCycleClick}
            >
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

      {/* Sofia Assistant Modal */}
      <SofiaAssistant isOpen={sofiaOpen} onClose={() => setSofiaOpen(false)} />
    </div>
  );
};

export default Landing;
