import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import { 
  Camera, 
  Dumbbell, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Activity
} from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";
import foodScannerImage from "@/assets/food-scanner.jpg";
import workoutImage from "@/assets/workout-demo.jpg";
import aiAssistantImage from "@/assets/ai-assistant.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
                <Zap className="h-4 w-4" />
                <span>Powered by Inteligência Artificial</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Seu Personal Trainer e{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Nutricionista 24h
                </span>{" "}
                por dia
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Planos 100% personalizados de treino e dieta criados por IA. 
                Reconhecimento de alimentos por câmera e assistente virtual sempre disponível.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild className="group">
                  <Link to="/signup">
                    Comece Grátis Agora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/#features">Ver Funcionalidades</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 mt-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Teste grátis 7 dias</span>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="absolute inset-0 gradient-hero blur-3xl opacity-20 animate-float" />
              <img 
                src={heroImage} 
                alt="Health AI Coach App" 
                className="relative rounded-2xl shadow-elevated w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Cansado de Dietas e Treinos Genéricos?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A maioria dos apps oferece planos padronizados que não consideram suas necessidades únicas. 
              <span className="text-primary font-semibold"> Nossa IA cria planos feitos exclusivamente para você</span>, 
              baseados em seus objetivos, preferências e estilo de vida.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Funcionalidades Revolucionárias</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnologia de ponta para transformar sua jornada de saúde
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={Camera}
              title="Scanner de Alimentos"
              description="Tire uma foto da sua refeição e nossa IA identifica automaticamente os alimentos e calcula calorias e macronutrientes instantaneamente."
              image={foodScannerImage}
            />
            <FeatureCard
              icon={Dumbbell}
              title="Treinos Personalizados"
              description="Planos de treino criados especialmente para você, com vídeos demonstrativos e ajustes automáticos baseados no seu progresso."
              image={workoutImage}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Assistente 24/7"
              description="Tire dúvidas sobre exercícios, receba sugestões de substituições alimentares e ajustes no treino a qualquer momento."
              image={aiAssistantImage}
            />
            <FeatureCard
              icon={Target}
              title="Objetivos Inteligentes"
              description="Defina metas realistas e acompanhe seu progresso com gráficos detalhados e insights personalizados da IA."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Evolução em Tempo Real"
              description="Monitore peso, medidas, percentual de gordura e performance nos treinos com análises inteligentes."
            />
            <FeatureCard
              icon={Zap}
              title="Adaptação Automática"
              description="A IA ajusta automaticamente seu plano baseado em feedback, resultados e mudanças nos seus objetivos."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">Em apenas 3 passos simples</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Conte-nos sobre você",
                description: "Responda um questionário rápido sobre seus objetivos, preferências e estilo de vida."
              },
              {
                step: "2",
                title: "IA cria seu plano",
                description: "Nossa inteligência artificial gera planos personalizados de treino e nutrição só para você."
              },
              {
                step: "3",
                title: "Acompanhe e evolua",
                description: "Registre seu progresso e deixe a IA ajustar automaticamente seu plano para resultados máximos."
              }
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-glow group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O Que Nossos Usuários Dizem</h2>
            <p className="text-xl text-muted-foreground">Transformações reais de pessoas reais</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              name="Maria Silva"
              role="Perdeu 15kg em 4 meses"
              content="Nunca imaginei que seria tão fácil! O scanner de alimentos e os treinos personalizados fizeram toda a diferença."
              rating={5}
            />
            <TestimonialCard
              name="João Santos"
              role="Ganhou 8kg de massa muscular"
              content="O assistente de IA é incrível! Sempre que tenho dúvidas, ele me ajuda na hora. Meus resultados são visíveis."
              rating={5}
            />
            <TestimonialCard
              name="Ana Costa"
              role="Maratonista amadora"
              content="Finalmente encontrei um app que entende minhas necessidades específicas. Os planos se adaptam perfeitamente."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para Transformar Sua Saúde?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a milhares de pessoas que já estão alcançando seus objetivos com a ajuda da IA
            </p>
            <Button variant="hero" size="xl" asChild className="group">
              <Link to="/signup">
                Comece Sua Jornada Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="mt-6 text-sm text-muted-foreground">
              7 dias grátis • Cancele quando quiser • Sem compromisso
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold">Health AI Coach</span>
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
