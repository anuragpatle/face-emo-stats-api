const emailService = require("./email.js");
var express = require("express");
const mysql = require("mysql2");
const cron = require("node-cron");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var EmployeeDayEmotion = require("./EmployeeDayEmotion.js");
var database = require("./database.js");
var app = express();
var bodyParser = require("body-parser");
const multer = require('multer')
const morgan = require('morgan');
const path = require('path');
const knex = require('knex');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// serving static files
app.use('/uploads', express.static('uploads'));


const route = require("./router");
const { response } = require("express");

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Employee Sentiment Monitoring API",
      description: "Employee Sentiment Monitoring API Information",
      contact: {
        name: "Amazing Developer",
      },
      servers: ["http://localhost:5000"],
    },
  },
  // ['.routes/*.js']
  apis: ["index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: "localhost",
  user: "root",
  password: "123456",
  database: "face_emotion_stats",
  debug: false,
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.post("/facial-senti-api/raw_sentiments", (req, res) => {
  insertIntoEmpEmotions(req.body, res);
});

// Insert new emp
/**
 * @swagger
 * /facial-senti-api/add_emp:
 *   post:
 *     tags:
 *       - Employees
 *     description: Creates a new employee 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: employee_object
 *         description: add an employee object with emp_id and emp_name
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post("/facial-senti-api/add_emp", (req, res) => {
  insertIntoEmp(req.body, res);
  // res.sendStatus(200);
});

// Routes
/**
 * @swagger
 * /facial-senti-api/get_emotion_records/:
 *  get:
 *      tags:
 *          - Sentiments
 *      description: Use to request all emotions
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of employees emotions
 *  parameters:
 *      - in: query
 *        name: page_index
 *        schema:
 *          type: integer
 *        description: Index of current page
 *      - in: query
 *        name: page_size
 *        schema:
 *          type: integer
 *        description: The numbers of items you want to see per age
 *  
 */
app.get("/facial-senti-api/get_emotion_records/", (req, res) => {
  pageIndex = parseInt(req.query.page_index);
  pageSize = parseInt(req.query.page_size);
  selectEmpEmotions(pageIndex, pageSize, res);
});

/**
 * @swagger
 * /facial-senti-api/get_all_employees/:
 *  get:
 *      tags:
 *          - Employees
 *      description: Use to request all employees details
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of employees 
 * 
 *  
 */
app.get("/facial-senti-api/get_all_employees/", (req, res) => {
  selectEmployees(res);
});

/**
 * @swagger
 * /facial-senti-api/emp_overall_day_deperience/:
 *  get:
 *      tags:
 *          - Sentiments
 *      description: Use to request all emotions calculated day wise
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of employees emotions  calculated day wise
 *  parameters:
 *      - in: query
 *        name: page_index
 *        schema:
 *          type: integer
 *        description: Index of current page
 *      - in: query
 *        name: page_size
 *        schema:
 *          type: integer
 *        description: The numbers of items you want to see per age
 *  
 */
app.get("/facial-senti-api/emp_overall_day_deperience/", (req, res) => {
  pageIndex = parseInt(req.query.page_index);
  pageSize = parseInt(req.query.page_size);
  selectOverallDayExperience(pageIndex, pageSize, res);
});

// app.get("/",(req,res) => {
//     pool.getConnection((err, connection) => {
//         if(err) throw err;
//         console.log('connected as id ' + connection.threadId);
//         connection.query('SELECT * from emp_details LIMIT 1', (err, rows) => {
//             connection.release(); // return the connection to pool
//             if(err) throw err;
//             console.log('The data from users table are: \n', rows);
//         });
//     });
// });

function selectOverallDayExperience(pageIndex, pageSize, res) {
  rowStartIndex = pageIndex * pageSize;

  let selectQuery =
    "SELECT t1.id, t2.emp_id, t2.emp_name, t1.date, t1.first_captured_setiment, t1.last_captured_setiment, t1.overall_day_experience, t1.number_of_times_this_person_appeared, t1.emotion_this_person_made_most FROM `face_emotion_stats`.`emp_details` AS t2  INNER JOIN `face_emotion_stats`.`emp_overall_experience_for_a_day` AS t1  ON t2.emp_id = t1.emp_id order by t1.id DESC LIMIT ?,?";

  // let selectQuery = "SELECT * FROM ?? AS t1 INNER JOIN ?? AS t2 INNER JOIN ?? AS t3 ON t2.emp_id = t1.emp_id and t3.device_id = t2.device_id order by t2.id DESC LIMIT ?,?";
  let query = mysql.format(selectQuery, [pageIndex, pageSize]);
  console.log("query: " + query);
  pool.query(query, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "Internal server error" });
      return;
    }
    // rows added
    res.json(data);
  });
}

function insertIntoEmp(data, res) {
  let insertQuery = "INSERT INTO ?? (??,??) VALUES (?,?)";

  let query = mysql.format(insertQuery, [
    "emp_details",
    "emp_id",
    "emp_name",
    data.emp_id,
    data.emp_name,
  ]);
  pool.query(query, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "Internal server error" });
      return;
    }
    // rows added
    res.status(200).send({ Msg: "Employee Added Successfully." });
    console.log(response.insertId);
  });
}

function insertIntoEmpEmotions(data, res) {
  let insertQuery =
    "INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

  let query = mysql.format(insertQuery, [
    "emp_emotions",
    "emp_id",
    "angry",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprised",
    "date",
    "time",
    "overall_sentiment",
    "day_overall_emotion_processed_status",
    "device_id",
    data.emp_id,
    data.emotion_scores.Angry,
    data.emotion_scores.Fear,
    data.emotion_scores.Happy,
    data.emotion_scores.Neutral,
    data.emotion_scores.Sad,
    data.emotion_scores.Surprised,
    data.date,
    data.time,
    data.overall_sentiment,
    "TO_BE_DONE",
    data.device_id,
  ]);
  pool.query(query, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "Internal server error" });
      return;
    }
    // rows added
    res.status(200).send({ Msg: "Query executed Successfully" });
    console.log(response.insertId);
  });
}

function selectEmpEmotions(pageIndex, pageSize, res) {
  rowStartIndex = pageIndex * pageSize;

  let selectQuery =
    "SELECT * FROM ?? AS t1 INNER JOIN ?? AS t2 INNER JOIN ?? AS t3 ON t2.emp_id = t1.emp_id and t3.device_id = t2.device_id order by t2.id DESC LIMIT ?,?";
  let query = mysql.format(selectQuery, [
    "emp_details",
    "emp_emotions",
    "iot_device_details",
    pageIndex,
    pageSize,
  ]);
  console.log("query: " + query);
  pool.query(query, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "Internal server error" });
      return;
    }
    // rows added
    res.json(data);
  });
}

function selectEmployees(res) {
  let selectQuery = "SELECT * FROM ?? ";
  let query = mysql.format(selectQuery, ["emp_details"]);
  console.log("query: " + query);
  pool.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // rows fetch
    // console.log(data);
    res.json(data);
  });
}

async function sendMoreThan50PercentNotHappyMailMain() {
  const connection = await database.connection();

  let results = await connection.query(
    "SELECT DATE_FORMAT(CURDATE(), '%Y-%m-%d') as date"
  );

  let selectQuery =
    "SELECT IF((SELECT COUNT(*) FROM ?? WHERE ? = 'LIKELY_NOT_HAPPY' and ? = " +
    results[0].date +
    ") > (SELECT COUNT(*)/2 FROM ?? where ? = " +
    results[0].date +
    "), 'LIKELY_NOT_HAPPY', 'LIKELY_NEUTRAL_OR_HAPPY') EMOTION_MORE_THAN_50_PERCENT";
  let query = mysql.format(selectQuery, [
    "emp_emotions",
    "overall_sentiment",
    "date",
    "emp_emotions",
    "date",
  ]);
  console.log("query: " + query);
  pool.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // rows fetch
    // console.log("data[0].EMOTION_MORE_THAN_50_PERCENT" + data[0].EMOTION_MORE_THAN_50_PERCENT);
    if (data[0].EMOTION_MORE_THAN_50_PERCENT === "LIKELY_NEUTRAL_OR_HAPPY") {
      console.log("if ****");
    } else {
      emailService.AngrysendMoreThan50PercentNotHappyMail();
    }
  });
}

// Example:
// Args: Wed Dec 01 2021 00:00:00 GMT+0000 (Coordinated Universal Time)
// Returns: 2021-12-01
// function getDateFormatted(date) {
//     console.log("*****date: " + date)
//     const emoDateArr = (date + "").split(" ", 4); // E.g. row.date = Wed Dec 01 2021 00:00:00 GMT+0000 (Coordinated Universal Time)
//     const dateObj = new Date(emoDateArr[1] + " " + emoDateArr[2] + " " + emoDateArr[3]) // Dec 07 2021
//     const emoDateStr =  dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
//     return emoDateStr;
// }

async function processDaySentiment() {
  const connection = await database.connection();
  let sentiments = [];

  try {
    let selectUnporcessedRowsQuery =
      "select distinct DATE_FORMAT(date, '%Y-%m-%d') as date, emp_id from face_emotion_stats.emp_emotions where day_overall_emotion_processed_status = 'TO_BE_DONE' and date < curdate()";
    let mSelectUnporcessedRowsQuery = mysql.format(selectUnporcessedRowsQuery);
    console.log(
      "***** mSelectUnporcessedRowsQuery: " + mSelectUnporcessedRowsQuery
    );
    let results = await connection.query(mSelectUnporcessedRowsQuery);

    Object.keys(results).forEach(async function (key) {
      var row = results[key];

      let emoDateStr = row.date;

      let daySentimentObj = new EmployeeDayEmotion();
      daySentimentObj.setDate(emoDateStr);
      daySentimentObj.setEmpId(row.emp_id);

      let numberOfTimesAPersonAppearedObj =
        await getNumberOfTimesAPersonAppeared(daySentimentObj, connection);
      let numberOfTimesAPersonAppeared = numberOfTimesAPersonAppearedObj[0].cnt;
      if (numberOfTimesAPersonAppeared < 2) {
        updateProcessedDaySentiment(daySentimentObj, connection); // Update that single entry of intime. This is the case when face is not captured while outtime.
        return true; // return true = true
        // return false = break
      }

      daySentimentObj.setNumberOfTimesAPersonAppeared(
        numberOfTimesAPersonAppeared
      );

      let inObj = await getSentiment(
        row.emp_id,
        emoDateStr,
        "ENTERING",
        daySentimentObj,
        connection
      );

      let outObj = await getSentiment(
        row.emp_id,
        emoDateStr,
        "EXITING",
        daySentimentObj,
        connection
      );
      daySentimentObj.setInTimeEmotion(inObj);
      daySentimentObj.setOutTimeEmotion(outObj);
      sentiments.push(daySentimentObj);

      if (
        (inObj === "LIKELY_HAPPY" || inObj === "likely_happy") &&
        (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")
      ) {
        daySentimentObj.setOverallDayEmotion("POSITIVE");
      } else if (
        (inObj === "LIKELY_HAPPY" || inObj === "likely_happy") &&
        (outObj === "LIKELY_NOT_HAPPY" || outObj === "likely_not_happy")
      ) {
        daySentimentObj.setOverallDayEmotion("NEGATIVE");
      } else if (
        (inObj === "LIKELY_HAPPY" || inObj === "likely_happy") &&
        (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")
      ) {
        daySentimentObj.setOverallDayEmotion("NEUTRAL");
      } else if (
        (inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") &&
        (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")
      ) {
        daySentimentObj.setOverallDayEmotion("EXTRA_POSITIVE");
      } else if (
        (inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") &&
        (outObj === "LIKELY_NOT_HAPPY" || outObj === "likely_not_happy")
      ) {
        daySentimentObj.setOverallDayEmotion("NEUTRAL");
      } else if (
        (inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") &&
        (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")
      ) {
        daySentimentObj.setOverallDayEmotion("POSITIVE");
      } else if (
        (inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") &&
        (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")
      ) {
        daySentimentObj.setOverallDayEmotion("NEUTRAL");
      } else if (
        (inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") &&
        (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")
      ) {
        daySentimentObj.setOverallDayEmotion("POSITIVE");
      } else if (
        (inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") &&
        (outObj === "LIKELY_NOT_HAPPY" ||
          outObj === "likellikely_not_happy_happy")
      ) {
        daySentimentObj.setOverallDayEmotion("NEGATIVE");
      } else {
        console.log("New emotion found");
      }

      let emoMost = await getEmotionAPersonMadeMost(
        daySentimentObj,
        connection
      );
      daySentimentObj.setEmotionAPersonMadeMost(emoMost[0].overall_sentiment);

      await insertProcessedDaySentiments(daySentimentObj, connection);

      await updateProcessedDaySentiment(daySentimentObj, connection);
    });
  } catch (err) {
    await connection.query("ROLLBACK");
    console.log("ROLLBACK at querySignUp", err);
    throw err;
  } finally {
    await connection.release();
  }
}

function getNumberOfTimesAPersonAppeared(daySentimentObj, connection) {
  let query =
    "SELECT count(*) as cnt FROM face_emotion_stats.emp_emotions where emp_id = '" +
    daySentimentObj.empId +
    "' and date =  '" +
    daySentimentObj.date +
    "'";
  return connection.query(query);
}

function getEmotionAPersonMadeMost(daySentimentObj, connection) {
  let query =
    "SELECT overall_sentiment, count(overall_sentiment) as cnt FROM face_emotion_stats.emp_emotions  where emp_id = '" +
    daySentimentObj.empId +
    "' and date =  '" +
    daySentimentObj.date +
    "' group by overall_sentiment order by cnt desc limit 1";
  return connection.query(query);
}

function insertProcessedDaySentiments(daySentimentObj, connection) {
  let insertQuery =
    "INSERT INTO ?? (??,??, ??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?,?)";

  let insertQueryF = mysql.format(insertQuery, [
    "emp_overall_experience_for_a_day",
    "emp_id",
    "date",
    "first_captured_setiment",
    "last_captured_setiment",
    "overall_day_experience",
    "number_of_times_this_person_appeared",
    "emotion_this_person_made_most",
    daySentimentObj.empId,
    daySentimentObj.date,
    daySentimentObj.inTimeEmotion,
    daySentimentObj.outTimeEmotion,
    daySentimentObj.overallDayEmotion,
    daySentimentObj.numberOfTimesAPersonAppeared,
    daySentimentObj.emotionAPersonMadeMost,
  ]);

  connection.query(insertQueryF, (err, response) => {
    if (err) {
      console.error(err);
    }
    // rows added
    console.log(response.insertId);
  });
}

function updateProcessedDaySentiment(daySentimentObj, connection) {
  let query =
    "UPDATE emp_emotions SET day_overall_emotion_processed_status = 'DONE' WHERE emp_id = " +
    daySentimentObj.empId +
    " and date = '" +
    daySentimentObj.date +
    "'";
  connection.query(query, (err, response) => {
    if (err) {
      console.error(err);
    }
    // rows added
    console.log(response);
  });
}

// Get Intime Sentiment or OutTime Sentiment
async function getSentiment(
  emp_id,
  date,
  empExitingOrEntering,
  daySentimentObj,
  connection,
  callback
) {
  let orderBy = "desc";
  let overallSentiment;

  if (empExitingOrEntering === "ENTERING") {
    orderBy = "asc";
  }

  let inTimeSentimentQuery = mysql.format(
    "select overall_sentiment from (select * from face_emotion_stats.emp_emotions \
        where emp_id = " +
      emp_id +
      " and date = '" +
      date +
      "') as t1 order by time " +
      orderBy +
      " limit 1"
  );

  // console.log("In/Out time emo query: " + inTimeSentimentQuery);

  try {
    const data = await connection.query(inTimeSentimentQuery);
    overallSentiment = data[0].overall_sentiment;
    return overallSentiment;
    console.log("data: " + data);
  } catch (e) {
    console.log("e: " + e);
  }
}



function addRow(data) {
  let insertQuery = "INSERT INTO ?? (??,??) VALUES (?,?)";
  let query = mysql.format(insertQuery, [
    "todo",
    "user",
    "notes",
    data.user,
    data.value,
  ]);
  pool.query(query, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    // rows added
    console.log(response.insertId);
  });
}

// timeout just to avoid firing query before connection happens
// setTimeout(() => {
//     // call the function
//     addRow({
//         "user": "Shahid",
//         "value": "Just adding a note"
//     });
// },5000);

var intervalID = setInterval(alert, 120000); // Will alert once per 2-minutes.

function alert() {
  console.log("some alert");
}

// console.log(intervalID._idleTimeout)

app.use(morgan('dev'));
// Create multer object
const imageUpload = multer({
  storage: multer.diskStorage(
      {
          destination: function (req, file, cb) {
              cb(null, 'images/');
          },
          filename: function (req, file, cb) {
              // cb(null,new Date().valueOf() + '_' + file.originalname);
              cb(null, file.originalname);
          }
      }
  ), 
});

// Image Get Routes
app.get('/facial-senti-api/image/:filename', (req, res) => {
  const { filename } = req.params;
  const dirname = path.resolve();
  const fullfilepath = path.join(dirname, 'images/' + filename);
  return res.sendFile(fullfilepath);
});

// Image Upload Routes
app.post('/facial-senti-api/image', imageUpload.single('image'), (req, res) => { 
  console.log(req.file);
  res.json('/image api'); 
});


// Schedule tasks to be run on the server.
cron.schedule("30 11 * * *", function () {
  // runs 11:30 am every day
  console.log("running a cron task");
  try {
    processDaySentiment();
  } catch (err) {
    console.error(err.message);
  }
});

// processDaySentiment();
// sendMoreThan50PercentNotHappyMailMain();

// Schedule tasks to be run on the server.
cron.schedule("30 18 * * *", function () {
  // runs 6:30 pm every day
  console.log("running a cron task");
  try {
    sendMoreThan50PercentNotHappyMailMain();
  } catch (err) {
    console.error(err.message);
  }
});
