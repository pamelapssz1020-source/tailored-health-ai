import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setState("analyzing");
    
    try {
      console.log('📸 Enviando imagem para análise...');
      
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageData }
      });

      if (error) {
        console.error('❌ Erro na análise:', error);
        throw error;
      }

      console.log('✅ Análise recebida:', data);

      // Transform API response to component format
      const foodData = {
        name: data.food_name,
        confidence: Math.round(data.confidence * 100),
        emoji: getFoodEmoji(data.food_name),
        calories: data.calories_total,
        carbs: data.macros.carbs_g,
        protein: data.macros.protein_g,
        fat: data.macros.fat_g,
        fiber: data.macros.fiber_g,
        sugar: data.macros.sugar_g,
        estimatedWeight: data.estimated_weight_g,
        description: data.description,
        micronutrients: data.micronutrients,
        alternatives: data.alternatives?.map((alt: any) => alt.name) || [],
      };

      setFoodData(foodData);
      setState("results");

    } catch (error) {
      console.error('❌ Erro ao analisar imagem:', error);
      toast({
        title: "Erro na análise",
        description: error instanceof Error ? error.message : "Não foi possível analisar a imagem. Tente novamente.",
        variant: "destructive",
      });
      setState("idle");
    }
  };

  const getFoodEmoji = (foodName: string): string => {
    const name = foodName.toLowerCase();
    if (name.includes('maçã') || name.includes('apple')) return '🍎';
    if (name.includes('banana')) return '🍌';
    if (name.includes('laranja') || name.includes('orange')) return '🍊';
    if (name.includes('uva') || name.includes('grape')) return '🍇';
    if (name.includes('morango') || name.includes('strawberry')) return '🍓';
    if (name.includes('melancia') || name.includes('watermelon')) return '🍉';
    if (name.includes('maracujá') || name.includes('passion fruit')) return '🥭';
    if (name.includes('abacaxi') || name.includes('pineapple')) return '🍍';
    if (name.includes('pera') || name.includes('pear')) return '🍐';
    if (name.includes('pêssego') || name.includes('peach')) return '🍑';
    if (name.includes('cereja') || name.includes('cherry')) return '🍒';
    if (name.includes('kiwi')) return '🥝';
    if (name.includes('abacate') || name.includes('avocado')) return '🥑';
    if (name.includes('tomate') || name.includes('tomato')) return '🍅';
    if (name.includes('brócolis') || name.includes('broccoli')) return '🥦';
    if (name.includes('cenoura') || name.includes('carrot')) return '🥕';
    if (name.includes('batata') || name.includes('potato')) return '🥔';
    if (name.includes('arroz') || name.includes('rice')) return '🍚';
    if (name.includes('pão') || name.includes('bread')) return '🍞';
    if (name.includes('ovo') || name.includes('egg')) return '🥚';
    if (name.includes('frango') || name.includes('chicken')) return '🍗';
    if (name.includes('carne') || name.includes('meat')) return '🥩';
    if (name.includes('peixe') || name.includes('fish')) return '🐟';
    if (name.includes('queijo') || name.includes('cheese')) return '🧀';
    if (name.includes('leite') || name.includes('milk')) return '🥛';
    if (name.includes('iogurte') || name.includes('yogurt')) return '🥛';
    return '🍽️'; // Default food emoji
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
        return <AnalysisLoading />;

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
