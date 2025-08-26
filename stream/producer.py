
# Simula a geração de dados de sensores de IoT e envia para o Kafka.

import json
import time
import random
from kafka import KafkaProducer

# Configuração do produtor Kafka
# Altere o endereço para 'localhost:9098' conforme a sua configuração no docker-compose.yml
# O valor 'localhost:9092' é o valor padrão. Caso tenha alterado a porta para 9098,
# use o host/porta correspondente.
# Para a sua configuração de docker-compose, use 'localhost:9098'
# Para o comando docker exec, use 'kafka:9092'
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

# Dados de exemplo para as fazendas e sensores
fazendas = [
    {'id': 1, 'nome': 'Fazenda Sol Nascente', 'localizacao': {'lat': -15.8, 'lon': -47.9}},
    {'id': 2, 'nome': 'Fazenda Verde', 'localizacao': {'lat': -20.5, 'lon': -45.3}},
    {'id': 3, 'nome': 'Fazenda Lua Cheia', 'localizacao': {'lat': -22.9, 'lon': -43.2}},
    {'id': 4, 'nome': 'Fazenda Estrela Guia', 'localizacao': {'lat': -10.2, 'lon': -55.8}}
]

sensores = [
    {'id': 1, 'fazenda_id': 1, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 2, 'fazenda_id': 1, 'tipo': 'umidade', 'unidade': '%'},
    {'id': 3, 'fazenda_id': 2, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 4, 'fazenda_id': 2, 'tipo': 'umidade', 'unidade': '%'},
    {'id': 5, 'fazenda_id': 3, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 6, 'fazenda_id': 3, 'tipo': 'umidade', 'unidade': '%'},
    {'id': 7, 'fazenda_id': 4, 'tipo': 'temperatura', 'unidade': 'C'},
    {'id': 8, 'fazenda_id': 4, 'tipo': 'pressao', 'unidade': 'hPa'}
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