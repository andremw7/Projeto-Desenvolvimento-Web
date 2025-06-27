import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar o AuthContext // Import AuthContext
import { useNavigate, useSearchParams } from 'react-router-dom';
import './produtos.css';
import formula from '../../assets/formula.png';
import magnus from '../../assets/magnus.png';
import origins from '../../assets/origins.png';

function Produtos() {
  // Estados para filtros, busca, modal e produtos
  // States for filters, search, modal, and products
  const [produtos, setProdutos] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [faixaEtariaSelecionada, setFaixaEtariaSelecionada] = useState('');
  const [ordenacao, setOrdenacao] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal // State to control modal visibility
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa // State for search term
  const { isAuthenticated, userId, isAdmin } = useAuth(); // Usar o estado de autenticação e ID do usuário do AuthContext // Get auth and user info from context
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Capturar parâmetros da URL // Capture URL parameters

  // Carrega os produtos ao montar o componente
  // Load products when component mounts
  useEffect(() => {
    fetch('http://localhost:3000/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => console.error('Erro ao carregar os produtos:', error));
  }, []);

  // Aplica filtro de marca se presente na URL
  // Apply brand filter if present in URL
  useEffect(() => {
    const marca = searchParams.get('marca'); // Capturar o filtro de marca da URL // Get brand from URL
    if (marca) {
      setMarcaSelecionada(marca);
    }
  }, [searchParams]);

  // Filtra e ordena os produtos conforme os filtros e busca
  // Filter and sort products based on filters and search
  const produtosFiltrados = produtos
    .filter(produto => {
      return (
        (!searchTerm || produto.nome.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!marcaSelecionada || produto.marca.toLowerCase() === marcaSelecionada.toLowerCase()) &&
        (!tipoSelecionado || produto.tipo.toLowerCase() === tipoSelecionado.toLowerCase()) &&
        (!faixaEtariaSelecionada || produto.faixaEtaria.toLowerCase() === faixaEtariaSelecionada.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (ordenacao === 'preco-asc') return a.preco - b.preco;
      if (ordenacao === 'preco-desc') return b.preco - a.preco;
      if (ordenacao === 'nome-asc') return a.nome.localeCompare(b.nome);
      if (ordenacao === 'nome-desc') return b.nome.localeCompare(a.nome);
      return 0;
    });

  // Redireciona para a tela de edição do produto
  // Redirect to product edit screen
  const handleEditProduct = (produtoId) => {
    navigate(`/admin/edit-produto/${produtoId}`);
  };

  // Adiciona produto ao carrinho (com modal para login)
  // Add product to cart (with modal prompt if not logged in)
  const handleAddToCart = (produtoId) => {
    if (!isAuthenticated) {
      setModalVisible(true); // Exibe o modal para usuários não logados // Show modal for unauthenticated users
      return;
    }

    fetch(`http://localhost:3000/addCarrinho/${produtoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }), // Enviar o ID do usuário // Send user ID
    })
      .then(response => {
        if (response.ok) {
          setModalVisible(true); // Exibe o modal // Show modal
        } else {
          response.json().then(error => {
            alert(`Erro ao adicionar o produto ao carrinho: ${error.error || 'Erro desconhecido'}`);
          });
        }
      })
      .catch(error => alert(`Erro ao adicionar o produto ao carrinho: ${error.message}`));
  };

  // Redireciona para a página de detalhes do produto
  // Redirect to product details page
  const handleViewDetails = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  return (
    <>
      <main>
        {/* Modal de confirmação de adição ao carrinho ou aviso de login */}
        {/* Modal to confirm add to cart or prompt login */}
        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal">
              {!isAuthenticated ? (
                <>
                  <p>Você não está logado, logo, não pode adicionar nada no carrinho.</p>
                  <button onClick={() => setModalVisible(false)}>Continuar Visualizando</button>
                  <button onClick={() => (window.location.href = '/login')}>Fazer Login</button>
                </>
              ) : (
                <>
                  <p>Produto adicionado ao carrinho com sucesso!</p>
                  <button onClick={() => setModalVisible(false)}>Continuar Comprando</button>
                  <button onClick={() => (window.location.href = '/carrinho')}>Ir para o Carrinho</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Seção inicial com imagens clicáveis por marca */}
        {/* Initial section with clickable brand images */}
        <div className="content-produtos">
          <section className="products">
            <h2>Classes de Produtos</h2>
            <div className="product-grid">
              <figure>
                <a href="/produtos?marca=Fórmula Natural">
                  <img src={formula} alt="Ração Premium para Cães" />
                </a>
              </figure>
              <figure>
                <a href="/produtos?marca=Origens">
                  <img src={origins} alt="Brinquedos para Gatos" />
                </a>
              </figure>
              <figure>
                <a href="/produtos?marca=Magnus">
                  <img src={magnus} alt="Serviços de Banho e Tosa" />
                </a>
              </figure>
            </div>
          </section>
        </div>

        {/* Barra de pesquisa */}
        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Pesquisar por nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filtros de marca, tipo, faixa etária e ordenação */}
        {/* Filters: brand, type, age group and sorting */}
        <div className="filter-containerr">
          {/* Filtro por Marca // Filter by Brand */}
          <div className="filter-buttons">
            <button>Filtrar por Marca</button>
            <div className="filter-dropdown">
              <button className={marcaSelecionada === '' ? 'selected' : ''} onClick={() => setMarcaSelecionada('')}>Todos</button>
              <button className={marcaSelecionada === 'Fórmula Natural' ? 'selected' : ''} onClick={() => setMarcaSelecionada('Fórmula Natural')}>Fórmula</button>
              <button className={marcaSelecionada === 'Origens' ? 'selected' : ''} onClick={() => setMarcaSelecionada('Origens')}>Origens</button>
              <button className={marcaSelecionada === 'Magnus' ? 'selected' : ''} onClick={() => setMarcaSelecionada('Magnus')}>Magnus</button>
            </div>
          </div>

          {/* Filtro por Tipo // Filter by Type */}
          <div className="filter-buttons">
            <button>Filtrar por Tipo</button>
            <div className="filter-dropdown">
              <button className={tipoSelecionado === '' ? 'selected' : ''} onClick={() => setTipoSelecionado('')}>Todos</button>
              <button className={tipoSelecionado === 'ração' ? 'selected' : ''} onClick={() => setTipoSelecionado('ração')}>Ração</button>
              <button className={tipoSelecionado === 'petisco' ? 'selected' : ''} onClick={() => setTipoSelecionado('petisco')}>Petisco</button>
            </div>
          </div>

          {/* Filtro por Faixa Etária // Filter by Age Group */}
          <div className="filter-buttons">
            <button>Filtrar por Faixa Etária</button>
            <div className="filter-dropdown">
              <button className={faixaEtariaSelecionada === '' ? 'selected' : ''} onClick={() => setFaixaEtariaSelecionada('')}>Todos</button>
              <button className={faixaEtariaSelecionada === 'filhotes' ? 'selected' : ''} onClick={() => setFaixaEtariaSelecionada('filhotes')}>Filhotes</button>
              <button className={faixaEtariaSelecionada === 'adultos' ? 'selected' : ''} onClick={() => setFaixaEtariaSelecionada('adultos')}>Adultos</button>
              <button className={faixaEtariaSelecionada === 'sênior' ? 'selected' : ''} onClick={() => setFaixaEtariaSelecionada('sênior')}>Idosos</button>
            </div>
          </div>

          {/* Filtro por Ordenação // Sort Filter */}
          <div className="filter-buttons">
            <button>Ordenar</button>
            <div className="filter-dropdown">
              <button className={ordenacao === 'preco-asc' ? 'selected' : ''} onClick={() => setOrdenacao('preco-asc')}>Preço: Menor para Maior</button>
              <button className={ordenacao === 'preco-desc' ? 'selected' : ''} onClick={() => setOrdenacao('preco-desc')}>Preço: Maior para Menor</button>
              <button className={ordenacao === 'nome-asc' ? 'selected' : ''} onClick={() => setOrdenacao('nome-asc')}>Nome: A-Z</button>
              <button className={ordenacao === 'nome-desc' ? 'selected' : ''} onClick={() => setOrdenacao('nome-desc')}>Nome: Z-A</button>
            </div>
          </div>
        </div>

        {/* Grid de produtos filtrados */}
        {/* Filtered product grid */}
        <div className="product-grid-two-columns">
          {produtosFiltrados.map((produto, index) => (
            <div className="product-card" key={index}>
              <img src={`http://localhost:3000${produto.imagem}`} alt={produto.nome} /> {/* ✅ linha corrigida aqui // Corrected line here */}
              <h3>{produto.nome}</h3>
              <h4><strong>Preço:</strong> {produto.preco != null ? `R$ ${produto.preco.toFixed(2)}` : 'Preço indisponível'}</h4>
              {isAdmin ? (
                <button onClick={() => handleEditProduct(produto.id)}>Editar Produto</button>
              ) : (
                <button onClick={() => handleAddToCart(produto.id)}>Comprar</button>
              )}
              <button onClick={() => handleViewDetails(produto.id)}>Ver Detalhes</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Produtos;
