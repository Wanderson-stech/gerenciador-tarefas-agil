import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar se é uma rota da API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Adicionar headers CORS para APIs
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }

  // Para rotas protegidas (em um cenário real)
  const protectedRoutes = ["/dashboard", "/admin"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    // Em produção, verificar token JWT aqui
    // Por enquanto, apenas log para
    // Em produção, verificar token JWT aqui
    // Por enquanto, apenas log para demonstração
    console.log(`Acesso à rota protegida: ${request.nextUrl.pathname}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/admin/:path*"],
}
