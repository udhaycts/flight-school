/*
 * This files creates DB Connection and perform all the DB Crud Operations.
 * */

var mySQLObj = require("mysql");

var nodeStarterConfig = require('../vcap_parser/environment_parser.js');

var connection;

/**
 * Create DB Connection
 * @param {callBack} callback function contains err if connection failed.
 * */
function initDataBase(callBack) {

    // Get the DB Configuration from environment_parser.js and create connection to the database.
    var env = nodeStarterConfig.getEnv();
    connection = mySQLObj.createConnection(env);

    connection.connect(function(err) {
        if (err) {
            if(callBack)
                callBack(err);
            return;
        }
        else
        {
        if (callBack)
            callBack(null);
        }
    });

    // Connection to the MySQL server is usually lost due to either server restart, or a connnection idle timeout (the wait_timeout server variable configures this)
    connection.on('error', function(err) {
        logger.log('info', 'db error '+err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            initDataBase(null);
        } else {
            throw err;
        }
        if(callBack)
            callBack(null);
    });
}

/**
 * Execute the query and return the data in callBack
 * @param {query} query string to execute DB.
 * @param {params} params Array contains attribute values.
 * @param {callBack} function contains err  and data.
 * */
function executeQuery (query, params, callBack) {

    if(params)
    {
        connection.query(query, params, function(err,data) {
            callBack(err,data);

        });

    }
    else
    {
        connection.query(query, function(err,data) {
            callBack(err,data);

        });
    }

}


exports.initDataBase = initDataBase;
exports.executeQuery = executeQuery;