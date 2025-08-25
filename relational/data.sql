

INSERT INTO Fazenda (nome, localizacao_geografica) VALUES
('Fazenda Sol Nascente', POINT(-15.8, -47.9)),
('Fazenda Verde', POINT(-20.5, -45.3)),
('Fazenda Lua Cheia', POINT(-22.9, -43.2)),
('Fazenda Estrela Guia', POINT(-10.2, -55.8));


INSERT INTO Sensor (tipo, localizacao, fazenda_id) VALUES
('temperatura', POINT(-15.81, -47.91), 1), -- Sensor para Fazenda Sol Nascente (id 1)
('umidade', POINT(-15.82, -47.92), 1), -- Sensor para Fazenda Sol Nascente (id 1)
('temperatura', POINT(-20.51, -45.31), 2), -- Sensor para Fazenda Verde (id 2)
('umidade', POINT(-20.52, -45.32), 2), -- Sensor para Fazenda Verde (id 2)
('temperatura', POINT(-22.91, -43.21), 3), -- Sensor para Fazenda Lua Cheia (id 3)
('umidade', POINT(-22.92, -43.22), 3), -- Sensor para Fazenda Lua Cheia (id 3)
('temperatura', POINT(-10.21, -55.81), 4), -- Sensor para Fazenda Estrela Guia (id 4)
('pressao', POINT(-10.22, -55.82), 4); -- Sensor para Fazenda Estrela Guia (id 4)


INSERT INTO Leitura (sensor_id, timestamp, valor, unidade) VALUES
(1, NOW() - INTERVAL '2 hours', 24.5, 'C'), -- Leitura Fazenda Sol Nascente
(1, NOW() - INTERVAL '1 hour', 25.1, 'C'),
(2, NOW() - INTERVAL '30 minutes', 75.0, '%'),
(3, NOW() - INTERVAL '1 hour', 28.3, 'C'), -- Leitura Fazenda Verde
(3, NOW() - INTERVAL '10 minutes', 29.5, 'C'),
(4, NOW() - INTERVAL '45 minutes', 68.2, '%'),
(5, NOW() - INTERVAL '20 minutes', 21.0, 'C'), -- Leitura Fazenda Lua Cheia
(6, NOW() - INTERVAL '5 minutes', 82.1, '%'),
(7, NOW() - INTERVAL '2 hours', 26.8, 'C'), -- Leitura Fazenda Estrela Guia
(8, NOW() - INTERVAL '15 minutes', 1015.0, 'hPa');

INSERT INTO Alerta (leitura_id, descricao, timestamp) VALUES
(5, 'Temperatura critica detectada na Fazenda Verde.', NOW()),
(8, 'Umidade acima do nivel de alerta na Fazenda Lua Cheia.', NOW());
