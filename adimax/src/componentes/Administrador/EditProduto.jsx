// EditProduto.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AddProduto.css';
import './adminNavigation.css';

function EditProduto() {
  const { id } = useParams(); // Obter o ID do produto da URL — Get the product ID from the URL
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    nome: '',
    preco: '',
    faixaEtaria: '',
    descricao: '',
    tipo: '',
    marca: '',
    imagem: null, // agora armazena o arquivo — now stores the file
    estoque: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar o envio do formulário — State to control form submission
  const [successMessage, setSuccessMessage] = useState(''); // Mensagem de sucesso — Success message

  // Carrega os dados do produto ao montar o componente
  // Loads product data when the component mounts
  useEffect(() => {
    fetch(`http://localhost:3000/produto/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar informações do produto.');
        }
        return response.json();
      })
      .then(data => {
        // Remove "/uploads/" para evitar bugs com input file — Remove "/uploads/" to avoid file input bugs
        setProduct(prev => ({
          ...prev,
          ...data,
          imagem: null
        }));
      })
      .catch(error => {
        console.error('Erro ao carregar o produto:', error.message);
        alert('Erro ao carregar o produto.');
      });
  }, [id]);

  // Atualiza campos de texto — Updates text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Atualiza a imagem ao selecionar novo arquivo — Updates image when a new file is selected
  const handleImageChange = (e) => {
    setProduct(prev => ({ ...prev, imagem: e.target.files[0] }));
  };

  // Envia o formulário com FormData — Submits the form with FormData
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    for (const key in product) {
      if (product[key] !== null) {
        formData.append(key, product[key]);
      }
    }

    fetch(`http://localhost:3000/admin/edit-produto/${id}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Produto atualizado com sucesso!');
          setTimeout(() => navigate(-1), 1500); // Voltar à página anterior — Go back to previous page
        } else {
          response.json().then((error) => {
            alert(`Erro ao atualizar o produto: ${error.error || 'Erro desconhecido'}`);
          });
        }
      })
      .catch((error) => alert(`Erro ao atualizar o produto: ${error.message}`))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      {/* Navegação do admin — Admin navigation */}
      <div className="admin-navigation">
        <button onClick={() => window.location.href = '/admin/produtos'}>Meus Produtos</button>
        <button onClick={() => window.location.href = '/admin/vendas'}>Vendas/Pedidos</button>
        <button onClick={() => window.location.href = '/admin/add-produto'}>Adicionar Produto</button>
        <button onClick={() => window.location.href = '/admin/perfil'}>Perfil Admin</button>
        <button onClick={() => window.location.href = '/register'}>Registrar Admin</button>
      </div>

      <div className="add-product-page-container">
        {/* Formulário para editar produto — Form to edit product */}
        <form onSubmit={handleSubmit} className="add-product-form">
          {/* Campos do formulário — Form fields */}
          <div className="add-product-form-group">
            <label htmlFor="nome">Nome do Produto</label>
            <input type="text" id="nome" name="nome" value={product.nome} onChange={handleInputChange} required />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="preco">Preço (R$)</label>
            <input type="number" id="preco" name="preco" value={product.preco} onChange={handleInputChange} required />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="faixaEtaria">Faixa Etária</label>
            <select id="faixaEtaria" name="faixaEtaria" value={product.faixaEtaria} onChange={handleInputChange} required>
              <option value="">Selecione</option>
              <option value="filhotes">Filhotes</option>
              <option value="adultos">Adultos</option>
              <option value="sênior">Sênior</option>
            </select>
          </div>

          <div className="add-product-form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea id="descricao" name="descricao" value={product.descricao} onChange={handleInputChange} rows="5" required />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" value={product.tipo} onChange={handleInputChange} required>
              <option value="">Selecione</option>
              <option value="ração">Ração</option>
              <option value="petisco">Petisco</option>
            </select>
          </div>

          <div className="add-product-form-group">
            <label htmlFor="marca">Marca</label>
            <input type="text" id="marca" name="marca" value={product.marca} onChange={handleInputChange} required />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="estoque">Estoque</label>
            <input type="number" id="estoque" name="estoque" value={product.estoque} onChange={handleInputChange} required />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="imagem">Atualizar Imagem (opcional)</label>
            <input type="file" id="imagem" name="imagem" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Botão de envio — Submit button */}
          <button type="submit" className="add-product-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Atualizando...' : 'Atualizar Produto'}
          </button>

          {/* Mensagem de sucesso — Success message */}
          {successMessage && <p className="add-product-success-message">{successMessage}</p>}
        </form>
      </div>
    </>
  );
}

export default EditProduto;
