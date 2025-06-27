import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Carrinho.module.css';

const mainStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
};

function Carrinho() {
  // Obtém informações de autenticação do contexto — Get authentication info from context
  const { userId, isAuthenticated } = useAuth();
  // Estado para armazenar os itens do carrinho — State to store cart items
  const [cart, setCart] = useState([]);

  // Carrega os itens do carrinho ao montar o componente ou quando userId/isAuthenticated mudam — Load cart items on mount or when userId/isAuthenticated change
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetch(`http://localhost:3000/carrinho/${userId}`)
        .then(response => response.json())
        .then(data => {
          // Garante que a quantidade não ultrapasse o estoque — Ensure quantity does not exceed stock
          const updatedCart = data.map(item => ({
            ...item,
            quantity: Math.min(item.quantity, item.estoque),
          }));
          setCart(updatedCart);
        })
        .catch(error => console.error('Erro ao carregar o carrinho:', error));
    }
  }, [userId, isAuthenticated]);

  // Atualiza a quantidade de um item no carrinho (local e backend) — Update quantity of item in cart (local and backend)
  const updateQuantity = (productId, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.min(item.estoque, Math.max(1, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);

    // Atualiza quantidade no backend — Update quantity in backend
    fetch('http://localhost:3000/updateCart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, change, userId }),
    }).then(response => {
      if (!response.ok) {
        response.json().then(error => {
          alert(`Erro ao atualizar quantidade: ${error.error || 'Erro desconhecido'}`);
        });
      }
    }).catch(error => console.error('Erro ao atualizar quantidade no backend:', error));
  };

  // Remove um item do carrinho (local e backend) — Remove an item from the cart (local and backend)
  const removeItem = productId => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);

    // Remove item no backend — Remove item in backend
    fetch('http://localhost:3000/removeItem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userId }),
    }).then(response => {
      if (!response.ok) {
        console.error('Erro ao remover item no backend.');
      }
    });
  };

  return (
    <>
      <main style={mainStyle}>
        {/* Renderiza o carrinho se houver itens, senão mostra mensagem de vazio — Render cart if items exist, else show empty message */}
        {cart.length > 0 ? (
          <>
            <div className={styles['cart-container']}>
              <div className={styles['cart-body']}>
                {/* Renderiza cada item do carrinho — Render each cart item */}
                {cart.map(item => {
                  const totalPrice = (item.preco * item.quantity).toFixed(2).replace('.', ',');
                  return (
                    <div className={styles['cart-item']} key={item.id}>
                      <figure>
                        <img src={`http://localhost:3000${item.imagem}`} alt={item.nome} />
                        <figcaption>
                          <span>{item.nome}</span>
                          <span>Preço Unitário: R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                          <span>Estoque: {item.estoque}</span>
                          <span id={`total-price-${item.id}`}>Total: R$ {totalPrice}</span>
                        </figcaption>
                      </figure>
                      <div className={styles['quantity-controls']}>
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <input
                          type="number"
                          id={`quantity-${item.id}`}
                          value={item.quantity}
                          min="1"
                          max={item.estoque}
                          readOnly
                        />
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <button className={styles['remove-button']} onClick={() => removeItem(item.id)}>
                        Remover
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className={styles['cart-sidebar']}>
                <div className={styles['total-price']}>
                  <span>Total da Compra:</span>
                  <span>R$ {cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0).toFixed(2).replace('.', ',')}</span>
                </div>
                <Link to="/finalizarPedido" className={styles['finalizar-button']}>
                  Finalizar Pedido
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className={styles['empty-cart']}>
            <p>Nenhum produto no carrinho.</p>
          </div>
        )}
      </main>
    </>
  );
}

export default Carrinho;
