import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Adicionar estado de carregamento
  const [userId, setUserId] = useState(null); // Adicionar estado para armazenar o ID do usuário

  useEffect(() => {
    console.log('Carregando estado inicial do AuthContext...');
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedAdmin = localStorage.getItem('isAdmin') === 'true';
    const storedUserId = localStorage.getItem('userId'); // Recuperar o ID do usuário
    console.log('Estado inicial carregado:', { storedAuth, storedAdmin, storedUserId });

    setIsAuthenticated(storedAuth);
    setIsAdmin(storedAdmin);
    setUserId(storedUserId ? parseInt(storedUserId, 10) : null); // Armazenar o ID do usuário
    setLoading(false); // Finalizar carregamento
  }, []);

  const login = (id, admin = false) => { // Adicionar ID como parâmetro
    console.log('Realizando login...', { id, admin });
    setIsAuthenticated(true);
    setIsAdmin(admin);
    setUserId(id); // Armazenar o ID do usuário
    localStorage.setItem('isAuthenticated', 'true'); // Persistir estado
    localStorage.setItem('isAdmin', admin.toString());
    localStorage.setItem('userId', id); // Persistir o ID do usuário
    console.log('Estado após login:', {
      isAuthenticated: true,
      isAdmin: admin,
      userId: id,
    });
  };

  const logout = () => {
    console.log('Realizando logout...');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null); // Limpar o ID do usuário
    localStorage.removeItem('isAuthenticated'); // Remover persistência
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId'); // Remover persistência do ID
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);