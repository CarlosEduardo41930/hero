CREATE DATABASE heroi;
USE heroi;


CREATE TABLE `personagem` (
  `id` int(11) NOT NULL PRIMARY KEY auto_increment,
  `nome` varchar(50) NOT NULL,
  `classe` enum('arqueira','guerreiro','maga') NOT NULL,
  `imagem` varchar(255) NOT NULL,
  `status` enum('online','ausente','offline') NOT NULL,
  `aparecer` varchar(10) NOT NULL,
  `nivel` int(11) DEFAULT NULL
)