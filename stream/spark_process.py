# spark_process.py
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, FloatType, LongType, TimestampType

# Altere a versão do pacote para a que corresponde ao Spark 4.0.0 e Scala 2.13
spark = SparkSession.builder \
    .appName("IoTStream") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.13:4.0.0") \
    .getOrCreate()

# Leia de Kafka (configure source)
df = spark.readStream.format("kafka").option("kafka.bootstrap.servers", "localhost:9098").option("subscribe", "leituras-stream").load()

# Para ler os valores como JSON, você precisa de um schema
schema = StructType([
    StructField("sensor_id", IntegerType()),
    StructField("timestamp", LongType()),
    StructField("valor", FloatType()),
    StructField("unidade", StringType())
])

# Converte o valor binário para STRING e depois faz o parse do JSON
df_parsed = df.select(from_json(col("value").cast("string"), schema).alias("data")).select("data.*")

# Converte o timestamp para o formato de data/hora do Spark
df_parsed = df_parsed.withColumn("timestamp", from_unixtime(col("timestamp") / 1000).cast(TimestampType()))

# Adiciona uma marca d'água (watermark) para lidar com dados atrasados e define uma janela de 30 minutos
# Isso é crucial para agregações em stream
df_agregado = df_parsed.withWatermark("timestamp", "40 days") \
    .filter("unidade = 'temperatura'") \
    .groupBy(window(col("timestamp"), "40 days"), col("sensor_id")) \
    .agg(avg("valor").alias("media_temp_janela"))

# Processamento exemplo: filtre as leituras que são do tipo 'temperatura'
# e cujo valor é maior que 20.
# A condição foi alterada para se adequar aos dados gerados.
filtered = df_parsed.filter("unidade = 'temperatura' AND valor > 20")

# Ambas as consultas podem ser executadas
query_filtered = filtered.writeStream.outputMode("append").format("console").start()
query_agregada = df_agregado.writeStream.outputMode("complete").format("console").start()

query_filtered.awaitTermination()
query_agregada.awaitTermination()
