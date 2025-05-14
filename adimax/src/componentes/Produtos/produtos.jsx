import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar o AuthContext
import { useNavigate } from 'react-router-dom';
import './produtos.css';
import formula from '../../assets/formula.png';
import magnus from '../../assets/magnus.png';
import origins from '../../assets/origins.png';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [faixaEtariaSelecionada, setFaixaEtariaSelecionada] = useState('');
  const [ordenacao, setOrdenacao] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const { isAuthenticated } = useAuth(); // Usar o estado de autenticação do AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => console.error('Erro ao carregar os produtos:', error));
  }, []);

  const produtosFiltrados = produtos
    .filter(produto => {
      return (
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

  const handleAddToCart = (produtoId) => {
    if (!isAuthenticated) {
      setModalVisible(true); // Exibe o modal para usuários não logados
      return;
    }

    fetch(`http://localhost:3000/addCarrinho/${produtoId}`, { method: 'POST' })
      .then(response => {
        if (response.ok) {
          setModalVisible(true); // Exibe o modal
        } else {
          response.json().then(error => {
            alert(`Erro ao adicionar o produto ao carrinho: ${error.error || 'Erro desconhecido'}`);
          });
        }
      })
      .catch(error => alert(`Erro ao adicionar o produto ao carrinho: ${error.message}`));
  };

  const handleViewDetails = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  return (
    <>
      <main>
        {/* Modal de confirmação */}
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

        <div class="content-produtos">
          <section class="products">
            <h2>Classes de Produtos</h2>
            <div class="product-grid">
              <figure>
                <a href="produtos_formula.html">
                  <img src={formula} alt="Ração Premium para Cães" />
                </a>
              </figure>
              <figure>
                <a href="produtos_origins.html">
                  <img src={origins} alt="Brinquedos para Gatos" />
                </a>
              </figure>
              <figure>
                <a href="produtos_magnus.html">
                  <img src={magnus} alt="Serviços de Banho e Tosa"/>
                </a>
              </figure>
            </div>
          </section>
        </div>

        {/* Filtros */}
        <div class="filter-containerr">
          {/* Filtro por Marca */}
          <div class="filter-buttons">
            <button>Filtrar por Marca</button>
            <div class="filter-dropdown">
              <button className={marcaSelecionada === '' ? 'selected' : ''} onClick={() => setMarcaSelecionada('')}>Todos</button>
              <button className={marcaSelecionada === 'Fórmula Natural' ? 'selected' : ''} onClick={() => setMarcaSelecionada('Fórmula Natural')}>Fórmula</button>
              <button className={marcaSelecionada === 'Origens' ? 'selected' : ''} onClick={() => setMarcaSelecionada('Origens')}>Origens</button>
              <button className={marcaSelecionada === 'Magnus' ? 'selected' : ''} onClick={() => setMarcaSelecionada('Magnus')}>Magnus</button>
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div class="filter-buttons">
            <button>Filtrar por Tipo</button>
            <div class="filter-dropdown">
              <button className={tipoSelecionado === '' ? 'selected' : ''} onClick={() => setTipoSelecionado('')}>Todos</button>
              <button className={tipoSelecionado === 'ração' ? 'selected' : ''} onClick={() => setTipoSelecionado('ração')}>Ração</button>
              <button className={tipoSelecionado === 'petisco' ? 'selected' : ''} onClick={() => setTipoSelecionado('petisco')}>Petisco</button>
            </div>
          </div>

          {/* Filtro por Faixa Etária */}
          <div class="filter-buttons">
            <button>Filtrar por Faixa Etária</button>
            <div class="filter-dropdown">
              <button className={faixaEtariaSelecionada === '' ? 'selected' : ''} onClick={() => setFaixaEtariaSelecionada('')}>Todos</button>
              <button className={faixaEtariaSelecionada === 'filhotes' ? 'selected' : ''} onClick={() => setFaixaEtariaSelecionada('filhotes')}>Filhotes</button>
              <button className={faixaEtariaSelecionada === 'adultos' ? 'selected' : ''} onClick={() => setFaixaEtariaSelecionada('adultos')}>Adultos</button>
              <button className={faixaEtariaSelecionada === 'sênior' ? 'selected' : ''} onClick={() => setFaixaEtariaSelecionada('sênior')}>Idosos</button>
            </div>
          </div>

          {/* Filtro por Ordenação */}
          <div class="filter-buttons">
            <button>Ordenar</button>
            <div class="filter-dropdown">
              <button className={ordenacao === 'preco-asc' ? 'selected' : ''} onClick={() => setOrdenacao('preco-asc')}>Preço: Menor para Maior</button>
              <button className={ordenacao === 'preco-desc' ? 'selected' : ''} onClick={() => setOrdenacao('preco-desc')}>Preço: Maior para Menor</button>
              <button className={ordenacao === 'nome-asc' ? 'selected' : ''} onClick={() => setOrdenacao('nome-asc')}>Nome: A-Z</button>
              <button className={ordenacao === 'nome-desc' ? 'selected' : ''} onClick={() => setOrdenacao('nome-desc')}>Nome: Z-A</button>
            </div>
          </div>
        </div>

        <div class="product-grid-two-columns">
          {produtosFiltrados.map((produto, index) => (
            <div class="product-card" key={index}>
              <img src={`/assets${produto.imagem}`} alt={produto.nome} />
              <h3>{produto.nome}</h3>
              <h4><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</h4>
              <button onClick={() => handleAddToCart(produto.id)}>Comprar</button>
              <button onClick={() => handleViewDetails(produto.id)}>Ver Detalhes</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Produtos;
