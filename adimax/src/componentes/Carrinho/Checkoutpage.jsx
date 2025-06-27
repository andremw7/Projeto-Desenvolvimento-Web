// src/componentes/Checkout/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './checkoutPage.module.css';

const CheckoutPage = () => {
  // Estado para método de pagamento — State for payment method
  const [paymentMethod, setPaymentMethod] = useState('pix');
  // Estado para os dados do formulário de entrega e pagamento — State for delivery and payment form data
  const [formData, setFormData] = useState({
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
    observacoes: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });
  // Estado para erros de validação — State for validation errors
  const [errors, setErrors] = useState({});
  // Estado para código PIX gerado — State for generated PIX code
  const [pixCode, setPixCode] = useState('');
  const { userId } = useAuth();
  const navigate = useNavigate();

  // Gera código PIX fictício ao carregar a página — Generate fake PIX code on page load
  useEffect(() => {
    generatePixCode();
  }, []);

  // Função para gerar código aleatório do PIX — Function to generate random PIX code
  const generatePixCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setPixCode(randomCode.toUpperCase());
  };

  // Atualiza o estado do formulário conforme o usuário digita — Update form state as user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Valida os campos obrigatórios do formulário — Validate required form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
    if (!formData.endereco) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Número do cartão é obrigatório';
      if (!formData.cardName) newErrors.cardName = 'Nome no cartão é obrigatório';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Validade é obrigatória';
      if (!formData.cardCvv) newErrors.cardCvv = 'CVV é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envia os dados para finalizar a compra — Send data to finalize purchase
  const finalizarCompra = () => {
    fetch('http://localhost:3000/finalizarCompra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            alert('Compra finalizada com sucesso!');
            navigate(`/status-compra/${data.pedido.pedidoId}`);
          });
        } else {
          response.json().then(error => {
            alert(`Erro ao finalizar a compra: ${error.error || 'Erro desconhecido'}`);
          });
        }
      })
      .catch(error => alert(`Erro ao finalizar a compra: ${error.message}`));
  };

  // Handler do submit do formulário — Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      finalizarCompra();
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.checkoutTitle}>Finalizar Compra</h1>
      {/* Formulário de entrega e pagamento — Delivery and payment form */}
      <form onSubmit={handleSubmit} className={styles.checkoutForm}>
        <div className={styles.checkoutSection}>
          <h2 className={styles.checkoutSectionTitle}>Endereço de Entrega</h2>
          {/* Campos de endereço — Address fields */}
          <div className={styles.checkoutFormGroup}>
            <label>CEP*</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              placeholder="00000-000"
              className={errors.cep ? styles.checkoutErrorInput : ''}
            />
            {errors.cep && <span className={styles.checkoutErrorMessage}>{errors.cep}</span>}
          </div>
          <div className={styles.checkoutFormGroup}>
            <label>Endereço*</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              placeholder="Rua, número, complemento"
              className={errors.endereco ? styles.checkoutErrorInput : ''}
            />
            {errors.endereco && <span className={styles.checkoutErrorMessage}>{errors.endereco}</span>}
          </div>
          <div className={styles.checkoutFormRow}>
            <div className={styles.checkoutFormGroup}>
              <label>Cidade*</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                placeholder="Sua cidade"
                className={errors.cidade ? styles.checkoutErrorInput : ''}
              />
              {errors.cidade && <span className={styles.checkoutErrorMessage}>{errors.cidade}</span>}
            </div>
            <div className={styles.checkoutFormGroup}>
              <label>Estado*</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                placeholder="UF"
                className={errors.estado ? styles.checkoutErrorInput : ''}
              />
              {errors.estado && <span className={styles.checkoutErrorMessage}>{errors.estado}</span>}
            </div>
          </div>
          <div className={styles.checkoutFormGroup}>
            <label>Observações de entrega (opcional)</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              placeholder="Instruções especiais para entrega"
              rows="3"
            />
          </div>
        </div>
        <div className={styles.checkoutSection}>
          <h2 className={styles.checkoutSectionTitle}>Método de Pagamento</h2>
          {/* Opções de pagamento — Payment options */}
          <div className={styles.checkoutPaymentMethods}>
            <div 
              className={`${styles.checkoutPaymentOption} ${paymentMethod === 'pix' ? styles.checkoutActive : ''}`}
              onClick={() => setPaymentMethod('pix')}
            >
              <input 
                type="radio" 
                name="paymentMethod" 
                checked={paymentMethod === 'pix'} 
                readOnly
              />
              <span>PIX</span>
              <img src="/assets/pix-logo.png" alt="PIX" className={styles.paymentLogo} />
            </div>
            <div 
              className={`${styles.checkoutPaymentOption} ${paymentMethod === 'creditCard' ? styles.checkoutActive : ''}`}
              onClick={() => setPaymentMethod('creditCard')}
            >
              <input 
                type="radio" 
                name="paymentMethod" 
                checked={paymentMethod === 'creditCard'} 
                readOnly
              />
              <span>Cartão de Crédito</span>
              <div className={styles.cardLogos}>
                <img src="/assets/visa-logo.png" alt="Visa" />
                <img src="/assets/mastercard-logo.png" alt="Mastercard" />
              </div>
            </div>
          </div>
          {/* Renderiza campos de acordo com o método de pagamento — Render fields based on payment method */}
          {paymentMethod === 'pix' && (
            <div className={styles.checkoutPixContainer}>
              <div className={styles.checkoutPixCodeContainer}>
                <h3>Código PIX</h3>
                <div className={styles.checkoutPixCode}>{pixCode}</div>
                <button 
                  type="button" 
                  className={styles.checkoutCopyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(pixCode);
                    alert('Código PIX copiado!');
                  }}
                >
                  Copiar Código
                </button>
              </div>
              <div className={styles.checkoutQrCodeContainer}>
                <h3>QR Code</h3>
                <div className={styles.checkoutQrCodePlaceholder}>
                  <div className={styles.checkoutQrCodeFake}>
                    <div className={styles.checkoutQrCodeLines}></div>
                    <span className={styles.checkoutQrCodeText}>QR Code</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod === 'creditCard' && (
            <div className={styles.checkoutCreditCardForm}>
              <div className={styles.checkoutFormGroup}>
                <label>Número do Cartão*</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="0000 0000 0000 0000"
                  className={errors.cardNumber ? styles.checkoutErrorInput : ''}
                />
                {errors.cardNumber && <span className={styles.checkoutErrorMessage}>{errors.cardNumber}</span>}
              </div>
              <div className={styles.checkoutFormGroup}>
                <label>Nome no Cartão*</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="Como no cartão"
                  className={errors.cardName ? styles.checkoutErrorInput : ''}
                />
                {errors.cardName && <span className={styles.checkoutErrorMessage}>{errors.cardName}</span>}
              </div>
              <div className={styles.checkoutFormRow}>
                <div className={styles.checkoutFormGroup}>
                  <label>Validade*</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    className={errors.cardExpiry ? styles.checkoutErrorInput : ''}
                  />
                  {errors.cardExpiry && <span className={styles.checkoutErrorMessage}>{errors.cardExpiry}</span>}
                </div>
                <div className={styles.checkoutFormGroup}>
                  <label>CVV*</label>
                  <input
                    type="text"
                    name="cardCvv"
                    value={formData.cardCvv}
                    onChange={handleInputChange}
                    placeholder="000"
                    className={errors.cardCvv ? styles.checkoutErrorInput : ''}
                  />
                  {errors.cardCvv && <span className={styles.checkoutErrorMessage}>{errors.cardCvv}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Botões de ação — Action buttons */}
        <div className={styles.checkoutActions}>
          <Link to="/carrinho" className={styles.checkoutBackLink}>
            ← Voltar para o carrinho
          </Link>
          <button type="submit" className={styles.checkoutSubmitButton}>
            Confirmar Pagamento
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
