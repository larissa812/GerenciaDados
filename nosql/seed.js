// seed.js com dados expandidos
const { MongoClient } = require('mongodb');

// URI de conexão do MongoDB. Use 127.0.0.1 para garantir que ele se conecte via IPv4.
const uri = "mongodb://127.0.0.1:27017";
const dbName = "iot_db";

async function insertData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Conectado com sucesso ao servidor MongoDB");

    const db = client.db(dbName);
    await db.collection('fazendas').deleteMany({});
    console.log("Coleção 'fazendas' limpa.");

    const fazendas = [
      {
        nome: 'Fazenda Sol Nascente',
        localizacao_geografica: { lat: -15.8, lon: -47.9 },
        sensores: [
          { _id: 1, tipo: 'temperatura', localizacao: { lat: -15.81, lon: -47.91 }, leituras: [] },
          { _id: 2, tipo: 'umidade', localizacao: { lat: -15.82, lon: -47.92 }, leituras: [] }
        ]
      },
      {
        nome: 'Fazenda Verde',
        localizacao_geografica: { lat: -20.5, lon: -45.3 },
        sensores: [
          { _id: 3, tipo: 'temperatura', localizacao: { lat: -20.51, lon: -45.31 }, leituras: [] },
          { _id: 4, tipo: 'umidade', localizacao: { lat: -20.52, lon: -45.32 }, leituras: [] }
        ]
      },
      {
        nome: 'Fazenda Lua Cheia',
        localizacao_geografica: { lat: -22.9, lon: -43.2 },
        sensores: [
          { _id: 5, tipo: 'temperatura', localizacao: { lat: -22.91, lon: -43.21 }, leituras: [] },
          { _id: 6, tipo: 'umidade', localizacao: { lat: -22.92, lon: -43.22 }, leituras: [] }
        ]
      },
      {
        nome: 'Fazenda Estrela Guia',
        localizacao_geografica: { lat: -10.2, lon: -55.8 },
        sensores: [
          { _id: 7, tipo: 'temperatura', localizacao: { lat: -10.21, lon: -55.81 }, leituras: [] },
          { _id: 8, tipo: 'pressao', localizacao: { lat: -10.22, lon: -55.82 }, leituras: [] }
        ]
      },
      {
        nome: 'Fazenda Monte Verde',
        localizacao_geografica: { lat: -23.5, lon: -46.6 },
        sensores: [
          { _id: 9, tipo: 'temperatura', localizacao: { lat: -23.51, lon: -46.61 }, leituras: [] },
          { _id: 10, tipo: 'umidade', localizacao: { lat: -23.52, lon: -46.62 }, leituras: [] }
        ]
      },
      {
        nome: 'Fazenda Ribeirão',
        localizacao_geografica: { lat: -25.4, lon: -49.2 },
        sensores: [
          { _id: 11, tipo: 'temperatura', localizacao: { lat: -25.41, lon: -49.21 }, leituras: [] },
          { _id: 12, tipo: 'pressao', localizacao: { lat: -25.42, lon: -49.22 }, leituras: [] }
        ]
      },
      {
        nome: 'Fazenda do Cerrado',
        localizacao_geografica: { lat: -18.9, lon: -48.2 },
        sensores: [
          { _id: 13, tipo: 'umidade', localizacao: { lat: -18.91, lon: -48.21 }, leituras: [] },
          { _id: 14, tipo: 'temperatura', localizacao: { lat: -18.92, lon: -48.22 }, leituras: [] }
        ]
      },
      {
        nome: 'Fazenda Pantanal',
        localizacao_geografica: { lat: -16.5, lon: -56.7 },
        sensores: [
          { _id: 15, tipo: 'temperatura', localizacao: { lat: -16.51, lon: -56.71 }, leituras: [] },
          { _id: 16, tipo: 'umidade', localizacao: { lat: -16.52, lon: -56.72 }, leituras: [] }
        ]
      }
    ];

    // Geração de leituras para cada sensor
    const numLeiturasPorSensor = 1000;
    const now = Date.now();
    
    fazendas.forEach(fazenda => {
      fazenda.sensores.forEach(sensor => {
        const tipo = sensor.tipo;
        const unidade = tipo === 'temperatura' ? 'C' : (tipo === 'umidade' ? '%' : 'hPa');
        
        for (let i = 0; i < numLeiturasPorSensor; i++) {
          let valor;
          if (tipo === 'temperatura') {
            valor = (Math.random() * 20 + 15).toFixed(2);
          } else if (tipo === 'umidade') {
            valor = (Math.random() * 50 + 40).toFixed(2);
          } else { // pressao
            valor = (Math.random() * 20 + 1000).toFixed(2);
          }
          
          sensor.leituras.push({
            timestamp: new Date(now - (numLeiturasPorSensor - i) * 60 * 1000),
            valor: parseFloat(valor),
            unidade
          });
        }
        console.log(`Sensor ID ${sensor._id} da Fazenda '${fazenda.nome}' preenchido com ${sensor.leituras.length} leituras.`);
      });
    });

    const result = await db.collection('fazendas').insertMany(fazendas);
    console.log(`${result.insertedCount} documentos de fazenda inseridos com sucesso.`);
    
    // Verificação de dados
    console.log("Verificando se as leituras foram inseridas...");
    const documentoTeste = await db.collection('fazendas').findOne({});
    if (documentoTeste && documentoTeste.sensores && documentoTeste.sensores[0]) {
      const primeiroSensor = documentoTeste.sensores[0];
      console.log(`Verificação: O primeiro sensor tem ${primeiroSensor.leituras.length} leituras.`);
    } else {
      console.log("Verificação: Documentos ou sensores não encontrados.");
    }

  } catch (err) {
    console.error("Erro ao inserir dados:", err);
  } finally {
    await client.close();
    console.log("Conexão fechada");
  }
}

insertData();
