<?php  
    session_start();

    if(isset($_POST['submit']) && !empty($_POST['username']) && !empty($_POST['password'])){
        include_once('config.php');
        $username = $_POST['username'];
        $senha = $_POST['password'];

        $sql = "SELECT * FROM usuarios WHERE username = '$user' and senha = '$senha'";

        $result = $pdo->query($sql);

        if (empty($username) || empty($senha)) {
            header('Location: index.html?error=Usuário e senha são obrigatórios');
            exit;
        }

        try {
            // Prepara a consulta para buscar o usuário no banco de dados
            $stmt = $pdo->prepare("SELECT id, username, senha FROM usuarios WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();
    
            // Verifica se o usuário existe e se a senha está correta
            if ($user && password_verify($senha, $user['senha'])) {
                // Armazena informações do usuário na sessão
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                header('Location: site.php'); // Redireciona para site.html após login bem-sucedido
                exit;
            } else {
                // Mensagem de erro para credenciais inválidas
                header('Location: login.html?error=Usuário ou senha incorretos');
                exit;
            }
        } catch (PDOException $e) {
            // Mensagem de erro para problemas no banco de dados
            header('Location: login.html?error=Erro no sistema. Tente novamente mais tarde.');
            // Log do erro para depuração (não exibir diretamente ao usuário)
            error_log('Erro no login: ' . $e->getMessage());
            exit;
        }

        print_r($sql);
    }
    else{
        header('Location: login.php');
        exit();
    }
?>