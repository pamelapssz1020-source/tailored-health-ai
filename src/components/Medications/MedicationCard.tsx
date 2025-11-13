import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, Calendar } from "lucide-react";
import { Medication } from "@/pages/Medications";

interface MedicationCardProps {
  medication: Medication;
  onDelete: (id: string) => void;
  onClick: () => void;
  typeColor: string;
  typeEmoji: string;
}

const MedicationCard = ({ medication, onDelete, onClick, typeColor, typeEmoji }: MedicationCardProps) => {
  const getObjectiveLabel = (objective: string) => {
    switch (objective) {
      case "treatment": return "Tratamento";
      case "performance": return "Performance";
      case "health": return "Saúde Geral";
      case "aesthetics": return "Estética";
      default: return objective;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily": return "Diário";
      case "weekly": return "Semanal";
      case "as-needed": return "Quando Necessário";
      default: return frequency;
    }
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 bg-card/95 backdrop-blur border-2 ${typeColor}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{typeEmoji}</span>
            <div>
              <h3 className="font-bold text-lg">{medication.name}</h3>
              <Badge variant="outline" className="mt-1">
                {getObjectiveLabel(medication.objective)}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(medication.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Dosagem:</span>
            <span>{medication.dosage}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{getFrequencyLabel(medication.frequency)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              <span>Horários:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {medication.times.map((time, index) => (
                <Badge key={index} className="bg-primary/20 text-primary border-primary/50">
                  {time}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Iniciado em: {new Date(medication.startDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
