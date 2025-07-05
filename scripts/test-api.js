// Script para testar as APIs do sistema TechFlow
// Desenvolvido por: Francisco Wanderson Silva Miranda
// Tutora: Patricia Miscolcz
// Execute com: node scripts/test-api.js

const BASE_URL = "http://localhost:3000/api"

async function testAPI() {
  console.log("🚀 Iniciando testes da API...\n")

  try {
    // Teste 1: Login
    console.log("1. Testando login...")
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@techflow.com",
        password: "admin123",
      }),
    })

    const loginData = await loginResponse.json()
    console.log("✅ Login:", loginData.success ? "SUCESSO" : "FALHA")
    console.log("Token:", loginData.data?.token ? "Gerado" : "Não gerado")
    console.log("")

    // Teste 2: Buscar tarefas
    console.log("2. Testando busca de tarefas...")
    const tasksResponse = await fetch(`${BASE_URL}/tasks`)
    const tasksData = await tasksResponse.json()
    console.log("✅ Buscar tarefas:", tasksData.success ? "SUCESSO" : "FALHA")
    console.log("Total de tarefas:", tasksData.total || 0)
    console.log("")

    // Teste 3: Criar nova tarefa
    console.log("3. Testando criação de tarefa...")
    const newTaskResponse = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Tarefa de Teste",
        description: "Tarefa criada via script de teste",
        status: "a-fazer",
        priority: "media",
        assignee: "João Silva",
        tags: ["teste", "api"],
      }),
    })

    const newTaskData = await newTaskResponse.json()
    console.log("✅ Criar tarefa:", newTaskData.success ? "SUCESSO" : "FALHA")
    console.log("ID da nova tarefa:", newTaskData.data?.id || "N/A")
    console.log("")

    // Teste 4: Buscar métricas
    console.log("4. Testando métricas...")
    const metricsResponse = await fetch(`${BASE_URL}/metrics`)
    const metricsData = await metricsResponse.json()
    console.log("✅ Métricas:", metricsData.success ? "SUCESSO" : "FALHA")
    console.log("Taxa de conclusão:", metricsData.data?.overview?.completionRate || 0, "%")
    console.log("")

    console.log("🎉 Todos os testes concluídos!")
  } catch (error) {
    console.error("❌ Erro durante os testes:", error.message)
  }
}

// Executar testes apenas se o script for chamado diretamente
if (require.main === module) {
  testAPI()
}

module.exports = { testAPI }
