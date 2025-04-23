import { useState } from "react";
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
    $expectedStartDate: String!, 
    $status: ProjectStatus!
  ) {
    updateProject(
      id: $id, 
      name: $name, 
      objective: $objective, 
      summaryScope: $summaryScope, 
      targetAudience: $targetAudience,
      expectedStartDate: $expectedStartDate,
      status: $status
    ) {
      id
      name
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
}

export function ProjectCard({ project, onEdit, onDelete, onAssign, refetch }: ProjectCardProps) {
    // Estado para controlar o modo de edição
    const [isEditing, setIsEditing] = useState(false);

    // Estado para armazenar os dados editados
    const [editedProject, setEditedProject] = useState<Project>({ ...project });

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

    // Função para lidar com mudanças nos campos do projeto
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Função para formatar a data no formato YYYY-MM-DD para o backend
    const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return "";

        // Verifica se já está no formato YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString; // Retorna a data como está se já estiver no formato correto
        }

        try {
            // Cria uma data com base na string fornecida
            const date = new Date(dateString);

            // Verifica se é uma data válida
            if (isNaN(date.getTime())) {
                return "";
            }

            // Formata no padrão YYYY-MM-DD (usando o fuso horário local para evitar problemas)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (e) {
            console.error("Erro ao formatar data:", e);
            return "";
        }
    };

    // Função para salvar as alterações
    const handleSave = () => {
        try {
            // Formata a data corretamente para o backend
            const formattedDate = formatDateForBackend(editedProject.expectedStartDate);

            updateProject({
                variables: {
                    id: project.id,
                    name: editedProject.name,
                    objective: editedProject.objective,
                    summaryScope: editedProject.summaryScope,
                    targetAudience: editedProject.targetAudience,
                    expectedStartDate: formattedDate,
                    status: editedProject.status
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

    // Função para formatar a data para exibição
    const formatDate = (dateString: string) => {
        if (!dateString) return "Não definida";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('pt-BR').format(date);
        } catch (e) {
            return dateString;
        }
    };

    // Função para obter a cor do status
    const getStatusColor = (status: string) => {
        switch (status) {
            case ProjectStatus.PENDING_ANALYSIS:
                return "text-yellow-600 bg-yellow-100 hover:bg-yellow-100";
            case ProjectStatus.UNDER_ANALYSIS:
                return "text-blue-600 bg-blue-100 hover:bg-blue-100";
            case ProjectStatus.REJECTED:
                return "text-red-600 bg-red-100 hover:bg-red-100";
            case ProjectStatus.IN_PROGRESS:
                return "text-green-600 bg-green-100 hover:bg-green-100";
            case ProjectStatus.FINISHED:
                return "text-purple-600 bg-purple-100 hover:bg-purple-100";
            default:
                return "text-gray-600 bg-gray-100 hover:bg-gray-100";
        }
    };

    return (
        <Card className="shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="pt-3 pb-2 flex flex-row justify-between items-start">
                <div className="flex flex-col">
                    {isEditing ? (
                        <Input
                            name="name"
                            value={editedProject.name}
                            onChange={handleInputChange}
                            className="text-primary-dark font-bold text-xl mb-1"
                        />
                    ) : (
                        <>
                            <CardTitle className="text-primary-dark">{project.name}</CardTitle>
                            {project.group && (
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Users className="h-3.5 w-3.5 mr-1.5" />
                                    {project.group.name} - {project.group.coordinator?.name || "Sem coordenador"}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Status como label no modo visualização e Select no modo edição */}
                <div className="w-36 flex justify-end">
                    {isEditing ? (
                        <Select
                            value={editedProject.status}
                            onValueChange={(value) => setEditedProject(prev => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger className={`h-7 text-xs px-2 ${getStatusColor(editedProject.status)}`}>
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
                    ) : (
                        <div className="pointer-events-none flex justify-end">
                            <Badge variant="outline" className={`h-7 text-xs px-2 whitespace-nowrap ${getStatusColor(project.status)}`}>
                                {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                            </Badge>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
                {isEditing ? (
                    <>
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
                                onClick={() => setIsEditing(true)}
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