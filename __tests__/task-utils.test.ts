/**
 * Testes unitários para utilitários de tarefas
 * Executar com: npm test
 */

import type { Task, TaskStatus, TaskPriority } from "@/types/task"

// Funções utilitárias para testes
export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: "1",
  title: "Tarefa de Teste",
  description: "Descrição de teste",
  status: "a-fazer",
  priority: "media",
  assignee: "João Silva",
  createdAt: new Date("2024-01-15"),
  tags: ["teste"],
  ...overrides,
})

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === "concluido") return false
  return new Date(task.dueDate) < new Date()
}

export const calculateCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter((task) => task.status === "concluido").length
  return (completedTasks / tasks.length) * 100
}

export const getTasksByStatus = (tasks: Task[], status: TaskStatus): Task[] => {
  return tasks.filter((task) => task.status === status)
}

export const getTasksByPriority = (tasks: Task[], priority: TaskPriority): Task[] => {
  return tasks.filter((task) => task.priority === priority)
}

export const getTasksByAssignee = (tasks: Task[], assignee: string): Task[] => {
  return tasks.filter((task) => task.assignee === assignee)
}

// Testes
describe("Task Utilities", () => {
  describe("createMockTask", () => {
    it("should create a task with default values", () => {
      const task = createMockTask()

      expect(task.id).toBe("1")
      expect(task.title).toBe("Tarefa de Teste")
      expect(task.status).toBe("a-fazer")
      expect(task.priority).toBe("media")
      expect(task.assignee).toBe("João Silva")
    })

    it("should override default values", () => {
      const task = createMockTask({
        title: "Tarefa Customizada",
        status: "concluido",
        priority: "alta",
      })

      expect(task.title).toBe("Tarefa Customizada")
      expect(task.status).toBe("concluido")
      expect(task.priority).toBe("alta")
    })
  })

  describe("isTaskOverdue", () => {
    it("should return false for task without due date", () => {
      const task = createMockTask({ dueDate: undefined })
      expect(isTaskOverdue(task)).toBe(false)
    })

    it("should return false for completed task", () => {
      const task = createMockTask({
        status: "concluido",
        dueDate: new Date("2023-01-01"), // Data passada
      })
      expect(isTaskOverdue(task)).toBe(false)
    })

    it("should return true for overdue task", () => {
      const task = createMockTask({
        status: "em-progresso",
        dueDate: new Date("2023-01-01"), // Data passada
      })
      expect(isTaskOverdue(task)).toBe(true)
    })

    it("should return false for future due date", () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7) // 7 dias no futuro

      const task = createMockTask({
        status: "a-fazer",
        dueDate: futureDate,
      })
      expect(isTaskOverdue(task)).toBe(false)
    })
  })

  describe("calculateCompletionRate", () => {
    it("should return 0 for empty array", () => {
      expect(calculateCompletionRate([])).toBe(0)
    })

    it("should calculate correct completion rate", () => {
      const tasks = [
        createMockTask({ id: "1", status: "concluido" }),
        createMockTask({ id: "2", status: "concluido" }),
        createMockTask({ id: "3", status: "em-progresso" }),
        createMockTask({ id: "4", status: "a-fazer" }),
      ]

      expect(calculateCompletionRate(tasks)).toBe(50) // 2 de 4 = 50%
    })

    it("should return 100 for all completed tasks", () => {
      const tasks = [createMockTask({ id: "1", status: "concluido" }), createMockTask({ id: "2", status: "concluido" })]

      expect(calculateCompletionRate(tasks)).toBe(100)
    })
  })

  describe("getTasksByStatus", () => {
    const tasks = [
      createMockTask({ id: "1", status: "a-fazer" }),
      createMockTask({ id: "2", status: "em-progresso" }),
      createMockTask({ id: "3", status: "concluido" }),
      createMockTask({ id: "4", status: "a-fazer" }),
    ]

    it("should filter tasks by status", () => {
      const todoTasks = getTasksByStatus(tasks, "a-fazer")
      expect(todoTasks).toHaveLength(2)
      expect(todoTasks.every((task) => task.status === "a-fazer")).toBe(true)
    })

    it("should return empty array for non-existent status", () => {
      const emptyTasks: Task[] = []
      const result = getTasksByStatus(emptyTasks, "concluido")
      expect(result).toHaveLength(0)
    })
  })

  describe("getTasksByPriority", () => {
    const tasks = [
      createMockTask({ id: "1", priority: "alta" }),
      createMockTask({ id: "2", priority: "media" }),
      createMockTask({ id: "3", priority: "baixa" }),
      createMockTask({ id: "4", priority: "alta" }),
    ]

    it("should filter tasks by priority", () => {
      const highPriorityTasks = getTasksByPriority(tasks, "alta")
      expect(highPriorityTasks).toHaveLength(2)
      expect(highPriorityTasks.every((task) => task.priority === "alta")).toBe(true)
    })
  })

  describe("getTasksByAssignee", () => {
    const tasks = [
      createMockTask({ id: "1", assignee: "João Silva" }),
      createMockTask({ id: "2", assignee: "Maria Santos" }),
      createMockTask({ id: "3", assignee: "João Silva" }),
      createMockTask({ id: "4", assignee: "Pedro Costa" }),
    ]

    it("should filter tasks by assignee", () => {
      const joaoTasks = getTasksByAssignee(tasks, "João Silva")
      expect(joaoTasks).toHaveLength(2)
      expect(joaoTasks.every((task) => task.assignee === "João Silva")).toBe(true)
    })

    it("should return empty array for non-existent assignee", () => {
      const result = getTasksByAssignee(tasks, "Usuário Inexistente")
      expect(result).toHaveLength(0)
    })
  })
})

// Testes de integração para componentes
describe("Task Integration Tests", () => {
  it("should handle task lifecycle correctly", () => {
    // Criar tarefa
    let task = createMockTask({
      status: "a-fazer",
      dueDate: new Date("2024-12-31"),
    })

    // Verificar estado inicial
    expect(task.status).toBe("a-fazer")
    expect(isTaskOverdue(task)).toBe(false)

    // Mover para em progresso
    task = { ...task, status: "em-progresso" }
    expect(task.status).toBe("em-progresso")

    // Concluir tarefa
    task = { ...task, status: "concluido" }
    expect(task.status).toBe("concluido")
    expect(isTaskOverdue(task)).toBe(false) // Não deve estar atrasada se concluída
  })

  it("should calculate team metrics correctly", () => {
    const tasks = [
      createMockTask({ id: "1", assignee: "João Silva", status: "concluido" }),
      createMockTask({ id: "2", assignee: "João Silva", status: "em-progresso" }),
      createMockTask({ id: "3", assignee: "Maria Santos", status: "concluido" }),
      createMockTask({ id: "4", assignee: "Maria Santos", status: "concluido" }),
    ]

    const joaoTasks = getTasksByAssignee(tasks, "João Silva")
    const mariaTasks = getTasksByAssignee(tasks, "Maria Santos")

    expect(calculateCompletionRate(joaoTasks)).toBe(50) // 1 de 2
    expect(calculateCompletionRate(mariaTasks)).toBe(100) // 2 de 2
  })
})
