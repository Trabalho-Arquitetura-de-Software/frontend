import { useEffect, useState } from "react"
import { Plus, Search, Users } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ProjectDetailsModal } from "@/components/modal/project-details-modal"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { gql, useMutation } from "@apollo/client"
import { NewGroupModal, CreateGroupData } from "@/components/modal/new-group-modal"

interface Team {
  id: string
  name: string
  professor: string
  project: string | null
  members?: number
}

const SAVE_GROUP = gql`
  mutation SaveGroup($coordinator: ID!, $name: String!, $students: [ID!]!) {
    saveGroup(coordinator: $coordinator, name: $name, students: $students) {
      id
      name
      students {
        id
        name
      }
      coordinator {
        id
        name
      }
    }
  }
`

export function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [createGroup] = useMutation(SAVE_GROUP)

  const handleCreateGroup = (data: CreateGroupData) => {
    createGroup({
      variables: {
        name: data.name,
        coordinator: data.coordinatorId,
        students: data.studentIds,
      },
    })
      .then((res) => {
        console.log("Equipe criada com sucesso:", res.data.saveGroup)
        setNewGroupOpen(false)
      })
      .catch((err) => {
        console.error("Erro ao criar equipe:", err)
      })
  }

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

  useEffect(() => {
    const mockTeams: Team[] = [
      { id: "1", name: "Equipe Alfa", professor: "Ana Silva", project: "Sistema de Gestão Escolar", members: 5 },
      { id: "2", name: "Equipe Beta", professor: "Maria Oliveira", project: null, members: 4 },
      { id: "3", name: "Equipe Gama", professor: "Carlos Souza", project: "Aplicativo de Monitoramento", members: 6 },
      { id: "4", name: "Equipe Delta", professor: "Roberto Almeida", project: "Plataforma de E-learning", members: 5 },
      { id: "5", name: "Equipe Ômega", professor: "Juliana Santos", project: "Sistema de Análise de Dados", members: 4 },
      { id: "6", name: "Equipe Saiyagin", professor: "Fernando", project: null, members: 1 },
    ]
    setTeams(mockTeams)
  }, [])

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.project && team.project.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="bg-gray-50">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              Equipes
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
            <Button className="ml-auto" onClick={() => setNewGroupOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Equipe
            </Button>
          </header>

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">Todas as Equipes</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredTeams.length} {filteredTeams.length === 1 ? "equipe encontrada" : "equipes encontradas"}
                  </p>
                </div>
              </div>

              {filteredTeams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Users className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma equipe encontrada</h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    Não encontramos nenhuma equipe com os critérios de busca informados.
                  </p>
                  <Button onClick={() => setNewGroupOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Nova Equipe
                  </Button>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>

            <NewGroupModal
            open={newGroupOpen}
            onOpenChange={setNewGroupOpen}
            onSubmit={handleCreateGroup}
            onClose={() => setNewGroupOpen(false)} 
            />
    </SidebarProvider>
  )
}

function TeamCard({ team }: { team: Team }) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
          {team.members && (
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-transparent px-2.5 py-0.5 text-xs font-normal text-gray-700">
              {team.members} membros
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Professor</span>
            <span className="text-sm text-gray-700">{team.professor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Projeto</span>
            {team.project ? (
              <span className="text-sm text-gray-700">{team.project}</span>
            ) : (
              <span className="text-sm text-red-500">Sem projeto</span>
            )}
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-3 pb-3">
        {team.project ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="w-full">
                Ver detalhes
              </Button>
            </DialogTrigger>
            <ProjectDetailsModal team={team} />
          </Dialog>
        ) : (
          <Button variant="outline" size="sm" className="w-full">
            Atribuir projeto
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
