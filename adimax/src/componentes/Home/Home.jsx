import { useState } from 'react';
import './home.css';
import petBanner from '../../assets/pet-banner.png';
import formula from '../../assets/formula.png';
import magnus from '../../assets/magnus.png';
import origins from '../../assets/origins.png';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <main>
          <section className="hero text-center">
            <div className="container">
              <div className="row mx-auto" style={{ maxWidth: '600px' }}>
                <div className="text-start">
                  <h1 className="display-5 fw-bold">O melhor para o seu pet</h1>
                  <p className="lead" style={{ color: 'white' }}>Alimentos de qualidade e muito carinho para quem faz parte da sua família.</p>
                  <a href="#produtos" className="btn btn-primary btn-lg me-2">Conhecer Produtos</a>
                  <a href="#sobre" className="btn btn-outline-light btn-lg" style={{ backgroundColor: 'black', color: 'white', border: '2px solid black' }}>Saiba Mais</a>
                </div>
              </div>
              <div className="col-lg-6">
                <img src={petBanner} alt="Cachorro feliz" className="img-fluid rounded" />
              </div>
            </div>
          </section>

          <section className="brands py-5">
            <div className="container text-center">
              <h2 className="fw-bold mb-4">Nossas Marcas</h2>
              <div className="row">
                <div className="col-md-4">
                  <a href="produtos_formula.html">
                    <img src={formula} alt="Fórmula" className="img-fluid rounded mb-3" />
                  </a>
                  <h5 className="fw-bold">
                    <a href="produtos_formula.html" className="text-decoration-none text-dark">Fórmula Natural</a>
                  </h5>
                  <p>Rações premium desenvolvidas com ingredientes de alta qualidade para o bem-estar do seu pet.</p>
                </div>
                <div className="col-md-4">
                  <a href="produtos_origins.html">
                    <img src={origins} alt="Origins" className="img-fluid rounded mb-3" />
                  </a>
                  <h5 className="fw-bold">
                    <a href="produtos_origins.html" className="text-decoration-none text-dark">Origins</a>
                  </h5>
                  <p>Alimentos balanceados que combinam sabor e nutrição para todas as fases da vida do seu pet.</p>
                </div>
                <div className="col-md-4">
                  <a href="produtos_magnus.html">
                    <img src={magnus} alt="Magnus" className="img-fluid rounded mb-3" />
                  </a>
                  <h5 className="fw-bold">
                    <a href="produtos_magnus.html" className="text-decoration-none text-dark">Magnus</a>
                  </h5>
                  <p>A marca que une qualidade e preço acessível, garantindo a felicidade do seu pet.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;
