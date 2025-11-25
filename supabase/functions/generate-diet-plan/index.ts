import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Validar campos obrigatórios
    const requiredFields = ['objetivo', 'idade', 'pesoAtual', 'altura', 'nivelAtividade', 'numRefeicoes'];
    const missingFields = requiredFields.filter(field => !userProfile[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // CORREÇÃO: Determinar gênero do usuário (vindo do perfil ou formulário)
    const genero = userProfile.genero || userProfile.gender || 'masculino';
    const isMale = genero.toLowerCase().includes('masculino') || genero.toLowerCase() === 'male';
    
    console.log(`Calculando TMB para gênero: ${genero} (isMale: ${isMale})`);

    // Calcular TMB usando Mifflin-St Jeor (CORRIGIDO para gênero)
    const peso = parseFloat(userProfile.pesoAtual);
    const altura = parseFloat(userProfile.altura);
    const idade = parseFloat(userProfile.idade);
    
    const tmb = isMale 
      ? (10 * peso) + (6.25 * altura) - (5 * idade) + 5
      : (10 * peso) + (6.25 * altura) - (5 * idade) - 161;

    console.log(`TMB calculado: ${tmb} (Peso: ${peso}, Altura: ${altura}, Idade: ${idade})`);

    const activityMultipliers: Record<string, number> = {
      "Sedentário (trabalho sentado, pouco movimento)": 1.2,
      "Levemente Ativo (exercícios leves 1-2x/semana)": 1.375,
      "Moderadamente Ativo (exercícios 3-4x/semana)": 1.55,
      "Muito Ativo (exercícios intensos 5-6x/semana)": 1.725,
      "Extremamente Ativo (atleta, treina 2x/dia)": 1.9,
      // Aliases comuns
      "sedentario": 1.2,
      "leve": 1.375,
      "moderado": 1.55,
      "intenso": 1.725,
      "atleta": 1.9,
    };

    // Buscar multiplicador ou usar moderado como padrão
    let multiplier = 1.55;
    const nivelAtividade = userProfile.nivelAtividade?.toLowerCase() || '';
    for (const [key, value] of Object.entries(activityMultipliers)) {
      if (nivelAtividade.includes(key.toLowerCase()) || key.toLowerCase().includes(nivelAtividade)) {
        multiplier = value;
        break;
      }
    }

    const gastoTotal = tmb * multiplier;

    let caloriasMeta = gastoTotal;
    const objetivo = userProfile.objetivo?.toLowerCase() || '';
    if (objetivo.includes("emagrecer") || objetivo.includes("perder")) {
      caloriasMeta = gastoTotal - 500;
    } else if (objetivo.includes("ganhar") || objetivo.includes("massa") || objetivo.includes("hipertrofia")) {
      caloriasMeta = gastoTotal + 400;
    }

    console.log(`Gasto total: ${gastoTotal}, Meta calórica: ${caloriasMeta}`);

    const prompt = `Você é uma nutricionista esportiva brasileira expert. Crie um plano alimentar COMPLETO e PERSONALIZADO baseado nestas informações:

PERFIL DO USUÁRIO:
- Gênero: ${genero}
- Objetivo: ${userProfile.objetivo}
- Idade: ${idade} anos
- Peso atual: ${peso} kg
- Altura: ${altura} cm
${userProfile.pesoObjetivo ? `- Peso objetivo: ${userProfile.pesoObjetivo} kg` : ''}
- Nível de atividade: ${userProfile.nivelAtividade}
- Restrições alimentares: ${Array.isArray(userProfile.restricoes) ? userProfile.restricoes.join(', ') : userProfile.restricoes || 'Nenhuma'}
${userProfile.restricoesOutras ? `- Outras restrições: ${userProfile.restricoesOutras}` : ''}
- Alimentos favoritos: ${userProfile.alimentosAmados || userProfile.alimentosAma || 'Não informado'}
- Alimentos que evita: ${userProfile.alimentosOdiados || userProfile.alimentosOdeia || 'Não informado'}
- Número de refeições desejado: ${userProfile.numRefeicoes}
- Horário de acordar: ${userProfile.horarioAcordar || '07:00'}
- Horário de dormir: ${userProfile.horarioDormir || '22:00'}
${userProfile.preferenciasHorarios ? `- Preferências de horários: ${userProfile.preferenciasHorarios}` : ''}
${userProfile.condicoesSaude ? `- Condições de saúde: ${userProfile.condicoesSaude}` : ''}
- Tempo disponível para cozinhar: ${userProfile.tempoPreparacao || 'Não informado'}
${userProfile.suplementos ? `- Suplementos atuais: ${userProfile.suplementos}` : ''}

CÁLCULOS:
- TMB (Taxa Metabólica Basal): ${Math.round(tmb)} kcal
- Gasto Total Diário: ${Math.round(gastoTotal)} kcal
- Meta Calórica: ${Math.round(caloriasMeta)} kcal

INSTRUÇÕES OBRIGATÓRIAS:

1. DISTRIBUIÇÃO DE MACRONUTRIENTES:
   - Proteínas: 
     * Ganhar massa: 2.0-2.4g por kg de peso
     * Emagrecer: 1.8-2.2g por kg de peso
     * Manter: 1.6-2.0g por kg de peso
   - Gorduras: 0.8-1.0g por kg de peso (mínimo 20% das calorias)
   - Carboidratos: completar calorias restantes (4 kcal por grama)

2. CRIAR EXATAMENTE ${userProfile.numRefeicoes} REFEIÇÕES:
   - Distribuir ${Math.round(caloriasMeta)} calorias e macros proporcionalmente
   - CADA REFEIÇÃO DEVE TER:
     * Nome apropriado (Café da Manhã, Lanche da Manhã, Almoço, Lanche da Tarde, Jantar, Ceia)
     * Horário sugerido baseado na rotina do usuário
     * Lista COMPLETA de alimentos (mínimo 3-5 itens por refeição)
     * Quantidade PRECISA em GRAMAS de cada alimento
     * Calorias de cada alimento
     * Macros (proteínas, carboidratos, gorduras) de cada alimento
     * Total consolidado da refeição
     * Modo de preparo quando relevante

3. REGRAS IMPORTANTES:
   - SEMPRE incluir alimentos que o usuário ama
   - NUNCA incluir alimentos que ele odeia
   - Respeitar TODAS as restrições alimentares
   - Usar alimentos brasileiros comuns e acessíveis
   - Adequar complexidade ao tempo disponível
   - Considerar timing nutricional (carboidratos pré-treino, proteína pós-treino)
   - Incluir variedade de grupos alimentares
   - Balancear palatabilidade com resultados

4. RESPONDER APENAS EM JSON VÁLIDO (sem markdown, sem texto extra):

{
  "resumo": {
    "caloriasTotais": ${Math.round(caloriasMeta)},
    "proteinas": [calcular],
    "carboidratos": [calcular],
    "gorduras": [calcular],
    "tmb": ${Math.round(tmb)},
    "gastoTotal": ${Math.round(gastoTotal)}
  },
  "refeicoes": [
    {
      "nome": "Café da Manhã",
      "horario": "07:30",
      "emoji": "☕",
      "alimentos": [
        {
          "nome": "Pão Integral",
          "quantidade": 50,
          "unidade": "g",
          "calorias": 130,
          "proteinas": 5,
          "carboidratos": 24,
          "gorduras": 2
        }
      ],
      "totalCalorias": 490,
      "totalProteinas": 30,
      "totalCarboidratos": 39,
      "totalGorduras": 24,
      "observacoes": "Preparar com pouco azeite"
    }
  ],
  "dicas": [
    "Beba pelo menos 2-3 litros de água por dia",
    "Priorize alimentos integrais e naturais"
  ],
  "observacoes": "Este plano foi criado especificamente para seu objetivo."
}

IMPORTANTE: Responda APENAS o JSON, sem explicações ou markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Você é uma nutricionista esportiva brasileira expert em criar planos alimentares personalizados. Responda sempre em JSON válido, sem markdown ou texto adicional.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos em Settings -> Workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar plano alimentar" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let jsonText = data.choices[0].message.content;
    
    // Limpar markdown se presente
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const dietPlan = JSON.parse(jsonText);

    console.log('Plano alimentar gerado com sucesso');

    return new Response(JSON.stringify({ success: true, dietPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating diet plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});