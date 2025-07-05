"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, AlertTriangle, Users, Target } from "lucide-react"
import type { Task } from "@/types/task"

interface TaskMetricsProps {
  tasks: Task[]
}

export default function TaskMetrics({ tasks }: TaskMetricsProps) {
  // Cálculos de métricas
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "concluido").length
  const inProgressTasks = tasks.filter((task) => task.status === "em-progresso").length
  const todoTasks = tasks.filter((task) => task.status === "a-fazer").length

  const highPriorityTasks = tasks.filter((task) => task.priority === "alta").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "media").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "baixa").length

  const overdueTasks = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "concluido",
  ).length

  const dueSoonTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "concluido") return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  }).length

  // Métricas por membro da equipe
  const teamMembers = ["João Silva", "Maria Santos", "Pedro Costa"]
  const teamMetrics = teamMembers.map((member) => {
    const memberTasks = tasks.filter((task) => task.assignee === member)
    const memberCompleted = memberTasks.filter((task) => task.status === "concluido").length
    const memberInProgress = memberTasks.filter((task) => task.status === "em-progresso").length
    const memberOverdue = memberTasks.filter(
      (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "concluido",
    ).length

    return {
      name: member,
      total: memberTasks.length,
      completed: memberCompleted,
      inProgress: memberInProgress,
      overdue: memberOverdue,
      completionRate: memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0,
    }
  })

  // Métricas por tag
  const allTags = tasks.flatMap((task) => task.tags || [])
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Cálculos de tempo
  const avgTaskAge =
    tasks.length > 0
      ? tasks.reduce((sum, task) => {
          const age = Math.floor((new Date().getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          return sum + age
        }, 0) / tasks.length
      : 0

  return (
    <div className="space-y-6">
      {/* Visão Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0}%
            </div>
            <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">{dueSoonTasks} vencem em 3 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idade Média</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTaskAge.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">dias desde criação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highPriorityTasks}</div>
            <p className="text-xs text-muted-foreground">requerem atenção imediata</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Distribuição por Status
          </CardTitle>
          <CardDescription>Visualização do fluxo de trabalho atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">A Fazer</span>
              <div className="flex items-center gap-2">
                <Progress value={totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0} className="w-32" />
                <span className="text-sm text-muted-foreground w-12">{todoTasks}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Em Progresso</span>
              <div className="flex items-center gap-2">
                <Progress value={totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0} className="w-32" />
                <span className="text-sm text-muted-foreground w-12">{inProgressTasks}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Concluído</span>
              <div className="flex items-center gap-2">
                <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="w-32" />
                <span className="text-sm text-muted-foreground w-12">{completedTasks}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Prioridade */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Prioridade</CardTitle>
          <CardDescription>Análise das prioridades das tarefas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{highPriorityTasks}</div>
              <Badge variant="destructive" className="mt-1">
                Alta
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{mediumPriorityTasks}</div>
              <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800">
                Média
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{lowPriorityTasks}</div>
              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                Baixa
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance da Equipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Performance da Equipe
          </CardTitle>
          <CardDescription>Métricas individuais dos membros da equipe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMetrics.map((member) => (
              <div key={member.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{member.name}</h4>
                  <Badge variant="outline">{member.completionRate.toFixed(1)}% conclusão</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg">{member.total}</div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">{member.completed}</div>
                    <div className="text-muted-foreground">Concluídas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">{member.inProgress}</div>
                    <div className="text-muted-foreground">Em Progresso</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-red-600">{member.overdue}</div>
                    <div className="text-muted-foreground">Atrasadas</div>
                  </div>
                </div>
                <Progress value={member.completionRate} className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags Mais Utilizadas */}
      {topTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags Mais Utilizadas</CardTitle>
            <CardDescription>Categorias mais comuns nas tarefas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count]) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
