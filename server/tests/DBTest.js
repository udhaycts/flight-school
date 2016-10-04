/*
 This file contains the test cases in order to test the working of CRUD operations in To do database
 */

// Module dependencies
var chai = require('chai');
var mysql = require("mysql");
var nodeStarterConfig = require('../vcap_parser/environment_parser.js');
var env = nodeStarterConfig.getEnv();
var connection = mysql.createConnection(env);
var should = chai.should();

var todoID;
/**
 * Test Suites
 */
describe('<Unit Test>', function() {

    describe('Method Insert', function () {
        it('should be able to Insert without problems', function (done) {

            var insertQuery = 'INSERT INTO ToDo SET task_name = ?';
            connection.query(insertQuery, {'task_name': 'task 1'}, function(err, res) {
                res.should.have.property('insertId');
                todoID = res.insertId;
                done();
            });
        });
    });

    describe('Method Update', function () {
        it('should be able to Update without problems', function (done) {

            var updateQuery = 'UPDATE ToDo SET task_name = ? WHERE _id = ?';
            connection.query(updateQuery, ['task 2', todoID], function(err, res) {
                res.should.have.property('affectedRows',1);
                done();
            });
        });
    });

    describe('Method Get All', function () {
        it('should be able to Get All tasks without any problem', function (done) {

            var getAllQuery = 'SELECT * FROM ToDo';
            connection.query(getAllQuery, null, function(err, res) {
                res.should.have.length.above(0);
                done();
            });
        });
    });

    describe('Method Delete', function () {
        it('should be able to delete without problems', function (done) {

            var deleteQuery = 'DELETE FROM ToDo WHERE _id = ?';
            connection.query(deleteQuery, todoID, function(err, res) {
                res.should.have.property('affectedRows',1);
                done();
            });
        });
    });
});
