import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any) => void;
}

export function NewProjectModal({ open, onOpenChange, onSubmit }: NewProjectModalProps) {
  // Obter ID do usuário logado do localStorage
  const [userData, setUserData] = useState<{ id: string } | null>(null);
  
  // Carregando os dados do usuário quando o componente é montado
  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Erro ao analisar os dados do usuário:', error);
      }
    }
  }, []);

  const formatDateForBackend = (dateString: string): string => {
    // Verifica se já está no formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString; // Retorna a data como está se já estiver no formato correto
    }
    
    try {
      const date = new Date(dateString);
      // Formata para YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      // Retorna a data atual se houver erro
      return new Date().toISOString().split('T')[0];
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    objective: "",
    summaryScope: "",
    targetAudience: "",
    expectedStartDate: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar se temos os dados do usuário antes de enviar
    if (!userData || !userData.id) {
      toast({ 
        title: "Erro", 
        description: "Não foi possível identificar o usuário. Por favor, faça login novamente.", 
        variant: "destructive" 
      });
      return;
    }
    
    // Adicionar o ID do usuário logado como requester
    const formattedExpectedStartDate = formatDateForBackend(formData.expectedStartDate);

    const completeFormData = {
      ...formData,
      requester: userData.id,
      // Garantir que a data esteja no formato ISO
      expectedStartDate: formattedExpectedStartDate
    };
    
    onSubmit(completeFormData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo projeto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Sistema de Gestão" 
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="objective" className="text-right">
                Objetivo
              </Label>
              <Textarea
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                placeholder="Descreva o objetivo do projeto"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="summaryScope" className="text-right">
                Escopo
              </Label>
              <Textarea
                id="summaryScope"
                name="summaryScope"
                value={formData.summaryScope}
                onChange={handleChange}
                placeholder="Resumo do escopo do projeto"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetAudience" className="text-right">
                Público Alvo
              </Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Ex: Estudantes universitários"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expectedStartDate" className="text-right">
                Data de Início
              </Label>
              <Input
                id="expectedStartDate"
                name="expectedStartDate"
                type="date"
                value={formData.expectedStartDate}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar projeto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
