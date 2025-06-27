import json
from pymongo import MongoClient

# === 1. Conexão com o MongoDB Atlas ===
MONGO_URL = "mongodb+srv://renatospessotto:Q7MXczItG8ILl4HJ@clusterdesenvolvimentow.jc6sory.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDesenvolvimentoWeb"
client = MongoClient(MONGO_URL)

# === 2. Nome do banco de dados ===
db = client["meu_banco_web"]  # Você pode trocar o nome do banco se quiser

# === 3. Caminhos absolutos dos arquivos ===
arquivos = {
    "carrinho": "/home/renato-spessotto/Projeto-Desenvolvimento-Web/backend/banco_json/carrinho.json",
    "pedidos":  "/home/renato-spessotto/Projeto-Desenvolvimento-Web/backend/banco_json/pedidos.json",
    "produtos": "/home/renato-spessotto/Projeto-Desenvolvimento-Web/backend/banco_json/produtos.json",
    "usuarios": "/home/renato-spessotto/Projeto-Desenvolvimento-Web/backend/banco_json/usuarios.json",
}

# === 4. Inserção no MongoDB ===
for nome_colecao, path in arquivos.items():
    with open(path, encoding="utf-8") as f:
        dados = json.load(f)
        colecao = db[nome_colecao]

        # Insere múltiplos documentos se for lista, ou um só se for dicionário
        if isinstance(dados, list):
            colecao.insert_many(dados)
        else:
            colecao.insert_one(dados)

    print(f"✅ Coleção '{nome_colecao}' inserida com sucesso!")

print("🏁 Todos os arquivos foram enviados ao MongoDB com sucesso.")
