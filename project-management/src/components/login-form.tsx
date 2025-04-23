"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useMutation, gql } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

// Define the login mutation with expanded user data
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        affiliatedSchool
        role
      }
    }
  }
`

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Set up GraphQL mutation
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.token);
      localStorage.setItem("user", JSON.stringify(data.login.user));

      toast({
        title: "Login concluído",
        description: `Bem-vindo(a), ${data.login.user.name}!`,
      })
      navigate("/home")
    },
    onError: (error) => {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    await login({
      variables: {
        email: values.email,
        password: values.password,
      },
    })
  }

  return (
    <Card className="w-full max-w-md border-primary-dark">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary-dark">Bem-vindo!</CardTitle>
        <CardDescription>Entre com seu e-mail e senha para acessar sua conta.</CardDescription>
        {/* <div className="text-sm">
          <Link to="/register" className="text-primary-dark hover:text-primary-darker hover:underline">
            Não possui conta? <span className="font-bold">Registre-se Grátis</span>
          </Link>
        </div> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Digite seu e-mail"
                      type="email"
                      {...field}
                      className="focus-visible:ring-primary-dark"
                    />
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Digite a sua Senha"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="focus-visible:ring-primary-dark"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-primary-darker hover:text-primary-dark"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              {/* Changed from Next.js Link to React Router Link */}
              <Link
                to="/recuperar-senha"
                className="text-sm text-primary-darker hover:text-primary-dark hover:underline"
              >
                Esqueceu sua <span className="font-bold">Senha?</span>
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-dark hover:bg-primary-darker text-white"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
