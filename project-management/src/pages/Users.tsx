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
import { Plus } from 'lucide-react'
import { CreateUserData, NewUserModal } from "@/components/modal/new-user-modal"
import { useState } from 'react'

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
        }
    }
`

// Mutação corrigida usando o tipo UserRole e selecionando subcampos do retorno
const CREATE_USER = gql`
    mutation SaveUser($email: String!, $name: String!, $password: String!, $role: UserRole!) {
        saveUser(email: $email, name: $name, password: $password, role: $role) {
            id
            name
            email
            role
        }
    }
`

export default function Users() {
    const { loading, error, data } = useQuery(GET_USERS)
    const [addNewUserModalOpen, setAddNewUserModalOpen] = useState(false)
    const [createUser] = useMutation(CREATE_USER);

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
                role: userData.role as UserRole // Asseguramos que o role seja tratado como UserRole
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

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Usuários</CardTitle>
                    <Button onClick={() => setAddNewUserModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4"/> Adicionar Usuário
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Papel</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.findAllUsers.map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
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
        </div>
    )
}