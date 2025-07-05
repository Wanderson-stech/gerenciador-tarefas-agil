import { type NextRequest, NextResponse } from "next/server"

// Simulação de banco de dados em memória
const tasks = [
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
]

// GET - Listar todas as tarefas
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: tasks,
      total: tasks.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao buscar tarefas" }, { status: 500 })
  }
}

// POST - Criar nova tarefa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação básica
    if (!body.title || !body.assignee) {
      return NextResponse.json({ success: false, error: "Título e responsável são obrigatórios" }, { status: 400 })
    }

    const newTask = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || "",
      status: body.status || "a-fazer",
      priority: body.priority || "media",
      assignee: body.assignee,
      createdAt: new Date(),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      tags: body.tags || [],
    }

    tasks.push(newTask)

    return NextResponse.json(
      {
        success: true,
        data: newTask,
        message: "Tarefa criada com sucesso",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao criar tarefa" }, { status: 500 })
  }
}

// PUT - Atualizar tarefa
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "ID da tarefa é obrigatório" }, { status: 400 })
    }

    const taskIndex = tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Tarefa não encontrada" }, { status: 404 })
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: tasks[taskIndex],
      message: "Tarefa atualizada com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao atualizar tarefa" }, { status: 500 })
  }
}

// DELETE - Excluir tarefa
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID da tarefa é obrigatório" }, { status: 400 })
    }

    const taskIndex = tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Tarefa não encontrada" }, { status: 404 })
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedTask,
      message: "Tarefa excluída com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao excluir tarefa" }, { status: 500 })
  }
}
