const express = require('express');
const mysql = require('mysql');
const funcs = require('./functions');

const app = express();
const PORT = 9103;

// pooling the connections
var pool = mysql.createPool({
  user: "root",
  password: "qet333957410",
  connectionLimit : 10,
  host: "localhost",
  database: "diode"
});

app.use( express.json());

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/PassesPerStation/:stationID/:date_from/:date_to',
         (req, res) => {

  const { stationID } = req.params;
  const { date_from } = req.params;
  const { date_to } = req.params;   
  const datetimeNow = funcs.getRequestTimestamp();
  
  // define query
  const query = `SELECT 
                  s.op_name AS StationOperator,
                  COUNT(s.st_name) AS NumberOfPasses
                FROM
                  stations s
                INNER JOIN passes p ON s.st_id = p.station_id
                WHERE (pass_timestamp 
                       BETWEEN "${date_from}" AND "${date_to}")
                         AND s.st_id =  "${stationID}";`;

  
  pool.getConnection((err, connection) => {
        if(err) throw err;
        connection.query(query, (err, result, fields) => {
            connection.release(); // return the connection to pool
            if(err) throw err;
            res.status(200).send({        
                Station : `${stationID}`,
                StationOperator : `${result[0].StationOperator}` ,
                RequestTimestamp : `${datetimeNow}`,
                PeriodFrom : `${date_from}` ,
                PeriodTo : `${date_to}`,
                NumberOfPasses : `${result[0].NumberOfPasses}`
                // Passes List not Added Yet
                // ti akrivws tha exei ayti i lista???  
              })         
        });
    });
});