export function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900">TechFlow Solutions</h3>
            <p className="text-sm text-gray-600">Sistema de Gerenciamento de Tarefas Ágil</p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              Desenvolvido por <span className="font-semibold">Francisco Wanderson Silva Miranda</span>
            </p>
            <p className="text-sm text-gray-600">
              Orientação: <span className="font-semibold">Patricia Miscolcz</span>
            </p>
            <a
              href="https://www.linkedin.com/in/wandersonsilvamiranda/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              LinkedIn do Desenvolvedor
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">© 2024 TechFlow Solutions. Projeto acadêmico - Engenharia de Software</p>
        </div>
      </div>
    </footer>
  )
}
