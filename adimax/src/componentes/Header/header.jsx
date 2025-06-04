import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import reactLogo from '../../assets/adimax.jpeg';
import CustomLink from '../CustomLink/CustomLink';
import '../../App.css';
import './header.css';

function Header() {
  // Obtém informações de autenticação e permissões do contexto
  const { isAuthenticated, isAdmin, logout } = useAuth();
  // Estado para controlar a abertura do menu do usuário
  const [isOpen, setIsOpen] = useState(false);
  // Referências para detectar cliques fora dos menus
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  // Estado para controlar a abertura do dropdown de busca
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  // Estado para armazenar todos os produtos carregados
  const [produtos, setProdutos] = useState([]);
  // Estado para o termo de busca digitado
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Função para logout e redirecionamento
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Efeito para fechar dropdowns ao clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideSearch =
        searchRef.current &&
        !searchRef.current.contains(event.target);

      const clickedOutsideUserMenu =
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target);

      if (clickedOutsideSearch) {
        setSearchDropdownOpen(false);
      }

      if (clickedOutsideUserMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Carrega todos os produtos para busca ao montar o componente
  useEffect(() => {
    fetch('http://localhost:3000/produtos')
      .then((response) => response.json())
      .then((data) => {
        // console.log('Produtos carregados:', data);
        setProdutos(data);
      })
      .catch((error) => console.error('Erro ao carregar os produtos:', error));
  }, []);

  // Filtra os produtos conforme o termo de busca (mostra até 3)
  const filteredProdutos = produtos
    .filter((produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 3);

  // Ao clicar em um produto do dropdown, navega para a página do produto
  const handleProductClick = (produtoId) => {
    setSearchDropdownOpen(false); // fecha dropdown ao clicar
    navigate(`/produto/${produtoId}`);
  };

  return (
    <>
      <header>
        <nav>
          {/* Logo da loja */}
          <img
            src={reactLogo}
            alt="Logo ADIMAX"
            className="logo"
            width="50px"
            height="50px"
          />
          {/* Barra de busca de produtos */}
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
            {/* Dropdown de sugestões de produtos */}
            {searchDropdownOpen && (
              <div
                className="search-dropdown"
                ref={searchRef}
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
          {/* Navegação principal */}
          <ul>
            <li>
              <CustomLink to="/">Início</CustomLink>
            </li>
            <li>
              <CustomLink to="/produtos">Produtos</CustomLink>
            </li>
            {/* Menu do usuário autenticado */}
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
                {/* Dropdown do usuário */}
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
            {/* Botão de login para não autenticados */}
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
