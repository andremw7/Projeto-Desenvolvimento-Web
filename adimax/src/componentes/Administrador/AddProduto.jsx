// AddProduct.jsx
import { useState } from 'react';
import './AddProduto.css';
import './adminNavigation.css';

function AddProduto() {
  // Estado para armazenar os dados do novo produto
  const [product, setProduct] = useState({
    nome: '',
    preco: '',
    faixaEtaria: '',
    descricao: '',
    tipo: '',
    marca: '',
    imagem: '',
    estoque: '',
  });

  // Estado para controlar o envio do formulário e mensagens de sucesso
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Atualiza o estado do produto conforme o usuário digita nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Envia o formulário para a API para adicionar um novo produto
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Faz uma requisição POST para a rota de adicionar produto
    fetch('http://localhost:3000/admin/add-produto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Produto adicionado com sucesso!');
          // Limpa o formulário após sucesso
          setProduct({
            nome: '',
            preco: '',
            faixaEtaria: '',
            descricao: '',
            tipo: '',
            marca: '',
            imagem: '',
            estoque: '',
          });
        } else {
          response.json().then((error) => {
            alert(`Erro ao adicionar o produto: ${error.error || 'Erro desconhecido'}`);
          });
        }
      })
      .catch((error) => alert(`Erro ao adicionar o produto: ${error.message}`))
      .finally(() => setIsSubmitting(false));
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
      <div className="add-product-page-container">
        {/* Formulário para adicionar produto */}
        <form onSubmit={handleSubmit} className="add-product-form">
          {/* Campos do formulário */}
          <div className="add-product-form-group">
            <label htmlFor="nome">Nome do Produto</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={product.nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="preco">Preço (R$)</label>
            <input
              type="number"
              id="preco"
              name="preco"
              value={product.preco}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="faixaEtaria">Faixa Etária</label>
            <select
              id="faixaEtaria"
              name="faixaEtaria"
              value={product.faixaEtaria}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione</option>
              <option value="filhotes">Filhotes</option>
              <option value="adultos">Adultos</option>
              <option value="sênior">Sênior</option>
            </select>
          </div>

          <div className="add-product-form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={product.descricao}
              onChange={handleInputChange}
              rows="5"
              required
            />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={product.tipo}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione</option>
              <option value="ração">Ração</option>
              <option value="petisco">Petisco</option>
            </select>
          </div>

          <div className="add-product-form-group">
            <label htmlFor="marca">Marca</label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={product.marca}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="estoque">Estoque</label>
            <input
              type="number"
              id="estoque"
              name="estoque"
              value={product.estoque}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="imagem">Nome da Imagem</label>
            <input
              type="text"
              id="imagem"
              name="imagem"
              value={product.imagem}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Botão de envio */}
          <button type="submit" className="add-product-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
          </button>

          {/* Mensagem de sucesso */}
          {successMessage && <p className="add-product-success-message">{successMessage}</p>}
        </form>
      </div>
    </>
  );
}

export default AddProduto;