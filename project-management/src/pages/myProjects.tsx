import { useQuery, useMutation, gql } from '@apollo/client';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardX, Search, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';
import { NewProjectModal } from "@/components/modal/new-project-modal";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Query para buscar meus projetos
const GET_MY_PROJECTS = gql`
  query MyProjects($requesterId: ID!) {
    findAllProjectsByRequester(requester_id: $requesterId) {
      expectedStartDate
      id
      name
      objective
      status
      summaryScope
      targetAudience
      group {
        id
        name
        coordinator {
          name
        }
      }
      requester {
        name
      }
    }
  }
`;

// Mutation para salvar um novo projeto
const SAVE_PROJECT = gql`
  mutation SaveProject(
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

export default function MyProjects() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const { loading, error, data, refetch } = useQuery(GET_MY_PROJECTS, {
    variables: { requesterId: user.id },
    skip: !user.id
  });

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

  const [saveProject] = useMutation(SAVE_PROJECT, {
    refetchQueries: [{ query: GET_MY_PROJECTS, variables: { requesterId: user.id } }],
    onCompleted: () => {
      toast({ title: "Projeto solicitado com sucesso!" });
      setModalOpen(false);
    },
    onError: (error) => {
      toast({ title: "Erro ao solicitar projeto", description: error.message });
    }
  });

  const handleNewProjectSubmit = (formData) => {
    formData.requester = user.id;
    saveProject({ variables: formData });
  };
  
  // Função para filtrar projetos baseada na busca
  const getFilteredProjects = () => {
    if (!data?.findAllProjectsByRequester) return [];
    
    if (!searchQuery.trim()) return data.findAllProjectsByRequester;
    
    const query = searchQuery.toLowerCase();
    return data.findAllProjectsByRequester.filter((project) => 
      project.name.toLowerCase().includes(query) || 
      project.objective.toLowerCase().includes(query) ||
      project.targetAudience.toLowerCase().includes(query) ||
      project.summaryScope.toLowerCase().includes(query) ||
      project.group?.name.toLowerCase().includes(query)
    );
  };

  // Estados de loading e error
  if (loading) return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-gray-500">Carregando seus projetos...</p>
        </div>
      </div>
    </SidebarProvider>
  );
  
  if (error) return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-red-500">Erro ao carregar projetos: {error.message}</p>
        </div>
      </div>
    </SidebarProvider>
  );

  const filteredProjects = getFilteredProjects();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="bg-gray-50">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              Meus Projetos
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
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">Meus Projetos</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredProjects.length} {filteredProjects.length === 1 ? "projeto encontrado" : "projetos encontrados"}
                  </p>
                </div>
              </div>

              {data?.findAllProjectsByRequester && data.findAllProjectsByRequester.length > 0 ? (
                filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        refetch={refetch}
                        groups={[]} // Passando array vazio já que não vamos editar
                        readonly={true} // Esta propriedade desativa a edição
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent>
                      <NoSearchResultsMessage
                        query={searchQuery}
                        onClearSearch={() => setSearchQuery("")}
                      />
                    </CardContent>
                  </Card>
                )
              ) : (
                <Card>
                  <CardContent>
                    <EmptyProjectsMessage />
                  </CardContent>
                </Card>
              )}
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

// Componentes de mensagens EmptyProjectsMessage e NoSearchResultsMessage
function EmptyProjectsMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <ClipboardX className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Você ainda não tem projetos</h3>
      <p className="text-gray-500 text-center mb-6">
        Clique no botão "Solicitar Projeto" acima para criar seu primeiro projeto.
      </p>
    </div>
  );
}

function NoSearchResultsMessage({ query, onClearSearch }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <FileText className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum projeto encontrado</h3>
      <p className="text-gray-500 max-w-md mb-6">
        Não encontramos nenhum projeto com o termo "{query}".
      </p>
      <Button variant="outline" onClick={onClearSearch}>
        Limpar pesquisa
      </Button>
    </div>
  );
}

