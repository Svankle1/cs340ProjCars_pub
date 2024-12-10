-- MariaDB dump 10.19  Distrib 10.5.22-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: cs340_vanklees
-- ------------------------------------------------------
-- Server version	10.6.19-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cars` (
  `autoID` int(11) NOT NULL AUTO_INCREMENT,
  `engine_engineID` int(11) DEFAULT NULL,
  `model` varchar(45) NOT NULL,
  `year_released` year(4) NOT NULL,
  `manufacturers_manuID` int(11) DEFAULT NULL,
  PRIMARY KEY (`autoID`),
  UNIQUE KEY `autoID_UNIQUE` (`autoID`),
  KEY `fk_car_engine1_idx` (`engine_engineID`),
  KEY `fk_cars_manufacturers1_idx` (`manufacturers_manuID`),
  CONSTRAINT `fk_car_engine1` FOREIGN KEY (`engine_engineID`) REFERENCES `engines` (`engineID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_cars_manufacturers1` FOREIGN KEY (`manufacturers_manuID`) REFERENCES `manufacturers` (`manuID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='Every car is an entry that can be put onto multiple collection lists. If a car exists that is unique to a collector (and they wish that to be accuretally represented), then a new car entity should repseresnt the customized car.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (1,1,'Silverado',1996,1),(2,2,'F150',2017,2),(3,3,'RAM 1500',2024,3);
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `engines`
--

DROP TABLE IF EXISTS `engines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `engines` (
  `engineID` int(11) NOT NULL AUTO_INCREMENT,
  `displacement` decimal(3,1) NOT NULL,
  `cylinder` int(11) NOT NULL,
  `year_released` year(4) NOT NULL,
  `manufacturers_manuID` int(11) DEFAULT NULL,
  PRIMARY KEY (`engineID`),
  UNIQUE KEY `engineID_UNIQUE` (`engineID`),
  KEY `fk_engines_manufacturers1_idx` (`manufacturers_manuID`),
  CONSTRAINT `fk_engines_manufacturers1` FOREIGN KEY (`manufacturers_manuID`) REFERENCES `manufacturers` (`manuID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `engines`
--

LOCK TABLES `engines` WRITE;
/*!40000 ALTER TABLE `engines` DISABLE KEYS */;
INSERT INTO `engines` VALUES (1,5.7,8,1996,1),(2,5.0,8,2011,2),(3,5.7,8,2003,3);
/*!40000 ALTER TABLE `engines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manufacturers` (
  `manuID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `headquarter_location` varchar(45) NOT NULL,
  `year_established` year(4) NOT NULL,
  PRIMARY KEY (`manuID`),
  UNIQUE KEY `manuID_UNIQUE` (`manuID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers`
--

LOCK TABLES `manufacturers` WRITE;
/*!40000 ALTER TABLE `manufacturers` DISABLE KEYS */;
INSERT INTO `manufacturers` VALUES (1,'Chevrolet','Detroit, MI, USA',1908),(2,'Ford','Dearborn, MI, USA',1903),(3,'Dodge','Auburn Hills, MI, USA',0000),(4,'Toyota','Toyota City, Aichi, Japan',1937),(5,'Nissan','Yokohama, Kanagawa, Japan',1933);
/*!40000 ALTER TABLE `manufacturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `people`
--

DROP TABLE IF EXISTS `people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `people` (
  `personID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Note that cars are stored in the car entity. Wierd to me, but i guess you cant put a direct array in a person entity, which is what would be required otherwise',
  `name` varchar(45) NOT NULL,
  `networth` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`personID`),
  UNIQUE KEY `personID_UNIQUE` (`personID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `people`
--

LOCK TABLES `people` WRITE;
/*!40000 ALTER TABLE `people` DISABLE KEYS */;
INSERT INTO `people` VALUES (1,'Jay Leno','450,000,000'),(2,'Jerry Seinfeld','1,100,000,000'),(3,'Floyd Mayweather','400,000,000');
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persons_has_cars`
--

DROP TABLE IF EXISTS `persons_has_cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persons_has_cars` (
  `intersectionID` int(11) NOT NULL AUTO_INCREMENT,
  `persons_personID` int(11) NOT NULL,
  `cars_autoID` int(11) NOT NULL,
  PRIMARY KEY (`intersectionID`),
  UNIQUE KEY `id_UNIQUE` (`intersectionID`),
  KEY `fk_persons_has_cars_cars1_idx` (`cars_autoID`),
  KEY `fk_persons_has_cars_persons1_idx` (`persons_personID`),
  CONSTRAINT `fk_persons_has_cars_cars1` FOREIGN KEY (`cars_autoID`) REFERENCES `cars` (`autoID`) ON UPDATE CASCADE,
  CONSTRAINT `fk_persons_has_cars_persons1` FOREIGN KEY (`persons_personID`) REFERENCES `people` (`personID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persons_has_cars`
--

LOCK TABLES `persons_has_cars` WRITE;
/*!40000 ALTER TABLE `persons_has_cars` DISABLE KEYS */;
INSERT INTO `persons_has_cars` VALUES (1,2,2),(2,1,2),(3,1,1),(4,2,3);
/*!40000 ALTER TABLE `persons_has_cars` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-09 15:58:02
