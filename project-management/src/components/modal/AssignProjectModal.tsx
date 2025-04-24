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

const ASSIGN_PROJECT = gql`
  mutation AssignProjectToGroup($groupId: ID!, $projectId: ID!) {
    assignProjectToGroup(groupId: $groupId, projectId: $projectId) {
      id
      name
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
  const [assignProject, { loading: assigning }] = useMutation(ASSIGN_PROJECT)

  const handleAssign = async () => {
    await assignProject({
      variables: {
        groupId,
        projectId: selectedProject,
      },
    })
    refetch()
    onClose()
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

          <Button disabled={!selectedProject || assigning} onClick={handleAssign}>
            Atribuir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
