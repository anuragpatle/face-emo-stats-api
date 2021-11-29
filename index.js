var express = require("express");
const mysql = require('mysql2');
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

app.get("/",(req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * from emp_details LIMIT 1', (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
        });
    });
});

app.post('/facial-senti-api/raw_sentiments', (req, res)=>{
    insertIntoEmpEmotions(req.body);
    res.sendStatus(200);
})

// Insert new emp
app.post('/facial-senti-api/add_emp', (req, res) =>{
    insertIntoEmp(req.body);
    res.sendStatus(200);
})

app.get('/facial-senti-api/get_emotion_records/', (req, res) => {
    pageIndex = parseInt(req.query.page_index);
    pageSize = parseInt(req.query.page_size)
    selectEmpEmotions(pageIndex, pageSize, res);
})

function insertIntoEmp(data) {
    let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    
    let query = mysql.format(insertQuery,["emp_details",
    "emp_id", "emp_name",
    data.emp_id, data.emp_name]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows added
        console.log(response.insertId);
    });
}

function insertIntoEmpEmotions(data) {
    let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    
    let query = mysql.format(insertQuery,["emp_emotions",
    "emp_id", "angry", "fear", "happy", "neutral", "sad", "surprised","date", "time", "overall_sentiment", "day_overall_emotion_processed_status",
    data.emp_id, data.emotion_scores.Angry, data.emotion_scores.Fear, data.emotion_scores.Happy, data.emotion_scores.Neutral, data.emotion_scores.Sad, data.emotion_scores.Surprised, data.date, data.time, data.overall_sentiment, "TO_BE_DONE"]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows added
        console.log(response.insertId);
    });
}

function selectEmpEmotions(pageIndex, pageSize, res) {

    rowStartIndex = pageIndex * pageSize;

    // let selectQuery = 'SELECT * FROM ?? where ?? >= ? and ?? <=?';
    let selectQuery = "SELECT * FROM ?? order by ?? desc limit ?,?";
    let query = mysql.format(selectQuery, ["emp_emotions", "id",  pageIndex, pageSize]);
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

function addRow(data) {
    let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    let query = mysql.format(insertQuery,["todo","user","notes",data.user,data.value]);
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

