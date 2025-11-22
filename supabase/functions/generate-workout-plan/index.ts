import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { biotipo, objetivo, nivel, diasTreino, tempo, equipamentos, limitacoes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    // Validar campos obrigatórios
    if (!biotipo || !objetivo || !nivel || !diasTreino || !tempo) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios faltando" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Você é um personal trainer expert em criar treinos personalizados baseados em biotipo corporal.

PERFIL DO ALUNO:
- Biotipo: ${biotipo}
- Objetivo: ${objetivo}
- Nível: ${nivel}
- Dias de treino disponíveis: ${diasTreino}
- Tempo por sessão: ${tempo} minutos
- Equipamentos: ${equipamentos?.join(', ') || 'Academia completa'}
${limitacoes ? `- Limitações: ${limitacoes}` : ''}

INSTRUÇÕES ESPECÍFICAS POR BIOTIPO:

${biotipo === 'ectomorfo' ? `
ECTOMORFO (difícil ganhar massa):
- Foco em exercícios compostos e básicos
- Menor volume, maior intensidade
- Séries de 6-10 repetições
- Descanso maior entre séries (2-3 min)
- Menos cardio, mais musculação
- Priorizar cargas progressivas
` : ''}

${biotipo === 'mesomorfo' ? `
MESOMORFO (corpo atlético natural):
- Mix de exercícios compostos e isoladores
- Volume moderado a alto
- Séries de 8-12 repetições
- Descanso médio (1-2 min)
- Pode incluir cardio moderado
- Variedade de técnicas de treino
` : ''}

${biotipo === 'endomorfo' ? `
ENDOMORFO (facilidade em ganhar peso):
- Alto volume de treino
- Superseries e circuitos
- Séries de 12-15 repetições
- Descanso curto (30-60s)
- Mais cardio integrado
- Foco em queima calórica
- Treinos metabólicos
` : ''}

OBJETIVO ESPECÍFICO - ${objetivo}:
${getObjetivoInstructions(objetivo)}

ESTRUTURA OBRIGATÓRIA:
Crie EXATAMENTE 4 TREINOS:
- Treino A: Membros Superiores (peito, ombros, tríceps)
- Treino B: Membros Inferiores (quadríceps, glúteos, panturrilhas)
- Treino C: Membros Superiores (costas, bíceps, antebraços)
- Treino D: Membros Inferiores (posteriores de coxa, glúteos, abdômen)

CADA TREINO DEVE TER:
- Nome do treino
- Foco muscular
- Aquecimento (5-10 min)
- 6-8 exercícios principais com TODOS os campos
- Alongamento final (5 min)
- Tempo total estimado

FORMATO JSON EXATO:
{
  "resumo": {
    "biotipo": "${biotipo}",
    "objetivo": "${objetivo}",
    "frequenciaSemanal": "${diasTreino} dias",
    "divisao": "ABCD (2 superiores + 2 inferiores)",
    "duracao": "${tempo} min por treino"
  },
  "treinos": [
    {
      "id": "A",
      "nome": "Treino A - Superior (Peito/Ombros/Tríceps)",
      "dia": "Segunda ou Quinta",
      "tipo": "superior",
      "foco": ["Peitoral", "Ombros", "Tríceps"],
      "duracaoEstimada": ${tempo},
      "aquecimento": {
        "descricao": "5 min de cardio leve + mobilidade articular",
        "exercicios": ["Polichinelos", "Rotação de ombros", "Alongamento dinâmico"]
      },
      "exercicios": [
        {
          "ordem": 1,
          "nome": "Supino Reto com Barra",
          "gruposMusculares": ["Peitoral", "Tríceps", "Ombros"],
          "series": 4,
          "repeticoes": "8-10",
          "descanso": "90s",
          "cargaSugerida": {
            "iniciante": "Barra + 5-10kg cada lado",
            "intermediario": "Barra + 15-20kg cada lado",
            "avancado": "Barra + 25kg+ cada lado"
          },
          "observacoes": "Manter escápulas retraídas, descer até tocar o peito",
          "imagemUrl": "",
          "tecnicaExecucao": [
            "Deitar no banco com pés firmes no chão",
            "Pegar a barra com pegada média",
            "Descer controladamente até o peito",
            "Empurrar explosivamente para cima"
          ]
        }
      ],
      "alongamento": {
        "duracao": "5 min",
        "exercicios": ["Alongamento de peito", "Alongamento de tríceps", "Alongamento de ombros"]
      },
      "observacoesGerais": "Priorize a técnica sobre a carga"
    }
  ],
  "cronogramaSugerido": {
    "4dias": "Seg(A), Ter(B), Qui(C), Sex(D)",
    "5dias": "Seg(A), Ter(B), Qua(C), Qui(D), Sex(A)",
    "6dias": "Seg(A), Ter(B), Qua(C), Qui(D), Sex(A), Sáb(B)"
  },
  "dicasNutricao": [
    "Dica 1 específica para ${biotipo}",
    "Dica 2",
    "Dica 3"
  ],
  "progressaoSugerida": "Como progredir semanalmente"
}

IMPORTANTE:
- O campo imagemUrl deve ficar vazio, será preenchido depois
- Seja específico nas cargas sugeridas
- Adapte volume/intensidade ao biotipo
- Inclua 6-8 exercícios por treino

Responda APENAS com o JSON válido, sem markdown.`;

    console.log('Chamando Lovable AI para gerar plano de treino...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da Lovable AI:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Resposta vazia da IA");
    }

    console.log('Resposta recebida, processando JSON...');

    // Limpar a resposta para garantir JSON válido
    let jsonText = content.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const planoTreino = JSON.parse(jsonText);

    console.log('Plano de treino gerado, iniciando geração de imagens...');

    // Gerar imagens demonstrativas para cada exercício
    for (const treino of planoTreino.treinos) {
      for (const exercicio of treino.exercicios) {
        try {
          const imagePrompt = `Professional fitness demonstration photo: Athletic person performing "${exercicio.nome}" exercise in a modern gym. Clear form demonstration, proper technique visible, professional gym lighting, high quality instructional photo, side or front view showing complete movement form. Realistic, photographic style.`;
          
          console.log(`Gerando imagem para: ${exercicio.nome}`);
          
          const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash-image',
              messages: [
                {
                  role: 'user',
                  content: imagePrompt
                }
              ],
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            if (imageData.choices && imageData.choices[0] && imageData.choices[0].message) {
              const imageContent = imageData.choices[0].message.content;
              // O modelo retorna a URL da imagem gerada ou a própria imagem em base64
              exercicio.imagemUrl = imageContent;
              console.log(`✓ Imagem gerada para ${exercicio.nome}`);
            }
          } else {
            console.log(`✗ Falha ao gerar imagem para ${exercicio.nome}`);
            exercicio.imagemUrl = '';
          }
        } catch (error) {
          console.error(`Erro ao gerar imagem para ${exercicio.nome}:`, error);
          exercicio.imagemUrl = '';
        }
      }
    }

    console.log('Plano de treino completo gerado com sucesso');

    return new Response(
      JSON.stringify({ plano: planoTreino }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro ao gerar plano de treino:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function getObjetivoInstructions(objetivo: string): string {
  const instructions: Record<string, string> = {
    hipertrofia: `
      - Volume alto (3-4 séries por exercício)
      - Rep range: 8-12 repetições
      - Tempo sob tensão: 40-60s por série
      - Descanso: 60-90s
      - Progressão de carga semanal
    `,
    emagrecimento: `
      - Volume muito alto com superseries
      - Rep range: 12-15 repetições
      - Descanso curto: 30-45s
      - Incluir cardio metabólico
      - Circuitos quando possível
    `,
    definicao: `
      - Volume alto, intensidade moderada-alta
      - Rep range: 10-15 repetições
      - Mix de pesos e cardio
      - Superseries e dropsets
    `,
    condicionamento: `
      - Circuitos funcionais
      - Rep range variado
      - Descanso mínimo
      - Exercícios compostos
    `,
    forca: `
      - Volume baixo, intensidade máxima
      - Rep range: 3-6 repetições
      - Descanso longo: 3-5 min
      - Foco em básicos (squat, bench, deadlift)
    `,
    manutencao: `
      - Volume e intensidade moderados
      - Rep range: 8-12
      - Variedade de exercícios
      - Foco em consistência
    `
  };
  
  return instructions[objetivo] || instructions.manutencao;
}
