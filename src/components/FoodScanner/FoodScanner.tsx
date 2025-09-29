import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FoodScannerModal from "./FoodScannerModal";
import AnalysisLoading from "./AnalysisLoading";
import FoodResults from "./FoodResults";
import CorrectionModal from "./CorrectionModal";

type ScannerState = "idle" | "camera" | "analyzing" | "results" | "correction";

const FoodScanner = () => {
  const { toast } = useToast();
  const [state, setState] = useState<ScannerState>("idle");
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [foodData, setFoodData] = useState<any>(null);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setState("analyzing");
  };

  const handleAnalysisComplete = () => {
    // Mock data - in production, this would come from AI analysis
    const mockFoodData = {
      name: "Maçã Verde",
      confidence: 92,
      emoji: "🍏",
      calories: 52,
      carbs: 14,
      protein: 0.3,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10,
      pairings: ["Iogurte natural", "Canela", "Mel"],
      alternatives: ["Maçã vermelha", "Pera"],
    };
    setFoodData(mockFoodData);
    setState("results");
  };

  const handleCorrect = () => {
    setState("correction");
  };

  const handleCorrectionSelect = (newFoodData: any) => {
    setFoodData(newFoodData);
    setState("results");
  };

  const handleRetake = () => {
    setState("camera");
  };

  const handleSave = (meal: string, portion: number, notes: string) => {
    toast({
      title: "Alimento adicionado!",
      description: `${foodData.name} (${portion}g) salvo no seu ${meal === "breakfast" ? "café da manhã" : meal === "lunch" ? "almoço" : meal === "dinner" ? "jantar" : "lanche"}`,
    });
    
    // Reset to idle state
    setState("idle");
    setCapturedImage("");
    setFoodData(null);
  };

  const renderContent = () => {
    switch (state) {
      case "camera":
        return (
          <FoodScannerModal
            open={true}
            onClose={() => setState("idle")}
            onCapture={handleCapture}
          />
        );

      case "analyzing":
        return <AnalysisLoading onComplete={handleAnalysisComplete} />;

      case "results":
        return (
          <FoodResults
            imageData={capturedImage}
            foodData={foodData}
            onCorrect={handleCorrect}
            onSave={handleSave}
          />
        );

      case "correction":
        return (
          <CorrectionModal
            open={true}
            onClose={() => setState("results")}
            onSelect={handleCorrectionSelect}
            onRetake={handleRetake}
          />
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 gradient-hero opacity-20 blur-3xl" />
              <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-full">
                <Camera className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Scanner de Alimentos</h3>
              <p className="text-muted-foreground max-w-md">
                Tire uma foto do seu alimento e nossa IA identificará automaticamente 
                os valores nutricionais
              </p>
            </div>

            <Button
              variant="hero"
              size="xl"
              onClick={() => setState("camera")}
              className="group"
            >
              <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Iniciar Scanner
            </Button>

            <div className="grid grid-cols-3 gap-4 max-w-md text-sm text-muted-foreground">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">📸</p>
                <p>Tire a foto</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">🤖</p>
                <p>IA analisa</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">✅</p>
                <p>Salve no diário</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default FoodScanner;
