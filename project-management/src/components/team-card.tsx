import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus } from "lucide-react";
import { gql, useMutation } from "@apollo/client";
import { toast } from "@/hooks/use-toast";
import { ActionConfirmationModal } from "@/components/modal/action-confirmation-modal";

interface Student {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  professor: string;
  project: string | null;
  members?: number;
  memberInfos?: Student[];
  availableForProjects?: boolean;
}

const UPDATE_GROUP_AVAILABILITY = gql`
  mutation UpdateGroupAvailability($id: ID!, $availableForProjects: Boolean!) {
    updateGroup(id: $id, availableForProjects: $availableForProjects) {
      id
      availableForProjects
    }
  }
`;

const REMOVE_STUDENT_FROM_GROUP = gql`
  mutation RemoveStudentFromGroup($groupId: ID!, $studentId: ID!) {
    groupRemoveStudent(groupId: $groupId, studentId: $studentId) {
      students {
        id
        name
      }
    }
  }
`;

interface TeamCardProps {
  team: Team;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  refetch: () => void;
  onOpenAddMemberModal?: (groupId: string) => void;
  onOpenAssignProjectModal?: (groupId: string) => void;
  readonly?: boolean; // ✅ Nova propriedade para controle de edição
}

export function TeamCard({
  team,
  setTeams,
  refetch,
  onOpenAddMemberModal,
  onOpenAssignProjectModal,
  readonly = false, // ✅ Valor padrão como false
}: TeamCardProps) {
  const [membersOpen, setMembersOpen] = useState(false);
  const [updateGroup] = useMutation(UPDATE_GROUP_AVAILABILITY);
  const [removeStudent, { loading: removeLoading }] = useMutation(REMOVE_STUDENT_FROM_GROUP, {
    onCompleted: (data) => {
      if (data.groupRemoveStudent && Array.isArray(data.groupRemoveStudent.students)) {
        setTeams(prevTeams =>
          prevTeams.map(prevTeam =>
            prevTeam.id === team.id
              ? {
                  ...prevTeam,
                  members: data.groupRemoveStudent.students.length,
                  memberInfos: data.groupRemoveStudent.students,
                }
              : prevTeam
          )
        );
        toast({
          title: "Sucesso",
          description: "Estudante removido da equipe com sucesso.",
        });
      } else {
        toast({
          title: "Aviso",
          description: "A operação foi concluída, mas houve um problema com a resposta do servidor.",
          variant: "destructive",
        });
        refetch();
      }
    },
    onError: (err) => {
      console.error("Erro ao remover estudante da equipe:", err);
      toast({
        title: "Erro",
        description: `Falha ao remover estudante: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleToggleAvailability = () => {
    if (readonly) return; // ✅ Impede ações no modo readonly
    updateGroup({
      variables: {
        id: team.id,
        availableForProjects: !team.availableForProjects,
      },
    }).then(() => {
      setTeams(prevTeams =>
        prevTeams.map(prevTeam =>
          prevTeam.id === team.id
            ? { ...prevTeam, availableForProjects: !team.availableForProjects }
            : prevTeam
        )
      );
    }).catch((err) => {
      console.error("Erro ao atualizar disponibilidade da equipe:", err);
    });
  };

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (readonly) return; // ✅ Impede ações no modo readonly
    toast({
      title: "Removendo estudante...",
      description: `Removendo ${studentName} da equipe ${team.name}`,
    });

    removeStudent({
      variables: {
        groupId: team.id,
        studentId,
      }
    }).catch(() => {
      refetch();
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-[220px] flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
            <div
              className="inline-flex items-center rounded-full border border-gray-200 bg-transparent px-2.5 py-0.5 text-xs font-normal text-gray-700 cursor-pointer"
              onClick={() => setMembersOpen(true)}
            >
              {team.members} membros
            </div>
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

      {!readonly && ( // ✅ Exibe os botões de controle apenas se não for readonly
        <div>
          <Separator />
          <CardFooter className="pt-3 pb-3 flex gap-2">
            {team.availableForProjects && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onOpenAssignProjectModal?.(team.id)} // ✅ funcional
              >
                Atribuir projeto
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={handleToggleAvailability}
            >
              {team.availableForProjects ? "Desativar equipe" : "Ativar equipe"}
            </Button>
          </CardFooter>
        </div>
      )}

      <Dialog open={membersOpen} onOpenChange={setMembersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Membros da Equipe {team.name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {team.memberInfos && team.memberInfos.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Esta equipe não possui membros.</p>
            ) : (
              <ul className="space-y-2">
                {team.memberInfos?.map((student) => (
                  <li key={student.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <span className="text-sm text-gray-700">{student.name}</span>
                    {!readonly && ( // ✅ Botões de controle no popup também respeitam o modo readonly
                      <ActionConfirmationModal
                        title={`Remover ${student.name}`}
                        description={`Tem certeza que deseja remover ${student.name} da equipe ${team.name}?`}
                        confirmText="Remover"
                        cancelText="Cancelar"
                      >
                        {(show) => (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={show(() => handleRemoveStudent(student.id, student.name))}
                            disabled={removeLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </ActionConfirmationModal>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!readonly && ( // ✅ Botão de adicionar membro respeita o modo readonly
            <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
              <Button variant="outline" onClick={() => setMembersOpen(false)}>
                Fechar
              </Button>
              {onOpenAddMemberModal && (
                <Button
                  variant="default"
                  onClick={() => {
                    setMembersOpen(false);
                    onOpenAddMemberModal(team.id);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Membro
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
