import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react";

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
interface Team {
  id: string;
  name: string;
  professor: string;
  project: string | null;
}
import { useMutation, gql } from "@apollo/client"
import { toast } from "@/hooks/use-toast";

interface ProjectDetailsModalProps {
  team: Team;
  onSubmit?: (projectName: string) => void;
}

export function SelectProjectModal() {
  const usuario = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    name: "",
    objective: "",
    summaryScope: "",
    targetAudience: "",
    expectedStartDate: "",
    requester: usuario.id
  });
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

  const [inputValue, setInputValue] = useState(""); // Estado para o valor do input
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar o dropdown

const NEW_PROJECT_MUTATION = gql`
  mutation SaveProject($name: String!, $objective: String!, $summaryScope: String!, $targetAudience: String!, $expectedStartDate: String!, $requester: string!) {
    saveProject(name: $name, objective: $objective, summaryScope: $summaryScope, targetAudience: $targetAudience, expectedStartDate: $expectedStartDate, requester: $requester) {
      
    }
  }
`

  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  const filteredFrameworks = frameworks.filter((framework) =>
    framework.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  const handleSelect = (framework: string) => {
    setInputValue(framework); // Define o valor selecionado no input
    setIsDropdownOpen(false); // Fecha o dropdown
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  

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

  const formattedExpectedStartDate = formatDateForBackend(formData.expectedStartDate);



  const handleSubmit = async (e) => {
    formData.expectedStartDate = formattedExpectedStartDate
    e.preventDefault();
    console.log("Dados do projeto:", formData);
    try {
      useMutation(NEW_PROJECT_MUTATION, {
        onCompleted: () => {
            toast({
                title: "Projeto atualizado",
                description: "O projeto foi atualizado com sucesso."
            });

        },
        onError: (error) => {
            toast({
                title: "Erro ao atualizar projeto",
                description: error.message,
                variant: "destructive"
            });
        }
    });
      console.log("Projeto salvo com sucesso:", result);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[576px]">
      <DialogHeader>
        <DialogTitle>Solicitar projeto</DialogTitle>
        <DialogDescription>
          {/* Informações e edição do projeto da equipe {team.name}. */}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="items-center gap-4">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow">
      <div>
        <label className="block font-semibold">Nome do projeto</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div>
        <label className="block font-semibold">Objetivo</label>
        <textarea name="objective" value={formData.objective} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div>
        <label className="block font-semibold">Resumo do escopo</label>
        <input type="text" name="summaryScope" value={formData.summaryScope} onChange={handleChange} className="border p-2 w-full" />
      </div>
      
      <div className="flex flex-row gap-4">
  <div className="w-1/2">
    <label className="block font-semibold">Público-alvo</label>
    <input
      type="text"
      name="targetAudience"
      value={formData.targetAudience}
      onChange={handleChange}
      className="border p-2 w-full"
    />
  </div>

  <div className="w-1/2">
    <label className="block font-semibold">Data de início esperada</label>
    <input
      type="date"
      name="expectedStartDate"
      value={formData.expectedStartDate}
      onChange={handleChange}
      className="border p-2 w-full"
    />
  </div>
</div>
      

      {/* <div>
        <label className="block font-semibold">Solicitante (ID)</label>
        <input type="text" name="requester" value={formData.requester} onChange={handleChange} className="border p-2 w-full" />
      </div> */}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Salvar Projeto
      </button>
    </form>
        </div>
      </div>
      <DialogFooter>

      </DialogFooter>
    </DialogContent>
  );
}