-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Disabling foreign key checks and auto commit
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Schema cars
-- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS `cars` ;

-- USE `cs340_[USERNAME]` ;  -- Ima comment this out. do the USE command on ur own database before running the source file

-- -----------------------------------------------------
-- Table `cars`.`people`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `people` (
  `personID` INT NOT NULL AUTO_INCREMENT COMMENT 'Note that cars are stored in the car entity. Wierd to me, but i guess you cant put a direct array in a person entity, which is what would be required otherwise',
  `name` VARCHAR(45) NOT NULL,
  `netWorth` VARCHAR(45) NULL,
  PRIMARY KEY (`personID`),
  UNIQUE INDEX `personID_UNIQUE` (`personID` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cars`.`manufacturers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manufacturers` (
  `manuID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `headquarter_location` VARCHAR(250) NOT NULL,
  `year_established` YEAR(4) NOT NULL,
  PRIMARY KEY (`manuID`),
  UNIQUE INDEX `manuID_UNIQUE` (`manuID` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cars`.`engines`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `engines` (
  `engineID` INT NOT NULL AUTO_INCREMENT,
  `displacement` DECIMAL(3,1) NOT NULL,
  `cylinder` INT NOT NULL,
  `year_released` YEAR(4) NOT NULL,
  `fk_manuID` INT,
  PRIMARY KEY (`engineID`),
  UNIQUE INDEX `engineID_UNIQUE` (`engineID` ASC) VISIBLE,
  INDEX `fk_engines_manufacturers1_idx` (`fk_manuID` ASC) VISIBLE,
--  CONSTRAINT manuModel UNIQUE (model, fk_manuID) -- I dont know how to implement this in engines with the provided information, so ill hold off for now
  CONSTRAINT `fk_engines_manufacturers1`
    FOREIGN KEY (`fk_manuID`)
    REFERENCES `manufacturers` (`manuID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cars`.`cars`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cars` (
  `autoID` INT NOT NULL AUTO_INCREMENT,
  `fk_engineID` INT,
  `model` VARCHAR(45) NOT NULL,
  `year_released` YEAR(4) NOT NULL,
  `fk_manuID` INT,
  PRIMARY KEY (`autoID`),
  UNIQUE INDEX `autoID_UNIQUE` (`autoID` ASC) VISIBLE,
  INDEX `fk_car_engine1_idx` (`fk_engineID` ASC) VISIBLE,
  INDEX `fk_cars_manufacturers1_idx` (`fk_manuID` ASC) VISIBLE,
  CONSTRAINT manuModel UNIQUE (model, fk_manuID, year_released),
  CONSTRAINT `fk_car_engine1`
    FOREIGN KEY (`fk_engineID`)
    REFERENCES `engines` (`engineID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cars_manufacturers1`
    FOREIGN KEY (`fk_manuID`)
    REFERENCES `manufacturers` (`manuID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Every car is an entry that can be put onto multiple collection lists. If a car exists that is unique to a collector (and they wish that to be accuretally represented), then a new car entity should repseresnt the customized car.';


-- -----------------------------------------------------
-- Table `cars`.`people_have_cars`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `people_have_cars` (
  `intersectionID` INT NOT NULL AUTO_INCREMENT,
  `fk_personID` INT NOT NULL,
  `fk_autoID` INT NOT NULL,
  PRIMARY KEY (`intersectionID`),
  INDEX `fk_people_have_cars_cars1_idx` (`fk_autoID` ASC) VISIBLE,
  INDEX `fk_people_have_cars_persons1_idx` (`fk_personID` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`intersectionID` ASC) VISIBLE,
  CONSTRAINT `fk_people_have_cars_persons1`
    FOREIGN KEY (`fk_personID`)
    REFERENCES `people` (`personID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_people_have_cars_cars1`
    FOREIGN KEY (`fk_autoID`)
    REFERENCES `cars` (`autoID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


/* Inserting Example Data */

INSERT INTO `people` (name, netWorth)
VALUES
('Jay Leno', '450,000,000'),
('Jerry Seinfeld', '1,100,000,000'),
('Floyd Mayweather', '400,000,000');

INSERT INTO `manufacturers` (name, headquarter_location, year_established)
VALUES
('Chevrolet', 'Detroit, MI, USA', 1908),
('Ford', 'Dearborn, MI, USA', 1903),
('Dodge', 'Auburn Hills, MI, USA', 1901),
('Toyota', 'Toyota City, Aichi, Japan', 1937),
('Nissan', 'Yokohama, Kanagawa, Japan', 1933);

INSERT INTO `engines` (displacement, cylinder, year_released, fk_manuID)
SELECT 5.7, 8, 1996, manuID FROM manufacturers WHERE name = 'Chevrolet'
UNION ALL
SELECT 5.0, 8, 2011, manuID FROM manufacturers WHERE name = 'Ford'
UNION ALL
SELECT 5.7, 8, 2003, manuID FROM manufacturers WHERE name = 'Dodge';

INSERT INTO `cars` (year_released, model, fk_engineID, fk_manuID)
SELECT 1996, 'Silverado', e.engineID, m.manuID
FROM engines e
JOIN manufacturers m ON e.fk_manuID = m.manuID
WHERE m.name = 'Chevrolet' AND e.displacement = 5.7
UNION ALL
SELECT 2017, 'F150', e.engineID, m.manuID
FROM engines e
JOIN manufacturers m ON e.fk_manuID = m.manuID
WHERE m.name = 'Ford' AND e.displacement = 5.0
UNION ALL
SELECT 2024, 'RAM 1500', e.engineID, m.manuID
FROM engines e
JOIN manufacturers m ON e.fk_manuID = m.manuID
WHERE m.name = 'Dodge' AND e.displacement = 5.7;

INSERT INTO people_have_cars (fk_personID, fk_autoID)
SELECT (SELECT personID FROM people WHERE name = 'Jerry Seinfeld'),
(SELECT autoID FROM cars WHERE model = 'F150')
UNION ALL
SELECT (SELECT personID FROM people WHERE name = 'Jay Leno'),
(SELECT autoID FROM cars WHERE model = 'F150')
UNION ALL
SELECT (SELECT personID FROM people WHERE name = 'Jay Leno'),
(SELECT autoID FROM cars WHERE model = 'Silverado')
UNION ALL
SELECT (SELECT personID FROM people WHERE name = 'Jerry Seinfeld'),
(SELECT autoID FROM cars WHERE model = 'RAM 1500');

-- Re enabling foreign key checks and auto commit
SET FOREIGN_KEY_CHECKS=1;
COMMIT;