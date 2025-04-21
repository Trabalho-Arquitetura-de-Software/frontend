import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useState } from "react";

export function NewUserModal() {
  // Estado para gerenciar os dados do formulário
  const [formData, setFormData] = useState({
    role: "STUDENT", // Valor padrão
    name: "",
    email: "",
  });

  // Função para atualizar os dados do formulário
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = () => {
    console.log("Dados do formulário:", formData);
    // Aqui você pode adicionar a lógica para enviar os dados à API
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Novo Usuário</DialogTitle>
        <DialogDescription>
          Preencha os dados para criar um novo usuário.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {/* Campo de rádio para Aluno ou Professor */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Função</Label>
          <RadioGroup
            name="role"
            value={formData.role}
            onValueChange={(value) =>
              handleInputChange({ target: { name: "role", value } })
            }
            className="col-span-3"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="STUDENT" id="student" />
                <Label htmlFor="student">Aluno</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PROFESSOR" id="professor" />
                <Label htmlFor="professor">Professor</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Campo Nome */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nome
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: João Silva"
            className="col-span-3"
          />
        </div>

        {/* Campo Email */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email do usuário"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleSubmit}>
          Cadastrar Usuário
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}