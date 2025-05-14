import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './componentes/Header/header.jsx';
import Footer from './componentes/Footer/Footer.jsx';
import Home from './componentes/Home/Home.jsx';
import Produtos from './componentes/Produtos/produtos.jsx';
import Login from './componentes/Login/login.jsx';
import Register from './componentes/Register/register.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // Importar o AuthProvider
import Carrinho from './componentes/Carrinho/Carrinho.jsx'; // Importar o componente Carrinho
import Perfil from './componentes/Perfil/perfil.jsx'; // Importar o componente Perfil
import Produto from './componentes/Produto/produto';

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
              <Route path="/perfil" element={<Perfil />} /> {/* Adicionada a rota do perfil */}
              <Route path="/produto/:id" element={<Produto />} /> {/* Adicionada a rota do produto */}
            </Routes>
          </Router>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;