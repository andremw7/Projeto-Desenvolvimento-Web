// AdminProdutos.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './adminProdutos.css';
import './adminNavigation.css';

function AdminProdutos() {
  const navigate = useNavigate(); // Inicializar useNavigate
  const [products, setProducts] = useState([]); // Lista de produtos
  const [editingId, setEditingId] = useState(null); // ID do produto em edição
  const [editForm, setEditForm] = useState({ id: '', nome: '', preco: '', estoque: '' }); // Estado do formulário de edição

  // Carrega os produtos ao montar o componente
  useEffect(() => {
    fetch('http://localhost:3000/produtos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar os produtos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => setProducts(data))
        .catch(error => console.error('Erro ao carregar os produtos:', error));
  }, []);

  // Ao clicar em editar, preenche o formulário com os dados do produto selecionado
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm({
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      estoque: product.estoque
    });
  };

  // Atualiza o estado do formulário de edição conforme o usuário digita
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Salva as alterações localmente (não envia para o backend)
  const handleSaveEdit = () => {
    setProducts(products.map(product => 
      product.id === editingId ? { ...editForm } : product
    ));
    setEditingId(null);
  };

  // Remove o produto do backend e da lista local
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/admin/delete-produto/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setProducts(products.filter(product => product.id !== id)); // Remover o produto da lista
          alert('Produto excluído com sucesso!');
        } else {
          response.json().then(error => {
            alert(`Erro ao excluir o produto: ${error.error || 'Erro desconhecido'}`);
          });
        }
      })
      .catch(error => alert(`Erro ao excluir o produto: ${error.message}`));
  };

  return (
    <>
      {/* Navegação do admin */}
      <div className="admin-navigation">
        <button onClick={() => window.location.href = '/admin/produtos'}>Meus Produtos</button>
        <button onClick={() => window.location.href = '/admin/vendas'}>Vendas/Pedidos</button>
        <button onClick={() => window.location.href = '/admin/add-produto'}>Adicionar Produto</button>
        <button onClick={() => window.location.href = '/admin/perfil'}>Perfil Admin</button>
        <button onClick={() => window.location.href = '/register'}>Registrar Admin</button>
      </div>
      <div className="admin-produtos-page-container">
        <div className="admin-produtos-container">
          <div className="admin-produtos-header-section">
            <h2>Meus Produtos</h2>
          </div>

          <div className="admin-produtos-table-container">
            <table className="admin-produtos-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Item</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Renderiza cada produto na tabela */}
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {editingId === product.id ? (
                        <input
                          type="text"
                          name="nome"
                          value={editForm.nome}
                          onChange={handleEditChange}
                        />
                      ) : (
                        product.nome
                      )}
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <input
                          type="text"
                          name="preco"
                          value={editForm.preco}
                          onChange={handleEditChange}
                        />
                      ) : (
                        `R$ ${product.preco.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <input
                          type="number"
                          name="estoque"
                          value={editForm.estoque}
                          onChange={handleEditChange}
                        />
                      ) : (
                        product.estoque
                      )}
                    </td>
                    <td className="admin-produtos-actions-cell">
                      {editingId === product.id ? (
                        <>
                          <button 
                            className="admin-produtos-save-btn"
                            onClick={handleSaveEdit}
                          >
                            Salvar
                          </button>
                          <button 
                            className="admin-produtos-cancel-btn"
                            onClick={() => setEditingId(null)}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Redireciona para a tela de edição do produto */}
                          <button 
                            className="admin-produtos-edit-btn"
                            onClick={() => navigate(`/admin/edit-produto/${product.id}`)}
                          >
                            Editar
                          </button>
                          {/* Remove o produto */}
                          <button 
                            className="admin-produtos-delete-btn"
                            onClick={() => handleDelete(product.id)}
                          >
                            Excluir
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminProdutos;