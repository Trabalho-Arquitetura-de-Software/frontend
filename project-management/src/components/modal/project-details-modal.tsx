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
import { useState } from "react";

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

export function ProjectDetailsModal({ team, onSubmit }: ProjectDetailsModalProps) {
  const [projectName, setProjectName] = useState(team.project || "");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(projectName);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Detalhes do Projeto</DialogTitle>
        <DialogDescription>
          Informações e edição do projeto da equipe {team.name}.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">ID da Equipe</Label>
          <p className="col-span-3 text-gray-600">{team.id}</p>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Equipe</Label>
          <p className="col-span-3 text-gray-600">{team.name}</p>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Professor</Label>
          <p className="col-span-3 text-gray-600">{team.professor}</p>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="project-name" className="text-right">
            Projeto
          </Label>
          <p
          className="col-span-3">
                {team.project}
          </p>

          {/* <Input className="col-span-3"

            id="project-name"
            value={projectName}
            placeholder="Nome do projeto"
          /> */}
        </div>
      </div>
      <DialogFooter>

      </DialogFooter>
    </DialogContent>
  );
}