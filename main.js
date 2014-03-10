var https = require('https');

/**
 * @param {{apiKey: string, host: string, port: number}} options A set of options
 * @constructor
 */
var DucksboardNode = function (options) {
  options = options || {};
  this._host = options.host || 'push.ducksboard.com';
  this._port = options.port || 443;
  this._apiKey = options.apiKey;
  if (!this._apiKey) {
    throw 'apiKey required';
  }
};

/**
 * Pushes a value
 * @private
 * @param {Object} value The value to push
 * @param {String} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 */
DucksboardNode.prototype._push = function (value, widgetId, callback) {
  if (!widgetId) {
    return callback('Must specify widgetId');
  }

  var body = JSON.stringify(value);
  var options = {
    host: this._host,
    port: this._port,
    path: '/v/' + widgetId,
    method: 'POST',
    auth: this._apiKey + ':x',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    }
  };

  var req = https.request(options, function(res) {
    if (callback) {
      callback(res.statusCode !== 200 ? res.statusCode : null);
    }
  });

  req.write(body);
  req.end();

  return this;
};

/**
 * Pushes a simple value
 * @param {Object} value The value to push
 * @param {String} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 */
DucksboardNode.prototype.pushValue = function(value, widgetId, callback) {
  return this._push({value: value}, widgetId, callback);
};

/**
 * Pushes a delta value
 * @param {number} delta The delta to push
 * @param {String} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 */
DucksboardNode.prototype.pushDelta = function(delta, widgetId, callback) {
  return this._push({delta: delta}, widgetId, callback);
};

/**
 * Pushes a value with a timestamp
 * @param {Object} value The value to push
 * @param {number} timestamp The timestamp to push
 * @param {String} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 */
DucksboardNode.prototype.pushValueWithTimestamp = function(value, timestamp, widgetId, callback) {
  return this._push({value: value, timestamp: timestamp}, widgetId, callback);
};

/**
 * Deletes all data for a widget.
 * @param {String} widgetId The Id of the widget
 * @param {function(string)=} callback callback A callback function
 * @see http://dev.ducksboard.com/apidoc/push-api/#delete-values-label
 */
DucksboardNode.prototype.deleteValues = function(widgetId, callback) {
  if (!widgetId) {
    return callback('Must specify widgetId');
  }

  var options = {
    host: this._host,
    port: this._port,
    path: '/v/' + widgetId,
    method: 'DELETE',
    auth: this._apiKey + ':x',
    headers: {
      'Content-Length': 0
    }
  };

  var req = https.request(options, function(res) {
    if (callback) {
      callback(res.statusCode !== 200 ? res.statusCode : null);
    }
  });

  req.end();

  return this;
};

module.exports = DucksboardNode;
