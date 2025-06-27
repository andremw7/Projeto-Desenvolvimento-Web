// AdminVendas.jsx
import { useState, useEffect } from 'react';
import './adminVendas.css';
import './adminNavigation.css';

function AdminVendas() {
  const [pedidos, setPedidos] = useState([]); // Estado para armazenar a lista de pedidos — State to store the list of orders

  // Carrega os pedidos ao montar o componente
  // Loads the orders when the component mounts
  useEffect(() => {
    fetch('http://localhost:3000/admin/pedidos')
      .then(response => response.json())
      .then(data => setPedidos(data))
      .catch(error => console.error('Erro ao carregar os pedidos:', error));
  }, []);

  return (
    <>
      {/* Navegação do admin */}
      {/* Admin navigation */}
      <div className="admin-navigation">
        <button onClick={() => window.location.href = '/admin/produtos'}>Meus Produtos</button>
        <button onClick={() => window.location.href = '/admin/vendas'}>Vendas/Pedidos</button>
        <button onClick={() => window.location.href = '/admin/add-produto'}>Adicionar Produto</button>
        <button onClick={() => window.location.href = '/admin/perfil'}>Perfil Admin</button>
        <button onClick={() => window.location.href = '/register'}>Registrar Admin</button>
      </div>
      <div className="admin-sales-container">
        <div className="header-section">
          <h2>Vendas/Pedidos</h2>
        </div>

        <div className="sales-table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>ID do Pedido</th>
                <th>Usuário</th>
                <th>Data da Compra</th>
                <th>Total</th>
                <th>Status</th> {/* Nova coluna para status — New column for status */}
              </tr>
            </thead>
            <tbody>
              {/* Renderiza cada pedido na tabela */}
              {/* Renders each order in the table */}
              {pedidos.length > 0 ? (
                pedidos.map(pedido => (
                  <tr key={pedido.pedidoId}>
                    <td>{pedido.pedidoId}</td>
                    <td>{pedido.usuarioId}</td>
                    <td>{new Date(pedido.dataCompra).toLocaleDateString()}</td>
                    <td>R$ {pedido.totalPrice.toFixed(2)}</td>
                    <td>
                      {/* Botão para ver o status do pedido */}
                      {/* Button to view the order status */}
                      <button 
                        className="status-button" 
                        onClick={() => window.location.href = `/status-compra/${pedido.pedidoId}`}
                      >
                        Ver Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">Nenhum pedido encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminVendas;
