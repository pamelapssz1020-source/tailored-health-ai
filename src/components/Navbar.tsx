import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/30 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-lg group-hover:bg-primary/50 transition-all rounded-full" />
            <Activity className="h-8 w-8 text-primary relative z-10 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          </div>
          <span className="text-xl font-bold font-display text-gradient-cyan">
            Health AI Coach
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#features" className="text-sm font-medium text-foreground-secondary hover:text-primary transition-colors relative group">
            Funcionalidades
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-foreground-secondary hover:text-primary transition-colors relative group">
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link to="/nutrition" className="text-sm font-medium text-foreground-secondary hover:text-secondary transition-colors relative group">
            Nutrição
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link to="/medications" className="text-sm font-medium text-foreground-secondary hover:text-accent transition-colors relative group">
            Medicamentos
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="hover:glow-cyan">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button variant="default" size="sm" asChild className="hover:scale-105">
            <Link to="/dashboard">Ver App</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
