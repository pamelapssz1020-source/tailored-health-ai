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
    const { imageData } = await req.json();
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: "Imagem não fornecida" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    console.log('🔍 Analisando imagem com Gemini 2.5 Pro Vision...');

    // Remove data URL prefix if present
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Você é uma IA especialista em Nutrição e Visão Computacional Avançada. Analise esta imagem com precisão forense. Identifique o alimento baseando-se em textura, cor, formato e imperfeições.

1. Identifique o nome EXATO do alimento (ex: 'Maracujá Azedo' em vez de apenas 'Fruta')
2. Estime o peso aproximado visualmente em gramas
3. Forneça a tabela nutricional completa para a porção estimada
4. Se houver múltiplos alimentos, liste todos
5. Se houver dúvida, liste as 3 possibilidades mais prováveis com suas respectivas probabilidades

Retorne APENAS um JSON válido neste formato exato:
{
  "food_name": "Nome exato do alimento",
  "confidence": 0.98,
  "estimated_weight_g": 120,
  "calories_total": 116,
  "macros": {
    "carbs_g": 28,
    "protein_g": 2.6,
    "fat_g": 0.8,
    "fiber_g": 10,
    "sugar_g": 20
  },
  "micronutrients": ["Vitamina C", "Ferro", "Vitamina A"],
  "description": "Descrição detalhada do alimento e seu estado visual",
  "alternatives": [
    {"name": "Alternativa 1", "probability": 0.85},
    {"name": "Alternativa 2", "probability": 0.75}
  ]
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de taxa excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione mais créditos ao seu workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Erro da API:', response.status, errorText);
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Resposta recebida da IA');

    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da IA');
    }

    // Parse JSON from response
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanContent);
      console.log('📊 Análise completa:', JSON.stringify(analysisResult, null, 2));
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', parseError);
      console.error('Conteúdo recebido:', content);
      throw new Error('Formato de resposta inválido da IA');
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erro na análise de imagem:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao analisar imagem'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
