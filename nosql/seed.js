const { MongoClient } = require('mongodb');

// URI de conexão do MongoDB. Use 127.0.0.1 para garantir que ele se conecte via IPv4.
const uri = "mongodb://127.0.0.1:27017";

// Nome do banco de dados
const dbName = "iot_db";

// Função assíncrona para se conectar e inserir dados
async function insertData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Conecta-se ao servidor
    await client.connect();
    console.log("Conectado com sucesso ao servidor MongoDB");

    // Obtém o banco de dados
    const db = client.db(dbName);

    // Limpa as coleções existentes para evitar duplicatas
    await db.collection('fazendas').deleteMany({});
    console.log("Coleção 'fazendas' limpa.");

    // Array de documentos para as fazendas, sensores, leituras e alertas
    const fazendas = [
      {
        nome: 'Fazenda Sol Nascente',
        localizacao_geografica: { lat: -15.8, lon: -47.9 },
        sensores: [
          {
            _id: 1,
            tipo: 'temperatura',
            localizacao: { lat: -15.81, lon: -47.91 },
            leituras: [
              { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), valor: 24.5, unidade: 'C' },
              { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), valor: 25.1, unidade: 'C' }
            ],
            alertas: []
          },
          {
            _id: 2,
            tipo: 'umidade',
            localizacao: { lat: -15.82, lon: -47.92 },
            leituras: [
              { timestamp: new Date(Date.now() - 30 * 60 * 1000), valor: 75.0, unidade: '%' }
            ],
            alertas: []
          }
        ]
      },
      {
        nome: 'Fazenda Verde',
        localizacao_geografica: { lat: -20.5, lon: -45.3 },
        sensores: [
          {
            _id: 3,
            tipo: 'temperatura',
            localizacao: { lat: -20.51, lon: -45.31 },
            leituras: [
              { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), valor: 28.3, unidade: 'C' },
              { timestamp: new Date(Date.now() - 10 * 60 * 1000), valor: 29.5, unidade: 'C' }
            ],
            alertas: [
              { descricao: 'Temperatura critica detectada na Fazenda Verde.', timestamp: new Date() }
            ]
          },
          {
            _id: 4,
            tipo: 'umidade',
            localizacao: { lat: -20.52, lon: -45.32 },
            leituras: [
              { timestamp: new Date(Date.now() - 45 * 60 * 1000), valor: 68.2, unidade: '%' }
            ],
            alertas: []
          }
        ]
      },
      {
        nome: 'Fazenda Lua Cheia',
        localizacao_geografica: { lat: -22.9, lon: -43.2 },
        sensores: [
          {
            _id: 5,
            tipo: 'temperatura',
            localizacao: { lat: -22.91, lon: -43.21 },
            leituras: [
              { timestamp: new Date(Date.now() - 20 * 60 * 1000), valor: 21.0, unidade: 'C' }
            ],
            alertas: []
          },
          {
            _id: 6,
            tipo: 'umidade',
            localizacao: { lat: -22.92, lon: -43.22 },
            leituras: [
              { timestamp: new Date(Date.now() - 5 * 60 * 1000), valor: 82.1, unidade: '%' }
            ],
            alertas: [
              { descricao: 'Umidade acima do nivel de alerta na Fazenda Lua Cheia.', timestamp: new Date() }
            ]
          }
        ]
      },
      {
        nome: 'Fazenda Estrela Guia',
        localizacao_geografica: { lat: -10.2, lon: -55.8 },
        sensores: [
          {
            _id: 7,
            tipo: 'temperatura',
            localizacao: { lat: -10.21, lon: -55.81 },
            leituras: [
              { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), valor: 26.8, unidade: 'C' }
            ],
            alertas: []
          },
          {
            _id: 8,
            tipo: 'pressao',
            localizacao: { lat: -10.22, lon: -55.82 },
            leituras: [
              { timestamp: new Date(Date.now() - 15 * 60 * 1000), valor: 1015.0, unidade: 'hPa' }
            ],
            alertas: []
          }
        ]
      }
    ];

    // Insere todos os documentos de fazenda na coleção 'fazendas'
    const result = await db.collection('fazendas').insertMany(fazendas);

    console.log(`${result.insertedCount} documentos de fazenda inseridos com sucesso.`);
    console.log("Dados de sensores, leituras e alertas foram aninhados.");

  } catch (err) {
    console.error("Erro ao inserir dados:", err);
  } finally {
    // Fecha a conexão
    await client.close();
    console.log("Conexão fechada");
  }
}

// Executa a função
insertData();