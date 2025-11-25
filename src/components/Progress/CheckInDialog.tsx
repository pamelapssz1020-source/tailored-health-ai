import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Scale, Ruler, Loader2 } from 'lucide-react';
import { useUserProgress, ProgressInput } from '@/hooks/useUserProgress';

interface CheckInDialogProps {
  onSuccess?: () => void;
}

export const CheckInDialog = ({ onSuccess }: CheckInDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addProgress } = useUserProgress();
  
  const [formData, setFormData] = useState<ProgressInput>({
    weight_kg: null,
    chest_cm: null,
    waist_cm: null,
    hips_cm: null,
    arm_cm: null,
    thigh_cm: null,
    notes: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addProgress(formData);
      setOpen(false);
      setFormData({
        weight_kg: null,
        chest_cm: null,
        waist_cm: null,
        hips_cm: null,
        arm_cm: null,
        thigh_cm: null,
        notes: null,
      });
      onSuccess?.();
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProgressInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value ? parseFloat(value) : null,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-glow hover:shadow-glow-intense transition-all">
          <Plus className="h-4 w-4" />
          Registrar Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-5 w-5 text-primary" />
            Novo Check-in
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Weight */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Scale className="h-4 w-4 text-secondary" />
              Peso (kg)
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Ex: 72.5"
              value={formData.weight_kg || ''}
              onChange={(e) => handleChange('weight_kg', e.target.value)}
              className="bg-muted/50 border-border focus:border-primary"
            />
          </div>

          {/* Measurements */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Ruler className="h-4 w-4 text-accent" />
              Medidas Corporais (cm)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Peito</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="cm"
                  value={formData.chest_cm || ''}
                  onChange={(e) => handleChange('chest_cm', e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Cintura</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="cm"
                  value={formData.waist_cm || ''}
                  onChange={(e) => handleChange('waist_cm', e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Quadril</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="cm"
                  value={formData.hips_cm || ''}
                  onChange={(e) => handleChange('hips_cm', e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Braço</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="cm"
                  value={formData.arm_cm || ''}
                  onChange={(e) => handleChange('arm_cm', e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">Coxa</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="cm"
                  value={formData.thigh_cm || ''}
                  onChange={(e) => handleChange('thigh_cm', e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Observações</Label>
            <Textarea
              placeholder="Como você está se sentindo? Alguma observação?"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
              className="bg-muted/50 border-border resize-none"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2"
            disabled={loading || (!formData.weight_kg && !formData.chest_cm && !formData.waist_cm)}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Salvar Check-in
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
