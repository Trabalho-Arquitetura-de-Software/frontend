import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export interface CreateGroupData {
    name: string
    coordinatorId: string
    studentIds: string[]
}

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    onSubmit: (data: CreateGroupData) => void
}

export function NewGroupModal({ open, onOpenChange, onClose, onSubmit }: Props) {
    const [name, setName] = useState("")
    const [coordinatorId, setCoordinatorId] = useState("")
    const [studentIds, setStudentIds] = useState<string[]>([])

    const handleSubmit = () => {
        onSubmit({ name, coordinatorId, studentIds })
        setName("")
        setCoordinatorId("")
        setStudentIds([])
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Nova Equipe</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input placeholder="Nome da equipe" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="ID do coordenador" value={coordinatorId} onChange={(e) => setCoordinatorId(e.target.value)} />
                    <Input
                        placeholder="IDs dos estudantes (separados por vírgula)"
                        value={studentIds.join(',')}
                        onChange={(e) => setStudentIds(e.target.value.split(',').map(s => s.trim()))}
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Criar Equipe</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
