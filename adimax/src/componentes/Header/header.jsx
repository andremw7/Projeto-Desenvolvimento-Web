import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import reactLogo from '../../assets/adimax.jpeg';
import CustomLink from '../CustomLink/CustomLink';
import '../../App.css';
import './header.css';

function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null); // <- Novo ref para a busca
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/produtos')
      .then((response) => response.json())
      .then((data) => {
        console.log('Produtos carregados:', data); // Depuração
        setProdutos(data);
      })
      .catch((error) => console.error('Erro ao carregar os produtos:', error));
  }, []);

  const filteredProdutos = produtos
    .filter((produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 3);

  const handleProductClick = (produtoId) => {
    console.log(`Tentando redirecionar para o produto com ID: ${produtoId}`);
    navigate(`/produto/${produtoId}`);
  };

  return (
    <>
      <header>
        <nav>
          <img
            src={reactLogo}
            alt="Logo ADIMAX"
            className="logo"
            width="50px"
            height="50px"
          />
          <div className="search-container-header">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchDropdownOpen(true);
              }}
              className="search-input-header"
            />
            {searchDropdownOpen && (
              <div
                className="search-dropdown"
                ref={searchRef} // <- Adicionado ref
                onClick={(e) => e.stopPropagation()}
              >
                {filteredProdutos.length > 0 ? (
                  filteredProdutos.map((produto) => (
                    <div
                      key={produto.id}
                      className="search-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(produto.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={`/assets${produto.imagem}`}
                        alt={produto.nome}
                        className="search-item-image"
                      />
                      <div className="search-item-info">
                        <p className="search-item-name">{produto.nome}</p>
                        <p className="search-item-price">
                          R$ {produto.preco.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="search-item-empty">Nenhum produto encontrado.</p>
                )}
              </div>
            )}
          </div>
          <ul>
            <li>
              <CustomLink to="/">Início</CustomLink>
            </li>
            <li>
              <CustomLink to="/produtos">Produtos</CustomLink>
            </li>
            {isAuthenticated && (
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="user-icon"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  👤
                </button>
                {isOpen && (
                  <div className="dropdown dropdown-vertical">
                    <CustomLink to="/carrinho">🛒 Carrinho</CustomLink>
                    {isAdmin ? (
                      <CustomLink to="/admin/perfil">👤 Admin</CustomLink>
                    ) : (
                      <CustomLink to="/perfil/dados">👤 Perfil</CustomLink>
                    )}
                    <button onClick={handleLogout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            )}
            {!isAuthenticated && (
              <li>
                <CustomLink to="/login" className="logout-button">
                  Login
                </CustomLink>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
