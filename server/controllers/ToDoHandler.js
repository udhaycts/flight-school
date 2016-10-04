/*
 * This files Handles all the business logic fr toDO app.
 * */

var ToDoDbHandler = require('./DBHandler');

// Constants Messages
var TASK_MESSAGE = 'Task name must not be empty';
var DELETE_MESSAGE = 'Deleted Successfully';
var TASK_ID_MESSAGE = 'Task ID is not valid';

/**
 * Create DB Connection
 * @param {cb} callback function contains err if connection failed.
 * */
ToDoDbHandler.initDataBase(function (err) {
    if (!err) {
        logger.log('info', 'Connected to DB ...');
        var createTableQuery  =  'CREATE TABLE IF NOT EXISTS  ToDo (_id MEDIUMINT NOT NULL AUTO_INCREMENT,task_name CHAR(30) NOT NULL,PRIMARY KEY (_id))';
        ToDoDbHandler.executeQuery (createTableQuery, null, function (error, data) {
            if(!error)
                logger.log('info', 'Table created');
        });

    }
});



/**
 *  Create a ToDo task
 * @param {req} request from server which contains task_name
 * @param {res} response instance to send the response
 */
function create (req, res) {
    if(req.body.task_name) {

        var insertQuery = 'INSERT INTO ToDo SET task_name = ?';

        ToDoDbHandler.executeQuery(insertQuery, req.body.task_name, function(err, data){

            if(!err)
            {
                getDocument(data.insertId, res);

            }
            else
            {
                responseHandler(res, false, err);
            }

        });
    }
    else {

        responseHandler(res, false, TASK_MESSAGE);
    }

}

/**
 *  Update ToDo task
 * @param {req} request from server which contains task_name
 * @param {res} response instance to send the response
 */
function update (req, res) {
    if(req.body.task_name) {

        var updateQuery = 'UPDATE ToDo SET task_name = ? WHERE _id = ?';

        ToDoDbHandler.executeQuery(updateQuery, [req.body.task_name, req.params._id], function(err, data){
            if(!err)
            {
                if(data.affectedRows === 0)
                    responseHandler(res, false, TASK_ID_MESSAGE);
                else
                    getDocument(req.params._id, res);
            }
            else
            {
                responseHandler(res, false, err);
            }

        });
    }
    else {
        responseHandler(res, false, TASK_MESSAGE);
    }
}

/**
 *  List of ToDo's
 * @param {req} request from server
 * @param {res} response instance to send the response
 */
function all (req, res) {
    logger.log("info","GET request received ");
    var getAllQuery = 'SELECT * FROM ToDo';

    ToDoDbHandler.executeQuery(getAllQuery, null, function(err, data){
        if(!err)
        {
            responseHandler(res, true, data);
        }
        else
        {
            responseHandler(res, false, err);
        }

    });
}

/**
 *  Delete a ToDo
 * @param {req} request from server
 * @param {res} response instance to send the response
 */
function remove (req, res) {
    var deleteQuery = 'DELETE FROM ToDo WHERE _id = ?';

    ToDoDbHandler.executeQuery(deleteQuery, req.params._id, function(err, data){
        if(!err)
        {
            if(data.affectedRows === 0)
                responseHandler(res, false, TASK_ID_MESSAGE);
            else
                responseHandler(res, true, DELETE_MESSAGE);
        }
        else
        {
            responseHandler(res, false, err);
        }

    });

}


/**
 *  GET last inserted or updated row
 * @param {insertedID} last inserted id
 * @param {res} response instance to send the response
 */
function getDocument (insertedID, res) {

    var getQuery = 'SELECT * FROM ToDo WHERE _id = ?';
    ToDoDbHandler.executeQuery(getQuery, insertedID, function(err, data) {

        if(!err) {
            responseHandler(res, true, data[0]);
        }
        else {
            responseHandler(res, false, data);
        }

    });

}


/**
 * Response Handler
 * @param response - Object through which response is sent
 * @param status - Boolean status of the process
 * @param data - contains the error or data information to be returned
 * The response handler will send the data in json format according to the status.
 */
function responseHandler(response, status, data)
{

    if(status){
        logger.log("info","Response ", +data);
        return response.status(200).json({
            status: "Success",
            data: data
        });
    }
    else
    {
        logger.log("error","Error :"+data);
        return response.status(500).json({
            status: "Error",
            data: data
        });
    }
}


exports.create = create;
exports.update = update;
exports.all = all;
exports.remove = remove;