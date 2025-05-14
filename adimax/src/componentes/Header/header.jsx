import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar o contexto de autenticação
import reactLogo from '../../assets/adimax.jpeg';
import CustomLink from '../CustomLink/CustomLink'; // Importar o CustomLink
import '../../App.css';
import './header.css'; // Importar o CSS do Header

function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth(); // Obter estados e função de logout
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Fecha o menu suspenso se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <nav>
          <img src={reactLogo} alt="Logo ADIMAX" className="logo" width="50px" height="50px" />
          <ul>
            <li><CustomLink to="/">Início</CustomLink></li>
            <li><CustomLink to="/produtos">Produtos</CustomLink></li>
            {isAuthenticated && (
              <div className="user-menu" ref={dropdownRef}>
                <button className="user-icon" onClick={() => setIsOpen(!isOpen)}>
                  👤
                </button>
                {isOpen && (
                  <div className="dropdown dropdown-vertical">
                    <CustomLink to="/carrinho">🛒 Carrinho</CustomLink>
                    <CustomLink to="/perfil">👤 Perfil</CustomLink>
                    <button onClick={handleLogout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            )}
            {!isAuthenticated && (
              <li><CustomLink to="/login" className="logout-button">Login</CustomLink></li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;