import { useEffect, useState } from "react"
import { Plus, Search, Users } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { gql, useQuery, useMutation } from "@apollo/client"
import { NewGroupModal, CreateGroupData } from "@/components/modal/new-group-modal"
import { TeamCard } from "@/components/team-card"
import { AddMemberModal } from "@/components/modal/AddMemberModal"
import { AssignProjectModal } from "@/components/modal/AssignProjectModal"

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

interface Team {
  id: string
  name: string
  professor: string
  project: string | null
  members?: number
  memberInfos?: Student[]
  availableForProjects?: boolean
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
  mutation SaveGroup($coordinator: ID!, $name: String!) {
    saveGroup(coordinator: $coordinator, name: $name) {
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
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const { data, loading, error, refetch } = useQuery<{ findAllGroups: Group[] }>(FIND_ALL_GROUPS)
  const [createGroup] = useMutation(SAVE_GROUP)

  const handleCreateGroup = (data: CreateGroupData) => {
    createGroup({
      variables: {
        name: data.name,
        coordinator: data.coordinatorId,
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

  const handleOpenAddMemberModal = (groupId: string) => {
    setSelectedGroupId(groupId)
    setAddMemberModalOpen(true)
  }

  const handleOpenAssignProjectModal = (groupId: string) => {
    setSelectedGroupId(groupId)
    setAssignModalOpen(true)
  }

  useEffect(() => {
    if (data?.findAllGroups) {
      const mappedTeams: Team[] = data.findAllGroups.map((group) => ({
        id: group.id,
        name: group.name,
        professor: group.coordinator?.name ?? "Desconhecido",
        project: group.projects?.[0]?.name ?? null,
        members: group.students.length,
        memberInfos: group.students,
        availableForProjects: group.availableForProjects,
      }))
      setTeams(mappedTeams)
    }
  }, [data])

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
                    <TeamCard
                      key={team.id}
                      team={team}
                      setTeams={setTeams}
                      refetch={refetch}
                      onOpenAddMemberModal={handleOpenAddMemberModal}
                      onOpenAssignProjectModal={handleOpenAssignProjectModal}
                    />
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

      {selectedGroupId && (
        <>
          <AddMemberModal
            open={addMemberModalOpen}
            onClose={() => setAddMemberModalOpen(false)}
            groupId={selectedGroupId}
            refetch={refetch}
          />

          <AssignProjectModal
            open={assignModalOpen}
            groupId={selectedGroupId}
            onClose={() => setAssignModalOpen(false)}
            refetch={refetch}
          />
        </>
      )}
    </SidebarProvider>
  )
}
