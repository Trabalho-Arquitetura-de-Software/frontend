import { Home, Inbox, LogOut, Settings, UserCog, Users, ChevronUp, ChevronDown, UserCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NewProjectModal } from "./modal/new-project-modal"
import {
    Dialog,
} from "@/components/ui/dialog"
import { EditSelfUserModal } from "./modal/edit-self-user-modal"
import { useUser } from '@/contexts/user-context';

export function AppSidebar() {
    const { user } = useUser();
    const usuario = JSON.parse(localStorage.getItem("user") || "{}");

    const [profileExpanded, setProfileExpanded] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleProfileClick = () => {
        setProfileExpanded(false);
        setProfileModalOpen(true);
    };

    const menuItems = [
        {
            title: "Minhas Equipes",
            url: "/myTeams",
            icon: Users,
            roles: ["PROFESSOR","STUDENT"],
        },
        {
            title: "Equipes",
            url: "/teams",
            icon: Users,
            roles: ["ADMIN"],
        },
        {
            title: "Projetos",
            url: "/projects",
            icon: Inbox,
            roles: ["ADMIN"],
        },
        {
            title: "Usuários",
            url: "/users",
            icon: UserCog,
            roles: ["ADMIN"],
        },
        {
            title: "Meus Projetos",
            url: "/MyProjects",
            icon: UserCog,
            roles: ["PROFESSOR"],
        }
    ];
    const filteredMenuItems = menuItems.filter((item) =>
        item.roles.includes(usuario.role) // Filtra os itens com base na role do usuário
    );
    return (
        <>
            <Sidebar>
                <SidebarHeader className="p-4">
                    <div className="flex items-center">
                        <div className="ml-2">
                            <div className="text-lg font-semibold">Project Management</div>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarContent className="bg-gray-50 border-r border-gray-200 h-full">
                    <SidebarMenu className="flex flex-col space-y-2 p-4">
                        {filteredMenuItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <Link to={item.url}>
                                    <SidebarMenuButton tooltip={item.title}>
                                        <item.icon className="size-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>

                    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200">
                        <div className="px-4 py-3">
                            <button
                                className="w-full flex items-center justify-between bg-white rounded-lg p-3 hover:bg-gray-100 transition-colors"
                                onClick={() => setProfileExpanded(!profileExpanded)}
                            >
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-primary-dark flex items-center justify-center text-white font-bold">
                                        {user.name ? user.name.charAt(0) : "U"}
                                    </div>
                                    <div className="ml-2">
                                        <div className="text-sm font-semibold text-left">{user.name || "Usuário"}</div>
                                        <div className="text-xs text-gray-500 text-left">{user.role || "Membro"}</div>
                                    </div>
                                </div>
                                {profileExpanded ? (
                                    <ChevronDown size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronUp size={16} className="text-gray-500" />
                                )}
                            </button>

                            {profileExpanded && (
                                <div className="mt-2 space-y-2 p-1">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-700"
                                        onClick={handleProfileClick}
                                    >
                                        <UserCircle size={16} className="mr-2" />
                                        <span>Meu Perfil</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        <span>Sair</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </SidebarContent>
            </Sidebar>

            <EditSelfUserModal
                open={profileModalOpen}
                onOpenChange={setProfileModalOpen}
            />
        </>
    );
}