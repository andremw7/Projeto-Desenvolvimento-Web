import { useState } from 'react';
import './register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registro bem-sucedido!');
      // Redirecionar ou realizar outra ação
    } else {
      alert(data.error || 'Erro ao registrar.');
    }
  };

  return (
    <main>
      <div className="content">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Registrar</button>
        </form>
      </div>
    </main>
  );
}

export default Register;