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
import { generatePassword } from '@/utils/password-geneator'
import { toast } from '@/hooks/use-toast'
import { UserRole } from '@/pages/users'; // Importe o enum

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole; // Use o enum importado
  affiliatedSchool: string; // Adicionado campo de escola afiliada
}

interface NewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => void;
}

export function NewUserModal({ open, onOpenChange, onClose, onSubmit }: NewUserModalProps) {
  // Função para criar o estado inicial com senha gerada
  const createInitialState = () => ({
    name: '',
    email: '',
    password: generatePassword(), // Gerar senha a cada reset
    role: 'STUDENT' as UserRole,
    affiliatedSchool: '', // Inicializa o campo de escola afiliada
  });

  const [formData, setFormData] = useState<CreateUserData>(createInitialState());
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Efeito para resetar o estado quando o modal fecha
  useEffect(() => {
    if (!open) {
      // Quando o modal fecha, agendar o reset após a animação terminar
      setTimeout(() => {
        setPasswordCopied(false);
        setFormData(createInitialState());
      }, 300); // 300ms é aproximadamente o tempo da animação de fechamento
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    setPasswordCopied(true);

    // Mostrar notificação de sucesso
    toast({
      title: "Senha copiada",
      description: "A senha foi copiada para a área de transferência.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo usuário.
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="password">
              Senha
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="password"
                value={formData.password}
                readOnly
                disabled
                className="flex-1 cursor-not-allowed opacity-75"
              />
              <Button variant="outline" size="icon" type="button" onClick={handleCopyPassword}>
                {passwordCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {/* Novo campo para Escola Afiliada */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="affiliatedSchool" className="text-right">
              Escola afiliada
            </Label>
            <Input
              id="affiliatedSchool"
              placeholder="Ex: Universidade XYZ"
              className="col-span-3"
              value={formData.affiliatedSchool}
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
          <DialogFooter className="mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
