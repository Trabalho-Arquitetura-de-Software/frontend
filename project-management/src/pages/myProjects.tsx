import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useMutation, gql } from "@apollo/client";
import { NewProjectModal } from "@/components/modal/new-project-modal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProjectDetailsModal } from "@/components/modal/project-details-modal";

interface Team {
  id: string;
  name: string;
  professor: string;
  equipe: string | null;
}

// Mutation para salvar um novo projeto - corrigindo a sintaxe
const GET_MY_PROJECTS = gql`
  mutation GetMyProjects(
    $name: String!,
    $objective: String!,
    $requester: ID!,
    $summaryScope: String!,
    $targetAudience: String!,
    $expectedStartDate: Date!
  ) {
    saveProject(
      name: $name,
      objective: $objective,
      requester: $requester,
      summaryScope: $summaryScope,
      targetAudience: $targetAudience,
      expectedStartDate: $expectedStartDate
    ) {
      id
      name
    }
  }
`;

// Using default export here - may be needed for routing
export default function MyProjects() {
  const [teams, setTeams] = useState<Team[]>([]);
  const usuario = JSON.parse(localStorage.getItem("user") || "{}");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        name: "Projeto A",
        professor: "Ana Silva",
        equipe: "Lucas, Roberto",
      },
      {
        id: "2",
        name: "Equipe Beta",
        professor: "Maria Oliveira",
        equipe: "Guilherme",
      },
      {
        id: "3",
        name: "Equipe Gama",
        professor: "Carlos Souza",
        equipe: "denilson",
      },
    ];
    setTeams(mockTeams);
  }, []);
  
//   const [saveProject] = useMutation(SAVE_PROJECT, {
//     onCompleted: () => {
//       toast({ title: "Projeto solicitado com sucesso!" });
//       setModalOpen(false);
//     },
//     onError: (error) => {
//       toast({ title: "Erro ao solicitar projeto", description: error.message });
//     }
//   });

  const handleNewProjectSubmit = (formData) => {
    console.log("Novo projeto:", formData);
    // saveProject({ variables: formData });
  };
  
  // Filtrar equipes com base na busca
  const filteredTeams = searchQuery.trim() 
    ? teams.filter(team => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.project && team.project.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : teams;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="bg-gray-50">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              Meus projetos
            </h1>
            <Separator orientation="vertical" className="h-6" />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar projetos..."
                className="pl-8 bg-gray-50 border-gray-200 focus-visible:ring-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="ml-auto"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Solicitar Projeto
            </Button>
          </header>

          <main className="p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">Projetos</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredTeams.length} {filteredTeams.length === 1 ? "projeto encontrado" : "projetos encontrados"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <DashboardCard key={team.id} team={team} />
                  ))
                ) : (
                  <p className="text-gray-600 col-span-full">Nenhum projeto encontrada.</p>
                )}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Modal para novo projeto */}
      <NewProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleNewProjectSubmit}
      />
    </SidebarProvider>
  );
}

// Also export as named export for flexibility

function DashboardCard({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2 text-primary-dark">{team.name}</h2>
      <p className="text-gray-600 mb-2">Professor: {team.professor}</p>
      <p className={team.equipe ? "text-gray-600" : "text-red-500"}>
        Equipe: {team.equipe || "Sem projeto"}
      </p>
      {!team.equipe && usuario.role !== "STUDENT" && (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4" variant="secondary" size="sm">
                Associar Projeto
              </Button>
            </DialogTrigger>          </Dialog>
        </>
      )}
      {team.equipe && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4" variant="default" size="sm">
              Ver detalhes
            </Button>
          </DialogTrigger>
          <ProjectDetailsModal team={team} />
        </Dialog>
      )}
    </div>
  );
}

