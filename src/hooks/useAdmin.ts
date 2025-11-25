import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  gender: string | null;
  birth_date: string | null;
  status: string;
  created_at: string;
  last_login: string | null;
}

export interface Exercise {
  id: string;
  name: string;
  video_url: string;
  muscle_group: string;
  difficulty: string | null;
  description: string | null;
  created_at: string | null;
}

export interface MissingExercise {
  id: string;
  exercise_name: string;
  requested_at: string | null;
  resolved: boolean | null;
}

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [missingExercises, setMissingExercises] = useState<MissingExercise[]>([]);
  const { toast } = useToast();

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return false;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      const adminStatus = !!data;
      setIsAdmin(adminStatus);
      setLoading(false);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setLoading(false);
      return false;
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercise_library')
        .select('*')
        .order('muscle_group', { ascending: true });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const fetchMissingExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('missing_exercises_log')
        .select('*')
        .eq('resolved', false)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setMissingExercises(data || []);
    } catch (error) {
      console.error('Error fetching missing exercises:', error);
    }
  };

  const addExercise = async (exercise: Omit<Exercise, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('exercise_library')
        .insert(exercise)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Exercício adicionado!",
        description: `${exercise.name} foi adicionado à biblioteca.`,
      });

      await fetchExercises();
      return data;
    } catch (error: any) {
      console.error('Error adding exercise:', error);
      toast({
        title: "Erro ao adicionar",
        description: error.message || "Não foi possível adicionar o exercício.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    try {
      const { error } = await supabase
        .from('exercise_library')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Exercício atualizado!",
        description: "As alterações foram salvas.",
      });

      await fetchExercises();
    } catch (error: any) {
      console.error('Error updating exercise:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o exercício.",
        variant: "destructive",
      });
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exercise_library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Exercício excluído",
        description: "O exercício foi removido da biblioteca.",
      });

      await fetchExercises();
    } catch (error: any) {
      console.error('Error deleting exercise:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o exercício.",
        variant: "destructive",
      });
    }
  };

  const resolveMissingExercise = async (id: string) => {
    try {
      const { error } = await supabase
        .from('missing_exercises_log')
        .update({ resolved: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Exercício resolvido!",
        description: "O log foi marcado como resolvido.",
      });

      await fetchMissingExercises();
    } catch (error: any) {
      console.error('Error resolving missing exercise:', error);
      toast({
        title: "Erro ao resolver",
        description: error.message || "Não foi possível marcar como resolvido.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  return {
    isAdmin,
    loading,
    users,
    exercises,
    missingExercises,
    checkAdminStatus,
    fetchUsers,
    fetchExercises,
    fetchMissingExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    resolveMissingExercise,
  };
};
