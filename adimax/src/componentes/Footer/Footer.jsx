import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar o contexto de autenticação
import Facebook from '../../assets/facebook.png';
import X from '../../assets/X.png';
import Instagram from '../../assets/instagram.png';
import CustomLink from '../CustomLink/CustomLink'; // Importar o CustomLink
import '../../App.css'; // Ensure correct path to App.css

function Footer() {
  const { isAuthenticated, isAdmin, logout } = useAuth(); // Obter estados e função de logout

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
                    {isAuthenticated ? (
                      <li>
                        <button onClick={handleLogout} className="logout-button">
                          {isAdmin ? 'Logout Admin' : 'Logout'}
                        </button>
                      </li>
                    ) : (
                      <li><CustomLink to="/login" className="logout-button">Login</CustomLink></li>
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


