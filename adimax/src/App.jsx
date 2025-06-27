import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './componentes/Header/header.jsx';
import Footer from './componentes/Footer/Footer.jsx';
import Home from './componentes/Home/Home.jsx';
import Produtos from './componentes/Produtos/produtos.jsx';
import Login from './componentes/Login/login.jsx';
import Register from './componentes/Register/register.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Carrinho from './componentes/Carrinho/Carrinho.jsx';
import Produto from './componentes/Produto/produto';
import FinalizarPedido from './componentes/Carrinho/FinalizarPedido.jsx';
import CheckoutPage from './componentes/Carrinho/Checkoutpage.jsx';
import StatusCompra from './componentes/statusCompra/statusCompra.jsx';
import AddProduto from './componentes/Administrador/AddProduto.jsx';
import AdminProdutos from './componentes/Administrador/AdminProdutos.jsx';
import AdminVendas from './componentes/Administrador/AdminVendas.jsx';
import PerfilAdmin from './componentes/Administrador/PerfilAdmin.jsx';
import PerfilDados from './componentes/Perfil/perfil_base.jsx';
import PerfilPedidos from './componentes/Perfil/PerfilPedidos.jsx';
import EditPerfil from './componentes/Perfil/edit_perfil.jsx';
import EditProduto from './componentes/Administrador/EditProduto.jsx';

import './App.css';

function App() {
  return (
    <AuthProvider>

      {/* Envolve a aplicação com o roteador para permitir navegação entre páginas */}
      {/* Wraps the application with the router to enable page navigation */}
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            
            {/* Define todas as rotas da aplicação e os componentes que devem ser exibidos para cada caminho */}
            {/* Defines all application routes and which components to render for each path */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/carrinho" element={<Carrinho />} />
              <Route path="/perfil/dados" element={<PerfilDados />} />
              <Route path="/perfil/pedidos" element={<PerfilPedidos />} />
              <Route path="/produto/:id" element={<Produto />} />
              <Route path="/finalizarPedido" element={<FinalizarPedido />} />
              <Route path="/Checkoutpage" element={<CheckoutPage />} />
              <Route path="/status-compra/:pedidoId" element={<StatusCompra />} />
              <Route path="/admin/add-produto" element={<AddProduto />} />
              <Route path="/admin/produtos" element={<AdminProdutos />} />
              <Route path="/admin/vendas" element={<AdminVendas />} />
              <Route path="/admin/perfil" element={<PerfilAdmin />} />
              <Route path="/perfil/edit" element={<EditPerfil />} />
              <Route path="/admin/edit-produto/:id" element={<EditProduto />} />
            </Routes>
          </main>

         
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
