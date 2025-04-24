import { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import AsyncSelect from "react-select/async"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Query para buscar estudantes
const FIND_ALL_STUDENTS = gql`
  query FindAllStudents {
    findAllUsers {
      id
      name
      email
    }
  }
`

// Mutation para adicionar estudante
const GROUP_ADD_STUDENT = gql`
  mutation GroupAddStudent($groupId: ID!, $studentEmail: String!) {
    groupAddStudent(groupId: $groupId, studentEmail: $studentEmail) {
      id
      name
      students {
        id
        name
      }
    }
  }
`

interface Student {
  email: string
  name: string
  id: string
}

interface AddMemberModalProps {
  open: boolean
  onClose: () => void
  groupId: string
  refetch: () => void
}

export function AddMemberModal({ open, onClose, groupId, refetch }: AddMemberModalProps) {
  const [selectedOption, setSelectedOption] = useState<{ label: string; value: string } | null>(null)
  const [groupAddStudent, { loading }] = useMutation(GROUP_ADD_STUDENT)

  // Query de estudantes
  const { data: studentData, loading: loadingStudents } = useQuery<{ findAllUsers: Student[] }>(FIND_ALL_STUDENTS)

  // Carrega as opções de e-mails filtrados
  const loadOptions = async (inputValue: string) => {
    if (!studentData) return []

    // Filtra os estudantes pelo e-mail
    const students = studentData.findAllUsers.filter(student =>
      student.email.toLowerCase().includes(inputValue.toLowerCase())
    )

    // Mapeia para a estrutura esperada pelo react-select
    return students.map((student) => ({
      label: student.email,
      value: student.email,
    }))
  }

  const handleSelectChange = (option: { label: string; value: string } | null) => {
    setSelectedOption(option)
  }

  const handleAddMember = async () => {
    if (!selectedOption) return
    try {
      await groupAddStudent({
        variables: {
          groupId,
          studentEmail: selectedOption.value,
        },
      })
      refetch()
      onClose()
    } catch (error) {
      console.error("Erro ao adicionar membro:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-lg font-semibold leading-none tracking-tight mb-4">
          Adicionar Membro
        </h2>
        <AsyncSelect
          placeholder="Buscar usuário por e-mail..."
          loadOptions={loadOptions}
          defaultOptions
          onChange={handleSelectChange}
          isClearable
          isSearchable
          isLoading={loadingStudents}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddMember} disabled={!selectedOption || loading}>
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
