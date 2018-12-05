 CREATE DATABASE `log` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
use `log`;
CREATE TABLE `solution` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `solutionID` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `createtime` datetime DEFAULT CURRENT_TIMESTAMP,
  `tapcount` bigint(8) NOT NULL DEFAULT '0',
  `apicount` bigint(8) NOT NULL DEFAULT '0',
  `errorcount` bigint(8) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectID` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `count` bigint(8) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventID` int(11) NOT NULL,
  `uuid` varchar(45) DEFAULT NULL,
  `version` varchar(20) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `screenWidth` int(11) DEFAULT NULL,
  `screenHeight` int(11) DEFAULT NULL,
  `windowWidth` int(11) DEFAULT NULL,
  `windowHeight` int(11) DEFAULT NULL,
  `userAgent` varchar(450) DEFAULT NULL,
  `url` varchar(450) DEFAULT NULL,
  `referer` varchar(450) DEFAULT NULL,
  `awayTime` int(11) DEFAULT NULL,
  `awayType` int(11) DEFAULT NULL,
  `address` varchar(450) DEFAULT NULL,
  `province` varchar(40) CHARACTER SET utf8 DEFAULT NULL,
  `city` varchar(40) CHARACTER SET utf8 DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `serverTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `clientTime` datetime DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `log_active` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectID` int(11) NOT NULL,
  `uuid` varchar(45) DEFAULT NULL,
  `version` varchar(20) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `element` text,
  `ip` varchar(15) DEFAULT NULL,
  `screenWidth` int(11) DEFAULT NULL,
  `screenHeight` int(11) DEFAULT NULL,
  `windowWidth` int(11) DEFAULT NULL,
  `windowHeight` int(11) DEFAULT NULL,
  `pageX` int(11) DEFAULT NULL,
  `pageY` int(11) DEFAULT NULL,
  `userAgent` varchar(450) DEFAULT NULL,
  `url` varchar(450) DEFAULT NULL,
  `referer` varchar(450) DEFAULT NULL,
  `awayTime` int(11) DEFAULT NULL,
  `awayType` int(11) DEFAULT NULL,
  `address` varchar(450) DEFAULT NULL,
  `province` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `serverTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `clientTime` datetime DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24845 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `log_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectID` int(11) NOT NULL,
  `uuid` varchar(45) DEFAULT NULL,
  `version` varchar(20) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `screenWidth` int(11) DEFAULT NULL,
  `screenHeight` int(11) DEFAULT NULL,
  `windowWidth` int(11) DEFAULT NULL,
  `windowHeight` int(11) DEFAULT NULL,
  `userAgent` varchar(450) DEFAULT NULL,
  `url` varchar(450) DEFAULT NULL,
  `referer` varchar(450) DEFAULT NULL,
  `awayTime` int(11) DEFAULT NULL,
  `awayType` int(11) DEFAULT NULL,
  `address` varchar(450) DEFAULT NULL,
  `province` varchar(40) DEFAULT NULL,
  `city` varchar(40) DEFAULT NULL,
  `apiUrl` varchar(850) DEFAULT NULL,
  `method` varchar(8) DEFAULT NULL,
  `uploadTime` int(11) DEFAULT NULL,
  `waitTime` int(11) DEFAULT NULL,
  `loadTime` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `serverTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `clientTime` datetime DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18594 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `log_error` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectID` int(11) NOT NULL,
  `uuid` varchar(45) DEFAULT NULL,
  `version` varchar(20) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `screenWidth` int(11) DEFAULT NULL,
  `screenHeight` int(11) DEFAULT NULL,
  `windowWidth` int(11) DEFAULT NULL,
  `windowHeight` int(11) DEFAULT NULL,
  `userAgent` varchar(450) DEFAULT NULL,
  `url` varchar(450) DEFAULT NULL,
  `referer` varchar(450) DEFAULT NULL,
  `awayTime` int(11) DEFAULT NULL,
  `awayType` int(11) DEFAULT NULL,
  `line` int(11) DEFAULT NULL,
  `col` int(11) DEFAULT NULL,
  `address` varchar(450) DEFAULT NULL,
  `province` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `serverTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `clientTime` datetime DEFAULT NULL,
  `source` varchar(200) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=916 DEFAULT CHARSET=utf8mb4;

DELIMITER $
CREATE TRIGGER UpdateEventCount
   AFTER INSERT
   on log for each row
BEGIN
	update event set count = count + 1 where event.id = NEW.eventID;
END