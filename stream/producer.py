# Simula a geração de dados de sensores de IoT e envia para o Kafka.

import json
import time
import random
from kafka import KafkaProducer

# Configuração do produtor Kafka
bootstrap_servers = 'localhost:9098'
topic_name = 'leituras-stream'

# Configura o produtor
try:
    producer = KafkaProducer(
        bootstrap_servers=bootstrap_servers,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    print("Produtor Kafka conectado com sucesso.")
except Exception as e:
    print(f"Erro ao conectar ao Kafka: {e}")
    exit()

# Dados de exemplo para as fazendas e sensores (expandido)
fazendas = [
    {'id': 1, 'nome': 'Fazenda Sol Nascente', 'localizacao': {'lat': -15.8, 'lon': -47.9}},
    {'id': 2, 'nome': 'Fazenda Verde', 'localizacao': {'lat': -20.5, 'lon': -45.3}},
    {'id': 3, 'nome': 'Fazenda Lua Cheia', 'localizacao': {'lat': -22.9, 'lon': -43.2}},
    {'id': 4, 'nome': 'Fazenda Estrela Guia', 'localizacao': {'lat': -10.2, 'lon': -55.8}},
    {'id': 5, 'nome': 'Fazenda Monte Verde', 'localizacao': {'lat': -23.5, 'lon': -46.6}},
    {'id': 6, 'nome': 'Fazenda Ribeirão', 'localizacao': {'lat': -25.4, 'lon': -49.2}},
    {'id': 7, 'nome': 'Fazenda do Cerrado', 'localizacao': {'lat': -18.9, 'lon': -48.2}},
    {'id': 8, 'nome': 'Fazenda Pantanal', 'localizacao': {'lat': -16.5, 'lon': -56.7}}
]

sensores = [
    {'id': 1, 'fazenda_id': 1, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 2, 'fazenda_id': 1, 'tipo': 'umidade', 'unidade': '%'},
    {'id': 3, 'fazenda_id': 2, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 4, 'fazenda_id': 2, 'tipo': 'umidade', 'unidade': '%'},
    {'id': 5, 'fazenda_id': 3, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 6, 'fazenda_id': 3, 'tipo': 'umidade', 'unidade': '%'},
    {'id': 7, 'fazenda_id': 4, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 8, 'fazenda_id': 4, 'tipo': 'pressao', 'unidade': 'hPa'},
    {'id': 9, 'fazenda_id': 5, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 10, 'fazenda_id': 5, 'tipo': 'umidade', 'unidade': '%'},
    {'id': 11, 'fazenda_id': 6, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 12, 'fazenda_id': 6, 'tipo': 'pressao', 'unidade': 'hPa'},
    {'id': 13, 'fazenda_id': 7, 'tipo': 'umidade', 'unidade': '%'},
    {'id': 14, 'fazenda_id': 7, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 15, 'fazenda_id': 8, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 16, 'fazenda_id': 8, 'tipo': 'umidade', 'unidade': '%'},
]

# Função para gerar um valor de leitura aleatório
def generate_value(sensor_type):
    if sensor_type == 'temperatura':
        return round(random.uniform(15.0, 35.0), 2)
    elif sensor_type == 'umidade':
        return round(random.uniform(40.0, 90.0), 2)
    elif sensor_type == 'pressao':
        return round(random.uniform(1000.0, 1020.0), 2)
    return None

# Loop para gerar e enviar dados
try:
    while True:
        # Seleciona um sensor aleatoriamente
        sensor = random.choice(sensores)
        
        # Cria o documento de leitura
        leitura = {
            'sensor_id': sensor['id'],
            'timestamp': int(time.time() * 1000), # Timestamp em milissegundos
            'valor': generate_value(sensor['tipo']),
            'unidade': sensor['unidade']
        }
        
        # Envia a leitura para o tópico do Kafka
        producer.send(topic_name, value=leitura)
        print(f"Enviado para o Kafka: {leitura}")
        
        # Espera um pouco antes de enviar a próxima leitura
        time.sleep(1)
except KeyboardInterrupt:
    print("Produtor encerrado.")
finally:
    producer.flush()
    producer.close()
