-- Tabela principal de exercícios
CREATE TABLE public.exercise_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  video_url TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Intermediário',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de logs para exercícios não encontrados
CREATE TABLE public.missing_exercises_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_name TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved BOOLEAN DEFAULT false
);

-- RLS para exercise_library (leitura pública)
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.exercise_library FOR SELECT USING (true);

-- RLS para missing_exercises_log (inserção pública, leitura admin)
ALTER TABLE public.missing_exercises_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert access" ON public.missing_exercises_log FOR INSERT WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_exercise_library_name ON public.exercise_library(name);
CREATE INDEX idx_exercise_library_muscle_group ON public.exercise_library(muscle_group);

-- SEED DATA: 50+ exercícios com vídeos reais do YouTube
INSERT INTO public.exercise_library (name, video_url, muscle_group, difficulty, description) VALUES
-- PEITO (8 exercícios)
('Supino Reto com Barra', 'https://www.youtube.com/embed/rT7DgCr-3pg', 'Peito', 'Intermediário', 'Deite no banco, segure a barra na largura dos ombros, desça até o peito e empurre.'),
('Supino Inclinado com Halteres', 'https://www.youtube.com/embed/8iPEnn-ltC8', 'Peito', 'Intermediário', 'Banco inclinado a 30-45°, desça os halteres até a altura do peito.'),
('Supino Declinado', 'https://www.youtube.com/embed/LfyQBUKR8SE', 'Peito', 'Intermediário', 'Foco na parte inferior do peitoral.'),
('Crucifixo com Halteres', 'https://www.youtube.com/embed/eozdVDA78K0', 'Peito', 'Iniciante', 'Braços levemente flexionados, abra até sentir alongamento no peito.'),
('Crossover na Polia', 'https://www.youtube.com/embed/taI4XduLpTk', 'Peito', 'Intermediário', 'Cruze os cabos à frente do corpo mantendo leve flexão nos cotovelos.'),
('Flexão de Braços', 'https://www.youtube.com/embed/IODxDxX7oi4', 'Peito', 'Iniciante', 'Mãos na largura dos ombros, desça até o peito quase tocar o chão.'),
('Flexão Diamante', 'https://www.youtube.com/embed/J0DnG1_S92I', 'Peito', 'Avançado', 'Mãos juntas formando um diamante, foco no tríceps e peitoral interno.'),
('Peck Deck', 'https://www.youtube.com/embed/Oy7gTfCJaAM', 'Peito', 'Iniciante', 'Mantenha os cotovelos alinhados com os ombros.'),

-- COSTAS (8 exercícios)
('Puxada Frontal', 'https://www.youtube.com/embed/CAwf7n6Luuc', 'Costas', 'Iniciante', 'Puxe a barra até a altura do queixo, contraia as escápulas.'),
('Puxada Supinada', 'https://www.youtube.com/embed/hNuFXMYU0IQ', 'Costas', 'Intermediário', 'Pegada invertida para maior ativação do bíceps.'),
('Remada Curvada', 'https://www.youtube.com/embed/FWJR5Ve8bnQ', 'Costas', 'Intermediário', 'Costas retas, puxe a barra até o abdômen.'),
('Remada Unilateral', 'https://www.youtube.com/embed/pYcpY20QaE8', 'Costas', 'Iniciante', 'Um joelho no banco, puxe o halter até a cintura.'),
('Remada Cavalinho', 'https://www.youtube.com/embed/GZbfZ033f74', 'Costas', 'Intermediário', 'Máquina T-Bar, foco na contração das costas.'),
('Pullover', 'https://www.youtube.com/embed/FK4rHfWKEac', 'Costas', 'Intermediário', 'Deite no banco, leve o halter atrás da cabeça e retorne.'),
('Barra Fixa', 'https://www.youtube.com/embed/eGo4IYlbE5g', 'Costas', 'Avançado', 'Puxe o corpo até o queixo passar da barra.'),
('Remada Baixa no Cabo', 'https://www.youtube.com/embed/GZbfZ033f74', 'Costas', 'Iniciante', 'Sentado, puxe o cabo até o abdômen.'),

-- PERNAS (10 exercícios)
('Agachamento Livre', 'https://www.youtube.com/embed/ultWZbUMPL8', 'Pernas', 'Intermediário', 'Pés na largura dos ombros, desça até as coxas ficarem paralelas ao chão.'),
('Agachamento no Smith', 'https://www.youtube.com/embed/IGvxbFinWxw', 'Pernas', 'Iniciante', 'Máquina Smith para maior estabilidade.'),
('Leg Press 45°', 'https://www.youtube.com/embed/IZxyjW7MPJQ', 'Pernas', 'Iniciante', 'Não trave os joelhos no topo do movimento.'),
('Cadeira Extensora', 'https://www.youtube.com/embed/YyvSfVjQeL0', 'Pernas', 'Iniciante', 'Isole o quadríceps, contraia no topo.'),
('Mesa Flexora', 'https://www.youtube.com/embed/1Tq3QdYUuHs', 'Pernas', 'Iniciante', 'Foco nos isquiotibiais, movimento controlado.'),
('Stiff', 'https://www.youtube.com/embed/1uDiW5--rAE', 'Pernas', 'Intermediário', 'Pernas semi-estendidas, foco no posterior de coxa.'),
('Afundo', 'https://www.youtube.com/embed/QOVaHwm-Q6U', 'Pernas', 'Intermediário', 'Passo à frente, joelho de trás quase toca o chão.'),
('Elevação de Panturrilha', 'https://www.youtube.com/embed/gwLzBJYoWlI', 'Pernas', 'Iniciante', 'Suba na ponta dos pés, contraia a panturrilha.'),
('Agachamento Sumô', 'https://www.youtube.com/embed/9ZuXKqRbT9k', 'Pernas', 'Intermediário', 'Pés afastados, pontas para fora, foco nos adutores.'),
('Hack Squat', 'https://www.youtube.com/embed/0tn5K9NlCfo', 'Pernas', 'Intermediário', 'Máquina hack, costas apoiadas.'),

-- OMBROS (8 exercícios)
('Desenvolvimento com Halteres', 'https://www.youtube.com/embed/qEwKCR5JCog', 'Ombros', 'Intermediário', 'Sentado ou em pé, empurre os halteres acima da cabeça.'),
('Desenvolvimento Militar', 'https://www.youtube.com/embed/2yjwXTZQDDI', 'Ombros', 'Avançado', 'Com barra, empurre do peito até acima da cabeça.'),
('Elevação Lateral', 'https://www.youtube.com/embed/3VcKaXpzqRo', 'Ombros', 'Iniciante', 'Braços levemente flexionados, eleve até a altura dos ombros.'),
('Elevação Frontal', 'https://www.youtube.com/embed/-t7fuZ0KhDA', 'Ombros', 'Iniciante', 'Eleve os halteres à frente até a altura dos olhos.'),
('Crucifixo Inverso', 'https://www.youtube.com/embed/lPt0GqwaqEw', 'Ombros', 'Intermediário', 'Foco no deltóide posterior.'),
('Encolhimento de Ombros', 'https://www.youtube.com/embed/cJRVVxmytaM', 'Ombros', 'Iniciante', 'Eleve os ombros em direção às orelhas, foco no trapézio.'),
('Arnold Press', 'https://www.youtube.com/embed/6Z15_WdXmVw', 'Ombros', 'Avançado', 'Rotação durante o movimento para maior ativação.'),
('Face Pull', 'https://www.youtube.com/embed/rep-qVOkqgk', 'Ombros', 'Intermediário', 'Puxe o cabo em direção ao rosto, cotovelos altos.'),

-- BÍCEPS (6 exercícios)
('Rosca Direta', 'https://www.youtube.com/embed/ykJmrZ5v0Oo', 'Bíceps', 'Iniciante', 'Cotovelos fixos ao lado do corpo, flexione até o ombro.'),
('Rosca Alternada', 'https://www.youtube.com/embed/sAq_ocpRh_I', 'Bíceps', 'Iniciante', 'Alterne os braços, gire o punho no topo.'),
('Rosca Martelo', 'https://www.youtube.com/embed/zC3nLlEvin4', 'Bíceps', 'Iniciante', 'Pegada neutra, foco no braquial.'),
('Rosca Scott', 'https://www.youtube.com/embed/soxrZlIl35U', 'Bíceps', 'Intermediário', 'Apoie os braços no banco Scott, isole o bíceps.'),
('Rosca Concentrada', 'https://www.youtube.com/embed/0AUGkch3tzc', 'Bíceps', 'Intermediário', 'Sentado, cotovelo apoiado na coxa.'),
('Rosca no Cabo', 'https://www.youtube.com/embed/NFzTWp2qpiE', 'Bíceps', 'Iniciante', 'Tensão constante durante todo o movimento.'),

-- TRÍCEPS (6 exercícios)
('Tríceps Pulley', 'https://www.youtube.com/embed/2-LAMcpzODU', 'Tríceps', 'Iniciante', 'Cotovelos fixos, empurre a barra para baixo.'),
('Tríceps Testa', 'https://www.youtube.com/embed/d_KZxkY_0cM', 'Tríceps', 'Intermediário', 'Deite no banco, desça a barra até a testa.'),
('Tríceps Francês', 'https://www.youtube.com/embed/YbX7Wd8jQ-Q', 'Tríceps', 'Intermediário', 'Sentado ou em pé, halter atrás da cabeça.'),
('Tríceps Coice', 'https://www.youtube.com/embed/6SS6K3lAwZ8', 'Tríceps', 'Iniciante', 'Inclinado, estenda o braço para trás.'),
('Mergulho no Banco', 'https://www.youtube.com/embed/6kALZikXxLc', 'Tríceps', 'Iniciante', 'Mãos no banco atrás, desça o corpo flexionando os cotovelos.'),
('Paralelas', 'https://www.youtube.com/embed/2z8JmcrW-As', 'Tríceps', 'Avançado', 'Corpo reto, desça até 90° nos cotovelos.'),

-- ABDÔMEN (6 exercícios)
('Abdominal Crunch', 'https://www.youtube.com/embed/Xyd_fa5zoEU', 'Abdômen', 'Iniciante', 'Eleve apenas os ombros do chão, contraia o abdômen.'),
('Prancha', 'https://www.youtube.com/embed/ASdvN_XEl_c', 'Abdômen', 'Iniciante', 'Mantenha o corpo reto, core contraído.'),
('Elevação de Pernas', 'https://www.youtube.com/embed/l4kQd9eWclE', 'Abdômen', 'Intermediário', 'Deitado, eleve as pernas até 90°.'),
('Abdominal Bicicleta', 'https://www.youtube.com/embed/9FGilxCbdz8', 'Abdômen', 'Intermediário', 'Alterne cotovelo ao joelho oposto.'),
('Russian Twist', 'https://www.youtube.com/embed/wkD8rjkodUI', 'Abdômen', 'Intermediário', 'Sentado, gire o tronco de um lado ao outro.'),
('Prancha Lateral', 'https://www.youtube.com/embed/K2VljzCC16g', 'Abdômen', 'Intermediário', 'Apoie-se em um antebraço, corpo em linha reta.');
