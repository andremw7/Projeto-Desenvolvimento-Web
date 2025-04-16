<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADIMAX - O Melhor para o Seu Pet</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="produtos.css">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <?php include 'header.php'; ?> 

    <main>
        <div class="content">
            <section class="products">
                <h2>Classes de Produtos</h2>
                <div class="product-grid">
                    <figure>
                        <img src="fotos/formula.png" alt="Ração Premium para Cães">
                    </figure>
                    <figure>
                        <img src="fotos/origins.png" alt="Brinquedos para Gatos">
                    </figure>
                    <figure>
                        <img src="fotos/magnus.png" alt="Serviços de Banho e Tosa">
                    </figure>
                </div>
            </section>
        </div>
        <?php include 'config.php'; ?>
        <div class="two-column-products">
            <h2>Produtos Disponíveis</h2>
            <div class="product-grid-two-columns">
                <?php
                $stmt = $pdo->query("SELECT * FROM produtos WHERE ativo = TRUE");

                while ($produto = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $id = intval($produto['id']);
                    $nome = htmlspecialchars($produto['nome']);
                    $preco = number_format($produto['preco'], 2, ',', '.');
                    $img = htmlspecialchars($produto['nome_img']);

                    echo "
                        <figure>
                            <img src='fotos/{$img}' alt='{$nome}'>
                            <figcaption>{$nome} - R$ {$preco}</figcaption>
                            <form method='POST' action='";
                    echo empty($_SESSION['username']) || empty($_SESSION['user_id']) ? "login_pagina.php" : "carrinho.php";
                    echo "'>
                                <input type='hidden' name='produto_id' value='{$id}'>
                                <button type='submit'>Comprar</button>
                            </form>
                        </figure>
                    ";
                }
                ?>
            </div>
        </div>
        
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>