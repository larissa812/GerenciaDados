--exemploo 
SELECT AVG(valor) FROM Leitura WHERE sensor_id = 1

Select * From fazenda;
Select * From Sensor;
Select * From leitura;

--Filtro
SELECT * FROM Leitura WHERE unidade = 'temperatura' AND valor > 20;
--Agregação
SELECT sensor_id, AVG(valor) FROM Leitura WHERE timestamp > NOW() - INTERVAL '40 days' AND unidade = 'temperatura' GROUP BY sensor_id;