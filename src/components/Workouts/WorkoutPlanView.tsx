import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Target, Calendar, Play, Info, AlertCircle, Lightbulb, Edit2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkoutPlanViewProps {
  plano: any;
}

export default function WorkoutPlanView({ plano }: WorkoutPlanViewProps) {
  const navigate = useNavigate();
  const [treinoAtivo, setTreinoAtivo] = useState('A');
  const [exercicioEmVideo, setExercicioEmVideo] = useState<any>(null);
  const [showTechnique, setShowTechnique] = useState<Record<number, boolean>>({});

  const toggleTechnique = (ordem: number) => {
    setShowTechnique(prev => ({ ...prev, [ordem]: !prev[ordem] }));
  };

  const treinoAtual = plano.treinos.find((t: any) => t.id === treinoAtivo);

  return (
    <div className="space-y-6">
      {/* Header do Plano */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-3">Seu Plano de Treino Personalizado</h1>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-purple-600">{plano.resumo.biotipo}</Badge>
              <Badge className="bg-blue-600">{plano.resumo.objetivo}</Badge>
              <Badge className="bg-cyan-600">{plano.resumo.divisao}</Badge>
              <Badge variant="outline">{plano.resumo.frequenciaSemanal}</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/workouts/setup')}>
            <Edit2 size={18} />
            Ajustar Plano
          </Button>
        </div>
      </Card>

      {/* Tabs dos Treinos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {plano.treinos.map((treino: any) => (
          <Card
            key={treino.id}
            className={`p-4 cursor-pointer transition-all hover:scale-105 ${
              treinoAtivo === treino.id
                ? treino.tipo === 'superior'
                  ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : 'border-border/50'
            }`}
            onClick={() => setTreinoAtivo(treino.id)}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">
                {treino.tipo === 'superior' ? '💪' : '🦵'}
              </div>
              <div className="font-bold text-lg mb-1">Treino {treino.id}</div>
              <div className="text-xs text-muted-foreground">{treino.foco.join(', ')}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Conteúdo do Treino Ativo */}
      {treinoAtual && (
        <div className="space-y-6">
          {/* Info do Treino */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">{treinoAtual.nome}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>{treinoAtual.duracaoEstimada} minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary" />
                <span>{treinoAtual.foco.join(' • ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>{treinoAtual.dia}</span>
              </div>
            </div>
          </Card>

          {/* Aquecimento */}
          <Card className="p-6 bg-orange-500/10 border-orange-500/20">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              🔥 Aquecimento
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{treinoAtual.aquecimento.descricao}</p>
            <div className="flex flex-wrap gap-2">
              {treinoAtual.aquecimento.exercicios.map((ex: string, idx: number) => (
                <Badge key={idx} variant="outline">{ex}</Badge>
              ))}
            </div>
          </Card>

          {/* Lista de Exercícios */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Exercícios Principais</h3>
            {treinoAtual.exercicios.map((exercicio: any) => (
              <Card key={exercicio.ordem} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold shrink-0">
                    {exercicio.ordem}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2">{exercicio.nome}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exercicio.gruposMusculares.map((musculo: string) => (
                        <Badge key={musculo} variant="secondary">{musculo}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setExercicioEmVideo(exercicio)}
                    className="bg-gradient-to-r from-pink-600 to-orange-600 shrink-0"
                  >
                    <Play size={16} />
                    Ver Demonstração
                  </Button>
                </div>

                {/* Parâmetros */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{exercicio.series}</div>
                    <div className="text-xs text-muted-foreground">Séries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{exercicio.repeticoes}</div>
                    <div className="text-xs text-muted-foreground">Repetições</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{exercicio.descanso}</div>
                    <div className="text-xs text-muted-foreground">Descanso</div>
                  </div>
                </div>

                {/* Carga Sugerida */}
                <div className="mb-4">
                  <span className="text-sm font-medium mb-2 block">Carga sugerida:</span>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="font-bold text-green-600 mb-1">Iniciante</div>
                      <div className="text-xs">{exercicio.cargaSugerida.iniciante}</div>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="font-bold text-blue-600 mb-1">Intermediário</div>
                      <div className="text-xs">{exercicio.cargaSugerida.intermediario}</div>
                    </div>
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="font-bold text-purple-600 mb-1">Avançado</div>
                      <div className="text-xs">{exercicio.cargaSugerida.avancado}</div>
                    </div>
                  </div>
                </div>

                {/* Técnica de Execução */}
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTechnique(exercicio.ordem)}
                    className="mb-2"
                  >
                    <Info size={16} />
                    Como executar
                  </Button>
                  {showTechnique[exercicio.ordem] && (
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground pl-4">
                      {exercicio.tecnicaExecucao.map((passo: string, idx: number) => (
                        <li key={idx}>{passo}</li>
                      ))}
                    </ol>
                  )}
                </div>

                {/* Observações */}
                {exercicio.observacoes && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{exercicio.observacoes}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Alongamento */}
          <Card className="p-6 bg-blue-500/10 border-blue-500/20">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              🧘 Alongamento Final ({treinoAtual.alongamento.duracao})
            </h3>
            <div className="flex flex-wrap gap-2">
              {treinoAtual.alongamento.exercicios.map((ex: string, idx: number) => (
                <Badge key={idx} variant="outline">{ex}</Badge>
              ))}
            </div>
          </Card>

          {/* Observações Gerais */}
          {treinoAtual.observacoesGerais && (
            <Card className="p-6 bg-purple-500/10 border-purple-500/20">
              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="text-purple-600 shrink-0 mt-1" />
                <p className="text-sm">{treinoAtual.observacoesGerais}</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Cronograma Sugerido */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">📅 Cronograma Semanal Sugerido</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-bold mb-2">4 dias/semana</h4>
            <p className="text-sm text-muted-foreground">{plano.cronogramaSugerido['4dias']}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-bold mb-2">5 dias/semana</h4>
            <p className="text-sm text-muted-foreground">{plano.cronogramaSugerido['5dias']}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-bold mb-2">6 dias/semana</h4>
            <p className="text-sm text-muted-foreground">{plano.cronogramaSugerido['6dias']}</p>
          </div>
        </div>
      </Card>

      {/* Dicas de Nutrição */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">🥗 Dicas de Nutrição para {plano.resumo.biotipo}</h3>
        <ul className="space-y-2">
          {plano.dicasNutricao.map((dica: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">{dica}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Modal de Demonstração */}
      <Dialog open={!!exercicioEmVideo} onOpenChange={() => setExercicioEmVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{exercicioEmVideo?.nome}</DialogTitle>
          </DialogHeader>
          {exercicioEmVideo && (
            <div className="space-y-4">
              {exercicioEmVideo.videoUrl ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={exercicioEmVideo.videoUrl}
                    title={`Demonstração: ${exercicioEmVideo.nome}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8 space-y-4">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-muted-foreground mb-4">Vídeo não disponível</p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercicioEmVideo.nome + ' execução correta')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      Buscar no YouTube
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {exercicioEmVideo.gruposMusculares.map((musculo: string) => (
                  <Badge key={musculo} variant="secondary">{musculo}</Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{exercicioEmVideo.series}</div>
                  <div className="text-xs text-muted-foreground">Séries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{exercicioEmVideo.repeticoes}</div>
                  <div className="text-xs text-muted-foreground">Repetições</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{exercicioEmVideo.descanso}</div>
                  <div className="text-xs text-muted-foreground">Descanso</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">Técnica de Execução:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {exercicioEmVideo.tecnicaExecucao.map((passo: string, idx: number) => (
                    <li key={idx}>{passo}</li>
                  ))}
                </ol>
              </div>
              
              {exercicioEmVideo.observacoes && (
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{exercicioEmVideo.observacoes}</span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}