import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";

export function Home() {
    // Função para remover as restrições de layout ao entrar na página Home
    useEffect(() => {
        const rootElement = document.getElementById('root')
        if (rootElement) {
            rootElement.style.maxWidth = "100%"
            rootElement.style.padding = "0"
            
            return () => {
                rootElement.style.maxWidth = "1280px"
                rootElement.style.padding = "2rem"
            }
        }
    }, [])

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AppSidebar />
                <main className="flex-1 p-6 bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">Projetos</h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <DashboardCard 
                                title="Projetos" 
                                description="Gerencie seus projetos aqui."
                            />
                            <DashboardCard 
                                title="Tarefas" 
                                description="Acompanhe suas tarefas pendentes."
                            />
                            <DashboardCard 
                                title="Relatórios" 
                                description="Visualize relatórios e métricas."
                            />
                        </div>
                        
                        <div className="mt-12">
                            <h2 className="text-2xl font-semibold mb-4">Atividade Recente</h2>
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <p className="text-gray-500">Nenhuma atividade recente para mostrar.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}

// Componente auxiliar para cards de dashboard
function DashboardCard({ title, description }: { title: string, description: string }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-primary-dark">{title}</h2>
            <p className="text-gray-600">{description}</p>
            <button className="mt-4 px-4 py-2 bg-primary-dark hover:bg-primary-darker text-white rounded-md text-sm">
                Ver detalhes
            </button>
        </div>
    );
}