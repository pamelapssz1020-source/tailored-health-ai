export interface CycleConfig {
  ultimaMenstruacao: string;
  duracaoCiclo: number;
  duracaoMenstruacao: number;
  regularidade: string;
  sintomas: string[];
  outrosSintomas?: string;
  insightsEnabled: boolean;
  lembretes?: boolean;
  adaptarTreinos?: boolean;
  configuradoEm: string;
}

export interface PhaseInfo {
  fase: 'menstruacao' | 'folicular' | 'ovulatoria' | 'lutea';
  nomeFase: string;
  emoji: string;
  cor: string;
  diaFase: number;
  totalDiasFase: number;
  proximaFase: string;
}

export function calcularFaseAtual(config: CycleConfig): PhaseInfo {
  const ultimaMenstruacao = new Date(config.ultimaMenstruacao);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  ultimaMenstruacao.setHours(0, 0, 0, 0);
  
  const diasDesdeMenstruacao = Math.floor((hoje.getTime() - ultimaMenstruacao.getTime()) / (1000 * 60 * 60 * 24));
  const diaAtualDoCiclo = diasDesdeMenstruacao % config.duracaoCiclo;
  
  // Fase 1: Menstruação
  if (diaAtualDoCiclo >= 0 && diaAtualDoCiclo < config.duracaoMenstruacao) {
    return {
      fase: 'menstruacao',
      nomeFase: 'Menstruação',
      emoji: '🩸',
      cor: '#FF4B6E',
      diaFase: diaAtualDoCiclo + 1,
      totalDiasFase: config.duracaoMenstruacao,
      proximaFase: 'Folicular'
    };
  }
  
  // Fase 2: Folicular
  if (diaAtualDoCiclo >= config.duracaoMenstruacao && diaAtualDoCiclo < 13) {
    return {
      fase: 'folicular',
      nomeFase: 'Fase Folicular',
      emoji: '🌱',
      cor: '#4CAF50',
      diaFase: diaAtualDoCiclo - config.duracaoMenstruacao + 1,
      totalDiasFase: 13 - config.duracaoMenstruacao,
      proximaFase: 'Ovulatória'
    };
  }
  
  // Fase 3: Ovulatória
  if (diaAtualDoCiclo >= 13 && diaAtualDoCiclo < 16) {
    return {
      fase: 'ovulatoria',
      nomeFase: 'Ovulação',
      emoji: '✨',
      cor: '#FFD700',
      diaFase: diaAtualDoCiclo - 13 + 1,
      totalDiasFase: 3,
      proximaFase: 'Lútea'
    };
  }
  
  // Fase 4: Lútea
  return {
    fase: 'lutea',
    nomeFase: 'Fase Lútea',
    emoji: '🌙',
    cor: '#9C27B0',
    diaFase: diaAtualDoCiclo - 16 + 1,
    totalDiasFase: config.duracaoCiclo - 16,
    proximaFase: 'Menstruação'
  };
}

export function calcularProximaMenstruacao(config: CycleConfig) {
  const ultimaMenstruacao = new Date(config.ultimaMenstruacao);
  const proximaMenstruacao = new Date(ultimaMenstruacao);
  proximaMenstruacao.setDate(proximaMenstruacao.getDate() + config.duracaoCiclo);
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diasRestantes = Math.floor((proximaMenstruacao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    data: proximaMenstruacao,
    diasRestantes: diasRestantes
  };
}

export function gerarDiasDoCiclo(config: CycleConfig) {
  const ultimaMenstruacao = new Date(config.ultimaMenstruacao);
  const dias: Array<{
    data: Date;
    tipo: 'menstruacao' | 'ovulacao' | 'normal';
    diaAtual: boolean;
  }> = [];
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < config.duracaoCiclo; i++) {
    const data = new Date(ultimaMenstruacao);
    data.setDate(data.getDate() + i);
    
    let tipo: 'menstruacao' | 'ovulacao' | 'normal' = 'normal';
    
    if (i < config.duracaoMenstruacao) {
      tipo = 'menstruacao';
    } else if (i >= 13 && i < 16) {
      tipo = 'ovulacao';
    }
    
    dias.push({
      data,
      tipo,
      diaAtual: data.getTime() === hoje.getTime()
    });
  }
  
  return dias;
}

export const phaseRecommendations = {
  menstruacao: {
    treinos: ['Yoga suave', 'Alongamento', 'Caminhada leve'],
    intensidade: '40-60% do máximo',
    foco: 'Recuperação e mobilidade',
    nutricao: ['Alimentos ricos em ferro', 'Magnésio', 'Água em abundância']
  },
  folicular: {
    treinos: ['HIIT', 'Treino de força', 'Cardio intenso'],
    intensidade: '70-90% do máximo',
    foco: 'Hipertrofia e performance',
    nutricao: ['Proteínas magras', 'Carboidratos complexos', 'Vegetais verdes']
  },
  ovulatoria: {
    treinos: ['Máxima intensidade', 'Recordes pessoais', 'Treino pesado'],
    intensidade: '85-100% do máximo',
    foco: 'Performance máxima',
    nutricao: ['Antioxidantes', 'Frutas', 'Vitaminas']
  },
  lutea: {
    treinos: ['Moderados', 'Resistência', 'Pilates'],
    intensidade: '60-75% do máximo',
    foco: 'Manutenção e bem-estar',
    nutricao: ['Carboidratos saudáveis', 'Chocolate amargo', 'Alimentos que controlam ansiedade']
  }
};
