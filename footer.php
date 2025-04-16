<?php
session_start();
?>
<!-- footer.php -->
<footer>
    <section>
        <h4>Sobre Nós</h4>
        <p>No ADIMAX, cuidamos do seu pet como se fosse nosso. Venha nos visitar e descubra tudo o que temos para oferecer!</p>
    </section>
    <section>
        <h4>Links Rápidos</h4>
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
                <li><a href="sair.php">Logout</a></li>
            <?php endif; ?>
        </ul>
    </section>
    <section>
        <h4>Siga-nos</h4>
        <div class="social-icons">
            <a href="#" aria-label="Facebook">
                <img src="fotos/facebook.png" alt="Facebook" width="24" height="24">
            </a>
            <a href="#" aria-label="Twitter">
                <img src="fotos/X.png" alt="X" width="24" height="24">
            </a>
            <a href="#" aria-label="Instagram">
                <img src="fotos/instagram.png" alt="Instagram" width="24" height="24">
            </a>
        </div>
    </section>
</footer>
</body>
</html>
