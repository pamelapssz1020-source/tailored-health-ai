import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Activity className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Health AI Coach
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Funcionalidades
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/nutrition" className="text-sm font-medium hover:text-primary transition-colors">
            Nutrição
          </Link>
          <Link to="/medications" className="text-sm font-medium hover:text-primary transition-colors">
            Medicamentos
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/dashboard">Ver App</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
