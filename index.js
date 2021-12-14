var express = require("express");
const mysql = require('mysql2');
const cron = require('node-cron');
var EmployeeDayEmotion = require('./EmployeeDayEmotion.js');
var database = require('./database.js');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

const route = require('./router');
const { response } = require("express");

app.listen(5000, () => {
 console.log("Server running on port 5000");
});


const pool = mysql.createPool({
    connectionLimit : 100, //important
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'face_emotion_stats',
    debug    :  false
});



app.post('/facial-senti-api/raw_sentiments', (req, res) => {
    insertIntoEmpEmotions(req.body, res);
})

// Insert new emp
app.post('/facial-senti-api/add_emp', (req, res) =>{
    insertIntoEmp(req.body, res);
    // res.sendStatus(200);
})

app.get('/facial-senti-api/get_emotion_records/', (req, res) => {
    pageIndex = parseInt(req.query.page_index);
    pageSize = parseInt(req.query.page_size)
    selectEmpEmotions(pageIndex, pageSize, res);
})

app.get('/facial-senti-api/get_all_employees/', (req, res) => {
    selectEmployees(res);
})

app.get('/facial-senti-api/emp_overall_day_deperience/', (req, res) => {
    pageIndex = parseInt(req.query.page_index);
    pageSize = parseInt(req.query.page_size)
    selectOverallDayExperience(pageIndex, pageSize, res);
})

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

    let selectQuery = "SELECT t1.id, t2.emp_id, t2.emp_name, t1.date, t1.first_captured_setiment, t1.last_captured_setiment, t1.overall_day_experience, t1.number_of_times_this_person_appeared, t1.emotion_this_person_made_most FROM `face_emotion_stats`.`emp_details` AS t2  INNER JOIN `face_emotion_stats`.`emp_overall_experience_for_a_day` AS t1  ON t2.emp_id = t1.emp_id order by t1.id DESC LIMIT ?,?";

    // let selectQuery = "SELECT * FROM ?? AS t1 INNER JOIN ?? AS t2 INNER JOIN ?? AS t3 ON t2.emp_id = t1.emp_id and t3.device_id = t2.device_id order by t2.id DESC LIMIT ?,?";
    let query = mysql.format(selectQuery, [pageIndex, pageSize]);
    console.log("query: " + query)
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            res.status(500).send({ error: "Internal server error" });
            return;
        }
        // rows added
        res.json(data);
    });
}


function insertIntoEmp(data, res) {
    let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    
    let query = mysql.format(insertQuery,["emp_details",
    "emp_id", "emp_name",
    data.emp_id, data.emp_name]);
    pool.query(query, (err, response) => {
        if(err) {
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
    let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    
    let query = mysql.format(insertQuery,["emp_emotions",
    "emp_id", "angry", "fear", "happy", "neutral", "sad", "surprised","date", "time", "overall_sentiment", "day_overall_emotion_processed_status", "device_id",
    data.emp_id, data.emotion_scores.Angry, data.emotion_scores.Fear, data.emotion_scores.Happy, data.emotion_scores.Neutral, data.emotion_scores.Sad, data.emotion_scores.Surprised, data.date, data.time, data.overall_sentiment, "TO_BE_DONE", data.device_id]);
    pool.query(query,(err, response) => {
        if(err) {
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

    let selectQuery = "SELECT * FROM ?? AS t1 INNER JOIN ?? AS t2 INNER JOIN ?? AS t3 ON t2.emp_id = t1.emp_id and t3.device_id = t2.device_id order by t2.id DESC LIMIT ?,?";
    let query = mysql.format(selectQuery, ["emp_details", "emp_emotions", "iot_device_details", pageIndex, pageSize]);
    console.log("query: " + query)
    pool.query(query,(err, data) => {
        if(err) {
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
    console.log("query: " + query)
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows fetch
        // console.log(data);
        res.json(data);
    });
}


// async function processDaySentiment2() {

//     const connection = await database.connection();
//     let sentiments=[];

//     return new Promise(async function(resolve, reject) {
//         let selectUnporcessedRowsQuery = "select distinct date, emp_id from face_emotion_stats.emp_emotions where day_overall_emotion_processed_status = 'TO_BE_DONE' and date < curdate()";
//         let mSelectUnporcessedRowsQuery = mysql.format(selectUnporcessedRowsQuery);
//         console.log("unprocessed query: " + mSelectUnporcessedRowsQuery);
              
//         let results = await connection.query(mSelectUnporcessedRowsQuery);

//         Object.keys(results).forEach(async function(key) {
//             var row = results[key];
//             const emoDateArr = (row.date + "").split(" ", 4); // E.g. row.date = Wed Dec 01 2021 00:00:00 GMT+0000 (Coordinated Universal Time)
//             const dateObj = new Date(emoDateArr[1] + " " + emoDateArr[2] + " " + emoDateArr[3]) // Dec 07 2021
//             const emoDateStr =  dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
            
//             let daySentimentObj = new EmployeeDayEmotion();
            
//             daySentimentObj.setDate(emoDateStr);
//             daySentimentObj.setEmpId(row.emp_id);
//             let numberOfTimesAPersonAppearedObj = await getNumberOfTimesAPersonAppeared(daySentimentObj, connection);
//             let numberOfTimesAPersonAppeared = numberOfTimesAPersonAppearedObj[0].cnt;

//             if (numberOfTimesAPersonAppeared < 2) {
//                 console.log("A%%"+ row.emp_id)
//                 console.log("A%%numberOfTimesAPersonAppeared"+ numberOfTimesAPersonAppeared);
//                 return false; // break
//             } else {
//                 console.log("else A%%numberOfTimesAPersonAppeared"+ numberOfTimesAPersonAppeared);
//                 console.log("else A%%"+ row.emp_id)

//             }

//             daySentimentObj.setNumberOfTimesAPersonAppeared(numberOfTimesAPersonAppeared);
            
//             // sentimentsMap.set(row.emp_id, daySentimentObj);
            
//             try {
//                 let inObj = await getSentiment(row.emp_id, emoDateStr, "ENTERING", daySentimentObj, connection);
                
//                 let outObj = await getSentiment(row.emp_id, emoDateStr, "EXITING", daySentimentObj, connection);
//                 daySentimentObj.setInTimeEmotion(inObj);
//                 daySentimentObj.setOutTimeEmotion(outObj);
//                 sentiments.push(daySentimentObj);
//                 console.log("inObj: " + daySentimentObj.inTimeEmotion);
                

//                 if ((inObj === "LIKELY_HAPPY" || inObj === "likely_happy") && (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")) {
//                     daySentimentObj.setOverallDayEmotion("POSITIVE");
//                 } else if ((inObj === "LIKELY_HAPPY" || inObj === "likely_happy") && (outObj === "LIKELY_NOT_HAPPY" || outObj === "likely_not_happy")) {
//                     daySentimentObj.setOverallDayEmotion("NEGATIVE");
//                 } else if ((inObj === "LIKELY_HAPPY" || inObj === "likely_happy") && (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")) {
//                     daySentimentObj.setOverallDayEmotion("NEUTRAL");
//                 } 
                
//                 else if ((inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") && (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")) {
//                     daySentimentObj.setOverallDayEmotion("EXTRA_POSITIVE");
//                 } else if ((inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") && (outObj === "LIKELY_NOT_HAPPY" || outObj === "likely_not_happy")) {
//                     daySentimentObj.setOverallDayEmotion("NEUTRAL");
//                 }  else if ((inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") && (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")) {
//                     daySentimentObj.setOverallDayEmotion("POSITIVE");
//                 } 
                
                
//                 else if ((inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") && (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")) {
//                     daySentimentObj.setOverallDayEmotion("NEUTRAL");
//                 } else if ((inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") && (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")) {
//                     daySentimentObj.setOverallDayEmotion("POSITIVE");
//                 } else if ((inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") && (outObj === "LIKELY_NOT_HAPPY" || outObj === "likellikely_not_happy_happy")) {
//                     daySentimentObj.setOverallDayEmotion("NEGATIVE");
//                 } else {
//                     console.log("New emotion found");
//                 }

//                 let emoMost = await getEmotionAPersonMadeMost(daySentimentObj, connection);
//                 daySentimentObj.setEmotionAPersonMadeMost(emoMost[0].overall_sentiment);

//                 await insertProcessedDaySentiments(daySentimentObj, connection);
              
//                 await updateProcessedDaySentiment(daySentimentObj, connection);



//             } catch (e) {
//                 console.log("e: " + e)
//             }
            
//         });

//     });
// }


async function processDaySentiment() {

    const connection = await database.connection();
    let sentiments=[];

    try {
        let selectUnporcessedRowsQuery = "select distinct date, emp_id from face_emotion_stats.emp_emotions where day_overall_emotion_processed_status = 'TO_BE_DONE' and date < curdate()";
        let mSelectUnporcessedRowsQuery = mysql.format(selectUnporcessedRowsQuery);
                
        let results = await connection.query(mSelectUnporcessedRowsQuery);
    
        Object.keys(results).forEach(async function(key) {
            var row = results[key];
            const emoDateArr = (row.date + "").split(" ", 4); // E.g. row.date = Wed Dec 01 2021 00:00:00 GMT+0000 (Coordinated Universal Time)
            const dateObj = new Date(emoDateArr[1] + " " + emoDateArr[2] + " " + emoDateArr[3]) // Dec 07 2021
            const emoDateStr =  dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
            
            let daySentimentObj = new EmployeeDayEmotion();
            console.log("A%%"+ row.emp_id)
            daySentimentObj.setDate(emoDateStr);
            daySentimentObj.setEmpId(row.emp_id);
    
            let numberOfTimesAPersonAppearedObj = await getNumberOfTimesAPersonAppeared(daySentimentObj, connection);
            let numberOfTimesAPersonAppeared = numberOfTimesAPersonAppearedObj[0].cnt;
            console.log("B%%")
            if (numberOfTimesAPersonAppeared < 2) {
                console.log("###" + numberOfTimesAPersonAppeared);
                return true; // return true = true
                             // return false = break
            } 
    
            console.log("C%%")
            daySentimentObj.setNumberOfTimesAPersonAppeared(numberOfTimesAPersonAppeared);
            
            let inObj = await getSentiment(row.emp_id, emoDateStr, "ENTERING", daySentimentObj, connection);
            
            let outObj = await getSentiment(row.emp_id, emoDateStr, "EXITING", daySentimentObj, connection);
            daySentimentObj.setInTimeEmotion(inObj);
            daySentimentObj.setOutTimeEmotion(outObj);
            sentiments.push(daySentimentObj);
    
            if ((inObj === "LIKELY_HAPPY" || inObj === "likely_happy") && (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")) {
                daySentimentObj.setOverallDayEmotion("POSITIVE");
            } else if ((inObj === "LIKELY_HAPPY" || inObj === "likely_happy") && (outObj === "LIKELY_NOT_HAPPY" || outObj === "likely_not_happy")) {
                daySentimentObj.setOverallDayEmotion("NEGATIVE");
            } else if ((inObj === "LIKELY_HAPPY" || inObj === "likely_happy") && (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")) {
                daySentimentObj.setOverallDayEmotion("NEUTRAL");
            } 
            
            else if ((inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") && (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")) {
                daySentimentObj.setOverallDayEmotion("EXTRA_POSITIVE");
            } else if ((inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") && (outObj === "LIKELY_NOT_HAPPY" || outObj === "likely_not_happy")) {
                daySentimentObj.setOverallDayEmotion("NEUTRAL");
            }  else if ((inObj === "LIKELY_NOT_HAPPY" || inObj === "likely_not_happy") && (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")) {
                daySentimentObj.setOverallDayEmotion("POSITIVE");
            } 
            
            
            else if ((inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") && (outObj === "LIKELY_NEUTRAL" || outObj === "likely_neutral")) {
                daySentimentObj.setOverallDayEmotion("NEUTRAL");
            } else if ((inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") && (outObj === "LIKELY_HAPPY" || outObj === "likely_happy")) {
                daySentimentObj.setOverallDayEmotion("POSITIVE");
            } else if ((inObj === "LIKELY_NEUTRAL" || inObj === "likely_neutral") && (outObj === "LIKELY_NOT_HAPPY" || outObj === "likellikely_not_happy_happy")) {
                daySentimentObj.setOverallDayEmotion("NEGATIVE");
            } else {
                console.log("New emotion found");
            }
    
            let emoMost = await getEmotionAPersonMadeMost(daySentimentObj, connection);
            daySentimentObj.setEmotionAPersonMadeMost(emoMost[0].overall_sentiment);
    
            await insertProcessedDaySentiments(daySentimentObj, connection);
            
            await updateProcessedDaySentiment(daySentimentObj, connection);
    
        });
    } catch (err) {
        await connection.query("ROLLBACK");
        console.log('ROLLBACK at querySignUp', err);
        throw err;
    } finally {
        await connection.release();
    }
}

function getNumberOfTimesAPersonAppeared(daySentimentObj, connection) {
    let query = "SELECT count(*) as cnt FROM face_emotion_stats.emp_emotions where emp_id = '"+daySentimentObj.empId+"' and date =  '"+daySentimentObj.date+"'";
    return connection.query(query);
}

function getEmotionAPersonMadeMost(daySentimentObj, connection) {
   let query = "SELECT overall_sentiment, count(overall_sentiment) as cnt FROM face_emotion_stats.emp_emotions  where emp_id = '"+daySentimentObj.empId+"' and date =  '"+daySentimentObj.date+"' group by overall_sentiment order by cnt desc limit 1" 
   return connection.query(query);
}

function insertProcessedDaySentiments(daySentimentObj, connection) {
    let insertQuery = 'INSERT INTO ?? (??,??, ??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?,?)';

    let insertQueryF = mysql.format(insertQuery,["emp_overall_experience_for_a_day",
    "emp_id", "date", "first_captured_setiment", "last_captured_setiment", "overall_day_experience", "number_of_times_this_person_appeared", "emotion_this_person_made_most",
    daySentimentObj.empId, daySentimentObj.date, daySentimentObj.inTimeEmotion, daySentimentObj.outTimeEmotion, daySentimentObj.overallDayEmotion, daySentimentObj.numberOfTimesAPersonAppeared, daySentimentObj.emotionAPersonMadeMost]);

    connection.query(insertQueryF,(err, response) => {
        if(err) {
            console.error(err);
        }
        // rows added
        console.log(response.insertId);
    });
    
}

function updateProcessedDaySentiment(daySentimentObj, connection) {
    let query = "UPDATE emp_emotions SET day_overall_emotion_processed_status = 'DONE' WHERE emp_id = " + daySentimentObj.empId + " and date = '" + daySentimentObj.date + "'";
    connection.query(query,(err, response) => {
        if(err) {
            console.error(err);
        }
        // rows added
        console.log(response);
    });
}

// Get Intime Sentiment or OutTime Sentiment
async function getSentiment(emp_id, date, empExitingOrEntering, daySentimentObj, connection, callback) {

    let orderBy = 'desc';
    let overallSentiment;

    if (empExitingOrEntering === "ENTERING") {
        orderBy = 'asc';
    }

    let inTimeSentimentQuery =  mysql.format("select overall_sentiment from (select * from face_emotion_stats.emp_emotions \
        where emp_id = " + emp_id + " and date = '" + date + "') as t1 order by time "+ orderBy +" limit 1");

    // console.log("In/Out time emo query: " + inTimeSentimentQuery);

    try {
        const data = await connection.query(inTimeSentimentQuery);
        overallSentiment = data[0].overall_sentiment;
        return overallSentiment;
        console.log("data: " + data);
    }catch (e) {
        console.log("e: " + e);
    }

}

function addRow(data) {
    let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    let query = mysql.format(insertQuery,["todo","user","notes", data.user,data.value]);
    pool.query(query,(err, response) => {
        if(err) {
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


function alert(){
    console.log("some alert");
}



// console.log(intervalID._idleTimeout)


// Schedule tasks to be run on the server.
cron.schedule('30 11 * * *', function() { // runs 11:30 am every day
    console.log('running a cron task');
    try {
        processDaySentiment();
      } catch (err) {
        console.error(err.message)
    }
});