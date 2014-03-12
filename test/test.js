var assert = require('assert');
var sinon = require('sinon');

var DucksboardNode = require('../lib/main');

describe('Push', function() {

  describe('init', function() {

    var options = {api_key: ''};

    it('should require api_key', function(done) {
      assert.throws(function() {
        var dn = new DucksboardNode(options);
      });
      done();
    });
  });

  describe('happy cases', function() {
    var options = {
      api_key: 'an_example_of_key_not_valid' //this is an example. not a valid key
    };

    var dn = new DucksboardNode(options);

    before(function(){
      sinon.stub(dn.https, 'request', function(options, callback) {
        callback({statusCode: 200});
        return {
          write: function() {},
          end: function() {}
        };
      });
    });

    after(function(){
      dn.https.request.restore();
    });

    it('should push with api_key (no callback)', function(done) {
      dn.pushValue('widget', 3);
      done();
    });

    it('should push value with successful callback', function(done) {
      dn.pushValue(3, 'widget', function(err) {
        assert.ok(!err);
        done();
      });
    });

    it('should push delta value with successful callback', function(done) {
      dn.pushDelta(3, 'widget', function(err) {
        assert.ok(!err);
        done();
      });
    });

    it('should push value with timestamp with successful callback', function(done) {
      dn.pushValueWithTimestamp(3, +new Date(), 'widget', function(err) {
        assert.ok(!err);
        done();
      });
    });
  });

  describe('error cases', function() {
    var options = {
      api_key: 'an_example_of_key_not_valid' //this is an example. not a valid key
    };

    var dn = new DucksboardNode(options);

    before(function(){
      sinon.stub(dn.https, 'request', function(options, callback) {
        callback({statusCode: 401});
        return {
          write: function() {},
          end: function() {}
        };
      });
    });

    after(function(){
      dn.https.request.restore();
    });

    it('should throw an error if no widget is provided with callback', function(done) {
      assert.throws(function() {
        dn.pushValue(3, null, function(err) {});
      });
      done();
    });

    it('should throw an error if no widget is provided without callback', function(done) {
      assert.throws(function() {
        dn.pushValue(3);
      });
      done();
    });

    it('should push value with error callback (bad request)', function(done) {
      dn.pushValue(3, 'widget', function(err) {
        assert.equal(401, err);
        done();
      });
    });

    it('should push delta value with error callback (bad request)', function(done) {
      dn.pushDelta(3, 'widget', function(err) {
        assert.equal(401, err);
        done();
      });
    });

    it('should push value with timestamp with error callback (bad request)', function(done) {
      dn.pushValueWithTimestamp(3, +new Date(), 'widget', function(err) {
        assert.equal(401, err);
        done();
      });
    });
  });

});

describe('Delete', function() {

  var options = {
    api_key: 'an_example_of_key_not_valid' //this is an example. not a valid key
  };

  describe('happy cases', function() {

    var dn = new DucksboardNode(options);

    before(function(){
      sinon.stub(dn.https, 'request', function(options, callback) {
        callback({statusCode: 200});
        return {
          write: function() {},
          end: function() {}
        };
      });
    });

    after(function(){
      dn.https.request.restore();
    });

    it('should delete values with successful callback', function(done) {
      dn.deleteValues('widget', function(err) {
        assert.ok(!err);
        done();
      });
    });
  });

  describe('error cases', function() {

    var dn = new DucksboardNode(options);

    before(function(){
      sinon.stub(dn.https, 'request', function(options, callback) {
        callback({statusCode: 401});
        return {
          write: function() {},
          end: function() {}
        };
      });
    });

    after(function(){
      dn.https.request.restore();
    });

    it('should delete values with error callback (bad request)', function(done) {
      dn.deleteValues('widget', function(err) {
        assert.equal(401, err);
        done();
      });
    });
  });
});
