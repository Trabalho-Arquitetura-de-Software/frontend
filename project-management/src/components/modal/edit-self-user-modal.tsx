import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { toast } from '@/hooks/use-toast'
import { gql, useMutation } from '@apollo/client';
import { useUser } from '@/contexts/user-context';

// Mutation corrigida para atualizar dados do usuário
const UPDATE_USER_PROFILE = gql`
  mutation UpdateUser(
    $id: ID!,
    $name: String!,
    $email: String!,
    $password: String,
    $affiliatedSchool: String
  ) {
    updateUser(
      id: $id,
      name: $name,
      email: $email,
      password: $password,
      affiliatedSchool: $affiliatedSchool
    ) {
      id
      name
      email
      affiliatedSchool
    }
  }
`;

interface EditSelfUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditSelfUserModal({ open, onOpenChange }: EditSelfUserModalProps) {
    // Estados para os campos do formulário
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [school, setSchool] = useState("");
    const [role, setRole] = useState("");

    // Estado para controlar a edição de senha
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    // Estado para indicar se o formulário está sendo enviado
    const [isSaving, setIsSaving] = useState(false);

    // Obter contexto do usuário
    const { user, updateUser } = useUser();

    // Mutation para atualizar o perfil
    const [updateUserProfile, { loading, error }] = useMutation(UPDATE_USER_PROFILE, {
        onCompleted: (data) => {
            toast({
                title: "Perfil atualizado",
                description: "Suas informações foram atualizadas com sucesso."
            });

            // Atualiza os dados no contexto (que também atualiza o localStorage)
            updateUser({
                name: data.updateUser.name,
                email: data.updateUser.email,
                affiliatedSchool: data.updateUser.affiliatedSchool
            });

            // Fecha o modal
            onOpenChange(false);
            setIsSaving(false);
        },
        onError: (error) => {
            toast({
                title: "Erro ao atualizar perfil",
                description: error.message,
                variant: "destructive"
            });
            setIsSaving(false);
        }
    });

    // Carrega os dados do usuário ao abrir o modal
    useEffect(() => {
        if (open) {
            // Usa os dados do contexto em vez de ler diretamente do localStorage
            setUserId(user.id || "");
            setName(user.name || "");
            setEmail(user.email || "");
            setPassword("••••••••"); // Senha mocada
            setSchool(user.affiliatedSchool || "");
            setRole(user.role || "");
            setIsEditingPassword(false);
        }
    }, [open, user]);

    // Função para salvar as alterações
    const handleSave = () => {
        setIsSaving(true);

        // Prepara as variáveis para a mutation
        const variables: any = {
            id: userId,
            name,
            email,
            affiliatedSchool: school
        };

        // Só inclui a senha se ela tiver sido alterada
        if (isEditingPassword && password !== "••••••••") {
            variables.password = password;
        }

        // Executa a mutation
        updateUserProfile({ variables });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Meu Perfil</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Nome */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Senha */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Senha
                        </Label>
                        <div className="col-span-3 flex items-center">
                            <div className="relative flex-grow">
                                <Input
                                    id="password"
                                    type={isEditingPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={!isEditingPassword}
                                    className="pr-10"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {isEditingPassword ? (
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => {
                                                    setIsEditingPassword(false)
                                                    setPassword("••••••••");
                                                }
                                                }
                                                className="text-gray-500 hover:text-gray-700"
                                                aria-label="Cancelar edição de senha"
                                            >
                                                <X size={18} />
                                            </button>
                                            <button
                                                onClick={() => setIsEditingPassword(false)}
                                                className="text-green-500 hover:text-green-700"
                                                aria-label="Confirmar senha"
                                            >
                                                <Check size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsEditingPassword(true);
                                                setPassword("");
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                            aria-label="Editar senha"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Escola afiliada */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="school" className="text-right">
                            Escola afiliada
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="school"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Papel (somente leitura) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Papel
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="role"
                                value={role}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || loading}>
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}