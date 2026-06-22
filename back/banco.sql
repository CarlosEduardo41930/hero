CREATE DATABASE heroi;
USE heroi;

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome_usuario VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE guilda (
    id_guilda INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    pontos INT DEFAULT 0,
    ouro INT DEFAULT 0,
    expose VARCHAR(10),
    especializacao VARCHAR(100),
    ordem INT,
    descricao TEXT,

    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE titulo (
    id_titulo INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    tipo INT,
    titulo VARCHAR(255),

    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE heroi (
    id_heroi INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    fk_guilda INT,
    nome VARCHAR(100) NOT NULL,
    classe VARCHAR(50),
    imagem VARCHAR(255),
    nivel INT DEFAULT 1,
    status VARCHAR(50),
    ouro INT DEFAULT 0,
    expose VARCHAR(10),
    xps INT DEFAULT 0,
    descricao TEXT,
    ordem INT,

    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_guilda) REFERENCES guilda(id_guilda)
);

CREATE TABLE user_heroi_titulo (
    id_heroi_titulo INT PRIMARY KEY AUTO_INCREMENT,
    fk_heroi INT NOT NULL,
    fk_titulo INT NOT NULL,

    FOREIGN KEY (fk_heroi) REFERENCES heroi(id_heroi),
    FOREIGN KEY (fk_titulo) REFERENCES titulo(id_titulo),

    UNIQUE (fk_heroi, fk_titulo)
);

CREATE TABLE user_guilda_titulo (
    id_guilda_titulo INT PRIMARY KEY AUTO_INCREMENT,
    fk_guilda INT NOT NULL,
    fk_titulo INT NOT NULL,

    FOREIGN KEY (fk_guilda) REFERENCES guilda(id_guilda),
    FOREIGN KEY (fk_titulo) REFERENCES titulo(id_titulo),

    UNIQUE (fk_guilda, fk_titulo)
);

CREATE TABLE missao (
    id_missao INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    origem VARCHAR(100),
    local_missao VARCHAR(100),
    objetivo TEXT,
    recomendacao TEXT,
    recompensa VARCHAR(255),
    expose VARCHAR(10),
    titulo VARCHAR(100),
    nivel INT,
    pontos INT,
    descricao TEXT,
    limite_participantes INT NOT NULL,

    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE heroi_missao (
    id_heroi_missao INT PRIMARY KEY AUTO_INCREMENT,
    fk_heroi INT NOT NULL,
    fk_missao INT NOT NULL,
    expose VARCHAR(10),
    completa BOOLEAN DEFAULT FALSE,
    quantidade INT DEFAULT 0,

    FOREIGN KEY (fk_heroi) REFERENCES heroi(id_heroi),
    FOREIGN KEY (fk_missao) REFERENCES missao(id_missao),

    UNIQUE (fk_heroi, fk_missao)
);




INSERT INTO `guilda` (`id_guilda`, `nome`, `pontos`, `ouro`, `expose`, `especializacao`, `ordem`, `descricao`) VALUES (NULL, 'teste', '50', '50', 'false', 'sfafsafsaf', '1', 'dasfgsd\\gsfdg');
INSERT INTO heroi ( `fk_usuario`, `fk_guilda`, `nome`, `classe`, `imagem`, `nivel`, `status`, `ouro`, `expose`, `descricao`, `ordem`) VALUES ('1', '1', 'teste', 'adfds', 'https://tse3.mm.bing.net/th/id/OIP.4cTSuV8rsq9gXsd0BTuSjgHaGM?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', '1', 'off', '50', 'false', 'sagsadgfsgf', '1');