import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Camera, Plus, Apple, Pizza, Fish, Salad, Beef } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CorrectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (food: any) => void;
  onRetake: () => void;
}

const commonFoods = [
  { id: 1, name: "Arroz Branco", emoji: "🍚", category: "Carboidratos", icon: Salad },
  { id: 2, name: "Frango Grelhado", emoji: "🍗", category: "Proteínas", icon: Beef },
  { id: 3, name: "Feijão Preto", emoji: "🫘", category: "Proteínas", icon: Salad },
  { id: 4, name: "Banana", emoji: "🍌", category: "Frutas", icon: Apple },
  { id: 5, name: "Ovo Cozido", emoji: "🥚", category: "Proteínas", icon: Beef },
  { id: 6, name: "Maçã", emoji: "🍎", category: "Frutas", icon: Apple },
  { id: 7, name: "Pão Integral", emoji: "🍞", category: "Carboidratos", icon: Salad },
  { id: 8, name: "Salmão", emoji: "🐟", category: "Proteínas", icon: Fish },
];

const categories = ["Todos", "Frutas", "Proteínas", "Carboidratos", "Vegetais"];

const CorrectionModal = ({ open, onClose, onSelect, onRetake }: CorrectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredFoods = commonFoods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (food: any) => {
    // Mock nutrition data - in production, this would come from a database
    const mockData = {
      name: food.name,
      confidence: 100,
      emoji: food.emoji,
      calories: 130,
      carbs: 28,
      protein: 2.5,
      fat: 0.3,
      fiber: 2,
      sugar: 12,
    };
    onSelect(mockData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Corrigir Identificação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar alimento..."
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Food List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredFoods.map((food) => (
              <Card
                key={food.id}
                className="cursor-pointer hover:shadow-card transition-shadow"
                onClick={() => handleSelect(food)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-3xl">{food.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium">{food.name}</p>
                    <p className="text-sm text-muted-foreground">{food.category}</p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}

            {filteredFoods.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum alimento encontrado</p>
                <p className="text-sm mt-2">Tente outro termo de busca</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onRetake}>
              <Camera className="h-4 w-4 mr-2" />
              Nova Foto
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CorrectionModal;
