import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExerciseData {
  id: string;
  name: string;
  video_url: string;
  muscle_group: string;
  difficulty: string;
  description: string | null;
}

// Cache local para evitar múltiplas requisições
const exerciseCache = new Map<string, ExerciseData | null>();

export function useExerciseLibrary() {
  
  // Busca um exercício pelo nome (com correspondência parcial)
  const findExercise = useCallback(async (exerciseName: string): Promise<ExerciseData | null> => {
    const normalizedName = exerciseName.toLowerCase().trim();
    
    // Verificar cache primeiro
    if (exerciseCache.has(normalizedName)) {
      return exerciseCache.get(normalizedName) || null;
    }
    
    try {
      // Busca exata primeiro
      let { data, error } = await supabase
        .from('exercise_library')
        .select('*')
        .ilike('name', normalizedName)
        .limit(1)
        .single();
      
      // Se não encontrar exato, buscar parcial
      if (error || !data) {
        const { data: partialData } = await supabase
          .from('exercise_library')
          .select('*')
          .ilike('name', `%${normalizedName.split(' ')[0]}%`)
          .limit(1)
          .single();
        
        data = partialData;
      }
      
      exerciseCache.set(normalizedName, data || null);
      
      // Se não encontrou, logar como exercício faltante
      if (!data) {
        await logMissingExercise(exerciseName);
      }
      
      return data || null;
    } catch (err) {
      console.error('Erro ao buscar exercício:', err);
      return null;
    }
  }, []);

  // Buscar URL do vídeo para um exercício
  const getVideoUrl = useCallback(async (exerciseName: string): Promise<string> => {
    const exercise = await findExercise(exerciseName);
    
    if (exercise?.video_url) {
      // Garantir formato correto com autoplay
      let url = exercise.video_url;
      if (!url.includes('?')) {
        url += '?autoplay=1&rel=0';
      } else if (!url.includes('autoplay')) {
        url += '&autoplay=1&rel=0';
      }
      return url;
    }
    
    // Fallback: busca genérica no YouTube
    return `https://www.youtube.com/embed/IODxDxX7oi4?autoplay=1&rel=0`;
  }, [findExercise]);

  // Buscar detalhes completos de um exercício
  const getExerciseDetails = useCallback(async (exerciseName: string) => {
    return await findExercise(exerciseName);
  }, [findExercise]);

  // Buscar todos os exercícios de um grupo muscular
  const getExercisesByMuscleGroup = useCallback(async (muscleGroup: string): Promise<ExerciseData[]> => {
    try {
      const { data, error } = await supabase
        .from('exercise_library')
        .select('*')
        .ilike('muscle_group', muscleGroup)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erro ao buscar exercícios por grupo:', err);
      return [];
    }
  }, []);

  // Buscar todos os exercícios
  const getAllExercises = useCallback(async (): Promise<ExerciseData[]> => {
    try {
      const { data, error } = await supabase
        .from('exercise_library')
        .select('*')
        .order('muscle_group')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erro ao buscar todos exercícios:', err);
      return [];
    }
  }, []);

  // Limpar cache
  const clearCache = useCallback(() => {
    exerciseCache.clear();
  }, []);

  return {
    findExercise,
    getVideoUrl,
    getExerciseDetails,
    getExercisesByMuscleGroup,
    getAllExercises,
    clearCache
  };
}

// Função auxiliar para logar exercícios não encontrados
async function logMissingExercise(exerciseName: string) {
  try {
    await supabase
      .from('missing_exercises_log')
      .insert({ exercise_name: exerciseName });
    console.log(`📝 Exercício não encontrado logado: ${exerciseName}`);
  } catch (err) {
    // Silenciar erro de log
  }
}
