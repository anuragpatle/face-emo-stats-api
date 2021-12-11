-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: face_emotion_stats
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `emp_details`
--

DROP TABLE IF EXISTS `emp_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_details` (
  `emp_id` int NOT NULL,
  `emp_name` varchar(45) NOT NULL,
  PRIMARY KEY (`emp_id`),
  UNIQUE KEY `emp_id_UNIQUE` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_details`
--

LOCK TABLES `emp_details` WRITE;
/*!40000 ALTER TABLE `emp_details` DISABLE KEYS */;
INSERT INTO `emp_details` VALUES (1235,'a_p'),(98767876,'anurag_patle'),(202000562,'Shweta_Joshi'),(202000932,'anurag_patle'),(202000933,'Ajinkya_Biniwale'),(202000943,'Ajinkya_Biniwale'),(202000953,'Ajinkya_Biniwale'),(202000982,'Komal_Gulwade'),(2020002307,'Gaurav_Jain'),(2020002318,'Monica_Kapre'),(2020002319,'Pranali_Khilari'),(2020002424,'Dintal_Patel');
/*!40000 ALTER TABLE `emp_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emp_emotions`
--

DROP TABLE IF EXISTS `emp_emotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_emotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `angry` varchar(45) NOT NULL,
  `fear` varchar(45) NOT NULL,
  `happy` varchar(45) NOT NULL,
  `neutral` varchar(45) NOT NULL,
  `sad` varchar(45) NOT NULL,
  `surprised` varchar(45) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `overall_sentiment` varchar(45) NOT NULL,
  `day_overall_emotion_processed_status` varchar(45) NOT NULL DEFAULT 'TO_BE_DONE',
  `device_id` varchar(120) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_emp_emo_emp_id_idx` (`emp_id`),
  KEY `fk_overall_sentiment_idx` (`overall_sentiment`),
  CONSTRAINT `fk_emp_emo_emp_id` FOREIGN KEY (`emp_id`) REFERENCES `emp_details` (`emp_id`),
  CONSTRAINT `fk_overall_sentiment` FOREIGN KEY (`overall_sentiment`) REFERENCES `m_emotions` (`emotion`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_emotions`
--

LOCK TABLES `emp_emotions` WRITE;
/*!40000 ALTER TABLE `emp_emotions` DISABLE KEYS */;
INSERT INTO `emp_emotions` VALUES (1,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(2,98767876,'0.033047378','0.06045956','0.017623667','0.78866','0.08258242','0.017626913','2021-11-29','01:01:26','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(3,98767876,'0.030700747','0.06080698','0.014824473','0.7952238','0.07925207','0.019191906','2021-11-29','01:01:26','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(4,98767876,'0.16509731','0.17548002','0.059179094','0.28094155','0.28645805','0.032843936','2021-11-29','01:01:26','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(5,98767876,'0.01912911','0.057639476','0.7634985','0.016955188','0.008954196','0.13382348','2021-11-29','01:01:26','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(6,98767876,'0.025898242','0.062845275','0.75447655','0.03649991','0.017122902','0.10315715','2021-11-29','01:01:26','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(7,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(8,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(9,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(10,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(11,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(12,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(13,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(14,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(15,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(16,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(17,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(18,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(19,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(20,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(21,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(22,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(23,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(24,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(25,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(26,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(27,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(28,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(29,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(30,2020002424,'0.1011278','0.09586147','0.09242979','0.4823966','0.21493411','0.013250174','2021-11-30','17:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(31,2020002424,'0.102650695','0.11095154','0.08988022','0.46207035','0.21403696','0.02041023','2021-11-30','17:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(32,2020002424,'0.12577677','0.0770816','0.2338095','0.30188653','0.2547942','0.0066513345','2021-11-30','17:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(33,2020002424,'0.12981942','0.09598763','0.156762','0.34539807','0.26149356','0.010539309','2021-11-30','17:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(34,2020002424,'0.15034929','0.11024846','0.12235468','0.31474462','0.2909093','0.011393659','2021-11-30','17:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(35,2020002424,'0.14073946','0.10383002','0.13532972','0.33125132','0.2778965','0.010952915','2021-11-30','17:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(36,2020002424,'0.13588227','0.10761025','0.141862','0.3339228','0.26726326','0.0134594785','2021-11-30','17:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(37,2020002424,'0.12528291','0.09982982','0.080212794','0.42419925','0.26098707','0.009488158','2021-11-30','17:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(38,2020002319,'0.16532116','0.13154107','0.06146803','0.31566083','0.31321135','0.012797499','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(39,2020002319,'0.14635691','0.12440034','0.04857919','0.38394687','0.28393283','0.012783862','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(40,2020002319,'0.09076483','0.09056561','0.036565498','0.5760076','0.19594572','0.0101507595','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(41,2020002319,'0.119399235','0.10306305','0.028413657','0.5030358','0.23720984','0.008878423','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(42,2020002319,'0.11415945','0.085730836','0.02677413','0.5363763','0.23189256','0.0050667324','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(43,2020002319,'0.17505202','0.10160699','0.27756852','0.16821696','0.26635644','0.011199124','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(44,2020002319,'0.070500776','0.042658955','0.61466104','0.14519234','0.120838195','0.0061486824','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(45,2020002319,'0.03376398','0.025930999','0.7376185','0.1345939','0.06237135','0.005721181','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(46,2020002319,'0.054915287','0.038693678','0.61179143','0.18458216','0.10329101','0.0067264778','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(47,2020002319,'0.12211111','0.124290384','0.09423478','0.398457','0.23856731','0.022339499','2021-11-30','18:00:22','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(48,2020002318,'0.051281463','0.052086916','0.028526433','0.7391594','0.12410375','0.004841995','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(49,2020002319,'0.08265453','0.1064685','0.023169369','0.5932261','0.17564629','0.018835245','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(50,2020002318,'0.08265453','0.1064685','0.023169369','0.5932261','0.17564629','0.018835245','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(51,2020002424,'0.074238114','0.12738627','0.18396154','0.3957315','0.15111251','0.06757013','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(52,2020002319,'0.074238114','0.12738627','0.18396154','0.3957315','0.15111251','0.06757013','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(53,2020002424,'0.088225745','0.12913547','0.023015331','0.5457768','0.18258393','0.03126278','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(54,2020002424,'0.07645939','0.12829235','0.18866068','0.38530713','0.15195031','0.06933014','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(55,2020002424,'0.052522264','0.06599748','0.046132773','0.70099545','0.12259563','0.011756438','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(56,2020002424,'0.0496985','0.083327234','0.368437','0.3483602','0.10095136','0.04922571','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(57,2020002424,'0.052522264','0.06599748','0.046132773','0.70099545','0.12259563','0.011756438','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(58,2020002424,'0.0496985','0.083327234','0.368437','0.3483602','0.10095136','0.04922571','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(59,2020002319,'0.046672437','0.067388915','0.06719628','0.6915883','0.109316625','0.017837511','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(60,2020002424,'0.046672437','0.067388915','0.06719628','0.6915883','0.109316625','0.017837511','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(61,2020002424,'0.04516836','0.0707175','0.022289269','0.7364142','0.10888481','0.016525827','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(62,2020002424,'0.04516836','0.0707175','0.022289269','0.7364142','0.10888481','0.016525827','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(63,2020002424,'0.043801326','0.059318554','0.34645534','0.43280756','0.095590346','0.022026883','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(64,2020002424,'0.04634166','0.074410625','0.021686349','0.72795373','0.111321084','0.018286604','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(65,2020002424,'0.04634166','0.074410625','0.021686349','0.72795373','0.111321084','0.018286604','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(66,2020002424,'0.043801326','0.059318554','0.34645534','0.43280756','0.095590346','0.022026883','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(67,2020002318,'0.04103795','0.04763647','0.035759885','0.76947224','0.09965363','0.00643979','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(68,2020002424,'0.04103795','0.04763647','0.035759885','0.76947224','0.09965363','0.00643979','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(69,2020002424,'0.046920307','0.06360976','0.018572655','0.74773145','0.11287057','0.010295269','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(70,2020002424,'0.030731158','0.0446831','0.53827095','0.29924947','0.065636165','0.021429172','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(71,2020002424,'0.046920307','0.06360976','0.018572655','0.74773145','0.11287057','0.010295269','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(72,2020002424,'0.030731158','0.0446831','0.53827095','0.29924947','0.065636165','0.021429172','2021-12-01','12:56:41','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(73,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(74,98767876,'0.10743938','0.10507564','0.025111642','0.5348536','0.21677826','0.01074158','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(75,98767876,'0.042844396','0.06264083','0.01289031','0.7644434','0.10670427','0.01047679','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(76,98767876,'0.12688066','0.119788945','0.018285101','0.46702996','0.25745913','0.010556175','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(77,98767876,'0.06137542','0.08879563','0.011911827','0.6782467','0.14446573','0.015204759','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(78,98767876,'0.071319446','0.11151704','0.010470481','0.62341636','0.1603358','0.022940971','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(79,98767876,'0.049968172','0.07448506','0.0080258865','0.73237133','0.12349082','0.011658723','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(80,98767876,'0.06414947','0.09471229','0.009111596','0.66694546','0.14885351','0.016227737','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(81,98767876,'0.0652046','0.09445702','0.01046809','0.6616908','0.15254462','0.015634852','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(82,98767876,'0.08840851','0.12721466','0.00971535','0.5642256','0.18775043','0.022685409','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(83,98767876,'0.079386845','0.10890255','0.00913423','0.6115959','0.1744672','0.016513364','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(84,98767876,'0.045554403','0.06891467','0.008448043','0.75270563','0.11301375','0.011363504','2021-12-07','23:31:23','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(85,98767876,'0.07118087','0.0846183','0.010743845','0.66080034','0.16370815','0.0089484835','2021-12-07','23:45:14','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(86,98767876,'0.043484934','0.06220972','0.009407469','0.7681171','0.10767402','0.009106795','2021-12-07','23:45:29','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(87,98767876,'0.05525065','0.07262004','0.006040136','0.72988623','0.12757024','0.008632791','2021-12-07','23:45:50','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(88,98767876,'0.06753216','0.08325369','0.03694253','0.6475604','0.15023574','0.014475437','2021-12-07','23:49:13','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(89,98767876,'0.056082144','0.10109612','0.033717643','0.64418393','0.12573019','0.039189916','2021-12-07','23:49:16','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(90,98767876,'0.055254318','0.07647121','0.02950599','0.6941295','0.12973593','0.014903012','2021-12-07','23:49:24','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(91,98767876,'0.049827136','0.09951394','0.0124063585','0.6871495','0.11295201','0.038151026','2021-12-07','23:49:32','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(92,98767876,'0.07220922','0.12177047','0.03441011','0.57395947','0.15378518','0.04386566','2021-12-07','23:50:04','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(93,98767876,'0.063856214','0.103801385','0.03747967','0.6192652','0.14242324','0.033174302','2021-12-07','23:50:16','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(94,98767876,'0.119727574','0.11037191','0.03933104','0.47593614','0.24311599','0.011517289','2021-12-07','23:50:21','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(95,202000982,'0.523183051','0.69571745','0.009069938','0.09410431','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(96,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(100,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:44','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(101,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:00','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(102,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:01','LIKELY_HAPPY','TO_BE_DONE','development_device_1'),(103,98767876,'0.052318305','0.09410431','0.009069938','0.69571745','0.12453841','0.024251651','2021-11-29','00:46:01','likely_neutral','TO_BE_DONE','development_device_1');
/*!40000 ALTER TABLE `emp_emotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emp_overall_experience_for_a_day`
--

DROP TABLE IF EXISTS `emp_overall_experience_for_a_day`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_overall_experience_for_a_day` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `date` date NOT NULL,
  `first_captured_setiment` varchar(120) NOT NULL,
  `last_captured_setiment` varchar(120) NOT NULL,
  `overall_day_experience` varchar(120) NOT NULL,
  `total_hours_spent_inside_office` float NOT NULL,
  `number_of_times_a_person_appeared` int NOT NULL,
  `emotion_a_person_made_most` varchar(120) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `emp_id_idx` (`emp_id`),
  KEY `fk_day_experience_idx` (`overall_day_experience`),
  KEY `fk_first_captured_sentiment_idx` (`first_captured_setiment`),
  KEY `fk_last_captured_sentiment_idx` (`last_captured_setiment`),
  CONSTRAINT `fk_day_experience` FOREIGN KEY (`overall_day_experience`) REFERENCES `m_day_experience` (`day_experience`),
  CONSTRAINT `fk_emp_id` FOREIGN KEY (`emp_id`) REFERENCES `emp_details` (`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_first_captured_sentiment` FOREIGN KEY (`first_captured_setiment`) REFERENCES `m_emotions` (`emotion`),
  CONSTRAINT `fk_last_captured_sentiment` FOREIGN KEY (`last_captured_setiment`) REFERENCES `m_emotions` (`emotion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Algorithm\n\nCalculate final result in the following manner.\n\n \n\nOverall experience Calculation:\n\n \n\nCase 1: If (In_time_emotion is likely_happy and Out_time_emotion also is likely_happy):\n\n=> OverAllSentiment is Positive\n\n \n\n \n\nCase 2: If (In_time_emotion is likely_happy and Out_time_emotion is likely_not_happy):\n\n=> OverAllSentiment is Negative:\n\n \n\nCase 3: If (In_time_emotion is likely_not_happy and Out_time_emotion is likely_happy):\n\n=> OverAllSentiment is ExtraPositive:\n\n \n\nCase 3: If (In_time_emotion is likely_not_happy and Out_time_emotion also is likely_not_happy):\n\n=> OverAllSentiment is Neutral:';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_overall_experience_for_a_day`
--

LOCK TABLES `emp_overall_experience_for_a_day` WRITE;
/*!40000 ALTER TABLE `emp_overall_experience_for_a_day` DISABLE KEYS */;
/*!40000 ALTER TABLE `emp_overall_experience_for_a_day` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iot_device_details`
--

DROP TABLE IF EXISTS `iot_device_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot_device_details` (
  `device_id` varchar(120) NOT NULL,
  `org_id` varchar(120) NOT NULL DEFAULT 'T-Systems',
  `development_center` enum('PUNE','BANGALORE') DEFAULT 'PUNE',
  `floor_no` int NOT NULL,
  `room_type` enum('CONFERENCE_ROOM','COMMON_AREA','PANTRY_AREA') NOT NULL DEFAULT 'COMMON_AREA',
  `device_firmware` varchar(120) NOT NULL,
  PRIMARY KEY (`device_id`),
  UNIQUE KEY `device_id_UNIQUE` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot_device_details`
--

LOCK TABLES `iot_device_details` WRITE;
/*!40000 ALTER TABLE `iot_device_details` DISABLE KEYS */;
INSERT INTO `iot_device_details` VALUES ('development_device_1','T-Systems','PUNE',6,'COMMON_AREA','RASPBERRY_PI_4_RaspbianBusterOS_Kernel_version_5.1'),('development_device_2','T-Systems','PUNE',7,'COMMON_AREA','RASPBERRY_PI_4_RaspbianBusterOS_Kernel_version_5.1'),('development_device_3','T-Systems','PUNE',8,'COMMON_AREA','RASPBERRY_PI_4_RaspbianBusterOS_Kernel_version_5.1'),('development_device_4','T-Systems','PUNE',5,'COMMON_AREA','RASPBERRY_PI_4_RaspbianBusterOS_Kernel_version_5.1'),('development_device_5','T-Systems','PUNE',4,'COMMON_AREA','RASPBERRY_PI_4_RaspbianBusterOS_Kernel_version_5.1');
/*!40000 ALTER TABLE `iot_device_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_day_experience`
--

DROP TABLE IF EXISTS `m_day_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_day_experience` (
  `day_experience` varchar(120) NOT NULL,
  PRIMARY KEY (`day_experience`),
  UNIQUE KEY `id_UNIQUE` (`day_experience`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Enums for Day Sentiments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_day_experience`
--

LOCK TABLES `m_day_experience` WRITE;
/*!40000 ALTER TABLE `m_day_experience` DISABLE KEYS */;
INSERT INTO `m_day_experience` VALUES ('EXTRA_POSITIVE'),('NEGATIVE'),('NEUTRAL'),('POSITIVE');
/*!40000 ALTER TABLE `m_day_experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_emotions`
--

DROP TABLE IF EXISTS `m_emotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_emotions` (
  `emotion` varchar(120) NOT NULL,
  PRIMARY KEY (`emotion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_emotions`
--

LOCK TABLES `m_emotions` WRITE;
/*!40000 ALTER TABLE `m_emotions` DISABLE KEYS */;
INSERT INTO `m_emotions` VALUES ('LIKELY_HAPPY'),('LIKELY_NEUTRAL'),('LIKELY_NOT_HAPY');
/*!40000 ALTER TABLE `m_emotions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-11 17:24:46