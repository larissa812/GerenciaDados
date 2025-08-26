import json
from kafka import KafkaConsumer

# Configuração do consumidor Kafka
# Altere o endereço para 'localhost:9098'
bootstrap_servers = 'localhost:9098'
topic_name = 'leituras-stream'

# Configura o consumidor
try:
    consumer = KafkaConsumer(
        topic_name,
        bootstrap_servers=bootstrap_servers,
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='my-group',
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )
    print("Consumidor Kafka conectado com sucesso.")
except Exception as e:
    print(f"Erro ao conectar ao Kafka: {e}")
    exit()

# Loop para ler mensagens
print("Aguardando mensagens...")
try:
    for message in consumer:
        print(f"Mensagem recebida: {message.value}")
except KeyboardInterrupt:
    print("Consumidor encerrado.")
finally:
    consumer.close()