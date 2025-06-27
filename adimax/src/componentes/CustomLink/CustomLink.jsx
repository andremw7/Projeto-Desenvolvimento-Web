import React from 'react';

function CustomLink({ to, children, ...props }) {
  // Função para lidar com a navegação personalizada
  // Function to handle custom navigation
  const handleNavigation = (e) => {
    e.preventDefault(); // Impede o comportamento padrão do link (navegação de página)
                        // Prevent default link behavior (page reload)
    
    window.history.pushState({}, '', to); // Atualiza a URL no navegador sem recarregar a página
                                          // Update the URL in the browser without reloading

    window.dispatchEvent(new PopStateEvent('popstate')); // Dispara o evento 'popstate' para notificar o roteador da mudança
                                                         // Trigger 'popstate' event to notify router about the change
  };

  return (
    <a href={to} onClick={handleNavigation} {...props}>
      {/* Renderiza o conteúdo filho dentro da tag <a> */}
      {/* Render children content inside the <a> tag */}
      {children}
    </a>
  );
}

export default CustomLink;
