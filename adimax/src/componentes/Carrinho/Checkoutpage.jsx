// src/componentes/Checkout/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './checkoutPage.module.css';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('pix');
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
  const [errors, setErrors] = useState({});
  const [pixCode, setPixCode] = useState('');
  const navigate = useNavigate();

  // Gera código PIX fictício ao carregar a página
  useEffect(() => {
    generatePixCode();
  }, []);

  const generatePixCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setPixCode(randomCode.toUpperCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/status-compra');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Finalizar Compra</h1>
      
      <form onSubmit={handleSubmit} className={styles.checkoutForm}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Endereço de Entrega</h2>
          
          <div className={styles.formGroup}>
            <label>CEP*</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              placeholder="00000-000"
              className={errors.cep ? styles.errorInput : ''}
            />
            {errors.cep && <span className={styles.errorMessage}>{errors.cep}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Endereço*</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              placeholder="Rua, número, complemento"
              className={errors.endereco ? styles.errorInput : ''}
            />
            {errors.endereco && <span className={styles.errorMessage}>{errors.endereco}</span>}
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Cidade*</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                placeholder="Sua cidade"
                className={errors.cidade ? styles.errorInput : ''}
              />
              {errors.cidade && <span className={styles.errorMessage}>{errors.cidade}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Estado*</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                placeholder="UF"
                className={errors.estado ? styles.errorInput : ''}
              />
              {errors.estado && <span className={styles.errorMessage}>{errors.estado}</span>}
            </div>
          </div>
          
          <div className={styles.formGroup}>
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
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Método de Pagamento</h2>
          
          <div className={styles.paymentMethods}>
            <div 
              className={`${styles.paymentOption} ${paymentMethod === 'pix' ? styles.active : ''}`}
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
              className={`${styles.paymentOption} ${paymentMethod === 'creditCard' ? styles.active : ''}`}
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
          
          {paymentMethod === 'pix' && (
            <div className={styles.pixContainer}>
              <div className={styles.pixCodeContainer}>
                <h3>Código PIX Copia e Cola</h3>
                <div className={styles.pixCode}>{pixCode}</div>
                <button 
                  type="button" 
                  className={styles.copyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(pixCode);
                    alert('Código PIX copiado!');
                  }}
                >
                  Copiar Código
                </button>
              </div>
              
              <div className={styles.qrCodeContainer}>
                <h3>Ou escaneie o QR Code</h3>
                <div className={styles.qrCodePlaceholder}>
                  {/* Substituir por um QR code real se necessário */}
                  <div className={styles.qrCodeFake}>
                    <div className={styles.qrCodeLines}></div>
                    <div className={styles.qrCodeText}>PIX</div>
                  </div>
                </div>
                <p className={styles.pixInstructions}>
                  Pagamentos via PIX são aprovados em até 30 minutos
                </p>
              </div>
            </div>
          )}
          
          {paymentMethod === 'creditCard' && (
            <div className={styles.creditCardForm}>
              <div className={styles.formGroup}>
                <label>Número do Cartão*</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="0000 0000 0000 0000"
                  className={errors.cardNumber ? styles.errorInput : ''}
                />
                {errors.cardNumber && <span className={styles.errorMessage}>{errors.cardNumber}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label>Nome no Cartão*</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="Como no cartão"
                  className={errors.cardName ? styles.errorInput : ''}
                />
                {errors.cardName && <span className={styles.errorMessage}>{errors.cardName}</span>}
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Validade*</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    className={errors.cardExpiry ? styles.errorInput : ''}
                  />
                  {errors.cardExpiry && <span className={styles.errorMessage}>{errors.cardExpiry}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>CVV*</label>
                  <input
                    type="text"
                    name="cardCvv"
                    value={formData.cardCvv}
                    onChange={handleInputChange}
                    placeholder="000"
                    className={errors.cardCvv ? styles.errorInput : ''}
                  />
                  {errors.cardCvv && <span className={styles.errorMessage}>{errors.cardCvv}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.actions}>
          <Link to="/carrinho" className={styles.backLink}>
            ← Voltar para o carrinho
          </Link>
          <button type="submit" className={styles.submitButton}>
            Confirmar Pagamento
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;