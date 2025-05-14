import React, { useState, useEffect } from 'react';
import styles from './Carrinho.module.css'; // Importar o CSS Module

const mainStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
};

function Carrinho() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch cart data from the backend
    fetch('http://localhost:3000/carrinho')
      .then(response => response.json())
      .then(data => setCart(data))
      .catch(error => console.error('Erro ao carregar o carrinho:', error));
  }, []);

  const updateQuantity = (productId, change, unitPrice) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.min(item.estoque, Math.max(1, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);

    // Update quantity in the backend
    fetch('http://localhost:3000/updateCart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, change }),
    });
  };

  const removeItem = productId => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);

    // Remove item from the backend
    fetch('http://localhost:3000/removeItem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
  };

  return (
    <>
      <main style={mainStyle}>
        {cart.length > 0 ? (
          cart.map(item => {
            const totalPrice = (item.preco * item.quantity).toFixed(2).replace('.', ',');
            return (
              <div className={styles['cart-item']} key={item.id}>
                <figure>
                  <img src={`/assets/${item.imagem}`} alt={item.nome} />
                  <figcaption>
                    <span>{item.nome}</span>
                    <span>Preço Unitário: R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                    <span>Estoque: {item.estoque}</span>
                    <span id={`total-price-${item.id}`}>Total: R$ {totalPrice}</span>
                  </figcaption>
                </figure>
                <div className={styles['quantity-controls']}>
                  <button onClick={() => updateQuantity(item.id, -1, item.preco)}>-</button>
                  <input
                    type="number"
                    id={`quantity-${item.id}`}
                    value={item.quantity}
                    min="1"
                    max={item.estoque}
                    readOnly
                  />
                  <button onClick={() => updateQuantity(item.id, 1, item.preco)}>+</button>
                </div>
                <button className={styles['remove-button']} onClick={() => removeItem(item.id)}>
                  Remover
                </button>
              </div>
            );
          })
        ) : (
          <p>Nenhum produto no carrinho.</p>
        )}
      </main>
    </>
  );
}

export default Carrinho;
