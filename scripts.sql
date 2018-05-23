--Création de la bdd bddmemory
CREATE DATABASE bddmemory;
--Création de la table Times avec une clé primaire auto incrémentée.
CREATE TABLE `bddmemory`.`Times` ( `id` INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT , `time` INT NOT NULL);