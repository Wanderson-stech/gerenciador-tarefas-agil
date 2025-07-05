import { type NextRequest, NextResponse } from "next/server"

// Usuários de demonstração
const users = [
  {
    id: "1",
    email: "admin@techflow.com",
    password: "admin123",
    name: "Administrador",
    role: "admin",
  },
  {
    id: "2",
    email: "joao@techflow.com",
    password: "joao123",
    name: "João Silva",
    role: "developer",
  },
  {
    id: "3",
    email: "maria@techflow.com",
    password: "maria123",
    name: "Maria Santos",
    role: "developer",
  },
  {
    id: "4",
    email: "pedro@techflow.com",
    password: "pedro123",
    name: "Pedro Costa",
    role: "developer",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validação básica
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Verificar credenciais
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ success: false, error: "Credenciais inválidas" }, { status: 401 })
    }

    // Simular geração de token JWT (em produção, usar biblioteca apropriada)
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
      }),
    ).toString("base64")

    // Retornar dados do usuário (sem senha)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        expiresIn: "24h",
      },
      message: "Login realizado com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
