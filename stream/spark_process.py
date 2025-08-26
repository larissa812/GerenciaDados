# spark_process.py
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, FloatType, LongType

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

# Processamento exemplo: filtre as leituras que são do tipo 'temperatura'
# e cujo valor é maior que 20.
# A condição foi alterada para se adequar aos dados gerados.
filtered = df_parsed.filter("unidade = 'C' AND valor > 20")

query = filtered.writeStream.outputMode("append").format("console").start()
query.awaitTermination()
