// src/componentes/Checkout/finalizarPedido.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importar o AuthContext — Import AuthContext
import styles from './finalizarPedido.module.css';

const FinalizarPedido = () => {
  // Estado para armazenar os itens do carrinho — State to store cart items
  const [cart, setCart] = useState([]);
  const { userId } = useAuth(); // Usar o ID do usuário do AuthContext — Use user ID from AuthContext
  const navigate = useNavigate();

  // Carrega os itens do carrinho ao montar o componente — Load cart items when component mounts
  useEffect(() => {
    fetch(`http://localhost:3000/carrinho/${userId}`)
      .then(response => response.json())
      .then(data => setCart(data))
      .catch(error => console.error('Erro ao carregar o carrinho:', error)); // Error loading cart
  }, [userId]);

  // Cálculos de subtotal, frete e total — Calculations for subtotal, shipping and total
  const subtotal = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
  const frete = 15.00; // Valor fixo de exemplo — Example fixed shipping cost
  const total = subtotal + frete;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Resumo do Pedido</h1>
      <div className={styles.orderSummary}>
        {/* Lista de itens do pedido — List of order items */}
        <div className={styles.orderItems}>
          {cart.map(item => (
            <div key={item.id} className={styles.orderItem}>
             <img src={`http://localhost:3000${item.imagem}`} alt={item.nome} className={styles.productImage} />
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.nome}</span>
                <span className={styles.itemDescription}>{item.descricao}</span>
                <span className={styles.itemQuantity}>Quantidade: {item.quantity}</span>
              </div>
              <span className={styles.itemPrice}>
                R$ {(item.preco * item.quantity).toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>
        {/* Totais do pedido — Order totals */}
        <div className={styles.summaryTotals}>
          <div className={styles.summaryRow}>
            <span>Subtotal ({cart.length} itens)</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Frete</span>
            <span>R$ {frete.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        {/* Botões de ação — Action buttons */}
        <div className={styles.buttonsContainer}>
          <Link to="/produtos" className={styles.backButton}>
            Adicionar mais produtos
          </Link>
          <Link to="/CheckoutPage" className={styles.checkoutButton}>
            Finalizar Compra
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FinalizarPedido;
