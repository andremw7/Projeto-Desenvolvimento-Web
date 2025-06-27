// src/pages/StatusCompra/StatusCompra.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './statusCompra.css';

function StatusCompra() {
  const { pedidoId } = useParams(); // Pega o ID do pedido da URL // Get order ID from URL
  const { userId, isAdmin, loading } = useAuth(); // Pega userId, isAdmin e loading do AuthContext // Get userId, isAdmin and loading from AuthContext
  const [pedido, setPedido] = useState(null); // Estado para armazenar dados do pedido // State to store order data
  const [loadingPedido, setLoadingPedido] = useState(true); // Estado para controlar loading do pedido // State to control order loading


  // Busca os dados do pedido da API assim que o componente monta (após o carregamento do contexto de autenticação)
  // Fetches the order data from the API when the component mounts (after auth context is loaded)
  useEffect(() => {

    if (loading) return;
    const fetchPedido = async () => {
      try {
        const url = isAdmin
          ? `http://localhost:3000/admin/pedido/${pedidoId}`
          : `http://localhost:3000/status-compra/${pedidoId}`;

        const headers = isAdmin
          ? {}
          : { 'x-user-id': userId };

        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error('Erro ao buscar o pedido.');
        }
        const data = await response.json();
        setPedido(data); // Salva os dados no estado / Save data to state
      } catch (err) {
        console.error('Erro ao buscar o pedido:', err);
        setPedido(null); // Se erro, limpa o pedido / On error, clear the order
      } finally {
        setLoadingPedido(false); // Finaliza o loading do pedido / Finish order loading
      }

    };

// Executa a função para buscar os dados do pedido e renderiza o conteúdo da página de status da compra,
// incluindo informações gerais do pedido, lista de itens e total da compra.
// Executes the function to fetch order data and renders the purchase status page,
// including general order info, item list, and total purchase amount.
    fetchPedido();
  }, [pedidoId, userId, isAdmin, loading]);

  if (loading || loadingPedido) return <p className="statusInfo">Carregando pedido...</p>;
  if (!pedido) return <p className="statusInfo">Pedido não encontrado.</p>;
  return (
    <div className="status-compra-container">
      <h1 className="titulo">Status da Compra</h1>

      <div className="infoPedido">
        <p><strong>ID do Pedido:</strong> {pedido.pedidoId || 'N/A'}</p>
        <p><strong>Data da Compra:</strong> {pedido.dataCompra ? new Date(pedido.dataCompra).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Status:</strong> {pedido.status || 'Aprovado'}</p>
      </div>

      <div className="itens">
        <h2>Itens do Pedido</h2>
        {pedido.itens && pedido.itens.length > 0 ? (
          pedido.itens.map(item => (
            <div key={item.produtoId} className="item">
              <span>Produto ID: {item.produtoId || 'N/A'}</span>
              <span>Quantidade: {item.quantidade || 'N/A'}</span>
              <span>Preço Unitário: R$ {item.preco ? item.preco.toFixed(2) : 'N/A'}</span>
            </div>
          ))
        ) : (
          <p>Nenhum item encontrado.</p>
        )}
      </div>

      <div className="total">
        <strong>Total da Compra:</strong> R$ {pedido.totalPrice ? pedido.totalPrice.toFixed(2) : 'N/A'}
      </div>
    </div>
  );
}

export default StatusCompra;
