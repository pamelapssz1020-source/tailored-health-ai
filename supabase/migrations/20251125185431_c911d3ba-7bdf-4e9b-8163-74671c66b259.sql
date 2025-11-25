-- Tabela para planos de dieta
CREATE TABLE public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  profile_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para planos de treino
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  biotipo TEXT,
  objetivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Políticas para diet_plans
CREATE POLICY "Users can view own diet plans" 
ON public.diet_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own diet plans" 
ON public.diet_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own diet plans" 
ON public.diet_plans FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para workout_plans
CREATE POLICY "Users can view own workout plans" 
ON public.workout_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workout plans" 
ON public.workout_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout plans" 
ON public.workout_plans FOR DELETE 
USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_diet_plans_user_id ON public.diet_plans(user_id);
CREATE INDEX idx_diet_plans_created_at ON public.diet_plans(created_at DESC);
CREATE INDEX idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX idx_workout_plans_created_at ON public.workout_plans(created_at DESC);