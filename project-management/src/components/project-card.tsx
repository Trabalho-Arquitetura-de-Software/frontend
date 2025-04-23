import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Pencil, Save, X, Users } from "lucide-react";
import { useMutation, gql } from "@apollo/client";
import { toast } from "@/hooks/use-toast";

// Mutation unificada para atualizar o projeto completo
const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!, 
    $name: String!, 
    $objective: String!, 
    $summaryScope: String!, 
    $targetAudience: String!,
    $expectedStartDate: Date!, 
    $status: ProjectStatus!,
    $group: ID
  ) {
    updateProject(
      id: $id, 
      name: $name, 
      objective: $objective, 
      summaryScope: $summaryScope, 
      targetAudience: $targetAudience,
      expectedStartDate: $expectedStartDate,
      status: $status,
      group: $group
    ) {
      id
      name
      group {
        id
        name
        coordinator {
          name
        }
      }
    }
  }
`;

// Enums para status do projeto
// eslint-disable-next-line react-refresh/only-export-components
export enum ProjectStatus {
    PENDING_ANALYSIS = "PENDING_ANALYSIS",
    UNDER_ANALYSIS = "UNDER_ANALYSIS",
    REJECTED = "REJECTED",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
}

const statusLabels = {
    [ProjectStatus.PENDING_ANALYSIS]: "Pendente de Análise",
    [ProjectStatus.UNDER_ANALYSIS]: "Em Análise",
    [ProjectStatus.REJECTED]: "Rejeitado",
    [ProjectStatus.IN_PROGRESS]: "Em Andamento",
    [ProjectStatus.FINISHED]: "Finalizado",
};

interface Project {
    id: string;
    name: string;
    objective: string;
    status: string;
    summaryScope: string;
    targetAudience: string;
    expectedStartDate: string;
    groupId?: string | null; // Adicionado para guardar apenas o ID durante edição
    group?: {
        id: string;
        name: string;
        coordinator?: {
            name: string;
        };
    } | null;
}

interface ProjectCardProps {
    project: Project;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onAssign?: (id: string) => void;
    refetch?: () => void;
    groups: Array<{ id: string; name: string }>;
}

export function ProjectCard({ project, onEdit, onDelete, onAssign, refetch, groups }: ProjectCardProps) {
    // Estado para controlar o modo de edição
    const [isEditing, setIsEditing] = useState(false);

    // Estado para armazenar os dados editados
    const [editedProject, setEditedProject] = useState<Project>({
        ...project,
        // Garantir que o group.id esteja disponível ou seja null
        groupId: project.group?.id || null
    });

    // Adicione este useEffect logo após a definição do estado
    useEffect(() => {
        setEditedProject({
            ...project,
            groupId: project.group?.id || "none"
        });
    }, [project]);

    // Mutation para atualizar o projeto
    const [updateProject, { loading: updateLoading }] = useMutation(UPDATE_PROJECT, {
        onCompleted: () => {
            toast({
                title: "Projeto atualizado",
                description: "O projeto foi atualizado com sucesso."
            });
            if (refetch) refetch();
            setIsEditing(false);
        },
        onError: (error) => {
            toast({
                title: "Erro ao atualizar projeto",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    // Função corrigida para formatar a data no formato YYYY-MM-DD com ajuste de timezone
    const formatDateForBackend = (dateString: string | Date): string => {
        if (!dateString) return "";

        try {
            // Se for uma string de data YYYY-MM-DD, extraímos diretamente
            if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateString;
            }

            // Cria uma data com base na string ou objeto Date fornecido
            const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

            // Verifica se é uma data válida
            if (isNaN(date.getTime())) {
                console.error("Data inválida:", dateString);
                return "";
            }

            // Ajusta o timezone para considerar a data local
            // Obtém a data no formato ISO
            const isoDate = date.toISOString().split('T')[0];
            console.log("Data ISO extraída:", isoDate); // Para debug

            return isoDate;

        } catch (e) {
            console.error("Erro ao formatar data:", e);
            return "";
        }
    };

    // Função para lidar com mudanças nos campos do projeto
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Função para salvar as alterações
    const handleSave = () => {
        try {
            // Formata a data corretamente para o backend
            const formattedDate = formatDateForBackend(editedProject.expectedStartDate);

            if (!formattedDate) {
                toast({
                    title: "Erro ao formatar dados",
                    description: "A data de início fornecida é inválida.",
                    variant: "destructive"
                });
                return;
            }

            console.log("Enviando data formatada:", formattedDate); // Para debug

            updateProject({
                variables: {
                    id: project.id,
                    name: editedProject.name,
                    objective: editedProject.objective,
                    summaryScope: editedProject.summaryScope,
                    targetAudience: editedProject.targetAudience,
                    expectedStartDate: formattedDate,
                    status: editedProject.status,
                    group: editedProject.groupId === "none" ? null : editedProject.groupId
                }
            });
        } catch (error) {
            toast({
                title: "Erro ao formatar dados",
                description: "Ocorreu um erro ao preparar os dados para salvar.",
                variant: "destructive"
            });
            console.error("Erro ao salvar projeto:", error);
        }
    };

    // Função para cancelar a edição
    const handleCancel = () => {
        setEditedProject({ ...project });
        setIsEditing(false);
    };

    // Versão mais simples - apenas retorna a data no formato YYYY-MM-DD 
    // ou formata manualmente para DD/MM/YYYY
    const formatDate = (dateString: string) => {
        if (!dateString) return "Não definida";

        try {
            // Extrai apenas a parte da data (YYYY-MM-DD)
            const datePart = dateString.split('T')[0];

            // Divide em ano, mês e dia
            const [year, month, day] = datePart.split('-');

            // Retorna no formato DD/MM/YYYY
            return `${day}/${month}/${year}`;
        } catch (e) {
            console.error("Erro ao formatar data:", e);
            return dateString;
        }
    };

    // Função modificada para obter a cor do status
    const getStatusColor = (status: string) => {
        switch (status) {
            case ProjectStatus.PENDING_ANALYSIS:
                return "text-yellow-600 bg-yellow-50 [&>svg]:text-gray-700";
            case ProjectStatus.UNDER_ANALYSIS:
                return "text-blue-600 bg-blue-50 [&>svg]:text-gray-700";
            case ProjectStatus.REJECTED:
                return "text-red-600 bg-red-50 [&>svg]:text-gray-700";
            case ProjectStatus.IN_PROGRESS:
                return "text-green-600 bg-green-50 [&>svg]:text-gray-700";
            case ProjectStatus.FINISHED:
                return "text-purple-600 bg-purple-50 [&>svg]:text-gray-700";
            default:
                return "text-gray-600 bg-gray-50 [&>svg]:text-gray-700";
        }
    };

    const handleEditClick = () => {
        // Reinicializa o estado com os valores atuais do projeto antes de entrar no modo de edição
        setEditedProject({
            ...project,
            groupId: project.group?.id || "none" // Usa "none" quando não há grupo associado
        });
        setIsEditing(true);
    };

    return (
        <Card className="shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="pt-3 pb-2">
                {/* Layout ajustado para modo de edição */}
                {isEditing ? (
                    <div className="grid grid-cols-3 gap-4 w-full">
                        <div className="col-span-2">
                            <label className="text-sm font-medium mb-1 block">Nome do projeto:</label>
                            <Input
                                name="name"
                                value={editedProject.name}
                                onChange={handleInputChange}
                                className="text-primary-dark font-semibold"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="text-sm font-medium mb-1 block">Status:</label>
                            <Select
                                value={editedProject.status}
                                onValueChange={(value) => setEditedProject(prev => ({ ...prev, status: value }))}
                            >
                                <SelectTrigger
                                    className={`w-full text-wrap border-gray-300 ${getStatusColor(editedProject.status)}`}
                                >
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ProjectStatus).map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {statusLabels[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <CardTitle className="text-primary-dark">{project.name}</CardTitle>
                        </div>

                        {/* Status como badge no modo visualização */}
                        <div className="flex justify-end">
                            <Badge variant="outline" className={`h-7 text-xs px-2 whitespace-nowrap ${getStatusColor(project.status)}`}>
                                {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                            </Badge>
                        </div>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
                {isEditing ? (
                    <>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Grupo:</label>
                            <Select
                                value={editedProject.groupId || "none"}
                                onValueChange={(value) =>
                                    setEditedProject(prev => ({
                                        ...prev,
                                        groupId: value === "none" ? null : value
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um grupo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sem grupo</SelectItem>
                                    {groups.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Data de Início:</label>
                            <Input
                                name="expectedStartDate"
                                type="date"
                                value={editedProject.expectedStartDate.slice(0, 10)}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Objetivo:</label>
                            <Textarea
                                name="objective"
                                value={editedProject.objective}
                                onChange={handleInputChange}
                                className="w-full h-20 resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Público Alvo:</label>
                            <Input
                                name="targetAudience"
                                value={editedProject.targetAudience}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Resumo do Escopo:</label>
                            <Textarea
                                name="summaryScope"
                                value={editedProject.summaryScope}
                                onChange={handleInputChange}
                                className="w-full h-20 resize-none"
                            />
                        </div>


                        {/* Botões de salvar e cancelar */}
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-600"
                                onClick={handleCancel}
                                disabled={updateLoading}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Cancelar
                            </Button>
                            <Button
                                size="sm"
                                variant="default"
                                className="bg-primary-dark hover:bg-primary-darker text-white"
                                onClick={handleSave}
                                disabled={updateLoading}
                            >
                                <Save className="h-4 w-4 mr-1" />
                                Salvar
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Grupo e coordenador como campo normal */}
                        <p className="text-sm">
                            <span className="font-medium">Grupo:</span> {project.group
                                ? `${project.group.name} - ${project.group.coordinator?.name || "Sem coordenador"}`
                                : "Sem grupo"}
                        </p>

                        <p className="text-sm">
                            <span className="font-medium">Objetivo:</span> {project.objective?.substring(0, 100)}{project.objective?.length > 100 ? '...' : ''}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Público Alvo:</span> {project.targetAudience}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Resumo do Escopo:</span> {project.summaryScope?.substring(0, 100)}{project.summaryScope?.length > 100 ? '...' : ''}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Data de Início:</span> {formatDate(project.expectedStartDate)}
                        </p>

                        {/* Botão de editar sempre visível */}
                        <div className="mt-4 flex justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-primary-dark hover:text-primary-darker"
                                onClick={handleEditClick}
                            >
                                <Pencil className="h-4 w-4 mr-1" />
                                Editar
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}