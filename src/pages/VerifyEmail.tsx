import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }

    // Auto-login detection after email verification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          toast.success("Email verificado! Bem-vindo(a)!");
          navigate("/dashboard");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast.success("Email reenviado! Verifique sua caixa de entrada.");
      setCooldown(60);
    } catch (error: any) {
      toast.error(error.message || "Erro ao reenviar email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md shadow-elevated border-primary/20">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Mail className="h-20 w-20 text-primary animate-pulse" />
              <div className="absolute inset-0 h-20 w-20 rounded-full bg-primary/20 animate-ping" />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-2xl">Verifique seu Email</CardTitle>
            <p className="text-muted-foreground mt-2">
              Enviamos um link mágico para
            </p>
            <p className="text-foreground font-semibold mt-1">{email}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
            <p className="text-sm text-center">
              Clique no link que enviamos para ativar sua conta e fazer login automaticamente.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Não se esqueça de verificar a pasta de spam/lixo eletrônico!
            </p>
          </div>

          <Button
            onClick={handleResendEmail}
            disabled={loading || cooldown > 0}
            className="w-full bg-primary hover:bg-primary/90 shadow-neon"
            variant={cooldown > 0 ? "outline" : "default"}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {cooldown > 0 ? `Aguarde ${cooldown}s para reenviar` : "REENVIAR EMAIL"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Email errado?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Cadastre-se novamente
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Já verificou?{" "}
              <Link 
                to="/login" 
                state={{ email }}
                className="text-primary hover:underline font-medium"
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
