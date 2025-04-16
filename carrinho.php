<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADIMAX - O Melhor para o Seu Pet</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="carrinho.css">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

</head>
<body>
    <?php include 'header.php'; ?> 
    <main>
        <?php
        session_start();
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['produto_id'])) {
            include 'config.php';

            $produto_id = intval($_POST['produto_id']);
            $stmt = $pdo->prepare("SELECT * FROM produtos WHERE id = :id AND ativo = TRUE");
            $stmt->execute(['id' => $produto_id]);
            $produto = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($produto) {
                $produto['quantity'] = 1; // Default quantity
                $_SESSION['cart'][$produto_id] = $produto;
            }
        }

        if (!empty($_SESSION['cart'])) {
            foreach ($_SESSION['cart'] as $produto_id => $produto) {
                $nome = htmlspecialchars($produto['nome']);
                $preco_unitario = $produto['preco'];
                $preco_formatado = number_format($preco_unitario, 2, ',', '.');
                $img = htmlspecialchars($produto['nome_img']);
                $quantity = $produto['quantity'];
                $total_price = number_format($preco_unitario * $quantity, 2, ',', '.');

                echo "
                    <div class='cart-item'>
                        <figure>
                            <img src='fotos/{$img}' alt='{$nome}'>
                            <figcaption>
                                <span>{$nome}</span>
                                <span>Preço Unitário: R$ {$preco_formatado}</span>
                                <span id='total-price-{$produto_id}'>Total: R$ {$total_price}</span>
                            </figcaption>
                        </figure>
                        <div class='quantity-controls'>
                            <button onclick='updateQuantity({$produto_id}, -1, {$preco_unitario})'>-</button>
                            <input type='number' id='quantity-{$produto_id}' value='{$quantity}' min='1' readonly>
                            <button onclick='updateQuantity({$produto_id}, 1, {$preco_unitario})'>+</button>
                        </div>
                        <button class='remove-button' onclick='removeItem({$produto_id})'>Remover</button>
                    </div>
                ";
            }
        } else {
            echo "<p>Nenhum produto no carrinho.</p>";
        }
        ?>
    </main>
    <script>
        function updateQuantity(productId, change, unitPrice) {
            const quantityInput = document.getElementById(`quantity-${productId}`);
            const totalPriceElement = document.getElementById(`total-price-${productId}`);
            let currentQuantity = parseInt(quantityInput.value);

            currentQuantity = Math.max(1, currentQuantity + change);
            quantityInput.value = currentQuantity;

            const newTotalPrice = (currentQuantity * unitPrice).toFixed(2).replace('.', ',');
            totalPriceElement.textContent = `Total: R$ ${newTotalPrice}`;

            // Update quantity in session via AJAX
            fetch('update_cart.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: currentQuantity })
            });
        }

        function removeItem(productId) {
            // Remove item from session via AJAX
            fetch('remove_item.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            }).then(() => {
                // Remove item from the DOM
                document.querySelector(`#quantity-${productId}`).closest('.cart-item').remove();
            });
        }
    </script>
    <?php include 'footer.php'; ?>
</body>
</html>