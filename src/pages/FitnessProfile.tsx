import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const muscleGroups = [
  "Chest", "Biceps", "Triceps", "Abs", "Glutes", "Shoulders",
  "Quads", "Lats", "Traps", "Lower Back", "Forearms", "Obliques",
  "Hamstrings", "Calves", "Abductors"
];

const equipmentList = [
  "Flat Bench", "Adjustable Bench", "Dumbbells", "Olympic Barbell",
  "Leg Press", "Lat Pulldown Cable", "Squat Rack", "Smith Machine",
  "Resistance Bands", "Pull-up Bar", "Kettlebells", "Medicine Ball",
  "Apenas peso corporal"
];

const FitnessProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState({
    name: "",
    age: 25,
    gender: "Masculino",
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    goal: "",
    experience: "",
    daysPerWeek: 3,
    sessionDuration: "60min",
    focusMuscles: [] as string[],
    limitations: "",
    trainingType: "misto",
    equipment: [] as string[],
  });

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    toast.success("Gerando Seu Plano Personalizado...");
    setTimeout(() => {
      navigate("/workouts");
    }, 2000);
  };

  const toggleMuscle = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      focusMuscles: prev.focusMuscles.includes(muscle)
        ? prev.focusMuscles.filter(m => m !== muscle)
        : [...prev.focusMuscles, muscle]
    }));
  };

  const toggleEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-neon bg-clip-text text-transparent">
            Vamos Criar Seu Plano Perfeito
          </h1>
          <p className="text-muted-foreground">
            Quanto mais precisos os dados, mais personalizado será seu treino
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-center mt-2 text-sm text-muted-foreground">
            Etapa {step} de {totalSteps}
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-glow border-secondary/20">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Dados Pessoais"}
              {step === 2 && "Objetivos Principais"}
              {step === 3 && "Experiência e Frequência"}
              {step === 4 && "Preferências e Limitações"}
              {step === 5 && "Equipamentos Disponíveis"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Data */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label>Nome Completo</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <Label>Idade: {formData.age} anos</Label>
                  <Slider
                    value={[formData.age]}
                    onValueChange={([value]) => setFormData({ ...formData, age: value })}
                    min={15}
                    max={80}
                    step={1}
                  />
                </div>

                <div>
                  <Label>Gênero</Label>
                  <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Masculino" id="male" />
                      <Label htmlFor="male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Feminino" id="female" />
                      <Label htmlFor="female">Feminino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Outro" id="other" />
                      <Label htmlFor="other">Outro</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Altura: {formData.height} cm</Label>
                  <Slider
                    value={[formData.height]}
                    onValueChange={([value]) => setFormData({ ...formData, height: value })}
                    min={140}
                    max={220}
                    step={1}
                  />
                </div>

                <div>
                  <Label>Peso Atual: {formData.currentWeight} kg</Label>
                  <Slider
                    value={[formData.currentWeight]}
                    onValueChange={([value]) => setFormData({ ...formData, currentWeight: value })}
                    min={40}
                    max={150}
                    step={0.5}
                  />
                </div>

                <div>
                  <Label>Peso Objetivo: {formData.targetWeight} kg</Label>
                  <Slider
                    value={[formData.targetWeight]}
                    onValueChange={([value]) => setFormData({ ...formData, targetWeight: value })}
                    min={40}
                    max={150}
                    step={0.5}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <div className="space-y-4">
                <Label>Qual seu principal objetivo?</Label>
                <RadioGroup value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                  {[
                    "Emagrecer e perder peso",
                    "Ganhar massa muscular",
                    "Definir e tonificar",
                    "Manter condicionamento",
                    "Melhorar performance esportiva",
                    "Recuperação física"
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary transition-colors">
                      <RadioGroupItem value={goal} id={goal} />
                      <Label htmlFor={goal} className="cursor-pointer flex-1">{goal}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Experience & Frequency */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-4 block">Qual seu nível de experiência?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { level: "Iniciante", desc: "0-6 meses" },
                      { level: "Intermediário", desc: "6 meses - 2 anos" },
                      { level: "Avançado", desc: "+2 anos" }
                    ].map(({ level, desc }) => (
                      <Card
                        key={level}
                        className={`cursor-pointer transition-all hover:shadow-glow ${
                          formData.experience === level ? "border-primary shadow-glow" : ""
                        }`}
                        onClick={() => setFormData({ ...formData, experience: level })}
                      >
                        <CardContent className="p-6 text-center">
                          <p className="font-bold mb-1">{level}</p>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Quantos dias pode treinar por semana? {formData.daysPerWeek} dias</Label>
                  <Slider
                    value={[formData.daysPerWeek]}
                    onValueChange={([value]) => setFormData({ ...formData, daysPerWeek: value })}
                    min={1}
                    max={7}
                    step={1}
                  />
                </div>

                <div>
                  <Label className="mb-4 block">Quanto tempo por sessão?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["30min", "45min", "60min", "75min", "90min"].map((duration) => (
                      <Button
                        key={duration}
                        variant={formData.sessionDuration === duration ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, sessionDuration: duration })}
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preferences & Limitations */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-4 block">
                    Quais grupos musculares quer focar? ({formData.focusMuscles.length} selecionados)
                  </Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {muscleGroups.map((muscle) => (
                      <Card
                        key={muscle}
                        className={`cursor-pointer transition-all hover:shadow-glow ${
                          formData.focusMuscles.includes(muscle) ? "border-primary shadow-glow" : ""
                        }`}
                        onClick={() => toggleMuscle(muscle)}
                      >
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium">{muscle}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Tem alguma limitação física ou lesão?</Label>
                  <Textarea
                    value={formData.limitations}
                    onChange={(e) => setFormData({ ...formData, limitations: e.target.value })}
                    placeholder="Descreva suas limitações ou lesões..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="mb-4 block">Prefere treinos:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["cardio", "força", "misto", "funcional"].map((type) => (
                      <Button
                        key={type}
                        variant={formData.trainingType === type ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, trainingType: type })}
                        className="capitalize"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Equipment */}
            {step === 5 && (
              <div className="space-y-4">
                <Label className="mb-4 block">
                  Quais equipamentos tem acesso? ({formData.equipment.length} selecionados)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {equipmentList.map((equipment) => (
                    <div
                      key={equipment}
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <Checkbox
                        checked={formData.equipment.includes(equipment)}
                        onCheckedChange={() => toggleEquipment(equipment)}
                        id={equipment}
                      />
                      <Label htmlFor={equipment} className="cursor-pointer flex-1">
                        {equipment}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              {step < totalSteps ? (
                <Button onClick={handleNext}>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} variant="hero" size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Gerar Meu Plano com IA
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FitnessProfile;
