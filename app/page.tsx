"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, CheckCircle, Clock, Plus, Users, TrendingUp, AlertCircle } from "lucide-react"
import TaskBoard from "@/components/task-board"
import TaskForm from "@/components/task-form"
import TaskMetrics from "@/components/task-metrics"
import type { Task, TaskStatus } from "@/types/task"
import { Footer } from "@/components/footer"

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Carregar tarefas do localStorage na inicialização
  useEffect(() => {
    const savedTasks = localStorage.getItem("techflow-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Dados iniciais para demonstração
      const initialTasks: Task[] = [
        {
          id: "1",
          title: "Implementar Sistema de Login",
          description: "Desenvolver autenticação de usuários com validação",
          status: "em-progresso",
          priority: "alta",
          assignee: "João Silva",
          createdAt: new Date("2024-01-15"),
          dueDate: new Date("2024-01-25"),
          tags: ["frontend", "auth"],
        },
        {
          id: "2",
          title: "Configurar Banco de Dados",
          description: "Setup inicial do PostgreSQL e migrations",
          status: "concluido",
          priority: "alta",
          assignee: "Maria Santos",
          createdAt: new Date("2024-01-10"),
          dueDate: new Date("2024-01-20"),
          tags: ["backend", "database"],
        },
        {
          id: "3",
          title: "Criar Dashboard de Métricas",
          description: "Interface para visualização de KPIs do projeto",
          status: "a-fazer",
          priority: "media",
          assignee: "Pedro Costa",
          createdAt: new Date("2024-01-18"),
          dueDate: new Date("2024-01-30"),
          tags: ["frontend", "analytics"],
        },
      ]
      setTasks(initialTasks)
      localStorage.setItem("techflow-tasks", JSON.stringify(initialTasks))
    }
  }, [])

  // Salvar tarefas no localStorage sempre que houver mudanças
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("techflow-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
    setShowTaskForm(false)
  }

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)))
      setEditingTask(null)
      setShowTaskForm(false)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  // Cálculos para métricas
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "concluido").length
  const inProgressTasks = tasks.filter((task) => task.status === "em-progresso").length
  const todoTasks = tasks.filter((task) => task.status === "a-fazer").length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const overdueTasks = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "concluido",
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TechFlow Solutions - Sistema de Gestão Ágil</h1>
            <p className="text-gray-600 mt-1">
              Desenvolvido por Francisco Wanderson Silva Miranda - Orientação: Patricia Miscolcz
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTask(null)
              setShowTaskForm(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">Todas as tarefas do projeto</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">Taxa: {completionRate.toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">Sendo desenvolvidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
              <p className="text-xs text-muted-foreground">Requerem atenção</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progresso do Projeto
            </CardTitle>
            <CardDescription>Acompanhamento geral do desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conclusão Geral</span>
                <span>{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>A Fazer: {todoTasks}</span>
                <span>Em Progresso: {inProgressTasks}</span>
                <span>Concluído: {completedTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="kanban" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kanban">Quadro Kanban</TabsTrigger>
            <TabsTrigger value="metrics">Métricas Detalhadas</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <TaskBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          </TabsContent>

          <TabsContent value="metrics">
            <TaskMetrics tasks={tasks} />
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Equipe do Projeto
                </CardTitle>
                <CardDescription>Membros da equipe e suas responsabilidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["João Silva", "Maria Santos", "Pedro Costa"].map((member) => {
                    const memberTasks = tasks.filter((task) => task.assignee === member)
                    const memberCompleted = memberTasks.filter((task) => task.status === "concluido").length
                    const memberRate = memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0

                    return (
                      <Card key={member}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{member}</CardTitle>
                          <CardDescription>Desenvolvedor</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Tarefas: {memberTasks.length}</span>
                              <span>Taxa: {memberRate.toFixed(1)}%</span>
                            </div>
                            <Progress value={memberRate} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Formulário */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
          />
        )}
        <Footer />
      </div>
    </div>
  )
}
