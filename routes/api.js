var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var md5 = require('MD5');


/* Mysql connection parameters*/
var mysql_config = {
    hostname: "localhost",
    user: "root",
    password: "password",
    database: "studentsdb"
};


/* Create and test the mysql connection */
var connection = mysql.createConnection(mysql_config);

connection.connect(function(err) {
    if (err) {
        console.log('Error connecting to MySQL DB... ');
        return;
    }
    console.log('MySQL Connection established..');
});




/* For api routing */

/* Create Record */
router.post('/:tablename', function(req, res) {
    /* TODO: make sure email field is set or else return an error */
    data = req.body;

    var query = "insert into ?? set ?";


    var queryparams = [req.params.tablename, req.body];

    // query = mysql.format(query, queryparams);
    connection.query(query, queryparams, function(err, result) {
        if (err) {
            res.json({
                success: false,
                error: err
            });
            console.log('Error while tring to insert: ' + JSON.stringify(req.body));
        } else {

            // Return the last insert ID
            res.json({
                success: true,
                message: 'Record inserted successfully',
                ID:result.insertId
            });

        };

    });

});




/* get all Records*/
router.get('/:tablename', function(req, res) {
    var query = "select * from ??";
    var queryparams = [req.params.tablename];
    query = mysql.format(query, queryparams);
    connection.query(query, function(err, result) {
        if (err) {
            res.json({
                success: false,
                error: err
            });
        } else {
            console.log("Sent data");
            console.log(result);
            res.json(result);


        };

    });



});

/* get specific record */
router.get('/:tablename/:userid', function(req, res) {

    var query = "select * from ?? where id = ?";

    var queryparams = [req.params.tablename, req.params.userid];

    query = mysql.format(query, queryparams);
    connection.query(query, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);

        };

    });
});


/* Delete specific Record  */
router.delete('/:tablename/:id', function(req, res) {
    var id = parseInt(req.params.id);
    var query = "delete from ?? where id=?";
    var queryparams = [req.params.tablename, id];
    query = mysql.format(query, queryparams);
    connection.query(query, function(err, result) {
        if (err) {

            res.json(err);
            console.log('Tried to execute Query: ' + query + '\n' + err);

        } else {
            res.json({
                success: true,
                message: 'Record Deleted successfully'
            });

        };

    });

});


/* Record Updation */
router.put('/:tablename/:id', function(req, res) {
    var userid = parseInt(req.params.id);
    var query = "update ?? set ? where ?";

    delete req.body.Timestamp;
    delete req.body.editMode;

    var queryparams = [req.params.tablename, req.body, {
        id: userid
    }];
    connection.query(query, queryparams, function(err, result) {
        if (err) {
            res.json(err);
            console.log('Tried to execute Query: ' + query + '\n' + err);
        } else {
            res.json({
                success: true,
                message: 'Record Updated successfully'
            });

        };

    });

});


/* This line needs to be at the end */
module.exports = router;