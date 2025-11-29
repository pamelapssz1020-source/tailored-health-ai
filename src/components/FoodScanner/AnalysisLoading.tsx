import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles } from "lucide-react";

interface AnalysisLoadingProps {
  onComplete?: () => void;
}

const loadingSteps = [
  { message: "Processando imagem...", duration: 2000, progress: 33 },
  { message: "Identificando alimentos...", duration: 2000, progress: 66 },
  { message: "Calculando valores nutricionais...", duration: 2000, progress: 100 },
];

const AnalysisLoading = ({ onComplete }: AnalysisLoadingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const step = loadingSteps[currentStep];
    const startProgress = currentStep === 0 ? 0 : loadingSteps[currentStep - 1].progress;
    const targetProgress = step.progress;
    const increment = (targetProgress - startProgress) / 20;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        return next >= targetProgress ? targetProgress : next;
      });
    }, step.duration / 20);

    const stepTimeout = setTimeout(() => {
      if (currentStep < loadingSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        onComplete?.();
      }
    }, step.duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [currentStep, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 gradient-hero opacity-20 blur-3xl animate-pulse" />
        <div className="relative bg-gradient-to-br from-primary to-secondary p-6 rounded-full shadow-glow">
          <Sparkles className="h-12 w-12 text-white animate-spin" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold animate-fade-in">
          IA analisando seu alimento...
        </h3>
        <p className="text-muted-foreground animate-fade-in">
          {loadingSteps[currentStep].message}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Decorative Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: `ping ${2 + i * 0.5}s cubic-bezier(0, 0, 0.2, 1) infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <div className="w-32 h-32 border-2 border-primary/20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisLoading;
