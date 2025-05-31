import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './componentes/Header/header.jsx';
import Footer from './componentes/Footer/Footer.jsx';
import Home from './componentes/Home/Home.jsx';
import Produtos from './componentes/Produtos/produtos.jsx';
import Login from './componentes/Login/login.jsx';
import Register from './componentes/Register/register.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // Importar o AuthProvider
import Carrinho from './componentes/Carrinho/Carrinho.jsx'; // Importar o componente Carrinho
import Produto from './componentes/Produto/produto';
import FinalizarPedido from './componentes/Carrinho/FinalizarPedido.jsx';
import CheckoutPage from './componentes/Carrinho/Checkoutpage.jsx';
import StatusCompra from './componentes/statusCompra/statusCompra.jsx'; // Corrigir o nome do componente
import AddProduto from './componentes/Administrador/AddProduto.jsx';
import AdminProdutos from './componentes/Administrador/AdminProdutos.jsx';
import AdminVendas from './componentes/Administrador/AdminVendas.jsx';
import PerfilAdmin from './componentes/Administrador/PerfilAdmin.jsx';
import PerfilDados from './componentes/Perfil/perfil_base.jsx'; // Importar a página de dados do perfil
import PerfilPedidos from './componentes/Perfil/PerfilPedidos.jsx'; // Importar a página de pedidos do perfil
import EditPerfil from './componentes/Perfil/edit_perfil.jsx'; // Importar a página edit_perfil
import EditProduto from './componentes/Administrador/EditProduto.jsx'; // Importar a página EditProduto

import './App.css';

function App() {
  return (
    <AuthProvider> {/* Envolver o aplicativo com o AuthProvider */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/carrinho" element={<Carrinho />} /> {/* Adicionada a rota do carrinho */}
              <Route path="/perfil/dados" element={<PerfilDados />} /> {/* Rota para dados do perfil */}
              <Route path="/perfil/pedidos" element={<PerfilPedidos />} /> {/* Rota para pedidos do perfil */}
              <Route path="/produto/:id" element={<Produto />} /> {/* Adicionada a rota do produto */}
              <Route path="/finalizarPedido" element={<FinalizarPedido />} />
              <Route path="/Checkoutpage" element={<CheckoutPage />} />
              <Route path="/status-compra/:pedidoId" element={<StatusCompra />} /> {/* Rota para status da compra */}
              <Route path="/admin/add-produto" element={<AddProduto />} />
              <Route path="/admin/produtos" element={<AdminProdutos />} />
              <Route path="/admin/vendas" element={<AdminVendas />} />
              <Route path="/admin/perfil" element={<PerfilAdmin />} />
              <Route path="/perfil/edit" element={<EditPerfil />} /> {/* Adicionada a rota para editar perfil */}
              <Route path="/admin/edit-produto/:id" element={<EditProduto />} /> {/* Adicionada a rota para editar produto */}
            </Routes>
          </Router>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;