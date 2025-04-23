import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type UserData = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  affiliatedSchool?: string;
};

interface UserContextType {
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
  refreshUser: () => void;
}

// Valor padrão do contexto
const defaultContext: UserContextType = {
  user: {},
  updateUser: () => {},
  refreshUser: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>({});

  // Carregar dados do usuário ao iniciar
  useEffect(() => {
    refreshUserData();
  }, []);

  // Função para obter dados atualizados do localStorage
  const refreshUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Função para atualizar o usuário
  const updateUserData = (newData: Partial<UserData>) => {
    try {
      // Atualiza o estado
      setUser(currentUser => {
        const updatedUser = { ...currentUser, ...newData };
        
        // Atualiza o localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return updatedUser;
      });
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const contextValue = {
    user,
    updateUser: updateUserData,
    refreshUser: refreshUserData,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useUser() {
  return useContext(UserContext);
}