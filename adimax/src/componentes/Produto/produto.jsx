import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './produto.css';

function Produto() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { isAuthenticated } = useAuth();

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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setModalVisible(true); // Exibe o modal para usuários não logados
      return;
    }

    fetch(`http://localhost:3000/addCarrinho/${id}`, { method: 'POST' })
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

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!produto) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <div className="produto-detalhes">
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

      <img src={`/assets${produto.imagem}`} alt={produto.nome} />
      <h1>{produto.nome}</h1>
      <p><strong>Descrição:</strong> {produto.descricao}</p>
      <p><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</p>
      <p><strong>Marca:</strong> {produto.marca}</p>
      <p><strong>Faixa Etária:</strong> {produto.faixaEtaria}</p>
      <p><strong>Tipo:</strong> {produto.tipo}</p>
      <p><strong>Estoque:</strong> {produto.estoque}</p>
      <button onClick={handleAddToCart}>Comprar</button>
    </div>
  );
}

export default Produto;
