// src/pages/StatusCompra/StatusCompra.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './statusCompra.css';

function StatusCompra() {
  const { pedidoId } = useParams();
  const { userId, isAdmin, loading } = useAuth(); // Inclua loading do AuthContext
  const [pedido, setPedido] = useState(null);
  const [loadingPedido, setLoadingPedido] = useState(true);

  useEffect(() => {
    // Aguarda o carregamento do contexto de autenticação
    if (loading) return;

    const fetchPedido = async () => {
      try {
        const url = isAdmin
          ? `http://localhost:3000/admin/pedido/${pedidoId}`
          : `http://localhost:3000/status-compra/${pedidoId}`;

        // Para usuários comuns, envie o userId no header
        const headers = isAdmin
          ? {}
          : { 'x-user-id': userId };

        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error('Erro ao buscar o pedido.');
        }

        const data = await response.json();
        setPedido(data);
      } catch (err) {
        console.error('Erro ao buscar o pedido:', err);
        setPedido(null);
      } finally {
        setLoadingPedido(false);
      }
    };

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
