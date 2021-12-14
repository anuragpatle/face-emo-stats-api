var express = require("express");
const mysql = require('mysql2');
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


async function processDaySentiment() {
    const connection = await database.connection();
    let sentiments = [ ]
    let selectUnporcessedRowsQuery = "select distinct date, emp_id from face_emotion_stats.emp_emotions where day_overall_emotion_processed_status = 'TO_BE_DONE'";
    let mSelectUnporcessedRowsQuery = mysql.format(selectUnporcessedRowsQuery);
    console.log("unprocessed query: " + mSelectUnporcessedRowsQuery);
    await connection.query(mSelectUnporcessedRowsQuery, (err, results, fields) => {
        if (err) {
           console.error(err);
           return;  
        }
        Object.keys(results).forEach(function(key) {
            var row = results[key];
            const emoDateArr = (row.date + "").split(" ", 4); // E.g. row.date = Wed Dec 01 2021 00:00:00 GMT+0000 (Coordinated Universal Time)
            const dateObj = new Date(emoDateArr[1] + " " + emoDateArr[2] + " " + emoDateArr[3]) // Dec 07 2021
            const emoDateStr =  dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
            console.log("start")

            let daySentimentObj = new EmployeeDayEmotion();
            sentiments.push(daySentimentObj);
            daySentimentObj.setDate(emoDateStr);
            daySentimentObj.setEmpId(row.emp_id);

           
            getSentiment(row.emp_id, emoDateStr, "ENTERING", daySentimentObj);
            getSentiment(row.emp_id, emoDateStr, "EXITING", daySentimentObj);
            console.log("end")
        });
    });

    console.log("arr: " + sentiments)
}

async function processDaySentiment2() {
    const connection = await database.connection();
    let sentiments = [ ]
    let selectUnporcessedRowsQuery = "select distinct date, emp_id from face_emotion_stats.emp_emotions where day_overall_emotion_processed_status = 'TO_BE_DONE'";
    let mSelectUnporcessedRowsQuery = mysql.format(selectUnporcessedRowsQuery);
    console.log("unprocessed query: " + mSelectUnporcessedRowsQuery);
    console.log("start")

    await connection.query(mSelectUnporcessedRowsQuery).then(results => {
        Object.keys(results).forEach(function(key) {
            var row = results[key];
            const emoDateArr = (row.date + "").split(" ", 4); // E.g. row.date = Wed Dec 01 2021 00:00:00 GMT+0000 (Coordinated Universal Time)
            const dateObj = new Date(emoDateArr[1] + " " + emoDateArr[2] + " " + emoDateArr[3]) // Dec 07 2021
            const emoDateStr =  dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();

            let daySentimentObj = new EmployeeDayEmotion();
            
            daySentimentObj.setDate(emoDateStr);
            daySentimentObj.setEmpId(row.emp_id);

            sentiments.push({
                "id": row.emp_id,
                "obj": daySentimentObj
            });

            getSentiment(row.emp_id, emoDateStr, "ENTERING", daySentimentObj, connection).then(result => {
                // var result = sentiments.map(sentiment => ({ value: sentiment.id, text: sentiment.obj }));
                console.log("result: " + result)
            });
            getSentiment(row.emp_id, emoDateStr, "EXITING", daySentimentObj, connection);
        });
    });

  



}

// Get Intime Sentiment or OutTime Sentiment
function getSentiment(emp_id, date, empExitingOrEntering, daySentimentObj, connection) {
 
    return new Promise((resolve, reject) => {
        let orderBy = 'desc';
        let overallSentiment;
    
        if (empExitingOrEntering === "ENTERING") {
            orderBy = 'asc';
        }

        let inTimeSentimentQuery =  mysql.format("select overall_sentiment from (select * from face_emotion_stats.emp_emotions \
            where emp_id = " + emp_id + " and date = '" + date + "') as t1 order by time "+ orderBy +" limit 1");

        console.log("In/Out time emo query: " + inTimeSentimentQuery);

        connection.query(inTimeSentimentQuery, (err, data) => {
            if(err) {
                console.error(err);
                return;
            }
            // rows fetch
            overallSentiment = data[0].overall_sentiment;
            if (empExitingOrEntering === "ENTERING") {
                daySentimentObj.setInTimeEmotion(overallSentiment);
            } else {
                daySentimentObj.setOutTimeEmotion(overallSentiment);
            }
        });
    });

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
try {
    processDaySentiment2();
  } catch (err) {
    console.error(err.message)
}