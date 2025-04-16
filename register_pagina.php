<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADIMAX - O Melhor para o Seu Pet</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="register.css">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

</head>
<body>
    <?php include 'header.php'; ?> 
    <main>
        <div class="content">
            <h2>Register</h2>
            <form action="register.php" method="post" class="register-form">
                <label for="username">Usuário:</label>
                <input type="text" id="username" name="username" placeholder="Digite seu usuário" required>
                
                <label for="email">E-mail:</label>
                <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required>
                
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" placeholder="Digite sua senha" required>
                
                <button type="submit">Registrar</button>
            </form>
        </div>
    </main>
    <?php include 'footer.php'; ?>
</body>
</html>