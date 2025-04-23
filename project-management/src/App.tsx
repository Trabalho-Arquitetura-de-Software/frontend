import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import AppRoutes from './Routes/routes'
import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from './contexts/user-context'

// Configurar o link HTTP para o GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

// Adicionar o token de autenticação ao cabeçalho de cada requisição
const authLink = setContext((_, { headers }) => {
  // Obter token do armazenamento local
  const token = localStorage.getItem('token');

  // Retornar os headers para o contexto
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Configurar o cliente Apollo com o link de autenticação
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </UserProvider>
    </ApolloProvider>
  )
}
