import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import Facebook from '../../assets/facebook.png';
import X from '../../assets/X.png';
import Instagram from '../../assets/instagram.png';
import CustomLink from '../CustomLink/CustomLink'; 
import '../../App.css'; 

function Footer() {
  // Obtemos os estados de autenticação, se é admin, e a função de logout do contexto
  // Get authentication state, admin check, and logout function from context
  const { isAuthenticated, isAdmin, logout } = useAuth(); 

  // Função que realiza o logout e redireciona para a página inicial
  // Function to handle logout and redirect to homepage
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      <footer className="footer-container">
   
        <section>
          <h4>Sobre Nós</h4>
          <p>No ADIMAX, cuidamos do seu pet como se fosse nosso. Venha nos visitar e descubra tudo o que temos para oferecer!</p>
        </section>

        <section>
          <h4>Links Rápidos</h4>
          <ul>
            <li><CustomLink to="/">Início</CustomLink></li>
            <li><CustomLink to="/produtos">Produtos</CustomLink></li>

            {/* Exibe Logout se estiver autenticado, senão exibe Login */}
            {/* Show Logout if authenticated, otherwise show Login */}
            {isAuthenticated ? (
              <li>
                <button onClick={handleLogout} className="logout-button">
                  {isAdmin ? 'Logout Admin' : 'Logout'}
                </button>
              </li>
            ) : (
              <li>
                <CustomLink to="/login" className="logout-button">
                  Login
                </CustomLink>
              </li>
            )}
          </ul>
        </section>

        <section>
          <h4>Siga-nos</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <img src={Facebook} alt="Facebook" width="24" height="24" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={X} alt="X" width="24" height="24" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src={Instagram} alt="Instagram" width="24" height="24" />
            </a>
          </div>
        </section>
      </footer>
    </>
  );
}

export default Footer;
