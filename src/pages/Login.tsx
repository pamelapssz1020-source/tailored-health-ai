import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Health AI Coach</span>
          </Link>
          <CardTitle className="text-2xl">Bem-vindo de Volta</CardTitle>
          <p className="text-muted-foreground">Entre para continuar sua jornada</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">Formulário de login será implementado aqui</p>
            <p className="text-sm">Autenticação com email/senha</p>
          </div>
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Cadastre-se grátis
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
