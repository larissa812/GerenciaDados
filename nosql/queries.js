// consultas.js - Script para executar consultas no banco de dados MongoDB
const { MongoClient } = require('mongodb');

// URI de conexão do MongoDB
const uri = "mongodb://127.0.0.1:27017";
const dbName = "iot_db";

async function runQuery() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Conectado com sucesso ao servidor MongoDB");

        const db = client.db(dbName);

        // A consulta para encontrar leituras de temperatura maiores que 20 C
        const aggregationPipeline = [
            { "$unwind": "$sensores" },
            { "$unwind": "$sensores.leituras" },
            {
                "$match": {
                    "sensores.leituras.unidade": "C",
                    "sensores.leituras.valor": { "$gt": 20 }
                }
            }
        ];

        console.log("Executando a consulta de agregação...");

        const result = await db.collection('fazendas').aggregate(aggregationPipeline).toArray();

        // Imprime os resultados
        console.log(`Consulta concluída. Encontrados ${result.length} documentos correspondentes.`);
        console.log("Amostra dos 5 primeiros resultados:");
        console.log(result.slice(0, 5));

        console.log("--- Executando a Consulta Agregada com Média de Tempo ---");
        // Ajustado para 'temperatura' e para um intervalo maior de tempo (60 dias)
        // para corresponder ao que você usou no SQL.
        const aggregationPipelineAgregada = [
            { "$unwind": "$sensores" },
            { "$unwind": "$sensores.leituras" },
            {
                "$match": {
                    "sensores.leituras.unidade": "C",
                    "sensores.leituras.timestamp": { "$gt": new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } // 60 dias
                }
            },
            {
                "$group": {
                    "_id": "$sensores._id",
                    "media_temp_janela": { "$avg": "$sensores.leituras.valor" }
                }
            }
        ];

        const resultAgregada = await db.collection('fazendas').aggregate(aggregationPipelineAgregada).toArray();
        console.log(`Consulta agregada concluída. Encontrados ${resultAgregada.length} grupos.`);
        console.log("Resultados:");
        console.log(resultAgregada);

    } catch (err) {
        console.error("Erro ao executar a consulta:", err);
    } finally {
        await client.close();
        console.log("Conexão fechada");
    }
    
}

// Executa a função de consulta
runQuery();
