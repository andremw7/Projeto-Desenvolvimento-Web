// src/pages/StatusCompra/StatusCompra.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importar o AuthContext
import './statusCompra.css';

function StatusCompra() {
  const { pedidoId } = useParams();
  const { userId, isAdmin } = useAuth(); // Usar o estado de autenticação e verificar se é admin
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const url = isAdmin 
          ? `http://localhost:3000/admin/pedido/${pedidoId}` // Rota para admin puxar diretamente pelo pedidoId
          : `http://localhost:3000/status-compra/${pedidoId}`;
        
        const headers = isAdmin ? {} : { 'x-user-id': userId }; // Enviar o userId apenas se não for admin

        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error('Erro ao buscar o pedido.');
        }

        const data = await response.json();
        setPedido(data);
      } catch (err) {
        console.error('Erro ao buscar o pedido:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [pedidoId, userId, isAdmin]);

  if (loading) return <p className="statusInfo">Carregando pedido...</p>;
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
