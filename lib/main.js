var https = require('https');

/**
 * @param {{api_key: string, host: string, port: number}} options A set of options
 * @constructor
 */
var DucksboardNode = function(options) {
  options = options || {};
  this._host = options.host || 'push.ducksboard.com';
  this._pullHost = options.host || 'pull.ducksboard.com';
  this._port = options.port || 443;
  this._api_key = options.api_key;
  if (!this._api_key) {
    throw 'api_key required';
  }

  this.https = https;
};

/**
 * Performs a request
 * @private
 * @param {string} method The HTTP method (PUT, DELETE).
 * @param {Object} value The value to be pushed.
 * @param {string} widgetId The id of the widget.
 * @param {function(string)=} callback A callback function that receives null if there is no error.
 * @return {DucksboardNode} A reference to the same DucksboardNode instance.
 */
DucksboardNode.prototype._request = function(method, value, widgetId, callback) {
//  if (!widgetId) {
//    throw 'Must specify widgetId';
//  }

  var body = value ? JSON.stringify(value) : '';

  var headers = {
    'Content-Length': body.length
  };

  if (method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  var options = {
    host: this._host,
    port: this._port,
    path: '/values/' + widgetId,
    method: method,
    auth: this._api_key + ':x',
    headers: headers
  };

  var req = this.https.request(options, function(res) {
    if (callback) {
        callback(res.statusCode !== 200 ? res.statusCode : null);
    }
  });

  console.log( "POSTING to " + options.path + ":", body);

  req.write(body);
  req.end();

  return this;
};

/**
 * Pushes a value
 * @private
 * @param {Object} value The value to push.
 * @param {string} widgetId The id of the widget.
 * @param {function(string)=} callback A callback function that receives null if there is no error.
 * @return {DucksboardNode} A reference to the same DucksboardNode instance.
 */
DucksboardNode.prototype._push = function(value, widgetId, callback) {
  return this._request('POST', value, widgetId, callback);
};

/**
 * pulls a value
 * @private
 * @param {Object} value The value to push.
 * @param {string} widgetId The id of the widget.
 * @param {function(string)=} callback A callback function that receives null if there is no error.
 * @return {DucksboardNode} A reference to the same DucksboardNode instance.
 */
DucksboardNode.prototype._pull = function(urlPartWithGetParams, widgetId, callback) {

    var options = {
        host: this._pullHost,
        port: this._port,
        path: '/values/' + widgetId + urlPartWithGetParams,
        method: "GET",
        auth: this._api_key + ':x'
    };

    this.https.get(options, function(res) {
        var str='';
        res.on('data', function(chunk) {
            str += chunk;
        });
        res.on('end', function() {
            if (callback) {
                console.log(str);  // TODO there is a bug here...
                callback(str);
            }
        });
    });

    return this;
};

/**
 * Pushes a simple value
 * @param {Object} value The value to push.
 * @param {string} widgetId The id of the widget.
 * @param {function(string)=} callback A callback function that receives null if there is no error.
 * @return {DucksboardNode} A reference to the same DucksboardNode instance.
 */
DucksboardNode.prototype.pushValue = function(value, widgetId, callback) {
  return this._push({value: value}, widgetId, callback);
};

/**
 * Pushes a leaderboard
 * @param {Array} value - an array of objects with the format: {name: <name>, values: [1,2,3]},
 * @param {string} widgetId The id of the widget.
 * @param {number} limit will only push the first "limit" elements help prevent 400/413 errors when you have too much data.
 * @param {function(string)=} callback A callback function that receives null if there is no error.
 * @return {DucksboardNode} A reference to the same DucksboardNode instance.
 */
DucksboardNode.prototype.pushBoard = function(value, widgetId, limit, callback) {
    var pushValue = { value: { board: value } };
    if( typeof(limit) === 'function' ) {
        callback = limit;
        limit = undefined;
    }
    if( limit ) {
        pushValue.value.board = pushValue.value.board.slice(0,limit);
    }
    return this._push(pushValue, widgetId, callback);
};

/**
 * Pushes a delta value
 * @param {number} delta The delta to push.
 * @param {string} widgetId The id of the widget.
 * @param {function(string)=} callback A callback function that receives null if there is no error.
 * @return {DucksboardNode} A reference to the same DucksboardNode instance.
 */
DucksboardNode.prototype.pushDelta = function(delta, widgetId, callback) {
  return this._push({delta: delta}, widgetId, callback);
};

/**
 * Pushes a value with a timestamp
 * @param {Object} value The value to push.
 * @param {number} timestamp The timestamp to push.
 * @param {string} widgetId The id of the widget.
 * @param {function(string)=} callback A callback function that receives null if there is no error.
 * @return {DucksboardNode} A reference to the same DucksboardNode instance.
 */
DucksboardNode.prototype.pushValueWithTimestamp = function(value, timestamp, widgetId, callback) {
  return this._push({value: value, timestamp: timestamp}, widgetId, callback);
};

/**
 * Deletes all data for a widget.
 * @param {string} widgetId The Id of the widget.
 * @param {function(string)=} callback A callback function that receives null if there is no error.
 * @see http://dev.ducksboard.com/apidoc/push-api/#delete-values-label
 * @return {DucksboardNode} A reference to the same DucksboardNode instance.
 */
DucksboardNode.prototype.deleteValues = function(widgetId, callback) {
  return this._request('DELETE', null, widgetId, callback);
};


/**
 * Get the last count values for a given data source, ordered by their timestamp, newest data first.
 * GET /values/:label/last?count=:count
 * @param count
 * @param widgetId
 * @param callback - ex {"count": 1, "data": [{"timestamp": 1408099806.147, "value": 10294.0}]}
 * @returns {DucksboardNode}
 */
DucksboardNode.prototype.getLast = function(count, widgetId, callback) {
    return this._pull("/last?count=" + count, widgetId, callback);
};

DucksboardNode.prototype.getSince = function(seconds, widgetId, callback) {
    return this._pull("/since?seconds=" + seconds, widgetId, callback);
};

DucksboardNode.prototype.getLastValue = function(count, widgetId, callback) {
    return this._pull("/last?count=1" , widgetId, function(result) {
//        if( err ) {
//            callback(err);
//        } else {
//            console.log(result);
         //  if( result.data && result.data.length >= count ) {
//                callback(result.data[0].value);
//           }
//           else {
//               callback(null,null);
//           }
//        }
    });
};

/**
 * Get the last value for a series of periods for a given data source.
 *
 * @param timespan - daily, weekly, monthly, yearly
 * @param timezone - use 'UTC' or see http://dev.ducksboard.com/apidoc/backgrounds-timezones-countries/#backgrounds-timezones-countries
 * @param widgetId
 * @param callback
 * @returns {DucksboardNode}
 */
DucksboardNode.prototype.getLastTimespan = function(timespan, timezone, widgetId, callback ) {
    return this._pull("/timespan?timespan=" + timespan + "&timezone=" + timezone, widgetId, callback);
};

DucksboardNode.prototype.pushErrorToTimeline = function(title, content, widgetId, callback) {
    // Permission for CDN here: https://getsatisfaction.com/iconfinder/topics/direct_linking_to_icons_from_iconfinder
    var data = {
        value: {
            title: title,
            content: content,
            image: "https://cdn1.iconfinder.com/data/icons/Hand_Drawn_Web_Icon_Set/128/bullet_error.png"
        }
    };
    return this._push(data, widgetId, callback);
};

/*
{
    "value": {
    "title": "error message",
        "image": "http://assets.example.org/error.png",
        "content": "All system stop!",
        "link": "http://monitoring.example.org/incident/354"
}
*/


module.exports = DucksboardNode;
