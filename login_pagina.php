<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADIMAX - O Melhor para o Seu Pet</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="login.css">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

</head>
<body>
    <?php include 'header.php'; ?>  
    <main>
        <div class="content">
            <h2>Login</h2>
            <form action="login.php" method="POST" class="login-form">
                <label for="username">Usuário:</label>
                <input type="text" id="username" name="username" placeholder="Digite seu usuário">
                
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" placeholder="Digite sua senha">
                
                <input type="submit" id="submit" name="submit" value="Enviar" class="login-button">
                <button type="button" class="register-button" onclick="window.location.href='register_pagina.php'">Cadastrar-se</button>
            </form>
        </div>
    </main>
    <?php include 'footer.php'; ?>
</body>
</html>