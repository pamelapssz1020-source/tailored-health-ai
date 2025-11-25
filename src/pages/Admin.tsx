import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin, Exercise, MissingExercise } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Users,
  Dumbbell,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Check,
  Loader2,
  Search,
  Youtube,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const muscleGroups = [
  'Peito',
  'Costas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Pernas',
  'Core',
  'Cardio',
  'Full Body',
];

const difficulties = ['Iniciante', 'Intermediário', 'Avançado'];

const AdminPage = () => {
  const navigate = useNavigate();
  const {
    isAdmin,
    loading,
    users,
    exercises,
    missingExercises,
    fetchUsers,
    fetchExercises,
    fetchMissingExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    resolveMissingExercise,
  } = useAdmin();

  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [savingExercise, setSavingExercise] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    video_url: '',
    muscle_group: '',
    difficulty: 'Intermediário',
    description: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchExercises();
      fetchMissingExercises();
    }
  }, [isAdmin]);

  const resetForm = () => {
    setFormData({
      name: '',
      video_url: '',
      muscle_group: '',
      difficulty: 'Intermediário',
      description: '',
    });
    setEditingExercise(null);
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      video_url: exercise.video_url,
      muscle_group: exercise.muscle_group,
      difficulty: exercise.difficulty || 'Intermediário',
      description: exercise.description || '',
    });
    setExerciseModalOpen(true);
  };

  const openCreateFromMissing = (missing: MissingExercise) => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      name: missing.exercise_name,
    }));
    setExerciseModalOpen(true);
  };

  const handleSaveExercise = async () => {
    if (!formData.name || !formData.video_url || !formData.muscle_group) return;

    setSavingExercise(true);
    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, formData);
      } else {
        await addExercise(formData);
      }
      setExerciseModalOpen(false);
      resetForm();
    } finally {
      setSavingExercise(false);
    }
  };

  const handleResolveAndCreate = async (missing: MissingExercise) => {
    await resolveMissingExercise(missing.id);
    openCreateFromMissing(missing);
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.muscle_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/20 shadow-[0_0_25px_hsl(38,92%,50%,0.4)]">
            <Shield className="h-8 w-8 text-amber-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">Gerencie usuários, exercícios e configurações</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-amber-500/30 shadow-[0_0_20px_hsl(38,92%,50%,0.2)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="h-10 w-10 text-amber-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 shadow-[0_0_20px_hsl(38,92%,50%,0.2)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exercícios na Biblioteca</p>
                  <p className="text-3xl font-bold">{exercises.length}</p>
                </div>
                <Dumbbell className="h-10 w-10 text-amber-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 shadow-[0_0_20px_hsl(0,84%,60%,0.2)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exercícios Faltantes</p>
                  <p className="text-3xl font-bold text-destructive">{missingExercises.length}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-destructive/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="exercises" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="users" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="exercises" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Dumbbell className="h-4 w-4 mr-2" />
              Exercícios
            </TabsTrigger>
            <TabsTrigger value="missing" className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Faltantes ({missingExercises.length})
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-500" />
                  Gerenciamento de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Nome</TableHead>
                      <TableHead className="text-muted-foreground">Telefone</TableHead>
                      <TableHead className="text-muted-foreground">Gênero</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-border/30">
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.phone_number}</TableCell>
                        <TableCell>{user.gender || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(parseISO(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises">
            <Card className="border-amber-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-amber-500" />
                  Biblioteca de Exercícios
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar exercício..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64 bg-muted/50"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      resetForm();
                      setExerciseModalOpen(true);
                    }}
                    className="gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950"
                  >
                    <Plus className="h-4 w-4" />
                    Novo Exercício
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Nome</TableHead>
                      <TableHead className="text-muted-foreground">Grupo Muscular</TableHead>
                      <TableHead className="text-muted-foreground">Dificuldade</TableHead>
                      <TableHead className="text-muted-foreground">Vídeo</TableHead>
                      <TableHead className="text-muted-foreground text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id} className="border-border/30">
                        <TableCell className="font-medium">{exercise.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{exercise.muscle_group}</Badge>
                        </TableCell>
                        <TableCell>{exercise.difficulty || '-'}</TableCell>
                        <TableCell>
                          <a
                            href={exercise.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-secondary/80 flex items-center gap-1"
                          >
                            <Youtube className="h-4 w-4" />
                            Ver
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(exercise)}
                              className="hover:text-amber-500"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteExercise(exercise.id)}
                              className="hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missing Exercises Tab */}
          <TabsContent value="missing">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Exercícios Faltantes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Exercícios que a IA tentou usar mas não encontrou na biblioteca
                </p>
              </CardHeader>
              <CardContent>
                {missingExercises.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Check className="h-12 w-12 mx-auto mb-4 text-neon-cyan" />
                    <p>Nenhum exercício faltante!</p>
                    <p className="text-sm">Todos os exercícios estão na biblioteca.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Nome do Exercício</TableHead>
                        <TableHead className="text-muted-foreground">Solicitado em</TableHead>
                        <TableHead className="text-muted-foreground text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {missingExercises.map((missing) => (
                        <TableRow key={missing.id} className="border-border/30">
                          <TableCell className="font-medium">{missing.exercise_name}</TableCell>
                          <TableCell>
                            {missing.requested_at
                              ? format(parseISO(missing.requested_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => handleResolveAndCreate(missing)}
                              className="gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950"
                            >
                              <Plus className="h-4 w-4" />
                              Resolver e Criar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Exercise Modal */}
        <Dialog open={exerciseModalOpen} onOpenChange={setExerciseModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-card border-amber-500/30">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-amber-500" />
                {editingExercise ? 'Editar Exercício' : 'Novo Exercício'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Exercício *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Supino Reto"
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label>URL do Vídeo (YouTube Embed) *</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Use o formato: https://www.youtube.com/embed/ID_DO_VIDEO
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grupo Muscular *</Label>
                  <Select
                    value={formData.muscle_group}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, muscle_group: value }))}
                  >
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dificuldade</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Instruções de execução do exercício..."
                  className="bg-muted/50 resize-none"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSaveExercise}
                disabled={savingExercise || !formData.name || !formData.video_url || !formData.muscle_group}
                className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950"
              >
                {savingExercise ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {editingExercise ? 'Salvar Alterações' : 'Criar Exercício'}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPage;
