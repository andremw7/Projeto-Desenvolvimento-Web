<?php
$host = 'localhost';
$dbname = 'adimax';
$username = 'postgres';
$password = 'renato2205';

try {
    // Conexão com PostgreSQL
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}
?>