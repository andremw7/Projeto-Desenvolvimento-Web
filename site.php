<?php
session_start(); // Certifique-se de que a sessão é iniciada aqui
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADIMAX - O Melhor para o Seu Pet</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="site.css">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <?php 
    // Debugging: Uncomment the following lines to check session variables
    // echo '<pre>';
    print_r($_SESSION);
    // echo '</pre>';
    include 'header.php'; 
    ?>
    <main>
        <div class="content">
            <article>
                <h2>Bem-vindo ao ADIMAX</h2>
                <p>O lugar onde seu pet encontra tudo o que precisa! Oferecemos serviços de banho e tosa, produtos de alta qualidade e muito carinho para o seu amigo de quatro patas.</p>
            </article>

            <section class="flex-gallery">
                <figure>
                    <img src="fotos/formula.png" alt="Ração Premium para Cães">
                </figure>
                <figure>
                    <img src="fotos/origins.png" alt="Brinquedos para Gatos">
                </figure>
                <figure>
                    <img src="fotos/magnus.png" alt="Serviços de Banho e Tosa">
                </figure>
            </section>

            <section class="grid-layout">
                <button>Roupinhas para Cães</button>
                <button>Arranhadores para Gatos</button>
                <button>Produtos de Higiene</button>
                <button>Brinquedos Interativos</button>
            </section>
        </div>
        <aside>
            <h3>Ofertas Especiais</h3>
            <ul>
               <li><a href="#">Desconto de 20% em Rações</a></li>
               <li><a href="#">Compre 1, Leve 2 em Brinquedos</a></li>
               <li><a href="#">Primeiro Banho Grátis!</a></li>
            </ul>
        </aside>
    </main>
    <?php include 'footer.php'; ?>
</body>
</html>