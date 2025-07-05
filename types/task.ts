export type TaskStatus = "a-fazer" | "em-progresso" | "concluido"
export type TaskPriority = "baixa" | "media" | "alta"

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  createdAt: Date
  dueDate?: Date
  tags?: string[]
}
