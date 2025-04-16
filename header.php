<!-- header.php -->
<?php
session_start();

// Debugging: Uncomment the following lines to check session variables
// echo '<pre>';
//print_r($_SESSION);
// echo '</pre>';
?>
<header>
    <nav>
        <img src="fotos/adimax.jpeg" alt="Logo ADIMAX" class="logo" width="50px" height="50px">
        <ul>
            <?php if (empty($_SESSION['username']) || empty($_SESSION['user_id'])): ?>
                <!-- User is not logged in -->
                <li><a href="site.php">Início</a></li>
                <li><a href="produtos.php">Produtos</a></li>
                <li><a href="login_pagina.php">Login</a></li>
            <?php else: ?>
                <!-- User is logged in -->
                <li><a href="site.php">Início</a></li>
                <li><a href="produtos.php">Produtos</a></li>
                <li><a href="carrinho.php">Carrinho</a></li>
                <li><a href="sair.php">Logout</a></li>
            <?php endif; ?>
        </ul>
    </nav>
</header>
