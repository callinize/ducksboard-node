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
 * Performs a request
 * @private
 * @param {string} method The HTTP method (PUT, DELETE)
 * @param {Object} value The value to be pushed
 * @param {string} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 * @return {DucksboardNode} A reference to the same DucksboardNode instance
 */
DucksboardNode.prototype._request = function (method, value, widgetId, callback) {
  if (!widgetId) {
    return callback('Must specify widgetId');
  }

  var body = value ? JSON.stringify(value) : '';

  var headers = {
    'Content-Length': body.length
  };

  if (method == 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  var options = {
    host: this._host,
    port: this._port,
    path: '/v/' + widgetId,
    method: method,
    auth: this._apiKey + ':x',
    headers: headers
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
 * Pushes a value
 * @private
 * @param {Object} value The value to push
 * @param {string} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 * @return {DucksboardNode} A reference to the same DucksboardNode instance
 */
DucksboardNode.prototype._push = function (value, widgetId, callback) {
  return this._request('POST', value, widgetId, callback);
};

/**
 * Pushes a simple value
 * @param {Object} value The value to push
 * @param {string} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 * @return {DucksboardNode} A reference to the same DucksboardNode instance
 */
DucksboardNode.prototype.pushValue = function(value, widgetId, callback) {
  return this._push({value: value}, widgetId, callback);
};

/**
 * Pushes a delta value
 * @param {number} delta The delta to push
 * @param {string} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 * @return {DucksboardNode} A reference to the same DucksboardNode instance
 */
DucksboardNode.prototype.pushDelta = function(delta, widgetId, callback) {
  return this._push({delta: delta}, widgetId, callback);
};

/**
 * Pushes a value with a timestamp
 * @param {Object} value The value to push
 * @param {number} timestamp The timestamp to push
 * @param {string} widgetId The id of the widget
 * @param {function(string)=} callback A callback function that receives null if there is no error
 * @return {DucksboardNode} A reference to the same DucksboardNode instance
 */
DucksboardNode.prototype.pushValueWithTimestamp = function(value, timestamp, widgetId, callback) {
  return this._push({value: value, timestamp: timestamp}, widgetId, callback);
};

/**
 * Deletes all data for a widget.
 * @param {string} widgetId The Id of the widget
 * @param {function(string)=} callback callback A callback function
 * @see http://dev.ducksboard.com/apidoc/push-api/#delete-values-label
 * @return {DucksboardNode} A reference to the same DucksboardNode instance
 */
DucksboardNode.prototype.deleteValues = function(widgetId, callback) {
  return this._request('DELETE', value, widgetId, callback);};

module.exports = DucksboardNode;
