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

interface ProjectDetailsModalProps {
  team: Team;
  onSubmit?: (projectName: string) => void;
}

export function SelectProjectModal({ team, onSubmit }: ProjectDetailsModalProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

  const [inputValue, setInputValue] = useState(""); // Estado para o valor do input
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar o dropdown

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

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Solicitar projeto</DialogTitle>
        <DialogDescription>
          {/* Informações e edição do projeto da equipe {team.name}. */}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="project-name" className="text-right">
            Projeto
          </Label>
          <div className="relative col-span-3">
            <input
              id="project-name"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} // Atualiza o valor do input
              onFocus={() => setIsDropdownOpen(true)} // Abre o dropdown ao focar no input
              placeholder="Digite para buscar..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {isDropdownOpen && filteredFrameworks.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                {filteredFrameworks.map((framework) => (
                  <li
                    key={framework.value}
                    onClick={() => handleSelect(framework.label)} // Seleciona o item
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {framework.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>

      </DialogFooter>
    </DialogContent>
  );
}