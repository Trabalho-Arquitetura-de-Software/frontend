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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

// Define the register mutation
const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

// Define form schema with validation
const formSchema = z
  .object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Digite um endereço de e-mail válido" }),
    password: z
      .string()
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
      .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  // Set up GraphQL mutation
  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.register.token)

      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso.",
      })

      navigate("/dashboard")
    },
    onError: (error) => {
      toast({
        title: "Falha no registro",
        description: error.message || "Por favor, verifique seus dados e tente novamente.",
        variant: "destructive",
      })
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await register({
      variables: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
    })
  }

  return (
    <Card className="w-full max-w-md border-primary-dark">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary-dark">Criar Conta</CardTitle>
        <CardDescription>Preencha os dados abaixo para criar sua conta.</CardDescription>
        <div className="text-sm">
          <Link to="/login" className="text-primary-dark hover:text-primary-darker hover:underline">
            Já possui uma conta? <span className="font-bold">Faça login</span>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} className="focus-visible:ring-primary-dark" />
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

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
                        placeholder="Crie sua senha"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirme sua senha"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        className="focus-visible:ring-primary-dark"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-primary-darker hover:text-primary-dark"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-primary-dark" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary-dark data-[state=checked]:border-primary-dark"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormItem className="text-sm text-gray-600">
                      Eu concordo com os{" "}
                      <Link to="/terms" className="text-primary-dark hover:text-primary-darker hover:underline">
                        termos de serviço
                      </Link>{" "}
                      e{" "}
                      <Link to="/privacy" className="text-primary-dark hover:text-primary-darker hover:underline">
                        política de privacidade
                      </Link>
                      .
                    </FormItem>
                    <FormMessage className="text-primary-dark" />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary-dark hover:bg-primary-darker text-white"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Criar conta"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
