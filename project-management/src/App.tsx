import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import AppRoutes from './Routes/routes'
import { Toaster } from '@/components/ui/toaster'

// Configurar o cliente Apollo com uma URL mockada para desenvolvimento
const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql', // Substitua pela URL real quando disponível
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
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ApolloProvider>
  )
}
