import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.phone || !formData.email || !formData.birthDate || !formData.gender) {
      toast.error("Preencha todos os campos obrigatórios");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("E-mail inválido");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Preencha todos os campos de senha");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return false;
    }
    if (!formData.acceptTerms) {
      toast.error("Aceite os termos para continuar");
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) {
      return;
    }
    
    if (step === 2) {
      // Create account
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          phone: formData.phone.replace(/\D/g, ""),
          options: {
            data: {
              full_name: formData.fullName,
              phone_number: formData.phone,
              birth_date: formData.birthDate,
              gender: formData.gender,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;
        
        toast.success("Conta criada com sucesso! Verifique seu e-mail.");
        navigate("/verify-email", { state: { email: formData.email } });
      } catch (error: any) {
        toast.error(error.message || "Erro ao criar conta");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Digite o código de 6 dígitos");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: formData.phone.replace(/\D/g, ""),
        token: verificationCode,
        type: 'sms'
      });

      if (error) throw error;
      
      toast.success("Telefone verificado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Código inválido");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formData.phone.replace(/\D/g, ""),
      });

      if (error) throw error;
      toast.success("Código reenviado!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao reenviar código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-lg shadow-elevated border-primary/20">
        <CardHeader className="text-center space-y-4">
          <Link to="/" className="flex items-center justify-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Health AI Coach</span>
          </Link>
          <div>
            <CardTitle className="text-2xl">Sua Jornada Fitness Personalizada</CardTitle>
            <p className="text-muted-foreground mt-2">Comece Aqui</p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-center gap-2 pt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
                style={{
                  boxShadow: s <= step ? "0 0 10px hsl(var(--primary))" : "none",
                }}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados Pessoais</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Seu nome completo"
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone/Celular *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="border-primary/30 focus:border-primary">
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Criação de Senha</h3>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Digite a senha novamente"
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Aceito os Termos de Uso e Política de Privacidade
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <h3 className="font-semibold text-lg">Verificação por E-mail</h3>
              <p className="text-muted-foreground">
                Enviamos um link de confirmação para<br />
                <span className="font-semibold text-foreground">{formData.email}</span>
              </p>
              
              <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm">
                  Verifique sua caixa de entrada (e spam) e clique no link para ativar sua conta.
                </p>
              </div>

              <Button
                onClick={() => navigate("/login")}
                className="w-full"
                variant="outline"
              >
                Ir para Login
              </Button>
            </div>
          )}

          {step < 3 && (
            <div className="space-y-4">
              <Button
                onClick={handleNextStep}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 shadow-neon"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {step === 2 ? "CRIAR MINHA CONTA" : "PRÓXIMO"}
              </Button>

              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  VOLTAR
                </Button>
              )}
            </div>
          )}

          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Entrar com telefone
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
