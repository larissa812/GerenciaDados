CREATE TABLE Fazenda (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    localizacao_geografica POINT  -- Ex: (latitude, longitude)
);

CREATE TABLE Sensor (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50),  -- Ex: 'temperatura', 'umidade'
    localizacao POINT,
    fazenda_id INTEGER REFERENCES Fazenda(id)
);

CREATE TABLE Leitura (
    id SERIAL PRIMARY KEY,
    sensor_id INTEGER REFERENCES Sensor(id),
    timestamp TIMESTAMP NOT NULL,
    valor NUMERIC NOT NULL,
    unidade VARCHAR(20)  -- Ex: 'C', '%'
);

CREATE TABLE Alerta (
    id SERIAL PRIMARY KEY,
    leitura_id INTEGER REFERENCES Leitura(id),
    descricao TEXT,
    timestamp TIMESTAMP
);  