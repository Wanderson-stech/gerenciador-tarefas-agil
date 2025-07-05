#!/usr/bin/env python3
"""
Script de análise de dados para o sistema TechFlow
Desenvolvido por: Francisco Wanderson Silva Miranda
Tutora: Patricia Miscolcz
Disciplina: Engenharia de Software
Analisa métricas de produtividade e gera relatórios
"""

import json
import datetime
from typing import Dict, List, Any
import statistics

class TaskAnalyzer:
    def __init__(self, tasks_data: List[Dict[str, Any]]):
        self.tasks = tasks_data
        self.analysis_date = datetime.datetime.now()
    
    def calculate_completion_metrics(self) -> Dict[str, float]:
        """Calcula métricas de conclusão de tarefas"""
        if not self.tasks:
            return {"completion_rate": 0, "avg_completion_time": 0}
        
        total_tasks = len(self.tasks)
        completed_tasks = len([t for t in self.tasks if t.get('status') == 'concluido'])
        
        completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
        
        # Calcular tempo médio de conclusão (simulado)
        completion_times = []
        for task in self.tasks:
            if task.get('status') == 'concluido':
                created = datetime.datetime.fromisoformat(task.get('createdAt', '2024-01-01'))
                # Simular data de conclusão baseada na data atual
                completed = self.analysis_date
                days_to_complete = (completed - created).days
                completion_times.append(max(1, days_to_complete))  # Mínimo 1 dia
        
        avg_completion_time = statistics.mean(completion_times) if completion_times else 0
        
        return {
            "completion_rate": round(completion_rate, 2),
            "avg_completion_time": round(avg_completion_time, 2),
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks
        }
    
    def analyze_team_performance(self) -> Dict[str, Dict[str, Any]]:
        """Analisa performance individual da equipe"""
        team_stats = {}
        
        for task in self.tasks:
            assignee = task.get('assignee', 'Não atribuído')
            if assignee not in team_stats:
                team_stats[assignee] = {
                    'total_tasks': 0,
                    'completed_tasks': 0,
                    'in_progress_tasks': 0,
                    'todo_tasks': 0,
                    'high_priority_tasks': 0
                }
            
            stats = team_stats[assignee]
            stats['total_tasks'] += 1
            
            status = task.get('status', 'a-fazer')
            if status == 'concluido':
                stats['completed_tasks'] += 1
            elif status == 'em-progresso':
                stats['in_progress_tasks'] += 1
            else:
                stats['todo_tasks'] += 1
            
            if task.get('priority') == 'alta':
                stats['high_priority_tasks'] += 1
        
        # Calcular taxas de conclusão
        for member, stats in team_stats.items():
            if stats['total_tasks'] > 0:
                stats['completion_rate'] = round(
                    (stats['completed_tasks'] / stats['total_tasks']) * 100, 2
                )
            else:
                stats['completion_rate'] = 0
        
        return team_stats
    
    def identify_bottlenecks(self) -> List[Dict[str, Any]]:
        """Identifica gargalos no processo"""
        bottlenecks = []
        
        # Tarefas em progresso há muito tempo
        long_running_tasks = []
        for task in self.tasks:
            if task.get('status') == 'em-progresso':
                created = datetime.datetime.fromisoformat(task.get('createdAt', '2024-01-01'))
                days_in_progress = (self.analysis_date - created).days
                if days_in_progress > 7:  # Mais de 7 dias em progresso
                    long_running_tasks.append({
                        'task_id': task.get('id'),
                        'title': task.get('title'),
                        'days_in_progress': days_in_progress,
                        'assignee': task.get('assignee')
                    })
        
        if long_running_tasks:
            bottlenecks.append({
                'type': 'Tarefas em progresso há muito tempo',
                'count': len(long_running_tasks),
                'details': long_running_tasks
            })
        
        # Membros com muitas tarefas pendentes
        team_stats = self.analyze_team_performance()
        overloaded_members = []
        for member, stats in team_stats.items():
            if stats['total_tasks'] - stats['completed_tasks'] > 3:  # Mais de 3 tarefas pendentes
                overloaded_members.append({
                    'member': member,
                    'pending_tasks': stats['total_tasks'] - stats['completed_tasks'],
                    'completion_rate': stats['completion_rate']
                })
        
        if overloaded_members:
            bottlenecks.append({
                'type': 'Membros sobrecarregados',
                'count': len(overloaded_members),
                'details': overloaded_members
            })
        
        return bottlenecks
    
    def generate_report(self) -> str:
        """Gera relatório completo de análise"""
        completion_metrics = self.calculate_completion_metrics()
        team_performance = self.analyze_team_performance()
        bottlenecks = self.identify_bottlenecks()
        
        report = f"""
# RELATÓRIO DE ANÁLISE - TECHFLOW SOLUTIONS
Data da Análise: {self.analysis_date.strftime('%d/%m/%Y %H:%M')}

## MÉTRICAS GERAIS
- Total de Tarefas: {completion_metrics['total_tasks']}
- Tarefas Concluídas: {completion_metrics['completed_tasks']}
- Taxa de Conclusão: {completion_metrics['completion_rate']}%
- Tempo Médio de Conclusão: {completion_metrics['avg_completion_time']} dias

## PERFORMANCE DA EQUIPE
"""
        
        for member, stats in team_performance.items():
            report += f"""
### {member}
- Total de Tarefas: {stats['total_tasks']}
- Concluídas: {stats['completed_tasks']}
- Em Progresso: {stats['in_progress_tasks']}
- A Fazer: {stats['todo_tasks']}
- Taxa de Conclusão: {stats['completion_rate']}%
- Tarefas de Alta Prioridade: {stats['high_priority_tasks']}
"""
        
        report += "\n## GARGALOS IDENTIFICADOS\n"
        
        if bottlenecks:
            for bottleneck in bottlenecks:
                report += f"\n### {bottleneck['type']}\n"
                report += f"Quantidade: {bottleneck['count']}\n"
                for detail in bottleneck['details']:
                    if 'task_id' in detail:
                        report += f"- Tarefa: {detail['title']} ({detail['days_in_progress']} dias)\n"
                    elif 'member' in detail:
                        report += f"- {detail['member']}: {detail['pending_tasks']} tarefas pendentes\n"
        else:
            report += "Nenhum gargalo crítico identificado.\n"
        
        report += f"""
## RECOMENDAÇÕES
1. Revisar tarefas em progresso há mais de 7 dias
2. Redistribuir tarefas entre membros sobrecarregados
3. Priorizar tarefas de alta prioridade
4. Implementar reuniões diárias de acompanhamento

---
Relatório gerado automaticamente pelo sistema TechFlow Solutions
Desenvolvido por: Francisco Wanderson Silva Miranda
Orientação: Patricia Miscolcz
LinkedIn: https://www.linkedin.com/in/wandersonsilvamiranda/
"""
        
        return report

def main():
    """Função principal para executar a análise"""
    # Dados de exemplo (em produção, viriam de uma API ou banco de dados)
    sample_tasks = [
        {
            "id": "1",
            "title": "Implementar Sistema de Login",
            "status": "em-progresso",
            "priority": "alta",
            "assignee": "João Silva",
            "createdAt": "2024-01-15T00:00:00"
        },
        {
            "id": "2",
            "title": "Configurar Banco de Dados",
            "status": "concluido",
            "priority": "alta",
            "assignee": "Maria Santos",
            "createdAt": "2024-01-10T00:00:00"
        },
        {
            "id": "3",
            "title": "Criar Dashboard",
            "status": "a-fazer",
            "priority": "media",
            "assignee": "Pedro Costa",
            "createdAt": "2024-01-18T00:00:00"
        }
    ]
    
    print("🔍 Iniciando análise de dados TechFlow...")
    
    analyzer = TaskAnalyzer(sample_tasks)
    report = analyzer.generate_report()
    
    # Salvar relatório
    with open('relatorio_analise.txt', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("📊 Análise concluída!")
    print("📄 Relatório salvo em: relatorio_analise.txt")
    print("\n" + "="*50)
    print(report)

if __name__ == "__main__":
    main()
