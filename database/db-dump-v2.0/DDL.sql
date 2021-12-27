-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 27, 2021 at 12:16 AM
-- Server version: 10.6.5-MariaDB
-- PHP Version: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diode_io`
--
CREATE DATABASE IF NOT EXISTS `diode_io` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `diode_io`;

-- --------------------------------------------------------

--
-- Table structure for table `operators`
--

DROP TABLE IF EXISTS `operators`;
CREATE TABLE IF NOT EXISTS `operators` (
  `op_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `op_abbr` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`op_name`),
  UNIQUE KEY `op_abbr` (`op_abbr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passes`
--

DROP TABLE IF EXISTS `passes`;
CREATE TABLE IF NOT EXISTS `passes` (
  `pass_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `station_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pass_charge` decimal(5,2) NOT NULL,
  PRIMARY KEY (`pass_id`),
  KEY `tag_id` (`tag_id`),
  KEY `pass_id` (`pass_id`),
  KEY `passes_ibfk_1` (`station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settlements`
--

DROP TABLE IF EXISTS `settlements`;
CREATE TABLE IF NOT EXISTS `settlements` (
  `set_id` int(11) NOT NULL AUTO_INCREMENT,
  `operator_credited` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator_debited` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`set_id`),
  KEY `operator_debited` (`operator_debited`),
  KEY `settlements_ibfk_1` (`operator_credited`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
CREATE TABLE IF NOT EXISTS `stations` (
  `st_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `op_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_id`),
  UNIQUE KEY `st_name` (`st_name`),
  KEY `st_id` (`st_id`),
  KEY `stations_ibfk_1` (`op_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `tag_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicle_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_provider` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`tag_id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `tag_id` (`tag_id`),
  KEY `tags_ibfk_1` (`tag_provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('admin','operator','transportation','bank') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE IF NOT EXISTS `vehicles` (
  `vehicle_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_year` year(4) NOT NULL,
  PRIMARY KEY (`vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `passes`
--
ALTER TABLE `passes`
  ADD CONSTRAINT `passes_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`st_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `passes_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`);

--
-- Constraints for table `settlements`
--
ALTER TABLE `settlements`
  ADD CONSTRAINT `settlements_ibfk_1` FOREIGN KEY (`operator_credited`) REFERENCES `operators` (`op_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `settlements_ibfk_2` FOREIGN KEY (`operator_debited`) REFERENCES `operators` (`op_name`);

--
-- Constraints for table `stations`
--
ALTER TABLE `stations`
  ADD CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`op_name`) REFERENCES `operators` (`op_name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`tag_provider`) REFERENCES `operators` (`op_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tags_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
