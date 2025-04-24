import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { gql, useQuery } from "@apollo/client";
import { TeamCard } from "@/components/team-card";

const FIND_GROUPS_BY_COORDINATOR = gql`
  query FindAllGroupByCoordinator($coordinator_id: ID!) {
    findAllGroupByCoordinator(coordinator_id: $coordinator_id) {
      id
      name
      availableForProjects
      coordinator {
        name
        id
      }
      projects {
        name
        id
      }
      students {
        name
        id
      }
    }
  }
`;

const FIND_GROUPS_BY_STUDENT = gql`
  query FindAllGroupsByStudentId($student_id: ID!) {
    findAllGroupsByStudentId(student_id: $student_id) {
      id
      name
      availableForProjects
      coordinator {
        name
        id
      }
      projects {
        name
        id
      }
      students {
        name
        id
      }
    }
  }
`;

interface Team {
  id: string;
  name: string;
  professor: string;
  project: string | null;
  members?: number;
  memberInfos?: { id: string; name: string }[];
}

function MyTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const usuario = JSON.parse(localStorage.getItem("user") || "{}");

  // Escolhe a query correta com base no role do usuário
  const { data, loading, error } = useQuery(
    usuario.role === "PROFESSOR" ? FIND_GROUPS_BY_COORDINATOR : FIND_GROUPS_BY_STUDENT,
    {
      variables: {
        coordinator_id: usuario.role === "PROFESSOR" ? usuario.id : undefined,
        student_id: usuario.role === "STUDENT" ? usuario.id : undefined,
      },
      skip: !usuario.id, // Evita executar a query se o usuário não estiver logado
    }
  );

  // Mapeia os dados da query para o formato esperado pelo TeamCard
  useEffect(() => {
    if (data) {
      const groups = usuario.role === "PROFESSOR" ? data.findAllGroupByCoordinator : data.findAllGroupsByStudentId;
      const mappedTeams: Team[] = groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        professor: group.coordinator?.name || "Desconhecido",
        project: group.projects?.[0]?.name || null,
        members: group.students.length,
        memberInfos: group.students,
      }));
      setTeams(mappedTeams);
    }
  }, [data, usuario.role]);

  useEffect(() => {
    const rootElement = document.getElementById("root")
    if (rootElement) {
      rootElement.style.maxWidth = "100%"
      rootElement.style.padding = "0"
      return () => {
        rootElement.style.maxWidth = "1280px"
        rootElement.style.padding = "2rem"
      }
    }
  }, [])

  // Filtrar equipes com base na busca
  const filteredTeams = searchQuery.trim()
    ? teams.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (team.project && team.project.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : teams;

  if (loading) return <p className="p-6 text-gray-500">Carregando equipes...</p>;
  if (error) return <p className="p-6 text-red-500">Erro ao carregar equipes: {error.message}</p>;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="bg-gray-50">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              Minhas Equipes
            </h1>
            <Separator orientation="vertical" className="h-6" />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar equipes..."
                className="pl-8 bg-gray-50 border-gray-200 focus-visible:ring-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">Equipes</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredTeams.length} {filteredTeams.length === 1 ? "equipe encontrada" : "equipes encontradas"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <TeamCard key={team.id} team={team} setTeams={setTeams} refetch={() => {}} readonly={true} />
                  ))
                ) : (
                  <p className="text-gray-600 col-span-full">Nenhuma equipe encontrada.</p>
                )}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default MyTeams;