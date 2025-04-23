import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Copy } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from '@/hooks/use-toast'
import { UserRole } from '@/pages/users'
import { generatePassword } from '@/utils/password-geneator'

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    affiliatedSchool?: string;
}

export interface UpdateUserData {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    affiliatedSchool?: string;
}

interface EditUserModalProps {
    open: boolean;
    user: User | null;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    onSubmit: (userData: UpdateUserData) => void;
}

export function EditUserModal({ open, user, onOpenChange, onClose, onSubmit }: EditUserModalProps) {
    const [formData, setFormData] = useState<UpdateUserData>({
        id: '',
        name: '',
        email: '',
        role: UserRole.STUDENT,
        affiliatedSchool: '',
    });
    const [newPasswordGenerated, setNewPasswordGenerated] = useState(false);
    const [passwordCopied, setPasswordCopied] = useState(false);

    // Carrega os dados do usuário quando o modal é aberto ou o usuário muda
    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                affiliatedSchool: user.affiliatedSchool || '',
            });
            setNewPasswordGenerated(false);
            setPasswordCopied(false);
        }
    }, [user]);

    // Reset estado quando o modal fecha
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setNewPasswordGenerated(false);
                setPasswordCopied(false);
            }, 300);
        }
    }, [open]);

    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        setFormData(prev => ({ ...prev, password: newPassword }));
        setNewPasswordGenerated(true);
        setPasswordCopied(false);
    };

    const handleCopyPassword = () => {
        if (formData.password) {
            navigator.clipboard.writeText(formData.password);
            setPasswordCopied(true);

            toast({
                title: "Senha copiada",
                description: "A nova senha foi copiada para a área de transferência.",
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Se não foi gerada nova senha, remover o campo password para não atualizar
        const userData = { ...formData };
        if (!newPasswordGenerated) {
            delete userData.password;
        }

        onSubmit(userData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do usuário. Gere uma nova senha apenas se necessário.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            placeholder="Ex: João Silva"
                            className="col-span-3"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemplo@email.com"
                            className="col-span-3"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                        />
                    </div>
                    {/* Campo adicionado para Escola Afiliada */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="affiliatedSchool" className="text-right">
                            Escola afiliada
                        </Label>
                        <Input
                            id="affiliatedSchool"
                            placeholder="Ex: Universidade XYZ"
                            className="col-span-3"
                            value={formData.affiliatedSchool || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, affiliatedSchool: e.target.value }))}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Papel
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value: UserRole) =>
                                setFormData(prev => ({ ...prev, role: value }))
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione um papel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Administrador</SelectItem>
                                <SelectItem value="PROFESSOR">Professor</SelectItem>
                                <SelectItem value="STUDENT">Estudante</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Senha
                        </Label>
                        <div className="col-span-3">
                            {newPasswordGenerated ? (
                                <div className="flex gap-2">
                                    <Input
                                        id="password"
                                        value={formData.password}
                                        readOnly
                                        disabled
                                        className="flex-1 cursor-not-allowed opacity-75"
                                    />
                                    <Button variant="outline" size="icon" type="button" onClick={handleCopyPassword}>
                                        {passwordCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGeneratePassword}
                                    className="w-full"
                                >
                                    Gerar nova senha
                                </Button>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Atualizar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}