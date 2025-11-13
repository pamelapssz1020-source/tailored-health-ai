import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Sparkles, AlertTriangle, CheckCircle, TrendingUp, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import AddMedicationForm from "@/components/Medications/AddMedicationForm";
import MedicationCard from "@/components/Medications/MedicationCard";
import AIAnalysis from "@/components/Medications/AIAnalysis";
import DetailModal from "@/components/Medications/DetailModal";

export interface Medication {
  id: string;
  name: string;
  type: "medication" | "supplement" | "vitamin";
  dosage: string;
  frequency: string;
  times: string[];
  objective: string;
  startDate: string;
}

const Medications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [adherenceRate, setAdherenceRate] = useState(92);

  useEffect(() => {
    const stored = localStorage.getItem('medications');
    if (stored) {
      setMedications(JSON.parse(stored));
    }
  }, []);

  const handleAddMedication = (medication: Medication) => {
    const updated = [...medications, medication];
    setMedications(updated);
    localStorage.setItem('medications', JSON.stringify(updated));
    setShowAddForm(false);
  };

  const handleDeleteMedication = (id: string) => {
    const updated = medications.filter(m => m.id !== id);
    setMedications(updated);
    localStorage.setItem('medications', JSON.stringify(updated));
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case "medication": return "💊";
      case "supplement": return "🏋️";
      case "vitamin": return "🌿";
      default: return "💊";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "medication": return "border-red-500/50 shadow-[0_0_15px_rgba(255,107,107,0.3)]";
      case "supplement": return "border-primary/50 shadow-glow";
      case "vitamin": return "border-emerald-500/50 shadow-[0_0_15px_rgba(0,200,150,0.3)]";
      default: return "border-primary/50";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="particles-bg">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <Badge className="mb-6 neon-pulse bg-primary/20 text-primary border-primary/50">
            <Sparkles className="h-4 w-4 mr-2" />
            Saúde Inteligente
          </Badge>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-4">
            Sua Saúde Completa em{" "}
            <span className="text-primary drop-shadow-[0_0_30px_rgba(0,212,255,0.8)]">
              Um Lugar
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Cadastre, analise e otimize seus medicamentos e suplementos com inteligência artificial
          </p>
          
          <Button 
            size="lg" 
            onClick={() => setShowAddForm(!showAddForm)}
            className="neon-pulse shadow-glow-intense"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Medicamento/Suplemento
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* Formulário de Cadastro */}
        {showAddForm && (
          <div className="mb-12 animate-fade-in">
            <AddMedicationForm 
              onAdd={handleAddMedication} 
              onCancel={() => setShowAddForm(false)} 
            />
          </div>
        )}

        {/* Meu Registro Atual */}
        {medications.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Meu Registro Atual</h2>
                <p className="text-muted-foreground">
                  {medications.length} {medications.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications.map((med) => (
                <MedicationCard
                  key={med.id}
                  medication={med}
                  onDelete={handleDeleteMedication}
                  onClick={() => setSelectedMedication(med)}
                  typeColor={getTypeColor(med.type)}
                  typeEmoji={getTypeEmoji(med.type)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Resumo e Adesão */}
        {medications.length > 0 && (
          <section className="mb-16">
            <Card className="border-primary/30 bg-card/50 backdrop-blur">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{adherenceRate}%</div>
                    <p className="text-muted-foreground">Adesão ao Protocolo</p>
                    <Badge className="mt-2 bg-primary/20 text-primary border-primary/50">
                      Excelente!
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div className="text-4xl font-bold text-emerald-500 mb-2">0</div>
                    <p className="text-muted-foreground">Próximos a Vencer</p>
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-500 border-emerald-500/50">
                      Tudo OK
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-amber-500" />
                    </div>
                    <div className="text-4xl font-bold text-amber-500 mb-2">
                      {medications.reduce((acc, m) => acc + m.times.length, 0)}
                    </div>
                    <p className="text-muted-foreground">Horários Configurados</p>
                    <Badge className="mt-2 bg-amber-500/20 text-amber-500 border-amber-500/50">
                      Em dia
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Análise da IA */}
        {medications.length > 0 && (
          <AIAnalysis medications={medications} />
        )}

        {/* Estado Vazio */}
        {medications.length === 0 && !showAddForm && (
          <Card className="border-primary/30 bg-card/50 backdrop-blur">
            <CardContent className="p-16 text-center">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Comece Sua Jornada de Saúde</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Cadastre seus medicamentos e suplementos para receber análises inteligentes e recomendações personalizadas
              </p>
              <Button 
                size="lg" 
                onClick={() => setShowAddForm(true)}
                className="neon-pulse shadow-glow-intense"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeiro Item
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedMedication && (
        <DetailModal
          medication={selectedMedication}
          onClose={() => setSelectedMedication(null)}
        />
      )}
    </div>
  );
};

export default Medications;
