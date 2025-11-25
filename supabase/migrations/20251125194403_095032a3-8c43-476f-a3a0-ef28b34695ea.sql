
-- 1. Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Criar tabela de roles separada (segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Habilitar RLS na tabela de roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Criar função security definer para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Policies para user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Tabela de Progresso do Usuário
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg DECIMAL(5,2),
  chest_cm DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  hips_cm DECIMAL(5,2),
  arm_cm DECIMAL(5,2),
  thigh_cm DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, record_date)
);

-- 7. RLS para user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
ON public.user_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.user_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON public.user_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
ON public.user_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 8. Admins podem ver progresso de todos (para analytics)
CREATE POLICY "Admins can view all progress"
ON public.user_progress
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. Policies para admins gerenciarem exercise_library
CREATE POLICY "Admins can insert exercises"
ON public.exercise_library
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update exercises"
ON public.exercise_library
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete exercises"
ON public.exercise_library
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 10. Admins podem gerenciar missing_exercises_log
CREATE POLICY "Admins can view missing exercises"
ON public.missing_exercises_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update missing exercises"
ON public.missing_exercises_log
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete missing exercises"
ON public.missing_exercises_log
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 11. Admins podem ver todos os profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
