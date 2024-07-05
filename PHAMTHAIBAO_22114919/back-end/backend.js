var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');
var mysql = require('mysql'); //npm install mysql
var app = express();
app.use(cors());
app.use(bodyParser.json());

var con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "123",
    insecureAuth : true,    
    database: "csdl_iot"
});

con.connect(function(err) {
    if (err) {
        console.error('Lỗi khi kết nối cơ sở dữ liệu:', err);
    } else {
        console.log('Kết nối cơ sở dữ liệu thành công');
    }
});

app.get('/nhietdo', function (req, res) {
    var sql = "SELECT * FROM tbl_status ORDER BY id DESC LIMIT 1"; 
    con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
});
})

app.post('/add', (req, res) => {
    const {id,buocsong } = req.body;
    var sql = "INSERT INTO tbl_status  (id,buocsong ) VALUES (?,?)";
    con.query(sql, [id,buocsong], function(err, results) {
     if (err) throw err;
     
        var sqlGetTemperature = "Select * from tbl_status"
        con.query(sqlGetTemperature,function(err,tbl_status){
            if(err) throw err;
            res.send(tbl_status);
        })
    });
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server is listening at http://%s:%s", host, port)
})

