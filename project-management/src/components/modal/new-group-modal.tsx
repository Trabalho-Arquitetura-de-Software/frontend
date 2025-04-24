import { useQuery, gql } from "@apollo/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export interface CreateGroupData {
  name: string
  coordinatorId: string
}

interface NewGroupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateGroupData) => void
  onClose: () => void
}

interface User {
  id: string
  name: string
}

interface UsersQueryData {
  findUserByRole: User[]
}

const FIND_ALL_PROFESSORS = gql`
  query {
    findUserByRole(role: PROFESSOR) {
      id
      name
    }
  }
`

export function NewGroupModal({
  open,
  onOpenChange,
  onSubmit,
  onClose,
}: NewGroupModalProps) {
  const [name, setName] = useState("")
  const [coordinatorId, setCoordinatorId] = useState("")

  const { data: professorsData } = useQuery<UsersQueryData>(FIND_ALL_PROFESSORS)

  const handleSubmit = () => {
    if (!name || !coordinatorId) return
    onSubmit({ name, coordinatorId })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Equipe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium ">Nome da Equipe</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Coordenador</label>
            <Select onValueChange={setCoordinatorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o coordenador" />
              </SelectTrigger>
              <SelectContent>
                {professorsData?.findUserByRole.map((professor) => (
                  <SelectItem key={professor.id} value={professor.id}>
                    {professor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
