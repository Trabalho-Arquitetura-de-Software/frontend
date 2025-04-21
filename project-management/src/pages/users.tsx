// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { useEffect } from "react";

// export function Home() {
//     // Função para remover as restrições de layout ao entrar na página Home
//     useEffect(() => {
//         const rootElement = document.getElementById('root')
//         if (rootElement) {
//             rootElement.style.maxWidth = "100%"
//             rootElement.style.padding = "0"
            
//             return () => {
//                 rootElement.style.maxWidth = "1280px"
//                 rootElement.style.padding = "2rem"
//             }
//         }
//     }, [])

//     return (
//         <SidebarProvider>
//             <div className="flex h-screen w-full">
//                 <AppSidebar />
//                 <main className="flex-1 p-6 bg-gray-50">
//                     <div className="max-w-5xl mx-auto">
//                         <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             <DashboardCard 
//                                 title="Projetos" 
//                                 description="Gerencie seus projetos aqui."
//                             />
//                         </div>
                    
//                     </div>
//                 </main>
//             </div>
//         </SidebarProvider>
//     )
// }

// // Componente auxiliar para cards de dashboard
// function DashboardCard({ title, description }: { title: string, description: string }) {
//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//             <h2 className="text-xl font-semibold mb-2 text-primary-dark">{title}</h2>
//             <p className="text-gray-600">{description}</p>
//             <button className="mt-4 px-4 py-2 bg-primary-dark hover:bg-primary-darker text-white rounded-md text-sm">
//                 Ver detalhes
//             </button>
//         </div>
//     );
// }
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import { NewUserModal } from "@/components/modal/new-user-modal";
import { Dialog } from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
}

export function Users() {
    const [open, setOpen] = useState(false)

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.maxWidth = "100%";
      rootElement.style.padding = "0";

      return () => {
        rootElement.style.maxWidth = "1280px";
        rootElement.style.padding = "2rem";
      };
    }
  }, []);

  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Ana Silva",
        email: "ana.silva@email.com",
      },
      {
        id: "2",
        name: "João Pereira",
        email: "joao.pereira@email.com",
      },
      {
        id: "3",
        name: "Maria Oliveira",
        email: "maria.oliveira@email.com",
      },
    ];

    setUsers(mockUsers);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-3xl font-bold">Usuários</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                    onClick={() => setOpen(true)}
                      variant="outline"
                      size="icon"
                      className="rounded-full w-10 h-10 bg-[#5F075F] hover:bg-[#4A0550] border-none"
                    >
                      <Plus className="h-5 w-5 text-white" />
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <NewUserModal/>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adicionar novo usuário</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            <h2 className="text-2xl font-bold">Professores</h2>

            <div className="mb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.length > 0 ? (
                users.map((user) => (
                  <DashboardCard
                    key={user.id}
                    title={user.name}
                    description={user.email}
                  />
                ))
              ) : (
                <p className="text-gray-600">Nenhum usuário encontrado.</p>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-5">Alunos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.length > 0 ? (
                users.map((user) => (
                  <DashboardCard
                    key={user.id}
                    title={user.name}
                    description={user.email}
                  />
                ))
              ) : (
                <p className="text-gray-600">Nenhum usuário encontrado.</p>
              )}
            </div>

          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function DashboardCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2 text-primary-dark">{title}</h2>
      <p className="text-gray-600">{description}</p>

    </div>
  );
}