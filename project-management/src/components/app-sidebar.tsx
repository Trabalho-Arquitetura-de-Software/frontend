import { Calendar, Home, Inbox, LogOut, PieChart, Plus, Search, Settings, Users } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Button } from "./ui/button"

export function AppSidebar() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        // Remover o token
        localStorage.removeItem("token");
        // Redirecionar para login
        navigate("/login");
    };

    const menuItems = [
        {
            title: "Dashboard",
            url: "/home",
            icon: Home,
        },
        {
            title: "Projetos",
            url: "/projects",
            icon: Inbox,
        },
        {
            title: "Equipe",
            url: "/team",
            icon: Users,
        },
        {
            title: "Calendário",
            url: "/calendar",
            icon: Calendar,
        },
        {
            title: "Relatórios",
            url: "/reports",
            icon: PieChart,
        },
        {
            title: "Configurações",
            url: "/settings",
            icon: Settings,
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-gray-200 p-4">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-dark flex items-center justify-center text-white font-bold">
                        PM
                    </div>
                    <span className="ml-2 text-lg font-semibold">Project Managment</span>
                </div>
            </SidebarHeader>
            
            <SidebarContent className="bg-gray-50 border-r border-gray-200 h-full">
                <div className="p-4 flex flex-col gap-2">
                    <Button className="w-full bg-primary-dark hover:bg-primary-darker text-white">
                        <Plus size={16} /> Novo Projeto
                    </Button>
                    <Button className="w-full bg-primary-dark hover:bg-primary-darker text-white">
                        <Plus size={16} /> Adicionar usuário
                    </Button>
                </div>
                
                <SidebarMenu>
                    {menuItems.map((item) => (
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
                
                <div className="absolute bottom-4 left-4 right-4">
                    <Button 
                        variant="outline" 
                        className="w-full text-red-500 hover:text-red-700"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        <span>Sair</span>
                    </Button>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}