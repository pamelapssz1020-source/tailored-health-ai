import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { faseAtual, config, userProfile } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const prompt = `Você é uma amiga próxima e acolhedora conversando com uma mulher sobre seu ciclo menstrual. Seja empática, carinhosa e informativa.

CONTEXTO:
- Fase atual: ${faseAtual.nomeFase}
- Dia ${faseAtual.diaFase} de ${faseAtual.totalDiasFase} dias da fase
- Próxima fase: ${faseAtual.proximaFase}
- Sintomas comuns da usuária: ${config.sintomas?.join(', ') || 'Não informado'}
- Objetivo fitness: ${userProfile?.objetivo || 'Não informado'}
- Nível de atividade: ${userProfile?.nivelAtividade || 'Não informado'}

INSTRUÇÕES:
1. Escreva UMA mensagem amigável e pessoal (2-3 frases curtas)
2. Use tom de amiga próxima, não de profissional médica
3. Inclua um emoji relevante
4. Mencione como ela pode estar se sentindo hoje
5. Dê uma dica prática sobre treino, alimentação ou autocuidado
6. Seja encorajadora e positiva

EXEMPLOS DO TOM:

Menstruação:
"Oi linda! 🌸 Sei que hoje pode estar mais cansativo, então vai com calma. Que tal um treino leve ou apenas alongamentos? E não esquece de beber bastante água - ajuda com o inchaço!"

Folicular:
"Bom dia, poderosa! ✨ Você está na fase mais energética do mês! É o momento perfeito para intensificar os treinos e arriscar aquele exercício novo. Seu corpo está preparado!"

Ovulatória:
"Hey! 💫 Você está radiante hoje! Fase de ovulação = energia no máximo. Aproveita para treinar pesado, mas lembra de comer bem para sustentar essa potência toda."

Lútea:
"Oi, querida! 🌙 Essa semana pode vir aquela vontade de chocolate (eu entendo!). Tá tudo bem se render um pouquinho. Foca em treinos moderados e não se cobre tanto, ok?"

Responda APENAS a mensagem, sem explicações ou formatação extra.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API:', response.status, errorText);
      throw new Error(`Erro ao gerar mensagem: ${response.status}`);
    }

    const data = await response.json();
    const mensagem = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ mensagem }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
