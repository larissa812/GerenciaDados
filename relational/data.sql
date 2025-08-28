-- DADOS INSERIDOS AUTOMATICAMENTE
-- EXPANDINDO A BASE PARA FACILITAR AS COMPARAÇÕES

-- Limpa as tabelas para evitar duplicação de dados em cada execução
DELETE FROM Alerta;
DELETE FROM Leitura;
DELETE FROM Sensor;
DELETE FROM Fazenda;

-- Fazendas adicionais
INSERT INTO Fazenda (nome, localizacao_geografica) VALUES
('Fazenda Sol Nascente', POINT(-15.8, -47.9)),
('Fazenda Verde', POINT(-20.5, -45.3)),
('Fazenda Lua Cheia', POINT(-22.9, -43.2)),
('Fazenda Estrela Guia', POINT(-10.2, -55.8)),
('Fazenda Monte Verde', POINT(-23.5, -46.6)),
('Fazenda Ribeirão', POINT(-25.4, -49.2)),
('Fazenda do Cerrado', POINT(-18.9, -48.2)),
('Fazenda Pantanal', POINT(-16.5, -56.7));

-- Sensores adicionais para as novas fazendas
INSERT INTO Sensor (tipo, localizacao, fazenda_id) VALUES
('temperatura', POINT(-15.81, -47.91), 17), -- Sensor para Fazenda Sol Nascente (id 17)
('umidade', POINT(-15.82, -47.92), 17), 
('temperatura', POINT(-20.51, -45.31), 18), -- Sensor para Fazenda Verde (id 18)
('umidade', POINT(-20.52, -45.32), 18), 
('temperatura', POINT(-22.91, -43.21), 19), -- Sensor para Fazenda Lua Cheia (id 19)
('umidade', POINT(-22.92, -43.22), 19), 
('temperatura', POINT(-10.21, -55.81), 20), -- Sensor para Fazenda Estrela Guia (id 20)
('pressao', POINT(-10.22, -55.82), 20), 
('temperatura', POINT(-23.51, -46.61), 21), -- Fazenda Monte Verde
('umidade', POINT(-23.52, -46.62), 21),
('temperatura', POINT(-25.41, -49.21), 22), -- Fazenda Ribeirão
('pressao', POINT(-25.42, -49.22), 22),
('umidade', POINT(-18.91, -48.21), 23), -- Fazenda do Cerrado
('temperatura', POINT(-18.92, -48.22), 23),
('temperatura', POINT(-16.51, -56.71), 24), -- Fazenda Pantanal
('umidade', POINT(-16.52, -56.72), 24);

-- Geração de milhares de leituras para todos os sensores, simulando um período de tempo
DO $$
DECLARE
    sensor_id INT;
    start_time TIMESTAMP := NOW() - INTERVAL '30 days';
    unidade_medida VARCHAR(20);
BEGIN
    FOR sensor_id IN 65..80 LOOP -- Loop para todos os 16 sensores
        -- Determine a unidade de medida do sensor antes do loop de inserção
        SELECT tipo INTO unidade_medida FROM Sensor WHERE id = sensor_id;

        FOR i IN 1..1000 LOOP -- Gera 1000 leituras para cada sensor
            INSERT INTO Leitura (sensor_id, timestamp, valor, unidade) VALUES
            (sensor_id, start_time + (i * INTERVAL '1 minute'),
             -- Gera valores aleatórios consistentes com o seu produtor, usando ::numeric(10,2) para arredondamento
             CASE
                 WHEN unidade_medida = 'temperatura' THEN
                     (random() * 20 + 15)::numeric(10,2) -- 15 a 35 C
                 WHEN unidade_medida = 'umidade' THEN
                     (random() * 50 + 40)::numeric(10,2) -- 40 a 90 %
                 WHEN unidade_medida = 'pressao' THEN
                     (random() * 20 + 1000)::numeric(10,2) -- 1000 a 1020 hPa
             END,
             -- Alterado para buscar a unidade da tabela Sensor, que já está populada
             unidade_medida
            );
        END LOOP;
    END LOOP;
END;
$$;
