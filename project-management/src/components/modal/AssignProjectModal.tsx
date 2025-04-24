import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { gql, useQuery, useMutation } from "@apollo/client"
import { useState } from "react"

const FIND_ALL_PROJECTS = gql`
  query FindAllProjects {
    findAllProjects {
      id
      name
    }
  }
`

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $group: ID) {
    updateProject(id: $id, group: $group) {
      id
      name
      group {
        id
        name
      }
    }
  }
`

interface Project {
  id: string
  name: string
}

interface Props {
  open: boolean
  groupId: string
  onClose: () => void
  refetch: () => void
}

interface FindAllProjectsData {
  findAllProjects: Project[]
}

export function AssignProjectModal({ open, groupId, onClose, refetch }: Props) {
  const { data, loading } = useQuery<FindAllProjectsData>(FIND_ALL_PROJECTS)
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT)

  const handleAssign = async () => {
    try {
      await updateProject({
        variables: {
          id: selectedProject,  // id do projeto
          group: groupId        // id do grupo
        },
      })
      refetch()
      onClose()
    } catch (error) {
      console.error("Erro ao atribuir projeto à equipe:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir Projeto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um projeto" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading">Carregando...</SelectItem>
              ) : (
                data?.findAllProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Button disabled={!selectedProject || updating} onClick={handleAssign}>
            Atribuir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
