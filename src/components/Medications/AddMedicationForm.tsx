import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Clock } from "lucide-react";
import { Medication } from "@/pages/Medications";

interface AddMedicationFormProps {
  onAdd: (medication: Medication) => void;
  onCancel: () => void;
}

const AddMedicationForm = ({ onAdd, onCancel }: AddMedicationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "supplement" as "medication" | "supplement" | "vitamin",
    dosage: "",
    frequency: "daily",
    times: ["08:00"],
    objective: "health",
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const medication: Medication = {
      id: Date.now().toString(),
      ...formData
    };
    
    onAdd(medication);
  };

  const addTime = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, "12:00"]
    }));
  };

  const removeTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const updateTime = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? value : t)
    }));
  };

  return (
    <Card className="border-primary/30 bg-card/95 backdrop-blur shadow-glow">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">O que você está tomando atualmente?</h3>
            <p className="text-muted-foreground">Preencha as informações abaixo</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Medicamento/Suplemento</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Whey Protein, Paracetamol..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medication">💊 Medicamento</SelectItem>
                  <SelectItem value="supplement">🏋️ Suplemento</SelectItem>
                  <SelectItem value="vitamin">🌿 Vitamina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosagem</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="Ex: 500mg, 30g, 1000UI"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Frequência</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="as-needed">Quando Necessário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Objetivo</Label>
              <Select value={formData.objective} onValueChange={(value) => setFormData(prev => ({ ...prev, objective: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="treatment">Tratamento</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="health">Saúde Geral</SelectItem>
                  <SelectItem value="aesthetics">Estética</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Início do Uso</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Horários de Uso</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTime}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Horário
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {formData.times.map((time, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(index, e.target.value)}
                    required
                  />
                  {formData.times.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeTime(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 neon-pulse shadow-glow">
              Adicionar ao Registro
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMedicationForm;
