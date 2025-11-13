import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Update last login
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ last_login: new Date().toISOString() })
          .eq("user_id", data.user.id);
      }

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error("Digite seu e-mail para recuperar a senha");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) throw error;
      
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setShowPasswordReset(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar e-mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md shadow-elevated border-primary/20">
        <CardHeader className="text-center space-y-4">
          <Link to="/" className="flex items-center justify-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Health AI Coach</span>
          </Link>
          <div>
            <CardTitle className="text-2xl">
              {showPasswordReset ? "Recuperar Senha" : "Bem-vindo de Volta"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {showPasswordReset ? "Digite seu e-mail" : "Entre para continuar sua jornada"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="border-primary/30 focus:border-primary"
                disabled={loading}
              />
            </div>

            {!showPasswordReset && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Sua senha"
                  className="border-primary/30 focus:border-primary"
                  disabled={loading}
                />
              </div>
            )}

            {showPasswordReset ? (
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 shadow-neon"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  ENVIAR E-MAIL DE RECUPERAÇÃO
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowPasswordReset(false)}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  VOLTAR PARA LOGIN
                </Button>
              </div>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 shadow-neon"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  ENTRAR
                </Button>

                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-primary hover:underline w-full text-center"
                >
                  Esqueceu sua senha?
                </button>
              </>
            )}
          </form>

          {!showPasswordReset && (
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Cadastre-se grátis
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
