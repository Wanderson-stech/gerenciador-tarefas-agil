import { NextResponse } from "next/server"

// Simulação de dados de métricas
export async function GET() {
  try {
    // Em um cenário real, estes dados viriam do banco de dados
    const metrics = {
      overview: {
        totalTasks: 15,
        completedTasks: 8,
        inProgressTasks: 4,
        todoTasks: 3,
        completionRate: 53.3,
        overdueTasks: 2,
      },
      teamPerformance: [
        {
          member: "João Silva",
          tasksAssigned: 6,
          tasksCompleted: 4,
          completionRate: 66.7,
          avgTaskTime: 3.2,
        },
        {
          member: "Maria Santos",
          tasksAssigned: 5,
          tasksCompleted: 3,
          completionRate: 60.0,
          avgTaskTime: 2.8,
        },
        {
          member: "Pedro Costa",
          tasksAssigned: 4,
          tasksCompleted: 1,
          completionRate: 25.0,
          avgTaskTime: 4.1,
        },
      ],
      priorityDistribution: {
        high: 5,
        medium: 7,
        low: 3,
      },
      statusHistory: [
        { date: "2024-01-01", todo: 15, inProgress: 0, completed: 0 },
        { date: "2024-01-07", todo: 12, inProgress: 3, completed: 0 },
        { date: "2024-01-14", todo: 8, inProgress: 5, completed: 2 },
        { date: "2024-01-21", todo: 3, inProgress: 4, completed: 8 },
      ],
      tags: [
        { name: "frontend", count: 8 },
        { name: "backend", count: 6 },
        { name: "database", count: 4 },
        { name: "auth", count: 3 },
        { name: "api", count: 5 },
      ],
    }

    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao buscar métricas" }, { status: 500 })
  }
}
