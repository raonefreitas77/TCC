CREATE TABLE `tcc`.`usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE INDEX `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Tabela de animais
CREATE TABLE `tcc`.`animais` (
  `idAnimais` INT NOT NULL,
  `nomeAnimal` VARCHAR(45) NOT NULL,
  `especie` VARCHAR(45) NOT NULL,
  `autorID` INT NOT NULL,
  PRIMARY KEY (`idAnimais`),
  UNIQUE INDEX `autorID_idx` (`autorID` ASC),
  CONSTRAINT `autorID`
    FOREIGN KEY (`autorID`)
    REFERENCES `tcc`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Tabela de modelos 3D
CREATE TABLE `tcc`.`modelo3d` (
  `idModelo3D` INT NOT NULL,
  `animalID` INT NOT NULL,
  `sexo` ENUM('M', 'F') NOT NULL,
  `caminho_arquivo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idModelo3D`),
  UNIQUE INDEX `animalID_idx` (`animalID` ASC),
  CONSTRAINT `animalID`
    FOREIGN KEY (`animalID`)
    REFERENCES `tcc`.`animais` (`idAnimais`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- Tabela de órgãos
CREATE TABLE `tcc`.`estruturas_anatomicas` (
  `idEstrutura` INT NOT NULL,
  `nomeEstrutura` VARCHAR(45) NULL,
  `descricao` LONGTEXT NULL,
  `modeloID` INT NULL,
  PRIMARY KEY (`idEstrutura`),
  INDEX `modeloID_idx` (`modeloID` ASC),
  CONSTRAINT `modeloID`
    FOREIGN KEY (`modeloID`)
    REFERENCES `tcc`.`modelo3d` (`idModelo3D`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
