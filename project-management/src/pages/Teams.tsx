import { useEffect, useState } from "react"
import { Plus, Search, Users } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { gql, useQuery, useMutation } from "@apollo/client"
import { NewGroupModal, CreateGroupData } from "@/components/modal/new-group-modal"

interface Team {
  id: string
  name: string
  professor: string
  project: string | null
  members?: number
  memberNames?: string[]
  availableForProjects?: boolean
}

interface Student {
  id: string
  name: string
}

interface Project {
  id: string
  name: string
}

interface Group {
  id: string
  name: string
  availableForProjects: boolean
  coordinator: { id: string, name: string } | null
  students: Student[]
  projects: Project[]
}

const FIND_ALL_GROUPS = gql`
  query FindAllGroups {
    findAllGroups {
      id
      name
      availableForProjects
      coordinator {
        id
        name
      }
      students {
        id
        name
      }
      projects {
        id
        name
      }
    }
  }
`

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

const UPDATE_GROUP_AVAILABILITY = gql`
  mutation UpdateGroupAvailability($id: ID!, $availableForProjects: Boolean!) {
    updateGroup(id: $id, availableForProjects: $availableForProjects) {
      id
      availableForProjects
    }
  }
`

export function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [createGroup] = useMutation(SAVE_GROUP)

  const { data, loading, error, refetch } = useQuery<{ findAllGroups: Group[] }>(FIND_ALL_GROUPS)

  const handleCreateGroup = (data: CreateGroupData) => {
    createGroup({
      variables: {
        name: data.name,
        coordinator: data.coordinatorId,
        students: data.studentIds,
      },
    })
      .then(() => {
        setNewGroupOpen(false)
        refetch()
      })
      .catch((err) => {
        console.error("Erro ao criar equipe:", err)
      })
  }

  useEffect(() => {
    if (data && data.findAllGroups) {
      const mappedTeams: Team[] = data.findAllGroups.map((group) => ({
        id: group.id,
        name: group.name,
        professor: group.coordinator?.name ?? "Desconhecido",
        project: group.projects?.[0]?.name ?? null,
        members: group.students.length,
        memberNames: group.students.map((student) => student.name),
        availableForProjects: group.availableForProjects,
      }))
      setTeams(mappedTeams)
    }
  }, [data])

  // Corrige a responsividade de verdade
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 100) // atraso de 100ms

    return () => clearTimeout(timeout)
  }, [])

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.project && team.project.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) return <p className="p-6 text-gray-500">Carregando equipes...</p>
  if (error) return <p className="p-6 text-red-500">Erro ao carregar equipes: {error.message}</p>

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
                    <TeamCard key={team.id} team={team} setTeams={setTeams} />
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

function TeamCard({ team, setTeams }: { team: Team, setTeams: React.Dispatch<React.SetStateAction<Team[]>> }) {
  const [membersOpen, setMembersOpen] = useState(false)
  const [updateGroup] = useMutation(UPDATE_GROUP_AVAILABILITY)

  const handleToggleAvailability = () => {
    updateGroup({
      variables: {
        id: team.id,
        availableForProjects: !team.availableForProjects,
      },
    })
      .then(() => {
        setTeams((prevTeams) =>
          prevTeams.map((prevTeam) =>
            prevTeam.id === team.id
              ? { ...prevTeam, availableForProjects: !team.availableForProjects }
              : prevTeam
          )
        )
      })
      .catch((err) => {
        console.error("Erro ao atualizar disponibilidade da equipe:", err)
      })
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-[220px] flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
            {team.members && (
              <div
                className="inline-flex items-center rounded-full border border-gray-200 bg-transparent px-2.5 py-0.5 text-xs font-normal text-gray-700 cursor-pointer"
                onClick={() => setMembersOpen(true)}
              >
                {team.members} membros
              </div>
            )}
          </div>
          <div className="min-h-[20px] mt-2">
            {!team.availableForProjects && (
              <p className="text-xs text-red-500">Equipe desativada</p>
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
      </div>

      <div>
        <Separator />
        <CardFooter className="pt-3 pb-3 flex gap-2">
          {team.availableForProjects && (
            <Button variant="outline" size="sm" className="w-full">
              Atribuir projeto
            </Button>
          )}
          <Button
            variant={team.availableForProjects ? "destructive" : "default"}
            size="sm"
            className="w-full"
            onClick={handleToggleAvailability}
          >
            {team.availableForProjects ? "Desativar equipe" : "Ativar equipe"}
          </Button>
        </CardFooter>
      </div>

      <Dialog open={membersOpen} onOpenChange={setMembersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Membros da Equipe {team.name}</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2">
            {team.memberNames?.map((name, index) => (
              <li key={index} className="text-sm text-gray-700">{name}</li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMembersOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
