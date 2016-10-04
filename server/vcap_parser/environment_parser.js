"use strict";
var config = require('../config/node_starter_kit_config');
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv('VCAP_SERVICES');

/**
 * Parse VCAP services objects, based on service type
 * @return db details as returnObject
 */

module.exports.getEnv = function () {
    var returnObject = {};
    var service_name = config.service_name;
    var creds;
    if (service_name)
        creds = appEnv.getServiceCreds(config.service_name);

    if (creds)
        return  {
                    host: creds.hostname,
                    user: creds.username,
                    password: creds.password,
                    port: creds.port,
                    database: creds.name
                };


};

