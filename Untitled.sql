CREATE DATABASE `log` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
use log;
CREATE TABLE `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectID` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `count` bigint(8) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventID` int(11) NOT NULL,
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
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `serverTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `clientTime` datetime DEFAULT NULL,
  `data` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `solutionID` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `createtime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `solution` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELIMITER $$
CREATE TRIGGER UpdateEventCount
   AFTER INSERT
   on log for each row
BEGIN
    -- Insert statements for trigger here
	update event set count = count + 1 where event.id = NEW.eventID;
END
$$
delimiter ;