import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProjectDetailsModal } from "@/components/modal/project-details-modal";
import { SelectProjectModal } from "@/components/modal/select-project-modal";

interface Team {
  id: string;
  name: string;
  professor: string;
  project: string | null;
}

export function Myteams() {
  const [teams, setTeams] = useState<Team[]>([]);

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
    const mockTeams: Team[] = [
      {
        id: "1",
        name: "Equipe Alfa",
        professor: "Ana Silva",
        project: "Sistema de Gestão Escolar",
      },
      {
        id: "2",
        name: "Equipe Beta",
        professor: "Maria Oliveira",
        project: null,
      },
      {
        id: "3",
        name: "Equipe Gama",
        professor: "Carlos Souza",
        project: "Aplicativo de Monitoramento",
      },
    ];
    setTeams(mockTeams);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Minhas Equipes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <DashboardCard key={team.id} team={team} />
                ))
              ) : (
                <p className="text-gray-600 col-span-full">Nenhuma equipe encontrada.</p>
              )}
            </div>

            {/* <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Atividade Recente</h2>
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-500">Nenhuma atividade recente para mostrar.</p>
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function DashboardCard({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2 text-primary-dark">{team.name}</h2>
      <p className="text-gray-600 mb-2">Professor: {team.professor}</p>
      <p className={team.project ? "text-gray-600" : "text-red-500"}>
        Projeto: {team.project || "Sem projeto"}
      </p>
      {!team.project && (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 px-4 py-2 bg-primary-dark hover:bg-primary-darker text-white rounded-md text-sm">
                Solicitar Projeto
              </Button>
            </DialogTrigger>
            <SelectProjectModal team={team} />
          </Dialog>
        </>
      )}
    </div>
  );
}