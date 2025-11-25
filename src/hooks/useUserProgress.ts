import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProgressRecord {
  id: string;
  user_id: string;
  record_date: string;
  weight_kg: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  notes: string | null;
  created_at: string;
}

export interface ProgressInput {
  record_date?: string;
  weight_kg?: number | null;
  chest_cm?: number | null;
  waist_cm?: number | null;
  hips_cm?: number | null;
  arm_cm?: number | null;
  thigh_cm?: number | null;
  notes?: string | null;
}

export const useUserProgress = () => {
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false });

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProgress = async (input: ProgressInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const recordDate = input.record_date || new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          record_date: recordDate,
          weight_kg: input.weight_kg,
          chest_cm: input.chest_cm,
          waist_cm: input.waist_cm,
          hips_cm: input.hips_cm,
          arm_cm: input.arm_cm,
          thigh_cm: input.thigh_cm,
          notes: input.notes,
        }, {
          onConflict: 'user_id,record_date'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Check-in salvo!",
        description: "Seu progresso foi registrado com sucesso.",
      });

      await fetchProgress();
      return data;
    } catch (error: any) {
      console.error('Error adding progress:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o check-in.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProgress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Registro excluído",
        description: "O registro foi removido com sucesso.",
      });

      await fetchProgress();
    } catch (error: any) {
      console.error('Error deleting progress:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o registro.",
        variant: "destructive",
      });
    }
  };

  const getWeightHistory = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return progress
      .filter(p => p.weight_kg && new Date(p.record_date) >= cutoffDate)
      .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
      .map(p => ({
        date: p.record_date,
        weight: p.weight_kg!,
      }));
  };

  const getLatestMeasurements = () => {
    const latest = progress.find(p => 
      p.chest_cm || p.waist_cm || p.hips_cm || p.arm_cm || p.thigh_cm
    );
    return latest;
  };

  const getFirstMeasurements = () => {
    const sorted = [...progress]
      .filter(p => p.chest_cm || p.waist_cm || p.hips_cm || p.arm_cm || p.thigh_cm)
      .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime());
    return sorted[0];
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    progress,
    loading,
    addProgress,
    deleteProgress,
    fetchProgress,
    getWeightHistory,
    getLatestMeasurements,
    getFirstMeasurements,
  };
};
