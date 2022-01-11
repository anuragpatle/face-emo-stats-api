INSERT INTO `face_emotion_stats`.`iot_device_details`
(`device_id`,
`org_id`,
`development_center`,
`floor_no`,
`room_type`,
`device_firmware`)
VALUES
( "development_device_5", "T-Systems", "PUNE", 4, "COMMON_AREA", "RASPBERRY_PI_4_RaspdianBusterOS_Kernel_version_5.1");



SELECT * FROM `face_emotion_stats`.`emp_details` AS t1 INNER JOIN `face_emotion_stats`.`emp_emotions` AS t2 INNER JOIN `face_emotion_stats`.`iot_device_details` AS t3 ON t2.emp_id = t1.emp_id and t3.device_id = t2.device_id order by t2.id DESC LIMIT 0,5



CREATE TABLE `face_emotion_stats`.`emp_overall_emotions_for_a_day` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `emp_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `first_captured_setiment` VARCHAR(120) NOT NULL,
  `last_captured_setiment`  VARCHAR(120) NOT NULL,
  `overall_day_sentiment` VARCHAR(120) NOT NULL,
  `total_hours_spent_inside_office` FLOAT NOT NULL,
  `number_of_times_a_person_appeared` INT NOT NULL,
  `emotion_a_person_made_most` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `emp_id_idx` (`emp_id` ASC) VISIBLE,
  CONSTRAINT `fk_emp_id`
    FOREIGN KEY (`emp_id`)
    REFERENCES `face_emotion_stats`.`emp_details` (`emp_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
COMMENT = 'Algorithm\n\nCalculate final result in the following manner.\n\n \n\nOverall experience Calculation:\n\n \n\nCase 1: If (In_time_emotion is likely_happy and Out_time_emotion also is likely_happy):\n\n=> OverAllSentiment is Positive\n\n \n\n \n\nCase 2: If (In_time_emotion is likely_happy and Out_time_emotion is likely_not_happy):\n\n=> OverAllSentiment is Negative:\n\n \n\nCase 3: If (In_time_emotion is likely_not_happy and Out_time_emotion is likely_happy):\n\n=> OverAllSentiment is ExtraPositive:\n\n \n\nCase 3: If (In_time_emotion is likely_not_happy and Out_time_emotion also is likely_not_happy):\n\n=> OverAllSentiment is Neutral:';



# Backup and restore the database

GoTo: C:\Program Files\MySQL\MySQL Server 8.0\bin

`mysqldump -u root -p face_emotion_stats > face_emotion_stats_dump.sql`

`mysql -u root -p face_emotion_stats < face_emotion_stats_dump.sql`

`mysql -u root -p face_emotion_stats < "C:\Users\anurag\Documents\MyProjects\FaceEmotionStats-Processor\face-emo-stats-api\face_emotion_stats_dump.sql"`


select overall_sentiment, time from (select * from `face_emotion_stats`.`emp_emotions` where emp_id = 98767876 and date =  '2021-12-7') as t1 order by time desc limit 1;


select max(t1.cnt) from (SELECT overall_sentiment, count(overall_sentiment) as cnt FROM face_emotion_stats.emp_emotions group by overall_sentiment) as t1;


UPDATE `face_emotion_stats`.`emp_emotions`
SET
`day_overall_emotion_processed_status` = 'TO_BE_DONE'
WHERE `id` > -1;