# Projeto: Loja Online - Esportes LTDA

## Identificação
- Integrante: André Marcelino Watanabe
- Número USP: 14558311

## Requirements
- O sistema deve permitir que o cliente visualize produtos da adimax disponíveis para compra.
- Deve existir uma tela de login para clientes e administradores.
- O administrador poderá cadastrar, editar e excluir produtos.
- A loja será do tipo SPA (Single Page Application), com uma única página dividida por seções.

## Project Description
A aplicação "Esportes LTDA" é um mockup de loja online com interface desenvolvida em HTML5 e CSS3. Ela apresenta as principais telas de navegação:

### Diagrama de Navegação (SPA):
```
[Tela Inicial]
   |
   |--> [Login]
   |--> [Produtos]
   |--> [Painel do Administrador]
```

### Mockups Criados em HTML/CSS:
- **Tela Inicial (site.html)**: Apresenta o título e descrição da loja, uma galeria de imagens e botões para categorias de produtos.
- **Tela de Login (login.html)**: Contém campos para email e senha, permitindo autenticação de usuários.
- **Seção de Produtos (produtos.html)**: Exibe uma lista de produtos organizados em grades, com imagens e categorias.
- **Painel do Administrador**: Ainda não implementado, mas será adicionado em futuras iterações.

Outras telas podem ser esboçadas manualmente ou criadas em ferramentas como Figma, se necessário.

## Comments About Code
O projeto foi estruturado usando apenas HTML e CSS, com foco na organização semântica e layout limpo. As seções estão separadas visualmente com elementos `<section>` e estilizadas para boa legibilidade e usabilidade.

### Detalhes Adicionais:
- **site.html**: Inclui uma galeria flexível e uma seção de ofertas especiais.
- **produtos.html**: Apresenta produtos em grades flexíveis e em duas colunas.
- **login.html**: Formulário de login funcional com validação básica.

## Test Plan
- Testes manuais na navegação entre seções da página.
- Verificação visual de responsividade e aparência.
- Teste do formulário de login para garantir que os campos obrigatórios estão funcionando.

## Test Results
- Mockups renderizados corretamente em navegadores modernos.
- Interface responsiva em tamanhos de tela padrão.
- Navegação entre páginas funcionando corretamente.

## Build Procedures
1. Clonar o repositório do GitHub.
2. Abrir o arquivo `site.html` em qualquer navegador web.
3. Navegar pelas páginas usando os links no cabeçalho e rodapé.

## Problems
- Ainda não há funcionalidades interativas implementadas (como cadastro real de produtos).
- Algumas telas extras estão pendentes de desenvolvimento, como o Painel do Administrador.

## Comments
O projeto está em desenvolvimento inicial e será expandido com funcionalidades interativas nas próximas etapas.

