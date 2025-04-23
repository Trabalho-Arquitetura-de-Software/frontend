import { useMutation, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { PencilIcon, Plus, Trash2 } from 'lucide-react'
import { CreateUserData, NewUserModal } from "@/components/modal/new-user-modal"
import { useState, useEffect } from 'react'
import { ActionConfirmationModal } from '@/components/modal/action-confirmation-modal'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { EditUserModal, UpdateUserData, User } from '@/components/modal/edit-user-modal'

// Define o enum de acordo com a API
export enum UserRole {
    ADMIN = 'ADMIN',
    PROFESSOR = 'PROFESSOR',
    STUDENT = 'STUDENT'
}

const GET_USERS = gql`
    query {
        findAllUsers {
            id
            email
            name
            role
            affiliatedSchool
        }
    }
`

// Mutação corrigida usando o tipo UserRole e selecionando subcampos do retorno
const CREATE_USER = gql`
    mutation SaveUser(
      $email: String!, 
      $name: String!, 
      $password: String!, 
      $role: UserRole!,
      $affiliatedSchool: String
    ) {
        saveUser(
          email: $email, 
          name: $name, 
          password: $password, 
          role: $role,
          affiliatedSchool: $affiliatedSchool
        ) {
            id
            name
            email
            role
            affiliatedSchool
        }
    }
`

const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
            name
            email
            role
        }
    }
`

const UPDATE_USER = gql`
    mutation UpdateUser(
      $id: ID!, 
      $name: String!, 
      $email: String!, 
      $password: String, 
      $role: UserRole!,
      $affiliatedSchool: String
    ) {
        updateUser(
          id: $id, 
          name: $name, 
          email: $email, 
          password: $password, 
          role: $role,
          affiliatedSchool: $affiliatedSchool
        ) {
            id
            name
            email
            role
            affiliatedSchool
        }
    }
`

export default function Users() {
    const { loading, error, data } = useQuery(GET_USERS)
    const [addNewUserModalOpen, setAddNewUserModalOpen] = useState(false)
    const [editUserModalOpen, setEditUserModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [createUser] = useMutation(CREATE_USER);
    const [deleteUser] = useMutation(DELETE_USER);
    const [updateUser] = useMutation(UPDATE_USER);

    // Ajustar o estilo do elemento root, como feito na Home
    useEffect(() => {
        const rootElement = document.getElementById("root");
        if (rootElement) {
            rootElement.style.maxWidth = "100%";
            rootElement.style.padding = "0";

            return () => {
                rootElement.style.maxWidth = "1280px";
                rootElement.style.padding = "2rem";
            };
        }
    }, []);

    // Manipular o erro de forma segura
    if (error) {
        console.error("GraphQL error:", error);
        toast({
            title: "Erro",
            description: "Falha ao buscar usuários.",
            variant: "destructive",
        });
    }

    function handleCreateUser(userData: CreateUserData): void {
        console.log("Creating user with data:", userData);
        createUser({
            variables: {
                email: userData.email,
                name: userData.name,
                password: userData.password,
                role: userData.role as UserRole,
                affiliatedSchool: userData.affiliatedSchool || null // Incluir o novo campo
            },
            refetchQueries: [{ query: GET_USERS }],
            onCompleted: (data) => {
                console.log("User created successfully:", data);
                setAddNewUserModalOpen(false);
                toast({
                    title: "Sucesso",
                    description: "Usuário criado com sucesso.",
                });
            },
            onError: (err) => {
                console.error("Error creating user:", err);
                toast({
                    title: "Erro",
                    description: `Falha ao criar usuário: ${err.message}`,
                    variant: "destructive",
                });
            }
        });
    }

    function handleDeleteUser(user_id: string): void {
        console.log("Deleting user with ID:", user_id);
        console.log(typeof user_id);
        deleteUser({
            variables: {
                id: user_id
            },
            refetchQueries: [{ query: GET_USERS }],
            onCompleted: (data) => {
                console.log("User deleted successfully:", data);
                toast({
                    title: "Sucesso",
                    description: "Usuário deletado com sucesso.",
                });
            },
            onError: (err) => {
                console.error("Error deleting user:", err);
                toast({
                    title: "Erro",
                    description: `Falha ao deletar usuário: ${err.message}`,
                    variant: "destructive",
                });
            }
        });
    }

    function handleUpdateUser(userData: UpdateUserData): void {
        console.log("Updating user with data:", userData);

        // Preparar as variáveis para a mutação
        const variables: any = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            affiliatedSchool: userData.affiliatedSchool || null // Incluir o novo campo
        };

        // Adicionar senha apenas se ela foi fornecida
        if (userData.password) {
            variables.password = userData.password;
        }

        updateUser({
            variables,
            refetchQueries: [{ query: GET_USERS }],
            onCompleted: (data) => {
                console.log("User updated successfully:", data);
                setEditUserModalOpen(false);
                toast({
                    title: "Sucesso",
                    description: "Usuário atualizado com sucesso.",
                });
            },
            onError: (err) => {
                console.error("Error updating user:", err);
                toast({
                    title: "Erro",
                    description: `Falha ao atualizar usuário: ${err.message}`,
                    variant: "destructive",
                });
            }
        });
    }

    function handleOpenEditModal(user: User) {
        setSelectedUser(user);
        setEditUserModalOpen(true);
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AppSidebar />
                <main className="flex-1 p-6 bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>
                                    <h1 className='text-2xl my-4'>Usuários</h1>
                                </CardTitle>
                                <Button onClick={() => setAddNewUserModalOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        Carregando usuários...
                                    </div>
                                ) : error ? (
                                    <div className="flex items-center justify-center py-8 text-red-500">
                                        Erro ao carregar usuários. Por favor, tente novamente.
                                    </div>
                                ) : data && data.findAllUsers ? (
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Nome</TableHead>
                                                <TableHead className="w-[200px]">Email</TableHead>
                                                <TableHead className="w-[150px]">Escola Afiliada</TableHead>
                                                <TableHead className="w-[80px]">Papel</TableHead>
                                                <TableHead className="w-[80px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.findAllUsers.map((user: User) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="max-w-[100px]">
                                                        <div className="truncate" title={user.name}>{user.name}</div>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px]">
                                                        <div className="truncate" title={user.email}>{user.email}</div>
                                                    </TableCell>
                                                    <TableCell className="max-w-[150px]">
                                                        <div className="truncate" title={user.affiliatedSchool}>
                                                            {user.affiliatedSchool || "-"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="w-full">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                                    user.role === 'PROFESSOR' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-green-100 text-green-800'
                                                                }`}>
                                                                {user.role === 'ADMIN' ? 'Admin' :
                                                                    user.role === 'PROFESSOR' ? 'Professor' : 'Estudante'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Button
                                                                variant={"outline"}
                                                                onClick={() => handleOpenEditModal(user)}
                                                                size="icon"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Button>
                                                            <ActionConfirmationModal
                                                                title={`Deletando ${user.name}`}
                                                                description={`Tem certeza que deseja deletar ${user.name}?`}
                                                                confirmText='Deletar'
                                                                cancelText='Cancelar'
                                                            >
                                                                {(show) => (
                                                                    <div className="cursor-pointer">
                                                                        <Button
                                                                            variant={"outline"}
                                                                            onClick={show(() => {
                                                                                handleDeleteUser(user.id)
                                                                            })}
                                                                            size="icon"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </ActionConfirmationModal>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="flex items-center justify-center py-8">
                                        Nenhum usuário encontrado.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <NewUserModal
                            open={addNewUserModalOpen}
                            onOpenChange={setAddNewUserModalOpen}
                            onClose={() => setAddNewUserModalOpen(false)}
                            onSubmit={handleCreateUser}
                        />
                        <EditUserModal
                            open={editUserModalOpen}
                            user={selectedUser}
                            onOpenChange={setEditUserModalOpen}
                            onClose={() => setEditUserModalOpen(false)}
                            onSubmit={handleUpdateUser}
                        />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}