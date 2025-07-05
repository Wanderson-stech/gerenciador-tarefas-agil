"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertCircle, Calendar, MoreVertical, User, Edit, Trash2, Clock } from "lucide-react"
import type { Task, TaskStatus } from "@/types/task"

interface TaskBoardProps {
  tasks: Task[]
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

const statusConfig = {
  "a-fazer": {
    title: "A Fazer",
    color: "bg-gray-100 border-gray-300",
    badgeColor: "bg-gray-500",
  },
  "em-progresso": {
    title: "Em Progresso",
    color: "bg-blue-50 border-blue-300",
    badgeColor: "bg-blue-500",
  },
  concluido: {
    title: "Concluído",
    color: "bg-green-50 border-green-300",
    badgeColor: "bg-green-500",
  },
}

const priorityConfig = {
  baixa: { color: "bg-green-100 text-green-800", label: "Baixa" },
  media: { color: "bg-yellow-100 text-yellow-800", label: "Média" },
  alta: { color: "bg-red-100 text-red-800", label: "Alta" },
}

export default function TaskBoard({ tasks, onStatusChange, onEditTask, onDeleteTask }: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault()
    if (draggedTask) {
      onStatusChange(draggedTask, newStatus)
      setDraggedTask(null)
    }
  }

  const isOverdue = (task: Task) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "concluido"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {(Object.keys(statusConfig) as TaskStatus[]).map((status) => {
        const statusTasks = tasks.filter((task) => task.status === status)
        const config = statusConfig[status]

        return (
          <Card
            key={status}
            className={`${config.color} min-h-[500px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{config.title}</span>
                <Badge className={`${config.badgeColor} text-white`}>{statusTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`cursor-move hover:shadow-md transition-shadow ${
                    isOverdue(task) ? "border-red-300 bg-red-50" : "bg-white"
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header da tarefa */}
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm leading-tight">{task.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditTask(task)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Descrição */}
                      {task.description && <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>}

                      {/* Prioridade */}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-xs ${priorityConfig[task.priority].color}`}>
                          {priorityConfig[task.priority].label}
                        </Badge>
                        {isOverdue(task) && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Atrasada
                          </Badge>
                        )}
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Footer com informações */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        )}
                      </div>

                      {/* Tempo desde criação */}
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>Criada em {formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Nenhuma tarefa nesta coluna</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
