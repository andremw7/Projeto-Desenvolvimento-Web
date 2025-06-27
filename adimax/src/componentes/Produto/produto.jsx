import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Adicionado useNavigate // Added useNavigate
import { useAuth } from '../../context/AuthContext';
import './produto.css';

function Produto() {
  const { id } = useParams();
  const navigate = useNavigate(); // Inicializar useNavigate // Initialize useNavigate
  // Estado para armazenar os dados do produto
  // State to store product data
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userId, isAdmin } = useAuth(); // Adicionado isAdmin // Added isAdmin
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal // State to control modal visibility

  // Carrega os dados do produto ao montar o componente
  // Load product data when the component mounts
  useEffect(() => {
    fetch(`http://localhost:3000/produto/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Produto não encontrado');
        }
        return response.json();
      })
      .then(data => {
        setProduto(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar o produto:', error);
        setLoading(false);
      });
  }, [id]);

  // Redireciona para a tela de edição do produto (admin)
  // Redirect to product edit page (admin)
  const handleEditProduct = () => {
    navigate(`/admin/edit-produto/${id}`);
  };

  // Adiciona produto ao carrinho (com modal para login)
  // Add product to cart (with modal for login prompt)
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setModalVisible(true); // Exibe o modal para usuários não logados // Show modal for unauthenticated users
      return;
    }

    fetch(`http://localhost:3000/addCarrinho/${id}`, {
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

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!produto) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <div className="produto-detalhes">
      {/* Modal de confirmação/adicionar ao carrinho */}
      {/* Confirmation modal / add to cart */}
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

      <div className="imagem-container">
        <div className="main-image">
          <img src={`http://localhost:3000${produto.imagem}`} alt={produto.nome} />
        </div>
      </div>
      <div className="texto-container">
        <h1>{produto.nome}</h1>
        <div className="price-section">
          <span className="price">R$ {produto.preco.toFixed(2)}</span>
        </div>
        <p className="description">{produto.descricao}</p>
        <div className="details">
          <span><strong>Marca:</strong> {produto.marca}</span>
          <span><strong>Faixa Etária:</strong> {produto.faixaEtaria}</span>
          <span><strong>Tipo:</strong> {produto.tipo}</span>
          <span><strong>Estoque:</strong> {produto.estoque}</span>
        </div>
        <div className="actions">
          {isAdmin ? (
            <button className="buy-button" onClick={handleEditProduct}>Editar Produto</button>
          ) : (
            <button className="buy-button" onClick={handleAddToCart}>Comprar Agora</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Produto;
