"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulação de autenticação
    try {
      // Validação básica
      if (!formData.email || !formData.password) {
        throw new Error("Por favor, preencha todos os campos")
      }

      if (!formData.email.includes("@")) {
        throw new Error("Por favor, insira um email válido")
      }

      if (formData.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres")
      }

      // Simulação de delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Credenciais de demonstração
      const validCredentials = [
        { email: "admin@techflow.com", password: "admin123" },
        { email: "joao@techflow.com", password: "joao123" },
        { email: "maria@techflow.com", password: "maria123" },
        { email: "pedro@techflow.com", password: "pedro123" },
      ]

      const isValid = validCredentials.some(
        (cred) => cred.email === formData.email && cred.password === formData.password,
      )

      if (!isValid) {
        throw new Error("Email ou senha incorretos")
      }

      // Salvar dados de autenticação no localStorage
      localStorage.setItem(
        "techflow-auth",
        JSON.stringify({
          email: formData.email,
          loginTime: new Date().toISOString(),
        }),
      )

      // Redirecionar para o dashboard
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <LogIn className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">TechFlow Solutions</CardTitle>
          <CardDescription>Faça login para acessar o sistema de gestão ágil</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Credenciais de demonstração</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Admin:</strong> admin@techflow.com / admin123
              </p>
              <p>
                <strong>João:</strong> joao@techflow.com / joao123
              </p>
              <p>
                <strong>Maria:</strong> maria@techflow.com / maria123
              </p>
              <p>
                <strong>Pedro:</strong> pedro@techflow.com / pedro123
              </p>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Desenvolvido por Francisco Wanderson Silva Miranda</p>
            <p>Orientação: Patricia Miscolcz</p>
            <a
              href="https://www.linkedin.com/in/wandersonsilvamiranda/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn do Desenvolvedor
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
